/* anyflo-navbar.js
 * Where: Page Settings → Before </body>  (all pages, after anyflo-core.js)
 * Needs: Anyflo core, gsap, ScrollTrigger  |  .navbar_component, [data-navbar-theme="dark"]
 * Note:  hides on scroll down, shows on scroll up, switches to dark theme over dark sections
 */
(function () {
  var A = window.Anyflo;
  if (!A) { console.warn('[anyflo-navbar] window.Anyflo not found — load anyflo-core.js first'); return; }

  A.ready(function () {
    var nav = document.querySelector('.navbar_component');
    if (!nav || A.off('navbar')) return;
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    var SCROLLED_AT = 40;     // px before the navbar gets its background
    var HIDE_AFTER = 400;     // px before hide-on-scroll-down kicks in

    /* ---- scrolled state + hide on scroll down / show on scroll up ---- */
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: function (self) {
        var y = self.scroll();
        nav.classList.toggle('is-scrolled', y > SCROLLED_AT);
        var hide = self.direction === 1 && y > HIDE_AFTER && !nav.contains(document.activeElement);
        nav.classList.toggle('is-hidden', hide);
      }
    });

    /* ---- dark theme while the navbar overlaps a dark section ---- */
    var darkSections = gsap.utils.toArray('[data-navbar-theme="dark"], .section_home-poc');
    var activeDark = 0;
    darkSections.forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: function () { return 'top ' + nav.offsetHeight / 2; },
        end: function () { return 'bottom ' + nav.offsetHeight / 2; },
        onToggle: function (self) {
          activeDark += self.isActive ? 1 : -1;
          nav.classList.toggle('is-dark', activeDark > 0);
        }
      });
    });
  });
})();
