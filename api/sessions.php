<?php
// /api/sessions.php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: max-age=300, public'); // 5 min edge/browser cache

const IMS_URL = 'https://secretaria.transform.pt/ims/getimsxml.ashx';
const SECRETARIA = 'https://secretaria.transform.pt/secretaria/';
date_default_timezone_set('Europe/Lisbon');

$ref = isset($_GET['ref']) ? trim($_GET['ref']) : '';
if ($ref === '' || !preg_match('/^\d+$/', $ref)) {
  http_response_code(400);
  echo json_encode(['error' => 'Missing or invalid ref']);
  exit;
}

// simple file cache (10 min)
$cacheDir = __DIR__ . '/_cache';
@mkdir($cacheDir, 0775, true);
$cacheFile = $cacheDir . '/ims.xml';
$ttl = 600;

function fetchIMS(string $cacheFile, int $ttl): ?SimpleXMLElement {
  if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $ttl)) {
    $xml = @simplexml_load_file($cacheFile);
    if ($xml) return $xml;
  }
  $ctx = stream_context_create(['http' => ['timeout' => 10]]);
  $raw = @file_get_contents(IMS_URL, false, $ctx);
  if (!$raw) return null;
  file_put_contents($cacheFile, $raw);
  libxml_use_internal_errors(true);
  $xml = simplexml_load_string($raw);
  libxml_clear_errors();
  return $xml ?: null;
}

function parseDate(?string $s): ?DateTimeImmutable {
  if (!$s) return null;
  $s = trim($s);
  if (preg_match('#^(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$#', $s, $m)) {
    $hh = $m[4] ?? '09';
    $mm = $m[5] ?? '00';
    return DateTimeImmutable::createFromFormat('Y-m-d H:i', sprintf('%04d-%02d-%02d %02d:%02d', $m[3], $m[2], $m[1], $hh, $mm));
  }
  try { return new DateTimeImmutable($s); } catch(Throwable $e) { return null; }
}

function buildLinks(string $ref, ?string $idAccao): array {
  $generic = SECRETARIA . 'SecretariaCandLogin.aspx?idCaracterizacao=' . rawurlencode($ref);
  $direct  = $idAccao ? (SECRETARIA . 'SecretariaLogin.aspx?idAccao=' . rawurlencode($idAccao) . '&idCaracterizacao=' . rawurlencode($ref)) : null;
  return ['generic' => $generic, 'direct' => $direct];
}

$xml = fetchIMS($cacheFile, $ttl);
if (!$xml) {
  http_response_code(502);
  echo json_encode(['error' => 'IMS unavailable']);
  exit;
}

// Find sessions for this caracterização REF
$nodes = $xml->xpath('//*[self::Accao or self::Acao or self::Action or self::Sessao]');
$out = [];
foreach ($nodes ?: [] as $n) {
  $car = (string)($n['idCaracterizacao'] ?? $n['CaracterizacaoId'] ?? $n['REF'] ?? $n['Ref'] ?? '');
  if ($car !== $ref) continue;

  $idAccao = (string)($n['idAccao'] ?? $n['Id'] ?? $n['ID'] ?? $n['AccaoId'] ?? '');
  $start   = (string)($n->DataInicio ?? $n->Inicio ?? $n->DataInicioPrevista ?? $n->Start ?? $n->{'Data_Inicio'} ?? '');
  $end     = (string)($n->DataFim ?? $n->Fim ?? $n->DataFimPrevista ?? $n->End ?? $n->{'Data_Fim'} ?? '');
  $local   = (string)($n->Local ?? $n->Localidade ?? $n->Sede ?? $n->Location ?? '');
  $estado  = (string)($n->Estado ?? $n->Situacao ?? $n->Status ?? '');

  $startDt = parseDate($start);
  if (!$startDt) continue; // must have a date
  $endDt   = parseDate($end);

  $links = buildLinks($ref, $idAccao ?: null);
  $out[] = [
    'idAccao'   => $idAccao ?: null,
    'startISO'  => $startDt->format(DateTimeInterface::ATOM),
    'endISO'    => $endDt ? $endDt->format(DateTimeInterface::ATOM) : null,
    'location'  => $local ?: null,
    'status'    => $estado ?: null,
    'links'     => $links,
  ];
}

// future only, sort asc, cap 24
$now = new DateTimeImmutable('now');
$out = array_values(array_filter($out, fn($r) => isset($r['startISO']) && new DateTimeImmutable($r['startISO']) >= $now));
usort($out, fn($a,$b) => strcmp($a['startISO'], $b['startISO']));
$out = array_slice($out, 0, 24);

echo json_encode(['ref' => $ref, 'count' => count($out), 'sessions' => $out], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
