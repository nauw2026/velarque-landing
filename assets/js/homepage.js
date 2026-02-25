/* ============================================
   VELARQUE — Homepage JS
   Splide sliders + page-specific interactions
   ============================================ */

(function () {
  'use strict';

  // --- Work Slider (Splide) ---
  var workSlider = document.getElementById('workSlider');
  if (workSlider && typeof Splide !== 'undefined') {
    new Splide('#workSlider', {
      type: 'loop',
      perPage: 2,
      gap: '32px',
      padding: { left: 0, right: '10%' },
      pagination: false,
      arrows: false,
      drag: true,
      speed: 600,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      breakpoints: {
        1024: { perPage: 1, padding: { left: 0, right: '20%' } },
        640: { perPage: 1, gap: '20px', padding: { left: 0, right: '10%' } },
      },
    }).mount();
  }

  // --- Testimonials Slider (Splide) ---
  var testimonialsSlider = document.getElementById('testimonialsSlider');
  if (testimonialsSlider && typeof Splide !== 'undefined') {
    new Splide('#testimonialsSlider', {
      type: 'fade',
      rewind: true,
      perPage: 1,
      pagination: true,
      arrows: false,
      autoplay: true,
      interval: 5000,
      speed: 800,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }).mount();
  }

})();
