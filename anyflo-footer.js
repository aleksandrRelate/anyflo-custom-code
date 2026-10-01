/* anyflo-footer.js
 * Where: Page Settings → Before </body>  (pages with the footer, after anyflo-core.js)
 * Needs: Anyflo core, gsap, ScrollTrigger  |  .footer_component
 * Note:  on scroll the white footer shrinks into a rounded card and reveals a gradient below
 */
(function () {
  var A = window.Anyflo;
  if (!A) { console.warn('[anyflo-footer] window.Anyflo not found — load anyflo-core.js first'); return; }

  var BG_IMAGE = 'https://cdn.prod.website-files.com/6abcea1f3eb451232bbfd821/6abe2ab19caf32fcbb1ea9a3_hero-bg-poster.png';

  A.ready(function () {
    var footer = document.querySelector('.footer_component');
    if (!footer || A.off('footer')) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* ---- wrap the footer in a stage that carries the gradient ---- */
    var stage = document.createElement('div');
    stage.className = 'anyflo-footer-stage';
    var bg = document.createElement('img');
    bg.className = 'anyflo-footer-stage_bg';
    bg.src = BG_IMAGE;
    bg.alt = '';
    bg.setAttribute('aria-hidden', 'true');
    bg.loading = 'lazy';
    footer.before(stage);
    stage.appendChild(bg);
    stage.appendChild(footer);

    function rem(n) {
      return n * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    A.mm.add({
      desktop: A.bp.desktop + ' and ' + A.bp.motion,
      tablet: '(max-width: 991px) and ' + A.bp.motion
    }, function (ctx) {
      var desktop = ctx.conditions.desktop;
      var side = desktop ? '5.625%' : '1rem';                 // card side margin (90px / 1600 in Figma)
      var reveal = function () { return rem(desktop ? 11.8 : 6); }; // gradient strip under the card (~189px)
      var radius = desktop ? '2rem' : '1.5rem';

      // extra white space at the bottom of the footer — it gets clipped away to reveal the gradient
      var setPad = function () { footer.style.paddingBottom = reveal() + 'px'; };
      setPad();

      var state = { p: 0 };
      function render() {
        var p = state.p;
        var r = reveal() * p;
        footer.style.clipPath =
          'inset(0px calc(' + side + ' * ' + p + ') ' + r + 'px calc(' + side + ' * ' + p + ') ' +
          'round calc(' + radius + ' * ' + p + '))';
      }

      var tween = gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: stage,
          start: 'top 40%',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: function () { setPad(); render(); }
        }
      });
      render();

      return function () {
        tween.scrollTrigger.kill();
        tween.kill();
        footer.style.clipPath = '';
        footer.style.paddingBottom = '';
      };
    });
  });
})();
