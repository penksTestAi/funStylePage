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
| `hamburger` | A menu icon that runs away, turns into an X without opening, opens and shuts at once, offers one item, then none, and on the sixth press opens properly. Mouse or keyboard (Tab, Enter or Space). Nothing is sent or kept. |
| `stepper` | A number field whose plus and minus skip, miscount, go the wrong way and refuse for seven presses, then count honestly so you can reach 7. Mouse or keyboard (Tab, arrows, Enter, Space). |
| `breadcrumb` | A breadcrumb trail back to Home that grows a second Home, hides in dots, reverses and shuffles for four presses, then settles on the fifth. Mouse or keyboard (Tab, arrows, Enter, Space). |
| `modal` | An "Are you sure?" dialog that reopens, swaps its buttons and traps focus in the wrong place for four questions, then behaves on the fifth. Mouse or keyboard (Tab, arrows, Enter, Escape). |
| `checkbox` | A Select all box and four boxes that disagree, go stale and uncheck each other until, on the sixth press, they agree. Click or Tab, Space, Enter and arrows. |
| `toast` | A notification that wants dismissing, and a dismiss button with plans of its own. Five goes. |
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
| `form` | A bureaucratic form where every required field needs another field first. It can still be finished, via the one optional field. |
| `consent` | A cookie notice whose options multiply as you choose. "Continue with these" is always there, so it can be finished. |
| `dial` | An old radio tuner you drag through static. Six short text stations come in clearly; hear them all and the night ends. |
| `queue` | A phone support queue. Menu choices move your place in line, forwards and back, but a way to the front is always on offer. |
| `tangle` | A knotted earbud cable. Drag it apart; stretch it nearly straight and it is untangled, then it slowly curls up again. |
| `undo` | A small canvas with its undo history shown. Leave dots, then keep pressing Undo: it goes back past them, past the paper, to the ground. Mouse or keyboard. |
| `password` | A sign-up box whose password rules keep growing and contradicting each other. An appeal withdraws the older rule, and it can always be finished. Mouse or keyboard. |
| `captcha` | A "prove you are a person" check whose steps get stranger: a sadder checkbox, feeling tiles, a wobbly word, a feeling that must not be round. It can always be finished. Mouse or keyboard. Nothing typed is sent or kept. |
| `domino` | A row of dominoes you set up on a floor (click, drag or arrow keys and Enter). Tip the first one; it falls as far as the gaps allow, and a long enough chain rings the bell at the end. Mouse or keyboard. |
| `elevator` | A lift panel. The Close door button only half-listens (the third press counts), floors you skip may still stop it, and the top floor can always be reached. Mouse or keyboard. |
| `volume` | A volume control that is a marble on a plank. Tilt the plank (arrow keys, buttons or drag) and the marble rolls to a notch; give a neighbour the volume they ask for, three times. Biscuits help. Silent. Mouse or keyboard. |
| `stamp` | A loyalty card. Every stamp you collect moves the free-coffee line, sometimes further, sometimes closer, and it can always be reached. Click or arrow keys and Enter. Mouse or keyboard. |
| `thermostat` | An office thermostat with a dial that turns nicely and changes nothing. Try both ends and Facilities leaves a button. Mouse (drag) or keyboard (arrows, Home, End). |
| `rating` | A five-star review widget that argues back. Your stars are weighted against 1,204 other reviewers and drift to a tenth of what you meant; rate three times and Post review appears. Mouse or keyboard (arrows, Enter). |
| `autocorrect` | A text box that corrects your words into slightly worse ones, each with a confident "Did you mean...?" chip. Undoing a word is possible but takes presses, and each one you win makes the next cost more (up to 6). Send always works. Type or paste; mouse or keyboard (Tab to the chips, Enter). Nothing typed is sent or kept. |
| `tip` | A tablet tipping screen. The suggested percentages (18, 20, 25) creep up every second and new buttons appear. Pick any, type your own, or press No tip twice. Mouse or keyboard. Nothing typed is sent or kept. |
| `unsubscribe` | An email-preferences page. Press Unsubscribe and it finds another list you are still on (ten in all, under stranger names). The last press ends it. Mouse or keyboard. Nothing is sent or kept. |
| `update` | A "Restart to update" prompt. "Remind me later" offers fewer and smaller options each time, until only "Restart now" is left (five prompts in all). Mouse or keyboard. Nothing is sent or kept. |
| `badge` | An app icon with a red notification count. Mark all as read and it goes to 0, then finds a new reason to grow (eight in all; the last one is nothing). Mouse or keyboard. Nothing is sent or kept. |
| `dropdown` | A country select menu that re-sorts, nests or renames its options each time you open it. Open it enough and it runs out of ideas; pick Chile to finish. Mouse or keyboard. Nothing is sent or kept. |
| `carousel` | A holiday-photo slideshow. Each swipe, arrow key or button press (a turn) misbehaves in a new way: wrong direction, skipped photos, a repeat, upside down, a lap round the back. The sixth turn ends it. Mouse or keyboard. Nothing is sent or kept. |
| `tabs` | A tab strip with four sections. Each switch (click, arrow key, Home, End, Enter or Space) misbehaves in a new way: the wrong tab lit, the strip reshuffled, two tabs marked, a tab nobody asked for. The sixth switch merges them all. Mouse or keyboard. Nothing is sent or kept. |
| `accordion` | A FAQ with four sections. Each open or close (click, Enter or Space on a heading) misbehaves in a new way: the neighbour opens, a wall of padding, an instant change of heart, everything but yours, a section inside a section. The sixth go folds the lot into one. Nothing is sent anywhere. |
| `search` | A search box over a shed of eight things. Each search (Enter or the button) misbehaves in a new way: the last letter dropped, a different word searched, zero results listed anyway, a paid first result, the opposite searched. The sixth search finds you. Mouse or keyboard. Nothing is sent or kept. |
| `tooltip` | Three toolbar buttons and a hint for each, and the hint misbehaves: it arrives late, sits on the button it describes, points at the neighbour, leaves while you read, repeats the label, and once is simply correct (six goes). Press the button asked for. Mouse or keyboard (Tab, Enter or Space). Nothing is sent or kept. |

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
| `toggle` | A settings switch that will not stay off. Switch it off and it comes back on after a shorter wait each time, and a related switch appears (four times). The fifth time it stays off. Mouse or keyboard (Tab, Space or Enter). Nothing is sent or kept. |
| `pagination` | A search for how to boil an egg. Every Next lands on a slightly less useful page and the page count keeps growing (3, 5, 8, 12, 18, 26) until the seventh page, which is the answer. Mouse or keyboard. Nothing is sent or kept. |
| `sort` | A to-do list that "helpfully" re-sorts itself (alphabet, length, urgency, dread, reverse) each time you move a task. After five of your changes it gives up and your order stays. Drag, or Space and arrow keys. Nothing is sent or kept. |
