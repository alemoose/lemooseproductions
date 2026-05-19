# Lemoose Productions: Performance, SEO & Accessibility Fix Plan

## Context

Stack: Vite + React. Hosted at lemooseproductions.com. Current PageSpeed Insights scores:

| | Mobile | Desktop |
|---|---|---|
| Performance | 73 | 98 |
| Accessibility | 95 | 95 |
| Best Practices | 100 | 100 |
| SEO | 83 | 83 |

Target after this plan: 90+ mobile / 100 desktop Performance, 100 across the rest.

The largest issues are oversized images, three Google Fonts families render-blocking the LCP, missing SEO metadata, a robots.txt that's returning the SPA index.html, and one footer contrast issue. Work the sections in order. Each is independent enough to verify between them.

---

## 1. Fix image delivery (largest mobile win: 536 KiB savings)

Four images are flagged by PSI. Worst offender by ratio is the nav logo: served at 948×948, displayed at 38×38.

### Files to convert and resize

| File | Current | Target |
|---|---|---|
| `public/uploads/newlogo.png` | 159 KiB, 948×948 | ~3-5 KiB, 80×80 |
| `public/uploads/portrait4.jpeg` | 367 KiB, 740×1921 | srcset variants 768w / 1280w / 1920w in AVIF + JPG |
| `public/uploads/athletic1.jpg` | 192 KiB | same as portrait4 |
| `public/uploads/automotive3.jpg` | 187 KiB | same as portrait4 |

The hero image visible at first paint (Porsche with halftone "LEMOOSE" text) is likely `automotive3.jpg` used as a CSS background plus the text rendered as a font. Identify which image element is the actual LCP candidate by inspecting the rendered DOM and apply the `fetchpriority="high"` treatment to that one specifically.

### Tooling

```bash
brew install libavif webp imagemagick
```

### Convert the nav logo

```bash
magick public/uploads/newlogo.png -resize 80x80 public/uploads/newlogo-80.png
avifenc -q 80 public/uploads/newlogo-80.png public/uploads/newlogo-80.avif
```

Update the nav JSX:

```jsx
<picture>
  <source type="image/avif" srcSet="/uploads/newlogo-80.avif" />
  <img
    src="/uploads/newlogo-80.png"
    alt="Lemoose Productions"
    className="nav-logo"
    width="40"
    height="40"
  />
</picture>
```

### Convert each parallax photo

For each of portrait4, athletic1, automotive3:

```bash
# Example for portrait4
magick public/uploads/portrait4.jpeg -resize 1920x public/uploads/portrait4-1920.jpg
magick public/uploads/portrait4.jpeg -resize 1280x public/uploads/portrait4-1280.jpg
magick public/uploads/portrait4.jpeg -resize 768x public/uploads/portrait4-768.jpg

avifenc -q 65 public/uploads/portrait4-1920.jpg public/uploads/portrait4-1920.avif
avifenc -q 65 public/uploads/portrait4-1280.jpg public/uploads/portrait4-1280.avif
avifenc -q 65 public/uploads/portrait4-768.jpg public/uploads/portrait4-768.avif
```

Then update each JSX `<img>` to use `<picture>` with srcset. Replace this pattern:

```jsx
<img
  src="/uploads/portrait4.jpeg"
  alt="PORTRAITS"
  className="parallax-photo"
  style={{ objectPosition: 'center 30%' }}
/>
```

With:

```jsx
<picture>
  <source
    type="image/avif"
    srcSet="/uploads/portrait4-768.avif 768w, /uploads/portrait4-1280.avif 1280w, /uploads/portrait4-1920.avif 1920w"
    sizes="100vw"
  />
  <img
    src="/uploads/portrait4-1280.jpg"
    srcSet="/uploads/portrait4-768.jpg 768w, /uploads/portrait4-1280.jpg 1280w, /uploads/portrait4-1920.jpg 1920w"
    sizes="100vw"
    alt="PORTRAITS"
    className="parallax-photo"
    loading="lazy"
    style={{ objectPosition: 'center 30%' }}
  />
</picture>
```

### LCP image treatment

For whichever image is the actual hero LCP element, also add `fetchpriority="high"` and `loading="eager"` (instead of lazy), then add a preload hint in `index.html`:

```html
<link
  rel="preload"
  as="image"
  href="/uploads/automotive3-1280.avif"
  type="image/avif"
  fetchpriority="high"
/>
```

Once verified, delete the original oversized files from `public/uploads/`.

---

## 2. Fix font loading (largest desktop LCP win)

Three font families load from Google Fonts: Playfair Display (5 weights), Inter Tight (4 weights), JetBrains Mono (3 weights). Total ~110 KiB, blocking render for up to 1,443 ms on mobile and 690 ms on desktop. The LCP "element render delay" of 570 ms on desktop is largely fonts.

### Preferred fix: self-host the fonts

1. Audit `font-weight` declarations across all CSS and components. Keep only weights that are actually used. Most likely you can drop to 2-3 weights per family.

2. Download the woff2 files for those weights (use google-webfonts-helper.herokuapp.com or pull directly from the Google Fonts repo).

3. Save them to `public/fonts/`.

4. Add `@font-face` declarations to the main CSS file:

```css
@font-face {
  font-family: 'Playfair Display';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/fonts/playfair-display-900.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter Tight';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/inter-tight-500.woff2') format('woff2');
}

/* repeat for each weight kept */
```

5. Remove the Google Fonts `<link>` tags from `index.html`. Also remove the two `<link rel="preconnect">` tags for fonts.googleapis.com and fonts.gstatic.com (no longer needed).

6. Add preload hints in `index.html` for the 1-2 fonts used above the fold:

```html
<link rel="preload" href="/fonts/playfair-display-900.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-tight-500.woff2" as="font" type="font/woff2" crossorigin />
```

This eliminates the entire 3rd party font chain. Expected impact: mobile LCP drops by 1+ second, desktop LCP drops to under 0.7s.

---

## 3. SEO fixes (takes score from 83 to 100)

### Add meta description in `index.html`

```html
<meta name="description" content="Lemoose Productions. Portrait, automotive, and athletic photography in Tuscaloosa, Alabama." />
```

### Add Open Graph and Twitter tags while you're in there

```html
<meta property="og:title" content="Lemoose Productions" />
<meta property="og:description" content="Portrait, automotive, and athletic photography in Tuscaloosa, Alabama." />
<meta property="og:image" content="https://lemooseproductions.com/uploads/og-image.jpg" />
<meta property="og:url" content="https://lemooseproductions.com" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

(Create a 1200×630 og-image.jpg if one doesn't exist.)

### Fix robots.txt (the 20 errors)

Current behavior: requesting `/robots.txt` returns the SPA `index.html`. Lighthouse tries to parse the HTML as robots.txt and reports every line as an error. Fix by creating `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://lemooseproductions.com/sitemap.xml
```

### Add a basic sitemap.xml at `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lemooseproductions.com/</loc>
    <lastmod>2026-05-18</lastmod>
  </url>
</urlset>
```

### Verify host config doesn't catch-all .txt and .xml

If hosting on Vercel, Netlify, Cloudflare Pages, or similar with SPA fallback, confirm that requests for `.txt` and `.xml` files are served as-is and not rewritten to index.html. Most modern hosts handle this correctly by default. Test after deploy by visiting `lemooseproductions.com/robots.txt` directly: it should return plain text, not the HTML page.

---

## 4. Fix accessibility contrast (one element)

Two failing elements:
- `.site-footer__shot-for-label` (the "SHOT FOR" text)
- `.site-footer__copyright` (the "© 2026 LEMOOSE PRODUCTIONS - TUSCALOOSA" line)

Both lack sufficient contrast against the footer background. Open the footer CSS, increase the text color toward whatever direction the background isn't. Target: contrast ratio 4.5:1 for normal text, 3:1 for large text. Verify with Chrome DevTools accessibility inspector (right-click element → Inspect → Accessibility tab → Contrast).

---

## 5. Inline critical CSS (eliminates 8 KiB render-blocking request)

The `/assets/index-BPWQJkUE.css` bundle (8 KiB) is render-blocking. For a site this small, inlining all CSS into the HTML is cleaner than splitting critical vs non-critical.

Install:

```bash
npm install -D vite-plugin-css-injected-by-js
```

Update `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin()
  ]
})
```

This bundles CSS into the JS and injects on parse, eliminating the separate CSS request. Confirms in the deployed HTML: there should be no `<link rel="stylesheet">` pointing to a CSS asset.

---

## 6. Reduce unused JavaScript (27 KiB savings)

Install the bundle visualizer:

```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.js` plugins array:

```js
import { visualizer } from 'rollup-plugin-visualizer'

plugins: [
  react(),
  cssInjectedByJsPlugin(),
  visualizer({ open: true, filename: 'dist/stats.html' })
]
```

Run `npm run build`. Inspect the report and look for:
- Libraries imported in full when only one function is used (`import _ from 'lodash'` should become `import debounce from 'lodash/debounce'`)
- Unused React components, pages, or routes
- Dead code paths that didn't tree-shake

Remove what's not needed, rebuild, verify bundle size has dropped.

---

## 7. Investigate forced reflow (optional, small win)

PSI flags 41 ms of forced reflow at `/assets/index-CHHeTd6w.js:26:1919` and `52:590`. This is bundled code, so use source maps to locate the source. Common causes:

- A `useEffect` that reads `offsetWidth`, `getBoundingClientRect`, or similar geometric property right after a state change
- A parallax scroll handler that reads layout properties on every scroll event without throttling
- A resize observer that reads layout in its callback

Given there's a parallax effect on the site (the `parallax-photo` class with `translate3d` styles), the parallax scroll handler is the likely culprit. Fix by:

1. Reading the geometric property outside the scroll handler (cache it on mount and update on resize)
2. Using `requestAnimationFrame` to batch reads and writes
3. Using CSS `transform` only (already done) and avoiding any read of `offsetTop` or `scrollTop` mid-frame

---

## 8. Build, deploy, verify

```bash
npm run build
# deploy via your usual flow (vercel deploy, netlify deploy, git push, etc.)
```

Wait 2-3 minutes for CDN propagation. Then re-run PageSpeed Insights on both mobile and desktop. Target:

- Mobile Performance: 90+
- Desktop Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

If mobile Performance is below 90, the most likely cause is image sizes. Check that the AVIF outputs deployed correctly and consider dropping AVIF quality from 65 to 55. If desktop isn't at 100, view the deployed HTML source and confirm there's no `<link rel="stylesheet">` (critical CSS should be inlined) and no Google Fonts `<link>` tags.

Screenshot the final report. These are the real numbers for the Freeform Works case study.

---

## Order of operations and time estimate

| Step | Time |
|---|---|
| 1. Image conversion + srcset | 45 min |
| 2. Font self-hosting + weight trim | 25 min |
| 3. SEO meta + robots.txt + sitemap | 10 min |
| 4. Accessibility contrast | 5 min |
| 5. Inline critical CSS | 10 min |
| 6. Bundle analysis + JS cleanup | 20 min |
| 7. Forced reflow investigation | 15 min (optional) |
| 8. Build, deploy, verify | 15 min |

Total: about 2 to 2.5 hours.
