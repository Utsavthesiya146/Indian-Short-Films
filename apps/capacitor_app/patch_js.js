const fs = require('fs');

let js = fs.readFileSync('public/js/app.js', 'utf8');

// Update switchTab function to handle 'watchlist' and 'submit' screens instead of 'search' if we want. Wait, the prompt still wanted search.
// Actually, let's keep search but add watchlist, submit.
js = js.replace(
  "['home','discover','search','profile'].forEach(t => {",
  "['home','discover','search','watchlist','profile','submit'].forEach(t => {"
);

// We replaced nav-search with nav-watchlist in HTML, so we need to add the watchlist fetch logic to goWatchlist()
// Currently, goWatchlist() is:
/*
function goWatchlist() {
  const wl = getWatchlist();
  const wlFilms = FILMS.filter(f => wl.includes(filmId(f)));
  if (!wlFilms.length) { showToast('Your watchlist is empty'); return; }
  showToast(`${wlFilms.length} film(s) in your watchlist`);
}
*/
const newGoWatchlist = `
async function fetchWatchlist() {
  if (!CURRENT_USER) return [];
  try {
    const r = await fetch(API + 'api_get_watchlist.php', { credentials: 'include' });
    const d = await r.json();
    return Array.isArray(d) ? d.map(w => String(w.film_id)) : [];
  } catch(e) { return []; }
}

async function goWatchlist() {
  switchTab('watchlist');
  const grid = document.getElementById('watchlist-grid');
  
  if (!CURRENT_USER) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">🔒</div>Please sign in to view your watchlist.</div>';
    return;
  }
  
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">Loading watchlist...</div>';
  
  const wl = await fetchWatchlist();
  const wlFilms = FILMS.filter(f => wl.includes(filmId(f)));
  
  if (!wlFilms.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">🔖</div>Your watchlist is empty.</div>';
    return;
  }
  
  grid.innerHTML = wlFilms.map(f => {
    const id = filmId(f);
    const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '';
    return \`
      <div class="discover-card" onclick="openFilmDetail('\${id}')">
        <img class="discover-poster" src="\${thumb(f)}" alt="\${f.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x240/181B24/8E95A5?text=ISF'">
        <div class="discover-card-info">
          <div class="discover-card-title line-2">\${f.title || 'Untitled'}</div>
          <div class="discover-card-meta">
            \${f.language ? \`<span style="color:var(--teal);font-weight:600;">\${f.language}</span>\` : ''}
            \${rVal && rVal > 0 ? \`<span>★ \${rVal}</span>\` : ''}
          </div>
        </div>
      </div>
    \`;
  }).join('');
}
`;

js = js.replace(/function goWatchlist\(\) \{[\s\S]*?\n\}/, newGoWatchlist);

// Replace toggleWatchlist logic to hit backend
const newToggleWatchlist = `
async function toggleWatchlist(id) {
  if (!CURRENT_USER) {
    showSignin();
    return;
  }
  try {
    const r = await fetch(API + 'api_add_watchlist.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ film_id: id })
    });
    const d = await r.json();
    if (d.success) {
      showToast(d.inWatchlist ? '🔖 Added to Watchlist' : 'Removed from Watchlist');
      // Re-render hero btn if needed
      renderHero();
      // Re-render detail btn if open
      if (CURRENT_FILM && filmId(CURRENT_FILM) === String(id)) {
        document.getElementById('detail-wl-icon').textContent = d.inWatchlist ? '✅' : '🔖';
        document.getElementById('detail-wl-label').textContent = d.inWatchlist ? 'Saved' : 'Watchlist';
      }
    } else {
      showToast('Failed to update watchlist');
    }
  } catch(e) { showToast('Network error'); }
}
`;
js = js.replace(/function toggleWatchlist\(id\) \{[\s\S]*?renderHero\(\);\n\}/, newToggleWatchlist);

// Replace detailToggleWl to not use localStorage
const newDetailToggleWl = `
function detailToggleWl() {
  if (!CURRENT_FILM) return;
  const id = filmId(CURRENT_FILM);
  toggleWatchlist(id);
}
`;
js = js.replace(/function detailToggleWl\(\) \{[\s\S]*?\n\}/, newDetailToggleWl);

// Replace check wl on hero render to hit backend.
// Since renderHero is synchronous and fetching watchlist is async, let's just make check logic async in renderHero
js = js.replace(/const wl = getWatchlist\(\);[\s\S]*?heroWl\.style\.borderColor = 'rgba\(255,255,255,0\.2\)';\n  \}/, `
  const heroWl = document.getElementById('hero-wl');
  if (CURRENT_USER) {
    fetchWatchlist().then(wl => {
      if (wl.includes(id)) {
        heroWl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Saved';
        heroWl.style.borderColor = 'rgba(229,9,20,0.5)';
      } else {
        heroWl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Save';
        heroWl.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    });
  } else {
    heroWl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> Save';
    heroWl.style.borderColor = 'rgba(255,255,255,0.2)';
  }
`);

// Replace openFilmDetail wl check
js = js.replace(/const wl = getWatchlist\(\);[\s\S]*?inWl \? 'Saved' : 'Watchlist';/, `
  document.getElementById('detail-wl-icon').textContent = '🔖';
  document.getElementById('detail-wl-label').textContent = 'Watchlist';
  if (CURRENT_USER) {
    fetchWatchlist().then(wl => {
      const inWl = wl.includes(String(id));
      document.getElementById('detail-wl-icon').textContent = inWl ? '✅' : '🔖';
      document.getElementById('detail-wl-label').textContent = inWl ? 'Saved' : 'Watchlist';
    });
  }
`);


// Replace getWatchlist entirely as it's no longer used
js = js.replace(/function getWatchlist\(\) \{ return JSON.parse\(localStorage\.getItem\('isf_wl'\) \|\| '\[\]'\); \}/, '');


// Submit film functionality
const submitCode = `
function openSubmitFilm() {
  if (!CURRENT_USER) {
    showSignin();
    return;
  }
  switchTab('submit');
}

async function doSubmitFilm(e) {
  e.preventDefault();
  const btn = document.getElementById('sf-submit-btn');
  const err = document.getElementById('sf-error');
  err.style.display = 'none';
  
  const fd = new FormData();
  fd.append('title', document.getElementById('sf-title').value);
  fd.append('director', document.getElementById('sf-director').value);
  fd.append('language', document.getElementById('sf-language').value);
  fd.append('genre', document.getElementById('sf-genre').value);
  fd.append('synopsis', document.getElementById('sf-synopsis').value);
  
  const videoFile = document.getElementById('sf-video').files[0];
  if (!videoFile) { err.textContent = 'Video file is required'; err.style.display='block'; return; }
  fd.append('video_file', videoFile);
  
  const posterFile = document.getElementById('sf-poster').files[0];
  if (posterFile) fd.append('poster_file', posterFile);
  
  btn.textContent = 'Uploading... Please wait';
  btn.disabled = true;
  
  try {
    const r = await fetch(API + 'api_submit_film.php', {
      method: 'POST', credentials: 'include',
      body: fd
    });
    const d = await r.json();
    if (d.success) {
      showToast('Film submitted successfully! It is under review.');
      document.getElementById('submit-form').reset();
      switchTab('profile');
    } else {
      err.textContent = d.error || 'Submission failed';
      err.style.display = 'block';
    }
  } catch(ex) {
    err.textContent = 'Network error during upload';
    err.style.display = 'block';
  }
  btn.textContent = 'Submit Film';
  btn.disabled = false;
}
`;

js = js.replace(/function openSubmitFilm\(\) \{\n  window\.open\('https:\/\/indianshortmovies\.com\/', '_blank'\);\n\}/, submitCode);

fs.writeFileSync('public/js/app.js', js);
console.log("Patched app.js with backend watchlist and submit logic.");
