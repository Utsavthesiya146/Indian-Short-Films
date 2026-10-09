<?php
/**
 * Indian Short Movie - Admin Sidebar Template
 * Production-ready PHP 8+ Left Sidebar Component for Admin Portal
 */
if (!isset($base_url)) {
    $base_url = './';
}
if (!isset($active_tab)) {
    $active_tab = 'overview';
}
?>
<!-- Mobile Admin Bar -->
<div class="mobile-admin-bar">
  <button class="mobile-menu-btn" onclick="toggleAdminSidebar(true)" aria-label="Open Admin Menu">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    <span>Admin Menu</span>
  </button>
  <span class="mobile-role-badge">Role-Based Access</span>
</div>

<!-- Mobile Backdrop Overlay -->
<div class="sidebar-backdrop" id="sidebarBackdrop" onclick="toggleAdminSidebar(false)"></div>

<!-- LEFT SIDEBAR (EXACT MATCHING REFERENCE) -->
<aside class="admin-sidebar" id="adminSidebar">
  <div>
    
    <!-- Existing Logo Unchanged at Top of Sidebar -->
    <div style="padding-bottom: 1.25rem; margin-bottom: 1.25rem; border-bottom: 1px solid rgba(38, 42, 54, 0.6); display: flex; align-items: center; justify-content: space-between;">
      <a href="<?php echo $base_url; ?>index.php" style="display: flex; flex-direction: column; align-items: flex-start; text-decoration: none;" title="Indian Short Movie - Home">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; font-size: 1.15rem; color: #ffffff; letter-spacing: -0.03em;">
            <span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background-color: #f84464;"></span></span>nd<span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background-color: #f84464;"></span></span>an
          </span>
          <div style="transform: rotate(-2deg); display: inline-block;">
            <svg viewBox="0 0 94 36" style="height: 20px; width: auto;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="adminSidebarTicketDarkPhp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#f84464" />
                  <stop offset="60%" stop-color="#dc2626" />
                  <stop offset="100%" stop-color="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M 6 0 L 39 0 A 6 6 0 0 1 55 0 L 88 0 C 91.3 0 94 2.7 94 6 L 94 30 C 94 33.3 89.3 36 88 36 L 55 36 A 6 6 0 0 1 39 36 L 6 36 C 2.7 36 0 33.3 0 30 L 0 6 C 0 2.7 2.7 0 6 0 Z" fill="url(#adminSidebarTicketDarkPhp)" />
              <text x="11" y="24" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="16.5" letter-spacing="-0.6px">short</text>
              <g transform="translate(64, 10)">
                <circle cx="8" cy="8" r="7.5" fill="#ffffff" />
                <polygon points="6.5,5 11.5,8 6.5,11" fill="#dc2626" />
              </g>
            </svg>
          </div>
          <span style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; font-size: 1.15rem; color: #ffffff; letter-spacing: -0.03em;">
            mov<span style="position: relative; display: inline-block;">i<span style="position: absolute; top: -2px; left: 50%; transform: translateX(-50%); width: 5px; height: 5px; border-radius: 50%; background-color: #f84464;"></span></span>e
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 2px;">
          <span style="width: 12px; height: 1px; background: rgba(229, 9, 20, 0.6);"></span>
          <span style="font-size: 7.5px; font-weight: 700; letter-spacing: 0.2em; color: #9ca3af; text-transform: uppercase;">India's Stories on Screen</span>
          <span style="width: 12px; height: 1px; background: rgba(229, 9, 20, 0.6);"></span>
        </div>
      </a>
      <button onclick="toggleAdminSidebar(false)" style="background: none; border: none; color: #8e95a5; font-size: 1.25rem; cursor: pointer; padding: 0.25rem; display: flex;" aria-label="Close Admin Menu" class="mobile-close-btn">
        ✕
      </button>
    </div>

    <!-- Sidebar Brand / Role-Based Access Header -->
    <div class="sidebar-header">
      <div class="sidebar-icon-box">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        </svg>
      </div>
      <div>
        <h2 class="sidebar-brand-title">ADMIN PORTAL</h2>
        <span class="sidebar-tag">Role-Based Access</span>
      </div>
    </div>

    <!-- Sidebar Navigation matching reference exactly -->
    <nav class="sidebar-nav">
      <button class="sidebar-nav-item <?php echo ($active_tab === 'overview') ? 'active' : ''; ?>" onclick="switchAdminTab('overview', this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
        <span>Overview</span>
      </button>

      <button class="sidebar-nav-item <?php echo ($active_tab === 'films') ? 'active' : ''; ?>" onclick="switchAdminTab('films', this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
        <span>Film Management</span>
      </button>

      <button class="sidebar-nav-item <?php echo ($active_tab === 'submissions') ? 'active' : ''; ?>" onclick="switchAdminTab('submissions', this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>
        <span>Submissions Queue</span>
      </button>

      <button class="sidebar-nav-item <?php echo ($active_tab === 'reports') ? 'active' : ''; ?>" onclick="switchAdminTab('reports', this)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
        <span>Content Moderation</span>
      </button>
    </nav>

  </div>

  <!-- Bottom Link: Back to Main Site -->
  <div style="padding-top: 1.25rem; border-top: 1px solid rgba(38, 42, 54, 0.6);">
    <a href="<?php echo $base_url; ?>index.php" style="display: flex; align-items: center; gap: 0.5rem; color: #8e95a5; font-size: 0.75rem; font-weight: 600; text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.75rem; transition: all 0.2s;" onmouseover="this.style.color='#ffffff'; this.style.backgroundColor='#181b24';" onmouseout="this.style.color='#8e95a5'; this.style.backgroundColor='transparent';">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      <span>Back to Main Site</span>
    </a>
  </div>
</aside>
