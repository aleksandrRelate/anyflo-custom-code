/* anyflo-legal.js
 * Where: Page Settings → Before </body>  (legal pages, after anyflo-core.js)
 * Needs: .legal_toc (empty nav, may keep its "Contents" label) and .legal_body with
 *        .legal_section > h2 blocks — the text itself is edited in Webflow
 * Note:  builds the contents column from the section headings, so adding,
 *        removing or renaming a section in Webflow updates it automatically
 */
(function () {
  function init() {
    var toc = document.querySelector('.legal_toc');
    var headings = document.querySelectorAll('.legal_body .legal_section > h2');
    if (!toc || !headings.length) return;

    toc.querySelectorAll('.legal_toc-link').forEach(function (a) { a.remove(); });
    headings.forEach(function (h, i) {
      var section = h.parentElement;
      if (!section.id) section.id = 'section-' + (i + 1);
      var link = document.createElement('a');
      link.className = 'legal_toc-link text-size-small';
      link.href = '#' + section.id;
      link.textContent = h.textContent.trim();
      toc.appendChild(link);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
