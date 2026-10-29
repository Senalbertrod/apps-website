# apps.senalbert.com

Senalbert's app website, served by GitHub Pages (CNAME apps.senalbert.com). Plain HTML: `index.html`, one folder per app (support pages), `assets/`. Footer has the QR Code trademark line. Always show new pictures before uploading them.

### Attendance (`/attendance`)
A hidden, standalone page (not on the menu, `noindex`, no links back to the main site). Used on iPhone in Safari, by Senalbert and friends; can be added to the Home Screen and opens full screen. One page, no mode switch, no Paste: Choose Pictures at the top (one or two Zoom poll pictures), and the votes list for choices 1 to 10 at the bottom can always be typed in or changed with − / +. Total = sum of (choice × votes), counting only people who answered. Shows each line and lets you tap a vote number to fix it. Text reading happens on the phone (nothing uploaded). No history; New Count / Clear resets. Icon: two people (white in front of light blue) on blue; dark and tinted versions too. iPhone web pages can only give one Home Screen icon, so iOS makes its own dark/tinted look (the dark file is used for the dark-mode tab icon). Android gets two more in the manifest: `icon-maskable-*` (people inside the 40% safe circle, for any icon shape) and `icon-monochrome-*` (white people on see-through, for themed icons). Everything is in `attendance/` (one `index.html`, `manifest.webmanifest`, `icons/`). Reading uses Tesseract.js 5.1.1 from jsDelivr. The reading tools start loading when the page opens. Reading is a few small reads: (1) the vote counts from the right part of the poll, only `0-9()/%` allowed, using the percent to fix misread slashes; (2) any line skipped in the middle, read again on its own; (3) all choice numbers at once, each row's spot cut out, made black and white and stacked, digits only; (4) only if still unsure, the "answered" line (first row under it is choice 1). If it isn't clean, it straightens ±1.5° and keeps the best. Tested in iPhone Safari (Xcode simulator, `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcrun simctl`), since Mac browsers read some pictures differently. Then it checks the votes it found against "N of N participated" and says if any are missing.

## How Senalbert likes to work

1. Use plain English. When asked, explain step by step. If he says "don't put it in a chart", don't use charts or tables.
2. "Don't do nothing until I tell you" means wait: don't change, build, commit, push or upload anything until he says go.
3. Show pictures before uploading them to the website.
4. Say "iPhone", "iPad" or "Apple Watch", whichever is right, not just "device".
5. Ask before anything that can't be undone.

## Senalbert's projects

- App Store apps (release around November 1): WatchTamer, LCD Date, PM & DST, Make Forever QR Codes.
- Downloader: personal use only, never on the App Store.
- Website: apps.senalbert.com (repo apps-website); app support pages live there.
- On hold: Lighthouse Island, Lost Signal: Unit 117. Cancelled: Volt Pair (don't touch it).
- Next up, in order: (1) Attendance web page, (2) sign all four apps and Downloader with the paid developer team so Xcode installs last a year, (3) first App Store upload, step by step.
