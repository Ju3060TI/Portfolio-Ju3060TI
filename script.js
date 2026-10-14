/* ============================================================
   TABS
   ============================================================ */
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function showTab(target) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));

  const list = document.getElementById('projects-list');
  const details = document.querySelectorAll('.detail');
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

/* ============================================================
   PROJECT DETAIL VIEW
   ============================================================ */
const projectsList = document.getElementById('projects-list');
const detailViews = document.querySelectorAll('.detail');

document.querySelectorAll('.item').forEach(item => {
  item.addEventListener('click', () => {
    const id = item.dataset.project;
    if (!id) return;
    if (projectsList) projectsList.hidden = true;
    detailViews.forEach(d => {
      d.hidden = d.dataset.detail !== id;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (projectsList) projectsList.hidden = false;
    detailViews.forEach(d => d.hidden = true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/* ============================================================
   GITHUB REPOS
   ============================================================ */
const GH_USER = 'Ju3060TI';
const GH_API = `https://api.github.com/users/${GH_USER}/repos?sort=updated&per_page=12`;

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
    { name: 'NERON-AI',        lang: 'Rust', desc: 'Custom inference engine built around a Sparse Mixture-of-Experts architecture.' },
    { name: 'MaJuTiKi-Blocks', lang: 'C#',   desc: '3D voxel & automation engine on Vulkan. Infinite worlds, delta-stored.' },
    { name: 'Solis-Shaders',   lang: 'GLSL', desc: 'Modular real-time shader collection with a shared lighting core.' }
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
    console.warn('[GitHub] Fallback:', err.message);
    container.innerHTML = renderFallback();
  }
}

loadRepos();

/* ============================================================
   DRIVE FOLDER BROWSER
   ============================================================ */
const DRIVE = {
  name: 'Portfolio Ju3060TI',
  folders: [
    {
      name: 'Builds',
      folders: [
        {
          name: 'AI',
          folders: [
            { name: 'Neron', folders: [] }
          ]
        },
        {
          name: 'Games',
          folders: [
            { name: 'MaJuTiKi',               folders: [] },
            { name: 'MaJuTiKi: Blocks',       folders: [] },
            { name: 'MaJuTiKi: Fragment',     folders: [] },
            { name: 'MaJuTiKi: Hollow Creek', folders: [] }
          ]
        },
        {
          name: 'Websites',
          folders: [
            { name: 'FlareChat',              folders: [] },
            { name: 'Mörser-Karl-GX-Browser', folders: [] }
          ]
        }
      ]
    },
    {
      name: 'Screenshots / Videos',
      folders: [
        { name: 'Screenshots', folders: [] },
        { name: 'Videos',      folders: [] }
      ]
    },
    { name: 'Archive', folders: [] }
  ]
};

const crumbEl = document.getElementById('drive-crumb');
const contentEl = document.getElementById('drive-content');

let driveStack = [DRIVE];

function renderDrive() {
  if (!crumbEl || !contentEl) return;

  const current = driveStack[driveStack.length - 1];

  // Breadcrumb
  let crumbHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
    My Drive
  `;

  driveStack.forEach((node, i) => {
    const isLast = i === driveStack.length - 1;
    crumbHTML += `<span class="drive-sep">/</span>`;
    if (isLast) {
      crumbHTML += `<span class="drive-crumb-current">${escapeHtml(node.name)}</span>`;
    } else {
      crumbHTML += `<button class="drive-crumb-btn" data-depth="${i}">${escapeHtml(node.name)}</button>`;
    }
  });

  crumbEl.innerHTML = crumbHTML;

  // Content
  if (!current.folders || !current.folders.length) {
    contentEl.innerHTML = `<div class="drive-empty">This folder is empty.</div>`;
  } else {
    contentEl.innerHTML = `
      <div class="drive-folders">
        ${current.folders.map((f, i) => `
          <button class="drive-item" data-index="${i}">
            <span class="drive-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
              </svg>
            </span>
            <span class="drive-name">${escapeHtml(f.name)}</span>
          </button>
        `).join('')}
      </div>
    `;

    contentEl.querySelectorAll('.drive-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        driveStack.push(current.folders[idx]);
        renderDrive();
      });
    });
  }

  // Breadcrumb click → jump up
  crumbEl.querySelectorAll('.drive-crumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const depth = parseInt(btn.dataset.depth, 10);
      driveStack = driveStack.slice(0, depth + 1);
      renderDrive();
    });
  });
}

renderDrive();
