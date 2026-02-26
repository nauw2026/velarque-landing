/* ============================================
   VELARQUE — Landing Web Advanced Animations
   Hero Paths + Scroll-Driven Motion System
   Requires: gsap, ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // ═══════════════════════════════════════════
  // 1. HERO — SVG Flowing Paths (BackgroundPaths)
  // ═══════════════════════════════════════════
  function generateHeroPaths() {
    var container = document.getElementById('heroPaths');
    if (!container) return;

    function createPathSet(position) {
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 696 316');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';

      var paths = [];
      for (var i = 0; i < 36; i++) {
        var p = position;
        var d = 'M-' + (380 - i * 5 * p) + ' -' + (189 + i * 6)
              + 'C-' + (380 - i * 5 * p) + ' -' + (189 + i * 6)
              + ' -' + (312 - i * 5 * p) + ' ' + (216 - i * 6)
              + ' ' + (152 - i * 5 * p) + ' ' + (343 - i * 6)
              + 'C' + (616 - i * 5 * p) + ' ' + (470 - i * 6)
              + ' ' + (684 - i * 5 * p) + ' ' + (875 - i * 6)
              + ' ' + (684 - i * 5 * p) + ' ' + (875 - i * 6);

        var pathEl = document.createElementNS(svgNS, 'path');
        pathEl.setAttribute('d', d);
        pathEl.setAttribute('stroke', '#0a0a0a');
        pathEl.setAttribute('stroke-width', String(0.5 + i * 0.03));
        pathEl.setAttribute('stroke-opacity', String(Math.min(0.1 + i * 0.03, 1)));
        svg.appendChild(pathEl);
        paths.push(pathEl);
      }

      container.appendChild(svg);
      return paths;
    }

    var leftPaths = createPathSet(1);
    var rightPaths = createPathSet(-1);
    var allPaths = leftPaths.concat(rightPaths);

    // Animate each path — flowing stroke dash
    allPaths.forEach(function (path) {
      var len = path.getTotalLength();
      var dashLen = len * 0.3;

      path.style.strokeDasharray = dashLen + ' ' + (len - dashLen);
      path.style.strokeDashoffset = '0';

      // Flow animation — endless cycling
      gsap.to(path, {
        strokeDashoffset: -len,
        duration: 20 + Math.random() * 10,
        ease: 'none',
        repeat: -1,
      });

      // Subtle opacity breathe
      var baseOpacity = parseFloat(path.getAttribute('stroke-opacity'));
      gsap.to(path, {
        strokeOpacity: Math.min(baseOpacity * 1.8, 0.8),
        duration: 8 + Math.random() * 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 4,
      });
    });
  }

  // ═══════════════════════════════════════════
  // 2. HERO — Character split with spring physics
  // ═══════════════════════════════════════════
  function initCharSplit() {
    var el = document.querySelector('[data-lw="char-split"]');
    if (!el) return;

    var words = el.querySelectorAll('.hero__word');
    words.forEach(function (word) {
      var text = word.innerHTML;
      var html = '';
      var inTag = false;
      var tagBuffer = '';

      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        if (ch === '<') { inTag = true; tagBuffer += ch; continue; }
        if (inTag) {
          tagBuffer += ch;
          if (ch === '>') { inTag = false; html += tagBuffer; tagBuffer = ''; }
          continue;
        }
        if (ch === ' ') {
          html += '<span class="lw-char">&nbsp;</span>';
        } else {
          html += '<span class="lw-char">' + ch + '</span>';
        }
      }
      word.innerHTML = html;
    });

    var chars = el.querySelectorAll('.lw-char');
    if (!chars.length) return;

    gsap.set(chars, { opacity: 0, y: 100, rotateX: -90 });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.2,
      stagger: 0.03,
      ease: 'back.out(1.7)',
      delay: 0.6,
    });
  }

  // ═══════════════════════════════════════════
  // 3. HERO — Description + scroll + path parallax
  // ═══════════════════════════════════════════
  function initHeroSecondary() {
    var desc = document.querySelector('.lw-hero .hero__desc');
    if (desc) {
      gsap.fromTo(desc,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.8 }
      );
    }

    var scroll = document.querySelector('.lw-hero .hero__scroll');
    if (scroll) {
      gsap.fromTo(scroll, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.4 });
    }

    // Parallax the paths on scroll — creates depth
    var paths = document.getElementById('heroPaths');
    if (paths) {
      gsap.to(paths, {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: '.lw-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }
  }

  // ═══════════════════════════════════════════
  // 4. VELOCITY MARQUEE — with dynamic skew
  // ═══════════════════════════════════════════
  function initVelocityMarquee() {
    var section = document.querySelector('[data-lw="velocity-marquee"]');
    if (!section) return;
    var track = section.querySelector('.lw-marquee__track');
    if (!track) return;

    // Duplicate for seamless loop
    track.innerHTML += track.innerHTML;

    var baseSpeed = -1.5;
    var velocityMultiplier = 0;
    var currentX = 0;
    var currentSkew = 0;
    var halfWidth = track.scrollWidth / 2;

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) {
        var vel = self.getVelocity();
        velocityMultiplier = Math.abs(vel) / 600;
        // Skew in scroll direction
        var targetSkew = Math.min(Math.max(vel / 400, -5), 5);
        currentSkew += (targetSkew - currentSkew) * 0.08;
      },
    });

    function tick() {
      var speed = baseSpeed * (1 + Math.min(velocityMultiplier, 10));
      currentX += speed;
      if (Math.abs(currentX) >= halfWidth) currentX = 0;

      currentSkew *= 0.96;
      velocityMultiplier *= 0.94;

      gsap.set(track, { x: currentX, skewX: currentSkew });
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════
  // 5. PAIN POINTS — word-by-word scrub + highlights
  // ═══════════════════════════════════════════
  function initPainReveal() {
    var title = document.querySelector('.lw-pain__title');
    if (title) {
      // Recursively wrap text nodes in .lw-word spans
      function wrapWords(el) {
        var nodes = Array.from(el.childNodes);
        nodes.forEach(function (node) {
          if (node.nodeType === 3) {
            var parts = node.textContent.split(/(\s+)/);
            var frag = document.createDocumentFragment();
            parts.forEach(function (p) {
              if (/\S/.test(p)) {
                var span = document.createElement('span');
                span.className = 'lw-word';
                span.textContent = p;
                frag.appendChild(span);
              } else if (p) {
                frag.appendChild(document.createTextNode(p));
              }
            });
            node.parentNode.replaceChild(frag, node);
          } else if (node.nodeType === 1) {
            wrapWords(node);
          }
        });
      }

      wrapWords(title);

      var wordSpans = title.querySelectorAll('.lw-word');
      if (wordSpans.length) {
        gsap.set(wordSpans, { opacity: 0.12 });
        gsap.to(wordSpans, {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: 1,
          },
        });
      }
    }

    // Highlight sweep
    var highlights = document.querySelectorAll('[data-lw="highlight"]');
    highlights.forEach(function (hl) {
      ScrollTrigger.create({
        trigger: hl,
        start: 'top 75%',
        onEnter: function () { hl.classList.add('is-active'); },
      });
    });

    // Subtitle — simple reveal
    var subtitle = document.querySelector('.lw-pain__subtitle');
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: subtitle, start: 'top 85%' },
        }
      );
    }
  }

  // ═══════════════════════════════════════════
  // 6. SOLUTION CARDS — cinematic entrance + 3D tilt
  // ═══════════════════════════════════════════
  function initSolutionCards() {
    var cards = document.querySelectorAll('.lw-solution-card');
    if (!cards.length) return;

    // Cinematic entrance from different angles
    var entrances = [
      { x: -80, y: 80, rotation: -5 },
      { x: 0, y: 120, rotation: 0 },
      { x: 80, y: 80, rotation: 5 },
    ];

    cards.forEach(function (card, i) {
      var from = entrances[i] || entrances[1];
      gsap.fromTo(card,
        { opacity: 0, x: from.x, y: from.y, rotation: from.rotation, scale: 0.88 },
        {
          opacity: 1, x: 0, y: 0, rotation: 0, scale: 1,
          duration: 1.4, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        }
      );
    });

    // 3D tilt on hover (desktop only)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;

        gsap.to(card, {
          rotateX: (y - 0.5) * -12,
          rotateY: (x - 0.5) * 12,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
          transformOrigin: 'center center',
        });

        // Parallax inner content for depth
        var content = card.querySelector('.lw-solution-card__content');
        if (content) {
          gsap.to(content, {
            x: (x - 0.5) * 10,
            y: (y - 0.5) * 10,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.8, ease: 'elastic.out(1, 0.4)',
        });
        var content = card.querySelector('.lw-solution-card__content');
        if (content) {
          gsap.to(content, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
        }
      });
    });
  }

  // ═══════════════════════════════════════════
  // 7. STATS — dramatic scale + blur entrance
  // ═══════════════════════════════════════════
  function initStatsDramatic() {
    var section = document.querySelector('[data-lw="stats-pin"]');
    if (!section) return;

    var numbers = section.querySelectorAll('[data-lw-count]');
    if (!numbers.length) return;

    numbers.forEach(function (el, i) {
      var target = parseFloat(el.getAttribute('data-lw-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (String(target).split('.')[1] || '').length;
      var obj = { val: 0 };

      // Start state: large, blurred, invisible
      gsap.set(el, { scale: 2.5, opacity: 0, filter: 'blur(12px)' });

      ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        once: true,
        onEnter: function () {
          // Scale + deblur
          gsap.to(el, {
            scale: 1, opacity: 1, filter: 'blur(0px)',
            duration: 1, ease: 'power4.out',
            delay: i * 0.15,
          });

          // Counter
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power4.out',
            delay: i * 0.15 + 0.3,
            onUpdate: function () {
              el.textContent = prefix + obj.val.toFixed(decimals) + suffix;
            },
          });
        },
      });
    });

    // Labels stagger
    var labels = section.querySelectorAll('.lw-stat__label');
    gsap.fromTo(labels,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 65%' },
      }
    );
  }

  // ═══════════════════════════════════════════
  // 8. HORIZONTAL SCROLL — with progress bar
  // ═══════════════════════════════════════════
  function initHorizontalScroll() {
    var wrapper = document.querySelector('[data-lw="horizontal-scroll"]');
    if (!wrapper) return;
    var track = wrapper.querySelector('.lw-process__track');
    if (!track) return;

    // Mobile: native horizontal scroll
    if (window.innerWidth < 768) {
      wrapper.style.overflowX = 'auto';
      wrapper.style.webkitOverflowScrolling = 'touch';
      return;
    }

    // Create progress bar
    var bar = document.createElement('div');
    bar.className = 'lw-process__progress';
    var fill = document.createElement('div');
    fill.className = 'lw-process__progress-fill';
    bar.appendChild(fill);
    wrapper.insertBefore(bar, track);

    function getScrollAmount() {
      return -(track.scrollWidth - window.innerWidth);
    }

    var tween = gsap.to(track, { x: getScrollAmount, ease: 'none' });

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: function () { return '+=' + Math.abs(getScrollAmount()); },
      pin: true,
      scrub: 1,
      animation: tween,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        gsap.set(fill, { scaleX: self.progress });
      },
    });

    // Cards entrance
    var cards = track.querySelectorAll('.lw-hstep');
    gsap.fromTo(cards,
      { opacity: 0, y: 60, scale: 0.92 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: wrapper, start: 'top 80%' },
      }
    );
  }

  // ═══════════════════════════════════════════
  // 9. WORK — case image parallax + tag entrance
  // ═══════════════════════════════════════════
  function initCaseAnimations() {
    var caseImages = document.querySelectorAll('.lw-case__img img');
    caseImages.forEach(function (img) {
      gsap.set(img, { scale: 1.15 });
      gsap.to(img, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.lw-case'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });

    // Tags slide in
    var tags = document.querySelectorAll('.lw-case__tag');
    tags.forEach(function (tag) {
      gsap.fromTo(tag,
        { opacity: 0, x: -20, scale: 0.8 },
        {
          opacity: 1, x: 0, scale: 1,
          duration: 0.6, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: tag.closest('.lw-case'), start: 'top 75%' },
        }
      );
    });

    // Metrics count up
    var metricVals = document.querySelectorAll('.lw-case__metric-val');
    metricVals.forEach(function (val) {
      gsap.fromTo(val,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: val.closest('.lw-case'), start: 'top 70%' },
        }
      );
    });
  }

  // ═══════════════════════════════════════════
  // 10. TESTIMONIAL — marks + word reveal + author
  // ═══════════════════════════════════════════
  function initTestimonialReveal() {
    var testimonial = document.querySelector('[data-lw="testimonial"]');
    if (!testimonial) return;

    // Quote marks — dramatic scale + rotation
    var marks = testimonial.querySelector('.testimonial__marks');
    if (marks) {
      gsap.fromTo(marks,
        { scale: 4, opacity: 0, rotation: -25 },
        {
          scale: 1, opacity: 1, rotation: 0,
          duration: 1.4, ease: 'power4.out',
          scrollTrigger: { trigger: testimonial, start: 'top 80%' },
        }
      );
    }

    // Text — word-by-word scrubbed opacity
    var text = testimonial.querySelector('.testimonial__text');
    if (text) {
      var content = text.textContent.trim();
      var textWords = content.split(/\s+/);
      text.innerHTML = textWords.map(function (w) {
        return '<span class="lw-tword">' + w + '&nbsp;</span>';
      }).join('');

      var tWords = text.querySelectorAll('.lw-tword');
      gsap.set(tWords, { opacity: 0.1 });
      gsap.to(tWords, {
        opacity: 1,
        stagger: 0.04,
        ease: 'none',
        scrollTrigger: {
          trigger: text,
          start: 'top 78%',
          end: 'bottom 55%',
          scrub: 1,
        },
      });
    }

    // Author — slide up
    var author = testimonial.querySelector('.testimonial__author');
    if (author) {
      gsap.fromTo(author,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: author, start: 'top 90%' },
        }
      );
    }
  }

  // ═══════════════════════════════════════════
  // 11. INCLUDES — stagger with rotation
  // ═══════════════════════════════════════════
  function initIncludesReveal() {
    var section = document.querySelector('.lw-includes');
    if (!section) return;

    // Left side: elements cascade up
    var left = section.querySelector('.lw-includes__left');
    if (left) {
      gsap.fromTo(Array.from(left.children),
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }

    // Price amount pop
    var price = section.querySelector('.lw-includes__price-amount');
    if (price) {
      gsap.fromTo(price,
        { scale: 0.5, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }

    // Right items: slide from right with micro rotation
    var items = section.querySelectorAll('.lw-includes__item');
    if (items.length) {
      gsap.fromTo(items,
        { opacity: 0, x: 60, rotation: 2 },
        {
          opacity: 1, x: 0, rotation: 0,
          duration: 0.6, stagger: 0.06, ease: 'power3.out',
          scrollTrigger: { trigger: items[0], start: 'top 85%' },
        }
      );
    }
  }

  // ═══════════════════════════════════════════
  // 12. FAQ — smooth GSAP height animation
  // ═══════════════════════════════════════════
  function initFaqSmooth() {
    var items = document.querySelectorAll('.faq-item');

    items.forEach(function (item) {
      var answer = item.querySelector('.faq-item__a');
      var summary = item.querySelector('summary');
      if (!answer || !summary) return;

      // Set answer overflow
      answer.style.overflow = 'hidden';

      // Non-open items: collapse
      if (!item.open) {
        answer.style.height = '0px';
        answer.style.opacity = '0';
      }

      summary.addEventListener('click', function (e) {
        e.preventDefault();

        if (item.open) {
          // Animate close
          gsap.to(answer, {
            height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut',
            onComplete: function () { item.open = false; },
          });
        } else {
          // Animate open
          answer.style.height = '0px';
          answer.style.opacity = '0';
          item.open = true;
          var targetH = answer.scrollHeight;
          gsap.fromTo(answer,
            { height: 0, opacity: 0 },
            {
              height: targetH, opacity: 1, duration: 0.5, ease: 'power3.out',
              onComplete: function () { answer.style.height = 'auto'; },
            }
          );
        }
      });
    });

    // FAQ items entrance stagger
    var faqList = document.querySelector('.faq__list');
    if (faqList) {
      gsap.fromTo(items,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: faqList, start: 'top 80%' },
        }
      );
    }
  }

  // ═══════════════════════════════════════════
  // 13. CONTACT — cascade reveal
  // ═══════════════════════════════════════════
  function initContactCascade() {
    // Left side — slide from left
    var left = document.querySelector('.lw-contact__left');
    if (left) {
      gsap.fromTo(Array.from(left.children),
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          scrollTrigger: { trigger: left, start: 'top 80%' },
        }
      );
    }

    // Form fields — cascade from right
    var form = document.querySelector('.contact-form');
    if (form) {
      var els = form.querySelectorAll('.contact-form__group, .contact-form__row, .btn-main, .contact-form__note');
      gsap.fromTo(els,
        { opacity: 0, x: 60, rotation: 1 },
        {
          opacity: 1, x: 0, rotation: 0,
          duration: 0.7, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: form, start: 'top 80%' },
        }
      );
    }
  }

  // ═══════════════════════════════════════════
  // 14. FOOTER — cascade links
  // ═══════════════════════════════════════════
  function initFooterReveal() {
    var footer = document.querySelector('.footer');
    if (!footer) return;

    var brand = footer.querySelector('.footer__brand');
    if (brand) {
      gsap.fromTo(brand,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: footer, start: 'top 92%' },
        }
      );
    }

    var cols = footer.querySelectorAll('.footer__col');
    gsap.fromTo(cols,
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 92%' },
      }
    );

    // Individual links cascade within each column
    cols.forEach(function (col) {
      var links = col.querySelectorAll('a, span:not(.footer__col-title)');
      gsap.fromTo(links,
        { opacity: 0, x: -10 },
        {
          opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out',
          scrollTrigger: { trigger: col, start: 'top 95%' },
        }
      );
    });
  }

  // ═══════════════════════════════════════════
  // MASTER INIT
  // ═══════════════════════════════════════════
  function initAll() {
    generateHeroPaths();
    initCharSplit();
    initHeroSecondary();
    initVelocityMarquee();
    initPainReveal();
    initSolutionCards();
    initStatsDramatic();
    initHorizontalScroll();
    initCaseAnimations();
    initTestimonialReveal();
    initIncludesReveal();
    initFaqSmooth();
    initContactCascade();
    initFooterReveal();
  }

  // Wait for loader (animations.js fires at 900ms, we fire at 950ms)
  function onPageReady() {
    setTimeout(initAll, 950);
  }

  if (document.readyState === 'complete') {
    onPageReady();
  } else {
    window.addEventListener('load', onPageReady);
  }

})();
