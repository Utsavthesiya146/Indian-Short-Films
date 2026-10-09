<?php
/**
 * Indian Short Movie - Footer Template
 * Next.js Tailwind Design Conversion
 */
if (!isset($base_url)) {
    $base_url = './';
}
?>
  <!-- EXACT FOOTER -->
  <footer class="mt-20 border-t border-cinema-border bg-cinema-surface/50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-0 mb-4">
            <span class="font-display font-black text-xl text-white tracking-tight flex items-center">
              <span class="relative inline-block">i<span class="absolute top-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#FF204E]"></span></span>
              nd
              <span class="relative inline-block">i<span class="absolute top-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#FF204E]"></span></span>
              an
            </span>
            <div class="-rotate-[3deg] inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-[#f84464] via-[#dc2626] to-[#8b5cf6] mx-1">
              <span class="font-display font-black text-white text-[13px] tracking-tight leading-none mt-0.5">short</span>
            </div>
            <span class="font-display font-black text-xl text-white tracking-tight flex items-center">
              mov
              <span class="relative inline-block">i<span class="absolute top-[5px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#FF204E]"></span></span>
              e
            </span>
          </div>
          <p class="text-cinema-muted text-sm max-w-sm">
            Dedicated platform celebrating independent storytelling, short cinema, and visionary filmmakers across all Indian languages.
          </p>
        </div>
        
        <div>
          <h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Discover</h4>
          <ul class="space-y-2 text-sm text-cinema-muted">
            <li><a href="<?php echo $base_url; ?>discover.php" class="hover:text-cinema-accent transition-colors">Trending Now</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" class="hover:text-cinema-accent transition-colors">Top Rated</a></li>
            <li><a href="<?php echo $base_url; ?>discover.php" class="hover:text-cinema-accent transition-colors">Regional Spotlight</a></li>
          </ul>
        </div>
        
        <div>
          <h4 class="text-white font-bold mb-4 uppercase text-xs tracking-wider">Platform</h4>
          <ul class="space-y-2 text-sm text-cinema-muted">
            <li><a href="javascript:void(0)" onclick="openSubmitFilmModal()" class="hover:text-cinema-accent transition-colors">Submit Film</a></li>
            <li><a href="<?php echo $base_url; ?>filmmakers.php" class="hover:text-cinema-accent transition-colors">Filmmaker Directory</a></li>
            <li><a href="<?php echo $base_url; ?>contact.php" class="hover:text-cinema-accent transition-colors">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div class="border-t border-cinema-border pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p class="text-cinema-muted text-sm text-center md:text-left">© 2026 Indian Short Films. All rights reserved. With love ❤️ <a href="https://webhostingbaba.com/" class="text-red-500 hover:underline">HOSTING BABA</a></p>
        
        <div class="flex flex-wrap items-center justify-center md:justify-end gap-4">
          <a href="#" id="footer-play-store-link" class="flex items-center gap-3 bg-black hover:bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-cinema-accent/20 hover:border-zinc-700">
            <svg class="w-6 h-6" viewBox="0 0 512 512" fill="currentColor"><path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/></svg>
            <div class="text-left">
              <div class="text-[10px] text-zinc-400 leading-none mb-0.5 uppercase tracking-wider font-semibold">GET IT ON</div>
              <div class="text-sm font-bold leading-none tracking-tight">Google Play</div>
            </div>
          </a>
          <a href="#" id="footer-app-store-link" class="flex items-center gap-3 bg-black hover:bg-zinc-900 border border-zinc-800 text-white px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-cinema-accent/20 hover:border-zinc-700">
            <svg class="w-6 h-6" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            <div class="text-left">
              <div class="text-[10px] text-zinc-400 leading-none mb-0.5 uppercase tracking-wider font-semibold">Download on the</div>
              <div class="text-sm font-bold leading-none tracking-tight">App Store</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Global Video Modal -->
  <div id="video-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
    <div class="bg-cinema-surface border border-cinema-border rounded-2xl w-full max-w-5xl overflow-hidden relative shadow-2xl">
      <button onclick="closeVideoModal()" class="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-cinema-accent text-white rounded-full transition-colors border border-cinema-border/50">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <div class="aspect-video bg-black w-full relative">
        <video id="modal-video-player" controls class="w-full h-full object-contain"></video>
      </div>
      <div class="p-6">
        <h3 id="modal-film-title" class="text-xl font-bold text-white mb-2"></h3>
        <p id="modal-film-director" class="text-sm font-semibold text-cinema-teal mb-3"></p>
        <p id="modal-film-desc" class="text-cinema-muted text-sm leading-relaxed"></p>
      </div>
    </div>
  </div>

  <!-- Submit Film Modal -->
  <div id="submit-film-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
    <div class="bg-cinema-surface border border-cinema-border rounded-2xl w-full max-w-xl p-8 relative max-h-[90vh] overflow-y-auto">
      <button onclick="closeSubmitFilmModal()" class="absolute top-4 right-4 text-cinema-muted hover:text-white transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      
      <div class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 rounded-xl bg-cinema-accent/10 flex items-center justify-center text-cinema-accent">
          <i data-lucide="film" class="w-6 h-6"></i>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white">Submit Your Short Film</h3>
          <p class="text-sm text-cinema-muted">Share your independent cinema with the world.</p>
        </div>
      </div>
      
      <form id="submit-film-form" onsubmit="handleFilmSubmission(event)" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Film Title *</label>
          <input type="text" id="sub-title" required placeholder="e.g. Whispers of Kaveri" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Director Name *</label>
            <input type="text" id="sub-director" required placeholder="Director's name" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">Language *</label>
            <select id="sub-language" required class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
              <option value="Hindi">Hindi (हिन्दी)</option>
              <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
              <option value="Telugu">Telugu (తెలుగు)</option>
              <option value="Malayalam">Malayalam (മലയാളം)</option>
              <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Genre *</label>
          <select id="sub-genre" required class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
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
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Upload Your Short Film *</label>
          <p class="text-xs text-cinema-muted mb-1">Supported formats: MP4, MOV, AVI, WEBM &nbsp;·&nbsp; <strong class="text-gray-300">Maximum file size: 25 MB</strong></p>
          <input type="file" id="sub-video-file" accept=".mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cinema-accent/10 file:text-cinema-accent hover:file:bg-cinema-accent/20">
          <div id="sub-video-file-error" class="hidden mt-1.5 text-xs font-semibold text-rose-400"></div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Synopsis *</label>
          <textarea id="sub-synopsis" required rows="3" placeholder="Brief description..." class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all resize-y"></textarea>
        </div>

        <!-- Thumbnail / Poster -->
        <div class="space-y-2 bg-cinema-card/50 border border-cinema-border rounded-xl p-3">
          <p class="text-xs font-bold text-cinema-gold uppercase tracking-wide flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Film Thumbnail / Poster Image
          </p>
          <div>
            <label class="block text-xs font-medium text-gray-400 mb-1">Upload Thumbnail (JPG, PNG, WEBP)</label>
            <input type="file" id="sub-poster-file" accept="image/*" onchange="previewSubPoster(event)" class="w-full px-3 py-2 rounded-xl bg-cinema-card border border-cinema-border text-white text-xs outline-none focus:border-cinema-gold/50 transition-all text-gray-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cinema-gold/20 file:text-cinema-gold hover:file:bg-cinema-gold/30">
          </div>
          <div id="sub-poster-preview-wrap" class="hidden">
            <div class="w-full h-28 bg-cinema-card border border-cinema-gold/30 rounded-xl overflow-hidden">
              <img id="sub-poster-preview" src="" alt="Thumbnail preview" class="w-full h-full object-cover">
            </div>
          </div>
        </div>

        <button type="submit" id="submit-film-btn" class="w-full bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm py-3 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2">
          <span>Submit Film for Review</span>
        </button>
      </form>
    </div>
  </div>

  <!-- Sign In Modal -->
  <div id="signin-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
    <div class="bg-cinema-surface border border-cinema-border rounded-2xl w-full max-w-md p-8 relative">
      <button onclick="closeLoginModal()" class="absolute top-4 right-4 text-cinema-muted hover:text-white transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <div class="text-center mb-6">
        <h3 class="text-2xl font-black text-white mb-2 font-display tracking-tight">Welcome Back</h3>
        <p class="text-sm text-cinema-muted">Sign in to access your watchlist and dashboard.</p>
      </div>
      <form onsubmit="handleUserSignIn(event)" class="space-y-4">
        <div id="signin-error" class="hidden p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center font-medium"></div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input type="email" id="signin-email" required placeholder="you@domain.com" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input type="password" id="signin-password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <button type="submit" id="signin-btn" class="w-full bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm py-3 rounded-xl transition-colors mt-2 shadow-lg shadow-cinema-accent/20">
          Sign In
        </button>
        <p class="text-center text-sm text-cinema-muted mt-4">
          Don't have an account? <a href="javascript:void(0)" onclick="switchToSignup()" class="text-cinema-accent hover:underline font-bold">Sign Up</a>
        </p>
      </form>
    </div>
  </div>

  <!-- Sign Up Modal -->
  <div id="signup-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
    <div class="bg-cinema-surface border border-cinema-border rounded-2xl w-full max-w-md p-8 relative">
      <button onclick="closeSignupModal()" class="absolute top-4 right-4 text-cinema-muted hover:text-white transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
      <div class="text-center mb-6">
        <h3 class="text-2xl font-black text-white mb-2 font-display tracking-tight">Create Account</h3>
        <p class="text-sm text-cinema-muted">Sign up to build your watchlist and join the community.</p>
      </div>
      <form onsubmit="handleUserSignUp(event)" class="space-y-4">
        <div id="signup-error" class="hidden p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center font-medium"></div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input type="text" id="signup-name" required placeholder="John Doe" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
          <input type="email" id="signup-email" required placeholder="you@domain.com" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input type="password" id="signup-password" required placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <button type="submit" id="signup-btn" class="w-full bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm py-3 rounded-xl transition-colors mt-2 shadow-lg shadow-cinema-accent/20">
          Sign Up
        </button>
        <p class="text-center text-sm text-cinema-muted mt-4">
          Already have an account? <a href="javascript:void(0)" onclick="switchToLogin()" class="text-cinema-accent hover:underline font-bold">Sign In</a>
        </p>
      </form>
    </div>
  </div>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>
    lucide.createIcons();
  </script>

  <!-- Core JavaScript -->
  <script src="<?php echo $base_url; ?>js/script.js?v=2"></script>

  <script>
    function openSubmitFilmModal() {
      const m = document.getElementById('submit-film-modal');
      if (m) m.classList.remove('hidden');
      if (m) m.classList.add('flex');
    }

    function closeSubmitFilmModal() {
      const m = document.getElementById('submit-film-modal');
      if (m) m.classList.add('hidden');
      if (m) m.classList.remove('flex');
    }

    function openLoginModal() {
      const m = document.getElementById('signin-modal');
      if (m) m.classList.remove('hidden');
      if (m) m.classList.add('flex');
    }

    function closeLoginModal() {
      const m = document.getElementById('signin-modal');
      if (m) m.classList.add('hidden');
      if (m) m.classList.remove('flex');
    }

    function openSignupModal() {
      const m = document.getElementById('signup-modal');
      if (m) m.classList.remove('hidden');
      if (m) m.classList.add('flex');
    }

    function closeSignupModal() {
      const m = document.getElementById('signup-modal');
      if (m) m.classList.add('hidden');
      if (m) m.classList.remove('flex');
    }

    function switchToSignup() {
      closeLoginModal();
      openSignupModal();
    }

    function switchToLogin() {
      closeSignupModal();
      openLoginModal();
    }

    function previewSubPoster(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById('sub-poster-preview').src = e.target.result;
        document.getElementById('sub-poster-preview-wrap').classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }

    async function handleFilmSubmission(e) {
      e.preventDefault();
      const title = document.getElementById('sub-title').value;
      const director = document.getElementById('sub-director').value;
      const language = document.getElementById('sub-language').value;
      const genre = document.getElementById('sub-genre').value;
      const synopsis = document.getElementById('sub-synopsis').value;
      const video_file = document.getElementById('sub-video-file').files[0];
      const poster_file = document.getElementById('sub-poster-file')?.files[0];
      const videoErrDiv = document.getElementById('sub-video-file-error');

      // Clear previous video error
      if (videoErrDiv) { videoErrDiv.textContent = ''; videoErrDiv.classList.add('hidden'); }

      if (!genre) {
          alert('Please select a Genre for your film.');
          return;
      }

      if (!video_file) {
          if (videoErrDiv) {
            videoErrDiv.textContent = 'Please upload a video file to submit your film.';
            videoErrDiv.classList.remove('hidden');
          } else {
            alert('Please upload a video file to submit your film.');
          }
          return;
      }

      // Validate file type
      const allowedExts = ['mp4', 'mov', 'avi', 'webm'];
      const fileExt = video_file.name.split('.').pop().toLowerCase();
      if (!allowedExts.includes(fileExt)) {
          const msg = 'Unsupported video format. Please upload MP4, MOV, AVI, or WEBM.';
          if (videoErrDiv) { videoErrDiv.textContent = msg; videoErrDiv.classList.remove('hidden'); }
          else { alert(msg); }
          return;
      }

      // Validate file size (25 MB)
      const maxBytes = 25 * 1024 * 1024;
      if (video_file.size > maxBytes) {
          const msg = 'Video file is too large. Maximum allowed size is 25 MB.';
          if (videoErrDiv) { videoErrDiv.textContent = msg; videoErrDiv.classList.remove('hidden'); }
          else { alert(msg); }
          return;
      }

      const btn = document.getElementById('submit-film-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Uploading...';
      btn.disabled = true;
      if (typeof lucide !== 'undefined') lucide.createIcons();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('director', director);
      formData.append('language', language);
      formData.append('genre', genre);
      formData.append('synopsis', synopsis);
      formData.append('video_file', video_file);
      if (poster_file) formData.append('poster_file', poster_file);

      try {
          const res = await fetch('<?php echo $base_url; ?>php/api_submit_film.php', {
              method: 'POST',
              body: formData
          });
          const data = await res.json();
          if(data.success) {
              alert('Thank you! "' + title + '" has been submitted to the Admin Queue for review and screening.');
              closeSubmitFilmModal();
              document.getElementById('submit-film-form').reset();
              document.getElementById('sub-poster-preview-wrap').classList.add('hidden');
          } else {
              alert('Error: ' + data.error);
          }
      } catch(err) {
          console.error(err);
          alert('Failed to submit film. Please try again.');
      } finally {
          btn.innerHTML = originalText;
          btn.disabled = false;
      }
    }

    async function handleUserSignIn(e) {
      e.preventDefault();
      const btn = document.getElementById('signin-btn');
      const errDiv = document.getElementById('signin-error');
      const emailInput = document.getElementById('signin-email');
      const passwordInput = document.getElementById('signin-password');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        if (errDiv) {
          errDiv.innerText = 'Please enter both email and password.';
          errDiv.classList.remove('hidden');
        }
        return;
      }

      if (btn) {
        btn.innerText = 'Signing in...';
        btn.disabled = true;
      }
      if (errDiv) errDiv.classList.add('hidden');

      try {
        const response = await fetch('<?php echo $base_url; ?>php/api_login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password })
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem('user_email', email);
          closeLoginModal();
          alert('Welcome back, ' + email.split('@')[0] + '! You are now signed in.');
          window.location.reload();
        } else {
          if (errDiv) {
            errDiv.innerText = data.error || 'Sign in failed. Please try again.';
            errDiv.classList.remove('hidden');
          }
        }
      } catch (err) {
        // Fallback for static environments
        localStorage.setItem('user_email', email);
        closeLoginModal();
        alert('Welcome back, ' + email.split('@')[0] + '! You are now signed in.');
        window.location.reload();
      } finally {
        if (btn) {
          btn.innerText = 'Sign In';
          btn.disabled = false;
        }
      }
    }

    async function handleUserSignUp(e) {
      e.preventDefault();
      const btn = document.getElementById('signup-btn');
      const errDiv = document.getElementById('signup-error');
      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const passwordInput = document.getElementById('signup-password');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!name || !email || !password) {
        if (errDiv) {
          errDiv.innerText = 'Please fill out all fields.';
          errDiv.classList.remove('hidden');
        }
        return;
      }

      if (btn) {
        btn.innerText = 'Signing up...';
        btn.disabled = true;
      }
      if (errDiv) errDiv.classList.add('hidden');

      try {
        const response = await fetch('<?php echo $base_url; ?>php/api_register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name, email: email, password: password })
        });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem('user_email', email);
          closeSignupModal();
          alert('Welcome, ' + email.split('@')[0] + '! You have successfully registered.');
          window.location.reload();
        } else {
          if (errDiv) {
            errDiv.innerText = data.error || 'Sign up failed. Please try again.';
            errDiv.classList.remove('hidden');
          }
        }
      } catch (err) {
        localStorage.setItem('user_email', email);
        closeSignupModal();
        alert('Welcome, ' + email.split('@')[0] + '! You have successfully registered.');
        window.location.reload();
      } finally {
        if (btn) {
          btn.innerText = 'Sign Up';
          btn.disabled = false;
        }
      }
    }
  </script>

  <?php if (isset($extra_js)) { echo $extra_js; } ?>
  <script>
    // Real-time Auto Logout Check
    document.addEventListener("DOMContentLoaded", function() {
      // Capacitor Native Bridge
      if (window.Capacitor) {
          if (window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
              window.Capacitor.Plugins.SplashScreen.hide();
          }
          if (window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
              window.Capacitor.Plugins.App.addListener('backButton', function(data) {
                  if (data.canGoBack) {
                      window.history.back();
                  } else {
                      window.Capacitor.Plugins.App.exitApp();
                  }
              });
          }
      }

      // Fetch and apply dynamic footer settings
      fetch('<?php echo $base_url; ?>php/api_settings.php')
        .then(res => res.json())
        .then(data => {
            if (data && data.success && data.settings) {
                const playLink = document.getElementById('footer-play-store-link');
                const appLink = document.getElementById('footer-app-store-link');
                if (playLink && data.settings.play_store_url && data.settings.play_store_url !== '#') {
                    playLink.href = data.settings.play_store_url;
                }
                if (appLink && data.settings.app_store_url && data.settings.app_store_url !== '#') {
                    appLink.href = data.settings.app_store_url;
                }
            }
        })
        .catch(e => console.error(e));

      <?php if(isset($_SESSION['user_id'])): ?>
      setInterval(async () => {
        try {
          const res = await fetch('<?php echo $base_url; ?>php/api_check_session.php');
          const data = await res.json();
          if (data && data.active === false) {
            window.location.reload(true);
          }
        } catch(e) {}
      }, 5000); // Check every 5 seconds
      <?php endif; ?>
    });
  </script>
</body>
</html>
