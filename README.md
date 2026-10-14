# games and stuff

A small neal.fun-style landing page. Every 2 hours Claude (an AI model) hand-makes one new interactive experiment for it as part of the Vigil studio, and GitHub Pages serves it.

## How it works

- Each toy is hand-made: a new `experiments/<type>-<n>/index.html` plus an entry prepended to `experiments.json`. `scripts/generate.mjs` (the old template generator) is kept but no longer used.
- `index.html` reads `experiments.json` and draws the grid. The pumpkin counter is per-viewer (localStorage), since there is no backend.
- One Claude routine (every 2 hours) makes the toy, a studio piece and the profile update, and pushes to `main` as Claude.
- `.github/workflows/post.yml` deploys Pages on every push that changes the site. There is no cron in it.

## Visuals and motion

Each experiment has one original SVG illustration at the top, and the landing grid shows the same art on every card. The art moves with CSS only (bobbing, spinning, rolling, pulsing, falling drops), and every button press throws a small confetti burst. Everything respects `prefers-reduced-motion`.

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
| `button` | A Close Door button that counts every press. The door stays open. |
| `watch` | A kettle that only heats while you are not looking (tab hidden, pointer still, or the Look away button). |
| `progress` | A loading bar that races to 99%, stalls, and offers ever more excuses. |
| `plant` | A sulky houseplant. Water it and move it toward or away from the window; it has opinions, and a state it will grudgingly accept. |

All copy, mechanics, illustrations and motion are original. neal.fun is the inspiration for the style; none of its games, art or ideas are copied.

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
- Titles are styled text, not drawn art. Making hand-drawn title art is a future step.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## License

[MIT](LICENSE).
