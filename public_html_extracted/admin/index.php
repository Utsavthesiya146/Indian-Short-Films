<?php
/**
 * Indian Short Movie - Admin Portal
 * Tailwind CSS + PHP 8+ Admin Page
 */
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
$page_title = 'Admin Portal | Platform Analytics & Dashboard';
$page_description = 'Indian Short Movie Administration - Role-Based Access, Catalog Management, Submissions Queue, and Moderation.';
$current_page = 'admin';
$base_url = '../';
$active_tab = 'overview';

require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
@include_once __DIR__ . '/../php/db.php';

$total_users_count = 0;
if (isset($pdo) && $pdo instanceof PDO) {
    try {
        $u_stmt = $pdo->query("SELECT COUNT(*) FROM users");
        if ($u_stmt) {
            $db_c = (int)$u_stmt->fetchColumn();
            $total_users_count = $db_c;
        }
    } catch (Exception $e) {}
}
?>

<div class="flex min-h-screen bg-cinema-bg">
  
  <!-- LEFT SIDEBAR INCLUDED -->
  <?php require_once __DIR__ . '/../includes/sidebar.php'; ?>

  <!-- MAIN ADMIN WORKSPACE CONTENT -->
  <main class="flex-1 transition-all duration-300 md:ml-64 p-4 sm:p-8 overflow-x-hidden">
    
    <!-- SUBPAGE 1: OVERVIEW (PLATFORM ANALYTICS & DASHBOARD) -->
    <section id="tab-overview" class="tab-section active space-y-8">
      
      <!-- Header & Action Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Platform Analytics &amp; Dashboard
          </h1>
          <p class="text-xs sm:text-sm text-cinema-muted mt-1">
            Real-time overview of users, film uploads, submissions, and moderation
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <a href="../indian-short-movie-php.zip" download="indian-short-movie-php.zip" class="flex items-center gap-2 bg-cinema-card text-cinema-teal border border-cinema-teal/40 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-cinema-surface transition-all shadow-md shadow-cinema-teal/10">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span>Download PHP Project (ZIP)</span>
          </a>
          <button onclick="openAddNewFilmModal()" class="flex items-center gap-2 bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cinema-accent/30 hover:scale-105">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Add New Film</span>
          </button>
        </div>
      </div>

      <!-- 8 Metric Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-blue-400/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Total Users</span>
            <i data-lucide="users" class="w-5 h-5 text-blue-400"></i>
          </div>
          <div id="admin-total-users-count" class="text-3xl font-black text-white font-display tracking-tight"><?php echo $total_users_count; ?></div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-cinema-gold/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Total Short Films</span>
            <i data-lucide="film" class="w-5 h-5 text-cinema-gold"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight" data-stat="total-films">--</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-emerald-400/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Published Films</span>
            <i data-lucide="check-square" class="w-5 h-5 text-emerald-400"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight" data-stat="published-films">--</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-cinema-accent/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Pending Submissions</span>
            <i data-lucide="inbox" class="w-5 h-5 text-cinema-accent"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight">0</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-cinema-teal/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Total Video Views</span>
            <i data-lucide="eye" class="w-5 h-5 text-cinema-teal"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight" data-stat="total-views">--</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-purple-400/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Total Reviews</span>
            <i data-lucide="message-square" class="w-5 h-5 text-purple-400"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight">--</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-amber-400/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Filmmakers</span>
            <i data-lucide="user-check" class="w-5 h-5 text-amber-400"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight" data-stat="filmmakers">--</div>
        </div>

        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-rose-400/50 transition-colors shadow-lg shadow-black/20">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Pending Reports</span>
            <i data-lucide="shield-alert" class="w-5 h-5 text-rose-400"></i>
          </div>
          <div class="text-3xl font-black text-white font-display tracking-tight">0</div>
        </div>

      </div>

      <!-- Visual Analytics Panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Panel 1: Popular Indian Languages -->
        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-cinema-border">
            <h3 class="font-display font-bold text-lg text-white flex items-center gap-2">
              <i data-lucide="bar-chart-2" class="w-5 h-5 text-cinema-teal"></i>
              Popular Indian Languages
            </h3>
            <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-surface text-cinema-muted px-2.5 py-1 rounded-md border border-cinema-border">By View Share</span>
          </div>

          <div class="space-y-5">
            <div class="flex flex-col items-center justify-center py-8 text-cinema-muted bg-cinema-surface/20 rounded-xl border border-cinema-border/30">
              <i data-lucide="pie-chart" class="w-8 h-8 mb-2 opacity-50"></i>
              <p class="text-xs">Not enough data to calculate view share.</p>
            </div>
          </div>
        </div>

        <!-- Panel 2: Recent Admin Activity -->
        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-cinema-border">
            <h3 class="font-display font-bold text-lg text-white flex items-center gap-2">
              <i data-lucide="activity" class="w-5 h-5 text-cinema-gold"></i>
              Recent Admin Activity
            </h3>
            <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-surface text-cinema-muted px-2.5 py-1 rounded-md border border-cinema-border">Audit Logs</span>
          </div>

          <div class="space-y-4">
            <div class="flex flex-col items-center justify-center py-8 text-cinema-muted bg-cinema-surface/20 rounded-xl border border-cinema-border/30">
              <i data-lucide="clock" class="w-8 h-8 mb-2 opacity-50"></i>
              <p class="text-xs">No recent admin activity found.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel 3: Registered Platform Users Table -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30 mt-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-cinema-border">
          <h3 class="font-display font-bold text-lg text-white flex items-center gap-2">
            <i data-lucide="users" class="w-5 h-5 text-blue-400"></i>
            Registered Users List (<span id="admin-users-table-count"><?php echo $total_users_count; ?></span>)
          </h3>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Bulk Action Bar (hidden until rows selected) -->
            <div id="users-bulk-bar" class="hidden items-center gap-2">
              <span id="users-selected-count" class="text-xs font-bold text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/20 px-3 py-1.5 rounded-lg">0 selected</span>
              <button onclick="bulkDeleteUsers()" class="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete Selected
              </button>
            </div>
            <button onclick="exportTableToCSV('users')" class="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
              <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Excel
            </button>
            <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-surface text-cinema-muted px-2.5 py-1 rounded-md border border-cinema-border">Database Sync</span>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="bg-cinema-surface/50 border-b border-cinema-border text-[11px] uppercase tracking-wider text-cinema-muted font-bold">
                <th class="px-4 py-3 w-10"><input type="checkbox" id="users-select-all" onchange="toggleSelectAll('users')" class="w-4 h-4 rounded accent-cinema-accent cursor-pointer"></th>
                <th class="px-4 py-3">ID</th>
                <th class="px-4 py-3">Name / Username</th>
                <th class="px-4 py-3">Email Address</th>
                <th class="px-4 py-3">Role</th>
                <th class="px-4 py-3">Registered Date</th>
                <th class="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-users-tbody" class="divide-y divide-cinema-border/50">
              <?php
              if (isset($pdo) && $pdo instanceof PDO) {
                  try {
                      $u_rows = $pdo->query("SELECT id, name, username, email, role, created_at FROM users ORDER BY id DESC LIMIT 20")->fetchAll();
                      if ($u_rows && count($u_rows) > 0) {
                          foreach ($u_rows as $ur) {
                              echo '<tr class="hover:bg-cinema-surface/50 transition-colors" data-id="' . (int)$ur['id'] . '">';
                              echo '<td class="px-4 py-3"><input type="checkbox" class="user-row-cb w-4 h-4 rounded accent-cinema-accent cursor-pointer" data-id="' . (int)$ur['id'] . '" onchange="updateBulkBar(\'users\')"></td>';
                              echo '<td class="px-4 py-3 font-mono text-xs text-cinema-muted">#' . htmlspecialchars($ur['id']) . '</td>';
                              echo '<td class="px-4 py-3 font-bold text-white">' . htmlspecialchars($ur['name'] ?: $ur['username']) . '</td>';
                              echo '<td class="px-4 py-3 text-cinema-teal font-medium">' . htmlspecialchars($ur['email']) . '</td>';
                              echo '<td class="px-4 py-3"><span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">' . htmlspecialchars($ur['role'] ?: 'user') . '</span></td>';
                              echo '<td class="px-4 py-3 text-cinema-muted text-xs">' . htmlspecialchars($ur['created_at']) . '</td>';
                              echo '<td class="px-4 py-3 text-right"><button onclick="deleteUser(' . (int)$ur['id'] . ', \'' . htmlspecialchars($ur['email'], ENT_QUOTES) . '\')" class="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete</button></td>';
                              echo '</tr>';
                          }
                      } else {
                          echo '<tr><td colspan="7" class="px-4 py-6 text-center text-cinema-muted text-xs">No registered users in database yet.</td></tr>';
                      }
                  } catch (Exception $e) {
                      echo '<tr><td colspan="7" class="px-4 py-6 text-center text-cinema-muted text-xs">Connecting to database...</td></tr>';
                  }
              }
              ?>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SUBPAGE 2: FILM MANAGEMENT -->
    <section id="tab-films" class="tab-section hidden space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Film Catalog Management</h1>
          <p class="text-xs sm:text-sm text-cinema-muted mt-1">Manage short films, editorial features, and regional visibility</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Bulk Action Bar -->
          <div id="films-bulk-bar" class="hidden items-center gap-2">
            <span id="films-selected-count" class="text-xs font-bold text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/20 px-3 py-1.5 rounded-lg">0 selected</span>
            <button onclick="bulkDeleteFilms()" class="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete Selected
            </button>
          </div>
          <button onclick="exportTableToCSV('films')" class="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Excel
          </button>
          <button onclick="openAddNewFilmModal()" class="flex items-center gap-2 bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cinema-accent/30 hover:scale-105">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Add New Film</span>
          </button>
        </div>
      </div>

      <!-- Filter bar -->
      <div class="flex flex-wrap items-center gap-3 bg-cinema-card border border-cinema-border rounded-xl p-4 shadow-md shadow-black/20">
        <div class="relative">
          <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cinema-muted"></i>
          <input 
            type="text" 
            id="admin-film-search" 
            placeholder="Search films or directors..." 
            oninput="filterAdminFilmsTable()"
            class="pl-9 pr-4 py-2.5 bg-cinema-surface border border-cinema-border rounded-lg text-white text-xs font-medium focus:border-cinema-accent/50 outline-none w-full sm:w-64 transition-all"
          >
        </div>
        <select id="admin-film-lang-filter" onchange="filterAdminFilmsTable()" class="px-4 py-2.5 bg-cinema-surface border border-cinema-border rounded-lg text-white text-xs font-medium focus:border-cinema-accent/50 outline-none cursor-pointer transition-all">
          <option value="All">All Languages</option>
          <option value="Hindi">Hindi</option>
          <option value="Kannada">Kannada</option>
          <option value="Tamil">Tamil</option>
          <option value="Telugu">Telugu</option>
          <option value="Malayalam">Malayalam</option>
        </select>
      </div>

      <!-- Table Container -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="bg-cinema-surface/50 border-b border-cinema-border text-[11px] uppercase tracking-wider text-cinema-muted font-bold">
                <th class="px-6 py-4 w-10"><input type="checkbox" id="films-select-all" onchange="toggleSelectAll('films')" class="w-4 h-4 rounded accent-cinema-accent cursor-pointer"></th>
                <th class="px-6 py-4">Film</th>
                <th class="px-6 py-4">Director</th>
                <th class="px-6 py-4">Language</th>
                <th class="px-6 py-4">Views / Rating</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-films-tbody" class="divide-y divide-cinema-border/50">
              <!-- Populated via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SUBPAGE 3: SUBMISSIONS QUEUE -->
    <section id="tab-submissions" class="tab-section hidden space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Film Submissions Queue</h1>
          <p class="text-xs sm:text-sm text-cinema-muted mt-1">Review submitted short films, verify credentials, and approve for publishing</p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <!-- Bulk Action Bar -->
          <div id="subs-bulk-bar" class="hidden items-center gap-2">
            <span id="subs-selected-count" class="text-xs font-bold text-cinema-gold bg-cinema-gold/10 border border-cinema-gold/20 px-3 py-1.5 rounded-lg">0 selected</span>
            <button onclick="bulkDeleteSubmissions()" class="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-400 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete Selected
            </button>
          </div>
          <button onclick="exportTableToCSV('submissions')" class="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
            <i data-lucide="download" class="w-3.5 h-3.5"></i> Export Excel
          </button>
        </div>
      </div>

      <!-- Submissions Table Container -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden shadow-xl shadow-black/30">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr class="bg-cinema-surface/50 border-b border-cinema-border text-[11px] uppercase tracking-wider text-cinema-muted font-bold">
                <th class="px-6 py-4 w-10"><input type="checkbox" id="subs-select-all" onchange="toggleSelectAll('subs')" class="w-4 h-4 rounded accent-cinema-accent cursor-pointer"></th>
                <th class="px-6 py-4">Title</th>
                <th class="px-6 py-4">Director</th>
                <th class="px-6 py-4">Language</th>
                <th class="px-6 py-4">Genre</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4">Submitted At</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-submissions-tbody" class="divide-y divide-cinema-border/50">
              <tr>
                 <td colspan="7" class="px-6 py-12 text-center">
                    <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500"></i>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-1">Submissions Queue is Clean</h3>
                    <p class="text-xs text-cinema-muted">Loading submissions...</p>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SUBPAGE 4: CONTENT MODERATION -->
    <section id="tab-reports" class="tab-section hidden space-y-6">
      <div>
        <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Content Moderation Queue</h1>
        <p class="text-xs sm:text-sm text-cinema-muted mt-1">Review community reports for copyright, spam, or inappropriate content</p>
      </div>

      <div class="bg-cinema-card border border-cinema-border rounded-3xl p-12 text-center mt-6 shadow-xl shadow-black/20">
        <div class="w-20 h-20 bg-cinema-teal/10 border border-cinema-teal/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i data-lucide="shield-check" class="w-10 h-10 text-cinema-teal"></i>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">All Clean! No Pending Reports</h3>
        <p class="text-sm text-cinema-muted max-w-md mx-auto leading-relaxed">
          Community reports will appear here when users flag reviews, comments, or short films. Great job keeping the platform safe!
        </p>
      </div>
    </section>

    <!-- SUBPAGE 5: PLATFORM SETTINGS -->
    <section id="tab-settings" class="tab-section hidden space-y-6">
      <div>
        <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">Platform Settings</h1>
        <p class="text-xs sm:text-sm text-cinema-muted mt-1">Manage global site configurations, website logo, and external links</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mt-6">
        <!-- Logo Management Card -->
        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
          <h3 class="font-display font-bold text-lg text-white mb-6 border-b border-cinema-border pb-4 flex items-center gap-2">
            <i data-lucide="image" class="w-5 h-5 text-cinema-gold"></i>
            Website &amp; Admin Logo Management
          </h3>
          <form onsubmit="handleLogoUpload(event)" enctype="multipart/form-data" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Current Active Logo</label>
              <div class="p-4 bg-cinema-surface border border-cinema-border rounded-xl flex items-center justify-center min-h-[90px] shadow-inner">
                <?php
                  $customLogo = __DIR__ . '/../uploads/logo.png';
                  $logoUrl = file_exists($customLogo) ? '../uploads/logo.png?v=' . time() : '../indianshortmovies.png';
                ?>
                <img id="admin-settings-logo-preview" src="<?php echo $logoUrl; ?>" alt="Website Logo" class="h-12 w-auto object-contain">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Upload New Logo (PNG, JPG, WEBP)</label>
              <input type="file" id="admin-logo-file" accept="image/png, image/jpeg, image/webp" required class="w-full px-4 py-2.5 rounded-xl bg-cinema-surface border border-cinema-border text-white text-xs outline-none focus:border-cinema-gold/50 transition-all text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cinema-gold/20 file:text-cinema-gold hover:file:bg-cinema-gold/30">
              <p class="text-[11px] text-cinema-muted mt-1.5">Recommended: Transparent PNG image. Uploading will instantly update the logo across the platform.</p>
            </div>
            <button type="submit" id="admin-logo-upload-btn" class="w-full bg-cinema-gold hover:bg-amber-400 text-black font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-cinema-gold/20 flex justify-center items-center gap-2 mt-2">
              <i data-lucide="upload" class="w-4 h-4"></i> Upload &amp; Update Logo
            </button>
          </form>
        </div>

        <!-- External App Links & Account Credentials Card -->
        <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
          <h3 class="font-display font-bold text-lg text-white mb-6 border-b border-cinema-border pb-4 flex items-center gap-2">
            <i data-lucide="link" class="w-5 h-5 text-cinema-teal"></i>
            External App Links &amp; Credentials
          </h3>
          <form onsubmit="handleAdminSettingsSave(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Google Play Store URL</label>
              <input type="text" id="admin-setting-play-store" placeholder="https://play.google.com/store/apps/..." class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Apple App Store URL</label>
              <input type="text" id="admin-setting-app-store" placeholder="https://apps.apple.com/..." class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
            </div>
            <div class="pt-4 border-t border-cinema-border">
              <h4 class="text-sm font-bold text-white mb-4">Admin Account Credentials</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Admin Email</label>
                  <input type="email" id="admin-setting-email" placeholder="info@jobhunterr.com" class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Admin Password (leave blank to keep current)</label>
                  <input type="password" id="admin-setting-password" placeholder="••••••••" class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
                </div>
              </div>
            </div>
            <button type="submit" id="admin-settings-save-btn" class="w-full bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-cinema-accent/20 mt-4 flex justify-center items-center gap-2">
              <i data-lucide="save" class="w-4 h-4"></i> Save Settings
            </button>
          </form>
        </div>
      </div>
    </section>


  </main>
</div>

<!-- Add New Film Modal -->
<div id="add-film-modal" class="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
  <div class="bg-cinema-surface border border-cinema-border rounded-3xl w-full max-w-2xl p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
    <button onclick="closeAddNewFilmModal()" class="absolute top-5 right-5 text-cinema-muted hover:text-white transition-colors">
      <i data-lucide="x" class="w-6 h-6"></i>
    </button>
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-cinema-accent/10 flex items-center justify-center">
        <i data-lucide="film" class="w-5 h-5 text-cinema-accent"></i>
      </div>
      <div>
        <h3 class="text-xl font-black text-white font-display tracking-tight">+ Add New Short Film</h3>
        <p class="text-xs text-cinema-muted">Publish directly to the live website catalog</p>
      </div>
    </div>
    
    <form onsubmit="handleAdminAddNewFilm(event)" class="space-y-4">
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Film Title *</label>
        <input type="text" id="admin-new-title" required placeholder="e.g. Basavanagudi Mornings" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Director *</label>
          <input type="text" id="admin-new-director" required placeholder="Director's Name" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Language *</label>
          <select id="admin-new-lang" required class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
            <option value="Hindi">Hindi (हिन्दी)</option>
            <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
            <option value="Tamil">Tamil (தமிழ்)</option>
            <option value="Telugu">Telugu (తెలుగు)</option>
            <option value="Malayalam">Malayalam (മലയാളം)</option>
            <option value="Gujarati">Gujarati (ગુજરાતી)</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Marathi">Marathi (मराठी)</option>
            <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
            <option value="Odia">Odia (ଓଡ଼ିଆ)</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Genre</label>
          <input type="text" id="admin-new-genre" placeholder="e.g. Drama, Thriller, Comedy" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Duration</label>
          <input type="text" id="admin-new-duration" placeholder="e.g. 15 mins" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all">
        </div>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Upload Video File (MP4, MOV, AVI, WEBM)</label>
          <p class="text-[10px] text-cinema-muted mb-1 uppercase tracking-wider">Maximum file size: 25 MB</p>
          <input type="file" id="admin-new-video-file" accept=".mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm" class="w-full px-4 py-2.5 rounded-xl bg-cinema-card border border-cinema-border text-white text-xs outline-none focus:border-cinema-accent/50 transition-all text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cinema-accent/20 file:text-cinema-accent hover:file:bg-cinema-accent/30">
        </div>
      </div>

      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Upload Poster Image (JPG, PNG, WEBP)</label>
          <input type="file" id="admin-new-poster-file" accept="image/*" class="w-full px-4 py-2.5 rounded-xl bg-cinema-card border border-cinema-border text-white text-xs outline-none focus:border-cinema-accent/50 transition-all text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cinema-accent/20 file:text-cinema-accent hover:file:bg-cinema-accent/30">
        </div>
      </div>

      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Synopsis / Description *</label>
        <textarea id="admin-new-synopsis" required rows="3" placeholder="Brief description of the film..." class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all resize-y"></textarea>
      </div>
      <button type="submit" id="admin-add-film-btn" class="w-full bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-cinema-accent/20 mt-2 flex items-center justify-center gap-2">
        <i data-lucide="check-circle" class="w-4 h-4"></i>
        Publish Short Film to Website
      </button>
    </form>
  </div>
</div>

<!-- Edit Thumbnail / Poster Modal -->
<div id="edit-poster-modal" class="fixed inset-0 z-[1100] hidden items-center justify-center bg-black/90 backdrop-blur-sm p-4">
  <div class="bg-cinema-surface border border-cinema-border rounded-3xl w-full max-w-lg p-8 relative shadow-2xl">
    <button onclick="closeEditPosterModal()" class="absolute top-5 right-5 text-cinema-muted hover:text-white transition-colors">
      <i data-lucide="x" class="w-6 h-6"></i>
    </button>
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
        <i data-lucide="image" class="w-5 h-5 text-amber-400"></i>
      </div>
      <div>
        <h3 class="text-xl font-black text-white font-display tracking-tight">Edit Thumbnail</h3>
        <p id="edit-poster-film-name" class="text-xs text-cinema-muted">Film title loading...</p>
      </div>
    </div>

    <!-- Current Thumbnail Preview -->
    <div class="mb-5">
      <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Thumbnail</p>
      <div class="relative w-full h-40 bg-cinema-card border border-cinema-border rounded-xl overflow-hidden">
        <img id="edit-poster-current-img" src="" alt="Current Thumbnail" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <span class="absolute bottom-2 left-3 text-xs text-white font-semibold opacity-80">Current</span>
      </div>
    </div>

    <form onsubmit="handleUpdatePoster(event)" enctype="multipart/form-data" class="space-y-4">
      <input type="hidden" id="edit-poster-film-id">

      <!-- Option 1: URL -->
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">New Thumbnail URL</label>
        <input type="text" id="edit-poster-url" placeholder="https://... (paste direct image link)" class="w-full px-4 py-3 rounded-xl bg-cinema-card border border-cinema-border text-white text-sm outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-all">
      </div>

      <div class="flex items-center gap-3">
        <div class="flex-1 h-px bg-cinema-border"></div>
        <span class="text-xs text-cinema-muted font-semibold">OR</span>
        <div class="flex-1 h-px bg-cinema-border"></div>
      </div>

      <!-- Option 2: File Upload -->
      <div>
        <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Upload New Thumbnail (JPG, PNG, WEBP)</label>
        <input type="file" id="edit-poster-file" accept="image/*" onchange="previewEditPoster(event)" class="w-full px-4 py-2.5 rounded-xl bg-cinema-card border border-cinema-border text-white text-xs outline-none focus:border-amber-400/50 transition-all text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30">
      </div>

      <!-- Preview of new image -->
      <div id="edit-poster-preview-wrap" class="hidden">
        <p class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">New Thumbnail Preview</p>
        <div class="w-full h-40 bg-cinema-card border border-amber-500/30 rounded-xl overflow-hidden">
          <img id="edit-poster-preview" src="" alt="Preview" class="w-full h-full object-cover">
        </div>
      </div>

      <div id="edit-poster-error" class="hidden text-rose-400 text-xs font-medium bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center"></div>

      <button type="submit" id="edit-poster-save-btn" class="w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 mt-2 flex items-center justify-center gap-2">
        <i data-lucide="save" class="w-4 h-4"></i>
        Save New Thumbnail
      </button>
    </form>
  </div>
</div>

<?php
ob_start();
?>
<script>
  function switchAdminTab(tabName, btnElement) {
    document.querySelectorAll(".tab-section").forEach(el => {
        el.classList.add("hidden");
        el.classList.remove("active");
    });
    document.querySelectorAll(".sidebar-nav-item").forEach(el => {
        el.classList.remove("bg-cinema-accent/10", "text-cinema-accent", "border-r-2", "border-cinema-accent");
        el.classList.add("text-cinema-muted", "hover:bg-cinema-card", "hover:text-white");
    });
    
    const target = document.getElementById("tab-" + tabName);
    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active");
    }
    if (btnElement) {
        btnElement.classList.remove("text-cinema-muted", "hover:bg-cinema-card", "hover:text-white");
        btnElement.classList.add("bg-cinema-accent/10", "text-cinema-accent", "border-r-2", "border-cinema-accent");
    }
    
    // Auto-close mobile sidebar if open
    const sidebar = document.getElementById("adminSidebar");
    if(sidebar && !sidebar.classList.contains("-translate-x-full")) {
        toggleAdminSidebar();
    }
  }

  function openAddNewFilmModal() {
    const m = document.getElementById("add-film-modal");
    if (m) { m.classList.remove("hidden"); m.classList.add("flex"); }
  }

  function closeAddNewFilmModal() {
    const m = document.getElementById("add-film-modal");
    if (m) { m.classList.add("hidden"); m.classList.remove("flex"); }
  }

  async function handleAdminAddNewFilm(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Publishing & Uploading...";
    btn.disabled = true;

    const title = document.getElementById("admin-new-title").value;
    const director = document.getElementById("admin-new-director").value;
    const lang = document.getElementById("admin-new-lang").value;
    const genre = document.getElementById("admin-new-genre").value || "Drama";
    const duration = document.getElementById("admin-new-duration").value || "15 mins";
    const videoFile = document.getElementById("admin-new-video-file").files[0];
    const posterFile = document.getElementById("admin-new-poster-file").files[0];
    const synopsis = document.getElementById("admin-new-synopsis").value;

    if (!videoFile) {
        alert("Please select a Video File to upload.");
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    const maxBytes = 25 * 1024 * 1024;
    if (videoFile.size > maxBytes) {
        alert("Video file is too large. Maximum allowed size is 25 MB.");
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("director", director);
    formData.append("language", lang);
    formData.append("genre", genre);
    formData.append("duration", duration);
    if (videoFile) formData.append("video_file", videoFile);
    if (posterFile) formData.append("poster_file", posterFile);
    formData.append("synopsis", synopsis);

    try {
        const res = await fetch('../php/api_add_film.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (data.success) {
            alert("Short film \"" + title + "\" has been published to Website catalog!");
            closeAddNewFilmModal();
            // Refetch films
            if(typeof fetchFilmsFromDB === 'function') {
                await fetchFilmsFromDB();
            } else {
                window.location.reload();
            }
        } else {
            alert("Error: " + data.error);
        }
    } catch(err) {
        console.error(err);
        alert("Failed to connect to database API.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
  }

  // DB_ONLY_FILMS: Only films from the actual database (no demo data)
  var DB_ONLY_FILMS = [];

  async function fetchDBOnlyFilms() {
    try {
      const ts = new Date().getTime();
      const res = await fetch('../php/api_get_films.php?_t=' + ts, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data)) {
          // Filter out any demo/default films - only keep films that have a real DB numeric id or a 'film-' uuid pattern from DB
          // We identify real DB films: they have numeric ids from DB auto-increment OR uuid starting with 'film-' (created by api_get_films.php)
          DB_ONLY_FILMS = data;
        }
      }
    } catch(e) {
      console.error('Failed to fetch DB films for admin:', e);
    }
  }

  function renderAdminFilmsTable() {
    const tbody = document.getElementById("admin-films-tbody");
    if (!tbody) return;

    if (DB_ONLY_FILMS.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="px-6 py-12 text-center">
            <div class="w-16 h-16 bg-cinema-surface border border-cinema-border rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="film" class="w-8 h-8 text-cinema-muted"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-1">No Films in Database</h3>
            <p class="text-xs text-cinema-muted">Use "Add New Film" to publish your first film to the website catalog.</p>
          </td>
        </tr>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    // Helper: fix relative upload paths when viewed from /admin/ folder
    function resolveAdminImgUrl(url) {
      if (!url) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url;
      return '../' + url.replace(/^\.\.\//, '');
    }

    const searchQ = (document.getElementById("admin-film-search")?.value || "").toLowerCase().trim();
    const langFilter = document.getElementById("admin-film-lang-filter")?.value || "All";

    const filtered = DB_ONLY_FILMS.filter(f => {
      const title = String(f.title || '').toLowerCase();
      const director = String(f.director || '').toLowerCase();
      const lang = String(f.language || '');
      const matchSearch = !searchQ || title.includes(searchQ) || director.includes(searchQ);
      const matchLang = langFilter === "All" || lang.toLowerCase() === langFilter.toLowerCase();
      return matchSearch && matchLang;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-cinema-muted text-sm">No films match the current filter.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map(f => {
      const fid = f.id || f.uuid;
      const posterSrc = resolveAdminImgUrl(f.posterUrl || f.backdropUrl);
      const views = typeof f.viewsCount === 'number' ? f.viewsCount.toLocaleString() : '0';
      const rating = f.rating || '5.0';
      return `
      <tr class="group hover:bg-cinema-surface/50 transition-colors" data-id="${fid}">
        <td class="px-6 py-4"><input type="checkbox" class="film-row-cb w-4 h-4 rounded accent-cinema-accent cursor-pointer" data-id="${fid}" onchange="updateBulkBar('films')"></td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-4">
            <img src="${posterSrc}" class="w-10 h-14 rounded-md object-cover shadow-sm border border-cinema-border/50" onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'">
            <span class="font-bold text-white group-hover:text-cinema-teal transition-colors">${f.title}</span>
          </div>
        </td>
        <td class="px-6 py-4 text-gray-300 font-medium">${f.director}</td>
        <td class="px-6 py-4 text-cinema-teal font-bold">${f.language}</td>
        <td class="px-6 py-4 text-white">
          <div class="flex flex-col gap-1">
            <span class="font-semibold">${views} views</span>
            <span class="text-xs text-cinema-gold font-bold flex items-center gap-1">
              <i data-lucide="star" class="w-3 h-3 fill-cinema-gold"></i> ${rating}
            </span>
          </div>
        </td>
        <td class="px-6 py-4">
          <span class="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">Published</span>
        </td>
        <td class="px-6 py-4 text-right space-x-2">
          <button onclick="playFilm('${fid}')" class="bg-cinema-surface hover:bg-white text-cinema-muted hover:text-black border border-cinema-border px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
            <i data-lucide="play" class="w-3.5 h-3.5"></i> Play
          </button>
          <button onclick="openEditPosterModal('${fid}', '${encodeURIComponent(f.title)}', '${encodeURIComponent(f.posterUrl || '')}')" class="bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
            <i data-lucide="image" class="w-3.5 h-3.5"></i> Thumbnail
          </button>
          <button onclick="deleteFilm('${fid}')" class="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
          </button>
        </td>
      </tr>`;
    }).join("");
    
    if (window.lucide) lucide.createIcons();

    // Update stats cards from real DB data
    const totalFilmsEl = document.querySelector('[data-stat="total-films"]');
    const publishedFilmsEl = document.querySelector('[data-stat="published-films"]');
    const totalViewsEl = document.querySelector('[data-stat="total-views"]');
    const filmmakersEl = document.querySelector('[data-stat="filmmakers"]');

    const totalViews = DB_ONLY_FILMS.reduce((sum, f) => sum + (parseInt(f.viewsCount) || 0), 0);
    const uniqueDirectors = new Set(DB_ONLY_FILMS.map(f => (f.director || '').trim()).filter(Boolean)).size;

    if (totalFilmsEl) totalFilmsEl.textContent = DB_ONLY_FILMS.length;
    if (publishedFilmsEl) publishedFilmsEl.textContent = DB_ONLY_FILMS.length;
    if (totalViewsEl) totalViewsEl.textContent = totalViews.toLocaleString();
    if (filmmakersEl) filmmakersEl.textContent = uniqueDirectors;
  }

  function filterAdminFilmsTable() {
    renderAdminFilmsTable();
  }

  // Helper for modal (defined outside renderAdminFilmsTable scope)
  function resolveAdminModalImgUrl(url) {
    if (!url) return 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url;
    return '../' + url.replace(/^\.\.\//, '');
  }

  // ---- Edit Thumbnail / Poster Modal ----
  function openEditPosterModal(filmId, encodedTitle, encodedPosterUrl) {
    const title = decodeURIComponent(encodedTitle);
    const posterUrl = decodeURIComponent(encodedPosterUrl);

    document.getElementById('edit-poster-film-id').value = filmId;
    document.getElementById('edit-poster-film-name').textContent = title;
    document.getElementById('edit-poster-url').value = '';
    document.getElementById('edit-poster-file').value = '';
    document.getElementById('edit-poster-current-img').src = resolveAdminModalImgUrl(posterUrl);
    document.getElementById('edit-poster-preview-wrap').classList.add('hidden');
    document.getElementById('edit-poster-error').classList.add('hidden');
    document.getElementById('edit-poster-save-btn').innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save New Thumbnail';
    document.getElementById('edit-poster-save-btn').disabled = false;

    const modal = document.getElementById('edit-poster-modal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
  }

  function closeEditPosterModal() {
    const modal = document.getElementById('edit-poster-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function previewEditPoster(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('edit-poster-preview').src = e.target.result;
      document.getElementById('edit-poster-preview-wrap').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  async function handleUpdatePoster(e) {
    e.preventDefault();
    const btn = document.getElementById('edit-poster-save-btn');
    const errDiv = document.getElementById('edit-poster-error');
    const filmId = document.getElementById('edit-poster-film-id').value;
    const posterUrl = document.getElementById('edit-poster-url').value.trim();
    const posterFile = document.getElementById('edit-poster-file').files[0];

    if (!posterUrl && !posterFile) {
      errDiv.textContent = 'Please paste a thumbnail URL or upload an image file.';
      errDiv.classList.remove('hidden');
      return;
    }

    btn.innerHTML = 'Saving...';
    btn.disabled = true;
    errDiv.classList.add('hidden');

    const formData = new FormData();
    formData.append('id', filmId);
    if (posterUrl) formData.append('posterUrl', posterUrl);
    if (posterFile) formData.append('poster_file', posterFile);

    try {
      const res = await fetch('../php/api_update_film.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        // Update the current preview immediately
        const newUrl = data.poster_url || posterUrl;
        document.getElementById('edit-poster-current-img').src = newUrl;
        document.getElementById('edit-poster-preview-wrap').classList.add('hidden');
        btn.innerHTML = '✓ Saved! Refreshing...';
        setTimeout(() => {
          closeEditPosterModal();
          if (typeof fetchFilmsFromDB === 'function') {
            fetchFilmsFromDB();
          } else {
            window.location.reload();
          }
        }, 1200);
      } else {
        errDiv.textContent = data.error || 'Failed to update thumbnail.';
        errDiv.classList.remove('hidden');
        btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save New Thumbnail';
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
      }
    } catch (err) {
      errDiv.textContent = 'Network error. Please try again.';
      errDiv.classList.remove('hidden');
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Save New Thumbnail';
      btn.disabled = false;
      if (window.lucide) lucide.createIcons();
    }
  }

  async function deleteFilm(id) {
    if (confirm("Are you sure you want to permanently delete this film from the Database?")) {

      try {
        const res = await fetch('../php/api_delete_film.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        });
        const data = await res.json();
        
        if (data.success) {
            if(typeof fetchFilmsFromDB === 'function') {
                await fetchFilmsFromDB();
            } else {
                window.location.reload();
            }
        } else {
            alert("Error: " + data.error);
        }
      } catch(err) {
        console.error(err);
        alert("Failed to delete film from database.");
      }
    }
  }

  async function fetchAdminStats() {
    try {
      const res = await fetch('../php/api_get_stats.php');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.stats) {
          const el = document.getElementById('admin-total-users-count');
          if (el) el.textContent = data.stats.total_users;
        }
      }
    } catch(e) {}
  }

  async function fetchAdminSettings() {
    try {
      const res = await fetch('../php/api_settings.php');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.settings) {
          const playInput = document.getElementById('admin-setting-play-store');
          const appInput = document.getElementById('admin-setting-app-store');
          const emailInput = document.getElementById('admin-setting-email');
          if (playInput && data.settings.play_store_url) playInput.value = data.settings.play_store_url;
          if (appInput && data.settings.app_store_url) appInput.value = data.settings.app_store_url;
          if (emailInput && data.settings.admin_email) emailInput.value = data.settings.admin_email;
        }
      }
    } catch(e) {
      console.error("Failed to load settings");
    }
  }

  async function handleAdminSettingsSave(e) {
    e.preventDefault();
    const btn = document.getElementById('admin-settings-save-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Saving...';
    btn.disabled = true;

    const playUrl = document.getElementById('admin-setting-play-store').value;
    const appUrl = document.getElementById('admin-setting-app-store').value;
    const adminEmail = document.getElementById('admin-setting-email').value;
    const adminPassword = document.getElementById('admin-setting-password').value;

    const payload = {
        play_store_url: playUrl,
        app_store_url: appUrl,
        admin_email: adminEmail,
        admin_password: adminPassword
    };

    try {
        const res = await fetch('../php/api_settings.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        
        if (data.success) {
            alert("Platform settings saved successfully!");
        } else {
            alert("Error saving settings: " + (data.error || 'Unknown error'));
        }
    } catch(err) {
        console.error(err);
        alert("Failed to connect to API.");
    } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
        if(window.lucide) lucide.createIcons();
    }
  }

  async function handleLogoUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('admin-logo-file');
    const btn = document.getElementById('admin-logo-upload-btn');
    
    if (!fileInput || !fileInput.files[0]) {
      alert("Please select a logo image file to upload.");
      return;
    }

    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Uploading Logo...';
    btn.disabled = true;

    const formData = new FormData();
    formData.append('logo_file', fileInput.files[0]);

    try {
      const res = await fetch('../php/api_upload_logo.php', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert("Website & Admin logo updated successfully!");
        const newUrl = '../' + data.logo_url + '?v=' + new Date().getTime();
        const sidebarLogo = document.getElementById('admin-sidebar-logo');
        const settingsLogo = document.getElementById('admin-settings-logo-preview');
        if (sidebarLogo) sidebarLogo.src = newUrl;
        if (settingsLogo) settingsLogo.src = newUrl;
        fileInput.value = '';
      } else {
        alert("Error updating logo: " + (data.error || 'Failed to upload logo'));
      }
    } catch(err) {
      console.error(err);
      alert("Network error occurred while uploading logo.");
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
      if (window.lucide) lucide.createIcons();
    }
  }

  async function fetchAdminUsers() {
    try {
      const res = await fetch('../php/api_get_users.php');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.users)) {
          const countEl = document.getElementById('admin-total-users-count');
          const tableCountEl = document.getElementById('admin-users-table-count');
          if (countEl) countEl.textContent = data.count;
          if (tableCountEl) tableCountEl.textContent = data.count;

          const tbody = document.getElementById('admin-users-tbody');
          if (tbody) {
            if (data.users.length > 0) {
              tbody.innerHTML = data.users.map(u => `
                <tr class="hover:bg-cinema-surface/50 transition-colors">
                  <td class="px-4 py-3 font-mono text-xs text-cinema-muted">#${u.id}</td>
                  <td class="px-4 py-3 font-bold text-white">${u.name || u.username}</td>
                  <td class="px-4 py-3 text-cinema-teal font-medium">${u.email}</td>
                  <td class="px-4 py-3"><span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">${u.role || 'user'}</span></td>
                  <td class="px-4 py-3 text-cinema-muted text-xs">${u.created_at || 'Just now'}</td>
                  <td class="px-4 py-3 text-right">
                    <button onclick="deleteUser(${u.id}, '${u.email}')" class="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/20 px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                    </button>
                  </td>
                </tr>
              `).join('');
            } else {
              tbody.innerHTML = '<tr><td colspan="6" class="px-4 py-6 text-center text-cinema-muted text-xs">No registered users in database.</td></tr>';
            }
          }
          if (window.lucide) {
            lucide.createIcons();
          }
        }
      }
    } catch(e) {}
  }

  async function deleteUser(userId, email) {
    if (confirm(`Are you sure you want to permanently delete user "${email}" (ID: #${userId}) from the Database?`)) {
      try {
        const res = await fetch('../php/api_delete_user.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: userId })
        });
        const data = await res.json();
        if (data.success) {
          alert(`User ${email} deleted successfully.`);
          fetchAdminUsers();
          fetchAdminStats();
        } else {
          alert("Error: " + (data.error || 'Failed to delete user'));
        }
      } catch(err) {
        console.error(err);
        alert("Failed to connect to delete user API.");
      }
    }
  }

  async function fetchAdminSubmissions() {
    try {
      const res = await fetch('../php/api_get_submissions.php');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && Array.isArray(data.submissions)) {
          const tbody = document.getElementById('admin-submissions-tbody');
          if (tbody) {
            if (data.submissions.length > 0) {
              tbody.innerHTML = data.submissions.map(s => {
                let badgeClass = "bg-gray-500/10 text-gray-400 border border-gray-500/20";
                if(s.status === 'verified') badgeClass = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
                if(s.status === 'published') badgeClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                let verifyBtn = `<button onclick="verifySubmission(${s.id})" class="bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
                      <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Verify
                    </button>`;
                
                if (s.status === 'verified' || s.status === 'published' || s.status === 'approved') {
                  verifyBtn = `<button disabled class="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm inline-flex items-center gap-1.5 cursor-not-allowed opacity-80">
                      <i data-lucide="check-circle" class="w-3.5 h-3.5 fill-blue-500 text-white"></i> Verified
                    </button>`;
                }

                let approveBtn = `<button onclick="approveSubmission(${s.id})" class="bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
                      <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i> Approve
                    </button>`;

                if (s.status === 'published' || s.status === 'approved') {
                  approveBtn = `<button onclick="unpublishSubmission(${s.id})" class="bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-500 border border-amber-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
                      <i data-lucide="download-cloud" class="w-3.5 h-3.5"></i> Unpublish
                    </button>`;
                }

                return `
                <tr class="hover:bg-cinema-surface/50 transition-colors" data-id="${s.id}">
                  <td class="px-6 py-4"><input type="checkbox" class="subs-row-cb w-4 h-4 rounded accent-cinema-accent cursor-pointer" data-id="${s.id}" onchange="updateBulkBar('subs')"></td>
                  <td class="px-6 py-4 font-bold text-white">${s.title}</td>
                  <td class="px-6 py-4 text-gray-300 font-medium">${s.director}</td>
                  <td class="px-6 py-4 text-cinema-teal font-bold">${s.language}</td>
                  <td class="px-6 py-4">
                    <span class="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                      ${s.genre || 'Drama'}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <span class="${badgeClass} px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">
                      ${s.status || 'pending'}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-cinema-muted text-xs">${s.created_at}</td>
                  <td class="px-6 py-4 text-right space-x-1">
                    ${verifyBtn}
                    ${approveBtn}
                    <button onclick="deleteSubmission(${s.id})" class="bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 border border-rose-500/20 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5">
                      <i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Delete
                    </button>
                  </td>
                </tr>
              `}).join('');
            } else {
              tbody.innerHTML = `
                <tr>
                   <td colspan="8" class="px-6 py-12 text-center">
                      <div class="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500"></i>
                      </div>
                      <h3 class="text-lg font-bold text-white mb-1">Submissions Queue is Clean</h3>
                      <p class="text-xs text-cinema-muted">No pending submissions.</p>
                   </td>
                </tr>
              `;
            }
          }
          if (window.lucide) {
            lucide.createIcons();
          }
        }
      } else {
        throw new Error("HTTP error " + res.status);
      }
    } catch(e) {
      console.error("Fetch submissions error:", e);
      const tbody = document.getElementById('admin-submissions-tbody');
      if (tbody) {
          tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-12 text-center text-rose-500">Failed to load submissions. Please ensure api_get_submissions.php is uploaded to the server.</td></tr>`;
      }
    }
  }
  async function deleteSubmission(id) {
    if (confirm("Are you sure you want to permanently delete this submission?")) {
      try {
        const res = await fetch('../php/api_delete_submission.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        if (data.success) {
          alert("Submission deleted.");
          fetchAdminSubmissions();
        } else {
          alert("Error: " + (data.error || 'Failed to delete submission'));
        }
      } catch(err) {
        console.error(err);
        alert("Failed to connect to API.");
      }
    }
  }

  async function verifySubmission(id) {
    if (confirm("Mark this submission as verified credentials?")) {
      try {
        const res = await fetch('../php/api_update_submission_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, status: 'verified' })
        });
        const data = await res.json();
        if (data.success) {
          alert("Credentials verified!");
          fetchAdminSubmissions();
        } else {
          alert("Error: " + (data.error || 'Failed to update'));
        }
      } catch(err) {
        console.error(err);
        alert("Action failed. Please check your network or if api_update_submission_status.php is on the server.");
      }
    }
  }

  async function approveSubmission(id) {
    if (confirm("Approve this submission for publishing?")) {
      try {
        const res = await fetch('../php/api_update_submission_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, status: 'published' })
        });
        const data = await res.json();
        if (data.success) {
          alert("Film approved and published!");
          fetchAdminSubmissions();
        } else {
          alert("Error: " + (data.error || 'Failed to update'));
        }
      } catch(err) {
        console.error(err);
        alert("Action failed. Please check your network or if api_update_submission_status.php is on the server.");
      }
    }
  }

  async function unpublishSubmission(id) {
    if (confirm("Unpublish this film? It will be removed from the website.")) {
      try {
        const res = await fetch('../php/api_update_submission_status.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id, status: 'verified' }) // Revert to verified
        });
        const data = await res.json();
        if (data.success) {
          alert("Film unpublished!");
          fetchAdminSubmissions();
        } else {
          alert("Error: " + (data.error || 'Failed to update'));
        }
      } catch(err) {
        console.error(err);
        alert("Action failed. Please check your network or if api_update_submission_status.php is on the server.");
      }
    }
  }

  // --- Multi-Select & Bulk Actions ---
  function toggleSelectAll(type) {
    const isChecked = document.getElementById(type + '-select-all').checked;
    const checkboxes = document.querySelectorAll('.' + type + '-row-cb');
    checkboxes.forEach(cb => cb.checked = isChecked);
    updateBulkBar(type);
  }

  function updateBulkBar(type) {
    const checkboxes = document.querySelectorAll('.' + type + '-row-cb:checked');
    const bulkBar = document.getElementById(type + '-bulk-bar');
    const countSpan = document.getElementById(type + '-selected-count');
    if (checkboxes.length > 0) {
      bulkBar.classList.remove('hidden');
      bulkBar.classList.add('flex');
      countSpan.textContent = checkboxes.length + ' selected';
    } else {
      bulkBar.classList.add('hidden');
      bulkBar.classList.remove('flex');
    }
    // Update "Select All" checkbox state
    const allCheckboxes = document.querySelectorAll('.' + type + '-row-cb');
    const selectAllCb = document.getElementById(type + '-select-all');
    if (selectAllCb && allCheckboxes.length > 0) {
      selectAllCb.checked = checkboxes.length === allCheckboxes.length;
    }
  }

  function getSelectedIds(type) {
    return Array.from(document.querySelectorAll('.' + type + '-row-cb:checked')).map(cb => cb.getAttribute('data-id'));
  }

  async function bulkDeleteUsers() {
    const ids = getSelectedIds('users');
    if (ids.length === 0) return;
    if (confirm(`Are you sure you want to permanently delete ${ids.length} selected users?`)) {
      for (const id of ids) {
        // Simple loop approach, in production might want a bulk delete API endpoint
        await fetch('../php/api_delete_user.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
      }
      alert('Selected users deleted.');
      document.getElementById('users-select-all').checked = false;
      updateBulkBar('users');
      fetchAdminUsers();
      fetchAdminStats();
    }
  }

  async function bulkDeleteFilms() {
    const ids = getSelectedIds('films');
    if (ids.length === 0) return;
    if (confirm(`Are you sure you want to permanently delete ${ids.length} selected films?`)) {
      for (const id of ids) {
        await fetch('../php/api_delete_film.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
      }
      alert('Selected films deleted.');
      document.getElementById('films-select-all').checked = false;
      updateBulkBar('films');
      if(typeof fetchFilmsFromDB === 'function') await fetchFilmsFromDB();
      fetchDBOnlyFilms().then(() => renderAdminFilmsTable());
    }
  }

  async function bulkDeleteSubmissions() {
    const ids = getSelectedIds('subs');
    if (ids.length === 0) return;
    if (confirm(`Are you sure you want to permanently delete ${ids.length} selected submissions?`)) {
      for (const id of ids) {
         try {
             await fetch('../php/api_delete_submission.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: id }) });
         } catch(e) {
             console.error("Failed to delete", id, e);
         }
      }
      alert('Selected submissions deleted.');
      document.getElementById('subs-select-all').checked = false;
      updateBulkBar('subs');
      fetchAdminSubmissions();
    }
  }

  // --- Export to CSV ---
  function exportTableToCSV(type) {
    let rows = [];
    if (type === 'users') {
        rows = Array.from(document.querySelectorAll('#admin-users-tbody tr'));
    } else if (type === 'films') {
        rows = Array.from(document.querySelectorAll('#admin-films-tbody tr'));
    } else if (type === 'submissions') {
        rows = Array.from(document.querySelectorAll('#admin-submissions-tbody tr'));
    }

    if(rows.length === 0 || (rows.length === 1 && rows[0].querySelector('td[colspan]'))) {
        alert("No data to export."); return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers (skip checkbox and action columns)
    const headerEl = type === 'users' ? '#tab-overview table thead tr th' : 
                     type === 'films' ? '#tab-films table thead tr th' : '#tab-submissions table thead tr th';
    const headers = Array.from(document.querySelectorAll(headerEl))
                         .map(th => th.innerText.trim())
                         .filter((text, i) => i > 0 && i < document.querySelectorAll(headerEl).length - 1); // Skip 1st (checkbox) and last (actions)
    csvContent += headers.join(",") + "\r\n";

    // Rows
    rows.forEach(function(rowArray) {
        const cols = rowArray.querySelectorAll("td");
        if(cols.length > 2) {
            let rowData = [];
            cols.forEach((col, i) => {
                if (i > 0 && i < cols.length - 1) {
                    let text = col.innerText.replace(/(\r\n|\n|\r)/gm, " ").replace(/"/g, '""').trim();
                    rowData.push('"' + text + '"');
                }
            });
            csvContent += rowData.join(",") + "\r\n";
        }
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", type + "_export_" + new Date().toISOString().split('T')[0] + ".csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Initial setup for overview tab state
    const overviewBtn = document.querySelector(".sidebar-nav-item");
    if(overviewBtn) {
        overviewBtn.classList.remove("text-cinema-muted", "hover:bg-cinema-card", "hover:text-white");
        overviewBtn.classList.add("bg-cinema-accent/10", "text-cinema-accent", "border-r-2", "border-cinema-accent");
    }
    
    // Disable main navbar in admin panel for cleaner look
    const mainHeader = document.querySelector("header.glass-panel");
    if(mainHeader) {
        mainHeader.style.display = "none";
    }
    
    // Hide footer in admin panel
    const mainFooter = document.querySelector("footer");
    if(mainFooter) {
        mainFooter.style.display = "none";
    }

    renderAdminFilmsTable();
    fetchAdminStats();
    fetchAdminUsers();
    fetchAdminSubmissions();
    fetchAdminSettings();
    // Fetch real DB-only films and update admin table + stats
    fetchDBOnlyFilms().then(() => renderAdminFilmsTable());
  });
</script>
<?php
$extra_js = ob_get_clean();
require_once __DIR__ . '/../includes/footer.php';
?>
