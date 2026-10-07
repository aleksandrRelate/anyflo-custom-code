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

    /* The form's submit is an <input>, which can't hold the arrow icon — swap it for a
       <button> with the same SVG as the other buttons (Figma 793:4763) */
    footer.querySelectorAll('input[type="submit"].button').forEach(function (input) {
      var button = document.createElement('button');
      button.type = 'submit';
      button.className = input.className;
      if (input.dataset.wait) button.dataset.wait = input.dataset.wait;
      var label = document.createElement('div');
      label.textContent = input.value.replace(/\s*→\s*$/, '');
      button.appendChild(label);
      button.insertAdjacentHTML('beforeend',
        '<svg class="button_icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">' +
        '<path d="M2.92188 7H11.0885" stroke="currentColor" stroke-width="1.28333" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M7.57812 3.5L11.0781 7L7.57812 10.5" stroke="currentColor" stroke-width="1.28333" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      input.replaceWith(button);

      // keep Webflow's "Please wait..." state: the label shows it while sending,
      // and gets its text back if the error message appears
      var form = button.form;
      var fail = form && form.parentElement.querySelector('.w-form-fail');
      var text = label.textContent;
      if (form && button.dataset.wait) {
        form.addEventListener('submit', function () { label.textContent = button.dataset.wait; });
        if (fail && window.MutationObserver) {
          new MutationObserver(function () {
            if (fail.style.display === 'block') label.textContent = text;
          }).observe(fail, { attributes: true, attributeFilter: ['style'] });
        }
      }
    });

    // Let Webflow submit and hide the real form. The success background is a
    // decorative copy of its layout, never a second form or submitted data.
    footer.querySelectorAll('.footer_form-block').forEach(function (block) {
      var form = block.querySelector('form');
      var success = block.querySelector('.w-form-done');
      if (!form || !success || success.classList.contains('anyflo-form-success')) return;

      var backdrop = document.createElement('div');
      backdrop.className = form.className + ' anyflo-form-success-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.setAttribute('inert', '');
      Array.prototype.forEach.call(form.children, function (child) {
        if (child.matches('.form_row, .form_field, .form_fieldset, .form_buttons')) {
          backdrop.appendChild(child.cloneNode(true));
        }
      });
      backdrop.querySelectorAll('input, textarea, select, button, a').forEach(function (el) {
        var shape = document.createElement('div');
        shape.className = el.className;
        if (el.matches('[type="hidden"]')) { el.remove(); return; }
        if (el.matches('[type="checkbox"]')) {
          shape.classList.add('anyflo-form-success-checkbox');
        } else if (el.matches('button, a')) {
          shape.innerHTML = el.innerHTML;
        } else if (el.matches('[type="submit"]')) {
          shape.textContent = el.value.replace(/\s*→\s*$/, '');
        } else if (el.matches('textarea')) {
          shape.textContent = el.placeholder;
        }
        el.replaceWith(shape);
      });
      backdrop.querySelectorAll('*').forEach(function (el) {
        ['id', 'name', 'for', 'data-name', 'data-wait', 'tabindex'].forEach(function (attr) {
          el.removeAttribute(attr);
        });
      });

      var card = document.createElement('div');
      card.className = 'anyflo-form-success-card';
      card.innerHTML = '<div class="anyflo-form-success-copy">' +
        '<h3 class="anyflo-form-success-title">Thank you!<br>We’ll be in touch</h3>' +
        '<p class="anyflo-form-success-text">We’ve received your request. Our team will review the details and get back to you shortly.</p>' +
        '</div><a class="button is-small is-light anyflo-form-success-link" href="https://docs.anyflo.io/" target="_blank" rel="noopener">Explore API docs</a>';
      success.classList.add('anyflo-form-success');
      success.replaceChildren(backdrop, card);

      function measureForm() {
        if (form.getBoundingClientRect().height > 0) {
          block.style.setProperty('--anyflo-form-height', form.getBoundingClientRect().height + 'px');
        }
      }
      measureForm();
      if (window.ResizeObserver) new ResizeObserver(measureForm).observe(form);
      // Watch the native success state; a submit event alone may still fail.
      if (window.MutationObserver) {
        new MutationObserver(function () {
          var shown = window.getComputedStyle(success).display !== 'none';
          block.classList.toggle('anyflo-form-is-success', shown);
          if (shown && window.ScrollTrigger) ScrollTrigger.refresh();
        }).observe(success, { attributes: true, attributeFilter: ['style', 'hidden'] });
      }
    });
    var footerCard = footer.querySelector(':scope > .footer') || footer;
    var legalCard = Array.prototype.find.call(
      document.querySelectorAll('.home-card_wrapper'),
      function (el) { return !!el.querySelector('.legal_component'); }
    );
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Keep FAQ inside <main> and footer outside it. A single positioned layer
       covers both without moving their content or restarting the background. */
    var faq = document.querySelector('.section_home-faq');
    var host = footer.closest('.page-wrapper') || footer.parentElement;
    host.classList.add('anyflo-footer-host');
    var stage = document.createElement('div');
    stage.className = 'anyflo-footer-stage';
    var card = legalCard || footerCard;
    var bg = footer.querySelector('.anyflo-footer-background') || document.createElement('div');
    bg.className = 'anyflo-footer-background';
    bg.setAttribute('aria-hidden', 'true');
    var video = bg.querySelector('video') || document.createElement('video');
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
    if (legalCard) {
      stage = legalCard;
      stage.classList.add('anyflo-legal-shared-card');
    } else {
      footer.before(stage);
    }
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
      if (!video.getAttribute('src') && !video.querySelector('source[src]')) {
        video.src = ASSET_BASE + 'footer-animation.mp4';
      }
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
      // gradient strip under the card: on desktop it equals the side margin, so the
      // stopped card has the same frame on every screen; tablet/mobile keep 6rem
      var reveal = function () { return desktop ? card.offsetWidth * 0.05625 : rem(6); };
      var radius = desktop ? '2rem' : '1.5rem';

      // Only the shared surface is clipped. The footer is a scroll landmark,
      // with exactly the same exit range as Home, never a separate animated card.
      var entrySide = 0, entryRadius = 0;
      var state = { p: 0, e: legalCard ? 1 : 0 };
      function measureEntry() {
        if (!legalCard) return;
        ['maxWidth', 'marginLeft', 'marginRight', 'borderRadius'].forEach(function (key) {
          card.style[key] = '';
        });
        var cs = getComputedStyle(card);
        entrySide = Math.max(parseFloat(cs.marginLeft) || 0,
          (window.innerWidth - Math.min(card.offsetWidth, 1440)) / 2);
        entryRadius = parseFloat(cs.borderTopLeftRadius) || 0;
        card.style.maxWidth = 'none';
        card.style.marginLeft = card.style.marginRight = '0px';
        card.style.borderRadius = '0px';
      }
      measureEntry();

      // The bottom reveal occupies layout space, just as it does on Home.
      var setPad = function () {
        card.style.paddingBottom = reveal() + 'px';
        positionBackground();
      };
      setPad();

      function render() {
        var p = state.p;
        var r = reveal() * p;
        var inset = legalCard
          ? 'max(' + (entrySide * state.e) + 'px, calc(' + side + ' * ' + p + '))'
          : 'calc(' + side + ' * ' + p + ')';
        var corners = legalCard
          ? 'max(' + (entryRadius * state.e) + 'px, calc(' + radius + ' * ' + p + '))'
          : 'calc(' + radius + ' * ' + p + ')';
        card.style.clipPath = 'inset(0px ' + inset + ' ' + r + 'px ' + inset +
          ' round ' + corners + ')';
      }

      var enter = legalCard && ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        end: 'top top',
        onUpdate: function (self) { state.e = 1 - self.progress; render(); },
        onRefreshInit: measureEntry,
        onRefresh: function (self) { state.e = 1 - self.progress; render(); }
      });

      var tween = gsap.to(state, {
        p: 1,
        ease: 'none',
        onUpdate: render,
        scrollTrigger: {
          trigger: footerCard,
          endTrigger: card,
          start: 'top 50%',
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
        if (enter) enter.kill();
        if (legalCard) {
          ['maxWidth', 'marginLeft', 'marginRight', 'borderRadius'].forEach(function (key) {
            card.style[key] = '';
          });
        }
        card.style.clipPath = '';
        card.style.paddingBottom = '';
      };
    });
  });
})();
