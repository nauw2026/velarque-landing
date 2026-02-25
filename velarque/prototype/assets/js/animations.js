/* ============================================
   VELARQUE — Animation System
   GSAP + ScrollTrigger + Lenis
   ============================================ */

(function () {
  'use strict';

  // --- Lenis Smooth Scroll ---
  var lenis;

  function initSmoothScroll() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // --- Register GSAP Plugins ---
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 1 });
    ScrollTrigger.defaults({ toggleActions: 'play none none none' });
  }

  // --- Reveal Animations ---
  function initRevealAnimations() {
    gsap.utils.toArray('.reveal-text').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });

    gsap.utils.toArray('.reveal-up').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });
  }

  // --- Text Split Animation ---
  function initTextSplit() {
    var splitEls = document.querySelectorAll('[data-gsap="text-split"]');
    splitEls.forEach(function (el) {
      var text = el.textContent;
      var words = text.split(' ');
      el.innerHTML = '';
      words.forEach(function (word) {
        var span = document.createElement('span');
        span.className = 'split-word';
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        var inner = document.createElement('span');
        inner.className = 'split-word__inner';
        inner.style.display = 'inline-block';
        inner.textContent = word + '\u00A0';
        span.appendChild(inner);
        el.appendChild(span);
      });

      gsap.fromTo(el.querySelectorAll('.split-word__inner'),
        { y: '110%', opacity: 0 },
        {
          y: '0%', opacity: 1, duration: 0.8, stagger: 0.04, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });
  }

  // --- Parallax ---
  function initParallax() {
    document.querySelectorAll('[data-gsap="parallax"]').forEach(function (el) {
      var speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
      gsap.to(el, {
        y: function () { return -100 * speed; },
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
  }

  // --- Stagger Grid/List Items ---
  function initStaggerGrids() {
    document.querySelectorAll('[data-gsap="stagger"]').forEach(function (container) {
      var items = container.children;
      if (!items.length) return;
      gsap.fromTo(items,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: container, start: 'top 80%', once: true },
        }
      );
    });
  }

  // --- Hero Animation Timeline ---
  function initHeroAnimation() {
    var hero = document.querySelector('[data-gsap="hero"]');
    if (!hero) return;

    var tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });

    var eyebrow = hero.querySelector('.hero__eyebrow, .page-hero__eyebrow');
    if (eyebrow) {
      tl.fromTo(eyebrow, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.2);
    }

    var titleLines = hero.querySelectorAll('.hero__title-line .hero__word');
    if (titleLines.length) {
      titleLines.forEach(function (word, i) {
        tl.fromTo(word, { opacity: 0, y: '100%' }, { opacity: 1, y: '0%', duration: 0.9 }, 0.3 + i * 0.15);
      });
    }

    var pageTitle = hero.querySelector('.page-hero__title');
    if (pageTitle && !titleLines.length) {
      tl.fromTo(pageTitle, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9 }, 0.4);
    }

    var desc = hero.querySelector('.hero__desc, .hero__bottom, .page-hero__desc');
    if (desc) {
      tl.fromTo(desc, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
    }

    var cta = hero.querySelector('.hero__cta, .page-hero__actions');
    if (cta) {
      tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');
    }

    var scroll = hero.querySelector('.hero__scroll');
    if (scroll) {
      tl.fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 0.8 }, '-=0.2');
    }

    return tl;
  }

  // --- Magnetic Buttons ---
  function initMagneticButtons() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.6, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.6, ease: 'power3.out' });
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * 0.3);
        yTo((e.clientY - rect.top - rect.height / 2) * 0.3);
      });
      btn.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  // --- Counter Animation ---
  function initCounterAnimations() {
    document.querySelectorAll('[data-gsap="counter"], [data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count') || el.getAttribute('data-target'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function () { el.textContent = prefix + obj.val.toFixed(decimals) + suffix; },
      });
    });
  }

  // --- Horizontal Scroll ---
  function initHorizontalScroll() {
    document.querySelectorAll('[data-gsap="horizontal-scroll"]').forEach(function (section) {
      var track = section.querySelector('[data-gsap="horizontal-track"]');
      if (!track) return;
      var totalWidth = track.scrollWidth - section.offsetWidth;
      gsap.to(track, {
        x: -totalWidth, ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top',
          end: function () { return '+=' + totalWidth; },
          pin: true, scrub: 1, invalidateOnRefresh: true,
        },
      });
    });
  }

  // --- Line Animations ---
  function initLineAnimations() {
    document.querySelectorAll('[data-gsap="line"]').forEach(function (line) {
      gsap.fromTo(line,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: { trigger: line, start: 'top 90%', once: true },
        }
      );
    });
  }

  // --- Fade In Scale ---
  function initFadeInScale() {
    document.querySelectorAll('[data-gsap="fade-scale"]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    });
  }

  // --- Start All Animations ---
  function startAllAnimations() {
    initHeroAnimation();
    initRevealAnimations();
    initTextSplit();
    initParallax();
    initStaggerGrids();
    initMagneticButtons();
    initCounterAnimations();
    initHorizontalScroll();
    initLineAnimations();
    initFadeInScale();
    ScrollTrigger.refresh();
  }

  // --- Init ---
  function init() {
    // Guard: GSAP must be available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    try { initGSAP(); } catch (e) { return; }
    try { initSmoothScroll(); } catch (e) { /* Lenis optional — continue without smooth scroll */ }

    // Run animations: if page already loaded, go now. Otherwise wait for load.
    if (document.readyState === 'complete') {
      startAllAnimations();
    } else {
      window.addEventListener('load', function () {
        startAllAnimations();
      });
    }
  }

  // --- Expose ---
  window.VelarqueAnimations = {
    init: init,
    initHeroAnimation: initHeroAnimation,
    initCounterAnimations: initCounterAnimations,
    initStaggerGrids: initStaggerGrids,
    initRevealAnimations: initRevealAnimations,
    initParallax: initParallax,
    initMagneticButtons: initMagneticButtons,
    initHorizontalScroll: initHorizontalScroll,
    getLenis: function () { return lenis; },
  };

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
