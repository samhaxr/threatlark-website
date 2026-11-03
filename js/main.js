/* ThreatLark site: vanilla JS, no dependencies */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var links = document.getElementById('nav-links');

  /* Header turns solid once the page scrolls */
  function onScroll() { header && header.classList.toggle('scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle) {
    toggle.addEventListener('click', function () { setMenu(!header.classList.contains('open')); });
  }

  /* Dropdown (Company) */
  var menus = document.querySelectorAll('.has-menu');
  function closeMenus(except) {
    menus.forEach(function (m) {
      if (m !== except) {
        m.classList.remove('open');
        var b = m.querySelector('.nav-trigger');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }
  menus.forEach(function (m) {
    var btn = m.querySelector('.nav-trigger');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !m.classList.contains('open');
      closeMenus(m);
      m.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    if (window.matchMedia('(hover:hover) and (min-width:901px)').matches) {
      m.addEventListener('mouseenter', function () { closeMenus(m); m.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); });
      m.addEventListener('mouseleave', function () { m.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    }
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-menu')) closeMenus();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenus();
      if (header && header.classList.contains('open')) { setMenu(false); toggle && toggle.focus(); }
    }
  });
  if (links) {
    links.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && !a.closest('.has-menu > .nav-trigger')) setMenu(false);
    });
  }
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

  /* Tabs (WAI-ARIA tabs pattern with arrow-key support) */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    function select(i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        var n = tabs.length, k = e.key;
        if (k === 'ArrowRight') { e.preventDefault(); select((i + 1) % n, true); }
        else if (k === 'ArrowLeft') { e.preventDefault(); select((i - 1 + n) % n, true); }
        else if (k === 'Home') { e.preventDefault(); select(0, true); }
        else if (k === 'End') { e.preventDefault(); select(n - 1, true); }
      });
    });
    var start = tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; });
    select(start < 0 ? 0 : start, false);
    /* deep link: #tab-ot etc. */
    var h = location.hash.slice(1);
    var idx = tabs.findIndex(function (t) { return t.id === h; });
    if (idx > -1) select(idx, false);
  });

  /* Sub-navigation highlight on content pages */
  var sub = document.querySelectorAll('.subnav a[href^="#"]');
  if (sub.length && 'IntersectionObserver' in window) {
    var map = {};
    sub.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          sub.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* Request-a-demo form: opens the visitor's email client with the details pre-filled. */
  var form = document.getElementById('demo-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var interests = d.getAll('interest').join(', ') || 'Not specified';
      var body = [
        'Name: ' + d.get('name'),
        'Work email: ' + d.get('email'),
        'Company: ' + d.get('company'),
        'Role: ' + (d.get('role') || '-'),
        'Environment: ' + (d.get('environment') || '-'),
        'Interested in: ' + interests,
        '',
        (d.get('message') || '')
      ].join('\n');
      var to = form.getAttribute('data-mailto');
      var subject = 'ThreatLark demo request - ' + d.get('company');
      window.location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      var ok = document.getElementById('form-status');
      if (ok) { ok.hidden = false; ok.focus(); }
    });
  }

  /* Screenshot gallery: thumbnails switch the featured screenshot */
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    var items = [].slice.call(g.querySelectorAll('[data-g-item]'));
    var thumbs = [].slice.call(g.querySelectorAll('[data-g-thumb]'));
    if (!items.length || items.length !== thumbs.length) return;
    g.classList.add('is-js');
    function show(n) {
      items.forEach(function (it, i) { it.hidden = i !== n; });
      thumbs.forEach(function (t, i) { t.setAttribute('aria-pressed', i === n ? 'true' : 'false'); });
    }
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { show(i); }); });
    show(0);
  });

  /* Lightbox for product screenshots: accessible modal, no dependencies */
  var triggers = document.querySelectorAll('a[data-lightbox]');
  if (triggers.length) {
    var lb = document.createElement('div');
    lb.className = 'lb';
    lb.hidden = true;
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Screenshot viewer');
    lb.innerHTML =
      '<div class="lb-backdrop" data-lb-close></div>' +
      '<figure class="lb-fig"><img class="lb-img" alt="">' +
      '<figcaption class="lb-cap"><span class="lb-cap-text"></span><small>Pinch to zoom, or rotate your device for a wider view.</small></figcaption></figure>' +
      '<button type="button" class="lb-close" aria-label="Close screenshot viewer">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('.lb-img');
    var lbCap = lb.querySelector('.lb-cap-text');
    var lbClose = lb.querySelector('.lb-close');
    var lastFocus = null;
    var bgNodes = [];

    function setBackground(on) {
      if (on) {
        bgNodes = [].filter.call(document.body.children, function (el) { return el !== lb && el.tagName !== 'SCRIPT'; });
        bgNodes.forEach(function (el) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); });
      } else {
        bgNodes.forEach(function (el) { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
        bgNodes = [];
      }
    }
    function openLb(a) {
      var img = a.querySelector('img');
      var fig = a.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      lastFocus = a;
      lbImg.src = a.getAttribute('href');
      lbImg.alt = img ? img.alt : '';
      lbCap.textContent = cap ? cap.textContent : (img ? img.alt : '');
      var sw = window.innerWidth - document.documentElement.clientWidth;
      if (sw > 0) document.body.style.paddingRight = sw + 'px';
      document.documentElement.classList.add('lb-open');
      lb.hidden = false;
      setBackground(true);
      lbClose.focus();
    }
    function closeLb() {
      if (lb.hidden) return;
      lb.hidden = true;
      lbImg.removeAttribute('src');
      document.documentElement.classList.remove('lb-open');
      document.body.style.paddingRight = '';
      setBackground(false);
      if (lastFocus) lastFocus.focus();
      lastFocus = null;
    }
    triggers.forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
        e.preventDefault();
        openLb(a);
      });
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lbImg || e.target.closest('.lb-cap')) return;
      closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); }
    });
  }
})();
