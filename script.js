/* ============================================
   FS Data Engineer Roadmap — JavaScript
   Progress tracking, accordion, localStorage
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // INIT
  // ============================================
  document.addEventListener('DOMContentLoaded', () => {
    initAccordions();
    initCheckboxes();
    initSidebarNav();
    initHamburger();
    initScrollAnimations();
    initCodeCopy();
    updateAllProgress();
  });

  // ============================================
  // ACCORDION LOGIC
  // ============================================
  function initAccordions() {
    const headers = document.querySelectorAll('.day-card-header');
    headers.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.day-card');
        const wasOpen = card.classList.contains('open');
        // Close all other cards in same section (optional — remove if want multi-open)
        // card.parentElement.querySelectorAll('.day-card.open').forEach(c => c.classList.remove('open'));
        card.classList.toggle('open', !wasOpen);
      });
    });
  }

  // ============================================
  // CHECKBOX PERSISTENCE
  // ============================================
  const STORAGE_KEY = 'fsde-roadmap-checkboxes';

  function getCheckboxState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function saveCheckboxState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function initCheckboxes() {
    const state = getCheckboxState();
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    checkboxes.forEach(cb => {
      const id = cb.getAttribute('data-id');
      if (id && state[id]) {
        cb.checked = true;
        cb.closest('.checklist-item').classList.add('checked');
      }
      cb.addEventListener('change', () => {
        const st = getCheckboxState();
        st[id] = cb.checked;
        saveCheckboxState(st);
        cb.closest('.checklist-item').classList.toggle('checked', cb.checked);
        updateAllProgress();
        checkDayCompletion(cb);
      });
    });
  }

  // ============================================
  // PROGRESS TRACKING
  // ============================================
  function updateAllProgress() {
    // Overall
    const allCb = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checkedAll = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
    const total = allCb.length;
    const done = checkedAll.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    const overallFill = document.getElementById('overall-progress-fill');
    const overallPct = document.getElementById('overall-progress-pct');
    const overallCount = document.getElementById('overall-progress-count');
    if (overallFill) overallFill.style.width = pct + '%';
    if (overallPct) overallPct.textContent = pct + '%';
    if (overallCount) overallCount.textContent = done + ' of ' + total + ' tasks completed';

    // Per week
    document.querySelectorAll('[data-week]').forEach(section => {
      const week = section.getAttribute('data-week');
      const wAll = section.querySelectorAll('.checklist-item input[type="checkbox"]');
      const wDone = section.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
      const wPct = wAll.length > 0 ? Math.round((wDone.length / wAll.length) * 100) : 0;
      const fill = document.getElementById('week-' + week + '-fill');
      const count = document.getElementById('week-' + week + '-count');
      if (fill) fill.style.width = wPct + '%';
      if (count) count.textContent = wDone.length + '/' + wAll.length;

      // Update nav progress
      const navP = document.querySelector('.nav-link[href="#' + week + '"] .nav-progress');
      if (navP) navP.textContent = wPct + '%';
    });

    // Per day
    document.querySelectorAll('.day-card').forEach(card => {
      const dAll = card.querySelectorAll('.checklist-item input[type="checkbox"]');
      const dDone = card.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
      const mini = card.querySelector('.day-progress-mini');
      if (mini && dAll.length > 0) {
        mini.textContent = dDone.length + '/' + dAll.length;
      }
    });
  }

  // ============================================
  // CONFETTI ON DAY COMPLETION
  // ============================================
  function checkDayCompletion(cb) {
    const card = cb.closest('.day-card');
    if (!card) return;
    const dAll = card.querySelectorAll('.checklist-item input[type="checkbox"]');
    const dDone = card.querySelectorAll('.checklist-item input[type="checkbox"]:checked');
    if (dAll.length > 0 && dAll.length === dDone.length) {
      launchConfetti();
    }
  }

  function launchConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    const colors = ['#4361ee', '#7209b7', '#f72585', '#06d6a0', '#ffd166', '#ff9f1c'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + '%';
      c.style.top = '-10px';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.width = (Math.random() * 8 + 5) + 'px';
      c.style.height = (Math.random() * 8 + 5) + 'px';
      c.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      c.style.animationDelay = Math.random() * 1.5 + 's';
      c.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(c);
    }
    setTimeout(() => container.remove(), 5000);
  }

  // ============================================
  // SIDEBAR NAVIGATION
  // ============================================
  function initSidebarNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    function setActive() {
      let current = '';
      sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= 120) current = s.id;
      });
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();

    // Smooth scroll + close mobile menu
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          document.querySelector('.sidebar').classList.remove('open');
          document.querySelector('.sidebar-overlay').classList.remove('active');
        }
      });
    });
  }

  // ============================================
  // HAMBURGER MENU
  // ============================================
  function initHamburger() {
    const btn = document.getElementById('hamburger');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!btn) return;

    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // ============================================
  // SCROLL ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }

  // ============================================
  // CODE COPY BUTTON
  // ============================================
  function initCodeCopy() {
    document.querySelectorAll('.code-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const pre = btn.closest('.code-block').querySelector('pre');
        if (!pre) return;
        navigator.clipboard.writeText(pre.textContent).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => btn.textContent = 'Copy', 2000);
        });
      });
    });
  }

})();
