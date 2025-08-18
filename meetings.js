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
  
    // Smooth Scroll for Explore Venues
    const initSmoothScroll = () => {
      const exploreVenues = document.querySelector('.hero-content .btn-primary');
      if (exploreVenues) {
        exploreVenues.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(exploreVenues.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        });
      }
    };
  
    // Table Filtering
    const roomTypeFilter = document.getElementById('roomTypeFilter');
    const floorFilter = document.getElementById('floorFilter');
    const tableRows = document.querySelectorAll('.meeting-table tbody tr');
  
    function filterTable() {
      const roomType = roomTypeFilter.value;
      const floor = floorFilter.value;
  
      tableRows.forEach(row => {
        const rowRoomType = row.getAttribute('data-room-type');
        const rowFloor = row.getAttribute('data-floor');
        const matchesRoomType = roomType === 'all' || rowRoomType.includes(roomType);
        const matchesFloor = floor === 'all' || rowFloor === floor;
  
        row.style.display = matchesRoomType && matchesFloor ? '' : 'none';
      });
    }
  
    roomTypeFilter.addEventListener('change', filterTable);
    floorFilter.addEventListener('change', filterTable);
  
    // Modal Functionality
    const modal = document.getElementById('roomModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.modal-close');
  
    const roomDetails = {
      'Tithe Barn Suite': {
        details: 'The historic Tithe Barn Suite, with its striking wooden beams and private entrance, is perfect for conferences, awards ceremonies, or team-building events. Features air conditioning, integrated sound system, wireless microphone, and cloakroom. Capacity up to 240 cocktail or 180 theatre/dinner.'
      },
      'Garden Room': {
        details: 'A bright, welcoming room with views over the gardens and Box Hill. Includes doors to a private patio and croquet lawn, air conditioning, integrated screen, and sound system. Ideal for meetings or dinners, with a capacity up to 70 cocktail/theatre or 60 dinner.'
      },
      'Lady Hamilton': {
        details: 'Our smallest meeting space, perfect for intimate boardroom meetings or private dining. Features air conditioning and a flat-screen TV. Capacity up to 14 for dinner or boardroom setups.'
      },
      'Burford Room': {
        details: 'A versatile space adjacent to the River Room, ideal for large conferences or banquets. Features air conditioning, integrated screen, and sound system. Capacity up to 240 cocktail or 180 theatre/dinner.'
      },
      'River Room': {
        details: 'A flexible meeting space adjacent to the Burford Room, suitable for smaller events or breakout sessions. Features air conditioning and integrated AV equipment. Capacity up to 50 across various setups.'
      }
    };
  
    document.querySelectorAll('.details-btn').forEach(button => {
      button.addEventListener('click', () => {
        const room = button.getAttribute('data-room');
        modalTitle.textContent = room;
        modalDetails.textContent = roomDetails[room].details;
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
  
    // Package Toggle Functionality
    const detailsToggles = document.querySelectorAll('.details-toggle');
    detailsToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const details = toggle.nextElementSibling;
        const isActive = toggle.classList.contains('active');
  
        // Close all toggles
        detailsToggles.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.classList.remove('active');
        });
  
        // Open current toggle
        if (!isActive) {
          toggle.classList.add('active');
          toggle.setAttribute('aria-expanded', 'true');
          details.classList.add('active');
        }
      });
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
    preloadImages(document.querySelector('.packages-section'));
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