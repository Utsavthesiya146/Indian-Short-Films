
// ═══════════════════════════════════════════════
//  INDIAN SHORT FILMS — OTT APP ENGINE
// ═══════════════════════════════════════════════

const API = 'https://indianshortmovies.com/php/';
let FILMS = [];
let CURRENT_USER = null;
let CURRENT_FILM = null;
let HERO_IDX = 0;
let HERO_TIMER = null;
let DISCOVER_FILTER = 'All';
let LANG_FILTER = 'All';

// ── SPLASH ──────────────────────────────
(function splash() {
  const fill = document.getElementById('splash-fill');
  let w = 0;
  const t = setInterval(() => {
    w += 2;
    fill.style.width = w + '%';
    if (w >= 100) { clearInterval(t); }
  }, 30);
})();

// ── BOOT ────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Network listener
  if (window.Capacitor?.Plugins?.Network) {
    window.Capacitor.Plugins.Network.addListener('networkStatusChange', (s) => {
      document.getElementById('offline').classList.toggle('show', !s.connected);
    });
  }
  window.addEventListener('online', () => document.getElementById('offline').classList.remove('show'));
  window.addEventListener('offline', () => document.getElementById('offline').classList.add('show'));

  // Back button
  if (window.Capacitor?.Plugins?.App) {
    window.Capacitor.Plugins.App.addListener('backButton', (d) => {
      if (document.getElementById('video-modal').style.display === 'flex') { closeVideo(); return; }
      if (document.getElementById('film-detail').style.display === 'flex') { closeDetail(); return; }
      if (document.getElementById('signin-overlay').style.display === 'flex') { if(CURRENT_USER) closeSignin(); else window.Capacitor.Plugins.App.exitApp(); return; }
      if (document.getElementById('signup-overlay').style.display === 'flex') { if(CURRENT_USER) closeSignup(); else window.Capacitor.Plugins.App.exitApp(); return; }
      if (d.canGoBack) window.history.back();
      else window.Capacitor.Plugins.App.exitApp();
    });
    if (window.Capacitor?.Plugins?.SplashScreen) window.Capacitor.Plugins.SplashScreen.hide();
  }

  // Check session
  try {
    const r = await fetch(API + 'api_get_profile.php', { credentials: 'include' });
    const d = await r.json();
    if (d.success && d.profile) CURRENT_USER = d.profile;
  } catch(e) {}
  updateAvatars();

  // Load films
  await loadFilms();

  // Show app, hide splash
  setTimeout(() => {
    document.getElementById('splash').style.opacity = '0';
    document.getElementById('splash').style.transition = 'opacity 0.4s';
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      
      if (!CURRENT_USER) {
        showSignup();
      }
    }, 400);
  }, 1500);
});

// ── LOAD FILMS ──────────────────────────
async function loadFilms() {
  try {
    const r = await fetch(API + 'api_get_films.php?_t=' + Date.now(), { cache: 'no-store', credentials: 'include' });
    const data = await r.json();
    if (Array.isArray(data) && data.length > 0) {
      FILMS = data;
    }
  } catch(e) { console.error('Film load error', e); }
  renderHome();
  renderDiscover();
}

// ── AVATAR / USER ───────────────────────
function updateAvatars() {
  const av = document.getElementById('home-avatar');
  if (CURRENT_USER) {
    const n = CURRENT_USER.name || CURRENT_USER.email || 'U';
    av.textContent = n.charAt(0).toUpperCase();
    av.style.background = 'linear-gradient(135deg, #E50914, #8b5cf6)';
  } else {
    av.textContent = '?';
    av.style.background = 'linear-gradient(135deg, #262a36, #1f2330)';
  }
  renderProfile();
}

// ── THUMB ───────────────────────────────
function thumb(film) {
  let p = film.posterUrl || film.backdropUrl;
  if (p) {
    if (p.startsWith('http')) return p;
    return 'https://indianshortmovies.com/' + p.replace(/^\//, '');
  }
  return 'https://via.placeholder.com/200x280/111319/8E95A5?text=' + encodeURIComponent(film.title || 'Film');
}
function filmId(film) { return String(film.id || film.uuid || ''); }

// ── HERO ────────────────────────────────
function renderHero() {
  const featured = FILMS.filter(f => f.isFeatured);
  const list = featured.length > 0 ? featured : FILMS.slice(0, 8);
  if (!list.length) return;
  HERO_IDX = HERO_IDX % list.length;
  const f = list[HERO_IDX];

  const bg = document.getElementById('hero-bg');
  bg.style.opacity = '0';
  setTimeout(() => {
    bg.src = thumb(f);
    bg.style.opacity = '1';
    bg.style.transition = 'opacity 0.5s';
  }, 150);

  document.getElementById('hero-title').textContent = f.title || 'Untitled';
  document.getElementById('hero-lang').textContent = f.language || 'Hindi';
  document.getElementById('hero-genre').textContent = f.genre || 'Drama';
  const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '4.8';
  document.getElementById('hero-rating').textContent = '★ ' + rVal;
  document.getElementById('hero-meta').textContent = 'Dir. ' + (f.director || 'Unknown') + ' • ' + (f.duration || '15 mins');

  const id = filmId(f);
  document.getElementById('hero-play').onclick = () => openFilmDetail(id);
  document.getElementById('hero-wl').onclick = () => toggleWatchlist(id);

  // Dots
  const dots = document.getElementById('hero-dots');
  dots.innerHTML = list.map((_, i) =>
    `<div class="hero-dot ${i === HERO_IDX ? 'active' : ''}" onclick="heroGo(${i})"></div>`
  ).join('');

  // Update watchlist btn
  
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

}

function heroGo(i) {
  clearInterval(HERO_TIMER);
  HERO_IDX = i;
  renderHero();
  startHeroTimer();
}

function startHeroTimer() {
  clearInterval(HERO_TIMER);
  const featured = FILMS.filter(f => f.isFeatured);
  const list = featured.length > 0 ? featured : FILMS.slice(0, 8);
  if (list.length < 2) return;
  HERO_TIMER = setInterval(() => {
    const featured = FILMS.filter(f => f.isFeatured);
    const list = featured.length > 0 ? featured : FILMS.slice(0, 8);
    HERO_IDX = (HERO_IDX + 1) % list.length;
    renderHero();
  }, 6000);
}

// ── FILM CARD ───────────────────────────
function cardHTML(f) {
  const id = filmId(f);
  const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '';
  const ratingBadge = rVal && rVal > 0 ? `<div class="film-rating-badge">★ ${rVal}</div>` : '';
  return `
    <div class="film-card" onclick="openFilmDetail('${id}')">
      <div class="film-poster">
        <img src="${thumb(f)}" alt="${f.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/120x170/181B24/8E95A5?text=ISF'">
        <div class="film-poster-overlay">
          <div class="play-icon-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        ${f.language ? `<div class="film-lang-badge">${f.language}</div>` : ''}
        ${ratingBadge}
        ${f.duration ? `<div class="film-dur-badge">⏱ ${f.duration}</div>` : ''}
      </div>
      <div class="film-card-info">
        <div class="film-card-title line-2">${f.title || 'Untitled'}</div>
        <div class="film-card-dir">${f.director ? 'Dir. ' + f.director : ''}</div>
      </div>
    </div>
  `;
}

// ── RENDER HOME ─────────────────────────
function renderHome() {
  if (!FILMS.length) return;
  renderHero();
  startHeroTimer();

  // Trending: featured first then rest
  const trending = [...FILMS.filter(f => f.isFeatured), ...FILMS.filter(f => !f.isFeatured)].slice(0, 12);
  document.getElementById('trending-row').innerHTML = trending.map(cardHTML).join('');

  // Top Rated
  const topRated = [...FILMS].sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0)).slice(0, 10);
  document.getElementById('toprated-row').innerHTML = topRated.map(cardHTML).join('');

  // Recent
  document.getElementById('recent-row').innerHTML = FILMS.slice(0, 10).map(cardHTML).join('');

  // Lang filtered - default All
  filterByLang('All', false);
}

// ── LANG FILTER ─────────────────────────
function filterByLang(lang, click = true) {
  LANG_FILTER = lang;
  // Update chips
  document.querySelectorAll('#lang-chips .lang-chip').forEach(c => {
    const t = c.querySelector('span').textContent;
    c.classList.toggle('active', t === lang);
  });
  const filtered = lang === 'All' ? FILMS.slice(0, 12) : FILMS.filter(f => f.language === lang);
  const row = document.getElementById('lang-filtered-row');
  if (filtered.length === 0) {
    row.innerHTML = `<div style="padding:20px;color:var(--muted);font-size:13px;">No films in ${lang} yet.</div>`;
  } else {
    row.innerHTML = filtered.slice(0, 12).map(cardHTML).join('');
  }
}

// ── RENDER DISCOVER ──────────────────────
function renderDiscover(filter) {
  if (filter !== undefined) DISCOVER_FILTER = filter;
  let films = FILMS;
  if (DISCOVER_FILTER !== 'All') {
    films = FILMS.filter(f => (f.genre || '').toLowerCase().includes(DISCOVER_FILTER.toLowerCase()));
  }
  const grid = document.getElementById('discover-grid');
  if (!films.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-size:13px;">No films found</div>`;
    return;
  }
  grid.innerHTML = films.map(f => {
    const id = filmId(f);
    const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '';
    return `
      <div class="discover-card" onclick="openFilmDetail('${id}')">
        <img class="discover-poster" src="${thumb(f)}" alt="${f.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x240/181B24/8E95A5?text=ISF'">
        <div class="discover-card-info">
          <div class="discover-card-title line-2">${f.title || 'Untitled'}</div>
          <div class="discover-card-meta">
            ${f.language ? `<span style="color:var(--teal);font-weight:600;">${f.language}</span>` : ''}
            ${rVal && rVal > 0 ? `<span>★ ${rVal}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function filterDiscover(genre, el) {
  document.querySelectorAll('#discover-genre-chips .filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderDiscover(genre);
}

// ── SEARCH ──────────────────────────────
function goSearch() { switchTab('search'); setTimeout(() => document.getElementById('search-input').focus(), 300); }
function clearSearch() {
  document.getElementById('search-input').value = '';
  document.getElementById('search-results').innerHTML = `<div class="search-empty"><div class="search-empty-icon">🎬</div><div class="search-empty-text">Search for films, directors,<br>languages or genres</div></div>`;
}
function doSearch(q) {
  q = q.trim().toLowerCase();
  const res = document.getElementById('search-results');
  if (!q) { clearSearch(); return; }
  const found = FILMS.filter(f =>
    (f.title || '').toLowerCase().includes(q) ||
    (f.director || '').toLowerCase().includes(q) ||
    (f.language || '').toLowerCase().includes(q) ||
    (f.genre || '').toLowerCase().includes(q)
  );
  if (!found.length) {
    res.innerHTML = `<div class="search-empty"><div class="search-empty-icon">😔</div><div class="search-empty-text">No films found for "<strong>${q}</strong>"</div></div>`;
    return;
  }
  res.innerHTML = found.map(f => {
    const id = filmId(f);
    return `
      <div class="search-result-item" onclick="openFilmDetail('${id}')">
        <img class="search-result-poster" src="${thumb(f)}" alt="${f.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/50x70/181B24/8E95A5?text=ISF'">
        <div class="search-result-info">
          <div class="search-result-title">${f.title || 'Untitled'}</div>
          <div class="search-result-meta">${f.language || ''} ${f.genre ? '• ' + f.genre : ''} ${f.duration ? '• ' + f.duration : ''}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px;">${f.director ? 'Dir. ' + f.director : ''}</div>
        </div>
        <div class="search-result-play">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      </div>
    `;
  }).join('');
}

// ── PROFILE ─────────────────────────────
function renderProfile() {
  const c = document.getElementById('profile-content');
  if (CURRENT_USER) {
    const n = CURRENT_USER.name || '';
    const e = CURRENT_USER.email || '';
    c.innerHTML = `
      <div class="profile-hero">
        <div class="profile-avatar">${n.charAt(0).toUpperCase() || e.charAt(0).toUpperCase() || '👤'}</div>
        <div class="profile-name">${n || 'Filmmaker'}</div>
        <div class="profile-email">${e}</div>
        <div class="profile-badge">🎬 Film Enthusiast</div>
      </div>
      <div class="profile-menu">
        <div class="profile-menu-item" onclick="goWatchlist()">
          <div class="profile-menu-icon" style="background:rgba(229,9,20,0.1);">🔖</div>
          <div class="profile-menu-text">
            <div class="profile-menu-label">My Watchlist</div>
            <div class="profile-menu-desc">Films you saved to watch later</div>
          </div>
          <div class="profile-menu-arrow">›</div>
        </div>
        <div class="profile-menu-item" onclick="openSubmitFilm()">
          <div class="profile-menu-icon" style="background:rgba(102,252,241,0.1);">🎥</div>
          <div class="profile-menu-text">
            <div class="profile-menu-label">Submit Your Film</div>
            <div class="profile-menu-desc">Share your short film with India</div>
          </div>
          <div class="profile-menu-arrow">›</div>
        </div>
        <div class="profile-menu-item">
          <div class="profile-menu-icon" style="background:rgba(255,183,3,0.1);">⭐</div>
          <div class="profile-menu-text">
            <div class="profile-menu-label">Reviews & Ratings</div>
            <div class="profile-menu-desc">Films you've reviewed</div>
          </div>
          <div class="profile-menu-arrow">›</div>
        </div>
        <button class="btn-signout" onclick="doSignOut()">Sign Out</button>
      </div>
    `;
  } else {
    c.innerHTML = `
      <div class="profile-hero" style="min-height:200px;justify-content:center;">
        <div class="profile-avatar" style="font-size:2.5rem;background:linear-gradient(135deg,#1f2330,#262a36);">🎬</div>
        <div class="profile-name">Indian Short Films</div>
        <div class="profile-email">Sign in to access your account</div>
      </div>
      <div class="profile-menu">
        <p style="font-size:13px;color:var(--muted);line-height:1.7;text-align:center;margin-bottom:20px;">
          Sign in to save films to your watchlist, submit your own short films, and join the Indian indie cinema community.
        </p>
        <button class="btn-signin-profile" onclick="showSignin()">Sign In</button>
        <button class="btn-signup-profile" onclick="showSignup()">Create Account</button>
        <div class="divider"></div>
        <div class="profile-menu-item" onclick="openSubmitFilm()">
          <div class="profile-menu-icon" style="background:rgba(102,252,241,0.1);">🎥</div>
          <div class="profile-menu-text">
            <div class="profile-menu-label">Submit a Film</div>
            <div class="profile-menu-desc">Share your short film with the world</div>
          </div>
          <div class="profile-menu-arrow">›</div>
        </div>
      </div>
    `;
  }
}

// ── OPEN FILM DETAIL ────────────────────
function openFilmDetail(id) {
  const f = FILMS.find(x => filmId(x) === String(id));
  if (!f) return;
  CURRENT_FILM = f;

  document.getElementById('detail-backdrop-img').src = thumb(f);
  document.getElementById('detail-title').textContent = f.title || 'Untitled';

  const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '';
  const metaRow = document.getElementById('detail-meta-row');
  metaRow.innerHTML = `
    ${f.language ? `<span class="detail-meta-chip lang">${f.language}</span>` : ''}
    ${f.duration ? `<span class="detail-meta-chip dur">⏱ ${f.duration}</span>` : ''}
    ${f.genre ? `<span class="detail-meta-chip genre">${f.genre}</span>` : ''}
    ${rVal && rVal > 0 ? `<span class="detail-meta-chip rat">★ ${rVal}</span>` : ''}
  `;

  document.getElementById('detail-director').textContent = f.director || 'Unknown Director';
  document.getElementById('detail-synopsis').textContent = f.synopsis || f.description || 'No synopsis available.';

  document.getElementById('detail-play-btn').onclick = () => playFilm(id);

  // Watchlist btn
  
  document.getElementById('detail-wl-icon').textContent = '🔖';
  document.getElementById('detail-wl-label').textContent = 'Watchlist';
  if (CURRENT_USER) {
    fetchWatchlist().then(wl => {
      const inWl = wl.includes(String(id));
      document.getElementById('detail-wl-icon').textContent = inWl ? '✅' : '🔖';
      document.getElementById('detail-wl-label').textContent = inWl ? 'Saved' : 'Watchlist';
    });
  }


  const detail = document.getElementById('film-detail');
  detail.style.display = 'flex';
  detail.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('film-detail').style.display = 'none';
  document.body.style.overflow = '';
}


function detailToggleWl() {
  if (!CURRENT_FILM) return;
  const id = filmId(CURRENT_FILM);
  toggleWatchlist(id);
}


function detailShare() {
  if (!CURRENT_FILM) return;
  if (navigator.share) {
    navigator.share({ title: CURRENT_FILM.title, text: 'Watch ' + CURRENT_FILM.title + ' on Indian Short Films', url: 'https://indianshortmovies.com/' });
  } else {
    showToast('Link copied to clipboard!');
  }
}

function detailDownload() {
  showToast('Offline download coming soon!');
}

// ── PLAY FILM ───────────────────────────
function playFilm(id) {
  const f = FILMS.find(x => filmId(x) === String(id));
  if (!f) return;
  let vUrl = f.videoUrl || '';
  if (!vUrl) { showToast('Video not available'); return; }
  
  if (!vUrl.startsWith('http')) {
    vUrl = 'https://indianshortmovies.com/' + vUrl.replace(/^\//, '');
  }

  document.getElementById('video-title').textContent = f.title || '';
  document.getElementById('video-dir').textContent = f.director ? 'Dir. ' + f.director : '';

  const player = document.getElementById('video-player');
  player.src = vUrl;

  const modal = document.getElementById('video-modal');
  modal.style.display = 'flex';
  player.play().catch(() => {});
  document.body.style.overflow = 'hidden';

  // Screen orientation - landscape
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
}

function closeVideo() {
  const player = document.getElementById('video-player');
  player.pause();
  player.src = '';
  document.getElementById('video-modal').style.display = 'none';
  document.body.style.overflow = '';
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
}

// ── WATCHLIST ───────────────────────────


async function toggleWatchlist(id) {
  if (!CURRENT_USER) { showSignin(); return; }
  try {
    const r = await fetch(API + 'api_add_watchlist.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ film_id: id })
    });
    const d = await r.json();
    if (d.success) {
      showToast(d.inWatchlist ? '🔖 Added to Watchlist' : 'Removed from Watchlist');
      renderHero();
      if (CURRENT_FILM && filmId(CURRENT_FILM) === String(id)) {
        document.getElementById('detail-wl-icon').textContent = d.inWatchlist ? '✅' : '🔖';
        document.getElementById('detail-wl-label').textContent = d.inWatchlist ? 'Saved' : 'Watchlist';
      }
    } else {
      showToast(d.error || 'Failed to update watchlist');
    }
  } catch(e) { showToast('Network error'); }
}

async function fetchWatchlist() {
  if (!CURRENT_USER) return [];
  try {
    const r = await fetch(API + 'api_get_watchlist.php', { credentials: 'include' });
    const wlFilms = await r.json();
    return Array.isArray(wlFilms) ? wlFilms : [];
  } catch(e) { return []; }
}

// goWatchlist logic moved into goWatchlistLogic to prevent recursion
function goWatchlist() { switchTab('watchlist'); }


// ── PROFILE ─────────────────────────────
function goProfile() { switchTab('profile'); }

let isFetchingProfile = false;
async function renderProfile() {
  const c = document.getElementById('profile-content');
  if (!c) return;
  if (!CURRENT_USER) {
    c.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">🔒</div>Please log in to view your profile.<br><br><button onclick="showSignin()" class="auth-btn" style="width:auto;padding:10px 30px;">Login</button></div>';
    return;
  }
  
  if (isFetchingProfile) return;
  isFetchingProfile = true;
  
  c.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--muted);">Loading profile...</div>';
  
  try {
    const r = await fetch(API + 'api_get_profile.php', { credentials: 'include' });
    const d = await r.json();
    if (d.success && d.profile) {
      CURRENT_USER = d.profile;
      updateAvatars();
      const p = d.profile;
      const initial = (p.name || p.email || 'U').charAt(0).toUpperCase();
      c.innerHTML = `
        <div style="padding:40px 20px 30px; text-align:center; background: linear-gradient(180deg, rgba(38,42,54,1) 0%, rgba(24,27,36,1) 100%); border-bottom:1px solid rgba(255,255,255,0.05); position:relative; overflow:hidden;">
          
          <div style="position:absolute; top:-50%; left:-50%; width:200%; height:200%; background: radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 60%); pointer-events:none;"></div>
          
          <div style="position:relative; z-index:1;">
            <div style="width:110px; height:110px; border-radius:50%; background: linear-gradient(135deg, #E50914, #8b5cf6); color:white; font-size:48px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; box-shadow: 0 12px 30px rgba(229,9,20,0.3); border: 4px solid rgba(255,255,255,0.1);">
              ${initial}
            </div>
            
            <h2 style="font-size:26px; margin:0 0 6px; color:white; font-weight: 800; letter-spacing: 0.5px;">${p.name || 'User'}</h2>
            <div style="color: rgba(255,255,255,0.6); font-size:14px; margin-bottom:24px; font-weight: 500;">${p.email}</div>
            
            <div style="display:flex; justify-content:center; gap:16px; padding-top:20px;">
              
              <div onclick="goWatchlist()" style="cursor:pointer; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 16px 24px; flex: 1; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                <div style="font-size:26px; font-weight:800; color:white; margin-bottom:4px; text-shadow: 0 2px 10px rgba(255,255,255,0.2);">${p.watchlist_count || 0}</div>
                <div style="font-size:12px; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Watchlist</div>
              </div>
              
              <div onclick="openSubmitFilm()" style="cursor:pointer; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 16px 24px; flex: 1; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                <div style="font-size:26px; font-weight:800; color:white; margin-bottom:4px; text-shadow: 0 2px 10px rgba(255,255,255,0.2);">${p.films_submitted || 0}</div>
                <div style="font-size:12px; color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:1px; font-weight:600;">Submissions</div>
              </div>

            </div>
          </div>
        </div>
        
        <div style="padding:24px 20px;">
          <h3 style="color: rgba(255,255,255,0.4); font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px; font-weight: 700;">Account Actions</h3>
          
          <div style="background: rgba(255,255,255,0.02); border-radius:16px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            
            <div onclick="goWatchlist()" style="padding:18px 20px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
              <div style="display:flex; align-items:center; gap: 14px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(229,9,20,0.15); color: #E50914; display:flex; align-items:center; justify-content:center; font-size: 18px;">🔖</div>
                <span style="color:white; font-weight:600; font-size: 15px;">My Watchlist</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            
            <div onclick="openSubmitFilm()" style="padding:18px 20px; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
              <div style="display:flex; align-items:center; gap: 14px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(139,92,246,0.15); color: #8b5cf6; display:flex; align-items:center; justify-content:center; font-size: 18px;">🎬</div>
                <span style="color:white; font-weight:600; font-size: 15px;">Submit a Film</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </div>
            
            <div onclick="doSignOut()" style="padding:18px 20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(229,9,20,0.05)'" onmouseout="this.style.background='transparent'">
              <div style="display:flex; align-items:center; gap: 14px;">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(255,255,255,0.05); color: #FF4D4D; display:flex; align-items:center; justify-content:center; font-size: 18px;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </div>
                <span style="color:#FF4D4D; font-weight:600; font-size: 15px;">Log Out</span>
              </div>
            </div>

          </div>
        </div>
      `;
    } else {
      c.innerHTML = '<div style="text-align:center;padding:60px 20px;color:red;">Error loading profile.</div>';
    }
  } catch (e) {
    c.innerHTML = '<div style="text-align:center;padding:60px 20px;color:red;">Network error.</div>';
  } finally {
    isFetchingProfile = false;
  }
}

// ── AUTH ─────────────────────────────────
function showSignin() { document.getElementById('signup-overlay').style.display = 'none'; document.getElementById('signin-overlay').style.display = 'flex'; }
function closeSignin() { if (!CURRENT_USER) return; document.getElementById('signin-overlay').style.display = 'none'; }
function showSignup() { document.getElementById('signin-overlay').style.display = 'none'; document.getElementById('signup-overlay').style.display = 'flex'; }
function closeSignup() { if (!CURRENT_USER) return; document.getElementById('signup-overlay').style.display = 'none'; }

document.getElementById('signin-overlay').addEventListener('click', function(e) { if (e.target === this && CURRENT_USER) closeSignin(); });
document.getElementById('signup-overlay').addEventListener('click', function(e) { if (e.target === this && CURRENT_USER) closeSignup(); });

async function doSignIn() {
  const email = document.getElementById('si-email').value.trim();
  const pass = document.getElementById('si-password').value;
  const errDiv = document.getElementById('signin-error');
  const btn = document.getElementById('signin-btn');
  errDiv.style.display = 'none';
  if (!email || !pass) { errDiv.textContent = 'Please fill in all fields.'; errDiv.style.display = 'block'; return; }
  btn.textContent = 'Signing in...'; btn.disabled = true;
  
  try {
    const r = await fetch(API + 'api_login.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await r.json();
    if (d.success) {
      CURRENT_USER = d.user || { email, name: email.split('@')[0] };
      closeSignin();
      updateAvatars();
      showToast('👋 Welcome back, ' + (CURRENT_USER.name || email.split('@')[0]) + '!');
      if (document.getElementById('screen-profile').classList.contains('active')) renderProfile();
    } else {
      errDiv.textContent = d.error || 'Sign in failed. Check your credentials.';
      errDiv.style.display = 'block';
    }
  } catch(e) {
    errDiv.textContent = 'Network error. Please try again.';
    errDiv.style.display = 'block';
  }
  btn.textContent = 'Sign In'; btn.disabled = false;
}

async function doSignUp() {
  const name = document.getElementById('su-name').value.trim();
  const email = document.getElementById('su-email').value.trim();
  const pass = document.getElementById('su-password').value;
  const errDiv = document.getElementById('signup-error');
  const btn = document.getElementById('signup-btn');
  errDiv.style.display = 'none';
  if (!name || !email || !pass) { errDiv.textContent = 'Please fill in all fields.'; errDiv.style.display = 'block'; return; }
  btn.textContent = 'Creating account...'; btn.disabled = true;
  
  try {
    const r = await fetch(API + 'api_register.php', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });
    const d = await r.json();
    if (d.success) {
      CURRENT_USER = { name, email };
      closeSignup();
      updateAvatars();
      showToast('🎉 Welcome to Indian Short Films, ' + name.split(' ')[0] + '!');
      if (document.getElementById('screen-profile').classList.contains('active')) renderProfile();
    } else {
      errDiv.textContent = d.error || 'Registration failed. Please try again.';
      errDiv.style.display = 'block';
    }
  } catch(e) {
    errDiv.textContent = 'Network error. Please try again.';
    errDiv.style.display = 'block';
  }
  btn.textContent = 'Create Account'; btn.disabled = false;
}

async function doSignOut() {
  try { await fetch(API + 'logout.php', { credentials: 'include' }); } catch(e) {}
  CURRENT_USER = null;
  updateAvatars();
  showToast('Signed out successfully');
  if (document.getElementById('screen-profile').classList.contains('active')) renderProfile();
  if (document.getElementById('screen-watchlist').classList.contains('active')) goWatchlist();
}


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


// ── TAB NAVIGATION ──────────────────────
function switchTab(tab) {
  ['home','discover','search','watchlist','profile','submit'].forEach(t => {
    const s = document.getElementById('screen-' + t);
    const n = document.getElementById('nav-' + t);
    if (s) s.classList.toggle('active', t === tab);
    if (n) n.classList.toggle('active', t === tab);
  });
  if (tab === 'profile') renderProfile();
  if (tab === 'discover') renderDiscover();
  if (tab === 'watchlist') {
    // Only call goWatchlist logic if we haven't already populated it
    goWatchlistLogic();
  }
  if (tab === 'search') setTimeout(() => document.getElementById('search-input').focus(), 200);
}

async function goWatchlistLogic() {
  const grid = document.getElementById('watchlist-grid');
  if (!CURRENT_USER) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">🔒</div>Please sign in to view your watchlist.<br><br><button onclick="showSignin()" class="auth-btn" style="width:auto;padding:10px 30px;">Login</button></div>';
    return;
  }
  grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">Loading watchlist...</div>';
  
  const wlFilms = await fetchWatchlist();
  
  if (!wlFilms.length) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">🔖</div>Your Watchlist is empty.<br><br><button onclick="switchTab(\'discover\')" style="padding:10px 20px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:bold;">Explore Films</button></div>';
    return;
  }
  
  grid.innerHTML = wlFilms.map(f => {
    const id = filmId(f);
    const rVal = f.rating ? parseFloat(f.rating).toFixed(1) : '';
    return `
      <div class="discover-card" onclick="openFilmDetail('${id}')">
        <img class="discover-poster" src="${thumb(f)}" alt="${f.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x240/181B24/8E95A5?text=ISF'">
        <div style="position:absolute;top:10px;right:10px;"><button onclick="event.stopPropagation(); toggleWatchlist('${id}'); setTimeout(goWatchlistLogic, 500);" style="background:rgba(229,9,20,0.9);color:white;border:none;border-radius:50%;width:30px;height:30px;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;">✕</button></div>
        <div class="discover-card-info">
          <div class="discover-card-title line-2">${f.title || 'Untitled'}</div>
          <div class="discover-card-meta">
            ${f.language ? `<span style="color:var(--teal);font-weight:600;">${f.language}</span>` : ''}
            ${rVal && rVal > 0 ? `<span>★ ${rVal}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ── TOAST ───────────────────────────────
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── KEYBOARD ────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('video-modal').style.display === 'flex') { closeVideo(); return; }
    if (document.getElementById('film-detail').style.display === 'flex') { closeDetail(); return; }
    closeSignin(); closeSignup();
  }
});
