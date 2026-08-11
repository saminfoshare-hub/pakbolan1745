PAK BOLAN INTERNATIONAL — Website Package
==========================================

WHAT'S IN THIS FOLDER
----------------------
- index.html       The full website (public site + admin dashboard, all in one file)
- robots.txt        For search engines (upload to your site's root when you deploy)
- sitemap.xml        For search engines (upload to your site's root when you deploy)
- README.txt         This file


HOW TO OPEN IT
---------------
Do NOT just double-click index.html. Opening a file directly (file://...) blocks
some browser features (like the live folder backup) for security reasons.

Instead, serve it locally:
1. Open a terminal/command prompt in this folder.
2. Run:  python -m http.server 8000   (Windows)   or   python3 -m http.server 8000   (Mac/Linux)
3. Open http://localhost:8000 in Chrome or Edge.

When you're ready to put this on the internet, upload index.html, robots.txt, and
sitemap.xml to any standard web host (the same way you'd upload any website).


ADMIN LOGIN (DEMO ONLY — see "Important Limitations" below)
--------------------------------------------------------------
Click "Admin" in the top navigation menu.
   Email:    admin@pakbolan.com
   Password: demo1234


DATA SAVING — WHAT WORKS NOW
------------------------------
Previously, all vacancies/applications/inquiries were only held in memory and
disappeared on every page reload. That's now fixed:

- Everything you add, edit, or delete (vacancies, applications, employer
  inquiries, countries, job categories) is automatically saved to your
  browser's local storage. It will still be there the next time you open the
  site in the SAME browser on the SAME computer.

- In the admin panel, go to "Data & Backup" to:
    * Download a full Excel workbook (.xlsx) with three sheets — Vacancies,
      Applications, Employer Inquiries — any time you want a snapshot.
    * Connect a "Live Backup Folder" (Chrome/Edge only) — pick a folder on
      your computer once, and the site will automatically keep three CSV
      files (vacancies.csv, applications.csv, employer_inquiries.csv) in
      that folder updated in real time, live, as data changes. You can open
      those CSV files in Excel any time to see the latest data.
    * Clear all saved data and restore the original sample vacancies.


IMPORTANT LIMITATIONS (please read before using this for real recruitment)
-----------------------------------------------------------------------------
This is a frontend-only prototype. There is no real server, database, or
email-sending service behind it. Specifically:

1. NOT SHARED ACROSS DEVICES/VISITORS
   Local storage is per-browser, per-device. If a candidate applies on their
   phone, that application will NOT appear in your admin dashboard on your
   laptop — they're different browsers. Only YOU, using the admin panel in
   the same browser where the public site runs, will see combined data.
   This means, as built, it does not work as a real multi-visitor website
   yet — every visitor effectively gets their own private copy of the data.

2. NO REAL EMAIL NOTIFICATIONS
   The site shows a "notification queued" message on submission, but no
   actual email is ever sent to almirahmed638@gmail.com. Real email sending
   requires a backend service (e.g. Resend, SendGrid) with credentials kept
   server-side — never safe to put directly in a browser-only page.

3. NO REAL SECURE LOGIN
   The admin login only checks a hardcoded demo password in the browser.
   Anyone who reads the page's source code can see it. Real security needs
   server-side authentication.

4. NO REAL FILE STORAGE
   Uploaded CV/CNIC/photo files are validated (type & size) but never
   actually stored anywhere — only their filenames are recorded.

5. THE LIVE BACKUP FOLDER FEATURE only works in Chrome/Edge on desktop, only
   while the browser tab stays open, and needs to be reconnected each time
   you reopen the site (browsers don't remember folder permissions across
   reloads for security reasons).


WHAT A REAL, LIVE VERSION OF THIS SITE NEEDS
-----------------------------------------------
To have a genuinely shared, always-on recruitment site — where a candidate's
application submitted on their phone shows up in your admin dashboard
immediately, real emails get sent, and data is properly secured — this needs
an actual backend: a real database (e.g. PostgreSQL/Supabase), server-side
authentication, and a server-side email service. That's a real, ongoing
software project, not something a single downloadable HTML file can do on
its own. If you want that built properly, Claude Code (developer.anthropic
tools) or a web developer can take this design and build the real backend
behind it.
