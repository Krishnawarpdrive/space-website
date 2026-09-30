# Space Website

A Next.js rebuild of the Copilot website (hellocopilot.com): the age-gate splash, the product carousel and the three product pages, with the original loader, sound, smooth scrolling, parallax and page transitions.

## Requirements

- Node.js 24+ (see `.nvmrc`)

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`, `npm run check` (lint + typecheck + build).

## Pages

| Route | Page |
|---|---|
| `/` | Age gate / splash |
| `/products` | Product carousel (Take Off, Touch Down, High Point) |
| `/take-off` | Take Off product page |
| `/touch-down` | Touch Down product page |
| `/high-point` | High Point product page |

## Structure

```
src/app/                         routes, root layout, fonts, global CSS
  copilot-theme.css              site theme (component styles, clip-paths, keyframes)
src/components/sites/hellocopilot-com-bce9a408/
  shared/                        header, loader, nav, about popup, product-page template,
                                 runtime (SiteShell: smooth scroll, parallax, scroll scrubs,
                                 page transitions), sound, content data (site-data.ts)
  root-8a5edab2/                 splash page sections
  products-d66ca189/             product carousel sections
public/sites/hellocopilot-com-bce9a408/shared/
                                 images, audio and favicons
```

Page content (copy, colours, specs, image layers) lives in `shared/site-data.ts`.

## Licensing

The project scaffold comes from [ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) (MIT, see `LICENSE`). That licence covers the code only.

The Copilot name, logo, artwork, product imagery, copy and audio belong to Copilot. They are included on the basis of the owner's authorisation, are not covered by the MIT licence, and must not be redistributed or deployed publicly without that authorisation.
