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

/* Testimonial Modal */
(function () {
  var modal = document.getElementById('testimonial-modal');
  if (!modal) return;

  var content = document.getElementById('testimonial-modal-content');
  var backdrop = modal.querySelector('.testimonial-modal__backdrop');
  var closeBtn = modal.querySelector('.testimonial-modal__close');

  function openModal(id) {
    var tpl = document.getElementById('testimonial-' + id);
    if (!tpl) return;
    content.innerHTML = tpl.innerHTML;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.testimonial-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card.dataset.testimonial); });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });
})();

/* Adresse-Autocomplete im Bewertungs-Funnel (Photon / OpenStreetMap, kein API-Key) */
(function () {
  var straßeInput = document.getElementById('fn-strasse');
  var plzInput = document.getElementById('fn-plz');
  if (!straßeInput) return;

  var wrapper = straßeInput.parentNode;
  var dropdown = document.createElement('div');
  dropdown.className = 'autocomplete-dropdown';
  dropdown.setAttribute('role', 'listbox');
  dropdown.hidden = true;
  wrapper.appendChild(dropdown);

  var debounce;
  var activeIndex = -1;

  function getItems() { return dropdown.querySelectorAll('.autocomplete-item'); }

  function setActive(items, idx) {
    items.forEach(function (el, i) {
      el.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    activeIndex = idx;
  }

  function selectItem(item) {
    straßeInput.value = item.dataset.street || '';
    if (item.dataset.plz) plzInput.value = item.dataset.plz;
    dropdown.hidden = true;
    activeIndex = -1;
  }

  straßeInput.addEventListener('input', function () {
    clearTimeout(debounce);
    var q = straßeInput.value.trim();
    if (q.length < 3) { dropdown.hidden = true; return; }

    debounce = setTimeout(function () {
      fetch('https://photon.komoot.io/api/?q=' + encodeURIComponent(q) + '&lang=de&limit=8&layer=street&layer=house')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var features = (data.features || []).filter(function (f) {
            return f.properties.street || f.properties.name;
          });
          if (!features.length) { dropdown.hidden = true; return; }

          dropdown.innerHTML = '';
          features.slice(0, 5).forEach(function (f) {
            var p = f.properties;
            var street = [p.street || p.name, p.housenumber].filter(Boolean).join(' ');
            var city = [p.postcode, p.city || p.town || p.village || p.county].filter(Boolean).join(' ');
            var extra = p.country && p.country !== 'Deutschland' ? p.country : '';
            var label = [street, city, extra].filter(Boolean).join(', ');

            var item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', 'false');
            item.dataset.street = street;
            item.dataset.plz = p.postcode || '';
            item.textContent = label;
            item.addEventListener('mousedown', function (e) {
              e.preventDefault();
              selectItem(item);
            });
            dropdown.appendChild(item);
          });

          dropdown.hidden = false;
          activeIndex = -1;
        })
        .catch(function () { dropdown.hidden = true; });
    }, 350);
  });

  straßeInput.addEventListener('keydown', function (e) {
    if (dropdown.hidden) return;
    var items = getItems();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(items, Math.min(activeIndex + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(items, Math.max(activeIndex - 1, 0));
    } else if ((e.key === 'Enter' || e.key === 'Tab') && activeIndex >= 0) {
      e.preventDefault();
      selectItem(items[activeIndex]);
    } else if (e.key === 'Escape') {
      dropdown.hidden = true;
    }
  });

  straßeInput.addEventListener('blur', function () {
    setTimeout(function () { dropdown.hidden = true; }, 180);
  });
})();
