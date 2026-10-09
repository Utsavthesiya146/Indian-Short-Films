<?php
/**
 * Indian Short Movie - Discover Page
 * Next.js Tailwind Design Conversion
 */
$page_title = 'Discover Indian Short Films | Indian Short Movie';
$page_description = 'Explore premier award-winning short films, independent cinema, and regional storytelling across India.';
$current_page = 'discover';
$base_url = './';

// Fetch initial films via PHP for instant Server-Side Rendering (SSR)
$initial_films = [];
try {
    $db_file = __DIR__ . '/php/db.php';
    if (file_exists($db_file)) {
        require_once $db_file;
        if (isset($pdo) && $pdo instanceof PDO) {
            $stmt = $pdo->query("SELECT * FROM films ORDER BY created_at DESC");
            if ($stmt) {
                $initial_films = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            // Also merge any film_submissions
            $sub_stmt = $pdo->query("SELECT * FROM film_submissions ORDER BY id DESC");
            if ($sub_stmt) {
                $subs = $sub_stmt->fetchAll(PDO::FETCH_ASSOC);
                $existing_titles = array_map(function($f) { return strtolower(trim($f['title'] ?? '')); }, $initial_films);
                foreach ($subs as $s) {
                    $st = trim($s['title'] ?? '');
                    if (!empty($st) && !in_array(strtolower($st), $existing_titles)) {
                        $initial_films[] = [
                            'id' => 'sub-' . ($s['id'] ?? rand(100,999)),
                            'uuid' => 'sub-' . ($s['id'] ?? rand(100,999)),
                            'title' => $st,
                            'director' => $s['director'] ?? 'Independent Director',
                            'language' => $s['language'] ?? 'Gujarati',
                            'genre' => $s['genre'] ?? 'Drama',
                            'duration' => $s['duration'] ?? '15 mins',
                            'poster_url' => !empty($s['poster_url']) ? $s['poster_url'] : (!empty($s['thumbnail']) ? $s['thumbnail'] : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'),
                            'rating' => 5.0,
                            'status' => 'approved'
                        ];
                    }
                }
            }
        }
    }
} catch (Exception $e) {}

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<!-- Main Catalog Content -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
  
  <!-- Header & Live Search -->
  <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
    <div>
      <h1 class="font-display font-black text-3xl md:text-4xl text-white tracking-tight mb-2">
        Discover Indian Short Films
      </h1>
      <p class="text-sm text-cinema-muted max-w-2xl">
        Explore festival selections, regional narratives, and independent cinematic gems across 10+ Indian languages.
      </p>
    </div>

    <!-- Search Bar -->
    <div class="relative w-full md:w-96">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i data-lucide="search" class="w-5 h-5 text-cinema-muted"></i>
      </div>
      <input 
        type="text" 
        id="catalog-search" 
        placeholder="Search by title, director, or storyline..." 
        class="block w-full pl-10 pr-4 py-3 bg-cinema-surface border border-cinema-border rounded-xl text-white placeholder-cinema-muted focus:outline-none focus:ring-1 focus:ring-cinema-accent focus:border-cinema-accent transition-all text-sm"
        oninput="filterCatalog()"
      >
    </div>
  </div>

  <!-- Language Filter Chips -->
  <div class="mb-8">
    <div class="text-xs font-bold text-cinema-muted uppercase tracking-wider mb-3">
      Filter by Language:
    </div>
    <div class="flex flex-wrap gap-2" id="language-filter-chips">
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-accent text-white border border-cinema-accent" onclick="selectLanguage('All', this)">All Languages</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Hindi', this)">Hindi</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Kannada', this)">Kannada</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Tamil', this)">Tamil</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Malayalam', this)">Malayalam</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Telugu', this)">Telugu</button>
      <button class="filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted" onclick="selectLanguage('Gujarati', this)">Gujarati</button>
    </div>
  </div>

  <!-- Films Grid (SSR Instant Load) -->
  <div id="films-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    <?php
    $display_films = !empty($initial_films) ? $initial_films : [
      ['id' => 'film-1', 'title' => 'The Last Note', 'director' => 'Aarav Sharma', 'language' => 'Kannada', 'duration' => '18 mins', 'rating' => 4.9, 'poster_url' => 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'],
      ['id' => 'film-2', 'title' => 'Maya: Illusions of Malnad', 'director' => 'Priya Hegde', 'language' => 'Kannada', 'duration' => '22 mins', 'rating' => 4.8, 'poster_url' => 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=800&q=80'],
      ['id' => 'film-3', 'title' => 'Kaalchakra - The Wheel', 'director' => 'Vikramaditya Roy', 'language' => 'Hindi', 'duration' => '15 mins', 'rating' => 4.7, 'poster_url' => 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'],
      ['id' => 'film-4', 'title' => 'Bengaluru 6 AM', 'director' => 'Karthik Rao', 'language' => 'Kannada', 'duration' => '12 mins', 'rating' => 4.6, 'poster_url' => 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=800&q=80'],
      ['id' => 'film-5', 'title' => 'Vanishing Echoes', 'director' => 'Meera Nambiar', 'language' => 'Malayalam', 'duration' => '24 mins', 'rating' => 4.9, 'poster_url' => 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80'],
      ['id' => 'film-8', 'title' => 'The Clay Potter of Kutch', 'director' => 'Bhavna Patel', 'language' => 'Gujarati', 'duration' => '19 mins', 'rating' => 4.7, 'poster_url' => 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80']
    ];

    foreach ($display_films as $f):
      $fid = htmlspecialchars($f['id'] ?? ($f['uuid'] ?? 'film-1'));
      $ftitle = htmlspecialchars($f['title'] ?? 'Untitled Film');
      $fdir = htmlspecialchars($f['director'] ?? 'Independent Director');
      $flang = htmlspecialchars($f['language'] ?? 'Gujarati');
      $fdur = htmlspecialchars($f['duration'] ?? '15 mins');
      $frat = !empty($f['rating']) ? number_format((float)$f['rating'], 1) : '5.0';
      $fimg = !empty($f['poster_url']) ? htmlspecialchars($f['poster_url']) : (!empty($f['posterUrl']) ? htmlspecialchars($f['posterUrl']) : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80');
    ?>
      <div class="group relative flex flex-col w-full">
        <div class="relative aspect-[2/3] min-h-[260px] w-full rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cinema-accent/60 shadow-lg cursor-pointer" onclick="playFilm('<?php echo $fid; ?>')">
          <img src="<?php echo $fimg; ?>" alt="<?php echo $ftitle; ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="w-12 h-12 rounded-full bg-cinema-accent flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <i data-lucide="play" class="w-5 h-5 text-white fill-white ml-0.5"></i>
            </button>
          </div>

          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-cinema-teal px-2 py-0.5 rounded-md border border-cinema-teal/30 pointer-events-none">
              <?php echo $flang; ?>
            </span>
          </div>

          <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span class="text-[10px] font-bold bg-black/80 backdrop-blur-md text-cinema-gold px-2 py-0.5 rounded-md border border-cinema-gold/30 flex items-center gap-1">
              <i data-lucide="star" class="w-3 h-3 fill-cinema-gold"></i>
              <?php echo $frat; ?>
            </span>
            <span class="text-[10px] font-medium bg-black/80 backdrop-blur-md text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1">
              <i data-lucide="clock" class="w-2.5 h-2.5"></i>
              <?php echo $fdur; ?>
            </span>
          </div>
        </div>

        <div class="mt-3 flex flex-col">
          <a href="discover.php" class="font-semibold text-sm text-white hover:text-cinema-accent transition-colors line-clamp-1">
            <?php echo $ftitle; ?>
          </a>
          <span class="text-xs text-cinema-muted line-clamp-1 mt-0.5">
            Dir. <?php echo $fdir; ?>
          </span>
        </div>
      </div>
    <?php endforeach; ?>
  </div>

</main>

<?php
// Embed PHP film data as JS variable so filters always work even before DB fetch completes
$ssr_films_json = json_encode(array_values(array_map(function($f) {
    return [
        'id'        => $f['id'] ?? ($f['uuid'] ?? 'film-ssr'),
        'title'     => $f['title'] ?? 'Untitled Film',
        'director'  => $f['director'] ?? 'Independent Director',
        'language'  => $f['language'] ?? 'Gujarati',
        'genre'     => $f['genre'] ?? 'Drama',
        'duration'  => $f['duration'] ?? '15 mins',
        'rating'    => (float)($f['rating'] ?? 5.0),
        'posterUrl' => !empty($f['poster_url']) ? $f['poster_url'] : (!empty($f['posterUrl']) ? $f['posterUrl'] : 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80'),
        'videoUrl'  => $f['video_url'] ?? ($f['videoUrl'] ?? ''),
        'synopsis'  => $f['synopsis'] ?? ($f['description'] ?? ''),
        'isFeatured'=> true,
        'status'    => 'approved',
    ];
}, $display_films)));
ob_start();
?>
<script>
  let activeLanguage = "All";
  let activeGenre = "All";

  function selectLanguage(lang, btn) {
    activeLanguage = lang;
    
    // Reset language chips
    document.querySelectorAll("#language-filter-chips .filter-chip").forEach(b => {
      b.className = "filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted";
    });
    
    if (btn) {
      btn.className = "filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-accent text-white border border-cinema-accent";
    }
    
    filterCatalog();
  }

  // SSR_FILMS: server-side rendered films embedded directly from PHP (always available)
  var SSR_FILMS = <?php echo $ssr_films_json; ?>;

  function filterCatalog() {
    const q = (document.getElementById("catalog-search")?.value || "").toLowerCase().trim();
    const container = document.getElementById("films-grid");
    if (!container) return;

    // Always use DEFAULT_FILMS if DB has loaded, otherwise fall back to SSR_FILMS from PHP
    const filmsToFilter = (typeof DEFAULT_FILMS !== "undefined" && Array.isArray(DEFAULT_FILMS) && DEFAULT_FILMS.length > 0)
      ? DEFAULT_FILMS : SSR_FILMS;

    if (!filmsToFilter || filmsToFilter.length === 0) return;

    const filtered = filmsToFilter.filter(f => {
      if (!f) return false;
      const filmLang = String(f.language || "").toLowerCase().trim();
      const filmGenre = String(f.genre || "").toLowerCase().trim();
      const filmTitle = String(f.title || "").toLowerCase().trim();
      const filmDirector = String(f.director || "").toLowerCase().trim();
      const filmSynopsis = String(f.synopsis || f.description || "").toLowerCase().trim();

      const actLang = String(activeLanguage || "All").toLowerCase().trim();
      const actGenre = String(activeGenre || "All").toLowerCase().trim();

      const matchLang = (actLang === "all") || (filmLang === actLang) || filmLang.includes(actLang);
      const matchGenre = (actGenre === "all") || filmGenre.includes(actGenre);
      const matchQ = !q || filmTitle.includes(q) || filmDirector.includes(q) || filmSynopsis.includes(q) || filmGenre.includes(q);
      
      return matchLang && matchGenre && matchQ;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center bg-cinema-surface border border-cinema-border rounded-2xl">
          <i data-lucide="search-x" class="w-12 h-12 text-cinema-muted mx-auto mb-4"></i>
          <h3 class="text-xl font-bold text-white mb-2">No short films found</h3>
          <p class="text-sm text-cinema-muted">Try selecting a different filter or clearing your search query.</p>
        </div>
      `;
      if(typeof lucide !== "undefined") lucide.createIcons();
      return;
    }

    container.innerHTML = filtered.map(f => {
      const fid     = f.id        || f.uuid      || "film-1";
      const fimg    = f.posterUrl || f.poster_url || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80";
      const ftitle  = String(f.title    || "Untitled Film").replace(/"/g, "&quot;");
      const fdir    = String(f.director || "Independent Director").replace(/"/g, "&quot;");
      const flang   = f.language  || "Gujarati";
      const fdur    = f.duration  || "15 mins";
      const frat    = f.rating    ? (typeof f.rating === "number" ? f.rating.toFixed(1) : f.rating) : "5.0";
      const wl      = JSON.parse(localStorage.getItem("ism_watchlist") || "[]");
      const inWl    = wl.includes(String(fid));
      return `
      <div class="group relative flex flex-col w-full">
        <div class="relative aspect-[2/3] min-h-[260px] w-full rounded-2xl overflow-hidden bg-cinema-card border border-cinema-border transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-cinema-accent/60 shadow-lg cursor-pointer" onclick="playFilm('${fid}')">
          <img src="${fimg}" alt="${ftitle}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button class="w-12 h-12 rounded-full bg-cinema-accent flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"><i data-lucide="play" class="w-5 h-5 text-white fill-white ml-0.5"></i></button>
          </div>
          <div class="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-cinema-teal px-2 py-0.5 rounded-md border border-cinema-teal/30 pointer-events-none">${flang}</span>
            <button id="wl-btn-${fid}" onclick="event.stopPropagation(); toggleWatchlist('${fid}')" style="width:30px;height:30px;border-radius:50%;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;background:${inWl?'rgba(229,9,20,0.9)':'rgba(0,0,0,0.7)'};backdrop-filter:blur(4px);">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="${inWl?'white':'none'}" stroke="white" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>
          <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span class="text-[10px] font-bold bg-black/80 backdrop-blur-md text-cinema-gold px-2 py-0.5 rounded-md border border-cinema-gold/30 flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 fill-cinema-gold"></i>${frat}</span>
            <span class="text-[10px] font-medium bg-black/80 backdrop-blur-md text-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1"><i data-lucide="clock" class="w-2.5 h-2.5"></i>${fdur}</span>
          </div>
        </div>
        <div class="mt-3 flex flex-col">
          <a href="discover.php" class="font-semibold text-sm text-white hover:text-cinema-accent transition-colors line-clamp-1">${ftitle}</a>
          <span class="text-xs text-cinema-muted line-clamp-1 mt-0.5">Dir. ${fdir}</span>
        </div>
      </div>`;
    }).join("");
    if (typeof lucide !== "undefined") lucide.createIcons();
  }

  function initDiscoverPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    const genreParam = urlParams.get("genre");
    const qParam = urlParams.get("q");

    if (langParam) {
      activeLanguage = langParam;
      document.querySelectorAll("#language-filter-chips .filter-chip").forEach(b => {
        if (b.textContent.trim().toLowerCase().includes(langParam.toLowerCase())) {
          b.className = "filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-accent text-white border border-cinema-accent";
        } else {
          b.className = "filter-chip px-4 py-2 rounded-xl text-xs font-semibold transition-all bg-cinema-surface text-gray-300 hover:text-white border border-cinema-border hover:border-cinema-muted";
        }
      });
    }

    if (genreParam) activeGenre = genreParam;
    if (qParam) {
      const inp = document.getElementById("catalog-search");
      if (inp) inp.value = qParam;
    }

    if (typeof fetchFilmsFromDB === "function") {
      fetchFilmsFromDB().then(() => filterCatalog()).catch(() => filterCatalog());
    } else {
      filterCatalog();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDiscoverPage);
  } else {
    initDiscoverPage();
  }
</script>
<?php
$extra_js = ob_get_clean();
require_once __DIR__ . '/includes/footer.php';
?>
