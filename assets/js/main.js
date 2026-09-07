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

  // Form handling — submits via FormSubmit (no backend of our own needed).
  // data-placeholder-form holds the FormSubmit endpoint URL for that form.
  document.querySelectorAll('form[data-placeholder-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute('data-placeholder-form');
      var note = form.querySelector('.form-feedback');
      var btn = form.querySelector('button[type="submit"]');
      // Honeypot: if a bot filled this hidden field, silently drop the submit.
      var honey = form.querySelector('input[name="_honey"]');
      if (honey && honey.value) return;

      if (btn) btn.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (!res.ok) throw new Error('request failed');
        if (note) {
          note.textContent = 'Bedankt! Je bericht is verstuurd — we nemen zo snel mogelijk contact met je op.';
          note.style.display = 'block';
        }
        form.reset();
      }).catch(function () {
        if (note) {
          note.textContent = 'Er ging iets mis bij het versturen. Probeer het later opnieuw, of mail ons rechtstreeks op info@rumstbeweegt.be.';
          note.style.display = 'block';
        }
      }).finally(function () {
        if (btn) btn.disabled = false;
      });
    });
  });
});
