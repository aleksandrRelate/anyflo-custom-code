/* anyflo-legal.js
 * Where: Page Settings → Before </body>  (legal pages, after anyflo-core.js)
 * Needs: .legal_toc (empty nav, may keep its "Contents" label) and the text in
 *        .legal_body — one Rich Text where every section starts with an h2
 * Note:  builds the contents column from the h2 headings, so adding, removing
 *        or renaming a section in the Rich Text updates it automatically
 */
(function () {
  function init() {
    var toc = document.querySelector('.legal_toc');
    var headings = document.querySelectorAll('.legal_body h2');
    if (!toc || !headings.length) return;

    toc.querySelectorAll('.legal_toc-link').forEach(function (a) { a.remove(); });
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'section-' + (i + 1);
      var link = document.createElement('a');
      link.className = 'legal_toc-link text-size-small';
      link.href = '#' + h.id;
      link.textContent = h.textContent.trim();
      toc.appendChild(link);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
