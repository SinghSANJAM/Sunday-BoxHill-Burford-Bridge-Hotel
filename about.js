document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const SLIDE_INTERVAL = 6000; // Hero slider interval (ms)
  const CAROUSEL_INTERVAL = 5000; // Magazine carousel interval (ms)
  const DEBOUNCE_DELAY = 200; // Debounce delay for click/touch events

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
        document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
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
              document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
                el.style.display = '';
              });
              sessionStorage.setItem('preloaderShown', 'true');
            }, 300);
          }
        }, 50);
      }
    } else {
      const preloader = document.querySelector('.preloader');
      if (preloader) {
        preloader.style.display = 'none';
      }
      document.body.classList.remove('preloading');
      document.querySelectorAll('.site-header, .hero-slider, section, footer').forEach((el) => {
        el.style.display = '';
      });
    }
  };

  // Preload Images
  const preloadImages = (slides) => {
    slides.forEach(slide => {
      const img = slide.querySelector('img');
      if (img) {
        const preloadImg = new Image();
        preloadImg.src = img.src;
        preloadImg.onerror = () => {
          console.warn(`Failed to preload image: ${img.src}`);
          img.src = 'images/fallback.jpg';
        };
      }
    });
  };

  // Hero Slider Logic
  const initHeroSlider = () => {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.slider-dots .dot');
    const prevButton = slider.querySelector('.prev-slide');
    const nextButton = slider.querySelector('.next-slide');
    let currentSlide = 0;
    let slideInterval;

    if (slides.length === 0) return;

    // Preload images
    preloadImages(slides);

    // Show slide
    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        if (i === index) {
          const img = slide.querySelector('img');
          if (img && slide.dataset.zoom === 'active') {
            img.style.transform = 'scale(1)';
          }
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
      currentSlide = index;
    };

    // Next slide
    const nextSlide = () => {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    };

    // Previous slide
    const prevSlide = () => {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    };

    // Auto slide
    const startSlideShow = () => {
      slideInterval = setInterval(nextSlide, SLIDE_INTERVAL);
    };

    const stopSlideShow = () => {
      clearInterval(slideInterval);
    };

    // Event listeners for controls
    prevButton.addEventListener('click', debounce(() => {
      stopSlideShow();
      prevSlide();
      startSlideShow();
    }, DEBOUNCE_DELAY));

    nextButton.addEventListener('click', debounce(() => {
      stopSlideShow();
      nextSlide();
      startSlideShow();
    }, DEBOUNCE_DELAY));

    dots.forEach((dot, index) => {
      dot.addEventListener('click', debounce(() => {
        stopSlideShow();
        showSlide(index);
        startSlideShow();
      }, DEBOUNCE_DELAY));

      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          stopSlideShow();
          showSlide(index);
          startSlideShow();
        }
      });
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        stopSlideShow();
        nextSlide();
        startSlideShow();
      } else if (touchEndX - touchStartX > 50) {
        stopSlideShow();
        prevSlide();
        startSlideShow();
      }
    });

    // Start slideshow
    startSlideShow();

    // Pause on hover
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
  };

  // Magazine Carousel Logic
  const initMagazineCarousels = () => {
    const carousels = document.querySelectorAll('.magazine-carousel');
    carousels.forEach((carousel) => {
      const slides = carousel.querySelectorAll('.carousel-slide');
      const dots = carousel.querySelectorAll('.carousel-dot');
      const prevButton = carousel.querySelector('.carousel-prev');
      const nextButton = carousel.querySelector('.carousel-next');
      let currentSlide = 0;
      let carouselInterval;

      if (slides.length === 0) return;

      // Preload images
      preloadImages(slides);

      // Show slide
      const showSlide = (index) => {
        slides.forEach((slide, i) => {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        currentSlide = index;
      };

      // Next slide
      const nextSlide = () => {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
      };

      // Previous slide
      const prevSlide = () => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
      };

      // Auto slide
      const startCarousel = () => {
        carouselInterval = setInterval(nextSlide, CAROUSEL_INTERVAL);
      };

      const stopCarousel = () => {
        clearInterval(carouselInterval);
      };

      // Event listeners
      prevButton.addEventListener('click', debounce(() => {
        stopCarousel();
        prevSlide();
        startCarousel();
      }, DEBOUNCE_DELAY));

      nextButton.addEventListener('click', debounce(() => {
        stopCarousel();
        nextSlide();
        startCarousel();
      }, DEBOUNCE_DELAY));

      dots.forEach((dot, index) => {
        dot.addEventListener('click', debounce(() => {
          stopCarousel();
          showSlide(index);
          startCarousel();
        }, DEBOUNCE_DELAY));

        dot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            stopCarousel();
            showSlide(index);
            startCarousel();
          }
        });
      });

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;

      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      });

      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 50) {
          stopCarousel();
          nextSlide();
          startCarousel();
        } else if (touchEndX - touchStartX > 50) {
          stopCarousel();
          prevSlide();
          startCarousel();
        }
      });

      // Start carousel
      startCarousel();

      // Pause on hover
      carousel.addEventListener('mouseenter', stopCarousel);
      carousel.addEventListener('mouseleave', startCarousel);
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

    // Close mobile menu on link click
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

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
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

  // Image Modal Logic
  const initImageModal = () => {
    const images = document.querySelectorAll('.magazine-carousel img');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <img src="" alt="Modal Image">
        <p></p>
        <button>Close</button>
      </div>
    `;
    document.body.appendChild(modal);

    const modalImg = modal.querySelector('img');
    const modalText = modal.querySelector('p');
    const closeButton = modal.querySelector('button');

    images.forEach((img) => {
      img.addEventListener('click', () => {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modalText.textContent = img.alt;
        modal.classList.add('active');
        document.body.classList.add('no-scroll');
      });
    });

    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  };



  // Initialize all functionalities
  initPreloader();
  initHeroSlider();
  initMagazineCarousels();
  initMobileMenu();
  initHeaderScroll();
  initNewsletterForm();
  initImageModal();
  initAccordion();
});

// Ensure no-scroll class is handled
document.body.classList.add('no-scroll');
setTimeout(() => {
  if (!document.body.classList.contains('preloading')) {
    document.body.classList.remove('no-scroll');
  }
}, 1000);