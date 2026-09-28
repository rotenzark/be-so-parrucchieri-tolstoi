/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'be-so-parrucchieri-tolstoi',
    /* WhatsApp dichiarato da loro (la targhetta del negozio, col simbolo): 349 189 2490 */
    whatsapp: {
      number: '393491892490',
      message: 'Ciao Sara, vorrei prendere un appuntamento.',
      ids: ['waTestata', 'waMenu', 'waApertura', 'waOrari', 'waOrari2', 'waPiede', 'waBarra'],
    },
    /* Google (28/9/2026): mercoledì–sabato 9–18; lunedì, martedì e domenica chiuso */
    hours: {
      0: [],
      1: [],
      2: [],
      3: [['09:00', '18:00']],
      4: [['09:00', '18:00']],
      5: [['09:00', '18:00']],
      6: [['09:00', '18:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Be.So Parrucchieri, back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.sara": "Sara",
      "n.colore": "Colour",
      "n.taglio": "Cut",
      "n.dicono": "Reviews",
      "n.orari": "Hours",
      "n.taglioPiega": "Cut and styling",
      "n.trattamenti": "Treatments",
      "n.orariDove": "Hours and where",
      "n.domande": "Questions",
      "t.scrivi": "Message on WhatsApp",
      "h.sopra": "Hairdresser · Via Leone Tolstoi 40, Milan",
      "h.titolo": "After years in Milan I’ve finally found my hairdresser!",
      "h.chi": "Anna Antonicelli, in a review on Google («Dopo anni a Milano finalmente ho trovato la mia parrucchiera!»)",
      "h.testo": "Be.So is Sara’s salon, at Via Leone Tolstoi 40, between the Giambellino and Piazza Napoli: cuts, styling, colour and treatments, by appointment. She photographs her work from behind: the way the hand mirror shows it to you, at the end.",
      "h.voto": "98 reviews on Google",
      "h.chiama": "Call",
      "sp.titolo": "The Be.So hand mirror, drawn",
      "sp.desc": "A black hand mirror with a silver rim, like the one the hairdresser holds up behind your head at the end. In the glass, a piece of the salon’s work seen from behind.",
      "sp.gira": "Turn the mirror",
      "s.etichetta": "Sara",
      "s.titolo": "In this very shop",
      "s.parole": "«Hi, I’m Sara, I’m 30 and I own this shop, which I took over in April 2023. I started this job at 16 in this very shop, and I put care and a lot of passion into my work. I like working with quality products to get a better result. Welcome to my salon🤗»",
      "s.chi": "Sara, the owner, on the salon’s Google listing (translated from Italian)",
      "s.f1": "years old: she started here, in this shop",
      "s.f2": "in April the salon became hers",
      "s.f3": "reviews on Google, all five stars",
      "a.vetrina": "The Be.So Parrucchieri shop front: the black sign with the name in white, the hanging sign, the plaque with the numbers and the opening hours sticker on the door.",
      "c.vetrina": "At number 40 Via Tolstoi: the black sign.",
      "c.etichetta": "Colour",
      "c.titolo": "Honey, copper, violet, glossy black",
      "c.testo": "Highlights, balayage and blending; dyes and toners; copper, violet on the ends, glossy black. And blonde.",
      "a.miele": "Honey-coloured waves, from behind, next to the salon’s glass shelves.",
      "c.miele": "Honey, on the waves",
      "a.schiariture": "Long hair with highlights, from behind, at the salon window.",
      "c.schiariture": "Highlights",
      "a.nero": "Straight, glossy black hair, seen from behind.",
      "c.nero": "Glossy black",
      "a.ramato": "Wavy copper hair with violet glints, a hand lifting it.",
      "c.ramato": "Copper, with violet glints",
      "a.sfumature": "A brown bob with lighter blending, a hand lifting it.",
      "c.sfumature": "Blending",
      "t.etichetta": "Cut and styling",
      "t.titolo": "Short or long, wavy or straight",
      "t.testo": "Short and long, curtain bangs, layers. Waves or a straight blow-dry, curly hair too. And haircuts for children.",
      "a.corto": "A short copper cut, with the comb setting the fringe.",
      "c.corto": "Short, copper",
      "a.onde": "Long brown hair with waves, from behind, at the salon window.",
      "c.onde": "Long waves",
      "a.nocciola": "Hazel waves, a hand lifting them.",
      "c.nocciola": "Hazel waves",
      "r.etichetta": "Treatments",
      "r.titolo": "Caring for your hair",
      "r.lam": "Lamination",
      "r.lamT": "for glossy, smooth hair.",
      "r.crespi": "Frizzy or damaged hair",
      "r.crespiT": "with the right treatments, collagen included.",
      "r.prodotti": "Products",
      "r.prodottiT": "to use at home: Sara recommends them, and she writes that she likes working with quality products.",
      "a.liscio": "Straight brown hair, healthy and glossy, a hand holding the strand.",
      "c.liscio": "Straight, brown",
      "a.lisciono": "Straight hazel hair, glossy, a hand stroking it.",
      "c.lisciono": "Straight, hazel",
      "d.etichetta": "Reviews",
      "d.titolo": "Finally, my hairdresser",
      "d.voto": "on Google, 98 reviews",
      "d.a1": "Google, a year ago",
      "d.a2": "Google, 2 years ago",
      "d.a3": "Google, 3 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian); cuts are marked […].",
      "d.tutte": "All the reviews on Google",
      "o.etichetta": "Hours and where",
      "o.titolo": "By appointment",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "o.prendi": "To book: <b>WhatsApp</b> <a id=\"waOrari\" href=\"https://wa.me/393491892490?text=Ciao%20Sara%2C%20vorrei%20prendere%20un%20appuntamento.\" target=\"_blank\" rel=\"noopener\" class=\"intero\">+39 349 189 2490</a> or <b>phone</b> <a href=\"tel:+39024223524\" class=\"intero\">+39 02 422 3524</a>.",
      "o.dove": "Via Leone Tolstoi 40, 20146 Milan, towards Piazza Napoli. <b>Tram 14</b> stops 100 metres away (Via Giambellino – Via Tolstoj); <b>M4 Tolstoj</b> is 250 metres away, <b>Bolivar</b> 400.",
      "o.mappa": "Map: Be.So Parrucchieri, Via Leone Tolstoi 40, Milan",
      "o.indicazioni": "Directions",
      "q.etichetta": "Questions",
      "q.titolo": "Before you come",
      "q.1": "How do I book an appointment?",
      "q.1r": "On WhatsApp at +39 349 189 2490 or by phone on +39 02 422 3524. By appointment only.",
      "q.2": "When are you open?",
      "q.2r": "Wednesday to Saturday, 9 am to 6 pm, by appointment.",
      "q.3": "Do you do curly hair?",
      "q.3r": "Yes: cutting curly hair and styling it too, wavy or straight.",
      "q.4": "Do you do lamination?",
      "q.4r": "Yes, and treatments for frizzy or damaged hair.",
      "q.5": "Do you cut children’s hair?",
      "q.5r": "Yes.",
      "q.6": "Where are you?",
      "q.6r": "At Via Leone Tolstoi 40, towards Piazza Napoli: tram 14 stops 100 metres away (Via Giambellino – Via Tolstoj), M4 Tolstoj is 250 metres away.",
      "z.frase": "Welcome to my salon.",
      "z.dove": "Via Leone Tolstoi 40, Milan",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos are the salon’s, from its Google listing (faces, advertising posters and brands are cropped or blurred); hours and reviews from Google (September 2026). We drew the hand mirror at the top.",
      "z.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ BE.SO PARRUCCHIERI — «Dopo anni a Milano finalmente ho trovato la mia parrucchiera!» ══════════
     La pagina è il loro negozio bianco e nero: l'insegna nera in testa e in fondo, ogni foto dei lavori in uno specchietto.
     la FIRMA — lo specchietto: di schiena e inclinato, si alza, si gira verso di te (scala orizzontale), nel vetro la foto
     si mette a fuoco; poi si inclina a sinistra e a destra (il riflesso resta dritto e scorre: parallasse) e un lampo di luce
     passa sul vetro. «Gira lo specchietto»: un giro intero (fronte, retro, fronte) e nel vetro c'è un altro lavoro (sei).
     Stato finale = l'HTML/SVG (il fronte, la prima foto). Senza JS: lo stato finale, niente bottone. Con reduced-motion: lo
     stato finale subito, e il giro cambia la foto senza animazione. L'attesa è la classe firma-attesa dell'head (lo
     specchietto di schiena, via CSS, solo dentro .spec__svg), tolta dall'head dopo 2,5 s se il codice non arriva. Un rAF a
     tempo: la firma non dipende da GSAP. I dati vengono da _bso_firma.mjs. */
  var DATI = {"tempi":{"alzata":650,"giro":700,"fuoco":800,"sfuocato":8,"inclina":[[0,0],[450,-7],[1000,6],[1400,0]],"lampo":600,"parallasse":4,"quarto":260,"lampoGira":500,"inizioGiro":650,"cambio":1000,"inizioInclina":1800,"inizioLampo":3000,"fine":3700},"lavori":[{"src":"img/spec-1.jpg","it":"Onde caramello","en":"Caramel waves"},{"src":"img/spec-2.jpg","it":"Viola sulle punte","en":"Violet on the ends"},{"src":"img/spec-3.jpg","it":"Rame sfumato","en":"Blended copper"},{"src":"img/spec-4.jpg","it":"Un corto, biondo","en":"A short cut, blonde"},{"src":"img/spec-5.jpg","it":"Onde cioccolato","en":"Chocolate waves"},{"src":"img/spec-6.jpg","it":"Lisci, con le schiariture","en":"Straight, with highlights"}],"attesa":{"y":26,"a":-9},"lampo":{"da":-560}};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraS = prendi('spec');
  var svgS = figuraS ? figuraS.querySelector('.spec__svg') : null;
  var corpoEl = prendi('specCorpo'), fronteEl = prendi('specFronte'), retroEl = prendi('specRetro');
  var riflessoEl = prendi('specRiflesso'), fotoEl = prendi('specFoto'), lampoEl = prendi('specLampo'), raggioEl = prendi('specFuocoRaggio');
  var nomeEl = prendi('specNome'), contaEl = prendi('specConta'), giraB = prendi('specGira'), leggiEl = prendi('specLeggi');
  var TS = DATI.tempi, LAVORI = DATI.lavori, ATT = DATI.attesa;
  var faseS = 'fatta', modoS = '', rafS = 0, guardiaS = 0, larghezzaAvvioS = 0, corseS = 0, indiceS = 0, pendente = -1;
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var esce = function (t) { return 1 - Math.pow(1 - t, 3); };
  var entra = function (t) { return t * t * t; };
  var dolce = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var PAROLE = { it: { di: ' di ', nello: 'Nello specchietto: ' }, en: { di: ' of ', nello: 'In the mirror: ' } };
  function linguaS() { return (root.getAttribute('lang') || 'it').slice(0, 2) === 'en' ? 'en' : 'it'; }
  /* la didascalia e il contatore seguono il lavoro nel vetro e la lingua */
  function scriviDidascalia(annuncia) {
    var L = linguaS(), lav = LAVORI[indiceS];
    nomeEl.textContent = lav[L];
    contaEl.textContent = (indiceS + 1) + PAROLE[L].di + LAVORI.length;
    if (annuncia && leggiEl) leggiEl.textContent = PAROLE[L].nello + lav[L] + ' (' + (indiceS + 1) + PAROLE[L].di + LAVORI.length + ')';
  }
  function mettiFoto(i) { indiceS = i; fotoEl.setAttribute('href', LAVORI[i].src); }
  function corpo(y, a, sx) { corpoEl.style.transform = 'translate(0px, ' + r3(y) + 'px) rotate(' + r3(a) + 'deg)' + (sx === 1 ? '' : ' scale(' + r3(sx) + ', 1)'); }
  function riflesso(a) { riflessoEl.style.transform = 'translate(' + r3(a * TS.parallasse) + 'px, 0px) rotate(' + r3(-a) + 'deg)'; }
  function lampo(p) { lampoEl.style.transform = 'translate(' + r3(DATI.lampo.da * (1 - dolce(p))) + 'px, 0px)'; }
  function faccia(retro) {
    if (retro) { retroEl.style.display = 'inline'; fronteEl.style.display = 'none'; }
    else { retroEl.style.display = 'none'; fronteEl.style.removeProperty('display'); }
  }
  function fuoco(r, op) {
    if (r > 0.05) { fotoEl.setAttribute('filter', 'url(#specFuoco)'); raggioEl.setAttribute('stdDeviation', r3(r)); }
    else { fotoEl.removeAttribute('filter'); raggioEl.setAttribute('stdDeviation', '0'); }
    if (op < 1) fotoEl.style.opacity = r3(op); else fotoEl.style.removeProperty('opacity');
  }
  function pulisciS(el) { if (!el) return; ['transform', 'opacity', 'display'].forEach(function (p) { el.style.removeProperty(p); }); if (!el.getAttribute('style')) el.removeAttribute('style'); }
  /* la guardia: se i fotogrammi smettono di arrivare per 1,5 s (scheda in background) lo specchietto va allo stato finale;
     si riarma a ogni fotogramma (#229) */
  function sorvegliaS() { clearTimeout(guardiaS); guardiaS = setTimeout(chiudiSpec, 1500); }
  function chiudiSpec() {
    cancelAnimationFrame(rafS); rafS = 0;
    clearTimeout(guardiaS);
    /* un giro interrotto prima del cambio porta comunque al lavoro successivo */
    if (pendente >= 0) { mettiFoto(pendente); pendente = -1; scriviDidascalia(true); }
    [corpoEl, fronteEl, retroEl, riflessoEl, lampoEl, fotoEl].forEach(pulisciS);
    fuoco(0, 1);
    figuraS.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseS = 'fatta';
  }
  /* l'inclinazione della presentazione: fotogrammi chiave [ms, gradi] con passaggi dolci */
  function inclinazione(t) {
    var K = TS.inclina;
    if (t <= K[0][0]) return K[0][1];
    for (var i = 1; i < K.length; i++) if (t <= K[i][0]) return K[i - 1][1] + (K[i][1] - K[i - 1][1]) * dolce((t - K[i - 1][0]) / (K[i][0] - K[i - 1][0]));
    return K[K.length - 1][1];
  }
  function fotogrammaIntro(t) {
    var y = 0, a = 0, sx = 1;
    if (t < TS.alzata) { var pa = esce(c01(t / TS.alzata)); y = ATT.y * (1 - pa); a = ATT.a * (1 - pa); }
    var meta = TS.giro / 2;
    if (t < TS.cambio) { if (t >= TS.inizioGiro) sx = 1 - entra(c01((t - TS.inizioGiro) / meta)); faccia(true); }
    else { sx = esce(c01((t - TS.cambio) / meta)); faccia(false); }
    if (t >= TS.inizioInclina) a = inclinazione(t - TS.inizioInclina);
    corpo(y, a, Math.max(0.001, sx));
    if (t >= TS.cambio) {
      var pf = c01((t - TS.cambio) / TS.fuoco);
      fuoco(TS.sfuocato * (1 - esce(pf)), c01((t - TS.cambio) / 300));
      riflesso(a);
    }
    if (t >= TS.inizioLampo) lampo(c01((t - TS.inizioLampo) / TS.lampo));
  }
  function fotogrammaGira(t) {
    var q = TS.quarto, giro = 4 * q, sx, retro;
    if (t < q) { sx = 1 - entra(c01(t / q)); retro = false; }
    else if (t < 2 * q) { sx = esce(c01((t - q) / q)); retro = true; }
    else if (t < 3 * q) { sx = 1 - entra(c01((t - 2 * q) / q)); retro = true; }
    else { sx = esce(c01((t - 3 * q) / q)); retro = false; }
    if (t >= 3 * q && pendente >= 0) { mettiFoto(pendente); pendente = -1; scriviDidascalia(true); }
    faccia(retro);
    var onda = t < giro ? Math.sin(Math.PI * t / giro) : 0;
    corpo(-10 * onda, 4 * onda, Math.max(0.001, sx));
    if (t >= 3 * q) { var pf = c01((t - 3 * q) / 420); fuoco(6 * (1 - esce(pf)), 1); riflesso(4 * onda); }
    var iL = giro - 60;
    if (t >= iL) lampo(c01((t - iL) / TS.lampoGira));
  }
  function avviaSpec(modo) {
    cancelAnimationFrame(rafS); rafS = 0;
    modoS = modo;
    if (modo === 'intro') {
      /* dalla classe d'attesa agli stili in linea senza cambiare un pixel: lo specchietto di schiena, inclinato */
      faccia(true);
      corpo(ATT.y, ATT.a, 1);
    }
    root.classList.remove('firma-attesa');
    faseS = 'corre'; figuraS.setAttribute('data-firma', 'corre');
    larghezzaAvvioS = window.innerWidth;
    var fine = modo === 'intro' ? TS.fine : 4 * TS.quarto - 60 + TS.lampoGira + 60;
    var t0 = null, corsa = ++corseS;
    function fotogramma(ts) {
      rafS = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseS !== 'corre' || corsa !== corseS) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      if (modo === 'intro') fotogrammaIntro(t); else fotogrammaGira(t);
      if (t >= fine) { chiudiSpec(); return; }
      sorvegliaS();
      rafS = requestAnimationFrame(fotogramma);
    }
    sorvegliaS();
    rafS = requestAnimationFrame(fotogramma);
  }
  /* «Gira lo specchietto»: il lavoro successivo (la foto si carica prima, mentre gira) */
  function gira() {
    var prossimo = ((pendente >= 0 ? pendente : indiceS) + 1) % LAVORI.length;
    if (faseS === 'corre' || root.classList.contains('firma-attesa')) chiudiSpec();
    try { var pre = new Image(); pre.src = LAVORI[prossimo].src; } catch (e) {}
    if (reducedMotion) { mettiFoto(prossimo); scriviDidascalia(true); return; }
    pendente = prossimo;
    avviaSpec('gira');
  }
  /* lo specchietto è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alto della finestra);
     l'altezza è quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaS() {
    if (!svgS) return false;
    var r = svgS.getBoundingClientRect();
    return abbastanza(r.top, r.bottom, r.height, altezzaVista());
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche nella sezione degli orari, col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);

  if (figuraS && svgS && corpoEl && fronteEl && retroEl && riflessoEl && fotoEl && lampoEl && raggioEl && nomeEl && contaEl && giraB && LAVORI.length) {
    try { clearTimeout(window.__attesaSpec); } catch (e) {}
    window.__spec = {
      stato: function () { return { fase: faseS, modo: modoS, corse: corseS, indice: indiceS, pendente: pendente, retro: retroEl.style.display === 'inline' }; },
      tempi: TS,
    };
    scriviDidascalia(false);
    var daFare = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancora = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaS();
    /* perché la firma è partita o no (lo legge il check) */
    window.__spec.avvio = { daFare: daFare, ancora: !!ancora, inVista: inVista, top: svgS.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFare || ancora) chiudiSpec();
    else if (inVista) avviaSpec('intro');
    else if ('IntersectionObserver' in window) {
      /* lo specchietto sotto la piega (telefoni): parte quando se ne vede abbastanza; fino ad allora resta di schiena */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioS = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioS.disconnect();
        if (faseS === 'fatta' && root.classList.contains('firma-attesa')) avviaSpec('intro');
      }, { threshold: soglie });
      ioS.observe(svgS);
      window.__spec.avvio.aspetta = true;
    } else chiudiSpec();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseS !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioS) <= 1) return;
      chiudiSpec();
    });
    giraB.addEventListener('click', gira);
    new MutationObserver(function () { scriviDidascalia(false); copiaStato(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }
})();
