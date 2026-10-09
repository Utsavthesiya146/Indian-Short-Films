<?php
/**
 * Indian Short Movie - Watchlist Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'My Watchlist | Indian Short Movie';
$page_description = 'Your personal collection of saved Indian short films, independent cinema releases, and director highlights.';
$current_page = 'watchlist';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main style="max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 80vh;">
  
  <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 1rem; margin-bottom: 2.5rem;">
    <div>
      <div style="display: flex; align-items: center; gap: 0.5rem; color: #ffb703; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        <span>Saved For Later</span>
      </div>
      <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
        My Cinematic Watchlist
      </h1>
      <p style="font-size: 0.85rem; color: #8e95a5; margin-top: 0.25rem;">
        Films you have bookmarked to experience. Saved locally in your browser.
      </p>
    </div>

    <div style="display: flex; gap: 0.75rem;">
      <button onclick="clearWatchlist()" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); color: #ef4444; font-size: 0.75rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: 0.75rem; cursor: pointer;">
        Clear Watchlist
      </button>
      <a href="discover.php" style="background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.75rem; font-weight: 700; padding: 0.5rem 1rem; border-radius: 0.75rem; text-decoration: none;">
        + Browse More Films
      </a>
    </div>
  </div>

  <!-- Watchlist Films Grid -->
  <div id="watchlist-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    <!-- Rendered via JS -->
  </div>

</main>

<?php
$extra_js = '<script>
  function renderWatchlist() {
    const container = document.getElementById("watchlist-grid");
    if (!container) return;

    const savedIds = JSON.parse(localStorage.getItem("ism_watchlist") || "[]");

    const savedFilms = DEFAULT_FILMS.filter(f => savedIds.includes(String(f.id)) || savedIds.includes(String(f.uuid)));

    if (savedFilms.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 5rem 1.5rem; text-align: center; background: #111319; border: 1px solid #262a36; border-radius: 1.5rem;">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#8e95a5" stroke-width="1.5" style="margin: 0 auto 1.25rem;"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff;">Your Watchlist is Empty</h3>
          <p style="font-size: 0.85rem; color: #8e95a5; max-width: 400px; margin: 0.5rem auto 1.5rem;">
            Explore our curated catalog of Indian short films and click the bookmark icon to save titles here.
          </p>
          <a href="discover.php" style="display: inline-block; background: #e50914; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 0.75rem 1.5rem; border-radius: 0.75rem; text-decoration: none;">
            Browse Short Films
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = savedFilms.map(f => `
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
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #ffffff; margin-bottom: 0.25rem;">${f.title}</h3>
            <p style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-bottom: 0.5rem;">Dir. ${f.director}</p>
            <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${f.synopsis}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(38,42,54,0.6);">
            <button onclick="playFilm(\x27${f.id}\x27)" style="flex: 1; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
              Watch Now
            </button>
            <button onclick="removeFromWatchlist(\x27${f.id}\x27)" title="Remove" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.25); padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; cursor: pointer;">
              Remove
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function removeFromWatchlist(filmId) {
    let saved = JSON.parse(localStorage.getItem("ism_watchlist") || "[]");
    saved = saved.filter(id => id !== String(filmId));
    localStorage.setItem("ism_watchlist", JSON.stringify(saved));
    renderWatchlist();
  }

  function clearWatchlist() {
    if (confirm("Are you sure you want to clear your entire watchlist?")) {
      localStorage.setItem("ism_watchlist", JSON.stringify([]));
      renderWatchlist();
    }
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Wait for films to load from DB first, then render watchlist
    if (typeof fetchFilmsFromDB === "function") {
      fetchFilmsFromDB().then(() => renderWatchlist()).catch(() => renderWatchlist());
    } else {
      renderWatchlist();
    }
  });
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
