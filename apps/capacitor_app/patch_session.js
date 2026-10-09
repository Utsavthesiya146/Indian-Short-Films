const fs = require('fs');
const path = require('path');
const files = ['api_login.php', 'api_register.php', 'api_check_session.php', 'api_get_profile.php', 'api_get_watchlist.php', 'api_add_watchlist.php', 'logout.php'];
const dir = path.join('D:\\\\Indian Short Films\\\\public_html_extracted\\\\php');

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/if\s*\\(\\s*session_status\\(\\)\\s*===\\s*PHP_SESSION_NONE\\s*\\)\\s*\\{\\s*session_start\\(\\);\\s*\\}/g, \"require_once __DIR__ . '/cors.php';\");
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
  } else {
    console.log('File not found: ' + file);
  }
});
