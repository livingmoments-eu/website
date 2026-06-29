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

/* Bewertungs-Funnel: mehrstufiges Modal-Formular */
(function () {
  const modal = document.getElementById('bewertungs-funnel');
  const form = document.getElementById('bewertungs-form');
  if (!modal || !form) return;

  const steps = Array.from(form.querySelectorAll('.funnel-step[data-step]'));
  const dataSteps = steps.filter(function (s) { return s.dataset.step !== 'success'; });
  const totalSteps = dataSteps.length;
  const progressFill = document.getElementById('funnel-progress-fill');
  const progressLabel = document.getElementById('funnel-progress-label');
  const backBtn = document.getElementById('funnel-back');
  const nextBtn = document.getElementById('funnel-next');
  const submitBtn = document.getElementById('funnel-submit');
  const objektartInput = document.getElementById('fn-objektart');
  const grundstueckWrap = document.getElementById('fn-grundstueck-wrap');
  let current = 1;

  function showStep(n) {
    steps.forEach(function (s) { s.hidden = s.dataset.step !== String(n); });
    const pct = Math.round((n / totalSteps) * 100);
    progressFill.style.width = pct + '%';
    progressLabel.textContent = 'Schritt ' + n + ' von ' + totalSteps;
    backBtn.style.display = n > 1 ? 'inline-block' : 'none';
    nextBtn.style.display = n < totalSteps ? 'inline-block' : 'none';
    submitBtn.style.display = n === totalSteps ? 'inline-block' : 'none';
  }

  function currentStepEl() {
    return form.querySelector('.funnel-step[data-step="' + current + '"]');
  }

  function validateStep() {
    const fields = currentStepEl().querySelectorAll('input[required], select[required]');
    for (const field of fields) {
      if (!field.value || (field.type === 'checkbox' && !field.checked)) {
        field.reportValidity();
        return false;
      }
    }
    if (current === 2 && !objektartInput.value) {
      return false;
    }
    return true;
  }

  form.querySelectorAll('.funnel-type-card').forEach(function (card) {
    card.addEventListener('click', function () {
      form.querySelectorAll('.funnel-type-card').forEach(function (c) { c.classList.remove('is-selected'); });
      card.classList.add('is-selected');
      objektartInput.value = card.dataset.value;
      if (grundstueckWrap) {
        grundstueckWrap.style.display = card.dataset.value === 'Wohnung' ? 'none' : 'block';
      }
    });
  });

  nextBtn.addEventListener('click', function () {
    if (!validateStep()) return;
    current++;
    showStep(current);
  });

  backBtn.addEventListener('click', function () {
    current--;
    showStep(current);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep()) return;

    const f = function (name) { return (form.querySelector('[name="' + name + '"]') || {}).value || ''; };
    const payload = {
      strasse: f('strasse'),
      plz: f('plz'),
      objektart: f('objektart'),
      wohnflaeche: f('wohnflaeche'),
      grundstueck: f('grundstueck'),
      stockwerke: f('stockwerke'),
      email: f('email'),
      telefon: f('telefon')
    };

    submitBtn.textContent = 'Wird gesendet...';
    submitBtn.disabled = true;

    fetch('/api/bewertung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Request failed with status ' + response.status);
        form.querySelectorAll('.funnel-step').forEach(function (s) { s.hidden = s.dataset.step !== 'success'; });
        form.querySelector('.funnel-nav').style.display = 'none';
        progressFill.style.width = '100%';
        progressLabel.textContent = 'Abgeschlossen';
      })
      .catch(function () {
        submitBtn.textContent = 'Bewertung anfordern';
        submitBtn.disabled = false;
        alert('Da ist leider etwas schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie mir direkt eine E-Mail.');
      });
  });

  showStep(1);
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
