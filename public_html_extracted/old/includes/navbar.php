<?php
/**
 * Indian Short Movie - Navbar Template
 * Production-ready PHP 8+ Reusable Navigation Bar
 */
if (!isset($base_url)) {
    $base_url = './';
}
if (!isset($current_page)) {
    $current_page = 'home';
}
?>
<!-- Top Navigation Header matching reference -->
<header class="sticky top-0 z-50 glass-panel" style="position: sticky; top: 0; z-index: 50; background: rgba(17, 19, 25, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(38, 42, 54, 0.5);">
  <div class="header-container" style="max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; height: 80px; display: flex; align-items: center; justify-content: space-between;">
    
    <!-- Brand Logo (Existing Unchanged) & Desktop Navigation -->
    <div style="display: flex; align-items: center; gap: 2rem;">
      <a href="<?php echo $base_url; ?>index.php" style="display: flex; flex-direction: column; align-items: flex-start; text-decoration: none;" title="Indian Short Movie">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; font-size: 1.25rem; color: #ffffff; letter-spacing: -0.03em;">
            <span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background-color: #f84464;"></span></span>nd<span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background-color: #f84464;"></span></span>an
          </span>
          <div style="transform: rotate(-2deg); display: inline-block;">
            <svg viewBox="0 0 94 36" style="height: 24px; width: auto;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ticketGradientPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f84464" />
                  <stop offset="60%" stop-color="#dc2626" />
                  <stop offset="100%" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M 6 0 L 39 0 A 6 6 0 0 1 55 0 L 88 0 C 91.3 0 94 2.7 94 6 L 94 30 C 94 33.3 89.3 36 88 36 L 55 36 A 6 6 0 0 1 39 36 L 6 36 C 2.7 36 0 33.3 0 30 L 0 6 C 0 2.7 2.7 0 6 0 Z" fill="url(#ticketGradientPhp)" />
              <text x="11" y="24" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16.5" letter-spacing="-0.6px">short</text>
              <g transform="translate(64, 10)">
                <circle cx="8" cy="8" r="7.5" fill="#ffffff" />
                <polygon points="6.5,5 11.5,8 6.5,11" fill="#dc2626" />
              </g>
            </svg>
          </div>
          <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; font-size: 1.25rem; color: #ffffff; letter-spacing: -0.03em;">
            mov<span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background-color: #f84464;"></span></span>e
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
          <span style="width: 12px; height: 1px; background: rgba(229, 9, 20, 0.6);"></span>
          <span style="font-size: 8px; font-weight: 700; letter-spacing: 0.2em; color: #9ca3af; text-transform: uppercase;">India's Stories on Screen</span>
          <span style="width: 12px; height: 1px; background: rgba(229, 9, 20, 0.6);"></span>
        </div>
      </a>

      <!-- Desktop Nav Links -->
      <nav class="nav-links" style="display: flex; align-items: center; gap: 1.5rem;">
        <a href="<?php echo $base_url; ?>index.php" class="nav-link <?php echo ($current_page === 'home') ? 'active' : ''; ?>">Home</a>
        <a href="<?php echo $base_url; ?>discover.php" class="nav-link <?php echo ($current_page === 'discover') ? 'active' : ''; ?>">Discover</a>
        <a href="<?php echo $base_url; ?>watchlist.php" class="nav-link <?php echo ($current_page === 'watchlist') ? 'active' : ''; ?>">Watchlist</a>
        <a href="<?php echo $base_url; ?>filmmakers.php" class="nav-link <?php echo ($current_page === 'filmmakers') ? 'active' : ''; ?>">Filmmakers</a>
      </nav>
    </div>

    <!-- Right Header Actions -->
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      
      <!-- Search Form -->
      <form action="<?php echo $base_url; ?>discover.php" method="GET" class="nav-search-form" style="position: relative; display: none;">
        <input 
          type="text" 
          name="q" 
          placeholder="Search films..." 
          class="nav-search-input"
        >
        <svg class="nav-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </form>

      <!-- Submit Film Button -->
      <button onclick="openSubmitFilmModal()" class="btn-submit" style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 0.9rem; border-radius: 0.75rem; border: 1px solid var(--cinema-border); background: var(--cinema-surface); color: #ffffff; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffb703" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
        <span>Submit Film</span>
      </button>

      <!-- Admin Portal Button -->
      <a href="<?php echo $base_url; ?>admin/index.php" class="btn-admin <?php echo ($current_page === 'admin') ? 'active' : ''; ?>" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 0.85rem; border-radius: 0.75rem; border: 1px solid var(--cinema-border); background: <?php echo ($current_page === 'admin') ? '#e50914' : 'var(--cinema-card)'; ?>; color: #ffffff; font-size: 0.75rem; font-weight: 700; text-decoration: none;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
        <span>Admin</span>
      </a>

      <!-- Sign In Button -->
      <button onclick="openSignInModal()" class="btn-signin" style="display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.5rem 0.85rem; border-radius: 0.75rem; border: 1px solid var(--cinema-border); background: var(--cinema-surface); color: #ffffff; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
        <span>Sign In</span>
      </button>

      <!-- Mobile Hamburger Toggle -->
      <button onclick="toggleMobileNav()" class="mobile-nav-toggle" style="background: transparent; border: none; color: #8e95a5; padding: 0.5rem; display: none; cursor: pointer;" aria-label="Toggle Navigation">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>

    </div>

  </div>

  <!-- Mobile Drawer Navigation -->
  <div id="mobile-nav-drawer" style="display: none; background: #111319; border-bottom: 1px solid #262a36; padding: 1rem 1.5rem;">
    <div style="display: flex; flex-direction: column; gap: 0.75rem;">
      <a href="<?php echo $base_url; ?>index.php" style="padding: 0.5rem 0; color: <?php echo ($current_page === 'home') ? '#e50914' : '#ffffff'; ?>; font-weight: 600; font-size: 0.875rem; text-decoration: none;">Home</a>
      <a href="<?php echo $base_url; ?>discover.php" style="padding: 0.5rem 0; color: <?php echo ($current_page === 'discover') ? '#e50914' : '#ffffff'; ?>; font-weight: 600; font-size: 0.875rem; text-decoration: none;">Discover</a>
      <a href="<?php echo $base_url; ?>watchlist.php" style="padding: 0.5rem 0; color: <?php echo ($current_page === 'watchlist') ? '#e50914' : '#ffffff'; ?>; font-weight: 600; font-size: 0.875rem; text-decoration: none;">Watchlist</a>
      <a href="<?php echo $base_url; ?>filmmakers.php" style="padding: 0.5rem 0; color: <?php echo ($current_page === 'filmmakers') ? '#e50914' : '#ffffff'; ?>; font-weight: 600; font-size: 0.875rem; text-decoration: none;">Filmmakers</a>
      <a href="<?php echo $base_url; ?>admin/index.php" style="padding: 0.5rem 0; color: <?php echo ($current_page === 'admin') ? '#e50914' : '#ffffff'; ?>; font-weight: 600; font-size: 0.875rem; text-decoration: none;">Admin Portal</a>
    </div>
  </div>
</header>
