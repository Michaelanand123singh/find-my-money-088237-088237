document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const mobileMenu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('menu-button');
  const closeButton = document.getElementById('menu-close-button');
  const menuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (menuButton && mobileMenu && closeButton) {
    const toggleMenu = () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', !expanded);
      mobileMenu.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden'); // Prevent scrolling behind the menu
      if (!expanded) {
        //Trap Focus
        menuLinks[0].focus();
      }
    };

    menuButton.addEventListener('click', toggleMenu);
    closeButton.addEventListener('click', toggleMenu);

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
        menuButton.focus(); // Return focus to the menu button
      }
    });

    //Trap Focus inside the mobile menu
    mobileMenu.addEventListener('keydown', (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) { // if shift key pressed for shift + tab combination
        if (document.activeElement === menuLinks[0]) {
          closeButton.focus();
          e.preventDefault();
        }
      } else { // if tab key is pressed
        if (document.activeElement === closeButton) {
          menuLinks[0].focus(); // move focus to first element
          e.preventDefault();
        }
      }
    });

  }

  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.getElementById('back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update URL without triggering navigation
        history.pushState(null, null, targetId);
      }
    });
  });

  if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.remove('hidden');
      } else {
        backToTopButton.classList.add('hidden');
      }
    });
  }

  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevButton = testimonialSlider.querySelector('.testimonial-prev');
    const nextButton = testimonialSlider.querySelector('.testimonial-next');
    let currentIndex = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('hidden', i !== index);
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(currentIndex);
    };

    showSlide(currentIndex); // Initialize

    if (prevButton && nextButton) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
      });
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
      });
    }

    // Auto-advance every 5 seconds
    let intervalId = setInterval(nextSlide, 5000);

    // Pause auto-advance on hover
    testimonialSlider.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
      intervalId = setInterval(nextSlide, 5000);
    });
  }
  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    const content = item.querySelector('.faq-answer');

    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer').classList.add('hidden');
        }
      });

      // Toggle current FAQ item
      button.setAttribute('aria-expanded', !expanded);
      content.classList.toggle('hidden');
    });
  });

  // Email Capture Validation
  const emailForm = document.getElementById('email-capture-form');
  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      console.log('Submitting email:', email);
      // You would typically send this to your backend here
      emailInput.value = ''; // Clear the input
    });
  }


  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging (stub)
  const ctaLinks = document.querySelectorAll('.cta-link'); //Example class.  Modify as needed.

  ctaLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      logCtaClick(link.href, getUtmParams());
    });
  });

  function logCtaClick(url, utmParams) {
    // In a real implementation, you would send this data to your analytics system
    console.log('CTA Clicked:', {
      url: url,
      utm: utmParams
    });
  }

  function getUtmParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
      if (key.startsWith('utm_')) {
        utmParams[key] = value;
      }
    }
    return utmParams;
  }
});

// Defer loading of non-critical resources (example: analytics)
// This would ideally be moved outside the DOMContentLoaded event
// to avoid blocking even that. However, for simplicity, I'll leave it here.
// Example:
// setTimeout(() => {
//   const script = document.createElement('script');
//   script.src = 'https://example.com/analytics.js';
//   script.async = true;
//   document.body.appendChild(script);
// }, 1000);