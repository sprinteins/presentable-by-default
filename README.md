# Presentable By Default

Mostly classless, themeable SprintEins design CSS. Semantic HTML in, SprintEins look.

Proprietary: only SprintEins-authorized projects may use this library and its assets. See [LICENSE](LICENSE).

## Use

```html
<link rel="stylesheet" href="dist/sprinteins.css">
<!-- optional, needs licensed fonts, see fonts/README.md -->
<!-- <link rel="stylesheet" href="dist/sprinteins-fonts.css"> -->
```

Demo (theme selector in header):

```
npm run serve   # build + serve http://localhost:3000/demo/
npm start       # same, opens browser
npm run serve -- --port=8080
```

Dev server binds to `127.0.0.1` and serves only `demo/`, `dist/`, `assets/`, `fonts/`.

`demo/index.html` also works via `file://`.

## Classless elements

1. `header`, `nav`, `main > section`, `footer` - full-bleed bands, centered content
2. `h1-h6`, `p`, `blockquote`, `ul/ol`, `table`, `code`, `pre`
3. `form`, `input`, `select`, `textarea`, `button`, `fieldset`
4. `article` (card), `aside` (callout), `details` (accordion), `dialog`

## Opt-in classes

1. `.grid` - responsive auto-fit grid
2. `.secondary`, `.solid`, `.button` / `[role=button]` - button variants
3. `.logo` - theme-aware logo (CSS filter)
4. `.eyebrow`, `.lead`, `.muted`, `.center`
5. `.sr-only`, `.skip-link`
6. `aside[data-tone=info|success|warning|danger]`

## Themes

Set `data-theme` on `<html>` or any element (scoped).

1. `light` (default), `dark`, `auto` (OS preference)
2. `navy`, `plum`, `teal`, `olive`, `volt` (brand colors)
3. `ultramarine` (deep blue, gold accent)
4. `gruvbox` (retro dark)

```html
<html data-theme="navy">
<section data-theme="plum">...</section>
```

Each theme only sets `color-scheme` and semantic tokens: `--se-bg, --se-fg, --se-muted, --se-surface, --se-accent, --se-on-accent, --se-footer-bg, --se-footer-fg, --se-footer-accent, --se-logo-filter, --se-footer-logo-filter`. Derived tokens (border, tint, focus) live in `src/themes/derived.css`.

Add a theme:

1. Copy `src/themes/_template.css`, fill tokens
2. `@import` it in `src/themes/index.css`
3. Add `<option>` in `demo/index.html` and the name in `THEMES` in `demo/theme.js`
4. `npm run check` (build + WCAG contrast + theme list in sync)

Notes:

1. `src/themes/auto.css` duplicates `dark.css` (enforced by `npm run contrast`); its light half is the `[data-theme="auto"]` selector in `light.css`
2. Red `#fd4864` fails 4.5:1 as text on white; used for underlines/borders, not text

## Build

```
npm run build     # src -> dist
npm run contrast  # WCAG AA check of all themes (incl. footer) + theme consistency
npm run check     # both
```

Layer order: `se.reset, se.tokens, se.themes, se.base, se.layout, se.forms, se.components, se.utilities`. Override in your own unlayered CSS or later layer.

## Publish

CI only (`.github/workflows/release.yml`): push a tag `v<version>` matching `package.json`. Job 1 runs `npm run check` (via `prepublishOnly`) and publishes to npm with provenance; job 2 deploys the demo to GitHub Pages and runs only if job 1 succeeded.

```
npm version patch --no-git-tag-version   # or edit package.json
git commit -am "release x.y.z" && git tag vx.y.z && git push origin main vx.y.z
```

1. Tag must match the version or the run fails before publishing.
2. Version already on npm: publish is skipped, Pages still deploys (safe re-run).
3. Manual run (Actions > Run workflow): publishes only when run on a `v*` tag; on a branch it only redeploys Pages.

One-time setup: repo secret `NPM_TOKEN` (npm automation/granular token with publish rights), Settings > Pages > Source = "GitHub Actions", and environment `github-pages` allowing branch `main` and tags `v*`. Site is `demo/` + `dist/` + logos + LICENSE; licensed fonts are not deployed, so the demo falls back to Helvetica Neue there.

Package `@sprinteins/presentable-by-default` contains `dist/`, `src/`, README, LICENSE. Fonts and logos are excluded.

## Customize

Override tokens, e.g. `:root { --se-weight-body: 400; --se-radius: 4px; }`.

## Structure

```
src/        sources (tokens, themes/, elements)
dist/       built CSS
demo/       demo page + theme selector
assets/logos/  web logos
docs/research.md  research + site tokens
```

Logo masters: `_SprintEins_Logopack/` (local only, git-ignored; get it from SprintEins brand/marketing).
