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
     * 2. HERO — intro on page load: background → heading → text → buttons
     * ------------------------------------------------------------------ */
    mm.add(A.bp.motion, function () {
      if (A.off('hero')) return;
      var heading = document.querySelector('.home-hero_text .heading-style-h1');
      var subtext = document.querySelector('.home-hero_subtext');
      var buttons = gsap.utils.toArray('.home-hero_content .button-group .button');
      var bg = document.querySelector('.home-hero_background');
      var reveal = A.createReveal();
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.1 });

      if (bg) tl.from(bg, { autoAlpha: 0, scale: 1.08, rotate: -4, duration: 2, ease: 'power2.out' }, 0);
      reveal.revealText(tl, heading, 0.2);
      if (subtext) tl.from(subtext, { autoAlpha: 0, y: 20, duration: 1 }, 0.6);
      reveal.revealButtons(tl, buttons, 0.75);

      // slow drift of the background while the hero scrolls away
      var drift = bg ? gsap.to(bg, {
        yPercent: 12,
        rotate: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.section_home-hero', start: 'top top', end: 'bottom top', scrub: true }
      }) : null;

      return function () {
        tl.kill();
        if (drift) { drift.scrollTrigger.kill(); drift.kill(); }
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
    })();

    // fonts/images can shift layout after load — recalc trigger positions
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  });
})();
