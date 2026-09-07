// RUMST BEWEEGT — shared site behaviour
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var body = document.body;
  if (toggle) {
    toggle.addEventListener('click', function () {
      var isOpen = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Mobile breakpoint mirrors the CSS nav collapse breakpoint (see style.css)
  var MOBILE_NAV_MAX = 1180;

  // Mobile dropdown expand (first tap opens the submenu instead of navigating;
  // second tap on an already-open trigger follows the link as normal)
  document.querySelectorAll('.has-dropdown > a.nav-link').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= MOBILE_NAV_MAX) {
        var parent = trigger.parentElement;
        if (!parent.classList.contains('open')) {
          e.preventDefault();
          document.querySelectorAll('.has-dropdown.open').forEach(function (o) { o.classList.remove('open'); });
          parent.classList.add('open');
        }
      }
    });
  });

  // Close mobile nav when an actual destination link is clicked
  // (skips the dropdown trigger itself on the tap that only expands it)
  document.querySelectorAll('.nav-primary a').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth > MOBILE_NAV_MAX) return;
      var isDropdownTrigger = link.parentElement.classList.contains('has-dropdown');
      var justOpened = isDropdownTrigger && link.parentElement.classList.contains('open');
      if (isDropdownTrigger && justOpened) return;
      body.classList.remove('nav-open');
    });
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content invisible, even if the observer misbehaves
    // (e.g. during full-page captures/printing that don't dispatch real scroll events).
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }, 1500);
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Sticky header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 4px 18px rgba(34,26,23,.10)' : 'none';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Front-end only form handling (no backend wired up yet)
  document.querySelectorAll('form[data-placeholder-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-feedback');
      if (note) {
        note.textContent = 'Bedankt! Dit formulier is nog niet gekoppeld aan een verzendsysteem — dat volgt in de volgende stap van de website.';
        note.style.display = 'block';
      }
      form.reset();
    });
  });
});
