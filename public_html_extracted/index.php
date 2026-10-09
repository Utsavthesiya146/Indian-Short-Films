<?php
/**
 * Indian Short Movie - Home Page
 * Premier OTT Discovery & Streaming Platform
 */
$page_title = 'Indian Short Movie | Premier Indian Cinema, Short Films & Regional Stories';
$page_description = 'The premier OTT cinematic platform for Indian short films, independent cinema, regional storytelling, and emerging digital directors across 10+ languages.';
$current_page = 'home';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>



<!-- Animated Sponsored Partner Banner -->
<style>
@keyframes pulseGlowLeft {
  0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.6; }
  50% { transform: scale(1.25) translate(20px, -15px); opacity: 0.9; }
}
@keyframes pulseGlowRight {
  0%, 100% { transform: scale(1) translate(0px, 0px); opacity: 0.6; }
  50% { transform: scale(1.3) translate(-25px, 15px); opacity: 0.95; }
}
@keyframes floatSpark {
  0% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(-18px) rotate(180deg); opacity: 0.8; }
  100% { transform: translateY(0px) rotate(360deg); opacity: 0.3; }
}
@keyframes borderGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.banner-glow-border {
  background: linear-gradient(135deg, #f84464, #dc2626, #9333ea, #2563eb, #dc2626);
  background-size: 300% 300%;
  animation: borderGradient 5s ease infinite;
}
</style>

<div class="relative w-full bg-[#050608] border-b border-cinema-border/50 py-8 overflow-hidden">
  
  <!-- Left Side Animated Glowing Light Orb -->
  <div 
    class="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-[#f84464]/35 via-[#dc2626]/20 to-transparent blur-[80px] pointer-events-none z-0"
    style="animation: pulseGlowLeft 6s ease-in-out infinite;"
  ></div>

  <!-- Right Side Animated Glowing Light Orb -->
  <div 
    class="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-bl from-[#8b5cf6]/40 via-[#dc2626]/20 to-transparent blur-[80px] pointer-events-none z-0"
    style="animation: pulseGlowRight 7s ease-in-out infinite;"
  ></div>

  <!-- Floating Sparkles in Empty Spaces -->
  <div class="absolute left-8 top-1/4 w-3 h-3 rounded-full bg-rose-400/60 blur-[1px] pointer-events-none z-0 hidden lg:block" style="animation: floatSpark 4s ease-in-out infinite;"></div>
  <div class="absolute left-16 bottom-1/4 w-4 h-4 rounded-full bg-amber-400/50 blur-[2px] pointer-events-none z-0 hidden lg:block" style="animation: floatSpark 5.5s ease-in-out infinite 1s;"></div>
  <div class="absolute right-10 top-1/3 w-3.5 h-3.5 rounded-full bg-purple-400/60 blur-[1px] pointer-events-none z-0 hidden lg:block" style="animation: floatSpark 4.5s ease-in-out infinite 0.5s;"></div>
  <div class="absolute right-20 bottom-1/3 w-4 h-4 rounded-full bg-cinema-teal/50 blur-[2px] pointer-events-none z-0 hidden lg:block" style="animation: floatSpark 6s ease-in-out infinite 1.5s;"></div>

  <!-- Centered Banner Container with Glowing Neon Frame -->
  <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
    <div class="p-[2.5px] rounded-3xl banner-glow-border shadow-[0_0_35px_rgba(220,38,38,0.3)] hover:shadow-[0_0_55px_rgba(248,68,100,0.5)] transition-shadow duration-500">
      <div class="relative rounded-[22px] overflow-hidden bg-black group">
        <a href="https://webhostingbaba.com" target="_blank" rel="noopener" class="block w-full">
          <img
            src="<?php echo $base_url; ?>advertise%20poster.jpeg"
            alt="Web Hosting Baba – Digital Growth Partner"
            class="w-full h-auto rounded-[22px] group-hover:scale-[1.015] transition-transform duration-500 block"
          />
        </a>
      </div>
    </div>
  </div>

</div>

<!-- Main OTT Catalog Grid Container -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  <!-- Section 1: Trending Now -->
  <section class="my-10">
    <div class="flex items-end justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-cinema-accent/10 border border-cinema-accent/30">
          <i data-lucide="flame" class="w-6 h-6 text-cinema-accent fill-cinema-accent"></i>
        </div>
        <div>
          <h2 class="font-display font-black text-2xl md:text-3xl text-white tracking-tight">Trending Short Films</h2>
          <p class="text-xs md:text-sm text-cinema-muted font-medium mt-0.5">Top watched independent releases across India</p>
        </div>
      </div>
      <a href="<?php echo $base_url; ?>discover.php" class="text-xs font-semibold text-cinema-teal hover:underline flex items-center gap-1">
        View All <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
      </a>
    </div>
    
    <!-- Films Grid Container (Rendered by JS) -->
    <div id="home-trending-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Populated via script.js -->
    </div>
  </section>

  <!-- Section 2: Top Rated Visionary Films -->
  <section class="my-14">
    <div class="flex items-end justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-cinema-gold/10 border border-cinema-gold/30">
          <i data-lucide="star" class="w-6 h-6 text-cinema-gold fill-cinema-gold"></i>
        </div>
        <div>
          <h2 class="font-display font-black text-2xl md:text-3xl text-white tracking-tight">Top Rated Masterpieces</h2>
          <p class="text-xs md:text-sm text-cinema-muted font-medium mt-0.5">Highest rated by film critics and audiences</p>
        </div>
      </div>
      <a href="<?php echo $base_url; ?>discover.php" class="text-xs font-semibold text-cinema-gold hover:underline flex items-center gap-1">
        Explore Top Rated <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
      </a>
    </div>
    
    <!-- Top Rated Grid Container (Rendered by JS) -->
    <div id="home-toprated-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Populated via script.js -->
    </div>
  </section>

  <!-- Section 3: Indian Languages Quick Filter Grid -->
  <section class="my-14 bg-gradient-to-b from-cinema-card to-cinema-surface rounded-3xl p-6 sm:p-8 border border-cinema-border shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-cinema-teal/10 border border-cinema-teal/30">
          <i data-lucide="languages" class="w-6 h-6 text-cinema-teal"></i>
        </div>
        <div>
          <h3 class="font-display font-bold text-xl md:text-2xl text-white">Browse by Indian Language</h3>
          <p class="text-xs md:text-sm text-cinema-muted">Authentic cinema rooted in native voices and regional cultures</p>
        </div>
      </div>
      <a href="<?php echo $base_url; ?>discover.php" class="text-xs font-semibold text-cinema-teal hover:underline flex items-center gap-1">
        All Languages <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
      </a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      <?php
      $languages = [
        ['code' => 'Hindi', 'name' => 'Hindi', 'native' => 'हिन्दी'],
        ['code' => 'Kannada', 'name' => 'Kannada', 'native' => 'ಕನ್ನಡ'],
        ['code' => 'Tamil', 'name' => 'Tamil', 'native' => 'தமிழ்'],
        ['code' => 'Telugu', 'name' => 'Telugu', 'native' => 'తెలుగు'],
        ['code' => 'Malayalam', 'name' => 'Malayalam', 'native' => 'മലയാളം'],
        ['code' => 'Gujarati', 'name' => 'Gujarati', 'native' => 'ગુજરાતી'],
        ['code' => 'Marathi', 'name' => 'Marathi', 'native' => 'मराठी'],
        ['code' => 'Bengali', 'name' => 'Bengali', 'native' => 'বাংলা'],
        ['code' => 'Punjabi', 'name' => 'Punjabi', 'native' => 'ਪੰਜਾਬੀ'],
        ['code' => 'English', 'name' => 'English', 'native' => 'Indian English'],
      ];
      foreach ($languages as $lang): ?>
        <a 
          href="<?php echo $base_url; ?>discover.php?lang=<?php echo urlencode($lang['code']); ?>" 
          class="p-4 rounded-2xl bg-cinema-surface hover:bg-cinema-border/50 border border-cinema-border/70 flex flex-col items-center justify-center gap-1 group transition-all hover:scale-105 hover:border-cinema-teal/50 shadow-md"
        >
          <span class="font-bold text-sm text-white group-hover:text-cinema-teal transition-colors">
            <?php echo $lang['name']; ?>
          </span>
          <span class="text-[11px] text-cinema-muted font-medium">
            <?php echo $lang['native']; ?>
          </span>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- Section 4: Explore Genres Showcase Grid -->
  <section class="my-14">
    <div class="flex items-center gap-3 mb-6">
      <div class="p-2.5 rounded-xl bg-cinema-gold/10 border border-cinema-gold/30">
        <i data-lucide="layout-grid" class="w-6 h-6 text-cinema-gold"></i>
      </div>
      <div>
        <h3 class="font-display font-bold text-xl md:text-2xl text-white">Explore Genres & Themes</h3>
        <p class="text-xs md:text-sm text-cinema-muted">From suspenseful thrillers to emotional slice-of-life dramas and folklore</p>
      </div>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <?php
      $genres = [
        ['name' => 'Drama', 'desc' => 'Powerful character-driven stories', 'color' => 'from-rose-900/40 to-cinema-surface'],
        ['name' => 'Suspense / Thriller', 'desc' => 'Edge-of-your-seat mysteries', 'color' => 'from-indigo-900/40 to-cinema-surface'],
        ['name' => 'Folklore / Mystery', 'desc' => 'Indian myths & sacred tales', 'color' => 'from-amber-900/40 to-cinema-surface'],
        ['name' => 'Romance', 'desc' => 'Heartfelt connections & love', 'color' => 'from-pink-900/40 to-cinema-surface'],
        ['name' => 'Documentary', 'desc' => 'Real stories & cultural roots', 'color' => 'from-emerald-900/40 to-cinema-surface'],
        ['name' => 'Sci-Fi', 'desc' => 'Futuristic & time dilemmas', 'color' => 'from-cyan-900/40 to-cinema-surface'],
        ['name' => 'Slice of Life', 'desc' => 'Everyday warmth & humor', 'color' => 'from-violet-900/40 to-cinema-surface'],
        ['name' => 'Art / Culture', 'desc' => 'Traditional art & performances', 'color' => 'from-yellow-900/40 to-cinema-surface'],
      ];
      foreach ($genres as $g): ?>
        <a
          href="<?php echo $base_url; ?>discover.php?genre=<?php echo urlencode($g['name']); ?>"
          class="group relative h-28 rounded-2xl bg-gradient-to-br <?php echo $g['color']; ?> border border-cinema-border p-4 flex flex-col justify-end overflow-hidden hover:border-cinema-gold/60 transition-all hover:-translate-y-1 shadow-lg"
        >
          <div class="absolute top-3 right-3 text-cinema-muted group-hover:text-cinema-gold transition-colors">
            <i data-lucide="film" class="w-5 h-5 opacity-40"></i>
          </div>
          <h4 class="font-bold text-base text-white group-hover:text-cinema-gold transition-colors">
            <?php echo $g['name']; ?>
          </h4>
          <p class="text-[11px] text-cinema-muted line-clamp-1">
            <?php echo $g['desc']; ?>
          </p>
        </a>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- Section 5: All Indian Short Films Row -->
  <section class="my-14">
    <div class="flex items-end justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2.5 rounded-xl bg-cinema-teal/10 border border-cinema-teal/30">
          <i data-lucide="sparkles" class="w-6 h-6 text-cinema-teal"></i>
        </div>
        <div>
          <h2 class="font-display font-black text-2xl md:text-3xl text-white tracking-tight">Recent Releases</h2>
          <p class="text-xs md:text-sm text-cinema-muted font-medium mt-0.5">Fresh independent short films added by directors</p>
        </div>
      </div>
    </div>
    
    <div id="home-recent-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Populated via script.js -->
    </div>
  </section>

</div>

<?php
$extra_js = '<script>
  function initHomePage() {
    if(typeof updateHomeHero === "function") updateHomeHero();
    if(typeof renderHomeTrendingFilms === "function") renderHomeTrendingFilms();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHomePage);
  } else {
    initHomePage();
  }
</script>';

require_once __DIR__ . '/includes/footer.php';
?>

