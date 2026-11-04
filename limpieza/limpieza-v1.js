// Limpieza del Salón: shows which group cleans the Kingdom Hall this week.
(function () {
  // Raise this, and the -v number in every file name, on every change.
  var VERSION = 1;

  // ---------- The groups ----------

  // The week of Monday, November 2, 2026 is Grupo 5. Then 6, 1, 2 … every Monday.
  var START_MONDAY = dayNumber(2026, 11, 2);
  var START_GROUP = 5;

  var GROUPS = {
    1: { apellido: 'Naranjo',  light: '#ffd447', dark: '#c98a00', deep: '#8a5c00', pilltxt: '#3a2600', date: '#6a5a2e', bgt: '#fde7a1', bgm: '#fff4cf' },
    2: { apellido: 'Leonardo', light: '#ffa451', dark: '#c45d0c', deep: '#7a3500', pilltxt: '#ffffff', date: '#7a5a40', bgt: '#fdd3b0', bgm: '#fff1e5' },
    3: { apellido: 'Vasquez',  light: '#5fd394', dark: '#1f7d4a', deep: '#0f4d2c', pilltxt: '#ffffff', date: '#3f6a52', bgt: '#c6ecd6', bgm: '#eefaf3' },
    4: { apellido: 'Diaz',     light: '#a785e6', dark: '#5a3a99', deep: '#36206b', pilltxt: '#ffffff', date: '#5d4f7a', bgt: '#dccff3', bgm: '#f5f0fd' },
    5: { apellido: 'Imbert',   light: '#67b6f5', dark: '#1f68ad', deep: '#0f3f70', pilltxt: '#ffffff', date: '#44607d', bgt: '#c9e3fa', bgm: '#eef6fe' },
    6: { apellido: 'Arias',    light: '#f57a70', dark: '#b02e24', deep: '#6e1510', pilltxt: '#ffffff', date: '#7a4a46', bgt: '#f8cdc9', bgm: '#fdeeed' }
  };
  // Soft neutral colors for a week with no meeting.
  var NEUTRAL = { deep: '#4a5a70', date: '#56657a', bgt: '#dde5ee', bgm: '#f3f6f9' };

  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
               'septiembre', 'octubre', 'noviembre', 'diciembre'];

  // A calendar day as a whole number (days since 1970), from the date alone,
  // so daylight saving time changes can never shift it.
  function dayNumber(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 86400000); }

  function noMeetingMondays() {
    return (window.SEMANAS_SIN_REUNION || []).map(function (s) {
      var p = String(s).split('-');
      return dayNumber(+p[0], +p[1], +p[2]);
    });
  }

  // What to show on a given day: { group: 1–6 } or { noMeeting: true }.
  function whoCleans(y, m, d) {
    var day = dayNumber(y, m, d);
    var weekday = (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7; // Monday = 0
    var monday = day - weekday;
    var skip = noMeetingMondays();
    if (skip.indexOf(monday) >= 0) return { noMeeting: true };
    var weeks = (monday - START_MONDAY) / 7;
    // Weeks with no meeting don't use up a group.
    skip.forEach(function (s) {
      if (monday > START_MONDAY && s >= START_MONDAY && s < monday) weeks--;
      if (monday < START_MONDAY && s >= monday && s < START_MONDAY) weeks++;
    });
    return { group: ((START_GROUP - 1 + weeks) % 6 + 6) % 6 + 1 };
  }

  function dateText(y, m, d) {
    var weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    return DIAS[weekday] + ' ' + d + ' de ' + MESES[m - 1];
  }

  // Today on this computer's own clock and time zone, or ?fecha=YYYY-MM-DD for previews.
  var preview = (location.search.match(/[?&]fecha=(\d{4})-(\d{2})-(\d{2})/) || []).slice(1).map(Number);
  function today() {
    if (preview.length === 3) return preview;
    var now = new Date();
    return [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  }

  // ---------- The screen ----------

  var $ = function (id) { return document.getElementById(id); };
  var shown = '';

  function render() {
    var t = today(), y = t[0], m = t[1], d = t[2];
    var who = whoCleans(y, m, d);
    var key = y + '-' + m + '-' + d + ':' + (who.noMeeting ? 'x' : who.group);
    if (key === shown) return;
    shown = key;
    var g = who.noMeeting ? NEUTRAL : GROUPS[who.group];
    document.body.classList.toggle('sin-reunion', !!who.noMeeting);
    document.body.style.setProperty('--bgt', g.bgt);
    document.body.style.setProperty('--bgm', g.bgm);
    $('fondo').src = who.noMeeting ? 'sin-reunion-fondo-v1.svg' : 'grupo' + who.group + '-fondo-v1.svg';
    $('fecha').textContent = dateText(y, m, d);
    $('fecha').setAttribute('fill', g.date);
    if (!who.noMeeting) {
      $('apellido').textContent = g.apellido;
      $('grupo').textContent = 'Grupo ' + who.group;
      $('grupo').setAttribute('fill', g.pilltxt);
      $('pill-top').setAttribute('stop-color', g.light);
      $('pill-bottom').setAttribute('stop-color', g.dark);
    }
    makeAnimation(g.deep, who.noMeeting ? 7 : who.group);
  }

  // Fit the 1920 × 1080 screen to the window or TV.
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    $('stage').style.setProperty('--s', s);
  }

  // ---------- Bubbles and sparkles ----------

  // A bubble, drawn like the approved pictures, with a rim in the group's color.
  function bubbleSvg(r, deep, id) {
    var w = Math.ceil(r * 2 + 4), c = w / 2;
    return '<svg width="' + w + '" height="' + w + '" viewBox="0 0 ' + w + ' ' + w + '" style="margin:' + (-c) + 'px 0 0 ' + (-c) + 'px">' +
      '<defs><radialGradient id="b' + id + '" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".05"/>' +
      '<stop offset=".72" stop-color="#fff" stop-opacity=".18"/><stop offset=".93" stop-color="#fff" stop-opacity=".9"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="i' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fd0ff" stop-opacity=".85"/>' +
      '<stop offset=".5" stop-color="#ff9fdc" stop-opacity=".6"/><stop offset="1" stop-color="#7dffc0" stop-opacity=".75"/></linearGradient></defs>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="url(#b' + id + ')"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + (r * 0.97) + '" fill="none" stroke="url(#i' + id + ')" stroke-width="' + Math.max(2, r * 0.08) + '"/>' +
      '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" fill="none" stroke="' + deep + '" stroke-opacity=".38" stroke-width="1.5"/>' +
      '<ellipse cx="' + (c - r * 0.35) + '" cy="' + (c - r * 0.38) + '" rx="' + (r * 0.26) + '" ry="' + (r * 0.14) + '" fill="#fff" opacity=".95" transform="rotate(-35 ' + (c - r * 0.35) + ' ' + (c - r * 0.38) + ')"/>' +
      '<circle cx="' + (c + r * 0.38) + '" cy="' + (c + r * 0.4) + '" r="' + (r * 0.07) + '" fill="#fff" opacity=".8"/></svg>';
  }

  // A sparkle with a soft glow, drawn like the approved pictures.
  function sparkleSvg(id) {
    return '<svg width="96" height="96" viewBox="-48 -48 96 96" style="margin:-48px 0 0 -48px">' +
      '<defs><filter id="g' + id + '" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/>' +
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#g' + id + ')">' +
      '<path d="M0,-30 C3,-8 8,-3 30,0 C8,3 3,8 0,30 C-3,8 -8,3 -30,0 C-8,-3 -3,-8 0,-30Z" fill="#fff"/>' +
      '<path d="M0,-18 C2,-5 5,-2 18,0 C5,2 2,5 0,18 C-2,5 -5,2 -18,0 C-5,-2 -2,-5 0,-18Z" fill="#ffd54a"/></g></svg>';
  }
  // Where the sparkles shine: x, y, when, size (from the approved pictures).
  var SPARKS = [[330, 300, 0.0, 1.0], [1590, 300, 0.35, 1.1], [1530, 620, 0.6, 0.9], [400, 620, 0.15, 0.85],
                [760, 710, 0.8, 0.6], [1180, 720, 0.5, 0.65], [250, 470, 0.7, 0.7], [1700, 480, 0.25, 0.75]];

  var RISE = 9;    // seconds for a bubble to float from the floor to the top: slow and calm
  var TWINKLE = 3; // seconds for a sparkle to shine and fade

  // The same "random" bubbles every time for a group, so the screen looks the same each week.
  function seeded(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function makeAnimation(deep, seed) {
    var rand = seeded(100 + seed), html = '';
    for (var i = 0; i < 16; i++) {
      var x = 120 + rand() * 1680, r = [14, 18, 22, 26, 30, 36][Math.floor(rand() * 6)];
      var phase = rand(), amp = 10 + rand() * 18, wob = rand() < 0.5 ? 1 : 2;
      html += '<div class="bub" style="--x:' + x.toFixed(0) + 'px;--dur:' + RISE + 's;--delay:' + (-phase * RISE).toFixed(2) +
        's;--amp:' + amp.toFixed(1) + 'px;--wob:' + wob + '"><div>' + bubbleSvg(r, deep, i) + '</div></div>';
    }
    SPARKS.forEach(function (s, i) {
      html += '<div class="spark" style="--x:' + s[0] + 'px;--y:' + s[1] + 'px;--s0:' + s[3] + ';--dur:' + TWINKLE +
        's;--delay:' + (-s[2] * TWINKLE).toFixed(2) + 's">' + sparkleSvg(i) + '</div>';
    });
    $('anim').innerHTML = html;
  }

  // ---------- Full screen, pointer, screen awake ----------

  function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }

  // Double-click anywhere: full screen, and double-click again to leave. Esc also leaves.
  document.addEventListener('dblclick', function (e) {
    e.preventDefault();
    if (window.getSelection) window.getSelection().removeAllRanges();
    if (isFull()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      var el = document.documentElement;
      var go = el.requestFullscreen || el.webkitRequestFullscreen;
      if (go) { var p = go.call(el); if (p && p.catch) p.catch(function () {}); }
    }
  });
  // Double-clicking never selects anything.
  document.addEventListener('mousedown', function (e) { if (e.detail > 1) e.preventDefault(); });
  document.addEventListener('selectstart', function (e) { e.preventDefault(); });
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  function onFullChange() {
    $('hint').classList.remove('show');
    keepAwake();
    if (!isFull() && updateWaiting) location.reload();
  }
  document.addEventListener('fullscreenchange', onFullChange);
  document.addEventListener('webkitfullscreenchange', onFullChange);

  // A small hint for a few seconds when the page opens.
  setTimeout(function () { if (!isFull()) $('hint').classList.add('show'); }, 400);
  setTimeout(function () { $('hint').classList.remove('show'); }, 6400);

  // Hide the mouse pointer when it isn't moving.
  var still;
  function pointerMoved() {
    document.body.classList.remove('no-pointer');
    clearTimeout(still);
    still = setTimeout(function () { document.body.classList.add('no-pointer'); }, 2500);
  }
  document.addEventListener('mousemove', pointerMoved);
  pointerMoved();

  // Keep the screen from going to sleep while the page is open, if the browser allows it.
  var wake = null;
  function keepAwake() {
    if (!('wakeLock' in navigator) || document.visibilityState !== 'visible' || wake) return;
    navigator.wakeLock.request('screen').then(function (w) {
      wake = w;
      w.addEventListener('release', function () { wake = null; });
    }).catch(function () {});
  }
  document.addEventListener('visibilitychange', keepAwake);
  document.addEventListener('click', keepAwake);

  // ---------- Staying up to date ----------

  // Keep a saved copy for when the internet is down (see sw.js).
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});

  // Every hour: get the newest list of weeks with no meeting, and check for a
  // new version of the page. A new version reloads by itself, but only when
  // it's not in full screen, so it never flashes during the meeting.
  var updateWaiting = false;
  function checkForUpdates() {
    var s = document.createElement('script');
    s.src = 'sin-reunion.js?t=' + Date.now();
    s.onload = function () { shown = ''; render(); s.remove(); };
    s.onerror = function () { s.remove(); };
    document.head.appendChild(s);
    fetch('./?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (page) {
      var m = page.match(/limpieza-v(\d+)\.js/);
      if (m && +m[1] !== VERSION) {
        updateWaiting = true;
        if (!isFull()) location.reload();
      }
    }).catch(function () {});
  }
  setInterval(checkForUpdates, 60 * 60 * 1000);
  window.addEventListener('online', checkForUpdates);

  // The date changes at midnight and the group on Monday, with no reload.
  setInterval(render, 20 * 1000);
  window.addEventListener('resize', fit);

  fit();
  render();
  keepAwake();

  // For checking the schedule in tests.
  window.limpieza = { whoCleans: whoCleans, dateText: dateText, version: VERSION };
})();
