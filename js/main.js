/* ThreatLark site — vanilla JS, no dependencies */
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

  /* Request-a-demo form: opens the visitor's email client with the details pre-filled.
     TODO: swap for a form service (Formspree, Basin, Netlify Forms, etc.) if you want
     submissions without relying on the visitor's mail client — see README. */
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
})();
