// Generates one new "experiment" page per run and updates experiments.json.
// Zero dependencies. Run with: node scripts/generate.mjs
// Each run picks the next experiment type in rotation, so consecutive posts never repeat a type.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = join(ROOT, "experiments.json");

// Small seeded PRNG (mulberry32) so a given post number always renders the same way.
function rngFrom(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (rng, list) => list[Math.floor(rng() * list.length)];
const between = (rng, lo, hi) => lo + rng() * (hi - lo);

const SHELL = (title, body, script = "") => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · games and stuff</title>
<style>
  :root { --ink: #111; --paper: #fff; --accent: #1a6ef0; --soft: #e7e7e7; }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) { --ink: #eee; --paper: #161616; --accent: #6aa8ff; --soft: #262626; }
  }
  :root[data-theme="dark"] { --ink: #eee; --paper: #161616; --accent: #6aa8ff; --soft: #262626; }
  body { margin: 0; background: var(--paper); color: var(--ink); font-family: Roboto, system-ui, sans-serif; }
  main { max-width: 640px; margin: 0 auto; padding: 16px; text-align: center; }
  h1 { font-size: 2rem; margin: 24px 0 4px; }
  .blurb { opacity: .75; margin: 0 0 24px; }
  button { font: inherit; background: var(--accent); color: #fff; border: 0; border-radius: 6px; padding: 10px 16px; cursor: pointer; margin: 4px; }
  button.ghost { background: var(--soft); color: var(--ink); }
  .big { font-size: 3rem; font-weight: 700; font-variant-numeric: tabular-nums; margin: 16px 0; }
  .row { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
  .card { background: var(--soft); border-radius: 8px; padding: 12px; margin: 8px 0; }
  a.back { display: inline-block; margin-top: 32px; color: var(--accent); }
  canvas { max-width: 100%; background: var(--soft); border-radius: 8px; touch-action: none; }
  select { font: inherit; padding: 8px; max-width: 100%; }
</style>
</head>
<body>
<main>
${body}
<a class="back" href="../../">← all games and stuff</a>
</main>
<script>${script}</script>
</body>
</html>
`;

// Each type returns { title, blurb, html }. All copy is original.
const TYPES = {
  spend(rng) {
    const items = [
      ["a pumpkin-shaped yacht", 2.1e7], ["one (1) sentient toaster", 4.5e5], ["a mountain, slightly used", 9.9e9],
      ["the moon's second-best crater", 3.3e8], ["a lifetime supply of left socks", 1.2e6], ["a gravel driveway for the sun", 6.6e10],
      ["a small island that only seagulls know about", 8.0e7], ["an opinion about rain, delivered in person", 2.4e5],
    ].sort(() => rng() - 0.5).slice(0, 5).map(([name, base]) => ({ name, price: Math.round(base * between(rng, 0.7, 1.4)) }));
    const balance = Math.round(between(rng, 5e10, 9e10));
    const script = `
      const items = ${JSON.stringify(items)};
      let balance = ${balance};
      const fmt = n => "$" + Math.round(n).toLocaleString("en-US");
      const render = () => {
        document.getElementById("bal").textContent = fmt(balance);
        document.querySelectorAll("button[data-i]").forEach(b => {
          const it = items[+b.dataset.i];
          b.disabled = it.bought || it.price > balance;
          b.textContent = it.bought ? "owned ✓" : it.name + " — " + fmt(it.price);
        });
      };
      document.getElementById("list").innerHTML = items.map((it, i) => '<button data-i="' + i + '"></button>').join("");
      document.querySelectorAll("button[data-i]").forEach(b => b.onclick = () => {
        const it = items[+b.dataset.i]; balance -= it.price; it.bought = true; render();
      });
      render();`;
    return {
      title: "Spend the Pumpkin Fund",
      blurb: "A very large bank account and a very short shopping list.",
      html: `<h1>Spend the Pumpkin Fund</h1><p class="blurb">A very large bank account and a very short shopping list.</p>
<div class="big" id="bal"></div><div class="row" id="list"></div>
<p class="blurb">Prices are estimates. Refunds are not available from the sun.</p>`,
      script,
    };
  },

  days(rng) {
    const incident = pick(rng, ["the stapler", "the Tuesday", "the seagull situation", "the printer's second birthday", "the great sandwich spill"]);
    const startDaysAgo = Math.floor(between(rng, 0, 400));
    const script = `
      let start = Date.now() - ${startDaysAgo} * 864e5, count = ${Math.floor(between(rng, 1, 9))};
      const days = () => Math.floor((Date.now() - start) / 864e5);
      const tick = () => document.getElementById("days").textContent = days().toLocaleString("en-US");
      document.getElementById("reset").onclick = () => { start = Date.now(); count++; document.getElementById("count").textContent = count; tick(); };
      document.getElementById("count").textContent = count;
      tick(); setInterval(tick, 60000);`;
    return {
      title: "Days Since Incident",
      blurb: `Days since ${incident}, and counting.`,
      html: `<h1>Days Since Incident</h1><p class="blurb">Days since ${incident}, and counting.</p>
<div class="big" id="days">0</div>
<button id="reset">Report another incident</button>
<div class="card">Incidents reported this session: <strong id="count"></strong></div>`,
      script,
    };
  },

  dilemma(rng) {
    const scenario = (() => {
      const track = pick(rng, ["five very polite pigeons", "a parade of mildly confused accountants", "the last functioning fax machine", "a convoy of rubber ducks"]);
      const side = pick(rng, ["a grand piano", "a bakery on wheels", "your favourite chair", "an unsupervised toddler on a skateboard"]);
      return { track, side };
    })();
    const consequences = [
      "Everyone involved agrees this was the correct vibe.",
      "The pigeons form a committee. It is very dramatic.",
      "Nobody gets hurt. The piano is a little out of tune.",
      "The accountants receive a 4% tax refund and a fresh sense of purpose.",
      "History will remember you as the person who chose the chair.",
    ];
    const script = `
      const consequences = ${JSON.stringify(consequences)};
      const scenarios = ${JSON.stringify(["five very polite pigeons", "a parade of mildly confused accountants", "the last functioning fax machine", "a convoy of rubber ducks"])};
      const sides = ${JSON.stringify(["a grand piano", "a bakery on wheels", "your favourite chair", "an unsupervised toddler on a skateboard"])};
      const pickOf = a => a[Math.floor(Math.random() * a.length)];
      const deal = () => {
        document.getElementById("track").textContent = pickOf(scenarios);
        document.getElementById("side").textContent = pickOf(sides);
        document.getElementById("result").textContent = "";
      };
      document.getElementById("pull").onclick = () => document.getElementById("result").textContent = pickOf(consequences);
      document.getElementById("hold").onclick = () => document.getElementById("result").textContent = "You did nothing. The trolley is still going. Nothing is fine.";
      document.getElementById("next").onclick = deal;
      deal();`;
    return {
      title: "Absurd Trolley Problem",
      blurb: "A trolley, a lever, and a choice nobody asked for.",
      html: `<h1>Absurd Trolley Problem</h1><p class="blurb">A trolley, a lever, and a choice nobody asked for.</p>
<div class="card">A runaway trolley is heading toward <strong id="track">${scenario.track}</strong>.<br>
The lever would divert it toward <strong id="side">${scenario.side}</strong>.</div>
<div class="row"><button id="pull">Pull the lever</button><button class="ghost" id="hold">Do nothing</button></div>
<p id="result"></p>
<button class="ghost" id="next">New dilemma</button>`,
      script,
    };
  },

  circle(rng) {
    const script = `
      const c = document.getElementById("c"), ctx = c.getContext("2d");
      let pts = [];
      const pos = e => { const r = c.getBoundingClientRect(); return { x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height }; };
      const draw = () => { ctx.clearRect(0, 0, c.width, c.height); ctx.strokeStyle = "#1a6ef0"; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); };
      c.onpointerdown = e => { pts = [pos(e)]; c.setPointerCapture(e.pointerId); };
      c.onpointermove = e => { if (pts.length) { pts.push(pos(e)); draw(); } };
      c.onpointerup = () => {
        if (pts.length < 10) { document.getElementById("score").textContent = "That was a dot, not a circle."; pts = []; return; }
        const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length, cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        const rs = pts.map(p => Math.hypot(p.x - cx, p.y - cy)), mean = rs.reduce((s, r) => s + r, 0) / rs.length;
        const sd = Math.sqrt(rs.reduce((s, r) => s + (r - mean) ** 2, 0) / rs.length);
        const score = Math.max(0, Math.min(100, Math.round(100 - (sd / mean) * 300)));
        const verdict = score > 95 ? "Suspiciously perfect. Are you a compass?" : score > 80 ? "A respectable circle." : score > 50 ? "A circle-shaped opinion." : "A potato with ambition.";
        document.getElementById("score").innerHTML = "Circularity: <strong>" + score + "/100</strong><br>" + verdict;
        pts = [];
      };
      document.getElementById("clear").onclick = () => { pts = []; draw(); document.getElementById("score").textContent = ""; };`;
    return {
      title: "Draw a Perfect Circle",
      blurb: "Draw one freehand. We will judge it.",
      html: `<h1>Draw a Perfect Circle</h1><p class="blurb">Draw one freehand. We will judge it.</p>
<canvas id="c" width="400" height="400"></canvas>
<p id="score"></p>
<button class="ghost" id="clear">Try again</button>`,
      script,
    };
  },

  settle(rng) {
    const debates = [
      ["Cereal is soup", "Cereal is not soup"],
      ["A hot dog is a sandwich", "A hot dog is a taco"],
      ["Pineapple belongs on pizza", "Pineapple belongs in a fruit bowl"],
      ["The sock goes before the shoe", "The shoe goes before the sock"],
      ["Water is wet", "Water is a feeling"],
    ];
    const [a, b] = pick(rng, debates);
    const va = Math.floor(between(rng, 30, 120)), vb = Math.floor(between(rng, 30, 120));
    const script = `
      let votes = [${va}, ${vb}];
      const render = () => {
        const total = votes[0] + votes[1];
        [0, 1].forEach(i => {
          const pct = Math.round(votes[i] / total * 100);
          document.getElementById("bar" + i).style.width = pct + "%";
          document.getElementById("pct" + i).textContent = pct + "% (" + votes[i] + " votes)";
        });
      };
      [0, 1].forEach(i => document.getElementById("vote" + i).onclick = () => { votes[i]++; render(); document.getElementById("verdict").textContent = "Thanks. The debate continues."; });
      render();`;
    return {
      title: "Let's Settle This",
      blurb: "A debate. A vote. No resolution.",
      html: `<h1>Let's Settle This</h1><p class="blurb">A debate. A vote. No resolution.</p>
<div class="card"><button id="vote0">${a}</button><div style="height:12px;background:var(--paper);border-radius:6px;overflow:hidden"><div id="bar0" style="height:12px;background:var(--accent);width:50%"></div></div><small id="pct0"></small></div>
<div class="card"><button id="vote1">${b}</button><div style="height:12px;background:var(--paper);border-radius:6px;overflow:hidden"><div id="bar1" style="height:12px;background:var(--accent);width:50%"></div></div><small id="pct1"></small></div>
<p id="verdict"></p>`,
      script,
    };
  },

  scale(rng) {
    // Real-world approximate sizes in metres (length or height).
    const things = [
      ["a grain of sand", 0.0005], ["a coffee mug", 0.1], ["an average adult human", 1.7], ["a giraffe", 5.5],
      ["a blue whale", 30], ["the Eiffel Tower", 330], ["Mount Everest", 8849], ["the Earth (diameter)", 12742000], ["the Sun (diameter)", 1392000000],
    ];
    const a = pick(rng, things), b = pick(rng, things.filter(t => t !== a));
    const script = `
      const things = ${JSON.stringify(things)};
      const sel = (id, v) => { const s = document.getElementById(id); s.innerHTML = things.map((t, i) => '<option value="' + i + '">' + t[0] + '</option>').join(""); s.value = v; return s; };
      const sa = sel("a", ${things.indexOf(a)}), sb = sel("b", ${things.indexOf(b)});
      const out = () => {
        const x = things[+sa.value], y = things[+sb.value];
        const r = x[1] / y[1];
        const nice = r >= 1000 || r < 0.01 ? r.toExponential(2) : r >= 10 ? Math.round(r).toLocaleString("en-US") : r.toFixed(2);
        document.getElementById("out").innerHTML = x[0] === y[0] ? "Same thing. Still the same size." : "<strong>" + x[0] + "</strong> is about <strong>" + nice + "×</strong> the size of <strong>" + y[0] + "</strong>.";
      };
      sa.onchange = out; sb.onchange = out; out();`;
    return {
      title: "The Size of Things",
      blurb: "Pick two things. Be surprised.",
      html: `<h1>The Size of Things</h1><p class="blurb">Pick two things. Be surprised.</p>
<div class="row"><select id="a"></select><select id="b"></select></div>
<p class="card" id="out"></p>
<p class="blurb">Sizes are rough, length or diameter in metres. Accuracy is a vibe.</p>`,
      script,
    };
  },

  forecast(rng) {
    const script = `
      const parts = {
        when: ["Tomorrow", "Later this week", "Sometime in March", "At 3:14 PM, precisely"],
        what: ["a 40% chance of Thursday", "light drizzle of unread emails", "a dense fog of small decisions", "clear skies, with a sudden urge to reorganise the spice rack", "a strong breeze from the direction of the fridge"],
        where: ["over the western suburbs", "in your general area", "mostly indoors", "above the nearest pigeon"],
      };
      const pickOf = a => a[Math.floor(Math.random() * a.length)];
      const roll = () => document.getElementById("fc").textContent = pickOf(parts.when) + ": " + pickOf(parts.what) + ", " + pickOf(parts.where) + ".";
      document.getElementById("again").onclick = roll; roll();`;
    return {
      title: "Universe Forecast",
      blurb: "Accurate to within several weeks.",
      html: `<h1>Universe Forecast</h1><p class="blurb">Accurate to within several weeks.</p>
<div class="card big" style="font-size:1.4rem" id="fc"></div>
<button id="again">New forecast</button>`,
      script,
    };
  },
};

const ORDER = Object.keys(TYPES);

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, "utf8"));
  } catch {
    return [];
  }
}

const manifest = await readManifest();
const n = manifest.length + 1;
const rng = rngFrom(n * 2654435761);
const typeId = ORDER[(n - 1) % ORDER.length];
const made = TYPES[typeId](rng);
const slug = `${typeId}-${String(n).padStart(4, "0")}`;
const date = new Date().toISOString();

await mkdir(join(ROOT, "experiments", slug), { recursive: true });
await writeFile(join(ROOT, "experiments", slug, "index.html"), SHELL(made.title, made.html, made.script));

const entry = { slug, type: typeId, title: made.title, blurb: made.blurb, date };
await writeFile(MANIFEST, JSON.stringify([entry, ...manifest], null, 2) + "\n");
console.log(`Generated experiments/${slug}/index.html (${made.title})`);
