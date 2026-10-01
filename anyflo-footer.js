/* anyflo-footer.js
 * Where: Page Settings → Before </body>  (pages with the footer, after anyflo-core.js)
 * Needs: Anyflo core, gsap, ScrollTrigger  |  .footer_component
 * Note: one video background spans FAQ and footer; the white footer shrinks into a card
 */
(function () {
  var A = window.Anyflo;
  if (!A) { console.warn('[anyflo-footer] window.Anyflo not found — load anyflo-core.js first'); return; }

  var ASSET_BASE = 'https://aleksandrrelate.github.io/anyflo-custom-code/';

  A.ready(function () {
    var footer = document.querySelector('.footer_component');
    if (!footer || A.off('footer')) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Keep FAQ inside <main> and footer outside it. A single positioned layer
       covers both without moving their content or restarting the background. */
    var faq = document.querySelector('.section_home-faq');
    var host = footer.closest('.page-wrapper') || footer.parentElement;
    host.classList.add('anyflo-footer-host');
    var stage = document.createElement('div');
    stage.className = 'anyflo-footer-stage';
    var bg = document.createElement('div');
    bg.className = 'anyflo-footer-background';
    bg.setAttribute('aria-hidden', 'true');
    bg.style.backgroundImage = 'url("' + ASSET_BASE + 'footer-animation-poster.jpg")';
    var video = document.createElement('video');
    video.className = 'anyflo-footer-video';
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.loop = true;
    video.preload = 'none';
    video.poster = ASSET_BASE + 'footer-animation-poster.jpg';
    video.setAttribute('aria-hidden', 'true');
    bg.appendChild(video);
    host.appendChild(bg);
    footer.before(stage);
    stage.appendChild(footer);
    if (faq) faq.classList.add('anyflo-shared-background');

    function positionBackground() {
      var hostRect = host.getBoundingClientRect();
      var topRect = (faq || stage).getBoundingClientRect();
      var bottomRect = stage.getBoundingClientRect();
      bg.style.top = (topRect.top - hostRect.top + host.scrollTop) + 'px';
      bg.style.height = (bottomRect.bottom - topRect.top) + 'px';
    }
    positionBackground();
    if (window.ResizeObserver) {
      var resize = new ResizeObserver(positionBackground);
      resize.observe(host);
      resize.observe(stage);
      if (faq) resize.observe(faq);
    }
    window.addEventListener('resize', positionBackground);
    ScrollTrigger.addEventListener('refresh', positionBackground);

    /* Like the hero, force muted playback. Load only near the footer and
       pause off screen / in background tabs. Reduced motion keeps the poster. */
    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var inView = false;
    function syncVideo() {
      if (!inView || document.hidden || motion.matches || A.off('video')) {
        video.pause();
        if (motion.matches || A.off('video')) video.classList.remove('is-playing');
        return;
      }
      if (!video.getAttribute('src')) video.src = ASSET_BASE + 'footer-animation.mp4';
      var playing = video.play();
      if (playing && playing.catch) playing.catch(function () {});
    }
    video.addEventListener('playing', function () { video.classList.add('is-playing'); });
    if (window.IntersectionObserver) {
      var visibility = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        syncVideo();
      }, { rootMargin: '200px 0px' });
      visibility.observe(bg);
    } else {
      inView = true;
      syncVideo();
    }
    motion.addEventListener('change', syncVideo);
    document.addEventListener('visibilitychange', syncVideo);
    window.addEventListener('pointerdown', syncVideo, { passive: true });

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
      var setPad = function () {
        footer.style.paddingBottom = reveal() + 'px';
        positionBackground();
      };
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
