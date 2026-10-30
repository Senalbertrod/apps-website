# apps.senalbert.com

Senalbert's app website, served by GitHub Pages (CNAME apps.senalbert.com). Plain HTML: `index.html`, one folder per app (support pages), `assets/`. Footer has the QR Code trademark line. Always show new pictures before uploading them.

### Attendance (`/attendance`)
A hidden, standalone page (not on the menu, `noindex`, no links back to the main site). Used on iPhone in Safari, by Senalbert and friends; can be added to the Home Screen and opens full screen. One page, no mode switch, no Paste: Choose Pictures at the top (one or two Zoom poll pictures), and the votes list for choices 1 to 10 at the bottom can always be typed in or changed with − / +. Total = sum of (choice × votes), counting only people who answered. Shows each line and lets you tap a vote number to fix it. Text reading happens on the phone (nothing uploaded). No history; New Count / Clear resets. Icon: two people (white in front of light blue) on blue; dark and tinted versions too. iPhone web pages can only give one Home Screen icon, so iOS makes its own dark/tinted look (the dark file is used for the dark-mode tab icon). Android gets two more in the manifest: `icon-maskable-*` (people inside the 40% safe circle, for any icon shape) and `icon-monochrome-*` (white people on see-through, for themed icons). Everything is in `attendance/` (one `index.html`, `manifest.webmanifest`, `icons/`). Reading uses Tesseract.js 5.1.1 from jsDelivr. The reading tools start loading when the page opens.

**Speed and accuracy come first.** Senalbert's rule: if it's slow or gets numbers wrong, people won't use it. Aim for under 1 second per picture in iPhone Safari, and never show a green ✓ on a wrong total: when unsure, say "please check" instead.

How a picture is read:
1. **Find the poll by its bars** (`findBars`): the thin, evenly spaced bars under each choice, matched by their right end (a blue fill hides the left start). The photo is shrunk by halves first, to smooth away the monitor's pixel pattern. The bars are found at a slight turn on purpose, because at the exact tilt the monitor pattern can hide them. The exact tilt comes from the bars' slope. Each row gets its own left and right end, since an angled photo makes the poll a trapezoid.
2. **Three small reads** (`readByBars`): the lines above the first bar (the first row under "answered" is choice 1); all vote counts stacked into one picture (`0-9()/%` only); and all choice numbers stacked (digits only). Any count that doesn't read cleanly is read again on its own, larger. "How many answered" is the number most vote lines show (e.g. the 3 in "(1/3)"), not the header line. A count that can't be right (more votes than people) is fixed from its percent.
3. **Only a green ✓ when two clues agree** on which row is choice 1 (the "answered" line and the choice numbers). If they disagree, it says "please check that each choice number matches Zoom".
4. If no bars are found, or the reading isn't clean, it also tries the older way (`readOld`: cut out the gray window, read the right side) and keeps the cleaner result.

**Testing:** always in iPhone Safari (Xcode simulator: `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcrun simctl`, using the iPhone's ID, never `booted`, because an Apple Watch simulator may be running), since Mac browsers read some pictures differently. Senalbert brings photos from real meetings (in `~/Documents/Attendance`); every set becomes a test, with resized, tilted, low-quality and blurry copies too, and every change must pass all of them. The 2026-10-29 meeting set (IMG_0684–0691) should total 7, 7, 7, 7, 9, 63 and 63. The photos never go on the website.

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
