/* Swiper 14.3.0 Cards — only phones <=479px; native cards remain a grid above. */
(function () {
  function ready() {
    var host = document.querySelector('.use-cases_swiper');
    if (!host || !window.Swiper) return;
    var wrapper = host.querySelector('.use-cases_cards');
    var slides = Array.from(wrapper.querySelectorAll('.use-cases_slide'));
    var component = host.closest('.use-cases_component');
    var segments = Array.from(component.querySelectorAll('.use-cases_segment'));
    var phone = window.matchMedia('(max-width: 479px)');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var swiper = null, visible = false;
    function pagination(index, progress) {
      segments.forEach(function (button, i) {
        var active = i === index;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-current', active ? 'true' : 'false');
        button.querySelector('.use-cases_progress').style.transform = 'scaleX(' + (active ? progress : 0) + ')';
      });
    }
    function playback() {
      if (!swiper) return;
      if (visible && !document.hidden && !reduced.matches && !component.contains(document.activeElement)) {
        if (!swiper.autoplay.running) swiper.autoplay.start();
        else if (swiper.autoplay.paused) swiper.autoplay.resume();
      } else if (swiper.autoplay.running) swiper.autoplay.pause();
    }
    function sync() {
      if (!phone.matches) {
        if (swiper) { swiper.destroy(true, true); swiper = null; }
        host.classList.remove('swiper');
        wrapper.classList.remove('swiper-wrapper');
        slides.forEach(function (slide) { slide.classList.remove('swiper-slide'); });
        return;
      }
      if (swiper) { swiper.params.speed = reduced.matches ? 0 : 500; playback(); return; }
      host.classList.add('swiper');
      wrapper.classList.add('swiper-wrapper');
      slides.forEach(function (slide) { slide.classList.add('swiper-slide'); });
      swiper = new Swiper(host, {
        effect: 'cards', grabCursor: true, rewind: true,
        speed: reduced.matches ? 0 : 500,
        cardsEffect: { perSlideOffset: 8, perSlideRotate: 1, slideShadows: false },
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        a11y: { enabled: true, containerMessage: 'Anyflo use cases' },
        keyboard: { enabled: true, onlyInViewport: true },
        on: {
          init: function (s) { pagination(s.realIndex, reduced.matches ? 1 : 0); },
          slideChange: function (s) { pagination(s.realIndex, reduced.matches ? 1 : 0); },
          autoplayTimeLeft: function (s, time, remaining) { pagination(s.realIndex, 1 - remaining); }
        }
      });
      playback();
    }
    segments.forEach(function (button, i) {
      button.setAttribute('role', 'button');
      button.setAttribute('tabindex', '0');
      button.addEventListener('keydown', function (event) {
        if (event.key === ' ') { event.preventDefault(); button.click(); }
      });
      button.addEventListener('click', function (event) {
        event.preventDefault();
        if (event.detail > 0) button.blur();
        if (!swiper) return;
        swiper.slideTo(i);
        pagination(i, reduced.matches ? 1 : 0);
        if (swiper.autoplay.running) { swiper.autoplay.stop(); playback(); }
      });
    });
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        playback();
      }, { threshold: 0.2 }).observe(host);
    } else visible = true;
    phone.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', playback);
    component.addEventListener('focusin', playback);
    component.addEventListener('focusout', function () { requestAnimationFrame(playback); });
    sync();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true });
  else ready();
})();
