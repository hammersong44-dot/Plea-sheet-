# Seventh JDC Plea Form

`PleaForm.html` is the static plea-form application published with GitHub Pages.

## Enable automatic statute import

Browsers cannot read `legis.la.gov` directly from GitHub Pages because the Legislature site does not provide cross-origin access. The included `statute-relay-worker.js` is a small Cloudflare Worker that only accepts read-only requests for Louisiana Legislature statute pages.

1. Create a Cloudflare Worker and paste in `statute-relay-worker.js`.
2. Deploy it and copy its public `https://...workers.dev` URL.
3. Add this line inside the `<head>` of `PleaForm.html`, replacing the example URL:

   ```html
   <meta name="plea-statute-relay" content="https://your-worker.workers.dev">
   ```

After that, searching for an offense and clicking **Use this charge** will import the official page, fill the charge title and citation, and populate the sentence automatically when the statute has a single recognized penalty paragraph. Statutes with multiple sentencing tiers remain a manual legal choice.

The relay sends only the public statute URL. It does not receive defendant, docket, or case information.
