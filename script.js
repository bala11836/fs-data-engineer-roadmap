document.addEventListener('DOMContentLoaded', () => {
  // ===== ACCORDION =====
  document.querySelectorAll('.day-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.day-card');
      card.classList.toggle('open');
    });
  });

  // ===== CHECKBOX PERSISTENCE =====
  const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  checkboxes.forEach(cb => {
    const key = 'cb_' + cb.id;
    cb.checked = localStorage.getItem(key) === 'true';
    if (cb.checked) cb.closest('.check-item').classList.add('checked');
    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked);
      cb.closest('.check-item').classList.toggle('checked', cb.checked);
      updateProgress();
    });
  });

  // ===== PROGRESS =====
  function updateProgress() {
    const all = document.querySelectorAll('.check-item input[type="checkbox"]');
    const done = [...all].filter(c => c.checked).length;
    const pct = all.length ? Math.round((done / all.length) * 100) : 0;
    const fill = document.getElementById('overall-fill');
    const label = document.getElementById('overall-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + ' / ' + all.length + ' tasks (' + pct + '%)';

    // Phase progress
    document.querySelectorAll('.phase-section').forEach(section => {
      const sCbs = section.querySelectorAll('.check-item input[type="checkbox"]');
      const sDone = [...sCbs].filter(c => c.checked).length;
      const sPct = sCbs.length ? Math.round((sDone / sCbs.length) * 100) : 0;
      const pFill = section.querySelector('.phase-progress-fill');
      const pLabel = section.querySelector('.phase-progress-label');
      if (pFill) pFill.style.width = sPct + '%';
      if (pLabel) pLabel.textContent = sDone + '/' + sCbs.length + ' (' + sPct + '%)';
    });
  }
  updateProgress();

  // ===== COPY TO CLIPBOARD =====
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const promptText = btn.closest('.prompt-block').querySelector('.prompt-text').textContent;
      navigator.clipboard.writeText(promptText).then(() => {
        btn.textContent = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = '📋 Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });

  // ===== SIDEBAR NAV =====
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(item.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile sidebar
      document.querySelector('.sidebar').classList.remove('open');
      document.querySelector('.overlay').classList.remove('open');
    });
  });

  // ===== HAMBURGER =====
  const hamburger = document.querySelector('.hamburger');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.overlay');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // ===== SEARCH =====
  const searchBox = document.getElementById('search');
  if (searchBox) {
    searchBox.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.day-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // ===== EXAM COUNTDOWN =====
  function updateCountdowns() {
    const now = new Date();
    const exams = [
      { id: 'countdown-mcq1', date: new Date('2026-07-30') },
      { id: 'countdown-mcq2', date: new Date('2026-09-02') },
      { id: 'countdown-hon', date: new Date('2026-09-03') },
    ];
    exams.forEach(exam => {
      const el = document.getElementById(exam.id);
      if (el) {
        const diff = Math.ceil((exam.date - now) / (1000*60*60*24));
        el.textContent = diff > 0 ? diff + ' days left' : (diff === 0 ? 'TODAY!' : 'Done');
      }
    });
  }
  updateCountdowns();
});
