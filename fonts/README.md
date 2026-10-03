# Fonts

SprintEins brand webfonts are commercial. Font files are git-ignored and excluded from the npm package. Fallback without them: Helvetica Neue / system sans.

Expected files (woff):

1. `se-headline.woff` - "SE Headline"
2. `se-text-light.woff` - "SE Text" 300
3. `se-text-regular.woff` - "SE Text" 400
4. `se-text-bold.woff` - "SE Text" 700

Obtain licensed copies from SprintEins (brand/marketing). Use only within the scope of the font license; do not re-host them publicly.

Enable: link `dist/sprinteins-fonts.css` (the demo does). The headline font (soin) must only be used uppercase; the library enforces `text-transform: uppercase` wherever it applies it. Paths are `../fonts/*` relative to `dist/`. Change them in `src/fonts.css` if the files live elsewhere.
