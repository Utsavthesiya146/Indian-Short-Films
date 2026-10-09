<?php
/**
 * Indian Short Movie - Admin Sidebar Template
 * Tailwind CSS Sidebar Component for Admin Portal
 */
if (!isset($base_url)) {
    $base_url = './';
}
if (!isset($active_tab)) {
    $active_tab = 'overview';
}
?>
<!-- Mobile Admin Bar -->
<div class="md:hidden flex items-center justify-between p-4 bg-cinema-surface border-b border-cinema-border sticky top-0 z-40">
  <button class="text-cinema-muted hover:text-white transition-colors" onclick="toggleAdminSidebar(true)" aria-label="Open Admin Menu">
    <i data-lucide="menu" class="w-6 h-6"></i>
  </button>
  <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-accent/10 text-cinema-accent px-2.5 py-1 rounded-md border border-cinema-accent/20">Role-Based Access</span>
</div>

<!-- Mobile Backdrop Overlay -->
<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 hidden md:hidden" id="sidebarBackdrop" onclick="toggleAdminSidebar(false)"></div>

<!-- LEFT SIDEBAR -->
<aside class="fixed inset-y-0 left-0 z-50 w-64 bg-cinema-surface border-r border-cinema-border flex flex-col justify-between transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out" id="adminSidebar">
  <div class="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-20 no-scrollbar">
    
    <!-- Brand Header -->
    <div class="pb-6 mb-6 border-b border-cinema-border flex items-center justify-between">
      <a href="<?php echo $base_url; ?>index.php" class="flex items-center gap-0 group hover:opacity-90 transition-opacity">
        <?php
          $customLogo = __DIR__ . '/../uploads/logo.png';
          $logoUrl = file_exists($customLogo) ? $base_url . 'uploads/logo.png' : $base_url . 'indianshortmovies.png';
        ?>
        <img id="admin-sidebar-logo" src="<?php echo $logoUrl; ?>" alt="Indian Short Movies Logo" class="h-10 w-auto object-contain">
      </a>
      
      <!-- Close Button (Mobile Only) -->
      <button onclick="toggleAdminSidebar(false)" class="md:hidden text-cinema-muted hover:text-white transition-colors">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Sidebar Title -->
    <div class="flex items-center gap-3 mb-8">
      <div class="w-10 h-10 rounded-xl bg-cinema-card border border-cinema-border flex items-center justify-center text-white shadow-md">
        <i data-lucide="shield" class="w-5 h-5"></i>
      </div>
      <div>
        <h2 class="font-display font-black text-white text-lg tracking-tight leading-tight">ADMIN PORTAL</h2>
        <span class="text-[9px] font-bold tracking-wider uppercase text-cinema-accent">Role-Based Access</span>
      </div>
    </div>

    <!-- Sidebar Navigation -->
    <nav class="space-y-2">
      <!-- Overview -->
      <button class="sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all <?php echo ($active_tab === 'overview') ? 'bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent' : 'text-cinema-muted hover:bg-cinema-card hover:text-white'; ?>" onclick="switchAdminTab('overview', this)">
        <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
        <span>Overview</span>
      </button>

      <!-- Film Management -->
      <button class="sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all <?php echo ($active_tab === 'films') ? 'bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent' : 'text-cinema-muted hover:bg-cinema-card hover:text-white'; ?>" onclick="switchAdminTab('films', this)">
        <i data-lucide="film" class="w-5 h-5"></i>
        <span>Film Management</span>
      </button>

      <!-- Submissions -->
      <button class="sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all <?php echo ($active_tab === 'submissions') ? 'bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent' : 'text-cinema-muted hover:bg-cinema-card hover:text-white'; ?>" onclick="switchAdminTab('submissions', this)">
        <i data-lucide="inbox" class="w-5 h-5"></i>
        <span>Submissions Queue</span>
      </button>

      <!-- Reports -->
      <button class="sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all <?php echo ($active_tab === 'reports') ? 'bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent' : 'text-cinema-muted hover:bg-cinema-card hover:text-white'; ?>" onclick="switchAdminTab('reports', this)">
        <i data-lucide="shield-alert" class="w-5 h-5"></i>
        <span>Content Moderation</span>
      </button>

      <!-- Settings -->
      <button class="sidebar-nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all <?php echo ($active_tab === 'settings') ? 'bg-cinema-accent/10 text-cinema-accent border-r-2 border-cinema-accent' : 'text-cinema-muted hover:bg-cinema-card hover:text-white'; ?>" onclick="switchAdminTab('settings', this)">
        <i data-lucide="settings" class="w-5 h-5"></i>
        <span>Platform Settings</span>
      </button>
    </nav>

  </div>

  <!-- Bottom Link: Back to Main Site and Logout -->
  <div class="p-6 border-t border-cinema-border bg-cinema-surface/50 space-y-2">
    <a href="<?php echo $base_url; ?>index.php" class="flex items-center gap-2 text-sm font-semibold text-cinema-muted hover:text-white hover:bg-cinema-card px-4 py-3 rounded-xl transition-all">
      <i data-lucide="corner-down-left" class="w-4 h-4"></i>
      <span>Back to Main Site</span>
    </a>
    <a href="<?php echo $base_url; ?>admin/logout.php" class="flex items-center gap-2 text-sm font-semibold text-rose-500 hover:text-white hover:bg-rose-500/20 px-4 py-3 rounded-xl transition-all">
      <i data-lucide="log-out" class="w-4 h-4"></i>
      <span>Admin Logout</span>
    </a>
  </div>
</aside>

<script>
  function toggleAdminSidebar(open) {
    const sidebar = document.getElementById("adminSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    
    // Check if open is undefined, if so, toggle state
    if(typeof open === "undefined") {
      open = sidebar.classList.contains("-translate-x-full");
    }

    if (sidebar && backdrop) {
      if (open) {
        sidebar.classList.remove("-translate-x-full");
        backdrop.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      } else {
        sidebar.classList.add("-translate-x-full");
        backdrop.classList.add("hidden");
        document.body.style.overflow = "";
      }
    }
  }
</script>
