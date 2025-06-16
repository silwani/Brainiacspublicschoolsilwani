

    document.addEventListener('DOMContentLoaded', function() {
      // Mobile menu functionality
      const menuToggle = document.querySelector('.menu-toggle');
      const primaryNav = document.querySelector('.primary-nav');
      
      if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', function() {
          const expanded = this.getAttribute('aria-expanded') === 'true';
          this.setAttribute('aria-expanded', !expanded);
          primaryNav.setAttribute('aria-expanded', !expanded);
        });
      }
      
      // Carousel functionality
      const carousel = document.querySelector('.header-carousel');
      if (!carousel) return;
      
      const slides = carousel.querySelectorAll('.carousel-slide');
      const prevBtn = carousel.querySelector('#prev-slide');
      const nextBtn = carousel.querySelector('#next-slide');
      const indicatorsContainer = carousel.querySelector('.carousel-indicators');
      
      let currentIndex = 0;
      let slideInterval;
      const slideDuration = 5000; // 5 seconds
      
      // Create indicators
      slides.forEach((slide, index) => {
        const indicator = document.createElement('button');
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('tabindex', index === 0 ? '0' : '-1');
        if (index === 0) {
          indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
      });
      
      const indicators = indicatorsContainer.querySelectorAll('button');
      
      // Initialize first slide
      showSlide(currentIndex);
      startAutoSlide();
      
      // Navigation functions
      function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
          slide.classList.remove('active');
          const video = slide.querySelector('video');
          if (video) {
            video.pause();
          }
        });
        
        // Show current slide
        slides[index].classList.add('active');
        const video = slides[index].querySelector('video');
        if (video) {
          video.currentTime = 0;
          video.play().catch(e => console.log('Autoplay prevented:', e));
        }
        
        // Update indicators
        indicators.forEach((indicator, i) => {
          indicator.classList.toggle('active', i === index);
          indicator.setAttribute('aria-selected', i === index ? 'true' : 'false');
          indicator.setAttribute('tabindex', i === index ? '0' : '-1');
        });
      }
      
      function goToSlide(index) {
        currentIndex = index;
        showSlide(currentIndex);
        resetAutoSlide();
      }
      
      function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        showSlide(currentIndex);
        resetAutoSlide();
      }
      
      function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(currentIndex);
        resetAutoSlide();
      }
      
      // Auto slide functions
      function startAutoSlide() {
        slideInterval = setInterval(nextSlide, slideDuration);
      }
      
      function resetAutoSlide() {
        clearInterval(slideInterval);
        startAutoSlide();
      }
      
      // Event listeners
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);
      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      
      // Pause on hover
      carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
      carousel.addEventListener('mouseleave', startAutoSlide);
      
      // Touch support
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(slideInterval);
      }, {passive: true});
      
      carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
      }, {passive: true});
      
      function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
          nextSlide();
        } else if (touchEndX > touchStartX + threshold) {
          prevSlide();
        }
      }
      
      // Keyboard navigation
      carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          nextSlide();
        } else if (e.key === 'ArrowLeft') {
          prevSlide();
        }
      });
    });
    // Instagram Embed Functionality (Desktop Only)
    if (window.innerWidth >= 992) {
      // Add Instagram button to header
      const header = document.querySelector('header .header-container');
      const instaBtn = document.createElement('div');
      instaBtn.innerHTML = `
        <button class="instagram-desktop" id="headerInstaBtn" style="
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          margin-left: 1rem;
        ">
          <i class="fab fa-instagram"></i>
        </button>
      `;
      header.appendChild(instaBtn);
      
      // Instagram modal functionality
      const instaBtnEl = document.getElementById('headerInstaBtn');
      const instaEmbed = document.getElementById('instagramEmbed');
      const instaOverlay = document.getElementById('instagramOverlay');
      const closeInsta = document.getElementById('closeInstagram');
      
      instaBtnEl.addEventListener('click', () => {
        instaEmbed.style.display = 'block';
        instaOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
      });
      
      closeInsta.addEventListener('click', () => {
        instaEmbed.style.display = 'none';
        instaOverlay.style.display = 'none';
        document.body.style.overflow = '';
      });
      
      instaOverlay.addEventListener('click', () => {
        instaEmbed.style.display = 'none';
        instaOverlay.style.display = 'none';
        document.body.style.overflow = '';
      });
    }
    
    // Rest of your existing JavaScript