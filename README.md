# ellotravel.net

Website for **Ello Travel**, a travel agency in Klinë, Kosovo — flight tickets
from Prishtina, hotels on the Albanian coast, and summer packages.

A statically generated, three-language marketing site. Enquiries arrive through
a booking-request form, WhatsApp and phone, which is how the agency already
sells.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Rendering | Static generation — 116 prerendered pages |
| Enquiries | React Server Action → Resend REST API |
| Analytics | GA4 via `@next/third-parties` |

Every page is prerendered at build time, including 69 flight-route pages
(23 destinations × 3 languages) and 21 hotel pages. That is the point of the
architecture: this business gets found through searches like *"bileta avioni
Prishtinë Stuttgart"*, and each of those is a real server-rendered page with
its own title, description, canonical and hreflang tags.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000 → redirects to /sq
npm run build      # production build
npm start          # serve the production build
npm run lint
```

## Languages

Albanian (`sq`, default), German (`de`), English (`en`).

German is not decoration — most of the flight routes serve the Albanian
diaspora in Germany, Switzerland and Austria, who often search in German.

Every path is prefixed: `/sq/hotels`, `/de/hotels`, `/en/hotels`. A request
without a prefix is redirected by `src/proxy.ts`, which picks the language in
this order — the first rule that answers wins:

| | Signal | |
|---|---|---|
| 1 | `ello_locale` cookie | the visitor used the language switcher; nothing overrules that |
| 2 | `Accept-Language`, top choice | their own setting, when it is a language we publish |
| 3 | Country | `XK` `AL` `MK` `ME` → Albanian · `DE` `AT` `CH` → German · anywhere else → English |
| 4 | `Accept-Language`, any choice | a language further down the list |
| 5 | Albanian | nothing to go on at all |

Language outranks location on purpose: an Albanian phone in Zurich gets
Albanian, because a device set to Albanian is a clearer statement than a Swiss
IP address. Location answers the case the header cannot — a Turkish phone in
Prishtina would settle for the English in its `Accept-Language`, and gets
Albanian instead.

The country map lives in `src/i18n/detect.ts` and lists only the exceptions.

### Where the country comes from

Next.js removed `request.geo` in v15, so the country has to arrive as a request
header. `src/i18n/detect.ts` reads `X-Country-Code`, then `CF-IPCountry`, then
`X-Vercel-IP-Country`, so the same code works behind nginx, Cloudflare or
Vercel without a change.

**These are ordinary request headers.** In production nginx overwrites
`X-Country-Code` on every proxied request, so a visitor cannot choose their own
country — but on any deployment that does *not* set it, whatever the client
sends is what the app sees. Harmless for picking a language; never use these
headers for anything where being wrong costs something.

Production (Hetzner, nginx → Docker) is already configured:

```nginx
# /etc/nginx/conf.d/geoip2.conf — apt install libnginx-mod-http-geoip2
geoip2 /usr/share/GeoIP/dbip-country-lite.mmdb {
  auto_reload 5m;
  $geoip2_country_code source=$remote_addr country iso_code;
}

# /etc/nginx/sites-enabled/ellotravel, inside location /
proxy_set_header X-Country-Code $geoip2_country_code;
```

The database is DB-IP IP-to-Country Lite (CC-BY 4.0), which needs no account,
refreshed by `/etc/cron.monthly/dbip-update`. That script refuses to install a
database that cannot resolve two known addresses: a truncated download would
otherwise resolve every visitor to nothing, and the site would fall back to
browser language sitewide with nothing in the logs to say why. `auto_reload`
means a new file is picked up without an nginx reload.

The variable is empty for addresses the database cannot place; `detect.ts`
treats that, `XX` and Tor's `T1` as "no country" and moves on.

Where no country header is set at all — local development, or a deploy without
GeoIP — the country falls back to the region subtag the browser already sends
(`de-CH` → `CH`). That reflects where the phone was set up rather than where it
is, which is why it is only the fallback.

Nothing here affects crawlers reaching a specific language: only unprefixed
paths redirect, every locale URL stays directly reachable, and each page still
carries its own canonical and `hreflang` alternates.

**Translations live in `src/i18n/dictionaries/`.** Albanian is the source of
truth: `sq.ts` defines the shape and `de.ts` / `en.ts` are type-checked against
it. Add a key to `sq.ts` and TypeScript refuses to build until the other two
have it, so no language can silently fall back to blank text.

## Editing content

No CMS — content is typed data, edited in the repo and deployed. Adding a hotel
or a destination automatically produces its pages, sitemap entries and internal
links in all three languages.

| What | Where |
|---|---|
| Phone, email, address, Instagram | `src/data/site.ts` |
| Hotels | `src/data/hotels.ts` |
| Flight destinations | `src/data/destinations.ts` |
| Packages | `src/data/offers.ts` |
| Interface text | `src/i18n/dictionaries/*.ts` |

### Prices

Every `priceFrom` is `null`, which makes the UI say *"ask for a price"* rather
than show a number nobody has confirmed. Set a number (EUR) and the card
switches to *"from €X"*, formatted per locale.

### Photography

The site ships with no photographs. Rather than grey boxes, each card renders a
generated SVG landscape keyed to its theme (`coast`, `alpine`, `metropolis`, …)
— see `src/components/scene.tsx`.

For a real photo, drop the file in `public/images/` and add
`image: "/images/royal-g.jpg"` to that hotel. It is then served through
`next/image` and the generated art disappears. The agency's Instagram is the
natural source.

## Booking enquiries

The form is a React Server Action (`src/app/[locale]/contact/actions.ts`), so
it submits and validates **without JavaScript** — worth having on the mobile
connections many visitors arrive on. Validation returns field names; the client
renders the message in the visitor's language.

Copy `.env.example` to `.env.local` and fill in the values. Without them the
site still works: the enquiry validates and the visitor sees the success
screen. In development the payload goes to the server log; in production it is
dropped, and only the fact that it happened is recorded. Set the variables
before launch so enquiries reach the inbox.

### Keeping it from being abused

A server action is a public POST endpoint. The form in front of it is a
convenience, not a gate — anything below has to hold for a payload written by a
script that never rendered the page.

- **A honeypot field**, and no captcha. It is deliberately not named
  `company` and carries no label: that pairing is what browser address-profile
  autofill looks for, and a honeypot the visitor's browser fills is a booking
  silently thrown away.
- **Five enquiries per IP per fifteen minutes** (`src/lib/rate-limit.ts`),
  counted after validation so correcting a rejected form never costs a turn.
  Past the limit the visitor is told to wait or phone, rather than shown an
  error implying they did something wrong. **The counter lives in process
  memory**, which is exactly right for one container and wrong the moment
  there are two — a second replica needs a shared store.
- **The address comes from the right-hand end of `X-Forwarded-For`**, which
  is the hop nginx actually saw. Reading the left-hand end would let one script
  claim to be thousands of visitors.
- **Every field is capped and stripped of control characters**
  (`FIELD_LIMITS` in `src/lib/inquiry.ts`) before it is validated, emailed or
  echoed back. The visitor's name reaches the mail *subject*, so a stray
  carriage return there would be a header injection rather than a cosmetic
  problem.
- **Enquiries are not written to the log in production.** Without a mail
  provider configured only the shape of one is recorded — a name, phone number
  and travel plans do not belong in `docker logs`. In development the full
  payload is still logged, so the form can be worked on without Resend.

Blunt flooding of the endpoint itself is nginx's job, not the app's. Add a
`limit_req` zone on the contact location if it ever becomes a problem.

### Response headers

`next.config.ts` sends a CSP, `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` and HSTS on every response.

The CSP allows `'unsafe-inline'` for scripts, knowingly: React streams its
payload through inline scripts, and the alternative — a per-request nonce from
`proxy.ts` — would make every page dynamic and throw away the prerendering the
site is built on. HSTS is sent without `includeSubDomains` or `preload`, both
of which are one-way doors; add them once every host under `ellotravel.net` is
known to be served over TLS.

## Before this goes live

1. **Verify the hotel copy.** Names, star ratings and cities came from the
   Instagram posts and are accurate. The descriptions and amenity lists in
   `src/data/hotels.ts` are placeholder copy written from the destination, not
   from the agency's material. Each is marked with a warning comment.
2. **Add real prices**, or confirm enquiry-only is intended.
3. **Confirm the flight destinations** still run, and which are seasonal.
   Münster and Osnabrück share one airport (FMO) and are listed separately on
   purpose, because travellers search for both names.
4. **Replace the logo.** `src/components/logo.tsx` is an interim mark built
   from the brand's elements (orange heart, blue aircraft). Swap in the real
   artwork.
5. **Check the opening hours** in `dict.contact.hoursValue` — Mon–Sat
   09:00–19:00 was assumed, not confirmed.
6. **Confirm the office coordinates** in `site.geo`. They are the centre of
   Klinë, not the exact address, and they feed the Google business panel.
7. Point `ellotravel.net` at the deployment and submit
   `https://www.ellotravel.net/sitemap.xml` to Google Search Console.

## Deploying

Vercel is the path of least resistance: import the repo, add the environment
variables, deploy. No database and no external services are required at build
time.

Anything running Node works equally well — `npm run build && npm start`.

Note that `NEXT_PUBLIC_GA_ID` is inlined at build time, so it must be set on
the host *before* the production build runs.

## SEO notes

- `sitemap.xml` — 108 URLs with per-language alternates, generated from the
  content files.
- Canonical and `hreflang` on every page, including `x-default`. Bare language
  codes (`de`, not `de-DE`) so the German pages are not narrowed to Germany.
- `TravelAgency` structured data sitewide, `Hotel` on hotel pages,
  `BreadcrumbList` on route pages.
- Open Graph share cards generated per language at build time.

## Project layout

```
src/
  app/[locale]/          pages — home, hotels, flights, offers, about, contact
  components/            header, footer, cards, form, generated scene art
  data/                  hotels, destinations, offers, business details
  i18n/                  locale config, language/country detection, dictionaries
  lib/                   formatting, SEO helpers, enquiry validation/delivery
  proxy.ts               locale redirect for unprefixed paths
```
