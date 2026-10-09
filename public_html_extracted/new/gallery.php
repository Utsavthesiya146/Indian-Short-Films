<?php
/**
 * Indian Short Movie - Gallery & Projects Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'Gallery & Projects | Indian Short Movie';
$page_description = 'Explore our complete catalog of award-winning independent Indian short films, documentaries, and regional cinema projects.';
$current_page = 'gallery';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main style="max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 80vh;">
  <!-- Gallery Header -->
  <div style="margin-bottom: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1rem;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.5rem; color: #ffb703; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
        <span>Curated Cinema Gallery</span>
      </div>
      <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
        Projects &amp; Film Gallery
      </h1>
      <p style="font-size: 0.85rem; color: #8e95a5; margin-top: 0.25rem;">
        Stream verified festival laureates, indie documentaries, and creative short films across pan-Indian languages.
      </p>
    </div>
  </div>

  <!-- Films Grid -->
  <div id="gallery-films-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    <!-- Populated via script.js -->
  </div>
</main>

<?php
$extra_js = '<script>
  document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("gallery-films-grid");
    if (!container) return;

    container.innerHTML = DEFAULT_FILMS.map(f => `
      <div class="film-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column;">
        <div style="position: relative; aspect-ratio: 16/9; background: #0f1117; overflow: hidden; cursor: pointer;" onclick="playFilm(\x27${f.id}\x27)">
          <img src="${f.posterUrl || f.backdropUrl}" alt="${f.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.75); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 700; color: #ffffff;">
            ${f.duration}
          </div>
          <div style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(229, 9, 20, 0.9); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase;">
            ${f.language}
          </div>
        </div>

        <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-size: 0.75rem; color: #ffb703; font-weight: 700; margin-bottom: 0.25rem;">★ ${f.rating} • ${f.viewsCount.toLocaleString()} views</div>
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #ffffff; margin-bottom: 0.25rem;">${f.title}</h3>
            <p style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-bottom: 0.5rem;">Dir. ${f.director}</p>
            <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${f.synopsis}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(38,42,54,0.6);">
            <button onclick="playFilm(\x27${f.id}\x27)" style="flex: 1; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
              Watch Film
            </button>
            <button onclick="toggleWatchlist(\x27${f.id}\x27)" title="Save to Watchlist" style="background: #181b24; color: #ffffff; border: 1px solid #262a36; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  });
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
