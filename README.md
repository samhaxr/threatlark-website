# ThreatLark marketing site

A fast, professional, single-product static website for **ThreatLark** - plain HTML, CSS and
vanilla JavaScript. No build step, no framework, no third-party requests (fonts are self-hosted).
Built to be hosted on **GitHub Pages** with a custom domain bought at **Namecheap**.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home: hero, how it works, tabbed platform capabilities, use cases, security band, deployment, CTA |
| `platform.html` | Deep dive per capability (Discovery, ASM, OT/IoT, vulnerability scanner, WordPress/API/container, credentials, threat intel, prioritization, reporting, automation) |
| `deployment.html` | Deployment options, Docker quick start, requirements, operations, stack |
| `security.html` | Authentication, access control, data protection, audit log, safe scanning |
| `request-demo.html` | Demo request form (mailto-based, see below) and contact details |
| `privacy.html`, `terms.html` | Privacy Policy and Terms of Use (last updated November 2, 2026) |
| `404.html` | Not-found page (GitHub Pages serves it automatically) |
| `sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll`, `favicon.svg` | Hosting / SEO files |

Assets: `css/style.css`, `js/main.js`, `assets/img/*` (WebP screenshots, OG image, icons), `assets/fonts/*`
(Plus Jakarta Sans + Inter, variable WOFF2, SIL OFL).

## Preview locally

```bash
python3 -m http.server 8787
# open http://localhost:8787
```

## Things to set before going live (search for `example.com`)

1. **Domain** - the placeholder is `www.example.com`. Run `./set-domain.sh www.yourdomain.com`
   (updates canonical/Open Graph URLs, `sitemap.xml`, `robots.txt` and `CNAME`).
2. **Contact email** - `sales@threatlark.com` (taken from the previous site) appears on the demo
   and legal pages and in `data-mailto`. Replace it everywhere:
   `grep -rl 'sales@threatlark.com' . | xargs sed -i 's/sales@threatlark.com/you@yourdomain.com/g'`
3. **Demo form handling** - see below.
4. **Legal pages** - `privacy.html` and `terms.html` are complete. If your legal entity name, registered address or governing jurisdiction should be named explicitly, add them before publishing.
5. Review all copy against the current ThreatLark release before publishing.

### Demo form handling

`request-demo.html` uses a `mailto:` flow: JavaScript builds an email with the entered details and
opens the visitor's mail client; without JavaScript the form falls back to a plain `mailto:` action.
Nothing is sent to any third party. If you want real submissions without relying on a mail client,
point the `<form>` at a form service (Formspree, Basin, Netlify Forms, …) and remove the
submit handler at the bottom of `js/main.js`. Update the Privacy Policy (`privacy.html`) if you do.

## Deploy on GitHub Pages

1. Create a new GitHub repository (for example `threatlark-site`) under the `samhaxr` account and push this folder
   to the default branch (`main`). The commit already includes `.nojekyll`, so files are served as-is.
2. In the repo go to **Settings → Pages**. Under **Build and deployment** choose
   **Source: Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
3. Under **Custom domain** enter your domain (for example `www.yourdomain.com`) and **Save**.
   The `CNAME` file in this repo keeps that setting from being reset on each deploy.
4. After DNS (next section) resolves and GitHub's check passes, tick **Enforce HTTPS**
   (GitHub provisions the certificate automatically; this can take up to an hour).
5. Recommended: **verify your domain** at *GitHub profile → Settings → Pages* (adds a TXT record) to
   prevent domain takeover.

## Namecheap DNS

In Namecheap: **Domain List → Manage → Advanced DNS → Host Records**. Delete any parking-page or
URL-redirect records for `@` and `www`, then add:

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `samhaxr.github.io.` | Automatic |

Optional IPv6 (AAAA records for `@`): `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`.

Notes:

- With `www.yourdomain.com` in the `CNAME` file and the records above, GitHub Pages serves the site
  at `www` and redirects the apex (`yourdomain.com`) to it automatically.
- Prefer the bare domain as primary? Put `yourdomain.com` in `CNAME` (and re-run `./set-domain.sh yourdomain.com`).
  The `www` CNAME record still redirects to it.
- The CNAME **target is always `<github-username>.github.io`** (`samhaxr.github.io`), even for a project repository.
- DNS changes usually take minutes but can take up to 24-48 hours. Check with
  `dig www.yourdomain.com +noall +answer` and `dig yourdomain.com +noall +answer`.

## Updating screenshots

Screenshots come from the ThreatLark UI and are stored as WebP in `assets/img/` (`dashboard`,
`attack-surface`, `findings`, each with a `-800` variant). Replace them with the same file names and
dimensions (1568×773) to refresh the site. Do not publish screenshots that contain real customer data.

## Accessibility & performance notes

Semantic landmarks, skip link, keyboard-operable menu and WAI-ARIA tabs, visible focus rings,
`prefers-reduced-motion` support, responsive images (`srcset`), self-hosted variable fonts and no
JavaScript dependencies.
