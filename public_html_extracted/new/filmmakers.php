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

  <!-- Filmmakers Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    
    <!-- Filmmaker 1 -->
    <div class="creator-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
      <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2px solid #e50914; margin-bottom: 1rem;">
        <img src="harri-kumar.jpg" alt="Aarav Sharma" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Aarav Sharma</h3>
      <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-top: 0.2rem;">Director &amp; Screenwriter</span>
      <span style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.1rem;">Bengaluru, Karnataka</span>
      <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; margin: 0.85rem 0 1.25rem;">
        Pioneer of contemporary Kannada neo-noir realism. Known for films like "The Last Note" and "Midnight Express".
      </p>
      <div style="width: 100%; padding-top: 1rem; border-top: 1px solid rgba(38,42,54,0.6); display: flex; justify-content: space-around; font-size: 0.75rem;">
        <div>
          <div style="font-weight: 800; color: #ffffff;">3</div>
          <div style="color: #8e95a5; font-size: 10px;">Short Films</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #ffb703;">★ 4.9</div>
          <div style="color: #8e95a5; font-size: 10px;">Rating</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #10b981;">Kannada</div>
          <div style="color: #8e95a5; font-size: 10px;">Language</div>
        </div>
      </div>
    </div>

    <!-- Filmmaker 2 -->
    <div class="creator-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
      <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2px solid #66fcf1; margin-bottom: 1rem;">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" alt="Priya Hegde" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Priya Hegde</h3>
      <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-top: 0.2rem;">Mythic &amp; Folklore Storyteller</span>
      <span style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.1rem;">Shivamogga, Karnataka</span>
      <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; margin: 0.85rem 0 1.25rem;">
        Explores the intersection of Western Ghats sacred groves, folk mysticism, and environmental conservation.
      </p>
      <div style="width: 100%; padding-top: 1rem; border-top: 1px solid rgba(38,42,54,0.6); display: flex; justify-content: space-around; font-size: 0.75rem;">
        <div>
          <div style="font-weight: 800; color: #ffffff;">2</div>
          <div style="color: #8e95a5; font-size: 10px;">Short Films</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #ffb703;">★ 4.8</div>
          <div style="color: #8e95a5; font-size: 10px;">Rating</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #10b981;">Kannada</div>
          <div style="color: #8e95a5; font-size: 10px;">Language</div>
        </div>
      </div>
    </div>

    <!-- Filmmaker 3 -->
    <div class="creator-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
      <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2px solid #ffb703; margin-bottom: 1rem;">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" alt="Vikramaditya Roy" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Vikramaditya Roy</h3>
      <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-top: 0.2rem;">Sci-Fi &amp; Thriller Producer</span>
      <span style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.1rem;">Mumbai, Maharashtra</span>
      <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; margin: 0.85rem 0 1.25rem;">
        Crafting high-octane speculative Indian cinema. Director of the critically acclaimed temporal mystery "Kaalchakra".
      </p>
      <div style="width: 100%; padding-top: 1rem; border-top: 1px solid rgba(38,42,54,0.6); display: flex; justify-content: space-around; font-size: 0.75rem;">
        <div>
          <div style="font-weight: 800; color: #ffffff;">4</div>
          <div style="color: #8e95a5; font-size: 10px;">Short Films</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #ffb703;">★ 4.7</div>
          <div style="color: #8e95a5; font-size: 10px;">Rating</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #10b981;">Hindi</div>
          <div style="color: #8e95a5; font-size: 10px;">Language</div>
        </div>
      </div>
    </div>

    <!-- Filmmaker 4 -->
    <div class="creator-card" style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 1.75rem; display: flex; flex-direction: column; align-items: center; text-align: center;">
      <div style="width: 88px; height: 88px; border-radius: 50%; overflow: hidden; border: 2px solid #10b981; margin-bottom: 1rem;">
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="Meera Nambiar" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <h3 style="font-size: 1.2rem; font-weight: 800; color: #ffffff;">Meera Nambiar</h3>
      <span style="font-size: 0.75rem; color: #66fcf1; font-weight: 600; margin-top: 0.2rem;">Documentary Filmmaker</span>
      <span style="font-size: 0.75rem; color: #8e95a5; margin-top: 0.1rem;">Kochi, Kerala</span>
      <p style="font-size: 0.75rem; color: #8e95a5; line-height: 1.5; margin: 0.85rem 0 1.25rem;">
        Capturing nocturnal rituals, Kerala backwaters folklore, and vanishing tribal musical traditions.
      </p>
      <div style="width: 100%; padding-top: 1rem; border-top: 1px solid rgba(38,42,54,0.6); display: flex; justify-content: space-around; font-size: 0.75rem;">
        <div>
          <div style="font-weight: 800; color: #ffffff;">3</div>
          <div style="color: #8e95a5; font-size: 10px;">Short Films</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #ffb703;">★ 4.9</div>
          <div style="color: #8e95a5; font-size: 10px;">Rating</div>
        </div>
        <div>
          <div style="font-weight: 800; color: #10b981;">Malayalam</div>
          <div style="color: #8e95a5; font-size: 10px;">Language</div>
        </div>
      </div>
    </div>

  </div>

</main>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
