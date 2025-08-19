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

  // Smooth Scroll for Explore Gallery
  const initSmoothScroll = () => {
    const exploreGallery = document.querySelector('.hero-content .btn-primary');
    if (exploreGallery) {
      exploreGallery.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(exploreGallery.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    }
  };

  // Gallery Filter Functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          item.classList.add('visible');
        } else {
          item.style.display = 'none';
          item.classList.remove('visible');
        }
      });
    });
  });

  // Auto-activate filter if URL contains hash
  const hash = window.location.hash.substring(1);
  if (hash) {
    const filterBtn = document.querySelector(`.filter-btn[data-filter="${hash}"]`);
    if (filterBtn) {
      filterBtn.click();
      const gallerySection = document.querySelector('.gallery-section');
      if (gallerySection) {
        window.scrollTo({
          top: gallerySection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  }

  // Gallery Modal Functionality
  const galleryModal = document.getElementById('galleryModal');
  const galleryModalImage = document.getElementById('galleryModalImage');
  const galleryModalCaption = document.getElementById('galleryModalCaption');
  const galleryCloseModal = document.querySelector('.gallery-modal-close');
  const galleryPrevButton = document.querySelector('.gallery-modal-prev');
  const galleryNextButton = document.querySelector('.gallery-modal-next');
  let currentImages = [];
  let currentIndex = 0;

  const updateModalImage = (index) => {
    if (currentImages[index]) {
      galleryModalImage.src = currentImages[index].src;
      galleryModalImage.alt = currentImages[index].alt;
      galleryModalCaption.textContent = currentImages[index].alt;
      currentIndex = index;
    }
  };

  const getCurrentImages = () => {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    return Array.from(galleryItems)
      .filter(item => item.style.display !== 'none' && (activeFilter === 'all' || item.getAttribute('data-category') === activeFilter))
      .map(item => item.querySelector('.gallery-image'));
  };

  document.querySelectorAll('.gallery-zoom').forEach((button, index) => {
    button.addEventListener('click', () => {
      const galleryItem = button.closest('.gallery-item');
      const img = galleryItem.querySelector('.gallery-image');
      currentImages = getCurrentImages();
      currentIndex = currentImages.findIndex(i => i.src === img.src);
      updateModalImage(currentIndex);
      galleryModal.classList.add('active');
    });
  });

  galleryPrevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateModalImage(currentIndex);
  });

  galleryNextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateModalImage(currentIndex);
  });

  galleryCloseModal.addEventListener('click', () => {
    galleryModal.classList.remove('active');
  });

  galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) {
      galleryModal.classList.remove('active');
    }
  });

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
  preloadImages(document.querySelector('.gallery-section'));
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
