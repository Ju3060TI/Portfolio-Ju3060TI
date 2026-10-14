// ---------- TABS ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

// ---------- PROJECTS ----------
const list = document.getElementById('projects-list');
const details = document.querySelectorAll('.detail');

// ---------- TAB SWITCHING ----------
function showTab(target) {
  // Tabs umschalten
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
  // Panels umschalten
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));

  // Projekt-Detail zurücksetzen: immer Liste zeigen
  if (list) list.hidden = false;
  details.forEach(d => d.hidden = true);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Tab-Buttons
tabs.forEach(tab => {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
});

// Buttons im Home-Panel ("View projects", "Downloads")
document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.goto));
});

// ---------- PROJECT DETAIL OPEN ----------
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.project;
    if (!id) return;
    if (list) list.hidden = true;
    details.forEach(d => {
      d.hidden = d.dataset.detail !== id;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ---------- PROJECT DETAIL CLOSE (Back-Button) ----------
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (list) list.hidden = false;
    details.forEach(d => d.hidden = true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
