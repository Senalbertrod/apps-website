# apps.senalbert.com

Senalbert's app website, served by GitHub Pages (CNAME apps.senalbert.com). Plain HTML: `index.html`, one folder per app (support pages), `assets/`. Footer has the QR Code trademark line. Always show new pictures before uploading them.

**Changed a picture? Give it a new file name.** Browsers (especially on iPhone) keep showing their saved copy of a picture with the same name, so a replaced picture never keeps its old name: add or raise a `-vN` (e.g. `lcd-date-icon-v2.png`, `lcd-date-shot-v5.jpg`) and update every page that uses it, English and Spanish.

**English and Spanish.** Every page has a Spanish copy at the same path under `es/` (e.g. `watchtamer/support/` and `es/watchtamer/support/`). The header has "Apps" on the left and, across from it, a globe with the other language's name ("Español" on English pages, "English" on Spanish ones), linking to the same page in the other language. Each page also lists both versions with `hreflang` links. There's no automatic language switching. `404.html` is one page with both languages. Whenever an English page changes, change its Spanish copy in the same step, and the other way around. Spanish is plain and neutral (for any Spanish speaker in the US), uses "tú", and Apple's US Spanish words (carátula, complicaciones, Configuración, Movimiento y actividad física). App names and the apps' own button names (Settings, My Codes, Save…) stay in English, since that's what the apps show. Attendance has no Spanish version yet (Senalbert will say if it needs one). When `assets/style.css` changes, update `style.css?v=` on every page to the first 8 characters of its md5.

### Attendance (`/attendance`)
A hidden, standalone page (not on the menu, `noindex`, no links back to the main site). Used on iPhone in Safari, by Senalbert and friends; can be added to the Home Screen and opens full screen. One page, no mode switch, no Paste: Choose Pictures at the top (one or two Zoom poll pictures), and the votes list for choices 1 to 10 at the bottom can always be typed in or changed with − / +. Total = sum of (choice × votes), counting only people who answered. Shows each line and lets you tap a vote number to fix it. Text reading happens on the phone (nothing uploaded). No history; New Count / Clear resets. Icon: two people (white in front of light blue) on blue; dark and tinted versions too. iPhone web pages can only give one Home Screen icon, so iOS makes its own dark/tinted look (the dark file is used for the dark-mode tab icon). Android gets two more in the manifest: `icon-maskable-*` (people inside the 40% safe circle, for any icon shape) and `icon-monochrome-*` (white people on see-through, for themed icons). Everything is in `attendance/` (one `index.html`, `manifest.webmanifest`, `icons/`). Reading uses Tesseract.js 5.1.1 from jsDelivr. The reading tools start loading when the page opens.

**Speed and accuracy come first.** Senalbert's rule: if it's slow or gets numbers wrong, people won't use it. Aim for under 1 second per picture in iPhone Safari, and never show a green ✓ on a wrong total: when unsure, say "please check" instead.

How a picture is read:
1. **Find the poll by its bars** (`findBars`): the thin, evenly spaced bars under each choice, matched by their right end (a blue fill hides the left start). The photo is shrunk by halves first, to smooth away the monitor's pixel pattern. The bars are found at a slight turn on purpose, because at the exact tilt the monitor pattern can hide them. The exact tilt comes from the bars' slope. Each row gets its own left and right end, since an angled photo makes the poll a trapezoid.
2. **Three small reads** (`readByBars`): the lines above the first bar (the first row under "answered" is choice 1); all vote counts stacked into one picture (`0-9()/%` only); and all choice numbers stacked (digits only). Any count that doesn't read cleanly is read again on its own, larger. "How many answered" is the number most vote lines show (e.g. the 3 in "(1/3)"), not the header line. A count that can't be right (more votes than people) is fixed from its percent.
3. **Only a green ✓ when two clues agree** on which row is choice 1 (the "answered" line and the choice numbers). If they disagree, it says "please check that each choice number matches Zoom".
4. If no bars are found, or the reading isn't clean, it also tries the older way (`readOld`: cut out the gray window, read the right side) and keeps the cleaner result.

**Any monitor, not just one.** The Kingdom Hall monitor is used most, but the page must work on any monitor (home, friends, other Kingdom Halls). Rely on what every Zoom poll has (bars, "(1/3) 33%" lines, the "answered" line), never on one monitor's look. A fix goes in only if it passes every photo set.

**Testing:** always in iPhone Safari (Xcode simulator: `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcrun simctl`, using the iPhone's ID, never `booted`, because an Apple Watch simulator may be running), since Mac browsers read some pictures differently. Senalbert's meeting photos are in `~/Documents/Attendance`, and the tests live next to them in `~/Documents/Attendance/tests` (never on the website): run `start-tests.sh`, then open `http://127.0.0.1:8765/test/run.html` in the simulator's Safari. `run.html` lists every photo with the total it should show, plus the first test photo (`votes.jpg`, total 11), and also tries resized, tilted, low-quality and blurry copies. Every change must pass them all. To add a new set, put the photos in `~/Documents/Attendance` and add them with their totals to `run.html`. Sets so far:
- Kingdom Hall, 2026-10-29: IMG_0684–0691 total 7, 7, 7, 7, 9, 63, 63.
- Home monitor, 2026-11-01: IMG_0768 114 and IMG_0770 121 (complete polls); scrolled pairs 0771+0772 = 131, 0773+0774 = 133, 0775+0776 = 133, 0777+0778 = 135.
- Known miss: IMG_0685 tilted an extra 2° loses 1 vote, but says "1 vote is missing" rather than showing a wrong total.

### Limpieza del Salón (`/limpieza`)
A hidden TV page for the Kingdom Hall (not on any menu, no links to or from the site, `noindex, nofollow, noarchive`), shown on a Windows computer (Edge or Chrome) on a 16:9 TV. All text in Spanish. It shows which group cleans the hall this week. Build materials (drawings, samples, the drawing script and `PLAN.md`) are in `Limpieza-para-Claude-Code/`, which is in `.gitignore` and must never be uploaded.
- **Rotation:** the week of Monday 2026-11-02 is Grupo 5, then 6, 1, 2… every Monday (counted by calendar days, so daylight saving time can't shift it). Groups: 1 Naranjo (yellow), 2 Leonardo (orange), 3 Vasquez (green), 4 Diaz (purple), 5 Imbert (blue), 6 Arias (red).
- **Weeks with no meeting** (conventions) are listed in `limpieza/sin-reunion.js` (the Monday of each week). Those weeks show "Esta semana no hay reunión" on a neutral background and don't use up a group. The file is always loaded fresh, and re-read every hour.
- **Screen:** a 1920 × 1080 stage scaled to fit. Back to front: the group's drawing (`grupoN-fondo-vX.svg`, from `arte/`), the bubbles and sparkles (CSS animation, so the graphics chip does the work), then the words (an SVG text layer placed exactly like the drawing script). The date is the computer's own date in Spanish, e.g. "Jueves 5 de noviembre", and it changes by itself at midnight and on Monday. `?fecha=YYYY-MM-DD` previews any day.
- **TV use:** double-click toggles full screen (Esc also leaves); a hint shows for a few seconds; the pointer hides when still; Screen Wake Lock keeps the screen on; no group switch, no local storage, no cookies.
- **Updates:** every file name has a version (`limpieza-v1.js`, `grupo3-fondo-v1.svg`…). On any change, raise the number in every file name, in `index.html`, in `VERSION` in the script, and in `sw.js` (its `VERSION` and file list). `sw.js` always tries the network first and uses its saved copy only when offline. The page checks for a new version every hour and reloads by itself, but only when it's not in full screen.
- **Testing:** the schedule cases in `PLAN.md` (checked with `window.limpieza.whoCleans`), and full-size pictures at 1920 × 1080 compared with `muestras/`.

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
