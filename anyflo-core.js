/* anyflo-core.js
 * Where: Page Settings → Before </body>  (load FIRST among anyflo-*.js)
 * Needs: gsap, ScrollTrigger, SplitText (Webflow GSAP integration)
 * Note:  exposes window.Anyflo — shared matchMedia, ready(), reveal factory
 */
(function () {
  var A = window.Anyflo || (window.Anyflo = {});

  /* ---- perf kill-switch: ?perf=<name>[,<name>] or ?perf=all ---- */
  A.off = (function () {
    try {
      var raw = (new URLSearchParams(location.search).get('perf') || '').toLowerCase();
      var set = {};
      raw.split(',').forEach(function (k) { k = k.trim(); if (k) set[k] = true; });
      return function (name) { return !!(set[name] || set.all); };
    } catch (e) {
      return function () { return false; };
    }
  })();

  /* ---- shared gsap.matchMedia ---- */
  Object.defineProperty(A, 'mm', {
    configurable: true,
    get: function () {
      if (!this._mm && window.gsap) this._mm = gsap.matchMedia();
      return this._mm;
    }
  });

  /* ---- breakpoints (match Webflow) ---- */
  A.bp = {
    motion: '(prefers-reduced-motion: no-preference)',
    desktop: '(min-width: 992px)',
    tablet: '(max-width: 991px)',
    mobile: '(max-width: 767px)'
  };

  /* ---- DOM ready ---- */
  A.ready = function (fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  /* ------------------------------------------------------------------ *
   * Anyflo.createReveal() — reveal context for one or more sections.
   * Words 0.6s / stagger 0.04s; buttons slide in from above through a mask.
   * Returns { timelineFor, revealText, revealItems, revealButtons, destroy }.
   * Call destroy() from the cleanup of Anyflo.mm.add(...).
   * ------------------------------------------------------------------ */
  A.createReveal = function () {
    var splits = [];
    var timelines = [];

    function timelineFor(trigger, start) {
      var tl = gsap.timeline({
        defaults: { ease: 'power4.out' },
        scrollTrigger: { trigger: trigger, start: start || 'top 80%', once: true }
      });
      timelines.push(tl);
      return tl;
    }

    function revealText(tl, element, position) {
      if (!element || !window.SplitText) return;
      var split = SplitText.create(element, {
        type: 'lines,words',
        linesClass: 'anyflo-reveal-line'
      });
      splits.push(split);
      gsap.set(split.words, { yPercent: 105 });
      tl.to(split.words, {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.04,
        force3D: true
      }, position || 0);
    }

    function revealItems(tl, items, position, vars) {
      items = gsap.utils.toArray(items);
      if (!items.length) return;
      tl.from(items, Object.assign({
        autoAlpha: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.08,
        clearProps: 'transform,opacity,visibility'
      }, vars || {}), position);
    }

    function maskButton(button) {
      if (button.parentElement.classList.contains('anyflo-button-mask')) return;
      var mask = document.createElement('div');
      mask.className = 'anyflo-button-mask';
      var style = getComputedStyle(button);
      mask.style.alignSelf = style.alignSelf;
      mask.style.flex = style.flex;
      button.before(mask);
      mask.appendChild(button);
    }

    function revealButtons(tl, buttons, position) {
      buttons = gsap.utils.toArray(buttons);
      if (!buttons.length) return;
      buttons.forEach(maskButton);
      gsap.set(buttons, { yPercent: -110 });
      tl.to(buttons, { yPercent: 0, duration: 0.9, stagger: 0.1, force3D: true }, position);
    }

    function destroy() {
      timelines.forEach(function (tl) {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      });
      splits.forEach(function (split) { split.revert(); });
      timelines.length = 0;
      splits.length = 0;
    }

    return {
      timelineFor: timelineFor,
      revealText: revealText,
      revealItems: revealItems,
      revealButtons: revealButtons,
      destroy: destroy
    };
  };
})();
