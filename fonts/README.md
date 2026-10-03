# Fonts

SprintEins brand webfonts are commercial. Font files are git-ignored and excluded from the npm package. Fallback without them: Helvetica Neue / system sans.

Files (woff only, no woff2 available on the source):

1. `se-headline.woff` - "SE Headline", from site `soin-headline`
2. `se-text-light.woff` - "SE Text" 300, from `hel-light`
3. `se-text-regular.woff` - "SE Text" 400, from `hel-roman`
4. `se-text-bold.woff` - "SE Text" 700, from `hel-bold`

Source: `https://sprinteins.com/_assets/<hash>/Fonts/{soin/2884FB_A_0,hel/28D984_0_0,hel/28D984_1_0,hel/28D984_2_0}.woff`

Enable: link `dist/sprinteins-fonts.css` (the demo does). The headline font (soin) must only be used uppercase; the library enforces `text-transform: uppercase` wherever it applies it. Paths are `../fonts/*` relative to `dist/`. Change them in `src/fonts.css` if the files live elsewhere.
