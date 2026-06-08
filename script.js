/* ============================================
   VELLO & CO. — script.js
   ============================================ */

(function () {
  'use strict';

  /* ---- NAVBAR ---- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll(
    '.reveal-fade, .reveal-up, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- MENU CARD STAGGER ---- */
  const menuCards = document.querySelectorAll('.menu-card');
  const menuObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        menuObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  menuCards.forEach(card => menuObserver.observe(card));

  /* ---- SPECIALS CAROUSEL ---- */
  const track    = document.getElementById('specialsTrack');
  const btnPrev  = document.getElementById('specPrev');
  const btnNext  = document.getElementById('specNext');

  if (track && btnNext && btnPrev) {
    const cardWidth = () => {
      const first = track.querySelector('.special-card');
      return first ? first.offsetWidth + 24 : 364;
    };

    btnNext.addEventListener('click', () => {
      track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
    });
    btnPrev.addEventListener('click', () => {
      track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
    });

    /* drag-to-scroll */
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX    = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mouseup',    () => { isDown = false; track.classList.remove('dragging'); });
    track.addEventListener('mousemove',  (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = scrollLeft - walk;
    });
  }

  /* ---- FORM VALIDATION ---- */
  const form        = document.getElementById('reserveForm');
  const successBox  = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (form) {
    const fields = {
      fname : { el: document.getElementById('fname'),  err: document.getElementById('fnameError'),  msg: 'Please enter your name.' },
      email : { el: document.getElementById('email'),  err: document.getElementById('emailError'),  msg: 'Please enter a valid email.' },
      rdate : { el: document.getElementById('rdate'),  err: document.getElementById('rdateError'),  msg: 'Please select a date.' },
      rtime : { el: document.getElementById('rtime'),  err: document.getElementById('rtimeError'),  msg: 'Please select a time.' },
    };

    const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const clearError = (f) => {
      f.el.classList.remove('error');
      f.err.textContent = '';
    };
    const setError = (f) => {
      f.el.classList.add('error');
      f.err.textContent = f.msg;
    };

    Object.values(fields).forEach(f => {
      f.el.addEventListener('input', () => clearError(f));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      Object.entries(fields).forEach(([key, f]) => {
        const val = f.el.value.trim();
        if (!val || (key === 'email' && !validateEmail(val))) {
          setError(f);
          valid = false;
        } else {
          clearError(f);
        }
      });

      if (!valid) return;

      /* Simulate submission */
      const label = submitBtn.querySelector('.btn-label');
      label.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.querySelectorAll('input, textarea').forEach(el => el.value = '');
        label.textContent = 'Confirm Reservation';
        submitBtn.disabled = false;
        successBox.classList.add('visible');
        setTimeout(() => successBox.classList.remove('visible'), 5000);
      }, 1200);
    });
  }

  /* ---- ACTIVE NAV LINK HIGHLIGHT ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links .nav-link:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

})();
