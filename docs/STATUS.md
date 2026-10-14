# Status

Last updated: 2026-10-14

## Done
- Research on https://neal.fun/ (three passes; notes in README.md).
- `scripts/generate.mjs`: generates one experiment per run, seven types, rotating. Tested all seven types in a scratch copy (scripts parse).
- `index.html` landing grid; reads `experiments.json`.
- Two posts generated locally: `experiments/spend-0001`, `experiments/days-0002`. Landing and one experiment checked in the browser, no console errors.
- `.github/workflows/post.yml`: deploys Pages on push to `main` (site paths); manual dispatch also runs the generator.
- Claude routine `funStylePage` (trigger `trig_01R2qUkcTzG93pSDNL17YF1Y`): every 2 hours, runs the generator and pushes to `main`. Server set the minute to :49 (cron `49 */2 * * *`).
- Repo renamed to `penksTestAi/funStylePage` (was `neal-fun-style`). Pages: https://penkstestai.github.io/funStylePage/
- Local commit on `main` (see git log).
- `README.md` with design notes and limits.
- Git repo initialised locally on branch `main`. Not pushed yet.

## In progress
- Nothing running.

## Blocked
- **Repo creation under `penksTestAi`.** The local `gh` login is `penkert-adus`, which has no write access to `penksTestAi`. `penksTestAi` is a User account (not an org), and it already has other repos (`claude-studio`, `penksTestAi`). Needs one of: the `penksTestAi` login, or a decision to create the repo under `penkert-adus`.
- **Not verified:** whether GitHub counts bot commits as activity for the 60-day scheduled-workflow disable.

## Manual steps waiting on the user
See the numbered block in the final message of the session that wrote this file.

## Next step
1. Decide the account for the repo (see Blocked).
2. Create the public repo, commit, push `main`.
3. Enable Pages (Settings > Pages > Source: GitHub Actions).
4. Run the workflow once from the Actions tab (`workflow_dispatch`) and confirm a new commit appears.
