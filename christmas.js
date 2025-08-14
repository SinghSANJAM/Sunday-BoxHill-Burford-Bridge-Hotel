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

    // Smooth Scroll for Explore Christmas
    const initSmoothScroll = () => {
      const exploreChristmas = document.querySelector('.hero-content .btn-primary');
      if (exploreChristmas) {
        exploreChristmas.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(exploreChristmas.getAttribute('href'));
          if (target) {
            window.scrollTo({
              top: target.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        });
      }
    };

    // Modal Functionality
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.modal-close');

    const eventDetails = {
      'Christmas Day Lunch': {
        details: 'Celebrate Christmas Day with a sumptuous lunch in the elegant Emlyn Restaurant, Garden Room, or The Lounge, featuring a family-friendly menu of festive dishes, prosecco and canapés on arrival, and the King’s Speech at 3:00pm. £95.00 per adult, £55.00 per child (aged 4–14). One Night Stay: £395.00 for 2 people. Two Night Stay: £550.00 for 2 people.<br><br><strong>Menu</strong><br><strong>To Start</strong><br>- Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread<br>- Prawn Cocktail, served on a bed of lettuce and pomegranate<br>- Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)<br>- Roasted Baby Beetroot with Avocado, Mixed Leaf Salad with Orange & Walnuts (DF, GF, VG, V)<br><strong>Main Course</strong><br>- Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Dorking Honey Glazed Roasted Carrots and Parsnips<br>- Herb Coated Cod, Spinach, new potatoes with a lemon dressing<br>- Spiced Cauliflower & Red Lentil Pie (DF, GF, VG, V)<br>- Roasted Pork Fillet Wrapped in Pancetta, celeriac and potato cider, sage jus<br><strong>Dessert</strong><br>- Traditional Christmas Pudding, Brandy Cream (VG, V)<br>- Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)<br>- Apple Pie, with vanilla ice cream<br>- Strawberry Cheesecake, with Chantilly cream<br><strong>Finish With</strong><br>- Selection of Cheeses, chutney and biscuits<br>- Coffee & Mini Mince Pies'
      },
      'Festive Afternoon Tea': {
        details: 'Indulge in a seasonal afternoon tea with festive treats, served in the cozy Lounge on Thursday to Sunday throughout December from 2:00–4:00pm. £30.00 per person, or £38.00 including a glass of prosecco.<br><br><strong>Menu</strong><br><strong>Sandwiches & Savouries</strong><br>- Roast Turkey & Cranberry Sandwich<br>- Smoked Salmon, Lemon-Dill Crème Fraîche Sandwich<br>- Cucumber
