# FreshLink branding

Use this file for the Angular app, the product mockup HTML, and any new screens. Source marks live in `public/`.

## Marks

| File | Use |
|------|-----|
| `public/full-logo.svg` / `full-logo.png` | Source lockup (illustration + wordmark + tagline) |
| `public/logo-full.png` (+ `@2x`) | Trimmed lockup for the **landing** header on a light background |
| `public/leaf-logo.svg` / `leaf-logo.png` | Source leaf (includes white canvas) |
| `public/leaf-mark.svg` | **App mark** — transparent leaf for favicon, chrome, and dark bars |
| `public/favicon.svg`, `favicon.ico`, `favicon-32.png` | Browser icons |
| `public/apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | Touch / PWA icons on white |

Regenerate derived sizes after replacing sources:

```bash
node scripts/generate-brand-assets.cjs
```

## Which mark where

- **Landing / marketing on white or paper:** full lockup (`logo-full.png`). Keep it large enough that “FreshLink” and the tagline stay readable (about 96px tall or more).
- **Compact chrome** (partner sidebar, mobile top bar, client home): `leaf-mark.svg` plus the typeset wordmark. Do not use the full lockup in a 24–32px slot.
- **Favicon and app icon:** leaf only, never the truck/farm illustration.
- **Dark navy chrome:** leaf mark + white **Fresh** + leaf-green **Link**. Never place the full lockup (dark type) on navy.

## Color

Kit greens come from the logos. Product navy is UI chrome only — it is not a logo color and must not recolor the leaf.

| Token | Hex | Role |
|-------|-----|------|
| `--green-deep` / forest | `#116722` | **Fresh**, solid buttons with white type, strong emphasis |
| `--green` / leaf | `#4F9E23` | **Link**, charts, success accents, icon highlights on navy |
| `--green-tint` | `#E8F3E0` | Soft fills, selected rows, pills |
| `--navy` / `--navy-deep` | `#16324F` / `#0F2237` | Partner shell only |
| Paper / ink | `#F3F1EA` / `#1E2A24` | Page background and body type |

Do not invent extra greens (`#2F7D4E`, `#7FC79A`, `#1F5A38`) for brand moments. Illustration colors inside the lockup (barn red, sun orange, skyline) stay in the artwork — do not use them as UI theme colors.

## Wordmark

Typeset as **Fresh** + **Link** (no space). On light backgrounds: Fresh = forest, Link = leaf. On navy: Fresh = white, Link = leaf.

Correct: `Fresh<span>Link</span>`  
Incorrect: “Fresh Link”, “Freshlink”, recoloring both halves the same, stretching or outlining the lockup.

Tagline (lockup only, do not typeset in chrome): *Connecting Local Food to Communities Near You.*  
Audience line (lockup only): Farms · Grocers · Facilities · Communities.

## Clear space and integrity

- Keep padding around marks roughly equal to the height of one leaf in the pair.
- Do not stretch, rotate, recolor, add drop shadows, or place the lockup in a circle/hex “app icon” crop.
- Do not replace the leaf with the old map-pin / sprout SVGs from the first mockups.
- Minimum leaf size in UI: **24px** (16px only for favicon).

## Type

Headings: **Satoshi**. Body: **General Sans**. These are product fonts; the lockup lettering is part of the artwork and is not restyled.

## Checklist for new screens

1. Light marketing surface → full lockup. Tight toolbar → leaf + wordmark.
2. Buttons with white labels use `--green-deep`.
3. “Link” in the product name uses `--green`.
4. Favicon / tab icon stays the leaf.
5. If you replace `leaf-logo.*` or `full-logo.*`, rerun `node scripts/generate-brand-assets.cjs`.
