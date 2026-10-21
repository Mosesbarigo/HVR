MARKHAM ROAD ACADEMY - INSTALLABLE APP (PWA)
=============================================

What you now have
-----------------
Your existing system is now an INSTALLABLE APP. When someone opens it in
Chrome / Edge / Safari on a phone or computer, they can add it to their
home screen and it opens full-screen like a real app - using your SCHOOL
LOGO as the app icon.

What is in this folder (keep the structure exactly as-is)
---------------------------------------------------------
  index.html                 <- your app (updated)
  manifest.webmanifest       <- app name + icon settings
  sw.js                      <- makes the app installable + works offline
  Images/                    <- your logo + all app-icon sizes
     logos.PNG
     icon-192.png
     icon-512.png
     icon-maskable-192.png
     icon-maskable-512.png
     apple-touch-icon.png
     favicon-32.png
     favicon-16.png

How to upload to your GitHub Page (step by step)
------------------------------------------------
1. Open your GitHub repository in your web browser.
2. Click "Add file" -> "Upload files".
3. Drag in ALL of these together, keeping the folder layout:
      - index.html
      - manifest.webmanifest
      - sw.js
      - the whole Images folder
   (Tip: you can drag the Images folder in as-is; GitHub keeps the folder.)
4. Scroll down and click "Commit changes".
5. Make sure GitHub Pages is turned on:
      Settings -> Pages -> Source: your main branch, folder: / (root) -> Save.
6. Wait about a minute, then open your Pages link, e.g.
      https://YOUR-USERNAME.github.io/YOUR-REPO/

How to install the app (share this with staff)
----------------------------------------------
- On Android / Chrome or Edge: open the page, tap the menu (three dots),
  then "Install app" / "Add to Home screen".
- On iPhone / Safari: open the page, tap the Share button, then
  "Add to Home Screen".
The school logo will appear as the app icon.

Important notes
---------------
- Installing only works over the internet link (https://...github.io/...),
  NOT by double-clicking the file on your computer.
- Your data still saves in the browser as before (and syncs to Firebase if
  you have set that up).
- If you already opened the old version, close all its tabs once after
  uploading so the new installable version takes over.
