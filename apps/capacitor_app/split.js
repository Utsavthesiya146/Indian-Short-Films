const fs = require('fs');
const path = require('path');
const jsDir = path.join('public', 'js');
const cssDir = path.join('public', 'css');

if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });

const html = fs.readFileSync('public/index.html', 'utf8');
const cssMatch = html.match(/<style>(.*?)<\/style>/s);
const jsMatch = html.match(/<script>(.*?)<\/script>/s);

let newHtml = html;

if(cssMatch) {
    fs.writeFileSync(path.join(cssDir, 'app.css'), cssMatch[1]);
    newHtml = newHtml.replace(/<style>.*?<\/style>/s, '<link rel="stylesheet" href="css/app.css">');
}

if(jsMatch) {
    fs.writeFileSync(path.join(jsDir, 'app.js'), jsMatch[1]);
    newHtml = newHtml.replace(/<script>.*?<\/script>/s, '<script src="js/app.js"></script>');
}

fs.writeFileSync('public/index.html', newHtml);
console.log("Successfully split index.html");
