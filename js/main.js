/* Living Moments UG — Main JS */

/* Navigation: Scrolled-State */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* Hamburger-Menü */
(function () {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile-menu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link');

  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* Fade-In bei Scroll */
(function () {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* Event-Anfrageformular */
(function () {
  const form = document.getElementById('event-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const f = function (name) { return (form.querySelector('[name="' + name + '"]') || {}).value || ''; };

    const subject = encodeURIComponent('Eventanfrage: ' + (f('art') || 'Veranstaltung'));
    const body = encodeURIComponent(
      'Name: ' + f('name') + '\n' +
      'Unternehmen: ' + f('unternehmen') + '\n' +
      'E-Mail: ' + f('email') + '\n' +
      'Telefon: ' + f('telefon') + '\n\n' +
      'Art des Events: ' + f('art') + '\n' +
      'Anzahl Gäste: ' + f('gaeste') + '\n' +
      'Datum / Zeitraum: ' + f('datum') + '\n' +
      'Budget-Rahmen: ' + f('budget') + '\n\n' +
      'Vorstellung / Wünsche:\n' + f('vision')
    );

    window.location.href = 'mailto:gehring@livingmoments.eu?subject=' + subject + '&body=' + body;

    if (btn) {
      btn.textContent = 'Wird weitergeleitet...';
      setTimeout(function () { btn.textContent = 'Anfrage senden'; }, 3000);
    }
  });
})();

/* Bewertungsanfrage-Formular */
(function () {
  const form = document.getElementById('bewertung-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const f = function (name) { return (form.querySelector('[name="' + name + '"]') || {}).value || ''; };

    const subject = encodeURIComponent('Bewertungsanfrage: ' + (f('objektadresse') || 'Immobilie'));
    const body = encodeURIComponent(
      'Name: ' + f('name') + '\n' +
      'Telefon: ' + f('telefon') + '\n' +
      'Adresse: ' + f('adresse') + '\n\n' +
      'Adresse des Objekts: ' + f('objektadresse') + '\n' +
      'Dringlichkeit: ' + f('dringlichkeit')
    );

    window.location.href = 'mailto:julia.gehring@engelvoelkers.com?subject=' + subject + '&body=' + body;

    if (btn) {
      btn.textContent = 'Wird weitergeleitet...';
      setTimeout(function () { btn.textContent = 'Bewertung anfragen'; }, 3000);
    }
  });
})();

/* Empfehlung-Modal: Formular Submit */
(function () {
  const form = document.querySelector('#empfehlung-modal form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const absender = (form.querySelector('[name="absender"]') || {}).value || '';
    const empfohlen = (form.querySelector('[name="empfohlen"]') || {}).value || '';
    const nachricht = (form.querySelector('[name="nachricht"]') || {}).value || '';

    const subject = encodeURIComponent('Empfehlung von ' + absender);
    const body = encodeURIComponent(
      'Von: ' + absender + '\n' +
      'Empfohlene Person: ' + empfohlen + '\n\n' +
      (nachricht ? 'Nachricht:\n' + nachricht : '')
    );

    window.location.href = 'mailto:gehring@livingmoments.eu?subject=' + subject + '&body=' + body;

    if (btn) {
      btn.textContent = 'Wird weitergeleitet...';
      setTimeout(function () { btn.textContent = 'Empfehlung senden'; }, 3000);
    }
  });
})();

/* Dynamische E&V Listings */
(function () {
  var container = document.getElementById('listings-container');
  if (!container) return;

  fetch('/assets/data/listings.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var listings = data.listings || [];
      var updated = data.lastUpdated || '';

      if (!listings.length) {
        container.innerHTML = '<p class="listings-loading">Derzeit keine Angebote verfügbar.</p>';
        return;
      }

      // Metazeile "Zuletzt aktualisiert"
      var meta = document.getElementById('listings-meta');
      if (meta && updated) {
        var d = new Date(updated + 'T00:00:00');
        meta.textContent = 'Zuletzt aktualisiert: ' + d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
      }

      container.innerHTML = listings.map(function (l) {
        var badge = l.isNew ? '<span class="listing-card__badge">NEU</span>' : '';
        var metaStr = [l.rooms, l.bathrooms, l.sqm].filter(Boolean).join(' · ');
        return (
          '<a href="' + l.url + '" target="_blank" rel="noopener" class="listing-card fade-in">' +
            badge +
            '<div class="listing-card__location">' + (l.location || '') + '</div>' +
            '<div class="listing-card__title">' + (l.title || '') + '</div>' +
            '<div class="listing-card__price">' + (l.price || '') + '</div>' +
            (metaStr ? '<div class="listing-card__meta">' + metaStr + '</div>' : '') +
            '<span class="listing-card__cta">Bei Engel &amp; Völkers ansehen →</span>' +
          '</a>'
        );
      }).join('');

      // Fade-in auf dynamisch eingefügten Karten
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.05 });
      container.querySelectorAll('.fade-in').forEach(function (el) { obs.observe(el); });
    })
    .catch(function () {
      container.innerHTML =
        '<p class="listings-loading">Angebote können gerade nicht geladen werden. ' +
        '<a href="https://www.engelvoelkers.com/de/de/advisors/julia-gehring" target="_blank" rel="noopener">' +
        'Direkt bei Engel &amp; Völkers ansehen →</a></p>';
    });
})();

/* Select: has-value class für Placeholder-Styling */
(function () {
  document.querySelectorAll('.contact-form select').forEach(function (sel) {
    function update() {
      if (sel.value) {
        sel.classList.add('has-value');
      } else {
        sel.classList.remove('has-value');
      }
    }
    sel.addEventListener('change', update);
    update();
  });
})();

/* Kontaktformular: einfaches Client-Side Handling */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn ? btn.textContent : '';

    /* Hier später echtes Backend/Formspree/Netlify Forms einbinden */
    /* Aktuell: Mailto-Fallback */
    const name = (form.querySelector('[name="name"]') || {}).value || '';
    const email = (form.querySelector('[name="email"]') || {}).value || '';
    const betreff = (form.querySelector('[name="betreff"]') || {}).value || '';
    const nachricht = (form.querySelector('[name="nachricht"]') || {}).value || '';
    const dienst = (form.querySelector('[name="dienst"]') || {}).value || '';

    const subject = encodeURIComponent((betreff || dienst || 'Anfrage über livingmoments.eu'));
    const body = encodeURIComponent(
      'Name: ' + name + '\nE-Mail: ' + email + '\n\n' + nachricht
    );

    window.location.href = 'mailto:gehring@livingmoments.eu?subject=' + subject + '&body=' + body;

    if (btn) {
      btn.textContent = 'Wird weitergeleitet...';
      setTimeout(function () { btn.textContent = originalText; }, 3000);
    }
  });
})();
