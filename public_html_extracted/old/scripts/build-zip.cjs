const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

function buildZip() {
  const rootDir = path.join(__dirname, '..');
  const zip = new AdmZip();

  console.log('Adding PHP project files to ZIP...');

  // Root PHP files
  const phpFiles = [
    'index.php',
    'discover.php',
    'watchlist.php',
    'filmmakers.php',
    'about.php',
    'contact.php',
    'gallery.php'
  ];

  phpFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath, '');
      console.log(`Added: ${file}`);
    }
  });

  // README
  const readmePath = path.join(rootDir, 'README-PHP.md');
  if (fs.existsSync(readmePath)) {
    zip.addLocalFile(readmePath, '', 'README.md');
    console.log('Added: README.md');
  }

  // includes/ folder
  const includesDir = path.join(rootDir, 'includes');
  if (fs.existsSync(includesDir)) {
    zip.addLocalFolder(includesDir, 'includes');
    console.log('Added folder: includes/');
  }

  // admin/ folder (only PHP and relevant files, excluding any dev leftovers)
  const adminFile = path.join(rootDir, 'admin', 'index.php');
  if (fs.existsSync(adminFile)) {
    zip.addLocalFile(adminFile, 'admin');
    console.log('Added: admin/index.php');
  }

  // css/ folder
  const cssDir = path.join(rootDir, 'css');
  if (fs.existsSync(cssDir)) {
    zip.addLocalFolder(cssDir, 'css');
    console.log('Added folder: css/');
  }

  // js/ folder
  const jsDir = path.join(rootDir, 'js');
  if (fs.existsSync(jsDir)) {
    zip.addLocalFolder(jsDir, 'js');
    console.log('Added folder: js/');
  }

  // assets/ folder
  const assetsDir = path.join(rootDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    zip.addLocalFolder(assetsDir, 'assets');
    console.log('Added folder: assets/');
  }

  // Specific root images
  const images = ['harri-kumar.jpg'];
  images.forEach(img => {
    let imgPath = path.join(rootDir, img);
    if (!fs.existsSync(imgPath)) {
      imgPath = path.join(rootDir, 'public', img);
    }
    if (fs.existsSync(imgPath)) {
      zip.addLocalFile(imgPath, '');
      console.log(`Added image: ${img}`);
    }
  });

  const rootZipPath = path.join(rootDir, 'indian-short-movie-php.zip');
  const publicZipPath = path.join(rootDir, 'public', 'indian-short-movie-php.zip');

  zip.writeZip(rootZipPath);
  console.log(`Successfully written: ${rootZipPath}`);

  // Also write to public folder for direct browser download
  zip.writeZip(publicZipPath);
  console.log(`Successfully written: ${publicZipPath}`);
}

buildZip();
