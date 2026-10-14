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

/* ============================================================
   Drive Folder Browser
   ============================================================
   Add `link` to any folder object to point a specific tile to
   its real Drive subfolder. If omitted, the root link is used.
   ============================================================ */
const ROOT_LINK = 'https://drive.google.com/drive/folders/17yMk3H0MnS5oIw4Ntv57aWh6cFB37Wpw?usp=sharing';

const DRIVE = {
  name: 'Portfolio Ju3060TI',
  link: ROOT_LINK,
  folders: [
    {
      name: 'Builds',
      link: ROOT_LINK,
      folders: [
        {
          name: 'AI',
          link: ROOT_LINK,
          folders: [
            { name: 'Neron', link: ROOT_LINK, folders: [] }
          ]
        },
        {
          name: 'Games',
          link: ROOT_LINK,
          folders: [
            { name: 'MaJuTiKi',               link: ROOT_LINK, folders: [] },
            { name: 'MaJuTiKi: Blocks',       link: ROOT_LINK, folders: [] },
            { name: 'MaJuTiKi: Fragment',     link: ROOT_LINK, folders: [] },
            { name: 'MaJuTiKi: Hollow Creek', link: ROOT_LINK, folders: [] }
          ]
        },
        {
          name: 'Websites',
          link: ROOT_LINK,
          folders: [
            { name: 'FlareChat',              link: ROOT_LINK, folders: [] },
            { name: 'Mörser-Karl-GX-Browser', link: ROOT_LINK, folders: [] }
          ]
        }
      ]
    },
    {
      name: 'Screenshots / Videos',
      link: ROOT_LINK,
      folders: [
        { name: 'Screenshots', link: ROOT_LINK, folders: [] },
        { name: 'Videos',      link: ROOT_LINK, folders: [] }
      ]
    },
    {
      name: 'Archive',
      link: ROOT_LINK,
      folders: []
    }
  ]
};

const crumbEl = document.getElementById('drive-crumb');
const contentEl = document.getElementById('drive-content');

let currentStack = [DRIVE];

function renderDrive() {
  if (!crumbEl || !contentEl) return;

  const current = currentStack[currentStack.length - 1];

  // Breadcrumb
  let crumbHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>
    </svg>
    My Drive
  `;

  currentStack.forEach((node, i) => {
    const isLast = i === currentStack.length - 1;
    crumbHTML += `<span class="drive-sep">/</span>`;
    if (isLast) {
      crumbHTML += `<span class="drive-crumb-current">${escapeHtml(node.name)}</span>`;
    } else {
      crumbHTML += `<button class="drive-crumb-btn" data-depth="${i}">${escapeHtml(node.name)}</button>`;
    }
  });

  crumbEl.innerHTML = crumbHTML;

  // Content — folders or empty
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

    // Folder click → navigate deeper
    contentEl.querySelectorAll('.drive-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        currentStack.push(current.folders[idx]);
        renderDrive();
      });
    });
  }

  // Breadcrumb click → jump up
  crumbEl.querySelectorAll('.drive-crumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const depth = parseInt(btn.dataset.depth, 10);
      currentStack = currentStack.slice(0, depth + 1);
      renderDrive();
    });
  });
}

renderDrive();
