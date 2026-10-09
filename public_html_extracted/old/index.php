<?php
/**
 * Indian Short Movie - Home Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'Indian Short Movie | Premier Indian Cinema, Short Films & Reels';
$page_description = 'The premier cinematic platform for Indian short films, vertical reels, independent filmmakers, and digital creators.';
$current_page = 'home';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<!-- HERO SECTION: FEATURED PREMIERE -->
<section class="hero-section" style="position: relative; min-height: 80vh; display: flex; align-items: flex-end; padding: 5rem 1.5rem 4rem; overflow: hidden; background: #07080b;">
  <!-- Backdrop Image & Gradient Overlays -->
  <div style="position: absolute; inset: 0; z-index: 1;">
    <img 
      src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80" 
      alt="The Last Note Hero" 
      style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.65);"
    >
    <div style="position: absolute; inset: 0; background: linear-gradient(to top, #07080b 10%, rgba(7,8,11,0.65) 60%, rgba(7,8,11,0.2) 100%);"></div>
    <div style="position: absolute; inset: 0; background: radial-gradient(circle at 20% 80%, rgba(229, 9, 20, 0.15) 0%, transparent 60%);"></div>
  </div>

  <div style="position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; width: 100%;">
    <div style="max-width: 680px;">
      <!-- Premiere Badge -->
      <div style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.75rem; border-radius: 9999px; background: rgba(229, 9, 20, 0.2); border: 1px solid rgba(229, 9, 20, 0.4); margin-bottom: 1rem;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #e50914; display: inline-block;"></span>
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff;">Featured Premiere</span>
        <span style="font-size: 10px; font-weight: 600; color: #ffb703;">★ 4.9 Rating</span>
      </div>

      <h1 style="font-family: 'Outfit', sans-serif; font-weight: 900; font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: 1.1; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 0.75rem;">
        The Last Note
      </h1>

      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 0.85rem; font-size: 0.8rem; color: #d1d5db; margin-bottom: 1rem;">
        <span style="background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 0.35rem; font-weight: 600; color: #66fcf1;">Kannada (ಕನ್ನಡ)</span>
        <span>•</span>
        <span>18 mins</span>
        <span>•</span>
        <span>Drama / Music</span>
        <span>•</span>
        <span style="color: #9ca3af;">Dir. Aarav Sharma</span>
      </div>

      <p style="font-size: 0.95rem; color: #9ca3af; line-height: 1.6; margin-bottom: 1.75rem; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
        A passionate classical violinist in the mist-laden hills of Chikmagalur struggles to compose his farewell masterpiece while gradually losing his hearing. A profound celebration of sound, silence, and memory.
      </p>

      <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem;">
        <button onclick="playFilm('film-1')" style="display: inline-flex; align-items: center; gap: 0.6rem; background: #e50914; color: #ffffff; font-weight: 800; font-size: 0.9rem; padding: 0.85rem 1.6rem; border-radius: 0.85rem; border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4); transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.03)'" onmouseout="this.style.transform='scale(1)'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
          <span>Watch Premiere</span>
        </button>

        <button onclick="toggleWatchlist('film-1')" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(24, 27, 36, 0.85); color: #ffffff; font-weight: 600; font-size: 0.85rem; padding: 0.85rem 1.4rem; border-radius: 0.85rem; border: 1px solid rgba(255,255,255,0.15); backdrop-filter: blur(8px); cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#181b24'" onmouseout="this.style.background='rgba(24, 27, 36, 0.85)'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span>Add to Watchlist</span>
        </button>

        <a href="discover.php" style="color: #66fcf1; font-size: 0.85rem; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem; margin-left: 0.5rem;">
          <span>Explore All 20+ Films</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </a>
      </div>
    </div>
  </div>
</section>

<!-- REGIONAL SPOTLIGHT FILTER STRIP -->
<section style="background: #111319; border-top: 1px solid #262a36; border-bottom: 1px solid #262a36; padding: 1.25rem 1.5rem;">
  <div style="max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
    <div style="display: flex; align-items: center; gap: 0.5rem; color: #ffffff; font-weight: 700; font-size: 0.85rem;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      <span>Regional Spotlight:</span>
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      <a href="discover.php?lang=Hindi" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Hindi (हिन्दी)</a>
      <a href="discover.php?lang=Kannada" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Kannada (ಕನ್ನಡ)</a>
      <a href="discover.php?lang=Tamil" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Tamil (தமிழ்)</a>
      <a href="discover.php?lang=Telugu" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Telugu (తెలుగు)</a>
      <a href="discover.php?lang=Malayalam" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Malayalam (മലയാളം)</a>
      <a href="discover.php?lang=Gujarati" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Gujarati (ગુજરાતી)</a>
      <a href="discover.php?lang=Bengali" class="lang-pill" style="padding: 0.35rem 0.85rem; border-radius: 9999px; background: #181b24; border: 1px solid #262a36; color: #d1d5db; font-size: 0.75rem; text-decoration: none; font-weight: 600; transition: all 0.2s;">Bengali (বাংলা)</a>
    </div>
  </div>
</section>

<!-- MAIN CONTENT CONTAINER -->
<main style="max-width: 1280px; margin: 0 auto; padding: 3.5rem 1.5rem; display: flex; flex-direction: column; gap: 4rem;">
  
  <!-- SECTION 1: TRENDING SHORT FILMS -->
  <section>
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 1.75rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #e50914; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
          <span>Curated Selections</span>
        </div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.85rem; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
          Trending Indian Short Films
        </h2>
      </div>
      <a href="discover.php" style="color: #66fcf1; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
        <span>View Full Catalog</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Films Grid Container -->
    <div id="home-trending-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
      <!-- Populated via script.js / default cards -->
    </div>
  </section>

  <!-- SECTION 2: VERTICAL SHORT REELS (MOBILE FORMAT CINEMA) -->
  <section style="background: #111319; border: 1px solid #262a36; border-radius: 2rem; padding: 2.5rem 2rem;">
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #66fcf1; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
          <span>Quick Cinematic Stories</span>
        </div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.75rem; font-weight: 900; color: #ffffff;">
          Vertical Cinema &amp; Reels
        </h2>
      </div>
      <span style="font-size: 0.75rem; color: #8e95a5;">Tap to view in fullscreen</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.25rem;">
      
      <!-- Reel 1 -->
      <div onclick="playFilm('film-1')" style="position: relative; aspect-ratio: 9/16; border-radius: 1.25rem; overflow: hidden; border: 1px solid #262a36; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <img src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=600&q=80" alt="Reel" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem;">
          <span style="font-size: 10px; font-weight: 700; color: #66fcf1; text-transform: uppercase;">Kannada</span>
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0.25rem 0;">Echoes of Kudremukh</h4>
          <span style="font-size: 10px; color: #d1d5db;">34.2K views • Dir. Priya</span>
        </div>
      </div>

      <!-- Reel 2 -->
      <div onclick="playFilm('film-3')" style="position: relative; aspect-ratio: 9/16; border-radius: 1.25rem; overflow: hidden; border: 1px solid #262a36; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80" alt="Reel" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem;">
          <span style="font-size: 10px; font-weight: 700; color: #e50914; text-transform: uppercase;">Hindi</span>
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0.25rem 0;">Ghats of Kashi</h4>
          <span style="font-size: 10px; color: #d1d5db;">58.9K views • Dir. Vikram</span>
        </div>
      </div>

      <!-- Reel 3 -->
      <div onclick="playFilm('film-4')" style="position: relative; aspect-ratio: 9/16; border-radius: 1.25rem; overflow: hidden; border: 1px solid #262a36; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <img src="https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80" alt="Reel" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem;">
          <span style="font-size: 10px; font-weight: 700; color: #ffb703; text-transform: uppercase;">Tamil</span>
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0.25rem 0;">Marina Midnight</h4>
          <span style="font-size: 10px; color: #d1d5db;">41.5K views • Dir. Arvind</span>
        </div>
      </div>

      <!-- Reel 4 -->
      <div onclick="playFilm('film-5')" style="position: relative; aspect-ratio: 9/16; border-radius: 1.25rem; overflow: hidden; border: 1px solid #262a36; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='none'">
        <img src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80" alt="Reel" style="width: 100%; height: 100%; object-fit: cover;">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%); display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem;">
          <span style="font-size: 10px; font-weight: 700; color: #10b981; text-transform: uppercase;">Malayalam</span>
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #ffffff; line-height: 1.2; margin: 0.25rem 0;">Theyyam Spirits</h4>
          <span style="font-size: 10px; color: #d1d5db;">67.3K views • Dir. Meera</span>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION 3: VISIONARY FILMMAKERS SPOTLIGHT -->
  <section>
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 1.75rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #ffb703; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.25rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          <span>Independent Creators</span>
        </div>
        <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.85rem; font-weight: 900; color: #ffffff;">
          Visionary Filmmakers
        </h2>
      </div>
      <a href="filmmakers.php" style="color: #66fcf1; font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 0.35rem;">
        <span>Meet All Directors</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </a>
    </div>

    <!-- Filmmakers Roster Cards -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;">
      
      <!-- Creator 1 -->
      <div style="background: #181b24; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.5rem; text-align: center;">
        <img src="harri-kumar.jpg" alt="Aarav Sharma" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 2px solid #e50914;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">Aarav Sharma</h4>
        <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600;">Writer &amp; Director • Bengaluru</span>
        <p style="font-size: 0.75rem; color: #8e95a5; margin: 0.75rem 0 1rem; line-height: 1.5;">Specializes in atmospheric neo-noir and philosophical realism across Karnataka.</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; font-size: 0.75rem; color: #ffb703; font-weight: 700;">
          <span>3 Directed Films</span> • <span>★ 4.9 Avg</span>
        </div>
      </div>

      <!-- Creator 2 -->
      <div style="background: #181b24; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.5rem; text-align: center;">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Priya Hegde" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 2px solid #66fcf1;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">Priya Hegde</h4>
        <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600;">Folklore Filmmaker • Shivamogga</span>
        <p style="font-size: 0.75rem; color: #8e95a5; margin: 0.75rem 0 1rem; line-height: 1.5;">Explores mythic traditions, coastal folklore, and environmental surrealism.</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; font-size: 0.75rem; color: #ffb703; font-weight: 700;">
          <span>2 Directed Films</span> • <span>★ 4.8 Avg</span>
        </div>
      </div>

      <!-- Creator 3 -->
      <div style="background: #181b24; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.5rem; text-align: center;">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Vikramaditya Roy" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 2px solid #ffb703;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">Vikramaditya Roy</h4>
        <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600;">Sci-Fi &amp; Thriller • Mumbai</span>
        <p style="font-size: 0.75rem; color: #8e95a5; margin: 0.75rem 0 1rem; line-height: 1.5;">Known for high-concept psychological thrillers set in retro-futuristic urban India.</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; font-size: 0.75rem; color: #ffb703; font-weight: 700;">
          <span>4 Directed Films</span> • <span>★ 4.7 Avg</span>
        </div>
      </div>

      <!-- Creator 4 -->
      <div style="background: #181b24; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.5rem; text-align: center;">
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Meera Nambiar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 1rem; border: 2px solid #10b981;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #ffffff;">Meera Nambiar</h4>
        <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600;">Documentary Director • Kochi</span>
        <p style="font-size: 0.75rem; color: #8e95a5; margin: 0.75rem 0 1rem; line-height: 1.5;">National award winner focusing on vanishing indigenous art forms and oral histories.</p>
        <div style="display: flex; justify-content: center; gap: 0.5rem; font-size: 0.75rem; color: #ffb703; font-weight: 700;">
          <span>3 Directed Films</span> • <span>★ 4.9 Avg</span>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION 4: CALL TO ACTION -->
  <section style="background: linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(17, 19, 25, 0.95) 100%); border: 1px solid rgba(229, 9, 20, 0.3); border-radius: 2rem; padding: 3.5rem 2rem; text-align: center;">
    <h2 style="font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 0.75rem;">
      Are You An Independent Filmmaker?
    </h2>
    <p style="font-size: 0.95rem; color: #d1d5db; max-width: 600px; margin: 0 auto 2rem; line-height: 1.6;">
      Get your short film screened to a passionate community of film critics, festival curators, and cinema enthusiasts across India.
    </p>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem;">
      <button onclick="openSubmitFilmModal()" style="background: #e50914; color: #ffffff; font-weight: 800; font-size: 0.9rem; padding: 0.85rem 1.8rem; border-radius: 0.85rem; border: none; cursor: pointer; box-shadow: 0 8px 24px rgba(229, 9, 20, 0.4);">
        Submit Your Short Film
      </button>
      <a href="admin/index.php" style="background: #181b24; color: #ffffff; font-weight: 700; font-size: 0.9rem; padding: 0.85rem 1.8rem; border-radius: 0.85rem; border: 1px solid #262a36; text-decoration: none;">
        Open Admin Portal
      </a>
    </div>
  </section>

</main>

<?php
$extra_js = '<script>
  document.addEventListener("DOMContentLoaded", function() {
    renderHomeTrendingFilms();
  });
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
