document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const DEBOUNCE_DELAY = 300;
    const PRELOADER_TIMEOUT = 5000; // Fallback timeout in ms

    // Cached DOM Elements
    const preloader = document.querySelector('.preloader');
    const header = document.querySelector('.site-header');
    const exploreChristmas = document.querySelector('.hero-content .btn-primary');
    const modal = document.getElementById('eventModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDetails = document.getElementById('modalDetails');
    const closeModal = document.querySelector('.modal-close');
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalCaption = document.getElementById('galleryModalCaption');
    const galleryCloseModal = document.querySelector('.gallery-modal-close');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');
    const backToTop = document.querySelector('.back-to-top');

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

    // Modal Functionality
    const eventDetails = {
      'Christmas Day Lunch': {
        details: `
          <p><strong>25th December</strong><br>£95.00 per adult, £55.00 per child (aged 4–14)</p>
          <p>Celebrate Christmas Day with a sumptuous lunch in the elegant Emlyn Restaurant, Garden Room, or The Lounge, featuring a family-friendly menu of festive dishes, prosecco and canapés on arrival, and the King’s Speech at 3:00pm.</p>
          <ul>
            <li>Prosecco and Canapés on arrival from 12:00pm</li>
            <li>Lunch served from 12:30pm (book your table anytime between 12:30 and 3:00pm)</li>
            <li>Join us for the King’s Speech at 3:00pm</li>
            <li>One Night Stay: £395.00 for 2 people</li>
            <li>Two Night Stay: £550.00 for 2 people</li>
          </ul>
          <h4>Menu</h4>
          <ul>
            <li><strong>To Start</strong>
              <ul>
                <li>Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread</li>
                <li>Prawn Cocktail, served on a bed of lettuce and pomegranate</li>
                <li>Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)</li>
                <li>Roasted Baby Beetroot with Avocado, Mixed Leaf Salad with Orange & Walnuts (DF, GF, VG, V)</li>
              </ul>
            </li>
            <li><strong>Main Course</strong>
              <ul>
                <li>Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Dorking Honey Glazed Roasted Carrots and Parsnips</li>
                <li>Herb Coated Cod, Spinach, new potatoes with a lemon dressing</li>
                <li>Spiced Cauliflower & Red Lentil Pie (DF, GF, VG, V)</li>
                <li>Roasted Pork Fillet Wrapped in Pancetta, celeriac and potato cider, sage jus</li>
              </ul>
            </li>
            <li><strong>Dessert</strong>
              <ul>
                <li>Traditional Christmas Pudding, Brandy Cream (VG, V)</li>
                <li>Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)</li>
                <li>Apple Pie, with vanilla ice cream</li>
                <li>Strawberry Cheesecake, with Chantilly cream</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Selection of Cheeses, chutney and biscuits</li>
                <li>Coffee & Mini Mince Pies</li>
              </ul>
            </li>
          </ul>
        `
      },
      'Festive Afternoon Tea': {
        details: `
          <p><strong>Thursday to Sunday, December, 2:00–4:00pm</strong><br>£30.00 per person, or £38.00 including a glass of prosecco</p>
          <p>Indulge in a seasonal afternoon tea with festive treats, served in the cozy Lounge.</p>
          <h4>Menu</h4>
          <ul>
            <li><strong>Sandwiches & Savouries</strong>
              <ul>
                <li>Roast Turkey & Cranberry Sandwich</li>
                <li>Smoked Salmon, Lemon-Dill Crème Fraîche Sandwich</li>
                <li>Cucumber and Crematta Sandwich</li>
                <li>Herbed Pork Sausage Roll (V, VG)</li>
                <li>Mini Samosas (V, VG)</li>
                <li>Cocktail Shrimp Pesto Tarts (GF)</li>
              </ul>
            </li>
            <li><strong>Scones</strong>
              <ul>
                <li>Classic Devon</li>
                <li>White Chocolate and Cranberry</li>
                <li>Jams & Clotted Cream</li>
              </ul>
            </li>
            <li><strong>Sweets</strong>
              <ul>
                <li>Festive Fruit Tarts, Chantilly Cream (V)</li>
                <li>Raspberry & Rosewater Cheesecake (GF)</li>
                <li>Warm Mince Pies</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Tea & Coffee</li>
              </ul>
            </li>
          </ul>
        `
      },
      'Christmas Party Night': {
        details: `
          <p><strong>29th November</strong><br>£59.00 per person</p>
          <p><strong>5th, 6th, 12th, 13th, 19th December</strong><br>£69.00 per person</p>
          <p>Join us for a lively Christmas Party Night in the Tithe Barn. Includes a three-course meal, arrival cocktail, 1/3 bottle of wine, decorations, novelties, DJ, and photo booth (select dates).</p>
          <ul>
            <li>Happy Hour from 6:00pm</li>
            <li>Dinner at 7:30pm</li>
            <li>Dancing until midnight</li>
          </ul>
          <h4>Menu</h4>
          <ul>
            <li><strong>To Start</strong>
              <ul>
                <li>Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread (V, VG, DF)</li>
                <li>Prawn Cocktail, served on a bed of lettuce and pomegranate (GF)</li>
                <li>Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)</li>
              </ul>
            </li>
            <li><strong>Main Courses</strong>
              <ul>
                <li>Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Honey Glazed Roasted Carrots and Parsnips (GF)</li>
                <li>Herb Coated Cod, Spinach, new potatoes with a lemon dressing (GF, DF)</li>
                <li>Spiced Cauliflower & Red Lentil Pie (DF, VG, V)</li>
              </ul>
            </li>
            <li><strong>Dessert</strong>
              <ul>
                <li>Traditional Christmas Pudding, Brandy Cream (VG, V)</li>
                <li>Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)</li>
                <li>Apple Pie, with vanilla ice cream (VG, V)</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Coffee & Mini Mince Pies</li>
              </ul>
            </li>
          </ul>
        `
      },
      'Tribute Night': {
        details: `
          <p><strong>28th November</strong><br>£55.00 per person</p>
          <p>Enjoy a vibrant Tribute Night in the Tithe Barn. Includes an arrival cocktail, 2-course sit-down meal, decorations, and novelties.</p>
        `
      },
      'Boogie Bingo': {
        details: `
          <p><strong>4th and 20th December</strong><br>£50.00 per person</p>
          <p>Join the fun at Boogie Bingo in the Tithe Barn. Includes an arrival cocktail, 2-course buffet, decorations, and novelties. Grab your bingo dobbers, listen to the music, mark off your numbers, and win fabulous prizes.</p>
        `
      },
      'Festive Lunches & Dinners': {
        details: `
          <p><strong>Throughout December, Lunch 12:30–2:30pm, Dinner 6:00–9:00pm</strong><br>Two courses: £25.00 per person, Three courses: £30.00 per person, Children (age 4–14): £15.00 per person</p>
          <p>Experience a relaxed festive meal in the Emlyn Restaurant.</p>
          <h4>Menu</h4>
          <ul>
            <li><strong>To Start</strong>
              <ul>
                <li>Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread (V, VG, DF)</li>
                <li>Prawn Cocktail, served on a bed of lettuce and pomegranate (GF)</li>
                <li>Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)</li>
              </ul>
            </li>
            <li><strong>Main Courses</strong>
              <ul>
                <li>Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Honey Glazed Roasted Carrots and Parsnips (GF)</li>
                <li>Herb Coated Cod, Spinach, new potatoes with a lemon dressing (GF, DF)</li>
                <li>Spiced Cauliflower & Red Lentil Pie (DF, VG, V)</li>
              </ul>
            </li>
            <li><strong>Dessert</strong>
              <ul>
                <li>Traditional Christmas Pudding, Brandy Cream (VG, V)</li>
                <li>Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)</li>
                <li>Apple Pie, with vanilla ice cream (VG, V)</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Coffee & Mini Mince Pies</li>
              </ul>
            </li>
          </ul>
        `
      },
      'Bottomless Brunch': {
        details: `
          <p><strong>6th, 14th, 19th, and 20th December, 12:30–3:00pm</strong><br>£49.00 per person</p>
          <p>Enjoy a festive brunch with a holiday twist in The Lounge. Includes bottomless prosecco, mimosas, and festive cocktails for 90 minutes.</p>
          <h4>Menu</h4>
          <ul>
            <li><strong>Sandwiches & Savouries</strong>
              <ul>
                <li>Roast Turkey & Cranberry Sandwich</li>
                <li>Smoked Salmon, Lemon-Dill Crème Fraîche Sandwich</li>
                <li>Cucumber and Crematta Sandwich</li>
                <li>Herbed Pork Sausage Roll (V, VG)</li>
                <li>Mini Samosas (V, VG)</li>
                <li>Cocktail Shrimp Pesto Tarts (GF)</li>
              </ul>
            </li>
            <li><strong>Scones</strong>
              <ul>
                <li>Classic Devon</li>
                <li>White Chocolate and Cranberry</li>
                <li>Jams & Clotted Cream</li>
              </ul>
            </li>
            <li><strong>Sweets</strong>
              <ul>
                <li>Festive Fruit Tarts, Chantilly Cream (V)</li>
                <li>Raspberry & Rosewater Cheesecake (GF)</li>
                <li>Warm Mince Pies</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Tea & Coffee</li>
              </ul>
            </li>
          </ul>
        `
      },
      'New Year\'s Eve Ball': {
        details: `
          <p><strong>31st December, 7:00pm–1:30am</strong><br>£125.00 per adult</p>
          <p>Celebrate New Year’s Eve in the Tithe Barn. Includes an arrival drink and canapés, 4-course meal, DJ until 1:00am, casino table, and photo booth.</p>
          <p><strong>Overnight Package</strong>: £450.00 per couple, includes 2 tickets, accommodation in a Superior room, and breakfast.</p>
          <h4>Menu</h4>
          <ul>
            <li><strong>Starters</strong>
              <ul>
                <li>Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread</li>
                <li>Prawn Cocktail, served on a bed of lettuce and pomegranate</li>
                <li>Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)</li>
                <li>Roasted Baby Beetroot with Avocado, Mixed Leaf Salad with Orange & Walnuts (DF, GF, VG, V)</li>
              </ul>
            </li>
            <li><strong>Main Course</strong>
              <ul>
                <li>Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Dorking Honey Glazed Roasted Carrots and Parsnips</li>
                <li>Herb Coated Cod, Spinach, new potatoes with a lemon dressing</li>
                <li>Spiced Cauliflower & Red Lentil Pie (DF, GF, VG, V)</li>
                <li>Roasted Pork Fillet Wrapped in Pancetta, celeriac and potato cider, sage jus</li>
              </ul>
            </li>
            <li><strong>Dessert</strong>
              <ul>
                <li>Traditional Christmas Pudding, Brandy Cream (VG, V)</li>
                <li>Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)</li>
                <li>Apple Pie, with vanilla ice cream</li>
                <li>Strawberry Cheesecake, with Chantilly cream</li>
              </ul>
            </li>
            <li><strong>Finish With</strong>
              <ul>
                <li>Coffee & Mini Mince Pies</li>
                <li>Selection of Cheeses, chutney and biscuits</li>
              </ul>
            </li>
          </ul>
        `
      },
      'Winter Wedding': {
        details: `
          <p><strong>1st November 2025 – 31st March 2026</strong><br>£4,995.00 (based on 40 daytime and 60 evening guests)</p>
          <p>Make your winter wedding a reality in the Tithe Barn. Includes exclusive use of the Tithe Barn, Champagne welcome, mulled wine reception, three-course wedding breakfast, sparkling wine toast, evening buffet, white tablecloths, Chiavari chairs, complimentary bedroom for the couple, and preferential guest rates.</p>
        `
      }
    };

    document.querySelectorAll('.details-btn').forEach(button => {
      button.addEventListener('click', () => {
        const event = button.getAttribute('data-event');
        if (eventDetails[event]) {
          modalTitle.textContent = event;
          modalDetails.innerHTML = eventDetails[event].details;
          modal.classList.add('active');
          modal.focus();
        } else {
          console.warn(`Event details not found for: ${event}`);
        }
      });

      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
    });

    if (closeModal) {
      closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
      });

      closeModal.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          modal.classList.remove('active');
        }
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });

      modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          modal.classList.remove('active');
        }
      });
    }

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
      preloadImages(document.querySelector('.brochure-section'));
      initMobileMenu();
      initHeaderScroll();
      initSmoothScroll();
      initBackToTop();
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
