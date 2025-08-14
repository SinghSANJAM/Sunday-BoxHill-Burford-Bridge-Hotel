document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DEBOUNCE_DELAY = 300;
    const PRELOADER_TIMEOUT = 5000; // Fallback timeout in ms

    // Cached DOM Elements
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.site-header');
    const exploreChristmas = document.querySelector('.hero-content .btn-primary');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalCaption = document.getElementById('galleryModalCaption');
    const galleryCloseModal = document.querySelector('.gallery-modal-close');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const backToTop = document.querySelector('.back-to-top');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventItems = document.querySelectorAll('.event-item');

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
      if (sessionStorage.getItem('preloaderShown') !== 'true' && preloader) {
        document.body.classList.add('preloading');
        document.querySelectorAll('.site-header, .hero-section, section, footer, .back-to-top').forEach((el) => {
          el.style.display = 'none';
        });

        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);
            completePreloader();
          }
        }, 50);

        // Fallback timeout to prevent infinite loading
        setTimeout(() => {
          if (progress < 100) {
            console.warn('Preloader timeout reached, forcing completion.');
            clearInterval(interval);
            completePreloader();
          }
        }, PRELOADER_TIMEOUT);
      } else {
        completePreloader();
      }
    };

    const completePreloader = () => {
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.remove('preloading');
          document.querySelectorAll('.site-header, .hero-section, section, footer, .back-to-top').forEach((el) => {
            el.style.display = '';
          });
          sessionStorage.setItem('preloaderShown', 'true');
        }, 300);
      }
    };

    // Preload Images
    const preloadImages = (container) => {
      if (container) {
        const images = container.querySelectorAll('img');
        images.forEach((img) => {
          const preloadImg = new Image();
          preloadImg.src = img.src;
          preloadImg.onerror = () => {
            console.warn(`Failed to preload image: ${img.src}, using fallback.`);
            img.src = 'images/fallback.jpg';
          };
        });
      } else {
        console.warn('Image container not found for preloading.');
      }
    };

    // Mobile Menu Logic
    const initMobileMenu = () => {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const nav = document.querySelector('.nav-container');
      const dropdowns = document.querySelectorAll('.has-dropdown');

      if (!toggle || !nav) {
        console.warn('Mobile menu toggle or nav container not found.');
        return;
      }

      toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });

      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });

      dropdowns.forEach((dropdown) => {
        const link = dropdown.querySelector('a');
        if (link) {
          link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              dropdown.classList.toggle('active');
              const submenu = dropdown.querySelector('.dropdown-menu');
              if (submenu) {
                submenu.style.display = dropdown.classList.contains('active') ? 'flex' : 'none';
              }
            }
          });

          link.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && window.innerWidth <= 768) {
              e.preventDefault();
              link.click();
            }
          });
        }
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
      let lastScroll = 0;
      window.addEventListener('scroll', debounce(() => {
        const currentScroll = window.pageYOffset;
        if (header) header.classList.toggle('scrolled', currentScroll > 50);
        if (backToTop) backToTop.classList.toggle('visible', currentScroll > 200);
        lastScroll = currentScroll;
      }, DEBOUNCE_DELAY));
    };

    // Smooth Scroll for Explore Christmas
    const initSmoothScroll = () => {
      if (exploreChristmas) {
        exploreChristmas.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(exploreChristmas.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          } else {
            console.warn('Smooth scroll target not found.');
          }
        });
      }
    };

    // Back to Top Button
    const initBackToTop = () => {
      if (backToTop) {
        backToTop.addEventListener('click', () => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });

        backToTop.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
        });
      }
    };

    // Event Filter Functionality
    const initEventFilters = () => {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          
          // Update button states
          filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');

          // Filter events
          eventItems.forEach(item => {
            if (filter === 'all') {
              item.classList.add('active');
            } else {
              item.classList.toggle('active', item.getAttribute('data-event') === filter);
            }
          });
        });

        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
          }
        });
      });
    };

    // Gallery Modal Functionality
    document.querySelectorAll('.gallery-zoom').forEach(button => {
      button.addEventListener('click', () => {
        const galleryItem = button.closest('.gallery-item');
        const img = galleryItem.querySelector('.gallery-image');
        if (img) {
          galleryModalImage.src = img.src;
          galleryModalImage.alt = img.alt;
          galleryModalCaption.textContent = img.alt;
          galleryModal.classList.add('active');
          galleryModal.focus();
        } else {
          console.warn('Gallery image not found.');
        }
      });

      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });

    if (galleryCloseModal) {
      galleryCloseModal.addEventListener('click', () => {
        galleryModal.classList.remove('active');
      });

      galleryCloseModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          galleryModal.classList.remove('active');
        }
      });
    }

    if (galleryModal) {
      galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
          galleryModal.classList.remove('active');
        }
      });

      galleryModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          galleryModal.classList.remove('active');
        }
      });
    }

    // Testimonial Carousel
    let currentIndex = 0;

    function showTestimonial(index) {
      testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
          card.classList.add('active');
        }
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
        showTestimonial(currentIndex);
      });

      prevButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          prevButton.click();
        }
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
        showTestimonial(currentIndex);
      });

      nextButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nextButton.click();
        }
      });
    }

    // Auto-advance carousel
    setInterval(() => {
      currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
      showTestimonial(currentIndex);
    }, 5000);

    // Animation on Scroll
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100);
        }
      });
    }, { threshold: 0.2 });

    animatedElements.forEach(element => observer.observe(element));

    // Initialize
    try {
      initPreloader();
      preloadImages(document.querySelector('.gallery-section'));
      initMobileMenu();
      initHeaderScroll();
      initSmoothScroll();
      initBackToTop();
      initEventFilters();
    } catch (error) {
      console.error('Initialization error:', error);
      completePreloader(); // Ensure preloader completes on error
    }
});

// Handle no-scroll class
document.body.classList.add('no-scroll');
setTimeout(() => {
  if (!document.body.classList.contains('preloading')) {
    document.body.classList.remove('no-scroll');
  }
}, 1000);
