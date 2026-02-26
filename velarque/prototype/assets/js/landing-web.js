/* ============================================
   VELARQUE — Landing Web Advanced Animations
   GSAP + ScrollTrigger
   Requires: gsap, ScrollTrigger (loaded in page)
   ============================================ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // ———————————————————————————————————
  // 1. CHARACTER SPLIT — Hero title
  // ———————————————————————————————————
  function initCharSplit() {
    var el = document.querySelector('[data-lw="char-split"]');
    if (!el) return;

    var words = el.querySelectorAll('.hero__word');
    words.forEach(function (word) {
      var text = word.innerHTML;
      // Preserve <em> tags
      var html = '';
      var inTag = false;
      var tagBuffer = '';

      for (var i = 0; i < text.length; i++) {
        var ch = text[i];

        if (ch === '<') {
          inTag = true;
          tagBuffer += ch;
          continue;
        }
        if (inTag) {
          tagBuffer += ch;
          if (ch === '>') {
            inTag = false;
            html += tagBuffer;
            tagBuffer = '';
          }
          continue;
        }

        if (ch === ' ') {
          html += '<span class="lw-char" style="display:inline-block">&nbsp;</span>';
        } else {
          html += '<span class="lw-char" style="display:inline-block">' + ch + '</span>';
        }
      }

      word.innerHTML = html;
    });

    var chars = el.querySelectorAll('.lw-char');
    if (!chars.length) return;

    gsap.set(chars, { opacity: 0, y: 40, rotateX: -90 });

    // Animate after loader (hero animation delay)
    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 0.6,
      stagger: 0.025,
      ease: 'power3.out',
      delay: 0.8,
    });
  }

  // ———————————————————————————————————
  // 2. VELOCITY MARQUEE — scroll-linked speed
  // ———————————————————————————————————
  function initVelocityMarquee() {
    var section = document.querySelector('[data-lw="velocity-marquee"]');
    if (!section) return;
    var track = section.querySelector('.lw-marquee__track');
    if (!track) return;

    // Duplicate content for seamless loop
    track.innerHTML += track.innerHTML;

    var baseSpeed = -1; // px per frame
    var velocityMultiplier = 0;
    var currentX = 0;
    var halfWidth = track.scrollWidth / 2;

    // Track scroll velocity
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) {
        velocityMultiplier = Math.abs(self.getVelocity()) / 800;
      },
    });

    function tick() {
      var speed = baseSpeed * (1 + Math.min(velocityMultiplier, 8));
      currentX += speed;

      // Reset loop
      if (Math.abs(currentX) >= halfWidth) {
        currentX = 0;
      }

      gsap.set(track, { x: currentX });

      // Decay velocity
      velocityMultiplier *= 0.95;

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ———————————————————————————————————
  // 3. HIGHLIGHT SWEEP — yellow on scroll
  // ———————————————————————————————————
  function initHighlightSweep() {
    var highlights = document.querySelectorAll('[data-lw="highlight"]');
    if (!highlights.length) return;

    highlights.forEach(function (hl) {
      ScrollTrigger.create({
        trigger: hl,
        start: 'top 80%',
        onEnter: function () {
          hl.classList.add('is-active');
        },
      });
    });
  }

  // ———————————————————————————————————
  // 4. 3D TILT — solution cards
  // ———————————————————————————————————
  function initTiltCards() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    var cards = document.querySelectorAll('[data-lw="tilt"]');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center',
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  // ———————————————————————————————————
  // 5. STATS — dramatic pin + counter
  // ———————————————————————————————————
  function initStatsDramatic() {
    var section = document.querySelector('[data-lw="stats-pin"]');
    if (!section) return;

    var numbers = section.querySelectorAll('[data-count]');
    if (!numbers.length) return;

    // Animate numbers on scroll with dramatic ease
    numbers.forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var obj = { val: 0 };

      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        once: true,
        onEnter: function () {
          section.classList.add('is-counting');

          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power4.out',
            onUpdate: function () {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            },
          });

          // Scale pulse on each number
          gsap.fromTo(el, { scale: 0.5, opacity: 0 }, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'back.out(1.5)',
          });
        },
      });
    });

    // Stagger labels
    var labels = section.querySelectorAll('.lw-stat__label');
    gsap.fromTo(labels, { opacity: 0, y: 20 }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      },
    });
  }

  // ———————————————————————————————————
  // 6. HORIZONTAL SCROLL — pinned process
  // ———————————————————————————————————
  function initHorizontalScroll() {
    var wrapper = document.querySelector('[data-lw="horizontal-scroll"]');
    if (!wrapper) return;
    var track = wrapper.querySelector('.lw-process__track');
    if (!track) return;

    // Calculate how far to scroll
    function getScrollAmount() {
      return -(track.scrollWidth - window.innerWidth);
    }

    // Only pin on desktop
    if (window.innerWidth < 768) {
      // On mobile, just let it be a scrollable row
      wrapper.style.overflowX = 'auto';
      wrapper.style.webkitOverflowScrolling = 'touch';
      return;
    }

    var tween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
    });

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: function () { return '+=' + Math.abs(getScrollAmount()); },
      pin: true,
      scrub: 1.2,
      animation: tween,
      invalidateOnRefresh: true,
    });

    // Stagger cards entrance
    var cards = track.querySelectorAll('.lw-hstep');
    gsap.fromTo(cards, { opacity: 0, y: 60 }, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 80%',
      },
    });
  }

  // ———————————————————————————————————
  // 7. WORK SECTION — parallax on case images
  // ———————————————————————————————————
  function initCaseParallax() {
    var caseImages = document.querySelectorAll('.lw-case__img img');
    caseImages.forEach(function (img) {
      gsap.to(img, {
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.lw-case'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  }

  // ———————————————————————————————————
  // 8. INCLUDES — stagger items with draw-in line
  // ———————————————————————————————————
  function initIncludesReveal() {
    var items = document.querySelectorAll('.lw-includes__item');
    if (!items.length) return;

    gsap.fromTo(items,
      { opacity: 0, x: 40 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: 'top 75%',
        },
      }
    );
  }

  // ———————————————————————————————————
  // 9. FAQ — smooth open/close
  // ———————————————————————————————————
  function initFaqAnimations() {
    var details = document.querySelectorAll('.faq-item');
    details.forEach(function (detail) {
      detail.addEventListener('toggle', function () {
        var answer = detail.querySelector('.faq-item__a');
        if (!answer) return;

        if (detail.open) {
          gsap.fromTo(answer,
            { opacity: 0, height: 0 },
            { opacity: 1, height: 'auto', duration: 0.4, ease: 'power2.out' }
          );
        }
      });
    });
  }

  // ———————————————————————————————————
  // 10. CONTACT FORM — fields reveal
  // ———————————————————————————————————
  function initContactReveal() {
    var form = document.querySelector('.contact-form');
    if (!form) return;

    var groups = form.querySelectorAll('.contact-form__group, .contact-form__row, .btn-main');
    gsap.fromTo(groups,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: form,
          start: 'top 80%',
        },
      }
    );
  }

  // ———————————————————————————————————
  // MASTER INIT
  // ———————————————————————————————————
  function initAll() {
    initCharSplit();
    initVelocityMarquee();
    initHighlightSweep();
    initTiltCards();
    initStatsDramatic();
    initHorizontalScroll();
    initCaseParallax();
    initIncludesReveal();
    initFaqAnimations();
    initContactReveal();
  }

  // Wait for loader to dismiss (same pattern as animations.js)
  function onPageReady() {
    setTimeout(initAll, 950);
  }

  if (document.readyState === 'complete') {
    onPageReady();
  } else {
    window.addEventListener('load', onPageReady);
  }

})();
