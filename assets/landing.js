/* ============================================
   VELARQUE — Premium Landing JS
   ============================================ */

(function () {
  'use strict';

  // --- LOADER ---
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2200);
  });
  document.body.style.overflow = 'hidden';

  // --- CUSTOM CURSOR ---
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  document.querySelectorAll('a, button, .work-card, .solution-card, details summary').forEach(el => {
    el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
    el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
  });

  // --- NAV ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav__links--open');
    navToggle.classList.toggle('nav__toggle--open');
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.classList.remove('nav__links--open');
        navToggle.classList.remove('nav__toggle--open');
      }
    });
  });

  // --- SCROLL REVEAL ---
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.reveal-text, .reveal-up, .process-step').forEach(el => {
    revealObserver.observe(el);
  });

  // Includes items staggered reveal
  const includesObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.includes__item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('visible'), i * 100);
        });
        includesObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const includesRight = document.querySelector('.includes__right');
  if (includesRight) includesObserver.observe(includesRight);

  // --- HORIZONTAL DRAG SLIDER ---
  const slider = document.getElementById('workSlider');
  if (slider) {
    const track = slider.querySelector('.work__track');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].pageX;
      touchScrollLeft = slider.scrollLeft;
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      const x = e.touches[0].pageX;
      const walk = (touchStartX - x) * 1.2;
      slider.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });

    // Make slider scrollable
    slider.style.overflowX = 'auto';
    slider.style.scrollbarWidth = 'none';
    slider.style.msOverflowStyle = 'none';
  }

  // --- PARALLAX ON SOLUTION CARDS ---
  const parallaxCards = document.querySelectorAll('[data-parallax]');
  if (parallaxCards.length && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxCards.forEach(card => {
        const speed = parseFloat(card.dataset.parallax);
        const rect = card.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * speed;
        card.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  // --- MAGNETIC BUTTONS ---
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

})();
