/* anyflo-legal.js
 * Where: Page Settings → Before </body>  (legal pages, after anyflo-core.js)
 * Needs: an empty .legal_component in the white card; optional data-legal-content="<file>.md"
 *        (defaults to terms-of-service.md)
 * Note:  renders the contents list + sections from a markdown file in this repo,
 *        so the text is edited in the .md, not in Webflow
 *
 * Markdown format (anything before the first "## " is ignored — it lives in the hero):
 *   ## 1. Section title
 *   1.1 Clause text
 *   - (a) Sub-clause text
 *   Plain line                      → clause without a number
 *   [text](mailto:…) / [text](url)  → link
 */
(function () {
  var script = document.currentScript;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function inline(s) {
    return esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" class="legal_link">$1</a>');
  }
  function clause(num, text, sub) {
    return '<div class="legal_clause' + (sub ? ' is-sub' : '') + '">' +
      '<p class="text-size-medium legal_clause-number">' + (num ? esc(num) : '&nbsp;') + '</p>' +
      '<p class="text-size-medium">' + inline(text) + '</p></div>';
  }

  function render(md) {
    var toc = '', body = '', n = 0, open = false;
    md.replace(/\r/g, '').split('\n').forEach(function (raw) {
      var line = raw.trim(), m;
      if (!line) return;
      if ((m = line.match(/^##\s+(.+)$/))) {
        if (open) body += '</div>';
        n += 1; open = true;
        toc += '<a href="#section-' + n + '" class="legal_toc-link text-size-small">' + esc(m[1]) + '</a>';
        body += '<div class="legal_section" id="section-' + n + '"><h2 class="heading-style-h5">' + esc(m[1]) + '</h2>';
        return;
      }
      if (!open) return; // intro / title — shown in the hero
      if ((m = line.match(/^-\s+(\([a-z0-9]+\))\s+(.+)$/i))) body += clause(m[1], m[2], true);
      else if ((m = line.match(/^(\d+(?:\.\d+)+)\s+(.+)$/))) body += clause(m[1], m[2], false);
      else body += clause('', line.replace(/^-\s+/, ''), false);
    });
    if (open) body += '</div>';
    return '<nav class="legal_toc"><p class="text-style-tagline">Contents</p>' + toc + '</nav>' +
      '<div class="legal_body">' + body + '</div>';
  }

  function init() {
    var el = document.querySelector('[data-legal-content], .legal_component');
    if (!el) return;
    // the .md sits next to this script; reuse its ?v= so both update together
    var base = script && script.src ? script.src : location.href;
    var url = new URL(el.getAttribute('data-legal-content') || 'terms-of-service.md', base);
    if (script && script.src) url.search = new URL(script.src).search;

    fetch(url.href)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (md) {
        el.innerHTML = render(md);
        if (window.ScrollTrigger) ScrollTrigger.refresh(); // footer card triggers depend on the page height
        if (location.hash) {
          var target = document.querySelector(location.hash);
          if (target) target.scrollIntoView();
        }
      })
      .catch(function (e) { console.warn('[anyflo-legal] could not load ' + url.href, e); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
