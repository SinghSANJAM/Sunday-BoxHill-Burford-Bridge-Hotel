document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DEBOUNCE_DELAY = 200;
  
    // Utility: Debounce
    const debounce = (func, delay) => {
      let timeout;
      return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), delay);
      };
    };
  
    // Preloader Logic
    const initPreloader = () => {
      if (sessionStorage.getItem('preloaderShown') !== 'true') {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
          document.body.classList.add('preloading');
          document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
            el.style.display = 'none';
          });
  
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            if (progress >= 100) {
              clearInterval(interval);
              preloader.style.opacity = '0';
              setTimeout(() => {
                preloader.style.display = 'none';
                document.body.classList.remove('preloading');
                document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
                  el.style.display = '';
                });
                sessionStorage.setItem('preloaderShown', 'true');
              }, 300);
            }
          }, 50);
        }
      } else {
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.style.display = 'none';
        document.body.classList.remove('preloading');
        document.querySelectorAll('.site-header, .hero-section, section, footer').forEach((el) => {
          el.style.display = '';
        });
      }
    };
  
    // Preload Images
    const preloadImages = (container) => {
      const images = container.querySelectorAll('img');
      images.forEach((img) => {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onerror = () => {
          console.warn(`Failed to preload image: ${img.src}`);
          img.src = 'images/fallback.jpg';
        };
      });
    };
  
    // Mobile Menu Logic
    const initMobileMenu = () => {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const nav = document.querySelector('.nav-container');
      const dropdowns = document.querySelectorAll('.has-dropdown');
  
      if (!toggle || !nav) return;
  
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });
  
      dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector('a');
        link.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            const submenu = dropdown.querySelector('.dropdown-menu');
            submenu.style.display = dropdown.classList.contains('active') ? 'flex' : 'none';
          }
        });
      });
  
      nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768 && !link.parentElement.classList.contains('has-dropdown')) {
            toggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('no-scroll');
          }
        });
      });
    };
  
    // Header Scroll Effect
    const initHeaderScroll = () => {
      const header = document.querySelector('.site-header');
      let lastScroll = 0;
  
      window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        header.classList.toggle('scrolled', currentScroll > 50);
        lastScroll = currentScroll;
      }, 50));
    };
  
    // Smooth Scroll for Get in Touch
    const initSmoothScroll = () => {
      const getInTouch = document.querySelector('.hero-content .btn-primary');
      if (getInTouch) {
        getInTouch.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(getInTouch.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        });
      }
    };
  
    // Contact Form Validation and Modal
    const initContactForm = () => {
      const form = document.querySelector('#contactForm');
      const modal = document.querySelector('#formModal');
      const modalClose = modal?.querySelector('.modal-close');
  
      if (!form || !modal) return;
  
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const mobile = form.querySelector('#mobile').value.trim();
        const event = form.querySelector('#event').value;
        const guests = form.querySelector('#guests').value;
        const date = form.querySelector('#date').value;
  
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  
        let errors = [];
  
        if (!name) errors.push('Name is required.');
        if (!email || !emailRegex.test(email)) errors.push('A valid email is required.');
        if (!mobile || !mobileRegex.test(mobile)) errors.push('A valid UK mobile number is required.');
        if (!event) errors.push('Please select the nature of the event.');
        if (!guests || guests < 1) errors.push('Number of guests must be at least 1.');
        if (!date) errors.push('Requested date is required.');
  
        if (errors.length > 0) {
          alert(errors.join('\n'));
          return;
        }
  
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
  
        setTimeout(() => {
          form.submit();
        }, 1000);
      });
  
      modalClose?.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
  
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
  
      modalClose?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          modal.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
      });
    };
  
    // Newsletter Form Validation
    const initNewsletterForm = () => {
      const form = document.querySelector('.newsletter-form');
      if (!form) return;
  
      form.addEventListener('submit', (e) => {
        const email = form.querySelector('input[type="email"]').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
        if (!emailRegex.test(email)) {
          e.preventDefault();
          alert('Please enter a valid email address.');
        }
      });
    };
  
    // Collapsible Logic
    const initCollapsible = () => {
      const toggles = document.querySelectorAll('.collapsible-toggle');
      toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
          const content = toggle.nextElementSibling;
          const isActive = content.classList.contains('active');
  
          document.querySelectorAll('.collapsible-content').forEach((item) => {
            item.classList.remove('active');
            item.previousElementSibling.setAttribute('aria-expanded', 'false');
            item.previousElementSibling.classList.remove('active');
          });
  
          if (!isActive) {
            content.classList.add('active');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.classList.add('active');
          }
        });
  
        toggle.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle.click();
          }
        });
      });
    };
  
    // Map Interaction
    const initMapInteraction = () => {
      const mapContainer = document.querySelector('.map-container');
      if (!mapContainer) return;
  
      const iframe = mapContainer.querySelector('iframe');
      iframe.addEventListener('click', () => iframe.focus());
  
      iframe.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          iframe.focus();
        }
      });
    };
  
    // Initialize
    initPreloader();
    preloadImages(document.querySelector('.hero-section'));
    preloadImages(document.querySelector('.details-container'));
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initContactForm();
    initNewsletterForm();
    initCollapsible();
    initMapInteraction();
  });
  
  // Handle no-scroll class
  document.body.classList.add('no-scroll');
  setTimeout(() => {
    if (!document.body.classList.contains('preloading')) {
      document.body.classList.remove('no-scroll');
    }
  }, 1000);