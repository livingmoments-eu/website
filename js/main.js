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
