# games and stuff

A small neal.fun-style landing page. Every 2 hours a GitHub Action generates one new interactive experiment, commits it, and GitHub Pages serves it.

## How it works

- `scripts/generate.mjs` (Node, no dependencies) creates `experiments/<type>-<n>/index.html` and prepends an entry to `experiments.json`. Types rotate, so consecutive posts never repeat a type.
- `index.html` reads `experiments.json` and draws the grid. The pumpkin counter is per-viewer (localStorage), since there is no backend.
- A Claude routine (`funStylePage`, trigger `trig_01R2qUkcTzG93pSDNL17YF1Y`) generates a new post every 2 hours and pushes it to `main`.
- `.github/workflows/post.yml` deploys to GitHub Pages whenever a push changes the site (`experiments/`, `experiments.json`, `index.html`). It can also run the generator by hand from the Actions tab (`workflow_dispatch`). Pages must be set to **Source: GitHub Actions**.
- A second job in the same workflow deploys the site to GitHub Pages with the Actions deploy (`configure-pages`, `upload-pages-artifact`, `deploy-pages`). Pages must be set to **Source: GitHub Actions**.

## Experiment types

| Type | What it does |
|---|---|
| `spend` | A huge bank balance and a shopping list of absurd things to buy. |
| `days` | A counter of days since an incident, with a button to report another one. |
| `dilemma` | An absurd trolley problem with a random scenario each time. |
| `circle` | Draw freehand. The page scores how circular it is. |
| `settle` | A silly debate with a live vote and no resolution. |
| `scale` | Pick two things and see how many times bigger one is than the other (rough real sizes). |
| `forecast` | A universe forecast, re-rolled on demand. |

All copy and mechanics are original. The style is borrowed; the jokes are not copied.

## Why neal.fun works (research notes)

Research was done on https://neal.fun/ in three passes:

1. **Structure (DOM read):** about 44 links on the home page, each a single game. Each card is an image with the title art baked in. The footer is a short "Hi! I'm Neal" bio with a newsletter, social links and a contact address. A cookie and consent dialog opens on load.
2. **Look and feel (screenshot and one game page):** a plain Roboto-style sans, light grey cards (`#e7e7e7`), a black-and-white page with almost no chrome. The Password Game page is one question and a counter, with nothing else on screen.
3. **Computed styles (JavaScript):** body text is Roboto at 16px. Cards are about 416×156px in a two-column grid. Links use a `page-link` class. The home page has one small persistent toy, "Watered 0 times today" next to a pumpkin, which fits the season.

What makes it unique, from those passes:

- **One idea per page.** Each game is a single joke with one mechanic. There is no onboarding and no settings.
- **Absurd scale.** Money, space and time are used as the punchline ("Spend Bill Gates' Money", "The Size of Space", "Universe Forecast").
- **Deadpan tone.** Copy is short and dry and never explains the joke.
- **Hand-made title art.** Titles are images, not plain HTML text, so every card looks like its own piece.
- **Minimal chrome.** No nav bar, no menus. Most of the page is the grid.
- **A tiny living detail.** A small counter that changes with the visitor, and seasonal decoration.
- **Frequency.** New things appear often, and there is a "Get new posts" button.

This project copies the approach, not the content: it uses original titles and mechanics, and it does not use neal.fun's art or any real person's name.

## Limits to know about

- GitHub's scheduled runs can start 10 to 30 minutes late at busy times, so "it didn't post at exactly 2:00" is normal.
- GitHub disables scheduled workflows after 60 days with no repository activity. Whether bot commits count as activity was **not verified**; if posts stop, re-enable the workflow from the Actions tab.
- Titles are styled text, not drawn art. Making hand-drawn title art is a future step.

## Local preview

```bash
node scripts/generate.mjs
python -m http.server 8000
```

Then open http://localhost:8000/.
