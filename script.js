/* ============================================================
   Tabs + Project Detail
   ============================================================ */
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

/* ============================================================
   GitHub Repos — Live Load
   ============================================================ */
const GH_USER = 'Ju3060TI';
const GH_API = `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=12`;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function renderRepos(repos) {
  return repos.map(repo => `
    <a class="repo-card" href="${repo.html_url}" target="_blank" rel="noopener">
      <div class="repo-head">
        <h4>${escapeHtml(repo.name)}</h4>
        ${repo.language ? `<span class="repo-lang">${escapeHtml(repo.language)}</span>` : ''}
      </div>
      <p class="repo-desc">${escapeHtml(repo.description || 'No description provided.')}</p>
      <div class="repo-foot">
        <span class="repo-meta">★ ${repo.stargazers_count} · ${repo.forks_count} forks</span>
        <span class="repo-link">View on GitHub →</span>
      </div>
    </a>
  `).join('');
}

function renderFallback() {
  const items = [
    { name: 'NERON-AI',          lang: 'Rust', desc: 'Custom inference engine built around a Sparse Mixture-of-Experts architecture.' },
    { name: 'MaJuTiKi-Blocks',   lang: 'C#',   desc: '3D voxel & automation engine on Vulkan. Infinite worlds, delta-stored.' },
    { name: 'Solis-Shaders',     lang: 'GLSL', desc: 'Modular real-time shader collection with a shared lighting core.' }
  ];
  return items.map(r => `
    <div class="repo-card fallback">
      <div class="repo-head">
        <h4>${escapeHtml(r.name)}</h4>
        <span class="repo-lang">${escapeHtml(r.lang)}</span>
      </div>
      <p class="repo-desc">${escapeHtml(r.desc)}</p>
      <div class="repo-foot">
        <span class="repo-meta">Unavailable</span>
        <span class="repo-link">GitHub unreachable</span>
      </div>
    </div>
  `).join('');
}

async function loadRepos() {
  const container = document.getElementById('github-repos');
  if (!container) return;

  container.innerHTML = `<div class="repo-loading">Loading repositories…</div>`;

  try {
    const res = await fetch(GH_API, {
      headers: { 'Accept': 'application/vnd.github+json' }
    });

    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);

    const repos = await res.json();
    const filtered = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    if (!filtered.length) throw new Error('No public repositories');

    container.innerHTML = renderRepos(filtered);
  } catch (err) {
    console.warn('[GitHub] Falling back to placeholders:', err.message);
    container.innerHTML = renderFallback();
  }
}

loadRepos();
