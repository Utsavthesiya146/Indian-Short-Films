<?php
/**
 * Indian Short Movie - Discover Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'Discover Indian Short Films | Indian Short Movie';
$page_description = 'Explore premier award-winning short films, independent cinema, and regional storytelling across India.';
$current_page = 'discover';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<!-- Main Catalog Content -->
<main style="max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; min-height: 80vh;">
  
  <!-- Header & Live Search -->
  <div style="margin-bottom: 2rem; display: flex; flex-direction: column; justify-content: space-between; gap: 1.5rem;">
    <div>
      <h1 style="font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
        Discover Indian Short Films
      </h1>
      <p style="font-size: 0.875rem; color: #8e95a5; margin-top: 0.25rem;">
        Explore festival selections, regional narratives, and independent cinematic gems across 10+ Indian languages.
      </p>
    </div>

    <!-- Search Bar -->
    <div style="position: relative; max-width: 450px; width: 100%;">
      <input 
        type="text" 
        id="catalog-search" 
        placeholder="Search by title, director, or storyline..." 
        style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border-radius: 0.85rem; background: #111319; border: 1px solid #262a36; color: #ffffff; font-size: 0.85rem; outline: none; box-sizing: border-box;"
        oninput="filterCatalog()"
      >
      <svg style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; color: #8e95a5;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
      </svg>
    </div>
  </div>

  <!-- Language Filter Chips -->
  <div style="margin-bottom: 1.5rem;">
    <div style="font-size: 0.75rem; font-weight: 700; color: #8e95a5; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
      Filter by Language:
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;" id="language-filter-chips">
      <button class="filter-chip active" onclick="selectLanguage('All', this)">All Languages</button>
      <button class="filter-chip" onclick="selectLanguage('Hindi', this)">Hindi (हिन्दी)</button>
      <button class="filter-chip" onclick="selectLanguage('Kannada', this)">Kannada (ಕನ್ನಡ)</button>
      <button class="filter-chip" onclick="selectLanguage('Tamil', this)">Tamil (தமிழ்)</button>
      <button class="filter-chip" onclick="selectLanguage('Malayalam', this)">Malayalam (മലയാളം)</button>
      <button class="filter-chip" onclick="selectLanguage('Telugu', this)">Telugu (తెలుగు)</button>
      <button class="filter-chip" onclick="selectLanguage('Gujarati', this)">Gujarati (ગુજરાતી)</button>
      <button class="filter-chip" onclick="selectLanguage('Bengali', this)">Bengali (বাংলা)</button>
      <button class="filter-chip" onclick="selectLanguage('Marathi', this)">Marathi (मराठी)</button>
    </div>
  </div>

  <!-- Films Grid -->
  <div id="films-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    <!-- Populated via script.js -->
  </div>

</main>

<?php
$extra_js = '<script>
  let activeLanguage = "All";

  function selectLanguage(lang, btn) {
    activeLanguage = lang;
    document.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    filterCatalog();
  }

  function filterCatalog() {
    const q = (document.getElementById("catalog-search")?.value || "").toLowerCase().trim();
    const container = document.getElementById("films-grid");
    if (!container) return;

    const filtered = DEFAULT_FILMS.filter(f => {
      const matchLang = activeLanguage === "All" || f.language.toLowerCase() === activeLanguage.toLowerCase();
      const matchQ = !q || f.title.toLowerCase().includes(q) || f.director.toLowerCase().includes(q) || f.synopsis.toLowerCase().includes(q);
      return matchLang && matchQ;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; background: #111319; border: 1px solid #262a36; border-radius: 1.5rem;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8e95a5" stroke-width="1.5" style="margin: 0 auto 1rem;"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="12" y2="12"/></svg>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff;">No short films found</h3>
          <p style="font-size: 0.8rem; color: #8e95a5; margin-top: 0.5rem;">Try selecting a different language or clearing your search query.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(f => `
      <div class="film-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.25rem; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.3s, border-color 0.3s;">
        <div style="position: relative; aspect-ratio: 16/9; background: #0f1117; overflow: hidden; cursor: pointer;" onclick="playFilm(\x27${f.id}\x27)">
          <img src="${f.posterUrl || f.backdropUrl}" alt="${f.title}" style="width: 100%; height: 100%; object-fit: cover;">
          <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 700; color: #ffffff;">
            ${f.duration}
          </div>
          <div style="position: absolute; top: 0.75rem; left: 0.75rem; background: rgba(229, 9, 20, 0.9); padding: 0.25rem 0.5rem; border-radius: 0.4rem; font-size: 10px; font-weight: 800; color: #ffffff; text-transform: uppercase;">
            ${f.language}
          </div>
          <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #e50914; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(229, 9, 20, 0.5);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffffff"><polygon points="6 3 20 12 6 21 6 3"/></svg>
            </div>
          </div>
        </div>

        <div style="padding: 1.25rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: #ffb703; font-weight: 700; margin-bottom: 0.35rem;">
              <span>★ ${f.rating}</span>
              <span style="color: #8e95a5; font-weight: normal;">${f.viewsCount.toLocaleString()} views</span>
            </div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #ffffff; margin-bottom: 0.25rem;">${f.title}</h3>
            <p style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-bottom: 0.5rem;">Dir. ${f.director}</p>
            <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${f.synopsis}</p>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(38,42,54,0.6);">
            <button onclick="playFilm(\x27${f.id}\x27)" style="flex: 1; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.75rem; padding: 0.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
              Watch Now
            </button>
            <button onclick="toggleWatchlist(\x27${f.id}\x27)" title="Save to Watchlist" style="background: #181b24; color: #ffffff; border: 1px solid #262a36; padding: 0.5rem; border-radius: 0.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `).join("");
  }

  document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    if (langParam) {
      activeLanguage = langParam;
      document.querySelectorAll(".filter-chip").forEach(b => {
        if (b.textContent.includes(langParam)) {
          b.classList.add("active");
        } else {
          b.classList.remove("active");
        }
      });
    }
    const qParam = urlParams.get("q");
    if (qParam) {
      const inp = document.getElementById("catalog-search");
      if (inp) inp.value = qParam;
    }
    filterCatalog();
  });
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
