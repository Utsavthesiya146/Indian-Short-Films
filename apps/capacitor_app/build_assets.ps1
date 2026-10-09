npm i -D @capacitor/assets
New-Item -ItemType Directory -Force -Path "assets"
Copy-Item -Path "..\..\public_html_extracted\indianshortmovies.png" -Destination "assets\icon.png" -Force
Copy-Item -Path "..\..\public_html_extracted\indianshortmovies.png" -Destination "assets\splash.png" -Force
npx capacitor-assets generate --android --ios
npx cap sync
