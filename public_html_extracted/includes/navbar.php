<?php
/**
 * Indian Short Movie - Navbar Template
 * Next.js Tailwind Design Conversion
 */
?>
<header class="sticky top-0 z-50 glass-panel border-b border-cinema-border/50" style="backdrop-filter: blur(12px); background-color: rgba(7, 8, 11, 0.75);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      
      <!-- Brand Logo & Tagline -->
      <div class="flex items-center gap-8">
        <a href="<?php echo $base_url; ?>index.php" class="flex flex-col items-center justify-center gap-0 group hover:opacity-90 transition-opacity">
          <div class="flex items-center">
            <!-- "indian" -->
            <span class="font-display font-black text-[28px] text-white tracking-tight flex items-center">
              <span class="relative inline-block">i<span class="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
              nd
              <span class="relative inline-block">i<span class="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
              an
            </span>
            
            <!-- "short" badge -->
            <div class="-rotate-[3deg] inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#f84464] via-[#dc2626] to-[#8b5cf6] mx-1.5 shadow-lg">
              <span class="font-display font-black text-white text-[19px] tracking-tight leading-none mt-0.5">short</span>
              <div class="w-[18px] h-[18px] rounded-full bg-white flex items-center justify-center shadow-inner">
                <div class="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-[#dc2626] border-b-[4px] border-b-transparent ml-[2px]"></div>
              </div>
            </div>

            <!-- "movie" -->
            <span class="font-display font-black text-[28px] text-white tracking-tight flex items-center">
              mov
              <span class="relative inline-block">i<span class="absolute top-[7px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] rounded-full bg-[#FF204E]"></span></span>
              e
            </span>
          </div>

          <!-- Tagline -->
          <div class="flex items-center gap-2 mt-1 w-full justify-center opacity-80">
            <span class="w-6 h-[1px] bg-[#FF204E]"></span>
            <span class="text-[9px] font-bold tracking-[0.25em] text-gray-400 uppercase">
              India's Stories on Screen
            </span>
            <span class="w-6 h-[1px] bg-[#FF204E]"></span>
          </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-6">
          <a href="<?php echo $base_url; ?>index.php" class="text-sm font-medium <?php echo ($current_page === 'home') ? 'text-white' : 'text-cinema-muted'; ?> hover:text-cinema-accent transition-colors">
            Home
          </a>
          <a href="<?php echo $base_url; ?>discover.php" class="text-sm font-medium <?php echo ($current_page === 'discover') ? 'text-white' : 'text-cinema-muted'; ?> hover:text-white transition-colors">
            Discover
          </a>
          <a href="<?php echo $base_url; ?>watchlist.php" class="text-sm font-medium <?php echo ($current_page === 'watchlist') ? 'text-white' : 'text-cinema-muted'; ?> hover:text-white transition-colors">
            Watchlist
          </a>
          <a href="<?php echo $base_url; ?>filmmakers.php" class="text-sm font-medium <?php echo ($current_page === 'filmmakers') ? 'text-white' : 'text-cinema-muted'; ?> hover:text-white transition-colors">
            Filmmakers
          </a>
        </nav>
      </div>

      <!-- Right Action Icons & Auth -->
      <div class="hidden md:flex items-center gap-4">
        
        <!-- Search Button -->
        <a href="<?php echo $base_url; ?>discover.php" class="p-2.5 rounded-xl text-cinema-muted hover:text-white hover:bg-cinema-surface transition-all flex items-center gap-2 border border-transparent hover:border-cinema-border">
          <i data-lucide="search" class="w-5 h-5"></i>
          <span class="text-xs text-cinema-muted hidden lg:inline">Search films...</span>
        </a>

        <!-- Submit Film CTA -->
        <a href="javascript:void(0)" onclick="openSubmitFilmModal()" class="px-4 py-2 rounded-xl bg-cinema-surface hover:bg-cinema-card border border-cinema-border text-xs font-semibold text-white flex items-center gap-2 transition-all hover:scale-[1.02]">
          <i data-lucide="plus-circle" class="w-4 h-4 text-cinema-gold"></i>
          Submit Film
        </a>

        <!-- Auth Button Container -->
        <div id="nav-auth-container">
        <?php if(isset($_SESSION['user_id'])): ?>
          <div class="flex items-center gap-2">
            <a href="<?php echo $base_url; ?>profile.php" class="text-xs text-cinema-muted hover:text-white transition-colors font-medium flex items-center gap-1 bg-cinema-surface px-3 py-1.5 rounded-xl border border-cinema-border">
              <i data-lucide="user" class="w-3.5 h-3.5 text-cinema-gold"></i>
              <?php echo htmlspecialchars(explode('@', $_SESSION['user_email'])[0]); ?>
            </a>
            <a href="javascript:void(0)" onclick="handleUserLogout()" class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5">
              <i data-lucide="log-out" class="w-4 h-4"></i>
              Logout
            </a>
          </div>
        <?php else: ?>
          <div class="flex items-center gap-2">
            <a href="javascript:void(0)" onclick="openLoginModal()" class="px-4 py-2 rounded-xl bg-transparent hover:bg-cinema-surface border border-transparent hover:border-cinema-border text-white text-xs font-bold transition-all flex items-center gap-1.5">
              Sign In
            </a>
            <a href="javascript:void(0)" onclick="openSignupModal()" class="px-4 py-2 rounded-xl bg-cinema-accent hover:bg-cinema-accentHover text-white text-xs font-bold shadow-md shadow-cinema-accent/20 transition-all flex items-center gap-1.5">
              <i data-lucide="user-plus" class="w-4 h-4"></i>
              Sign Up
            </a>
          </div>
        <?php endif; ?>
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <div class="flex md:hidden items-center gap-2">
        <a href="<?php echo $base_url; ?>discover.php" class="p-2 text-cinema-muted hover:text-white">
          <i data-lucide="search" class="w-6 h-6"></i>
        </a>
        <button onclick="toggleMobileMenu()" class="p-2 text-cinema-muted hover:text-white">
          <i data-lucide="menu" class="w-6 h-6" id="mobile-menu-icon"></i>
        </button>
      </div>

    </div>
  </div>

  <!-- Mobile Drawer -->
  <div id="mobile-menu" class="hidden md:hidden glass-panel border-t border-cinema-border px-4 pt-4 pb-6 space-y-3" style="background: #07080b;">
    <a href="<?php echo $base_url; ?>index.php" class="block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-cinema-card">
      Home
    </a>
    <a href="<?php echo $base_url; ?>discover.php" class="block px-3 py-2 rounded-lg text-base font-medium text-cinema-muted hover:text-white hover:bg-cinema-card">
      Discover
    </a>
    <a href="<?php echo $base_url; ?>watchlist.php" class="block px-3 py-2 rounded-lg text-base font-medium text-cinema-muted hover:text-white hover:bg-cinema-card">
      Watchlist
    </a>
    <a href="javascript:void(0)" onclick="openSubmitFilmModal(); toggleMobileMenu();" class="block px-3 py-2 rounded-lg text-base font-medium text-cinema-gold hover:bg-cinema-card">
      Submit Film
    </a>

    <div id="mobile-nav-auth-container">
    <?php if(isset($_SESSION['user_id'])): ?>
      <a href="<?php echo $base_url; ?>profile.php" class="block w-full text-center px-4 py-2.5 rounded-xl bg-cinema-surface border border-cinema-border text-white font-bold text-sm mt-4">
        My Profile (<?php echo htmlspecialchars(explode('@', $_SESSION['user_email'])[0]); ?>)
      </a>
      <a href="javascript:void(0)" onclick="handleUserLogout()" class="block w-full text-center px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-sm mt-2">
        Sign Out
      </a>
    <?php else: ?>
      <div class="grid grid-cols-2 gap-3 mt-4">
        <a href="javascript:void(0)" onclick="openLoginModal(); toggleMobileMenu();" class="block w-full text-center px-4 py-2.5 rounded-xl bg-cinema-surface border border-cinema-border text-white font-bold text-sm">
          Sign In
        </a>
        <a href="javascript:void(0)" onclick="openSignupModal(); toggleMobileMenu();" class="block w-full text-center px-4 py-2.5 rounded-xl bg-cinema-accent text-white font-bold text-sm">
          Sign Up
        </a>
      </div>
    <?php endif; ?>
    </div>
  </div>
</header>

<script>
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

function handleUserLogout() {
  localStorage.removeItem('user_email');
  window.location.href = '<?php echo $base_url; ?>php/logout.php';
}

document.addEventListener('DOMContentLoaded', function() {
  const localEmail = localStorage.getItem('user_email');
  const hasPhpSession = <?php echo isset($_SESSION['user_id']) ? 'true' : 'false'; ?>;
  
  if (!hasPhpSession && localEmail) {
    const username = localEmail.split('@')[0];
    const desktopAuth = document.getElementById('nav-auth-container');
    const mobileAuth = document.getElementById('mobile-nav-auth-container');

    if (desktopAuth) {
      desktopAuth.innerHTML = `
        <div class="flex items-center gap-2">
          <a href="<?php echo $base_url; ?>profile.php" class="text-xs text-cinema-muted hover:text-white transition-colors font-medium flex items-center gap-1 bg-cinema-surface px-3 py-1.5 rounded-xl border border-cinema-border">
            <i data-lucide="user" class="w-3.5 h-3.5 text-cinema-gold"></i>
            ${username}
          </a>
          <button onclick="handleUserLogout()" class="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5">
            <i data-lucide="log-out" class="w-4 h-4"></i>
            Logout
          </button>
        </div>
      `;
    }

    if (mobileAuth) {
      mobileAuth.innerHTML = `
        <a href="<?php echo $base_url; ?>profile.php" class="block w-full text-center px-4 py-2.5 rounded-xl bg-cinema-surface border border-cinema-border text-white font-bold text-sm mt-4">
          My Profile (${username})
        </a>
        <button onclick="handleUserLogout()" class="block w-full text-center px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold text-sm mt-2">
          Sign Out
        </button>
      `;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }
});
</script>
