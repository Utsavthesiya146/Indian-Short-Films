<?php
/**
 * Indian Short Movie - Contact Page
 * Production-ready Pure PHP 8+ Page
 */
$page_title = 'Contact Us | Indian Short Movie';
$page_description = 'Get in touch with Indian Short Movie team for film distribution, creator submissions, sponsorships, and technical support.';
$current_page = 'contact';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';
?>

<main style="max-width: 1280px; margin: 0 auto; padding: 3rem 1.5rem; min-height: 80vh;">
  <!-- Contact Header -->
  <section style="text-align: center; max-width: 750px; margin: 0 auto 3rem auto;">
    <div style="display: inline-block; padding: 0.35rem 0.85rem; border-radius: 9999px; background: rgba(102, 252, 241, 0.15); border: 1px solid rgba(102, 252, 241, 0.3); color: #66fcf1; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem;">
      Get in Touch
    </div>
    <h1 style="font-family: 'Outfit', sans-serif; font-size: clamp(2.2rem, 5vw, 3.2rem); font-weight: 900; color: #ffffff; letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 1rem;">
      Connect With <span style="background: linear-gradient(135deg, #66fcf1, #ffb703); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Our Team</span>
    </h1>
    <p style="font-size: 1rem; color: #9ca3af; line-height: 1.6;">
      Whether you are a filmmaker seeking distribution, a festival programmer scouting talent, or a brand exploring cinematic sponsorships—we would love to hear from you.
    </p>
  </section>

  <!-- Contact Form & Info Cards -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; max-width: 1050px; margin: 0 auto;">
    
    <!-- Contact Info -->
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 2rem;">
        <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 1.25rem;">Reach Us Directly</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.85rem;">
          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="width: 40px; height: 40px; border-radius: 0.75rem; background: rgba(229, 9, 20, 0.15); color: #e50914; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: #ffffff;">Phone &amp; WhatsApp</div>
              <div style="color: #66fcf1; margin-top: 0.2rem;">+91 93418 73532</div>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="width: 40px; height: 40px; border-radius: 0.75rem; background: rgba(102, 252, 241, 0.15); color: #66fcf1; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: #ffffff;">Email Inquiries</div>
              <div style="color: #66fcf1; margin-top: 0.2rem;">contact@indianshortmovie.com</div>
              <div style="color: #8e95a5; font-size: 0.75rem; margin-top: 0.1rem;">Response within 24 business hours</div>
            </div>
          </div>

          <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="width: 40px; height: 40px; border-radius: 0.75rem; background: rgba(255, 183, 3, 0.15); color: #ffb703; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div style="font-weight: 700; color: #ffffff;">Creative Headquarters</div>
              <div style="color: #8e95a5; margin-top: 0.2rem; line-height: 1.5;">Bengaluru, Karnataka, India</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Submission CTA -->
      <div style="background: rgba(229, 9, 20, 0.1); border: 1px solid rgba(229, 9, 20, 0.25); border-radius: 1.5rem; padding: 1.75rem;">
        <h4 style="font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Have a Completed Short Film?</h4>
        <p style="font-size: 0.8rem; color: #8e95a5; margin-bottom: 1rem; line-height: 1.5;">Submit your screener link, synopsis, and crew details directly to our festival curation board.</p>
        <button onclick="openSubmitFilmModal()" style="width: 100%; background: #e50914; color: #ffffff; font-weight: 700; font-size: 0.8rem; padding: 0.65rem; border-radius: 0.75rem; border: none; cursor: pointer;">
          Submit Your Film Now
        </button>
      </div>
    </div>

    <!-- Contact Form -->
    <div style="background: #111319; border: 1px solid #262a36; border-radius: 1.5rem; padding: 2rem;">
      <h3 style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 0.5rem;">Send a Direct Message</h3>
      <p style="font-size: 0.8rem; color: #8e95a5; margin-bottom: 1.5rem;">Fill out the details below and our team will be in touch shortly.</p>

      <form onsubmit="handleContactMessage(event)" style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Full Name *</label>
          <input type="text" id="contact-full-name" required placeholder="Your Name" style="width: 100%; padding: 0.7rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Email Address *</label>
          <input type="email" id="contact-email" required placeholder="you@domain.com" style="width: 100%; padding: 0.7rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Inquiry Subject *</label>
          <select id="contact-subject" required style="width: 100%; padding: 0.7rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box;">
            <option value="Film Distribution">Film Distribution &amp; Streaming</option>
            <option value="Sponsorship">Brand Sponsorship &amp; Partnerships</option>
            <option value="Festival Submission">Festival Submission Support</option>
            <option value="Technical Support">Technical &amp; Account Support</option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.35rem;">Message *</label>
          <textarea id="contact-msg" required rows="4" placeholder="How can we help your film or organization?..." style="width: 100%; padding: 0.7rem 0.85rem; border-radius: 0.75rem; background: #181b24; border: 1px solid #262a36; color: #ffffff; font-size: 0.8rem; outline: none; box-sizing: border-box; resize: vertical;"></textarea>
        </div>

        <button type="submit" style="background: #25D366; color: #ffffff; font-weight: 700; font-size: 0.85rem; padding: 0.75rem; border-radius: 0.75rem; border: none; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem;" onmouseover="this.style.background='#1da851'" onmouseout="this.style.background='#25D366'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          Send via WhatsApp
        </button>
      </form>
    </div>

  </div>
</main>

<?php
$extra_js = '<script>
  function handleContactMessage(e) {
    e.preventDefault();
    const name = document.getElementById("contact-full-name")?.value || "";
    const email = document.getElementById("contact-email")?.value || "";
    const subject = document.getElementById("contact-subject")?.value || "";
    const msg = document.getElementById("contact-msg")?.value || "";
    
    const text = `Hello Team,\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${msg}`;
    const whatsappUrl = `https://wa.me/919945443044?text=${encodeURIComponent(text)}`;
    
    window.open(whatsappUrl, "_blank");
  }
</script>';

require_once __DIR__ . '/includes/footer.php';
?>
