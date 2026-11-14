// The Appearance menu: Automatic (follows the iPhone or computer setting), Light or Dark.
// The choice is kept only in this browser (localStorage "theme"): no cookies, nothing sent anywhere.
// A tiny script in each page's <head> applies it before the page draws, so the colors never flash.
(function () {
  var root = document.documentElement;
  var KEY = 'theme';
  var hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');

  function stored() {
    try {
      var t = localStorage.getItem(KEY);
      return t === 'light' || t === 'dark' ? t : 'auto';
    } catch (e) { return 'auto'; }
  }
  function apply(t) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t);
    else root.removeAttribute('data-theme');
  }
  function save(t) {
    try {
      if (t === 'auto') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, t);
    } catch (e) {}
  }

  var boxes = [];

  function setup(box) {
    var btn = box.querySelector('.theme-btn');
    var menu = box.querySelector('.menu');
    var items = [].slice.call(menu.querySelectorAll('[role="menuitemradio"]'));
    var openedBy = null;   // 'hover', 'click' or 'key'
    var closeTimer = null;

    function mark() {
      var t = stored();
      items.forEach(function (it) { it.setAttribute('aria-checked', it.dataset.choice === t ? 'true' : 'false'); });
    }
    function checked() {
      for (var i = 0; i < items.length; i++) if (items[i].getAttribute('aria-checked') === 'true') return items[i];
      return items[0];
    }
    function highlight(it, focus) {
      items.forEach(function (x) { x.classList.toggle('hl', x === it); });
      if (it && focus) it.focus({ preventScroll: true });
    }
    function isOpen() { return !menu.hidden; }
    function open(how) {
      clearTimeout(closeTimer);
      mark();
      if (!isOpen()) {
        boxes.forEach(function (b) { if (b !== api) b.close(false); });
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        openedBy = how;
        highlight(checked(), how === 'key');
      } else if (how !== 'hover') {
        openedBy = how;
      }
    }
    function close(refocus) {
      clearTimeout(closeTimer);
      if (!isOpen()) return;
      menu.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      highlight(null);
      openedBy = null;
      if (refocus) btn.focus({ preventScroll: true });
    }
    function choose(it, byKey) {
      var t = it.dataset.choice;
      save(t);
      apply(t);
      mark();
      close(byKey);
    }
    var api = { close: close, mark: mark };
    boxes.push(api);

    // Tap or click on the button. A click from the keyboard (Enter or Space) has detail 0.
    btn.addEventListener('click', function (e) {
      var byKey = e.detail === 0;
      if (isOpen() && openedBy !== 'hover') close(byKey);
      else open(byKey ? 'key' : 'click');
    });
    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        open('key');
        highlight(e.key === 'ArrowUp' ? items[items.length - 1] : checked(), true);
      } else if (e.key === 'Escape' && isOpen()) {
        close(true);
      }
    });

    // Computer: the menu opens when the mouse is over the button, and closes a moment after it leaves.
    box.addEventListener('mouseenter', function () {
      if (!hoverMQ.matches) return;
      clearTimeout(closeTimer);
      if (!isOpen()) open('hover');
    });
    box.addEventListener('mouseleave', function () {
      if (!hoverMQ.matches || openedBy !== 'hover') return;
      closeTimer = setTimeout(function () { close(false); }, 250);
    });

    items.forEach(function (it) {
      it.addEventListener('mouseenter', function () { highlight(it, openedBy === 'key'); });
      // A finger on an option highlights it in blue, like the mouse does.
      it.addEventListener('pointerdown', function () { highlight(it, false); });
      it.addEventListener('click', function (e) { choose(it, e.detail === 0); });
    });
    menu.addEventListener('mouseleave', function () { if (openedBy !== 'key') highlight(null); });

    menu.addEventListener('keydown', function (e) {
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); highlight(items[(i + 1) % items.length], true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); highlight(items[(i - 1 + items.length) % items.length], true); }
      else if (e.key === 'Home') { e.preventDefault(); highlight(items[0], true); }
      else if (e.key === 'End') { e.preventDefault(); highlight(items[items.length - 1], true); }
      else if (e.key === 'Escape') { e.preventDefault(); close(true); }
      else if (e.key === 'Tab') { close(false); }
    });

    // Close when focus moves somewhere else on the page.
    box.addEventListener('focusout', function (e) {
      if (isOpen() && openedBy !== 'hover' && e.relatedTarget && !box.contains(e.relatedTarget)) close(false);
    });

    mark();
  }

  // Picture tabs on an app page (iPhone, iPad, iPhone Duo): one device at a time.
  // Without JavaScript, every device's pictures show, one after another.
  function setupTabs(list) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    function show(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) tab.focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') n = tabs[0];
        else if (e.key === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); show(n, true); }
      });
    });
    show(tabs[0], false);
  }

  function start() {
    [].forEach.call(document.querySelectorAll('.appearance'), setup);
    [].forEach.call(document.querySelectorAll('.pic-tabs'), setupTabs);
    // Close on a click or tap anywhere outside the menu.
    document.addEventListener('pointerdown', function (e) {
      if (!e.target.closest || !e.target.closest('.appearance')) boxes.forEach(function (b) { b.close(false); });
    });
    // If the choice changes in another tab, follow it here too.
    window.addEventListener('storage', function (e) {
      if (e.key === KEY || e.key === null) { apply(stored()); boxes.forEach(function (b) { b.mark(); }); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
