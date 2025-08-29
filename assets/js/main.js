/**
 * TVDE Certificação - Premium JavaScript
 * Modern ES6+ JavaScript with advanced features
 * Optimized for performance and user experience
 */

class TVDEWebsite {
  constructor() {
    this.isLoading = true;
    this.scrollPosition = 0;
    this.ticking = false;
    this.observers = new Map();
    this.resizeTimeout = null;
    
    this.init();
  }

  /**
   * Initialize the website
   */
  init() {
    this.bindEvents();
    this.initNavigation();
    this.initScrollAnimations();
    this.initParallax();
    this.initLazyLoading();
    this.initFormValidation();
    this.initPerformanceOptimizations();
    this.handlePageLoad();
  }

  /**
   * Bind all event listeners
   */
  bindEvents() {
    // Navigation events
    document.addEventListener('DOMContentLoaded', () => this.handleDOMLoaded());
    window.addEventListener('load', () => this.handleWindowLoaded());
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    window.addEventListener('resize', () => this.handleResize(), { passive: true });
    
    // Touch events for mobile
    if ('ontouchstart' in window) {
      this.initTouchEvents();
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    
    // Visibility change
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  /**
   * Handle DOM loaded event
   */
  handleDOMLoaded() {
    this.showLoadingScreen();
    this.preloadCriticalResources();
  }

  /**
   * Handle window loaded event
   */
  handleWindowLoaded() {
    setTimeout(() => {
      this.hideLoadingScreen();
      this.initPageAnimations();
    }, 300);
  }

  /**
   * Show loading screen with animation
   */
  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  /**
   * Hide loading screen with smooth transition
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hide');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        this.isLoading = false;
        document.body.classList.add('loaded');
      }, 500);
    }
  }

  /**
   * Initialize navigation functionality
   */
  initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
      });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navToggle && navMenu) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('nav-open');
        }
      });
    });

    // Smooth scroll for navigation links
    this.initSmoothScroll();

    // Navbar scroll behavior
    this.initNavbarScroll();
  }

  /**
   * Initialize smooth scroll for navigation
   */
  initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, `#${targetId}`);
        }
      });
    });
  }

  /**
   * Initialize navbar scroll behavior
   */
  initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
          
          // Add scrolled class
          if (currentScroll > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
          
          // Hide/show navbar on scroll
          if (currentScroll > lastScrollTop && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
          } else {
            navbar.style.transform = 'translateY(0)';
          }
          
          lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Handle scroll events with performance optimization
   */
  handleScroll() {
    this.scrollPosition = window.pageYOffset;
    
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.updateScrollProgress();
        this.updateParallax();
        this.checkScrollAnimations();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  /**
   * Update scroll progress indicator
   */
  updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      document.body.appendChild(progressBar);
    }
    
    progressBar.style.width = scrolled + '%';
  }

  /**
   * Initialize scroll animations
   */
  initScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.course-card, .feature-card, .section-header');
    animateElements.forEach(el => {
      animationObserver.observe(el);
    });

    this.observers.set('animation', animationObserver);
  }

  /**
   * Check for elements to animate on scroll
   */
  checkScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-reveal');
    
    elements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight * 0.8) {
        element.classList.add('revealed');
      }
    });
  }

  /**
   * Initialize parallax effects
   */
  initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach(element => {
      element.style.transform = 'translateY(0px)';
    });
  }

  /**
   * Update parallax effects
   */
  updateParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    parallaxElements.forEach((element, index) => {
      const speed = (index + 1) * 0.5;
      const yPos = -(this.scrollPosition * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  /**
   * Initialize lazy loading
   */
  initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });

      this.observers.set('images', imageObserver);
    }
  }

  /**
   * Initialize form validation
   */
  initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.validateField(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    });
  }

  /**
   * Validate form
   */
  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.required && !value) {
      isValid = false;
      errorMessage = 'Este campo é obrigatório';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um email válido';
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[0-9\s\-\+\(\)]{9,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, insira um número de telefone válido';
      }
    }

    this.showFieldError(field, errorMessage, isValid);
    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(field, message, isValid) {
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (!isValid) {
      field.classList.add('error');
      
      if (!errorElement) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
      } else {
        errorElement.textContent = message;
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Initialize touch events for mobile
   */
  initTouchEvents() {
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe();
    }, { passive: true });
  }

  /**
   * Handle swipe gestures
   */
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartY - this.touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up
        this.handleSwipeUp();
      } else {
        // Swipe down
        this.handleSwipeDown();
      }
    }
  }

  /**
   * Handle swipe up
   */
  handleSwipeUp() {
    // Hide mobile menu if open
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }

  /**
   * Handle swipe down
   */
  handleSwipeDown() {
    // Could be used for pull-to-refresh or other interactions
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
      const navMenu = document.getElementById('nav-menu');
      const navToggle = document.getElementById('nav-toggle');
      
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    }

    // Enter key on buttons
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
      e.target.click();
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.updateViewportHeight();
      this.handleResponsiveChanges();
    }, 250);
  }

  /**
   * Update viewport height for mobile browsers
   */
  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  /**
   * Handle responsive changes
   */
  handleResponsiveChanges() {
    const isMobile = window.innerWidth <= 768;
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');

    if (!isMobile && navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }

  /**
   * Handle visibility change (tab switching)
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, pause animations
      this.pauseAnimations();
    } else {
      // Page is visible, resume animations
      this.resumeAnimations();
    }
  }

  /**
   * Pause animations when page is hidden
   */
  pauseAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .morph-shape');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }

  /**
   * Resume animations when page is visible
   */
  resumeAnimations() {
    const animatedElements = document.querySelectorAll('.animate-fade-in-up, .morph-shape');
    animatedElements.forEach(el => {
      el.style.animationPlayState = 'running';
    });
  }

  /**
   * Initialize page load animations
   */
  initPageAnimations() {
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-promo, .hero-subtitle, .hero-stats, .hero-cta, .hero-info');
    
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fade-in-up');
      }, index * 200);
    });

    // Animate cards with stagger
    const cards = document.querySelectorAll('.course-card, .feature-card');
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animate-fade-in-up');
          }, index * 100);
          cardObserver.unobserve(entry.target);
        }
      });
    });

    cards.forEach(card => {
      cardObserver.observe(card);
    });
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources() {
    // Preload hero background image if exists
    const heroImage = new Image();
    heroImage.src = '/assets/images/hero-bg.jpg';

    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    fontLink.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZg.woff2';
    document.head.appendChild(fontLink);
  }

  /**
   * Initialize performance optimizations
   */
  initPerformanceOptimizations() {
    // Enable passive scrolling
    document.addEventListener('wheel', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });

    // Optimize images with IntersectionObserver
    this.optimizeImages();

    // Prefetch important pages
    this.prefetchPages();

    // Initialize service worker if available
    this.initServiceWorker();
  }

  /**
   * Optimize images loading
   */
  optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });

      // Add loading attribute for modern browsers
      img.loading = 'lazy';
    });
  }

  /**
   * Prefetch important pages
   */
  prefetchPages() {
    const importantLinks = [
      '/courses',
      '/contact',
      '/about'
    ];

    importantLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  /**
   * Initialize service worker
   */
  initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered successfully');
          })
          .catch(error => {
            console.log('Service Worker registration failed');
          });
      });
    }
  }

  /**
   * Handle page load completion
   */
  handlePageLoad() {
    // Set initial viewport height
    this.updateViewportHeight();

    // Initialize page specific functionality
    this.initPageSpecific();

    // Analytics tracking
    this.initAnalytics();

    // Accessibility enhancements
    this.initAccessibility();
  }

  /**
   * Initialize page specific functionality
   */
  initPageSpecific() {
    const currentPage = window.location.pathname;

    switch (currentPage) {
      case '/':
        this.initHomePage();
        break;
      case '/courses':
        this.initCoursesPage();
        break;
      case '/contact':
        this.initContactPage();
        break;
      default:
        break;
    }
  }

  /**
   * Initialize home page specific features
   */
  initHomePage() {
    // Auto-scroll to sections based on hash
    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1500);
    }

    // Initialize hero countdown if needed
    this.initCountdown();
  }

  /**
   * Initialize countdown timer
   */
  initCountdown() {
    const countdownElement = document.querySelector('.countdown');
    if (!countdownElement) return;

    const targetDate = new Date('2024-12-31 23:59:59').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
        <div class="countdown-item">
          <span class="countdown-number">${days}</span>
          <span class="countdown-label">Dias</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${hours}</span>
          <span class="countdown-label">Horas</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${minutes}</span>
          <span class="countdown-label">Min</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-number">${seconds}</span>
          <span class="countdown-label">Seg</span>
        </div>
      `;

      if (distance < 0) {
        clearInterval(countdownInterval);
        countdownElement.innerHTML = '<div class="countdown-expired">Oferta Expirada!</div>';
      }
    };

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
  }

  /**
   * Initialize courses page features
   */
  initCoursesPage() {
    // Course filtering and search
    this.initCourseFilters();
  }

  /**
   * Initialize course filters
   */
  initCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        
        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter courses
        courseCards.forEach(card => {
          if (filter === 'all' || card.classList.contains(filter)) {
            card.style.display = 'block';
            card.classList.add('animate-fade-in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Initialize contact page features
   */
  initContactPage() {
    // Contact form enhancement
    this.initContactForm();
  }

  /**
   * Initialize contact form
   */
  initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('[type="submit"]');
      
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';

      try {
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        this.showNotification('Mensagem enviada com sucesso!', 'success');
        contactForm.reset();
      } catch (error) {
        this.showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensagem';
      }
    });
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('notification--show');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  /**
   * Initialize analytics
   */
  initAnalytics() {
    // Track page views
    this.trackPageView();

    // Track interactions
    this.trackInteractions();
  }

  /**
   * Track page view
   */
  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  /**
   * Track user interactions
   */
  trackInteractions() {
    // Track CTA button clicks
    document.querySelectorAll('.cta-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'CTA',
            event_label: btn.textContent.trim(),
            value: 1
          });
        }
      });
    });

    // Track phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', (e) => {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'click', {
            event_category: 'Contact',
            event_label: 'Phone',
            value: 1
          });
        }
      });
    });
  }

  /**
   * Initialize accessibility features
   */
  initAccessibility() {
    // Skip to content link
    this.initSkipToContent();

    // Focus management
    this.initFocusManagement();

    // Reduced motion preferences
    this.handleReducedMotion();
  }

  /**
   * Initialize skip to content functionality
   */
  initSkipToContent() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Saltar para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  /**
   * Initialize focus management
   */
  initFocusManagement() {
    // Improve focus visibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  /**
   * Handle reduced motion preferences
   */
  handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable animations for users who prefer reduced motion
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Cleanup observers and event listeners
   */
  cleanup() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.tvdeWebsite = new TVDEWebsite();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.tvdeWebsite) {
    window.tvdeWebsite.cleanup();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TVDEWebsite;
}
