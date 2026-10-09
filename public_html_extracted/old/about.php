<?php
/**
 * Indian Short Movie - About Us Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'About Us | Indian Short Movie';
$page_description = 'Discover Indian Short Movie, the premier digital stage empowering independent Indian filmmakers, storytellers, and audiences worldwide.';
$current_page = 'about';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main style="max-width: 1280px; margin: 0 auto; padding: 3rem 1.5rem; min-height: 80vh;">
  <!-- About Hero -->
  <section style="text-align: center; max-width: 860px; margin: 0 auto 4rem auto;">
    <div style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(229, 9, 20, 0.15); border: 1px solid rgba(229, 9, 20, 0.3); color: #e50914; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">
      Our Mission &amp; Vision
    </div>
    <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 900; color: #ffffff; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1.25rem;">
      Empowering India’s <br>
      <span style="background: linear-gradient(135deg, #e50914, #ffb703); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Independent Storytellers</span>
    </h1>
    <p style="font-size: 1.05rem; color: #9ca3af; line-height: 1.7;">
      Indian Short Movie is the premier digital cinema network engineered to showcase authentic regional narratives, celebrate festival laureates, and connect creators directly with passionate cinema audiences worldwide.
    </p>
  </section>

  <!-- Core Pillars -->
  <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 4rem;">
    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 2rem;">
      <div style="width: 48px; height: 48px; border-radius: 1rem; background: rgba(229, 9, 20, 0.15); color: #e50914; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Pan-Indian Cinema</h3>
      <p style="font-size: 0.85rem; color: #8e95a5; line-height: 1.6;">
        From Kannada Malnad folk narratives and Malayalam backwater mysteries to Hindi neo-noir and Tamil social commentaries, we celebrate cultural depth across 10+ languages.
      </p>
    </div>

    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 2rem;">
      <div style="width: 48px; height: 48px; border-radius: 1rem; background: rgba(102, 252, 241, 0.15); color: #66fcf1; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Cinema &amp; Mobile Reels</h3>
      <p style="font-size: 0.85rem; color: #8e95a5; line-height: 1.6;">
        Blending traditional wide-aspect 4K projection formats with fast-paced 9:16 mobile vertical short cinema, reaching cinephiles wherever they watch.
      </p>
    </div>

    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 2rem;">
      <div style="width: 48px; height: 48px; border-radius: 1rem; background: rgba(255, 183, 3, 0.15); color: #ffb703; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Filmmaker Empowerment</h3>
      <p style="font-size: 0.85rem; color: #8e95a5; line-height: 1.6;">
        Providing independent creators with festival curation, digital distribution, audience feedback analytics, and direct industry networking.
      </p>
    </div>
  </section>

  <!-- Executive Production Note -->
  <section style="background: linear-gradient(135deg, rgba(229,9,20,0.1), rgba(17,19,25,0.95)); border: 1px solid rgba(229,9,20,0.25); border-radius: 2rem; padding: 3rem 2rem; text-align: center;">
    <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.85rem; font-weight: 900; color: #ffffff; margin-bottom: 1rem;">
      Supporting Independent Visionaries
    </h2>
    <p style="font-size: 0.95rem; color: #d1d5db; max-width: 650px; margin: 0 auto 2rem; line-height: 1.7;">
      Founded with an unwavering dedication to cinematic craft, Indian Short Movie provides a trusted platform where storytelling takes precedence over big-budget constraints.
    </p>
    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <a href="discover.php" style="background: #e50914; color: #ffffff; font-weight: 800; font-size: 0.85rem; padding: 0.75rem 1.6rem; border-radius: 0.75rem; text-decoration: none;">
        Discover Films
      </a>
      <a href="contact.php" style="background: #181b24; color: #ffffff; font-weight: 700; font-size: 0.85rem; padding: 0.75rem 1.6rem; border-radius: 0.75rem; border: 1px solid #262a36; text-decoration: none;">
        Contact Team
      </a>
    </div>
  </section>
</main>

<?php
require_once __DIR__ . '/includes/footer.php';
?>
