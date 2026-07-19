/* Live-fetches active public repositories from GitHub and renders them.
   Runs entirely client-side, so it always reflects the latest projects. */
(function () {
  const USER = 'PriyankaChinthala';
  const mount = document.getElementById('repo-grid');
  if (!mount) return;

  // Language accent colours (subset; falls back to teal)
  const LANG_COLORS = {
    Python: '#3572A5', 'Jupyter Notebook': '#DA5B0B', Scala: '#c22d40',
    Java: '#b07219', Shell: '#89e051', SQL: '#e38c00', HCL: '#844FBA',
    'HTML': '#e34c26', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    Go: '#00ADD8', Dockerfile: '#384d54', Makefile: '#427819'
  };

  const svgRepo = '<svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.25.25 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path></svg>';

  const esc = (s) => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const timeAgo = (iso) => {
    const d = (Date.now() - new Date(iso).getTime()) / 86400000;
    if (d < 1) return 'today';
    if (d < 30) return `${Math.round(d)}d ago`;
    if (d < 365) return `${Math.round(d / 30)}mo ago`;
    return `${Math.round(d / 365)}y ago`;
  };

  function card(r) {
    const lang = r.language
      ? `<span class="lang"><span class="lang-dot" style="background:${LANG_COLORS[r.language] || 'var(--teal)'}"></span>${esc(r.language)}</span>`
      : '';
    const stars = r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : '';
    const topics = (r.topics || []).slice(0, 3)
      .map(t => `<span class="tag">${esc(t)}</span>`).join('');
    return `
      <a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <div class="repo-top">${svgRepo}<h3>${esc(r.name)}</h3></div>
        <p>${esc(r.description) || '<span class="muted">No description yet — click through to explore the code.</span>'}</p>
        ${topics ? `<div class="tag-row">${topics}</div>` : ''}
        <div class="repo-meta" style="margin-top:1rem">
          ${lang} ${stars} <span>updated ${timeAgo(r.pushed_at)}</span>
        </div>
      </a>`;
  }

  function render(list) {
    if (!list.length) {
      mount.innerHTML = `<div class="notice">
        <p>No public projects are live just yet — new work is on the way.</p>
        <a class="btn btn-ghost" href="https://github.com/${USER}" target="_blank" rel="noopener">Visit GitHub profile →</a>
      </div>`;
      return;
    }
    mount.innerHTML = list.map(card).join('');
  }

  function fail() {
    mount.innerHTML = `<div class="notice">
      <p>Couldn't reach GitHub right now (it may be rate-limiting anonymous requests).</p>
      <a class="btn btn-ghost" href="https://github.com/${USER}?tab=repositories" target="_blank" rel="noopener">See all repositories on GitHub →</a>
    </div>`;
  }

  fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=100`, {
    headers: { Accept: 'application/vnd.github+json' }
  })
    .then(res => { if (!res.ok) throw new Error(res.status); return res.json(); })
    .then(repos => {
      const list = repos
        .filter(r => !r.fork && !r.archived)
        .sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
      render(list);
      const countEl = document.getElementById('repo-count');
      if (countEl) countEl.textContent = list.length;
    })
    .catch(fail);
})();
