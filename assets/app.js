(function () {
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function initTheme() {
    const saved = localStorage.getItem('mp-theme') || 'light';
    applyTheme(saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('mp-theme', next);
    applyTheme(next);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

    const hintBtn = document.getElementById('hint-btn');
    const hintPanel = document.getElementById('hint-panel');
    if (hintBtn && hintPanel) {
      hintBtn.addEventListener('click', function () {
        hintPanel.classList.toggle('visible');
      });
    }
  });
})();
