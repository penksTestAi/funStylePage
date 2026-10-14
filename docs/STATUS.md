# Status

Last updated: 2026-10-14

## Done
- Research on https://neal.fun/ (three passes; notes in README.md).
- `scripts/generate.mjs`: generates one experiment per run, seven types, rotating. Tested all seven types in a scratch copy (scripts parse).
- `index.html` landing grid; reads `experiments.json`.
- Two posts generated locally: `experiments/spend-0001`, `experiments/days-0002`. Landing and one experiment checked in the browser, no console errors.
- `.github/workflows/post.yml`: deploys Pages on push to `main` (site paths); manual dispatch also runs the generator.
- Claude routine `funStylePage` (trigger `trig_01R2qUkcTzG93pSDNL17YF1Y`): ENABLED, every 2 hours at :49 UTC. The Claude GitHub App was installed on funStylePage, and the first push from the routine landed (4176f8d). The Actions cron was removed again so there is one poster.
- Repo renamed to `penksTestAi/funStylePage` (was `neal-fun-style`). Pages: https://penkstestai.github.io/funStylePage/
- Pushed to `main` on funStylePage. Routine posts and the Pages deploy run from there.
- Added original SVG illustrations per type, CSS motion, and confetti on button presses (mid-task request: more visuals and life, inspired by neal.fun but no copied ideas).
- Older posts (spend-0001, days-0002, dilemma-0003, and the first routine post) predate the illustrations, so their landing cards show an empty thumbnail until replaced.
- `README.md` with design notes and limits.

## In progress
- Nothing running.

## Blocked
- Nothing blocked.
- **Not verified:** whether GitHub counts bot commits as activity for the 60-day scheduled-workflow disable. The routine is the scheduler now, so this matters only if the routine is ever paused.
- **Not verified:** the first routine run has not finished yet (next run was set for 08:49Z); check it with RemoteTrigger list_runs.

## Manual steps waiting on the user
See the numbered block in the final message of the session that wrote this file.

## Next step
1. Decide the account for the repo (see Blocked).
2. Create the public repo, commit, push `main`.
3. Enable Pages (Settings > Pages > Source: GitHub Actions).
4. Run the workflow once from the Actions tab (`workflow_dispatch`) and confirm a new commit appears.
