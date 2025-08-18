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

  // Smooth Scroll for Explore Packages
  const initSmoothScroll = () => {
    const explorePackages = document.querySelector('.hero-content .btn-primary');
    if (explorePackages) {
      explorePackages.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(explorePackages.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // Countdown Timer
  const targetDate = new Date('2025-12-25T00:00:00Z');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  function updateCountdown() {
    const now = new Date();
    const timeDiff = targetDate - now;

    if (timeDiff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Tabbed Packages
  const tabButtons = document.querySelectorAll('.tab-button');
  const packageTabs = document.querySelectorAll('.package-tab');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');

      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      packageTabs.forEach(tab => tab.classList.remove('active'));

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // More Details Toggle
  const moreButtons = document.querySelectorAll('.more-btn');
  moreButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const isActive = content.classList.contains('active');
      content.classList.toggle('active');
      button.textContent = isActive ? 'More Details' : 'Hide Details';
    });
  });

  // Modal Functionality
  const modal = document.getElementById('momentModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDetails = document.getElementById('modalDetails');
  const closeModal = document.querySelector('.modal-close');

  const momentDetails = {
    'afternoon-tea': {
      image: 'images/afternoon-tea.jpg',
      details: 'Indulge in a festive afternoon tea with seasonal sandwiches, scones, and sweets, served Thursday to Sunday in December.'
    },
    'winter-wedding': {
      image: 'images/winter-wedding.jpg',
      details: 'Create a magical winter wedding in the Tithe Barn, with bespoke packages and a fairy-tale setting.'
    }
  };

  document.querySelectorAll('.details-btn').forEach(button => {
    button.addEventListener('click', () => {
      const moment = button.getAttribute('data-moment');
      modalTitle.textContent = moment === 'afternoon-tea' ? 'Festive Afternoon Tea' : 'Winter Wedding';
      modalImage.src = momentDetails[moment].image;
      modalImage.alt = moment === 'afternoon-tea' ? 'Festive Afternoon Tea' : 'Winter Wedding';
      modalDetails.textContent = momentDetails[moment].details;
      modal.classList.add('active');
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Testimonial Carousel
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const prevButton = document.querySelector('.carousel-prev');
  const nextButton = document.querySelector('.carousel-next');
  let currentIndex = 0;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
      card.classList.remove('active');
      if (i === index) {
        card.classList.add('active');
      }
    });
  }

  prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? testimonialCards.length - 1 : currentIndex - 1;
    showTestimonial(currentIndex);
  });

  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
    showTestimonial(currentIndex);
  });

  setInterval(() => {
    currentIndex = (currentIndex === testimonialCards.length - 1) ? 0 : currentIndex + 1;
    showTestimonial(currentIndex);
  }, 5000);

  // Animation on Scroll
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(element => observer.observe(element));

  // Initialize
  initPreloader();
  preloadImages(document.querySelector('.packages-section'));
  preloadImages(document.querySelector('.moments-section'));
  initMobileMenu();
  initHeaderScroll();
  initSmoothScroll();
});

// Handle no-scroll class
document.body.classList.add('no-scroll');
setTimeout(() => {
  if (!document.body.classList.contains('preloading')) {
    document.body.classList.remove('no-scroll');
  }
}, 1000);