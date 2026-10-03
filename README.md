# Presentable By Default

Mostly classless, themeable SprintEins design CSS. Semantic HTML in, SprintEins look.

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

Each theme only sets semantic tokens: `--se-bg, --se-fg, --se-muted, --se-surface, --se-accent, --se-on-accent, --se-footer-*, --se-logo-filter`. Derived tokens (border, tint, focus) live in `src/themes/derived.css`.

Add a theme:

1. Copy `src/themes/_template.css`, fill tokens
2. `@import` it in `src/themes/index.css`
3. Add `<option>` in demo
4. `npm run check` (build + WCAG contrast)

Notes:

1. `src/themes/auto.css` duplicates `dark.css`; keep in sync
2. Red `#fd4864` fails 4.5:1 as text on white; used for underlines/borders, not text

## Build

```
npm run build     # src -> dist
npm run contrast  # WCAG AA check of all themes
npm run check     # both
```

Layer order: `se.reset, se.tokens, se.themes, se.base, se.layout, se.forms, se.components, se.utilities`. Override in your own unlayered CSS or later layer.

## Publish

Release (`.github/workflows/release.yml`): push a tag `v<version>` matching `package.json`. Job 1 runs `npm run check` and publishes to npm; job 2 deploys the demo to GitHub Pages and runs only if the publish succeeded.

```
npm version patch --no-git-tag-version   # or edit package.json
git commit -am "release x.y.z" && git tag vx.y.z && git push origin main vx.y.z
```

One-time setup: repo secret `NPM_TOKEN` (npm automation/granular token with publish rights), and Settings > Pages > Source = "GitHub Actions". Site is `demo/` + `dist/` + logos; licensed fonts are not deployed, so the demo falls back to Helvetica Neue there. The tag must match the version or the run fails before publishing.

```
npm login
npm run publish:npm -- --dry-run          # check + pack preview, no upload
npm run publish:npm -- patch              # bump, then publish (minor|major|x.y.z)
npm run publish:npm -- --tag=next --otp=123456
```

Package contains `dist/`, `src/`, README only. Fonts and logos are excluded. Name `sprinteins-css` is unscoped: confirm it is free, or rename (e.g. `@sprinteins/css`) in `package.json`. License is `UNLICENSED`: set the real one before publishing.

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

Logo masters: `_SprintEins_Logopack/`.
