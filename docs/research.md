# Research

## Classless libraries

1. Pico CSS - semantic HTML, `data-theme` light/dark/auto, CSS custom properties. Chosen model for theming.
2. Simple.css - classless, variables, small. Header/main/footer layout idea.
3. Water.css - drop-in, light/dark via `prefers-color-scheme`.
4. MVP.css - classless, hero/section patterns.
5. new.css - minimal typographic defaults.

Takeaways: style elements not classes; tokens as custom properties; theme by attribute on any element; keep opt-in classes few.

## Source site

https://sprinteins.com/ - all pages (cases, leistungen, insights, akademie, kultur, karriere, kontakt, en) load the same compiled stylesheet `a.css` (+ icomoon icon font). One stylesheet = one token set.

### Colors

| Token      | Value     | Use                                    |
| ---------- | --------- | -------------------------------------- |
| black      | `#000003` | text                                   |
| gray       | `#828285` | muted                                  |
| gray-light | `#f5f5f5` | surfaces                               |
| red        | `#fd4864` | main accent, underlines, focus, submit |
| yellow     | `#ecff00` | accent on dark                         |
| color-1    | `#08223f` | navy                                   |
| color-2    | `#48193c` | plum                                   |
| color-3    | `#005c6c` | teal                                   |
| color-4    | `#02252d` | deep teal                              |
| color-5    | `#8c8100` | olive                                  |
| hellgrau   | `#e5e5e8` | light gray                             |
| schwarz    | `#05050a` | footer bg                              |

Other grays: `#bdbdbf #9ea2a5 #777 #999`. Hairline: `1px solid #eee`.

### Fonts (commercial, not bundled)

1. `soin-headline` - h1, h4, labels, nav, buttons; uppercase
2. `hel-light` - body, h2, h5; letter-spacing -0.03em
3. `hel-roman`, `hel-bold`
4. `soin-*` family: thin, light, roman, medium, bold, oblique

### Type

1. Site root 10px (62.5%); lib keeps 16px
2. h1 3.5vw uppercase, lh 1.1, ls .01em
3. h2 1.95vw, lh 1.6
4. h4 1.8vw uppercase, ls .05em
5. body `clamp(1.3rem, 1.4vw, 2.3rem)`
6. blockquote 4.5vw uppercase headline
7. labels uppercase, ls .14em

### Spacing / shape

1. `--pad` 20px; paragraph padding 18px; form-group margin 5px
2. Section padding 5vh / 10vh / 20vh
3. Content width 88vw; footer padding `24px 6%`
4. Radius mostly 0; also 50% and 10em pill
5. Inputs, accordion: 2px solid black
6. Easing `cubic-bezier(0.455, 0.03, 0, 1.01)`, 0.3-0.5s
7. Breakpoints 769px (dominant), 1024px, 3500px

### Components

1. Buttons: transparent, 2px red border, headline font uppercase, hover fill
2. Links: black text, red underline 0.12em
3. Accordion with heavy borders
4. Dark footer
