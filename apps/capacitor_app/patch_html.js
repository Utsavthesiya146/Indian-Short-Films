const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// Replace nav-search with nav-watchlist in bottom-nav
html = html.replace(
  '<div class="nav-item" id="nav-search" onclick="switchTab(\'search\')">',
  '<div class="nav-item" id="nav-watchlist" onclick="switchTab(\'watchlist\')">'
).replace(
  '<div class="nav-icon">🔍</div>\n      <div class="nav-label">Search</div>',
  '<div class="nav-icon">🔖</div>\n      <div class="nav-label">Watchlist</div>'
);

// Add missing screens before <!-- ── BOTTOM NAV ── -->
const newScreens = `
    <!-- ══════ WATCHLIST SCREEN ══════ -->
    <div class="screen" id="screen-watchlist">
      <div class="discover-topbar">
        <div class="discover-title">My Watchlist</div>
      </div>
      <div class="discover-grid" id="watchlist-grid">
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-size:13px;">Loading watchlist...</div>
      </div>
    </div>
    <!-- END WATCHLIST -->

    <!-- ══════ SUBMIT FILM SCREEN ══════ -->
    <div class="screen" id="screen-submit">
      <div class="discover-topbar" style="display:flex;align-items:center;gap:10px;">
        <div style="font-size:24px;cursor:pointer;" onclick="switchTab('profile')">←</div>
        <div class="discover-title" style="margin:0;">Submit Film</div>
      </div>
      <div style="padding:20px;">
        <div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;">
          <form id="submit-form" onsubmit="doSubmitFilm(event)">
            <input class="auth-input" type="text" id="sf-title" placeholder="Film Title" required>
            <input class="auth-input" type="text" id="sf-director" placeholder="Director Name" required>
            <input class="auth-input" type="text" id="sf-language" placeholder="Language (e.g. Hindi, English)" required>
            <select class="auth-input" id="sf-genre" required style="color:#fff;background:var(--surface);">
              <option value="" disabled selected>Select Genre</option>
              <option value="Drama">Drama</option>
              <option value="Suspense">Suspense</option>
              <option value="Thriller">Thriller</option>
              <option value="Romance">Romance</option>
              <option value="Comedy">Comedy</option>
              <option value="Horror">Horror</option>
              <option value="Action">Action</option>
              <option value="Documentary">Documentary</option>
              <option value="Other">Other</option>
            </select>
            <textarea class="auth-input" id="sf-synopsis" placeholder="Synopsis" rows="4" required style="resize:none;"></textarea>
            
            <label style="display:block;margin-bottom:8px;font-size:13px;color:var(--muted);">Poster Image (Optional)</label>
            <input class="auth-input" type="file" id="sf-poster" accept="image/*" style="padding:10px;">
            
            <label style="display:block;margin-bottom:8px;font-size:13px;color:var(--muted);">Video File (Required, Max 25MB)</label>
            <input class="auth-input" type="file" id="sf-video" accept="video/*" required style="padding:10px;">
            
            <button class="auth-btn" id="sf-submit-btn" type="submit">Submit Film</button>
            <div id="sf-error" class="auth-error" style="margin-top:12px;"></div>
          </form>
        </div>
      </div>
    </div>
    <!-- END SUBMIT FILM -->
`;

html = html.replace('  </div><!-- end .screens -->', newScreens + '\n  </div><!-- end .screens -->');

fs.writeFileSync('public/index.html', html);
console.log("Patched index.html with new screens.");
