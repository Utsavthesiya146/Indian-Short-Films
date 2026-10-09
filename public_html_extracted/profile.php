<?php
/**
 * Indian Short Movie - User Profile
 */
$page_title = 'My Profile | Indian Short Movie';
$page_description = 'Manage your profile and submitted films.';
$current_page = 'profile';
$base_url = './';

require_once __DIR__ . '/includes/header.php';
require_once __DIR__ . '/includes/navbar.php';

// Check if logged in
if (!isset($_SESSION['user_id'])) {
    echo "<script>window.location.href='index.php';</script>";
    exit;
}

$user_email = $_SESSION['user_email'];
$username = explode('@', $user_email)[0];
$user_id = $_SESSION['user_id'];

$user_name = $username;
$user_bio = '';
$user_crew = '';
$user_avatar = '';

// Fetch real user data from database
require_once __DIR__ . '/php/db.php';

if (isset($pdo) && $pdo instanceof PDO) {
    try {
        // Ensure columns exist
        $pdo->exec("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL, ADD COLUMN IF NOT EXISTS crew_info VARCHAR(255) DEFAULT NULL, ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) DEFAULT NULL;");
        
        $stmt = $pdo->prepare("SELECT name, bio, crew_info, avatar_url FROM users WHERE id = ? OR email = ? LIMIT 1");
        $stmt->execute([$user_id, $user_email]);
        $user_data = $stmt->fetch();
        
        if ($user_data) {
            $user_name = $user_data['name'] ?: $username;
            $user_bio = $user_data['bio'] ?: '';
            $user_crew = $user_data['crew_info'] ?: '';
            $user_avatar = $user_data['avatar_url'] ?: '';
        }
        
        // Fetch user's submitted films (matching by email if possible, or we just fetch where director matches name)
        // Since film_submissions doesn't store user_id or email, we will fetch submissions where director matches the user's name or username
        $film_stmt = $pdo->prepare("SELECT title, director, language, status FROM film_submissions WHERE director = ? OR director = ? ORDER BY created_at DESC");
        $film_stmt->execute([$user_name, $username]);
        $user_films = $film_stmt->fetchAll();
        
    } catch (Exception $e) {
        $user_films = [];
    }
} else {
    $user_films = [];
}

// Calculate user film stats
$total_films = count($user_films);
$approved_films = 0;
$pending_films = 0;
foreach($user_films as $f) {
    $s = strtolower($f['status']);
    if ($s === 'published' || $s === 'approved') $approved_films++;
    elseif ($s === 'pending' || $s === '') $pending_films++;
}
?>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh]">
  <!-- Page Header -->
  <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h1 class="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
        Creator Dashboard
      </h1>
      <p class="text-xs sm:text-sm text-cinema-muted mt-1">
        Manage your filmmaker profile and track your film submissions
      </p>
    </div>
    <div class="flex items-center gap-3">
       <a href="javascript:void(0)" onclick="openSubmitFilmModal()" class="flex items-center gap-2 bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-cinema-accent/30 hover:scale-105">
         <i data-lucide="plus-circle" class="w-4 h-4"></i>
         <span>Submit New Film</span>
       </a>
    </div>
  </div>

  <!-- Metric Cards Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-cinema-gold/50 transition-colors shadow-lg shadow-black/20">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Total Submissions</span>
        <i data-lucide="film" class="w-5 h-5 text-cinema-gold"></i>
      </div>
      <div class="text-3xl font-black text-white font-display tracking-tight"><?php echo $total_films; ?></div>
    </div>
    
    <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-emerald-400/50 transition-colors shadow-lg shadow-black/20">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Approved Films</span>
        <i data-lucide="check-square" class="w-5 h-5 text-emerald-400"></i>
      </div>
      <div class="text-3xl font-black text-white font-display tracking-tight"><?php echo $approved_films; ?></div>
    </div>
    
    <div class="bg-cinema-card border border-cinema-border rounded-2xl p-5 hover:border-cinema-accent/50 transition-colors shadow-lg shadow-black/20">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-semibold text-cinema-muted uppercase tracking-wider">Pending Review</span>
        <i data-lucide="clock" class="w-5 h-5 text-cinema-accent"></i>
      </div>
      <div class="text-3xl font-black text-white font-display tracking-tight"><?php echo $pending_films; ?></div>
    </div>
  </div>

  <div class="flex flex-col lg:flex-row gap-8">
    
    <!-- Sidebar Profile -->
    <div class="w-full lg:w-1/3 space-y-6">
      <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 text-center shadow-xl shadow-black/30 relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-cinema-accent/20 to-cinema-teal/20 opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        <div class="relative z-10 w-24 h-24 rounded-full bg-cinema-surface border-2 border-cinema-accent mx-auto flex items-center justify-center mb-4 overflow-hidden shadow-lg shadow-cinema-accent/20">
            <?php if (!empty($user_avatar)): ?>
                <img src="<?php echo htmlspecialchars($user_avatar); ?>" alt="Avatar" class="w-full h-full object-cover">
            <?php else: ?>
                <i data-lucide="user" class="w-10 h-10 text-cinema-muted"></i>
            <?php endif; ?>
        </div>
        <h2 class="relative z-10 text-xl font-black font-display tracking-tight text-white"><?php echo htmlspecialchars($user_name); ?></h2>
        <p class="relative z-10 text-sm text-cinema-teal font-medium mt-1"><?php echo htmlspecialchars($user_email); ?></p>
        
        <div class="mt-6 relative z-10">
            <input type="file" id="avatar-input" accept="image/*" class="hidden" onchange="uploadAvatar(event)">
            <button onclick="document.getElementById('avatar-input').click()" class="w-full bg-cinema-surface hover:bg-cinema-border text-white text-sm font-bold py-2.5 rounded-xl transition-all border border-cinema-border shadow-sm flex items-center justify-center gap-2">
                <i data-lucide="camera" class="w-4 h-4"></i> Edit Avatar
            </button>
            <div id="avatar-msg" class="hidden mt-2 text-xs font-bold text-center"></div>
        </div>
      </div>
      
      <!-- Account Info Widget -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
        <h3 class="font-display font-bold text-lg text-white mb-4 flex items-center gap-2 border-b border-cinema-border pb-3">
          <i data-lucide="shield" class="w-5 h-5 text-purple-400"></i> Account Status
        </h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center text-sm">
             <span class="text-cinema-muted">Role</span>
             <span class="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase">Creator</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="w-full lg:w-2/3 space-y-6">
      
      <!-- Profile Information Form -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-cinema-border">
          <h3 class="font-display font-bold text-lg text-white flex items-center gap-2">
             <i data-lucide="settings" class="w-5 h-5 text-gray-400"></i> Profile Settings
          </h3>
          <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-surface text-cinema-muted px-2.5 py-1 rounded-md border border-cinema-border">Public Data</span>
        </div>
        
        <form id="profile-form" onsubmit="handleProfileUpdate(event)" class="space-y-5">
            <div id="profile-msg" class="hidden p-3 rounded-xl text-sm font-bold text-center mb-4 border"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                    <input type="text" id="prof-name" value="<?php echo htmlspecialchars($user_name); ?>" required class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all shadow-inner">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Email Address (Read Only)</label>
                    <input type="email" value="<?php echo htmlspecialchars($user_email); ?>" readonly class="w-full px-4 py-3 rounded-xl bg-black/40 border border-cinema-border/50 text-gray-500 text-sm outline-none cursor-not-allowed">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Bio / About Me</label>
                <textarea id="prof-bio" rows="3" placeholder="Tell us about yourself..." class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all resize-y shadow-inner"><?php echo htmlspecialchars($user_bio); ?></textarea>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Crew / Production Company Info</label>
                <input type="text" id="prof-crew" value="<?php echo htmlspecialchars($user_crew); ?>" placeholder="e.g. DreamWorld Productions" class="w-full px-4 py-3 rounded-xl bg-cinema-surface border border-cinema-border text-white text-sm outline-none focus:border-cinema-accent/50 focus:ring-1 focus:ring-cinema-accent/50 transition-all shadow-inner">
            </div>
            <div class="pt-2 flex justify-end">
                <button type="submit" id="prof-submit-btn" class="bg-cinema-accent hover:bg-cinema-accentHover text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-cinema-accent/20 flex items-center gap-2 hover:scale-105">
                    <i data-lucide="save" class="w-4 h-4"></i> Save Changes
                </button>
            </div>
        </form>
      </div>

      <!-- My Uploaded Films -->
      <div class="bg-cinema-card border border-cinema-border rounded-2xl p-6 shadow-xl shadow-black/30">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-cinema-border">
          <h3 class="font-display font-bold text-lg text-white flex items-center gap-2">
             <i data-lucide="video" class="w-5 h-5 text-cinema-teal"></i> My Uploaded Films
          </h3>
          <span class="text-[10px] font-bold tracking-wider uppercase bg-cinema-surface text-cinema-muted px-2.5 py-1 rounded-md border border-cinema-border">Submission Status</span>
        </div>
        
        <?php if (empty($user_films)): ?>
            <div class="text-center py-8">
                <div class="w-16 h-16 bg-cinema-surface border border-cinema-border rounded-full flex items-center justify-center mx-auto mb-4">
                  <i data-lucide="film" class="w-8 h-8 text-cinema-muted"></i>
                </div>
                <h4 class="text-white font-bold mb-1">No Films Submitted Yet</h4>
                <p class="text-sm text-cinema-muted mb-4">You have not submitted any films for review.</p>
                <a href="javascript:void(0)" onclick="openSubmitFilmModal()" class="inline-flex items-center gap-2 bg-cinema-surface hover:bg-cinema-border text-white text-sm font-bold py-2 px-4 rounded-xl transition-all border border-cinema-border">
                    Submit Your First Film
                </a>
            </div>
        <?php else: ?>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr class="bg-cinema-surface/50 border-b border-cinema-border text-[11px] uppercase tracking-wider text-cinema-muted font-bold">
                    <th class="px-4 py-3">Title</th>
                    <th class="px-4 py-3">Director</th>
                    <th class="px-4 py-3">Language</th>
                    <th class="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-cinema-border/50">
                <?php foreach ($user_films as $film): ?>
                  <tr class="hover:bg-cinema-surface/50 transition-colors group">
                    <td class="px-4 py-3 font-bold text-white group-hover:text-cinema-teal transition-colors"><?php echo htmlspecialchars($film['title']); ?></td>
                    <td class="px-4 py-3 text-gray-300"><?php echo htmlspecialchars($film['director']); ?></td>
                    <td class="px-4 py-3 text-cinema-muted"><?php echo htmlspecialchars($film['language']); ?></td>
                    <td class="px-4 py-3">
                        <?php if (strtolower($film['status']) === 'published' || strtolower($film['status']) === 'approved'): ?>
                            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Published
                            </span>
                        <?php elseif (strtolower($film['status']) === 'rejected'): ?>
                            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Rejected
                            </span>
                        <?php else: ?>
                            <span class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Pending
                            </span>
                        <?php endif; ?>
                    </td>
                  </tr>
                <?php endforeach; ?>
                </tbody>
              </table>
            </div>
        <?php endif; ?>
      </div>
      
    </div>
  </div>
</main>

<script>
async function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const msg = document.getElementById('avatar-msg');
    const btn = e.target.nextElementSibling; // the button
    const ogHtml = btn.innerHTML;
    
    msg.classList.add('hidden');
    btn.disabled = true;
    btn.innerHTML = 'Uploading...';
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
        const res = await fetch('<?php echo $base_url; ?>php/api_update_avatar.php', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        msg.classList.remove('hidden', 'text-rose-400');
        
        if (data.success) {
            msg.classList.add('text-green-400');
            msg.textContent = 'Avatar updated!';
            setTimeout(() => window.location.reload(), 1000);
        } else {
            msg.classList.add('text-rose-400');
            msg.textContent = data.error || 'Upload failed.';
        }
    } catch (err) {
        msg.classList.remove('hidden', 'text-green-400');
        msg.classList.add('text-rose-400');
        msg.textContent = 'Network error.';
    } finally {
        btn.disabled = false;
        btn.innerHTML = ogHtml;
    }
}

async function handleProfileUpdate(e) {
    e.preventDefault();
    const btn = document.getElementById('prof-submit-btn');
    const msg = document.getElementById('profile-msg');
    
    const name = document.getElementById('prof-name').value;
    const bio = document.getElementById('prof-bio').value;
    const crew = document.getElementById('prof-crew').value;
    
    btn.disabled = true;
    btn.innerHTML = 'Saving...';
    msg.classList.add('hidden');
    
    try {
        const res = await fetch('<?php echo $base_url; ?>php/api_update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, bio, crew })
        });
        const data = await res.json();
        
        msg.classList.remove('hidden', 'bg-rose-500/20', 'text-rose-400');
        
        if (data.success) {
            msg.classList.add('bg-green-500/20', 'text-green-400');
            msg.textContent = 'Profile updated successfully!';
            
            // Reload page after 1.5s to show updated name
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            msg.classList.add('bg-rose-500/20', 'text-rose-400');
            msg.textContent = data.error || 'Failed to update profile.';
        }
    } catch (err) {
        msg.classList.remove('hidden', 'bg-green-500/20', 'text-green-400');
        msg.classList.add('bg-rose-500/20', 'text-rose-400');
        msg.textContent = 'A network error occurred. Please try again.';
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Save Changes';
    }
}
</script>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
