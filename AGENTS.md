# Publication rules

Never publish to production without the user’s explicit approval for the specific publication. Prepare and verify changes in drafts or local previews first.

The production site loads custom code from GitHub Pages. Pushing changes to the production branch or replacing assets at URLs already used by production also counts as a production publication and requires explicit approval.

# Styling conventions

Use rem for authored layout dimensions and typography, matching the existing sections (16px design baseline = 1rem). Keep the existing Webflow breakpoint thresholds in px, including mobile at 479px and below.
