<?php
session_start();
$page_title = 'Promotor Login | Indian Short Movie';
$base_url   = '../';

require_once __DIR__ . '/../php/db.php';

// Ensure Promotor has correct credentials
try {
    $hash = password_hash('Indiansmartmov@123', PASSWORD_BCRYPT);
    $cnt = $pdo->query("SELECT COUNT(*) FROM promotors")->fetchColumn();
    if ((int)$cnt === 0) {
        $pdo->exec("INSERT INTO promotors (name, email, password_hash, company) VALUES ('Promotor', 'info@jobhunterr.com', '$hash', 'Indian Short Films')");
    } else {
        $pdo->exec("UPDATE `promotors` SET `name` = 'Promotor', `email` = 'info@jobhunterr.com', `password_hash` = '$hash' LIMIT 1");
    }

    if (isset($_SESSION['promotor_email']) && $_SESSION['promotor_email'] === 'promotor@example.com') {
        $_SESSION['promotor_logged_in'] = false;
        session_destroy();
    }
} catch (Exception $e) {}

if (isset($_SESSION['promotor_logged_in']) && $_SESSION['promotor_logged_in'] === true) {
    header('Location: index.php');
    exit;
}
require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
?>

<style>
  .promo-login-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    background: #07080B;
    position: relative;
    overflow: hidden;
  }

  /* Red radial glow */
  .promo-login-wrapper::before {
    content: '';
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(ellipse, rgba(229,9,20,0.07) 0%, transparent 65%);
    pointer-events: none;
  }
  .promo-login-wrapper::after {
    content: '';
    position: absolute;
    bottom: -80px;
    right: -80px;
    width: 380px;
    height: 380px;
    background: radial-gradient(circle, rgba(229,9,20,0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .promo-login-card {
    position: relative;
    width: 100%;
    max-width: 460px;
    background: linear-gradient(145deg, #13151E, #0F1118);
    border: 1px solid rgba(229,9,20,0.18);
    border-radius: 24px;
    padding: 2.75rem 2.25rem;
    box-shadow:
      0 30px 70px rgba(0,0,0,0.65),
      0 0 0 1px rgba(229,9,20,0.06),
      inset 0 1px 0 rgba(255,255,255,0.04);
    animation: promoCardIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards;
  }

  @keyframes promoCardIn {
    from { opacity: 0; transform: translateY(28px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)  scale(1); }
  }

  /* Megaphone icon badge */
  .promo-icon-badge {
    width: 62px;
    height: 62px;
    background: linear-gradient(135deg, rgba(229,9,20,0.2), rgba(229,9,20,0.06));
    border: 1px solid rgba(229,9,20,0.35);
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.35rem;
    box-shadow: 0 8px 24px rgba(229,9,20,0.15);
    animation: iconPulse 3s ease-in-out infinite;
  }

  @keyframes iconPulse {
    0%, 100% { box-shadow: 0 8px 24px rgba(229,9,20,0.15); }
    50%       { box-shadow: 0 8px 32px rgba(229,9,20,0.30); }
  }

  .promo-login-card h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.7rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.4rem;
    letter-spacing: -0.5px;
  }

  .promo-subtitle {
    font-size: 0.82rem;
    color: #8E95A5;
    margin: 0 0 1.8rem;
    line-height: 1.5;
  }

  .promo-divider {
    width: 44px;
    height: 2px;
    background: linear-gradient(90deg, #E50914, rgba(229,9,20,0.15));
    margin: 0.5rem auto 1.5rem;
    border-radius: 2px;
  }

  /* Role pill */
  .promo-role-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(229,9,20,0.1);
    border: 1px solid rgba(229,9,20,0.25);
    color: #E50914;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 50px;
    margin-bottom: 1rem;
  }

  .promo-input-group {
    margin-bottom: 1.15rem;
  }

  .promo-input-group label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #CBD5E0;
    margin-bottom: 0.45rem;
    letter-spacing: 0.3px;
  }

  .promo-input-group .input-wrap {
    position: relative;
  }

  .promo-input-group .input-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.4;
  }

  .promo-input-group input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.78rem 1rem 0.78rem 2.75rem;
    background: #181B24;
    border: 1px solid #262A36;
    border-radius: 13px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .promo-input-group input:focus {
    background: #1C1F2A;
    border-color: rgba(229,9,20,0.5);
    box-shadow: 0 0 0 3px rgba(229,9,20,0.1);
  }

  .promo-input-group input::placeholder { color: #3A3F50; }

  #promo-login-btn {
    width: 100%;
    padding: 0.9rem;
    margin-top: 0.85rem;
    background: #E50914;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 900;
    font-size: 0.92rem;
    letter-spacing: 0.4px;
    border: none;
    border-radius: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 8px 24px rgba(229,9,20,0.35);
    position: relative;
    overflow: hidden;
  }

  #promo-login-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  #promo-login-btn:hover:not(:disabled)::before { opacity: 1; }

  #promo-login-btn:hover:not(:disabled) {
    background: #FF1E27;
    transform: translateY(-2px);
    box-shadow: 0 14px 32px rgba(229,9,20,0.45);
  }

  #promo-login-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 6px 16px rgba(229,9,20,0.3);
  }

  #promo-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  #promo-login-error {
    display: none;
    padding: 0.7rem 1rem;
    background: rgba(229,9,20,0.08);
    border: 1px solid rgba(229,9,20,0.3);
    color: #FC8181;
    font-size: 0.78rem;
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    margin-bottom: 1rem;
  }
  #promo-login-error.visible { display: block; }

  .promo-login-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.72rem;
    color: #4A5568;
    line-height: 1.6;
  }

  .promo-login-footer a {
    color: #E50914;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
  }
  .promo-login-footer a:hover { color: #FF1E27; }

  /* Feature hints */
  .promo-features {
    margin-top: 1.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .promo-feat-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.71rem;
    color: #6B7280;
    font-weight: 500;
  }
</style>

<div class="promo-login-wrapper">
  <div class="promo-login-card">

    <!-- Role Badge -->
    <div class="text-center">
      <span class="promo-role-pill">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
        Promotor Portal
      </span>
    </div>

    <!-- Megaphone Icon -->
    <div class="promo-icon-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
           stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z"/>
      </svg>
    </div>

    <!-- Heading -->
    <div class="text-center">
      <h2>Promotor Login</h2>
      <div class="promo-divider"></div>
      <p class="promo-subtitle">Access your promotor dashboard to submit &amp; track your films.</p>
    </div>

    <!-- Error -->
    <div id="promo-login-error"></div>

    <!-- Form -->
    <form onsubmit="handlePromotorLogin(event)" autocomplete="on">
      <div class="promo-input-group">
        <label for="promo-email">Promotor Email</label>
        <div class="input-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <input type="email" id="promo-email" name="email" placeholder="info@jobhunterr.com" required autocomplete="email">
        </div>
      </div>

      <div class="promo-input-group">
        <label for="promo-password">Password</label>
        <div class="input-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <input type="password" id="promo-password" name="password" placeholder="••••••••" required autocomplete="current-password">
        </div>
      </div>

      <button type="submit" id="promo-login-btn">
        Enter Promotor Dashboard
      </button>
    </form>

    <!-- Footer -->
    <div class="promo-login-footer">
      <p>Don't have an account? <a href="../contact.php">Contact Admin</a></p>
    </div>

    <!-- Features -->
    <div class="promo-features">
      <span class="promo-feat-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="#E50914" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
        Submit Films
      </span>
      <span class="promo-feat-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="#66FCF1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6"  y1="20" x2="6"  y2="14"/>
        </svg>
        Track Stats
      </span>
      <span class="promo-feat-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
             stroke="#A78BFA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        Real-time Status
      </span>
    </div>

  </div>
</div>

<script>
async function handlePromotorLogin(e) {
  e.preventDefault();
  const btn    = document.getElementById('promo-login-btn');
  const errDiv = document.getElementById('promo-login-error');
  const email  = document.getElementById('promo-email').value.trim();
  const pass   = document.getElementById('promo-password').value;

  btn.innerText = 'Verifying...';
  btn.disabled  = true;
  errDiv.classList.remove('visible');

  try {
    const res  = await fetch('../php/api_promotor_login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();

    if (data.success) {
      btn.innerText = '✓ Welcome, ' + data.name + '! Redirecting...';
      setTimeout(() => { window.location.href = 'index.php'; }, 600);
    } else {
      errDiv.innerText = data.error || 'Login failed. Please check your credentials.';
      errDiv.classList.add('visible');
      btn.innerText = 'Enter Promotor Dashboard';
      btn.disabled  = false;
    }
  } catch (err) {
    errDiv.innerText = 'Network error. Please try again.';
    errDiv.classList.add('visible');
    btn.innerText = 'Enter Promotor Dashboard';
    btn.disabled  = false;
  }
}
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
