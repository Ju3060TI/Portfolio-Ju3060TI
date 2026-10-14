const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
const list = document.getElementById('projects-list');
const details = document.querySelectorAll('.detail');

function show(target) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
  // reset projects view when leaving/entering
  list.hidden = false;
  details.forEach(d => d.hidden = true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => show(tab.dataset.tab));
});

document.querySelectorAll('[data-goto]').forEach(btn => {
  btn.addEventListener('click', () => show(btn.dataset.goto));
});

// open project detail
document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.project;
    list.hidden = true;
    details.forEach(d => d.hidden = d.dataset.detail !== id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// back to list
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    list.hidden = false;
    details.forEach(d => d.hidden = true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
