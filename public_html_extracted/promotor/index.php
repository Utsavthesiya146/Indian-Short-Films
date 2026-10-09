<?php
/**
 * Indian Short Movie - Promotor Dashboard
 */
session_start();

require_once __DIR__ . '/../php/db.php';

// Quick migration to set correct Promotor credentials and name
try {
    $hash = password_hash('Indiansmartmov@123', PASSWORD_BCRYPT);
    
    // Update existing promotor or insert if missing
    $cnt = $pdo->query("SELECT COUNT(*) FROM promotors")->fetchColumn();
    if ((int)$cnt === 0) {
        $pdo->exec("INSERT INTO promotors (name, email, password_hash, company) VALUES ('Promotor', 'info@jobhunterr.com', '$hash', 'Indian Short Films')");
    } else {
        $pdo->exec("UPDATE `promotors` SET `name` = 'Promotor', `email` = 'info@jobhunterr.com', `password_hash` = '$hash' LIMIT 1");
    }

    // Force logout if they are logged in with the old default email (this fixes the "automatically getting logged in" issue)
    if (isset($_SESSION['promotor_email']) && $_SESSION['promotor_email'] === 'promotor@example.com') {
        $_SESSION['promotor_logged_in'] = false;
        session_destroy();
        header('Location: login.php');
        exit;
    }
} catch (PDOException $ex) {}

if (!isset($_SESSION['promotor_logged_in']) || $_SESSION['promotor_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

$page_title        = 'Promotor Dashboard | Indian Short Movie';
$page_description  = 'Manage your film submissions, track views, and monitor publishing status.';
$current_page      = 'promotor';
$base_url          = '../';

$promo_name    = htmlspecialchars($_SESSION['promotor_name']    ?? 'Promotor');
$promo_email   = htmlspecialchars($_SESSION['promotor_email']   ?? '');
$promo_company = htmlspecialchars($_SESSION['promotor_company'] ?? 'Independent');

require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
?>

<style>
  /* ====================================================
     PROMOTOR DASHBOARD — RED CINEMA THEME
  ==================================================== */
  :root {
    --pr:          #E50914;
    --pr-hover:    #FF1E27;
    --pr-dim:      rgba(229,9,20,0.10);
    --pr-glow:     rgba(229,9,20,0.22);
    --pr-border:   rgba(229,9,20,0.20);
    --bg:          #07080B;
    --surface:     #111319;
    --card:        #181B24;
    --border:      #262A36;
    --muted:       #8E95A5;
    --teal:        #66FCF1;
  }

  .promo-wrap {
    display: flex;
    min-height: calc(100vh - 5rem);
    background: var(--bg);
    font-family: 'Inter', sans-serif;
  }

  /* ===== SIDEBAR ===== */
  .promo-sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 1.5rem 0;
    position: sticky;
    top: 5rem;
    height: calc(100vh - 5rem);
    overflow-y: auto;
  }

  .promo-sidebar-logo {
    padding: 0 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1rem;
  }

  .promo-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--pr-dim);
    border: 1px solid var(--pr-border);
    color: var(--pr);
    font-size: 0.63rem;
    font-weight: 800;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 50px;
    margin-bottom: 0.6rem;
  }

  .promo-sidebar-name {
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .promo-sidebar-co {
    font-size: 0.72rem;
    color: var(--muted);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .promo-nav-group { padding: 0 0.75rem; margin-bottom: 0.5rem; }

  .promo-nav-lbl {
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #3A3F50;
    padding: 0.5rem 0.5rem 0.3rem;
  }

  .promo-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 0.85rem;
    border-radius: 10px;
    font-size: 0.83rem;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid transparent;
    margin-bottom: 2px;
    text-decoration: none;
  }

  .promo-nav-item:hover {
    background: var(--pr-dim);
    color: var(--pr);
    border-color: var(--pr-border);
  }

  .promo-nav-item.active {
    background: var(--pr-dim);
    color: var(--pr);
    border-color: var(--pr-border);
    font-weight: 700;
  }

  .promo-nav-item svg { opacity: 0.55; transition: opacity 0.18s; }
  .promo-nav-item:hover svg,
  .promo-nav-item.active svg { opacity: 1; }

  .promo-sidebar-ft {
    margin-top: auto;
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--border);
  }

  .promo-logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 0.6rem 0.85rem;
    background: rgba(229,9,20,0.06);
    border: 1px solid rgba(229,9,20,0.15);
    border-radius: 10px;
    color: #FC8181;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.18s;
  }

  .promo-logout-btn:hover {
    background: rgba(229,9,20,0.12);
    border-color: rgba(229,9,20,0.3);
    color: #FCA5A5;
  }

  /* ===== MAIN ===== */
  .promo-main {
    flex: 1;
    padding: 2rem 2.5rem;
    overflow-x: hidden;
    min-width: 0;
  }

  .promo-tab { display: none; }
  .promo-tab.active { display: block; }

  /* ===== PAGE HEADER ===== */
  .promo-page-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .promo-page-hdr h1 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.75rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.5px;
    margin: 0;
  }

  .promo-page-hdr p {
    font-size: 0.82rem;
    color: var(--muted);
    margin: 0.25rem 0 0;
  }

  /* ===== WELCOME BANNER ===== */
  .promo-banner {
    background: linear-gradient(135deg, rgba(229,9,20,0.1) 0%, rgba(229,9,20,0.03) 60%, rgba(102,252,241,0.04) 100%);
    border: 1px solid var(--pr-border);
    border-radius: 20px;
    padding: 1.75rem 2rem;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
  }

  .promo-banner::before {
    content: '';
    position: absolute;
    right: -60px; top: -60px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(229,9,20,0.09), transparent 70%);
    pointer-events: none;
  }

  .promo-banner .greeting {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--pr);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.3rem;
  }

  .promo-banner h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.25rem;
    letter-spacing: -0.4px;
  }

  .promo-banner .meta {
    font-size: 0.78rem;
    color: var(--muted);
    margin: 0;
  }

  /* ===== CTA BUTTON ===== */
  .promo-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.7rem 1.4rem;
    background: #E50914;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 0.82rem;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 18px rgba(229,9,20,0.3);
    white-space: nowrap;
    text-decoration: none;
  }

  .promo-cta-btn:hover {
    background: #FF1E27;
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(229,9,20,0.4);
  }

  /* ===== STAT CARDS ===== */
  .promo-stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .promo-stat {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.25rem;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
    position: relative;
  }

  .promo-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .promo-stat.c-red:hover    { border-color: rgba(229,9,20,0.4); }
  .promo-stat.c-green:hover  { border-color: rgba(74,222,128,0.4); }
  .promo-stat.c-yellow:hover { border-color: rgba(252,211,77,0.4); }
  .promo-stat.c-muted:hover  { border-color: rgba(248,113,113,0.4); }

  .promo-stat-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.85rem;
  }

  .promo-stat.c-red .promo-stat-icon    { background: rgba(229,9,20,0.12); }
  .promo-stat.c-green .promo-stat-icon  { background: rgba(74,222,128,0.12); }
  .promo-stat.c-yellow .promo-stat-icon { background: rgba(252,211,77,0.12); }
  .promo-stat.c-muted .promo-stat-icon  { background: rgba(248,113,113,0.12); }

  .promo-stat-lbl {
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.3rem;
  }

  .promo-stat-val {
    font-family: 'Outfit', sans-serif;
    font-size: 2rem;
    font-weight: 900;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
  }

  /* ===== SECTION HEADER ===== */
  .promo-sec-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .promo-sec-title {
    font-family: 'Outfit', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* ===== TABLE ===== */
  .promo-table-wrap {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .promo-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.83rem;
  }

  .promo-table thead th {
    padding: 0.85rem 1rem;
    text-align: left;
    font-size: 0.63rem;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--muted);
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.02);
  }

  .promo-table tbody td {
    padding: 0.9rem 1rem;
    border-bottom: 1px solid rgba(38,42,54,0.5);
    color: #CBD5E0;
    vertical-align: middle;
  }

  .promo-table tbody tr:last-child td { border-bottom: none; }
  .promo-table tbody tr { transition: background 0.15s; }
  .promo-table tbody tr:hover { background: rgba(229,9,20,0.025); }

  .promo-film-thumb {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid var(--border);
    background: #1C1F2A;
  }

  .promo-thumb-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #1C1F2A;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* STATUS BADGES */
  .sbadge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 50px;
    letter-spacing: 0.5px;
  }

  .sbadge.pending   { background: rgba(251,191,36,0.1);  color: #FCD34D; border: 1px solid rgba(251,191,36,0.25); }
  .sbadge.approved,
  .sbadge.published { background: rgba(74,222,128,0.1);  color: #4ADE80; border: 1px solid rgba(74,222,128,0.25); }
  .sbadge.rejected  { background: rgba(248,113,113,0.1); color: #F87171; border: 1px solid rgba(248,113,113,0.25); }
  .sbadge.review    { background: rgba(167,139,250,0.1); color: #A78BFA; border: 1px solid rgba(167,139,250,0.25); }

  .sbadge-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: currentColor;
  }

  .sbadge.pending .sbadge-dot {
    animation: dotPulse 1.2s ease-in-out infinite;
  }

  @keyframes dotPulse {
    0%,100% { opacity:1; }
    50%      { opacity:0.3; }
  }

  /* EMPTY */
  .promo-empty {
    padding: 3rem 1rem;
    text-align: center;
  }

  .promo-empty-icon {
    width: 64px; height: 64px;
    background: var(--pr-dim);
    border: 1px solid var(--pr-border);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .promo-empty h4 {
    font-family: 'Outfit', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #fff;
    margin: 0 0 0.4rem;
  }

  .promo-empty p { font-size: 0.8rem; color: var(--muted); margin: 0; }

  /* ===== SUBMIT FORM ===== */
  .promo-form-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.75rem;
  }

  .promo-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .promo-fg { display: flex; flex-direction: column; gap: 0.4rem; }
  .promo-fg.full { grid-column: 1 / -1; }

  .promo-fg label {
    font-size: 0.75rem;
    font-weight: 600;
    color: #CBD5E0;
    letter-spacing: 0.3px;
  }

  .promo-fg input,
  .promo-fg select,
  .promo-fg textarea {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.7rem 0.9rem;
    color: #fff;
    font-size: 0.85rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    width: 100%;
    box-sizing: border-box;
  }

  .promo-fg input:focus,
  .promo-fg select:focus,
  .promo-fg textarea:focus {
    border-color: rgba(229,9,20,0.5);
    box-shadow: 0 0 0 3px rgba(229,9,20,0.08);
  }

  .promo-fg input::placeholder,
  .promo-fg textarea::placeholder { color: #3A3F50; }
  .promo-fg select option { background: #181B24; }
  .promo-fg textarea { resize: vertical; min-height: 85px; }

  /* File upload toggle */
  .upload-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
  }

  .upload-toggle button {
    flex: 1;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--muted);
  }

  .upload-toggle button.active {
    background: var(--pr-dim);
    border-color: var(--pr-border);
    color: var(--pr);
  }

  /* Preview */
  .preview-box {
    margin-top: 0.6rem;
    display: none;
  }

  .preview-box img {
    width: 100%;
    max-height: 160px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid var(--border);
  }

  .preview-box video {
    width: 100%;
    max-height: 160px;
    border-radius: 10px;
    border: 1px solid var(--border);
    background: #000;
  }

  #promo-submit-btn {
    margin-top: 1.25rem;
    padding: 0.85rem 2rem;
    background: #E50914;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: 0.9rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 6px 20px rgba(229,9,20,0.3);
  }

  #promo-submit-btn:hover:not(:disabled) {
    background: #FF1E27;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(229,9,20,0.4);
  }

  #promo-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  #submit-msg {
    margin-top: 1rem;
    padding: 0.7rem 1rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    display: none;
  }
  #submit-msg.success { display:block; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.25); color: #4ADE80; }
  #submit-msg.error   { display:block; background: rgba(229,9,20,0.08);   border: 1px solid rgba(229,9,20,0.25);   color: #FC8181; }

  /* ===== RESPONSIVE ===== */
  @media (max-width: 768px) {
    .promo-sidebar { display: none; }
    .promo-main { padding: 1.25rem 1rem; }
    .promo-form-grid { grid-template-columns: 1fr; }
    .promo-fg.full { grid-column: auto; }
  }
</style>

<div class="promo-wrap">

  <!-- SIDEBAR -->
  <aside class="promo-sidebar">
    <div class="promo-sidebar-logo">
      <div class="promo-role-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 11l19-9-9 19-2-8-8-2z"/>
        </svg>
        Promotor
      </div>
      <p class="promo-sidebar-name"><?= $promo_name ?></p>
      <p class="promo-sidebar-co"><?= $promo_company ?></p>
    </div>

    <div class="promo-nav-group">
      <div class="promo-nav-lbl">Main</div>

      <a class="promo-nav-item active" onclick="switchTab('overview', this)" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Overview
      </a>

      <a class="promo-nav-item" onclick="switchTab('myfilms', this)" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
          <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
          <line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/>
          <line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/>
          <line x1="17" y1="7" x2="22" y2="7"/>
        </svg>
        My Films
      </a>

      <a class="promo-nav-item" id="nav-submit" onclick="switchTab('submit', this)" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
        Submit Film
      </a>
    </div>

    <div class="promo-nav-group">
      <div class="promo-nav-lbl">Account</div>

      <a class="promo-nav-item" onclick="switchTab('profile', this)" href="#">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        My Profile
      </a>
    </div>

    <div class="promo-sidebar-ft">
      <a href="logout.php" class="promo-logout-btn" onclick="return confirm('Logout from Promotor Portal?')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </a>
    </div>
  </aside>

  <!-- MAIN -->
  <main class="promo-main">

    <!-- ======== TAB: OVERVIEW ======== -->
    <div id="tab-overview" class="promo-tab active">

      <!-- Welcome Banner -->
      <div class="promo-banner">
        <div>
          <div class="greeting">👋 Welcome back</div>
          <h2><?= $promo_name ?></h2>
          <p class="meta"><?= $promo_email ?> &bull; <?= $promo_company ?></p>
        </div>
        <button class="promo-cta-btn" onclick="switchTab('submit', document.getElementById('nav-submit'))">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Submit New Film
        </button>
      </div>

      <!-- Stats -->
      <div class="promo-stats-grid">
        <div class="promo-stat c-red">
          <div class="promo-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
          </div>
          <div class="promo-stat-lbl">Total Submitted</div>
          <div class="promo-stat-val" id="s-total">—</div>
        </div>

        <div class="promo-stat c-green">
          <div class="promo-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#4ADE80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="promo-stat-lbl">Published</div>
          <div class="promo-stat-val" id="s-pub">—</div>
        </div>

        <div class="promo-stat c-yellow">
          <div class="promo-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#FCD34D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="promo-stat-lbl">Pending Review</div>
          <div class="promo-stat-val" id="s-pend">—</div>
        </div>

        <div class="promo-stat c-muted">
          <div class="promo-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="#F87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div class="promo-stat-lbl">Rejected</div>
          <div class="promo-stat-val" id="s-rej">—</div>
        </div>
      </div>

      <!-- Recent submissions -->
      <div class="promo-sec-hdr">
        <h3 class="promo-sec-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          Recent Submissions
        </h3>
        <button onclick="switchTab('myfilms', document.querySelector('.promo-nav-item:nth-child(2)'))"
          style="font-size:0.77rem;color:#E50914;background:none;border:none;cursor:pointer;font-weight:600;">
          View All →
        </button>
      </div>

      <div class="promo-table-wrap" id="overview-table">
        <div class="promo-empty">
          <div class="promo-empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                 stroke="#E50914" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h4>No submissions yet</h4>
          <p>Submit your first film to get started.</p>
        </div>
      </div>
    </div>

    <!-- ======== TAB: MY FILMS ======== -->
    <div id="tab-myfilms" class="promo-tab">
      <div class="promo-page-hdr">
        <div>
          <h1>My Film Submissions</h1>
          <p>All films you have submitted for review and publication.</p>
        </div>
        <button class="promo-cta-btn" onclick="switchTab('submit', document.getElementById('nav-submit'))">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Submit New
        </button>
      </div>

      <div class="promo-table-wrap" id="myfilms-table">
        <div style="padding:2rem;text-align:center;color:#8E95A5;font-size:0.8rem;">Loading...</div>
      </div>
    </div>

    <!-- ======== TAB: SUBMIT FILM ======== -->
    <div id="tab-submit" class="promo-tab">
      <div class="promo-page-hdr">
        <div>
          <h1>Submit a Film</h1>
          <p>Fill in the details below. Your film will be reviewed by admin before publishing.</p>
        </div>
      </div>

      <div id="submit-msg"></div>

      <div class="promo-form-card">
        <form id="submit-form" onsubmit="handleSubmitFilm(event)" enctype="multipart/form-data">
          <div class="promo-form-grid">

            <!-- Title -->
            <div class="promo-fg">
              <label for="sf-title">Film Title *</label>
              <input type="text" id="sf-title" name="title" placeholder="e.g. Ek Din Ki Kahani" required>
            </div>

            <!-- Director -->
            <div class="promo-fg">
              <label for="sf-director">Director Name *</label>
              <input type="text" id="sf-director" name="director" placeholder="e.g. Raj Kumar" required>
            </div>

            <!-- Language -->
            <div class="promo-fg">
              <label for="sf-lang">Language *</label>
              <select id="sf-lang" name="language" required>
                <option value="" disabled selected>Select Language</option>
                <option>Hindi</option><option>Gujarati</option><option>English</option>
                <option>Marathi</option><option>Tamil</option><option>Telugu</option>
                <option>Bengali</option><option>Punjabi</option><option>Kannada</option>
                <option>Malayalam</option><option>Other</option>
              </select>
            </div>

            <!-- Genre -->
            <div class="promo-fg">
              <label for="sf-genre">Genre *</label>
              <select id="sf-genre" name="genre" required>
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

            <!-- VIDEO — File upload only -->
            <div class="promo-fg full">
              <label for="sf-video-file">Upload Your Short Film *</label>
              <p style="font-size:0.72rem;color:var(--muted);margin:0 0 0.5rem;">Supported formats: MP4, MOV, AVI, WEBM &nbsp;&middot;&nbsp; <strong style="color:#CBD5E0;">Maximum file size: 25 MB</strong></p>
              <input type="file" id="sf-video-file" name="video_file" accept=".mp4,.mov,.avi,.webm,video/mp4,video/quicktime,video/x-msvideo,video/webm" onchange="previewVideo(this)">
              <div id="sf-video-error" style="display:none;margin-top:0.4rem;font-size:0.75rem;font-weight:600;color:#FC8181;"></div>
              <div class="preview-box" id="vid-preview-box">
                <video id="vid-preview" controls></video>
              </div>
            </div>

            <!-- POSTER — File upload only -->
            <div class="promo-fg full">
              <label for="sf-poster-file">Poster Image (JPG, PNG, WEBP)</label>
              <input type="file" id="sf-poster-file" name="poster_file" accept="image/*" onchange="previewPosterFile(this)">
              <div class="preview-box" id="poster-file-preview-box">
                <img id="poster-file-preview" src="" alt="Poster Preview">
              </div>
            </div>

            <!-- Synopsis -->
            <div class="promo-fg full">
              <label for="sf-synopsis">Synopsis / Description</label>
              <textarea id="sf-synopsis" name="synopsis" placeholder="Brief description of your film..."></textarea>
            </div>

          </div>

          <button type="submit" id="promo-submit-btn">
            📤 Submit Film for Review
          </button>
        </form>
      </div>
    </div>

    <!-- ======== TAB: PROFILE ======== -->
    <div id="tab-profile" class="promo-tab">
      <div class="promo-page-hdr">
        <div>
          <h1>My Profile</h1>
          <p>Your promotor account information.</p>
        </div>
      </div>

      <div class="promo-form-card" style="max-width:480px;">
        <!-- Avatar -->
        <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.75rem;padding-bottom:1.5rem;border-bottom:1px solid var(--border);">
          <div style="width:64px;height:64px;border-radius:18px;background:var(--pr-dim);border:2px solid var(--pr-border);display:flex;align-items:center;justify-content:center;font-family:'Outfit',sans-serif;font-size:1.6rem;font-weight:900;color:var(--pr);">
            <?= strtoupper(substr($promo_name, 0, 1)) ?>
          </div>
          <div>
            <div style="font-family:'Outfit',sans-serif;font-size:1.05rem;font-weight:800;color:#fff;"><?= $promo_name ?></div>
            <div style="font-size:0.78rem;color:var(--muted);"><?= $promo_email ?></div>
            <span style="display:inline-block;margin-top:0.35rem;font-size:0.63rem;font-weight:700;padding:3px 10px;background:var(--pr-dim);border:1px solid var(--pr-border);color:var(--pr);border-radius:50px;letter-spacing:1px;text-transform:uppercase;">Promotor</span>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:1rem;">
          <?php foreach ([
            ['Full Name',       $promo_name],
            ['Email',           $promo_email],
            ['Company / Label', $promo_company ?: '—'],
            ['Role',            'Film Promotor'],
          ] as [$lbl, $val]): ?>
          <div>
            <div style="font-size:0.67rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;margin-bottom:0.25rem;"><?= $lbl ?></div>
            <div style="color:<?= $lbl === 'Role' ? 'var(--pr)' : '#fff' ?>;font-size:0.9rem;font-weight:<?= $lbl === 'Role' ? '700' : '500' ?>;"><?= $val ?></div>
          </div>
          <?php endforeach; ?>
        </div>

        <div style="margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--border);">
          <p style="font-size:0.76rem;color:var(--muted);">
            Need to update your details or password? Contact the platform admin at
            <a href="../contact.php" style="color:var(--pr);font-weight:600;">Contact Page</a>.
          </p>
        </div>
      </div>
    </div>

  </main>
</div>

<script>
/* ===== TAB SWITCHER ===== */
function switchTab(id, el) {
  document.querySelectorAll('.promo-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.promo-nav-item').forEach(n => n.classList.remove('active'));
  const tab = document.getElementById('tab-' + id);
  if (tab) tab.classList.add('active');
  if (el)  el.classList.add('active');
  if (id === 'myfilms')  loadMyFilms();
  if (id === 'overview') loadOverview();
}

/* ===== IMAGE UTILS ===== */
function resolveImg(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('uploads/')) return '../' + url;
  return url;
}

/* ===== STATUS BADGE ===== */
function badge(status) {
  const cls = (status === 'published' || status === 'approved') ? 'approved'
            : status === 'rejected' ? 'rejected'
            : status === 'review'   ? 'review'
            : 'pending';
  const lbl = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="sbadge ${cls}"><span class="sbadge-dot"></span>${lbl}</span>`;
}

/* ===== LOAD MY FILMS ===== */
async function loadMyFilms() {
  const wrap = document.getElementById('myfilms-table');
  wrap.innerHTML = '<div style="padding:2rem;text-align:center;color:#8E95A5;font-size:0.8rem;">Loading...</div>';
  try {
    const res  = await fetch('../php/api_promotor_get_submissions.php');
    const data = await res.json();
    if (!data.success) { wrap.innerHTML = emptyState('Error: ' + (data.error||'Try again.')); return; }
    const subs = data.submissions || [];
    if (!subs.length) { wrap.innerHTML = emptyState('No submissions yet. Submit your first film!'); return; }

    const rows = subs.map(s => {
      const pUrl  = resolveImg(s.poster_url);
      const thumb = pUrl
        ? `<img src="${pUrl}" class="promo-film-thumb" alt="" onerror="this.style.display='none'">`
        : `<div class="promo-thumb-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A3F50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg></div>`;
      const date = s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
      return `<tr>
        <td>${thumb}</td>
        <td style="font-weight:600;color:#fff;max-width:200px;">${s.title}</td>
        <td>${s.director}</td>
        <td>${s.language}</td>
        <td>${badge(s.status)}</td>
        <td style="color:#8E95A5;">${date}</td>
      </tr>`;
    }).join('');

    wrap.innerHTML = `<table class="promo-table">
      <thead><tr><th style="width:56px;">Poster</th><th>Title</th><th>Director</th><th>Language</th><th>Status</th><th>Submitted</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  } catch(e) {
    wrap.innerHTML = emptyState('Network error. Please refresh.');
  }
}

/* ===== LOAD OVERVIEW ===== */
async function loadOverview() {
  try {
    const res  = await fetch('../php/api_promotor_get_submissions.php');
    const data = await res.json();
    if (!data.success) return;
    const subs = data.submissions || [];
    document.getElementById('s-total').innerText = subs.length;
    document.getElementById('s-pub').innerText   = subs.filter(s => s.status==='published'||s.status==='approved').length;
    document.getElementById('s-pend').innerText  = subs.filter(s => s.status==='pending').length;
    document.getElementById('s-rej').innerText   = subs.filter(s => s.status==='rejected').length;

    const recent = subs.slice(0, 5);
    const oWrap  = document.getElementById('overview-table');
    if (!recent.length) return;

    const rows = recent.map(s => {
      const date = s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
      return `<tr>
        <td style="font-weight:600;color:#fff;">${s.title}</td>
        <td>${s.director}</td><td>${s.language}</td>
        <td>${badge(s.status)}</td>
        <td style="color:#8E95A5;">${date}</td>
      </tr>`;
    }).join('');

    oWrap.innerHTML = `<table class="promo-table">
      <thead><tr><th>Title</th><th>Director</th><th>Language</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  } catch(e) {}
}

/* ===== EMPTY STATE ===== */
function emptyState(msg) {
  return `<div class="promo-empty">
    <div class="promo-empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
           stroke="#E50914" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
        <line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    </div>
    <h4>No results</h4><p>${msg}</p>
  </div>`;
}



function previewPosterFile(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.getElementById('poster-file-preview');
      const box = document.getElementById('poster-file-preview-box');
      img.src = e.target.result;
      box.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewVideo(input) {
  const errEl = document.getElementById('sf-video-error');
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }

  if (input.files && input.files[0]) {
    const file = input.files[0];
    const ext  = file.name.split('.').pop().toLowerCase();
    const allowedExts = ['mp4', 'mov', 'avi', 'webm'];
    const maxBytes = 25 * 1024 * 1024;

    if (!allowedExts.includes(ext)) {
      if (errEl) { errEl.textContent = 'Unsupported video format. Please upload MP4, MOV, AVI, or WEBM.'; errEl.style.display = 'block'; }
      input.value = '';
      return;
    }
    if (file.size > maxBytes) {
      if (errEl) { errEl.textContent = 'Video file is too large. Maximum allowed size is 25 MB.'; errEl.style.display = 'block'; }
      input.value = '';
      return;
    }

    const box = document.getElementById('vid-preview-box');
    const vid = document.getElementById('vid-preview');
    vid.src = URL.createObjectURL(file);
    box.style.display = 'block';
  }
}

/* ===== SUBMIT FILM ===== */
async function handleSubmitFilm(e) {
  e.preventDefault();
  const btn   = document.getElementById('promo-submit-btn');
  const msgEl = document.getElementById('submit-msg');
  const errEl = document.getElementById('sf-video-error');
  msgEl.className = '';
  msgEl.style.display = 'none';
  if (errEl) { errEl.style.display = 'none'; errEl.textContent = ''; }

  // Client-side video validation
  const videoInput = document.getElementById('sf-video-file');
  const videoFile  = videoInput && videoInput.files[0];

  if (!videoFile) {
    if (errEl) { errEl.textContent = 'Please upload a video file to submit your film.'; errEl.style.display = 'block'; }
    else { msgEl.className = 'error'; msgEl.innerText = '❌ Please upload a video file.'; msgEl.style.display = 'block'; }
    return;
  }

  const allowedExts = ['mp4', 'mov', 'avi', 'webm'];
  const fileExt = videoFile.name.split('.').pop().toLowerCase();
  if (!allowedExts.includes(fileExt)) {
    const msg = 'Unsupported video format. Please upload MP4, MOV, AVI, or WEBM.';
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    else { msgEl.className = 'error'; msgEl.innerText = '❌ ' + msg; msgEl.style.display = 'block'; }
    return;
  }

  const maxBytes = 25 * 1024 * 1024;
  if (videoFile.size > maxBytes) {
    const msg = 'Video file is too large. Maximum allowed size is 25 MB.';
    if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
    else { msgEl.className = 'error'; msgEl.innerText = '❌ ' + msg; msgEl.style.display = 'block'; }
    return;
  }

  btn.innerText = '⏳ Uploading...';
  btn.disabled  = true;

  const formData = new FormData(e.target);

  try {
    const res  = await fetch('../php/api_promotor_submit_film.php', { method:'POST', body: formData });
    const data = await res.json();

    if (data.success) {
      msgEl.className = 'success';
      msgEl.innerText = '✅ ' + (data.message || 'Film submitted successfully!');
      msgEl.style.display = 'block';
      e.target.reset();
      // Reset previews
      ['poster-file-preview-box','vid-preview-box'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
      });
      setTimeout(loadOverview, 800);
    } else {
      msgEl.className = 'error';
      msgEl.innerText = '❌ ' + (data.error || 'Submission failed.');
      msgEl.style.display = 'block';
    }
  } catch(err) {
    msgEl.className = 'error';
    msgEl.innerText = '❌ Network error. Please try again.';
    msgEl.style.display = 'block';
  } finally {
    btn.innerText = '📤 Submit Film for Review';
    btn.disabled  = false;
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', loadOverview);
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
