const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const list = document.getElementById('projects-list');
const details = document.querySelectorAll('.detail');

function showTab(target) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));

  if (list) list.hidden = false;
  details.forEach(d => d.hidden = true);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
});

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => showTab(btn.dataset.goto));
});

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

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (list) list.hidden = false;
    details.forEach(d => d.hidden = true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
