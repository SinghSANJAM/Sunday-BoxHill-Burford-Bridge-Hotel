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
        details: 'Indulge in a seasonal afternoon tea with festive treats, served in the cozy Lounge on Thursday to Sunday throughout December from 2:00–4:00pm. £30.00 per person, or £38.00 including a glass of prosecco.<br><br><strong>Menu</strong><br><strong>Sandwiches & Savouries</strong><br>- Roast Turkey & Cranberry Sandwich<br>- Smoked Salmon, Lemon-Dill Crème Fraîche Sandwich<br>- Cucumber and Crematta Sandwich<br>- Herbed Pork Sausage Roll (V, VG)<br>- Mini Samosas (V, VG)<br>- Cocktail Shrimp Pesto Tarts (GF)<br><strong>Scones</strong><br>- Classic Devon<br>- White Chocolate and Cranberry<br>- Jams & Clotted Cream<br><strong>Sweets</strong><br>- Festive Fruit Tarts, Chantilly Cream (V)<br>- Raspberry & Rosewater Cheesecake (GF)<br>- Warm Mince Pies<br><strong>Finish With</strong><br>- Tea & Coffee'
      },
      'Christmas Party Night': {
        details: 'Join us for a lively Christmas Party Night in the Tithe Barn on 29th November (£59.00 per person) or 5th, 6th, 12th, 13th, 19th December (£69.00 per person). Includes a three-course meal, arrival cocktail, 1/3 bottle of wine, decorations, novelties, DJ, and photo booth (select dates). Enjoy Happy Hour from 6:00pm, dinner at 7:30pm, and dancing until midnight.<br><br><strong>Menu</strong><br><strong>To Start</strong><br>- Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread (V, VG, DF)<br>- Prawn Cocktail, served on a bed of lettuce and pomegranate (GF)<br>- Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)<br><strong>Main Courses</strong><br>- Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Honey Glazed Roasted Carrots and Parsnips (GF)<br>- Herb Coated Cod, Spinach, new potatoes with a lemon dressing (GF, DF)<br>- Spiced Cauliflower & Red Lentil Pie (DF, VG, V)<br><strong>Dessert</strong><br>- Traditional Christmas Pudding, Brandy Cream (VG, V)<br>- Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)<br>- Apple Pie, with vanilla ice cream (VG, V)<br><strong>Finish With</strong><br>- Coffee & Mini Mince Pies'
      },
      'Tribute Night': {
        details: 'Enjoy a vibrant Tribute Night in the Tithe Barn on 28th November for £55.00 per person. Includes an arrival cocktail, 2-course sit-down meal, decorations, and novelties.'
      },
      'Boogie Bingo': {
        details: 'Join the fun at Boogie Bingo in the Tithe Barn on 4th and 20th December for £50.00 per person. Includes an arrival cocktail, 2-course buffet, decorations, and novelties. Grab your bingo dobbers, listen to the music, mark off your numbers, and win fabulous prizes.'
      },
      'Festive Lunches & Dinners': {
        details: 'Experience a relaxed festive meal in the Emlyn Restaurant throughout December. Lunch from 12:30–2:30pm, Dinner from 6:00–9:00pm. Two courses: £25.00 per person, Three courses: £30.00 per person, Children (age 4–14): £15.00 per person.<br><br><strong>Menu</strong><br><strong>To Start</strong><br>- Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread (V, VG, DF)<br>- Prawn Cocktail, served on a bed of lettuce and pomegranate (GF)<br>- Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)<br><strong>Main Courses</strong><br>- Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Honey Glazed Roasted Carrots and Parsnips (GF)<br>- Herb Coated Cod, Spinach, new potatoes with a lemon dressing (GF, DF)<br>- Spiced Cauliflower & Red Lentil Pie (DF, VG, V)<br><strong>Dessert</strong><br>- Traditional Christmas Pudding, Brandy Cream (VG, V)<br>- Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)<br>- Apple Pie, with vanilla ice cream (VG, V)<br><strong>Finish With</strong><br>- Coffee & Mini Mince Pies'
      },
      'Bottomless Brunch': {
        details: 'Enjoy a festive brunch with a holiday twist in The Lounge on 6th, 14th, 19th, and 20th December from 12:30–3:00pm for £49.00 per person. Includes bottomless prosecco, mimosas, and festive cocktails for 90 minutes.<br><br><strong>Menu</strong><br><strong>Sandwiches & Savouries</strong><br>- Roast Turkey & Cranberry Sandwich<br>- Smoked Salmon, Lemon-Dill Crème Fraîche Sandwich<br>- Cucumber and Crematta Sandwich<br>- Herbed Pork Sausage Roll (V, VG)<br>- Mini Samosas (V, VG)<br>- Cocktail Shrimp Pesto Tarts (GF)<br><strong>Scones</strong><br>- Classic Devon<br>- White Chocolate and Cranberry<br>- Jams & Clotted Cream<br><strong>Sweets</strong><br>- Festive Fruit Tarts, Chantilly Cream (V)<br>- Raspberry & Rosewater Cheesecake (GF)<br>- Warm Mince Pies<br><strong>Finish With</strong><br>- Tea & Coffee'
      },
      'New Year\'s Eve Ball': {
        details: 'Celebrate New Year’s Eve in the Tithe Barn on 31st December from 7:00pm–1:30am for £125.00 per adult. Includes an arrival drink and canapés, 4-course meal, DJ until 1:00am, casino table, and photo booth. Overnight package: £450.00 per couple, includes 2 tickets, accommodation in a Superior room, and breakfast.<br><br><strong>Menu</strong><br><strong>Starters</strong><br>- Roasted Pumpkin and Coconut Soup, Rose Harissa with Sourdough bread<br>- Prawn Cocktail, served on a bed of lettuce and pomegranate<br>- Creamy Chicken Liver Pate, cornichons salsa, watercress and ciabatta garlic bread (GF)<br>- Roasted Baby Beetroot with Avocado, Mixed Leaf Salad with Orange & Walnuts (DF, GF, VG, V)<br><strong>Main Course</strong><br>- Butter Roasted Turkey Breast, Sage and Cranberry Stuffing, Pigs in Blankets, Traditional Gravy, Rosemary Roasted Potatoes, Brussels Sprouts, Dorking Honey Glazed Roasted Carrots and Parsnips<br>- Herb Coated Cod, Spinach, new potatoes with a lemon dressing<br>- Spiced Cauliflower & Red Lentil Pie (DF, GF, VG, V)<br>- Roasted Pork Fillet Wrapped in Pancetta, celeriac and potato cider, sage jus<br><strong>Dessert</strong><br>- Traditional Christmas Pudding, Brandy Cream (VG, V)<br>- Chocolate Orange Torte, served with Passion Fruit Coulis (DF, GF, VG, V)<br>- Apple Pie, with vanilla ice cream<br>- Strawberry Cheesecake, with Chantilly cream<br><strong>Finish With</strong><br>- Coffee & Mini Mince Pies<br>- Selection of Cheeses, chutney and biscuits'
      },
      'Winter Wedding': {
        details: 'Make your winter wedding a reality from 1st November 2025 to 31st March 2026 in the Tithe Barn for £4,995.00 (based on 40 daytime and 60 evening guests). Includes exclusive use of the Tithe Barn, Champagne welcome, mulled wine reception, three-course wedding breakfast, sparkling wine toast, evening buffet, white tablecloths, Chiavari chairs, complimentary bedroom for the couple, and preferential guest rates.'
      }
    };

    document.querySelectorAll('.details-btn').forEach(button => {
      button.addEventListener('click', () => {
        const event = button.getAttribute('data-event');
        modalTitle.textContent = event;
        modalDetails.innerHTML = eventDetails[event].details;
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

    // Gallery Modal Functionality
    const galleryModal = document.getElementById('galleryModal');
    const galleryModalImage = document.getElementById('galleryModalImage');
    const galleryModalCaption = document.getElementById('galleryModalCaption');
    const galleryCloseModal = document.querySelector('.gallery-modal-close');

    document.querySelectorAll('.gallery-zoom').forEach(button => {
      button.addEventListener('click', () => {
        const galleryItem = button.closest('.gallery-item');
        const img = galleryItem.querySelector('.gallery-image');
        galleryModalImage.src = img.src;
        galleryModalImage.alt = img.alt;
        galleryModalCaption.textContent = img.alt;
        galleryModal.classList.add('active');
      });
    });

    galleryCloseModal.addEventListener('click', () => {
      galleryModal.classList.remove('active');
    });

    galleryModal.addEventListener('click', (e) => {
      if (e.target === galleryModal) {
        galleryModal.classList.remove('active');
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

    // Auto-advance carousel
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
    preloadImages(document.querySelector('.gallery-section'));
    preloadImages(document.querySelector('.brochure-section'));
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
