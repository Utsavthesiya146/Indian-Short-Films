<?php
/**
 * Indian Short Movie - Filmmakers Directory
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'Filmmakers Roster | Indian Short Movie';
$page_description = 'Discover visionary Indian short film directors, creators, screenwriters, and independent producers.';
$current_page = 'filmmakers';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main style="max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 80vh;">
  
  <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 2.5rem;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.5rem; color: #ffb703; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
        <span>Creative Directors</span>
      </div>
      <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
        Filmmaker Directory
      </h1>
      <p style="font-size: 0.85rem; color: #8e95a5; margin-top: 0.25rem;">
        Celebrating visionary voices shaping modern Indian short cinema.
      </p>
    </div>

    <button onclick="openSubmitFilmModal()" style="display: inline-flex; align-items: center; gap: 0.5rem; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.8rem; padding: 0.65rem 1.25rem; border-radius: 0.75rem; border: none; cursor: pointer;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
      <span>Join as a Filmmaker</span>
    </button>
  </div>

  <!-- Filmmakers Grid Container (Dynamically rendered from original DB data) -->
  <div id="filmmakers-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    <!-- Populated via script.js renderFilmmakersDirectory() -->
  </div>

</main>

<?php
$extra_js = '<script>
  function initFilmmakersPage() {
    if (typeof renderFilmmakersDirectory === "function") renderFilmmakersDirectory();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFilmmakersPage);
  } else {
    initFilmmakersPage();
  }
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
