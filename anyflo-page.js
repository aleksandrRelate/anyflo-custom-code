/* anyflo-page.js
 * Where: Page Settings → Before </body>  (Home, after anyflo-core.js)
 * Needs: Anyflo core, gsap, ScrollTrigger, SplitText, Lenis
 * Note:  Lenis (desktop/tablet), hero intro, section reveals, Platform tabs, FAQ
 */
(function () {
  var A = window.Anyflo;
  if (!A) { console.warn('[anyflo-page] window.Anyflo not found — load anyflo-core.js first'); return; }

  A.ready(function () {
    if (!window.gsap || !window.ScrollTrigger) {
      console.warn('[anyflo-page] GSAP / ScrollTrigger not found — enable them in Site settings → GSAP');
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    if (window.SplitText) gsap.registerPlugin(SplitText);

    var mm = A.mm;

    /* ------------------------------------------------------------------ *
     * 1. LENIS — smooth scroll on the GSAP ticker (off on mobile <=479px)
     * ------------------------------------------------------------------ */
    if (!A.off('lenis')) {
      var lenisMq = window.matchMedia('(max-width: 479px)');
      var lenisTick = null;

      var startLenis = function () {
        if (!window.Lenis || window.lenis) return;
        var lenis = new Lenis({ lerp: 0.14, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        lenisTick = function (time) { lenis.raf(time * 1000); };
        gsap.ticker.add(lenisTick);
        gsap.ticker.lagSmoothing(0);
        window.lenis = lenis;
      };

      var stopLenis = function () {
        if (!window.lenis) return;
        if (lenisTick) { gsap.ticker.remove(lenisTick); lenisTick = null; }
        window.lenis.destroy();
        window.lenis = null;
        gsap.ticker.lagSmoothing(500, 33);
        ScrollTrigger.refresh();
      };

      var syncLenis = function () { lenisMq.matches ? stopLenis() : startLenis(); };
      syncLenis();
      lenisMq.addEventListener('change', syncLenis);

      // anchor links (#platform, #faq, …) go through Lenis
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link || !window.lenis) return;
        var id = link.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        window.lenis.scrollTo(target, { offset: 0, duration: 1.2 });
      });
    }

    /* ------------------------------------------------------------------ *
     * 1c. HERO VIDEO — Webflow strips the `muted` attribute on publish and
     * browsers block unmuted autoplay, so mute + play from JS.
     * Reduced motion: keep the poster, don't play.
     * ------------------------------------------------------------------ */
    (function () {
      var video = document.querySelector('.home-hero_video');
      if (!video || A.off('video')) return;
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.removeAttribute('autoplay');
        video.pause();
        return;
      }
      var play = function () {
        var p = video.play();
        if (p && p.catch) p.catch(function () {
          // still blocked (e.g. iOS Low Power Mode) — retry on first user interaction
          var retry = function () { video.play().catch(function () {}); };
          ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(function (evt) {
            window.addEventListener(evt, retry, { once: true, passive: true });
          });
        });
      };
      if (video.readyState >= 2) play();
      else video.addEventListener('canplay', play, { once: true });
      play();
    })();

    /* ------------------------------------------------------------------ *
     * 2. HERO — intro on page load: background fade → heading → text → buttons
     * Hero + section reveals wait for web fonts: SplitText measures lines
     * with the real font, otherwise headings break into wrong lines.
     * ------------------------------------------------------------------ */
    A.fontsReady(function () {
    mm.add(A.bp.motion, function () {
      if (A.off('hero')) return;
      var heading = document.querySelector('.home-hero_text .heading-style-h1');
      var subtext = document.querySelector('.home-hero_subtext');
      var buttons = gsap.utils.toArray('.home-hero_content .button-group .button');
      var bg = document.querySelector('.home-hero_background');
      var reveal = A.createReveal();
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });

      if (bg) tl.from(bg, { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0);
      reveal.revealText(tl, heading, 0.2);
      if (subtext) tl.from(subtext, { autoAlpha: 0, y: 20, duration: 1 }, 0.6);
      reveal.revealButtons(tl, buttons, 0.75);

      return function () {
        tl.kill();
        reveal.destroy();
      };
    });

    /* ------------------------------------------------------------------ *
     * 3. SECTION REVEALS — headers by words, cards/blocks staggered
     * ------------------------------------------------------------------ */
    var sections = [
      { el: '.section_home-platform', text: '.heading-style-h2', items: '.home-platform_visual, .home-platform_tab' },
      { el: '.section_home-use-cases', text: '.heading-style-h2', items: '.home-use-cases_card' },
      { el: '.section_home-reasons', text: '.heading-style-h2', items: '.home-reasons_card' },
      { el: '.section_home-reliable', text: '.heading-style-h2', items: '.home-reliable_card' },
      { el: '.section_home-poc', text: '.heading-style-h2', items: '.home-poc_image, .home-poc_step' },
      { el: '.section_home-api', text: '.heading-style-h3', items: '.home-api_paragraph, .home-api_code-window', buttons: '.button' },
      { el: '.section_home-leadership', text: '.heading-style-h2', items: '.home-leadership_item, .home-leadership_separator' },
      { el: '.section_home-faq', text: '.heading-style-h3', items: '.home-faq_card' },
      { el: '.footer_component', text: '.heading-style-h1', items: '.footer_paragraph, .footer_form-wrapper' }
    ];

    mm.add(A.bp.motion, function () {
      if (A.off('reveal')) return;
      var reveal = A.createReveal();

      sections.forEach(function (cfg) {
        var section = document.querySelector(cfg.el);
        if (!section) return;
        var tl = reveal.timelineFor(section, 'top 75%');
        var tagline = section.querySelector('.text-style-tagline');
        if (tagline) tl.from(tagline, { autoAlpha: 0, y: 12, duration: 0.6 }, 0);
        reveal.revealText(tl, section.querySelector(cfg.text), 0.05);
        if (cfg.buttons) reveal.revealButtons(tl, section.querySelectorAll(cfg.buttons), 0.5);

        // items get their own trigger so long sections reveal while scrolling
        var items = section.querySelectorAll(cfg.items);
        if (items.length) {
          var itemsTl = reveal.timelineFor(items[0], 'top 85%');
          reveal.revealItems(itemsTl, items, 0);
        }
      });

      return function () { reveal.destroy(); };
    });

    A.loaded(); // intro is set up (or motion is reduced) — show the hero
    });

    /* ------------------------------------------------------------------ *
     * 4. PLATFORM TABS — autoplay with progress bar, click to switch
     * ------------------------------------------------------------------ */
    (function () {
      var root = document.querySelector('[data-platform-tabs]');
      if (!root || A.off('tabs')) return;
      var tabs = gsap.utils.toArray(root.querySelectorAll('[data-platform-tab]'));
      var image = document.querySelector('.home-platform_image');
      if (!tabs.length) return;

      var DURATION = 6;
      var current = -1;
      var progressTween = null;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function setActive(index) {
        if (index === current) return;
        current = index;
        tabs.forEach(function (tab, i) {
          var active = i === index;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', active ? 'true' : 'false');
          var bar = tab.querySelector('.home-platform_tab-progress');
          if (bar && !active) gsap.set(bar, { scaleX: 0 });
        });

        if (image && !reduced) {
          gsap.fromTo(image,
            { autoAlpha: 0, y: 20, scale: 0.97 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', overwrite: true });
        }

        if (progressTween) progressTween.kill();
        var bar = tabs[index].querySelector('.home-platform_tab-progress');
        if (!bar) return;
        if (reduced) { gsap.set(bar, { scaleX: 1 }); return; }
        progressTween = gsap.fromTo(bar, { scaleX: 0 }, {
          scaleX: 1,
          duration: DURATION,
          ease: 'none',
          paused: !inView,
          onComplete: function () { setActive((current + 1) % tabs.length); }
        });
      }

      var inView = false;
      ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        end: 'bottom 15%',
        onToggle: function (self) {
          inView = self.isActive;
          if (!progressTween) return;
          inView ? progressTween.play() : progressTween.pause();
        }
      });

      root.setAttribute('role', 'tablist');
      tabs.forEach(function (tab, i) {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('tabindex', '0');
        tab.addEventListener('click', function () { setActive(i); });
        tab.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(i); }
        });
      });

      setActive(0);
    })();

    /* ------------------------------------------------------------------ *
     * 5. FAQ — accordion. Works with or without answers:
     *    an answer is the .home-faq_answer element right after the item.
     * ------------------------------------------------------------------ */
    (function () {
      var items = gsap.utils.toArray('[data-faq-item]');
      if (!items.length || A.off('faq')) return;

      function close(item) {
        item.classList.remove('is-active');
        item.setAttribute('aria-expanded', 'false');
        var answer = item.nextElementSibling;
        if (answer && answer.classList.contains('home-faq_answer')) {
          gsap.to(answer, { height: 0, duration: 0.5, ease: 'power3.inOut', onComplete: function () { ScrollTrigger.refresh(); } });
        }
      }

      function open(item) {
        item.classList.add('is-active');
        item.setAttribute('aria-expanded', 'true');
        var answer = item.nextElementSibling;
        if (answer && answer.classList.contains('home-faq_answer')) {
          gsap.to(answer, { height: 'auto', duration: 0.5, ease: 'power3.inOut', onComplete: function () { ScrollTrigger.refresh(); } });
        }
      }

      items.forEach(function (item) {
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-expanded', 'false');
        function toggle() {
          var isOpen = item.classList.contains('is-active');
          items.forEach(function (other) { if (other !== item && other.classList.contains('is-active')) close(other); });
          isOpen ? close(item) : open(item);
        }
        item.addEventListener('click', toggle);
        item.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        });
      });

      // first question starts open (instantly, no animation)
      var first = items[0];
      var firstAnswer = first.nextElementSibling;
      first.classList.add('is-active');
      first.setAttribute('aria-expanded', 'true');
      if (firstAnswer && firstAnswer.classList.contains('home-faq_answer')) {
        gsap.set(firstAnswer, { height: 'auto' });
      }
    })();

    /* ------------------------------------------------------------------ *
     * 6. LEADERSHIP BIO POPUP — .home-leadership_link[i] opens [data-leader-modal][i]
     *    Close: overlay click, Esc. Lenis is paused while a popup is open.
     * ------------------------------------------------------------------ */
    (function () {
      var links = gsap.utils.toArray('.home-leadership_link');
      var modals = gsap.utils.toArray('[data-leader-modal]');
      if (!links.length || !modals.length || A.off('modal')) return;
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var openModal = null;
      var lastFocus = null;

      // move popups to <body> so no transformed/clipped parent affects position:fixed
      modals.forEach(function (modal) { document.body.appendChild(modal); });

      function open(modal) {
        if (openModal) close(true);
        openModal = modal;
        lastFocus = document.activeElement;
        var overlay = modal.querySelector('.leader-modal_overlay');
        var card = modal.querySelector('.leader-modal_card');
        modal.style.display = 'flex';
        if (window.lenis) window.lenis.stop();
        document.documentElement.style.overflow = 'hidden';
        gsap.killTweensOf([overlay, card]);
        if (reduced) {
          gsap.set([overlay, card], { autoAlpha: 1, y: 0, scale: 1 });
        } else {
          gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: 'power2.out' });
          gsap.fromTo(card, { autoAlpha: 0, y: 40, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power4.out' });
        }
        card.focus({ preventScroll: true });
      }

      function close(instant) {
        var modal = openModal;
        if (!modal) return;
        openModal = null;
        var overlay = modal.querySelector('.leader-modal_overlay');
        var card = modal.querySelector('.leader-modal_card');
        function done() {
          modal.style.display = 'none';
          document.documentElement.style.overflow = '';
          if (window.lenis) window.lenis.start();
          if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
        }
        gsap.killTweensOf([overlay, card]);
        if (instant || reduced) { done(); return; }
        gsap.to(card, { autoAlpha: 0, y: 24, scale: 0.98, duration: 0.3, ease: 'power2.in' });
        gsap.to(overlay, { autoAlpha: 0, duration: 0.3, ease: 'power2.in', onComplete: done });
      }

      links.forEach(function (link, i) {
        var modal = modals[i];
        if (!modal) return;
        link.setAttribute('role', 'button');
        link.setAttribute('aria-haspopup', 'dialog');
        link.addEventListener('click', function (e) { e.preventDefault(); open(modal); });
      });

      modals.forEach(function (modal) {
        modal.querySelectorAll('[data-leader-close]').forEach(function (el) {
          el.addEventListener('click', function () { close(); });
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && openModal) close();
      });
    })();

    /* ------------------------------------------------------------------ *
     * 7. BACKGROUND COLOR TRANSITIONS (ref: wearecollins.com)
     *    cream → black on PoC (dark through API), black → white on Leadership,
     *    white → cream on FAQ.
     *    Sections are made transparent from JS so the Designer keeps its colors.
     * ------------------------------------------------------------------ */
    mm.add(A.bp.motion, function () {
      if (A.off('bg')) return;
      var wrapper = document.querySelector('.page-wrapper');
      var card = document.querySelector('.home-card_wrapper');
      var dark = gsap.utils.toArray('.section_home-poc, .section_home-api');
      var leadership = document.querySelector('.section_home-leadership');
      var faq = document.querySelector('.section_home-faq');
      var faqBg = document.querySelector('.anyflo-footer-background'); // cream layer under FAQ + footer
      if (!wrapper || !dark.length) return;

      var css = getComputedStyle(document.documentElement);
      var BLACK = css.getPropertyValue('--base-colors--black').trim() || '#000000';
      var WHITE = css.getPropertyValue('--base-colors--white').trim() || '#ffffff';
      var CREAM = getComputedStyle(wrapper).backgroundColor;
      var CARD = card ? getComputedStyle(card).backgroundColor : WHITE;

      var transparent = dark.concat(leadership ? [leadership] : []);
      transparent.forEach(function (el) { el.style.backgroundColor = 'transparent'; });

      // Timed (not scrubbed): when a boundary section reaches the middle of the viewport
      // the colors switch over DURATION; scrolling back past it switches them back.
      var DURATION = 0.8;
      if (faqBg && faq) faqBg.style.backgroundColor = 'transparent';

      function paint(pageColor, cardColor) {
        gsap.to(wrapper, { backgroundColor: pageColor, duration: DURATION, ease: 'power2.inOut', overwrite: 'auto' });
        if (card) gsap.to(card, { backgroundColor: cardColor, duration: DURATION, ease: 'power2.inOut', overwrite: 'auto' });
      }

      // [trigger, colors after crossing (down), colors before crossing (up)]
      var stops = [
        [dark[0], [BLACK, BLACK], [CREAM, CARD]],      // PoC — cream → black
        [leadership, [WHITE, BLACK], [BLACK, BLACK]],  // Leadership — black → white
        [faq, [CREAM, BLACK], [WHITE, BLACK]]          // FAQ — white → cream
      ].filter(function (s) { return s[0]; });

      var triggers = stops.map(function (s) {
        return ScrollTrigger.create({
          trigger: s[0],
          start: 'top 50%',
          onEnter: function () { paint(s[1][0], s[1][1]); },
          onLeaveBack: function () { paint(s[2][0], s[2][1]); }
        });
      });

      // correct colors on load / refresh when the page opens mid-scroll
      function sync() {
        var y = window.scrollY + window.innerHeight * 0.5, page = CREAM, cardC = CARD;
        stops.forEach(function (s) {
          if (s[0].getBoundingClientRect().top + window.scrollY <= y) { page = s[1][0]; cardC = s[1][1]; }
        });
        gsap.set(wrapper, { backgroundColor: page });
        if (card) gsap.set(card, { backgroundColor: cardC });
      }
      sync();

      return function () {
        triggers.forEach(function (t) { t.kill(); });
        gsap.killTweensOf([wrapper, card]);
        if (faqBg) faqBg.style.backgroundColor = '';
        transparent.forEach(function (el) { el.style.backgroundColor = ''; });
        wrapper.style.backgroundColor = '';
        if (card) card.style.backgroundColor = '';
      };
    });

    // fonts/images can shift layout after load — recalc trigger positions
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });
})();
