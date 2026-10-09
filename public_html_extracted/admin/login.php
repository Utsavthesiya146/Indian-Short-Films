<?php
session_start();
$page_title = 'Admin Login | Indian Short Movie';
$base_url = '../';
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: index.php');
    exit;
}
require_once __DIR__ . '/../includes/header.php';
require_once __DIR__ . '/../includes/navbar.php';
?>

<!-- Admin Login Section -->
<style>
  .admin-login-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    background: #07080B;
    position: relative;
    overflow: hidden;
  }

  /* Subtle radial glow background */
  .admin-login-wrapper::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .admin-login-card {
    position: relative;
    width: 100%;
    max-width: 440px;
    background: #111319;
    border: 1px solid #262A36;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(229,9,20,0.08);
    animation: cardFadeIn 0.4s ease-out forwards;
  }

  @keyframes cardFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .admin-login-card .shield-icon {
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, rgba(229,9,20,0.18), rgba(229,9,20,0.05));
    border: 1px solid rgba(229,9,20,0.3);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }

  .admin-login-card h3 {
    font-family: 'Outfit', sans-serif;
    font-size: 1.6rem;
    font-weight: 900;
    color: #fff;
    margin: 0 0 0.4rem;
    letter-spacing: -0.5px;
  }

  .admin-login-card .subtitle {
    font-size: 0.82rem;
    color: #8E95A5;
    margin: 0 0 1.75rem;
  }

  .admin-login-divider {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #E50914, transparent);
    margin: 0.5rem auto 1.5rem;
    border-radius: 2px;
  }

  .admin-input-group {
    margin-bottom: 1.1rem;
  }

  .admin-input-group label {
    display: block;
    font-size: 0.78rem;
    font-weight: 600;
    color: #CBD5E0;
    margin-bottom: 0.45rem;
    letter-spacing: 0.3px;
  }

  .admin-input-group input {
    width: 100%;
    box-sizing: border-box;
    padding: 0.75rem 1rem;
    background: #181B24;
    border: 1px solid #262A36;
    border-radius: 12px;
    color: #fff;
    font-size: 0.875rem;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .admin-input-group input:focus {
    border-color: rgba(229,9,20,0.5);
    box-shadow: 0 0 0 3px rgba(229,9,20,0.1);
  }

  .admin-input-group input::placeholder {
    color: #4A5568;
  }

  #admin-login-btn {
    width: 100%;
    padding: 0.85rem;
    margin-top: 0.75rem;
    background: #E50914;
    color: #fff;
    font-family: 'Outfit', sans-serif;
    font-weight: 800;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 6px 20px rgba(229,9,20,0.35);
  }

  #admin-login-btn:hover:not(:disabled) {
    background: #FF1E27;
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(229,9,20,0.45);
  }

  #admin-login-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  #admin-login-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  #admin-login-error {
    display: none;
    padding: 0.65rem 1rem;
    background: rgba(229,9,20,0.08);
    border: 1px solid rgba(229,9,20,0.3);
    color: #FC8181;
    font-size: 0.78rem;
    border-radius: 10px;
    text-align: center;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  #admin-login-error.visible {
    display: block;
  }

  .admin-login-footer-note {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.72rem;
    color: #4A5568;
  }
</style>

<div class="admin-login-wrapper">
  <div class="admin-login-card">

    <!-- Icon -->
    <div class="shield-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E50914" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    </div>

    <!-- Heading -->
    <div class="text-center">
      <h3>Admin Portal Login</h3>
      <div class="admin-login-divider"></div>
      <p class="subtitle">Enter your admin credentials to access the dashboard.</p>
    </div>

    <!-- Error -->
    <div id="admin-login-error"></div>

    <!-- Form -->
    <form onsubmit="handleAdminLogin(event)">
      <div class="admin-input-group">
        <label for="admin-login-email">Admin Email</label>
        <input type="email" id="admin-login-email" placeholder="admin@example.com" required>
      </div>
      <div class="admin-input-group">
        <label for="admin-login-password">Admin Password</label>
        <input type="password" id="admin-login-password" placeholder="••••••••" required>
      </div>
      <button type="submit" id="admin-login-btn">Access Dashboard</button>
    </form>

    <!-- Footer Note -->
    <p class="admin-login-footer-note">Restricted access &mdash; Authorized personnel only</p>

  </div>
</div>

<script>
  async function handleAdminLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('admin-login-btn');
    const errDiv = document.getElementById('admin-login-error');
    const email = document.getElementById('admin-login-email').value;
    const password = document.getElementById('admin-login-password').value;

    btn.innerText = 'Verifying...';
    btn.disabled = true;
    errDiv.classList.remove('visible');

    try {
      const response = await fetch('../php/api_admin_login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });
      const data = await response.json();

      if (data.success) {
        btn.innerText = 'Redirecting...';
        window.location.href = 'index.php';
      } else {
        errDiv.innerText = data.error || 'Login failed. Please check your credentials.';
        errDiv.classList.add('visible');
      }
    } catch (err) {
      errDiv.innerText = 'Network error. Please try again.';
      errDiv.classList.add('visible');
    } finally {
      if (!window.location.href.includes('index.php')) {
        btn.innerText = 'Access Dashboard';
        btn.disabled = false;
      }
    }
  }
</script>

<?php require_once __DIR__ . '/../includes/footer.php'; ?>
