<?php
/**
 * Indian Short Movie - Admin Portal
 * Production-ready Pure PHP 8+ Admin Page
 */
$page_title = 'Admin Portal | Platform Analytics & Dashboard';
$page_description = 'Indian Short Movie Administration - Role-Based Access, Catalog Management, Submissions Queue, and Moderation.';
$current_page = 'admin';
$base_url = '../';
$active_tab = 'overview';

require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
?>

<!-- Complete Admin Workspace Layout with Fixed Left Sidebar -->
<div class="admin-workspace">
  
  <!-- LEFT SIDEBAR INCLUDED -->
  <?php require_once __DIR__ . '/../includes/sidebar.php'; ?>

  <!-- MAIN ADMIN WORKSPACE CONTENT -->
  <main class="admin-main">
    
    <!-- SUBPAGE 1: OVERVIEW (PLATFORM ANALYTICS & DASHBOARD) -->
    <section id="tab-overview" class="tab-section active">
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        
        <!-- Header & Action Button -->
        <div class="dashboard-header" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
          <div>
            <h1 class="dashboard-title" style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.85rem; color: #ffffff; letter-spacing: -0.02em;">
              Platform Analytics &amp; Dashboard
            </h1>
            <p class="dashboard-subtitle" style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.25rem;">
              Real-time overview of users, film uploads, submissions, and moderation
            </p>
          </div>
          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem;">
            <a href="../indian-short-movie-php.zip" download="indian-short-movie-php.zip" style="display: flex; align-items: center; gap: 0.5rem; background-color: #181b24; color: #66fcf1; border: 1px solid rgba(102, 252, 241, 0.4); font-weight: 700; font-size: 0.75rem; padding: 0.6rem 1rem; border-radius: 0.75rem; text-decoration: none; transition: all 0.2s;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              <span>Download PHP Project (ZIP)</span>
            </a>
            <button onclick="openAddNewFilmModal()" style="display: flex; align-items: center; gap: 0.5rem; background-color: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.6rem 1rem; border-radius: 0.75rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(229, 9, 20, 0.35); transition: all 0.2s;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              <span>+ Add New Film</span>
            </button>
          </div>
        </div>

        <!-- 8 Metric Cards Grid matching reference exactly -->
        <div class="metrics-grid">
          
          <div class="metric-card card-blue">
            <div class="metric-top">
              <span>Total Users</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="metric-value">2</div>
          </div>

          <div class="metric-card card-gold">
            <div class="metric-top">
              <span>Total Short Films</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb703" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
            </div>
            <div class="metric-value">20</div>
          </div>

          <div class="metric-card card-emerald">
            <div class="metric-top">
              <span>Published Films</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
            </div>
            <div class="metric-value">20</div>
          </div>

          <div class="metric-card card-accent">
            <div class="metric-top">
              <span>Pending Submissions</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m9 15 2 2 4-4"/></svg>
            </div>
            <div class="metric-value">0</div>
          </div>

          <div class="metric-card card-teal">
            <div class="metric-top">
              <span>Total Video Views</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#66fcf1" stroke-width="2"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div class="metric-value">45,890</div>
          </div>

          <div class="metric-card card-purple">
            <div class="metric-top">
              <span>Total Reviews</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c084fc" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div class="metric-value">1</div>
          </div>

          <div class="metric-card card-amber">
            <div class="metric-top">
              <span>Filmmakers</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 21.416a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/></svg>
            </div>
            <div class="metric-value">18</div>
          </div>

          <div class="metric-card card-rose">
            <div class="metric-top">
              <span>Pending Reports</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" stroke-width="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            <div class="metric-value">0</div>
          </div>

        </div>

        <!-- 2 Visual Analytics Panels -->
        <div class="dashboard-panels">
          
          <!-- Panel 1: Popular Indian Languages -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#66fcf1" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>
                <span>Popular Indian Languages</span>
              </h3>
              <span class="panel-badge">By View Share</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem;">
              
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">
                  <span>Hindi (हिन्दी)</span>
                  <span>42%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: 42%; background-color: #e50914;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">
                  <span>Tamil (தமிழ்)</span>
                  <span>24%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: 24%; background-color: #66fcf1;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">
                  <span>Gujarati (ગુજરાતી)</span>
                  <span>16%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: 16%; background-color: #ffb703;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">
                  <span>Telugu (తెలుగు)</span>
                  <span>12%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: 12%; background-color: #a855f7;"></div>
                </div>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">
                  <span>Kannada (ಕನ್ನಡ)</span>
                  <span>6%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: 6%; background-color: #3b82f6;"></div>
                </div>
              </div>

            </div>
          </div>

          <!-- Panel 2: Recent Admin Activity (Audit Logs) -->
          <div class="panel-card">
            <div class="panel-header">
              <h3 class="panel-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffb703" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                <span>Recent Admin Activity</span>
              </h3>
              <span class="panel-badge">Audit Logs</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.75rem; color: #8e95a5;">
              <div class="activity-row">
                <span>Approved submission <strong style="color: #ffffff;">"Chai &amp; Stories"</strong></span>
                <span style="color: #66fcf1; font-weight: 600;">10m ago</span>
              </div>
              <div class="activity-row">
                <span>Marked <strong style="color: #ffb703;">"Midnight Express"</strong> as Featured</span>
                <span style="color: #66fcf1; font-weight: 600;">1h ago</span>
              </div>
              <div class="activity-row">
                <span>Resolved content report #1024</span>
                <span style="color: #66fcf1; font-weight: 600;">3h ago</span>
              </div>
              <div class="activity-row">
                <span>Verified filmmaker profile: <strong style="color: #ffffff;">Priya Hegde</strong></span>
                <span style="color: #66fcf1; font-weight: 600;">5h ago</span>
              </div>
              <div class="activity-row">
                <span>Updated streaming CDN bandwidth allocation</span>
                <span style="color: #66fcf1; font-weight: 600;">8h ago</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SUBPAGE 2: FILM MANAGEMENT -->
    <section id="tab-films" class="tab-section">
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem;">
          <div>
            <h1 style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.75rem; color: #ffffff;">
              Film Catalog Management
            </h1>
            <p style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.25rem;">
              Manage short films, editorial features, and regional visibility across India
            </p>
          </div>
          <button onclick="openAddNewFilmModal()" style="display: flex; align-items: center; gap: 0.5rem; background-color: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.6rem 1rem; border-radius: 0.75rem; border: none; cursor: pointer;">
            + Add New Film
          </button>
        </div>

        <!-- Filter bar -->
        <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; align-items: center; background: #111319; border: 1px solid #262a36; border-radius: 1rem; padding: 0.75rem 1rem;">
          <input 
            type="text" 
            id="admin-film-search" 
            placeholder="Search films or directors..." 
            oninput="filterAdminFilmsTable()"
            style="background: #181b24; border: 1px solid #262a36; border-radius: 0.5rem; color: #ffffff; padding: 0.4rem 0.75rem; font-size: 0.75rem; min-width: 220px; outline: none;"
          >
          <select id="admin-film-lang-filter" onchange="filterAdminFilmsTable()" style="background: #181b24; border: 1px solid #262a36; border-radius: 0.5rem; color: #ffffff; padding: 0.4rem 0.75rem; font-size: 0.75rem; outline: none;">
            <option value="All">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="Kannada">Kannada</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Malayalam">Malayalam</option>
          </select>
        </div>

        <!-- Table Container -->
        <div style="background: #111319; border-radius: 1.5rem; border: 1px solid #262a36; overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.8rem;" id="admin-films-table">
            <thead>
              <tr style="border-bottom: 1px solid #262a36; background: #181b24; color: #8e95a5; font-size: 11px; text-transform: uppercase;">
                <th style="padding: 1rem;">Film</th>
                <th style="padding: 1rem;">Director</th>
                <th style="padding: 1rem;">Language</th>
                <th style="padding: 1rem;">Views / Rating</th>
                <th style="padding: 1rem;">Status</th>
                <th style="padding: 1rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="admin-films-tbody">
              <!-- Populated via script.js -->
            </tbody>
          </table>
        </div>

      </div>
    </section>

    <!-- SUBPAGE 3: SUBMISSIONS QUEUE -->
    <section id="tab-submissions" class="tab-section">
      <div>
        <h1 style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.75rem; color: #ffffff;">
          Film Submissions Queue
        </h1>
        <p style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.25rem;">
          Review submitted short films, verify credentials, and approve for publishing
        </p>
      </div>

      <div style="background: #111319; border-radius: 1.5rem; border: 1px solid #262a36; padding: 3rem 1.5rem; text-align: center; margin-top: 1.5rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin: 0 auto 1rem; opacity: 0.8;"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        <h3 style="font-weight: 700; font-size: 1.1rem; color: #ffffff;">Submissions Queue is Clean</h3>
        <p style="font-size: 0.8rem; color: #8e95a5; margin-top: 0.5rem; max-width: 440px; margin-left: auto; margin-right: auto;">
          All incoming short film submissions have been reviewed and cataloged. New submissions from creators will automatically appear here.
        </p>
      </div>
    </section>

    <!-- SUBPAGE 4: CONTENT MODERATION -->
    <section id="tab-reports" class="tab-section">
      <div>
        <h1 style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 1.75rem; color: #ffffff;">
          Content Moderation Queue
        </h1>
        <p style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.25rem;">
          Review community reports for copyright, spam, or inappropriate content
        </p>
      </div>

      <div style="background: #111319; border-radius: 1.5rem; border: 1px solid #262a36; padding: 3rem 1.5rem; text-align: center; margin-top: 1.5rem;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="margin: 0 auto 1rem; opacity: 0.8;"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
        <h3 style="font-weight: 700; font-size: 1.1rem; color: #ffffff;">All Clean! No Pending Reports</h3>
        <p style="font-size: 0.8rem; color: #8e95a5; margin-top: 0.5rem; max-width: 440px; margin-left: auto; margin-right: auto;">
          Community reports will appear here when users flag reviews, comments, or short films.
        </p>
      </div>
    </section>

  </main>
</div>

<!-- Add New Film Modal -->
<div id="add-film-modal" style="display: none; position: fixed; inset: 0; z-index: 1000; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 1.5rem;">
  <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; max-width: 540px; width: 100%; padding: 2rem; position: relative;">
    <button onclick="closeAddNewFilmModal()" style="position: absolute; top: 1.25rem; right: 1.25rem; background: transparent; border: none; color: #8e95a5; font-size: 1.25rem; cursor: pointer;">✕</button>
    <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.25rem;">+ Add New Short Film</h3>
    <p style="font-size: 0.75rem; color: #8e95a5; margin-bottom: 1.5rem;">Add a new title directly to the verified published catalog</p>
    
    <form onsubmit="handleAdminAddNewFilm(event)" style="display: flex; flex-direction: column; gap: 1rem;">
      <div>
        <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Film Title *</label>
        <input type="text" id="admin-new-title" required placeholder="e.g. Basavanagudi Mornings" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Director *</label>
          <input type="text" id="admin-new-director" required placeholder="Director's Name" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Language *</label>
          <select id="admin-new-lang" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
            <option value="Hindi">Hindi</option>
            <option value="Kannada">Kannada</option>
            <option value="Tamil">Tamil</option>
            <option value="Telugu">Telugu</option>
            <option value="Malayalam">Malayalam</option>
            <option value="Gujarati">Gujarati</option>
          </select>
        </div>
      </div>
      <div>
        <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Video Stream URL (MP4) *</label>
        <input type="url" id="admin-new-video" required value="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
      </div>
      <button type="submit" style="background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.85rem; padding: 0.75rem; border-radius: 0.75rem; border: none; cursor: pointer; margin-top: 0.5rem;">
        Publish Short Film
      </button>
    </form>
  </div>
</div>

<?php
$extra_js = '<script>
  function toggleAdminSidebar(open) {
    const sidebar = document.getElementById("adminSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    if (sidebar && backdrop) {
      if (open) {
        sidebar.classList.add("open");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      } else {
        sidebar.classList.remove("open");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  }

  function switchAdminTab(tabName, btnElement) {
    document.querySelectorAll(".tab-section").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".sidebar-nav-item").forEach(el => el.classList.remove("active"));
    const target = document.getElementById("tab-" + tabName);
    if (target) target.classList.add("active");
    if (btnElement) btnElement.classList.add("active");
    toggleAdminSidebar(false);
  }

  function openAddNewFilmModal() {
    const m = document.getElementById("add-film-modal");
    if (m) m.style.display = "flex";
  }

  function closeAddNewFilmModal() {
    const m = document.getElementById("add-film-modal");
    if (m) m.style.display = "none";
  }

  function handleAdminAddNewFilm(e) {
    e.preventDefault();
    const title = document.getElementById("admin-new-title").value;
    const director = document.getElementById("admin-new-director").value;
    const lang = document.getElementById("admin-new-lang").value;
    const video = document.getElementById("admin-new-video").value;

    const newFilm = {
      id: "film-" + Date.now(),
      title: title,
      director: director,
      language: lang,
      genre: "Drama",
      duration: "15 mins",
      viewsCount: 1,
      rating: 5.0,
      posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80",
      videoUrl: video,
      synopsis: "New verified independent short film.",
      status: "approved"
    };

    DEFAULT_FILMS.unshift(newFilm);
    renderAdminFilmsTable();
    closeAddNewFilmModal();
    alert("Short film \"" + title + "\" has been published!");
  }

  function renderAdminFilmsTable() {
    const tbody = document.getElementById("admin-films-tbody");
    if (!tbody) return;

    const searchQ = (document.getElementById("admin-film-search")?.value || "").toLowerCase().trim();
    const langFilter = document.getElementById("admin-film-lang-filter")?.value || "All";

    const filtered = DEFAULT_FILMS.filter(f => {
      const matchSearch = !searchQ || f.title.toLowerCase().includes(searchQ) || f.director.toLowerCase().includes(searchQ);
      const matchLang = langFilter === "All" || f.language.toLowerCase() === langFilter.toLowerCase();
      return matchSearch && matchLang;
    });

    tbody.innerHTML = filtered.map(f => `
      <tr style="border-bottom: 1px solid #262a36;">
        <td style="padding: 1rem; font-weight: 700; color: #ffffff;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${f.posterUrl || f.backdropUrl}" style="width: 36px; height: 48px; border-radius: 0.4rem; object-fit: cover;">
            <span>${f.title}</span>
          </div>
        </td>
        <td style="padding: 1rem; color: #d1d5db;">${f.director}</td>
        <td style="padding: 1rem; color: #66fcf1; font-weight: 600;">${f.language}</td>
        <td style="padding: 1rem; color: #ffffff;">${f.viewsCount.toLocaleString()} views • <span style="color: #ffb703;">★ ${f.rating}</span></td>
        <td style="padding: 1rem;">
          <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 0.25rem 0.5rem; border-radius: 9999px; font-weight: 700; font-size: 10px;">
            Published
          </span>
        </td>
        <td style="padding: 1rem; text-align: right;">
          <button onclick="playFilm(\x27${f.id}\x27)" style="background: #181b24; border: 1px solid #262a36; color: #ffffff; padding: 0.35rem 0.65rem; border-radius: 0.5rem; font-size: 11px; cursor: pointer; margin-right: 0.35rem;">
            Play
          </button>
          <button onclick="deleteFilm(\x27${f.id}\x27)" style="background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #ef4444; padding: 0.35rem 0.65rem; border-radius: 0.5rem; font-size: 11px; cursor: pointer;">
            Delete
          </button>
        </td>
      </tr>
    `).join("");
  }

  function filterAdminFilmsTable() {
    renderAdminFilmsTable();
  }

  function deleteFilm(id) {
    if (confirm("Are you sure you want to remove this film from the catalog?")) {
      const idx = DEFAULT_FILMS.findIndex(f => f.id === id);
      if (idx !== -1) {
        DEFAULT_FILMS.splice(idx, 1);
        renderAdminFilmsTable();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    renderAdminFilmsTable();
  });
</script>';

require_once __DIR__ . '/../includes/footer.php';
?>
