<?php
/**
 * Indian Short Movie - Footer Template
 * Production-ready PHP 8+ Reusable Footer & Modals
 */
if (!isset($base_url)) {
    $base_url = './';
}
?>
  <!-- EXACT FOOTER -->
  <footer class="site-footer" style="background-color: var(--cinema-surface); border-top: 1px solid var(--cinema-border); margin-top: 4rem; padding: 3rem 0 2rem;">
    <div style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 3rem;">
        <div>
          <div style="font-weight: 900; font-size: 1.1rem; color: #ffffff; margin-bottom: 0.5rem; letter-spacing: -0.02em;">INDIAN SHORT MOVIE</div>
          <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.6;">
            Dedicated platform celebrating independent storytelling, short cinema, and visionary filmmakers across all Indian languages.
          </p>
        </div>
        <div>
          <h4 style="font-size: 0.75rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Discover</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; color: #8e95a5;">
            <li><a href="<?php echo $base_url; ?>discover.php" style="color: inherit; text-decoration: none;">Trending Now</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" style="color: inherit; text-decoration: none;">Top Rated</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" style="color: inherit; text-decoration: none;">Hindi Short Films</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" style="color: inherit; text-decoration: none;">Tamil Short Films</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" style="color: inherit; text-decoration: none;">Kannada Short Films</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 0.75rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Filmmakers</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; color: #8e95a5;">
            <li><a href="#" onclick="openSubmitFilmModal(); return false;" style="color: inherit; text-decoration: none;">Submit Your Film</a></li>
            <li><a href="<?php echo $base_url; ?>filmmakers.php" style="color: inherit; text-decoration: none;">Filmmaker Directory</a></li>
            <li><a href="<?php echo $base_url; ?>watchlist.php" style="color: inherit; text-decoration: none;">Saved Watchlist</a></li>
          </ul>
        </div>
        <div>
          <h4 style="font-size: 0.75rem; font-weight: 700; color: #ffffff; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem;">Platform</h4>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.75rem; color: #8e95a5;">
            <li><a href="<?php echo $base_url; ?>admin/index.php" style="color: inherit; text-decoration: none;">Admin Portal</a></li>
            <li><a href="<?php echo $base_url; ?>admin/index.php" style="color: inherit; text-decoration: none;">Role-Based Access</a></li>
          </ul>
        </div>
      </div>

      <!-- Exact Required Footer Text & Attribution (DO NOT CHANGE) -->
      <div style="border-top: 1px solid rgba(38, 42, 54, 0.5); padding-top: 1.5rem;">
        <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #8e95a5;">
          <span>© 2026 Indian Short Films. All rights reserved.</span>
          <span>With love ❤️ <a href="https://webhostingbaba.com" target="_blank" rel="noopener noreferrer" style="color: #FF0000; font-weight: bold; text-decoration: none;">HOSTING BABA</a></span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Global Video Modal -->
  <div id="video-modal" style="display: none; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1.5rem;">
    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; max-width: 900px; width: 100%; overflow: hidden; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);">
      <button onclick="closeVideoModal()" style="position: absolute; top: 1rem; right: 1rem; z-index: 10; background: rgba(0,0,0,0.6); border: 1px solid #262a36; color: #ffffff; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='#e50914'" onmouseout="this.style.background='rgba(0,0,0,0.6)'">
        ✕
      </button>
      <div style="position: relative; aspect-ratio: 16/9; background: #000;">
        <video id="modal-video-player" controls style="width: 100%; height: 100%; object-fit: contain;"></video>
      </div>
      <div style="padding: 1.5rem;">
        <h3 id="modal-film-title" style="font-size: 1.25rem; font-weight: 800; color: #ffffff;"></h3>
        <p id="modal-film-desc" style="font-size: 0.8rem; color: #8e95a5; margin-top: 0.5rem; line-height: 1.5;"></p>
      </div>
    </div>
  </div>

  <!-- Submit Film Modal -->
  <div id="submit-film-modal" style="display: none; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1.5rem;">
    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; max-width: 580px; width: 100%; padding: 2rem; position: relative; max-height: 90vh; overflow-y: auto;">
      <button onclick="closeSubmitFilmModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: #8e95a5; font-size: 1.25rem; cursor: pointer;">✕</button>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
        <div style="width: 40px; height: 40px; border-radius: 0.75rem; background: rgba(229, 9, 20, 0.15); display: flex; align-items: center; justify-content: center; color: #e50914;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        </div>
        <div>
          <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Submit Your Short Film</h3>
          <p style="font-size: 0.75rem; color: #8e95a5;">Share your independent cinema with thousands of cinephiles</p>
        </div>
      </div>
      <form id="submit-film-form" onsubmit="handleFilmSubmission(event)" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Film Title *</label>
          <input type="text" id="sub-title" required placeholder="e.g. Whispers of Kaveri" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Director Name *</label>
            <input type="text" id="sub-director" required placeholder="Director's name" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Language *</label>
            <select id="sub-language" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Malayalam">Malayalam (മലയാളം)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
              <option value="Bengali">Bengali (বাংলা)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Video Screener URL (MP4 / YouTube / Vimeo) *</label>
          <input type="url" id="sub-video" required placeholder="https://commondatastorage.googleapis.com/..." style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Synopsis / Storyline *</label>
          <textarea id="sub-synopsis" required rows="3" placeholder="Brief description of the story and artistic vision..." style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box; resize: vertical;"></textarea>
        </div>
        <button type="submit" style="background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.85rem; padding: 0.75rem; border-radius: 0.75rem; border: none; cursor: pointer; margin-top: 0.5rem; transition: background 0.2s;" onmouseover="this.style.background='#b80710'" onmouseout="this.style.background='#e50914'">
          Submit Film for Review
        </button>
      </form>
    </div>
  </div>

  <!-- Sign In Modal -->
  <div id="signin-modal" style="display: none; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1.5rem;">
    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; max-width: 440px; width: 100%; padding: 2rem; position: relative;">
      <button onclick="closeSignInModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: #8e95a5; font-size: 1.25rem; cursor: pointer;">✕</button>
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.3rem; font-weight: 900; color: #ffffff;">Sign In to Indian Short Movie</h3>
        <p style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.25rem;">Access your watchlist, reviews, and filmmaker dashboard</p>
      </div>
      <form onsubmit="handleUserSignIn(event)" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Email Address</label>
          <input type="email" required placeholder="you@domain.com" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Password</label>
          <input type="password" required placeholder="••••••••" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>
        <button type="submit" style="background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.85rem; padding: 0.75rem; border-radius: 0.75rem; border: none; cursor: pointer; margin-top: 0.5rem;">
          Sign In
        </button>
      </form>
    </div>
  </div>

  <!-- Core JavaScript -->
  <script src="<?php echo $base_url; ?>js/script.js"></script>

  <script>
    function toggleMobileNav() {
      const d = document.getElementById('mobile-nav-drawer');
      if (d) {
        d.style.display = (d.style.display === 'none' || !d.style.display) ? 'block' : 'none';
      }
    }

    function openSubmitFilmModal() {
      const m = document.getElementById('submit-film-modal');
      if (m) m.style.display = 'flex';
    }

    function closeSubmitFilmModal() {
      const m = document.getElementById('submit-film-modal');
      if (m) m.style.display = 'none';
    }

    function openSignInModal() {
      const m = document.getElementById('signin-modal');
      if (m) m.style.display = 'flex';
    }

    function closeSignInModal() {
      const m = document.getElementById('signin-modal');
      if (m) m.style.display = 'none';
    }

    function handleFilmSubmission(e) {
      e.preventDefault();
      const title = document.getElementById('sub-title').value;
      alert('Thank you! "' + title + '" has been submitted to the Admin Queue for review and screening.');
      closeSubmitFilmModal();
      document.getElementById('submit-film-form').reset();
    }

    function handleUserSignIn(e) {
      e.preventDefault();
      alert('Welcome back! You are now signed in.');
      closeSignInModal();
    }
  </script>

  <?php if (isset($extra_js)) { echo $extra_js; } ?>
</body>
</html>
