/* ==========================================================================
   Portfolio behaviour — vanilla JS, no dependencies, no layout reads in
   scroll handlers. Everything degrades gracefully if a feature is missing.
   ========================================================================== */
(function () {
  'use strict';

  var d = document, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var hasIO = 'IntersectionObserver' in window;

  /* ------------------------------------------------------------- theme */
  var themeBtn = $('#theme');
  function syncTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-checked', dark ? 'true' : 'false');
    themeBtn.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  }
  themeBtn.addEventListener('click', function () {
    var dark = root.getAttribute('data-theme') !== 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    try { localStorage.setItem('uks-theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncTheme();
  });
  syncTheme();

  /* ------------------------------------------------------- mobile menu */
  var menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
  var wide = matchMedia('(min-width: 1024px)');

  function setMenu(open, returnFocus) {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) { var f = $('a[href]', menu); if (f) f.focus(); }
    else if (returnFocus) menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { setMenu(menu.hidden, !menu.hidden); });
  menu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a[href^="#"]')) setMenu(false, false);
  });
  d.addEventListener('pointerdown', function (e) {
    if (menu.hidden) return;
    if (!menu.contains(e.target) && !menuBtn.contains(e.target)) setMenu(false, false);
  });
  d.addEventListener('keydown', function (e) {
    if (menu.hidden) return;
    if (e.key === 'Escape') { setMenu(false, true); return; }
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button', menu); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); menuBtn.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  var onWide = function () { if (wide.matches && !menu.hidden) setMenu(false, false); };
  if (wide.addEventListener) wide.addEventListener('change', onWide); else wide.addListener(onWide);

  /* ------------------------------------------------ scroll reveal (once) */
  var revealTargets = $$('[data-rv], [data-rv-list]');
  if (hasIO) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealTargets.forEach(function (el) { revealIO.observe(el); });

    /* only animate the striped placeholders while they are on screen */
    var liveIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.target.classList.toggle('live', e.isIntersecting); });
    }, { rootMargin: '80px 0px' });
    $$('.ph:not(.ph--fallback)').forEach(function (el) { liveIO.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------------------------- active nav link (spy) */
  var links = $$('.nav-links a[href^="#"]');
  if (hasIO && links.length) {
    var spy = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!vis) return;
      var id = vis.target.id;
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6, 1] });
    ['home', 'about', 'skills', 'experience', 'projects', 'contact'].forEach(function (id) {
      var el = d.getElementById(id); if (el) spy.observe(el);
    });
  }

  /* --------------- scrolled nav shadow + progress fallback (rAF-throttled) */
  var progress = $('.progress');
  var nativeProgress = window.CSS && CSS.supports && CSS.supports('animation-timeline', 'scroll()');
  var ticking = false, scrolled = false;
  function onScroll() {
    ticking = false;
    var y = window.pageYOffset || root.scrollTop || 0;
    if ((y > 8) !== scrolled) { scrolled = y > 8; root.toggleAttribute('data-scrolled', scrolled); }
    if (!nativeProgress && progress) {
      var max = root.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    }
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ------------------------------------------------------ split text (h1/h2)
     Wraps letters (hero name) or words (section titles) so CSS can animate
     them. The original text stays available to screen readers via aria-label. */
  function splitText(el, mode) {
    var n = 0;
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 1) { walk(c); return; }
        if (c.nodeType !== 3) return;
        var frag = d.createDocumentFragment();
        c.nodeValue.split(/(\s+)/).forEach(function (tok) {
          if (!tok) return;
          if (/^\s+$/.test(tok)) { frag.appendChild(d.createTextNode(tok)); return; }
          var w = d.createElement('span');
          w.setAttribute('aria-hidden', 'true');
          if (mode === 'chars') {
            w.className = 'wd';
            tok.split('').forEach(function (ch) {
              var s = d.createElement('span');
              s.className = 'ch';
              s.style.setProperty('--ci', n++);
              s.textContent = ch;
              w.appendChild(s);
            });
          } else {
            w.className = 'w';
            var inner = d.createElement('span');
            inner.className = 'wi';
            inner.style.setProperty('--wi', n++);
            inner.textContent = tok;
            w.appendChild(inner);
          }
          frag.appendChild(w);
        });
        node.replaceChild(frag, c);
      });
    })(el);
  }
  $$('[data-split="chars"]').forEach(function (el) { splitText(el, 'chars'); });
  $$('.h2').forEach(function (el) { splitText(el, 'words'); });

  /* ----------------------------------------- pointer effects (mouse only) */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    /* soft aurora that trails the cursor (rAF only while it is catching up) */
    var au = d.createElement('div');
    au.className = 'aurora';
    au.setAttribute('aria-hidden', 'true');
    d.body.appendChild(au);
    var ax = innerWidth / 2, ay = innerHeight / 3, tx = ax, ty = ay, auRaf = 0;
    var drawAu = function () {
      ax += (tx - ax) * 0.12; ay += (ty - ay) * 0.12;
      au.style.transform = 'translate3d(' + ax.toFixed(1) + 'px,' + ay.toFixed(1) + 'px,0)';
      auRaf = (Math.abs(tx - ax) + Math.abs(ty - ay) > 0.5) ? requestAnimationFrame(drawAu) : 0;
    };
    d.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      tx = e.clientX; ty = e.clientY;
      au.classList.add('on');
      if (!auRaf) auRaf = requestAnimationFrame(drawAu);
    }, { passive: true });
    root.addEventListener('mouseleave', function () { au.classList.remove('on'); });

    /* magnetic buttons / icons */
    $$('.btn, .send, .ic, .ic-lg').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left - r.width / 2) * 0.28).toFixed(1) + 'px');
        el.style.setProperty('--my', ((e.clientY - r.top - r.height / 2) * 0.4).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', function () {
        el.style.removeProperty('--mx'); el.style.removeProperty('--my');
      });
    });

    /* cursor spotlight inside cards */
    $$('.xp, .skills-card, .term').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      });
    });

    /* 3D tilt + glare on the portrait */
    var wrap = $('.portrait-wrap'), pt = $('.portrait');
    if (wrap && pt) {
      wrap.addEventListener('pointermove', function (e) {
        var r = pt.getBoundingClientRect();
        var px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        var py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
        pt.style.setProperty('--ry', ((px - 0.5) * 18).toFixed(2) + 'deg');
        pt.style.setProperty('--rx', ((0.5 - py) * 18).toFixed(2) + 'deg');
        pt.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        pt.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        pt.style.setProperty('--go', '1');
      });
      wrap.addEventListener('pointerleave', function () {
        ['--rx', '--ry', '--gx', '--gy', '--go'].forEach(function (p) { pt.style.removeProperty(p); });
      });
    }
  }

  /* ---------------------------------------------------------- contact form */
  var form = $('#contact-form');
  if (!form) return;

  var F = {
    email: $('#f-email'), name: $('#f-name'), subject: $('#f-subject'), message: $('#f-message')
  };
  var E = {
    email: $('#err-email'), name: $('#err-name'), subject: $('#err-subject'), message: $('#err-message')
  };
  var sendBtn = $('#send'), sendLabel = $('#send-label'), spinner = $('#spinner');
  var statusEl = $('#status'), countEl = $('#count');
  var state = 'idle', timer = 0;

  var STATUS = {
    idle: '', sending: 'Sending…',
    success: 'Message sent — I\'ll reply within 48 hours.',
    error: 'Please fix the highlighted fields.'
  };

  function setStatus(s) {
    state = s;
    statusEl.textContent = STATUS[s];
    statusEl.setAttribute('data-s', s);
    var busy = s === 'sending';
    sendBtn.disabled = busy;
    spinner.hidden = !busy;
    sendLabel.textContent = busy ? 'Sending…' : s === 'success' ? 'Send another message' : 'Send message';
  }

  function setError(k, msg) {
    E[k].textContent = msg || '';
    F[k].setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validate() {
    var v = {
      email: F.email.value.trim(), name: F.name.value.trim(),
      subject: F.subject.value.trim(), message: F.message.value.trim()
    };
    var e = {};
    if (!v.email) e.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.email)) e.email = 'That email address doesn\'t look valid.';
    if (!v.name) e.name = 'Name is required.';
    if (!v.subject) e.subject = 'Subject is required.';
    else if (v.subject.length < 3) e.subject = 'At least 3 characters.';
    if (!v.message) e.message = 'Message is required.';
    else if (v.message.length < 20) e.message = 'At least 20 characters (' + v.message.length + ' so far).';
    return e;
  }

  function grow() {
    var ta = F.message;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 340) + 'px';
  }

  Object.keys(F).forEach(function (k) {
    F[k].addEventListener('input', function () {
      setError(k, '');
      if (state === 'error' || state === 'success') setStatus('idle');
      if (k === 'message') { countEl.textContent = F.message.value.length; grow(); }
    });
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (state === 'sending') return;
    var errs = validate(), keys = Object.keys(F);
    keys.forEach(function (k) { setError(k, errs[k]); });
    var bad = keys.filter(function (k) { return errs[k]; });
    if (bad.length) { setStatus('error'); F[bad[0]].focus(); return; }

    setStatus('sending');
    clearTimeout(timer);
    /* demo behaviour carried over from the original: no backend is wired up */
    timer = setTimeout(function () {
      keys.forEach(function (k) { F[k].value = ''; });
      countEl.textContent = '0';
      grow();
      setStatus('success');
    }, 1400);
  });
})();
