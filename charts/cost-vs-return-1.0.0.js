/*!
 * cost-vs-return v1.0.0 – HTML-container chart
 * https://kaijxnes.github.io/HTML-Charts/
 * Reads a grid on the same page and draws the chart in the viewer's browser.
 * Makes no network requests except loading Chart.js (integrity-checked). No data leaves the page.
 */
(function () {
  /* ================= MOUNT ================= */
  // Builds this chart's layout inside every <div data-chart-embed="cost-vs-return"> placeholder on the page.
  // Optional: data-title="..." on the placeholder replaces the heading.
  const CHART_ID = "cost-vs-return";
  const TEMPLATE = "<div class=\"ss-wrap\" data-chart=\"cost-vs-return\">\n  <style>\n    .ss-wrap {\n      --ink: #14161f; --muted: #6b7080; --line: #eceef3; --chip: #f6f7fa;\n      --cost: #475569; --ret: #7C5CFF; --good: #0E9F6E; --bad: #E5484D; --cpu: #F59E0B;\n      font-family: \"Inter\", \"Segoe UI\", system-ui, -apple-system, sans-serif;\n      background: #fff; color: var(--ink); box-sizing: border-box; position: relative;\n      height: 100%; min-height: 900px; overflow-y: auto; padding: 20px 22px 18px;\n      display: flex; flex-direction: column; gap: 14px; border-radius: 14px;\n    }\n    .ss-wrap * { box-sizing: border-box; }\n    .ss-wrap .ss-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }\n    .ss-wrap h2 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }\n    .ss-wrap h3 { margin: 0; font-size: 13px; font-weight: 650; }\n    .ss-wrap .ss-sub { font-size: 12px; color: var(--muted); margin-top: 3px; display: block; }\n    .ss-wrap .ss-note { font-size: 11.5px; color: var(--muted); margin-top: 2px; display: block; }\n    .ss-wrap .ss-seg { display: inline-flex; background: var(--chip); border: 1px solid var(--line); border-radius: 10px; padding: 3px; gap: 2px; }\n    .ss-wrap .ss-seg button {\n      all: unset; cursor: pointer; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 7px; color: var(--muted);\n      transition: background .15s, color .15s, box-shadow .15s;\n    }\n    .ss-wrap .ss-seg button:hover { color: var(--ink); }\n    .ss-wrap .ss-seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20,22,31,.14); }\n    .ss-wrap .ss-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; }\n    .ss-wrap .ss-card { background: var(--chip); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px 11px; min-width: 0; }\n    .ss-wrap .ss-card.hero { background: #14161f; border-color: #14161f; }\n    .ss-wrap .ss-card.hero .lbl, .ss-wrap .ss-card.hero .sub { color: #b8bccb; }\n    .ss-wrap .ss-card.hero .val { color: #fff; }\n    .ss-wrap .ss-card .lbl { font-size: 12px; color: var(--muted); }\n    .ss-wrap .ss-card .val { font-size: 21px; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; white-space: nowrap; }\n    .ss-wrap .ss-card .sub { font-size: 11px; color: var(--muted); margin-top: 1px; }\n    .ss-wrap .pos { color: var(--good) !important; }\n    .ss-wrap .neg { color: var(--bad) !important; }\n    .ss-wrap .ss-charts { display: flex; gap: 18px; flex-wrap: wrap; }\n    .ss-wrap .ss-panel { flex: 3 1 460px; min-width: 0; display: flex; flex-direction: column; gap: 8px; }\n    .ss-wrap .ss-panel.small { flex: 2 1 320px; }\n    .ss-wrap .ss-panel .hint { font-size: 11.5px; color: var(--muted); }\n    .ss-wrap .ss-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); align-items: center; }\n    .ss-wrap .ss-legend .sw { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }\n    .ss-wrap .ss-legend .ln { display: inline-block; width: 18px; border-top: 2.5px solid; margin-right: 6px; vertical-align: 3px; }\n    .ss-wrap .ss-canvas { position: relative; height: 300px; }\n    .ss-wrap .ss-table { width: 100%; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }\n    .ss-wrap .ss-table th { text-align: right; font-weight: 600; color: var(--muted); padding: 7px 8px; border-bottom: 1px solid var(--line); white-space: nowrap; }\n    .ss-wrap .ss-table td { text-align: right; padding: 7px 8px; border-bottom: 1px solid var(--line); white-space: nowrap; }\n    .ss-wrap .ss-table th:first-child, .ss-wrap .ss-table td:first-child { text-align: left; }\n    .ss-wrap .ss-table tr.tot td { font-weight: 700; border-bottom: 0; border-top: 2px solid var(--ink); }\n    .ss-wrap .ss-tablewrap { overflow-x: auto; }\n    .ss-wrap .ss-msg { font-size: 12px; color: #c2410c; white-space: pre-wrap; }\n    .ss-wrap .ss-load {\n      position: absolute; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center;\n      background: rgba(255,255,255,.94); border-radius: 14px;\n    }\n    .ss-wrap .ss-load.show { display: flex; }\n    .ss-wrap .ss-load .box { width: min(340px, 80%); text-align: center; }\n    .ss-wrap .ss-load .spin { width: 34px; height: 34px; margin: 0 auto 14px; border-radius: 50%; border: 3px solid #eceef3; border-top-color: #7C5CFF; animation: ssSpin .8s linear infinite; }\n    .ss-wrap .ss-load .t { font-size: 14px; font-weight: 650; }\n    .ss-wrap .ss-load .bar { height: 6px; background: #eceef3; border-radius: 3px; margin: 12px 0 8px; overflow: hidden; position: relative; }\n    .ss-wrap .ss-load .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #7C5CFF; border-radius: 3px; transition: width .25s; }\n    .ss-wrap .ss-load .bar.indet i { width: 30%; animation: ssSlide 1.1s ease-in-out infinite; }\n    .ss-wrap .ss-load .n { font-size: 12px; color: var(--muted); min-height: 16px; }\n    @keyframes ssSpin { to { transform: rotate(360deg); } }\n    @keyframes ssSlide { 0% { left: -30%; } 100% { left: 100%; } }\n  </style>\n\n  <div class=\"ss-head\">\n    <div>\n      <h2>Cost vs Return</h2>\n      <span class=\"ss-sub\">Looking for the grid\u2026</span>\n      <span class=\"ss-note\"></span>\n    </div>\n    <div class=\"ss-seg\"></div>\n  </div>\n  <div class=\"ss-cards\"></div>\n  <div class=\"ss-charts\">\n    <div class=\"ss-panel\">\n      <h3>Cost vs return</h3>\n      <div class=\"ss-legend\" data-l=\"main\"></div>\n      <div class=\"ss-canvas\"><canvas data-c=\"main\"></canvas></div>\n    </div>\n    <div class=\"ss-panel small\">\n      <h3>Cost per unit vs value per unit</h3>\n      <div class=\"ss-legend\" data-l=\"unit\"></div>\n      <div class=\"ss-canvas\"><canvas data-c=\"unit\"></canvas></div>\n      <div class=\"hint\">Green gap = each unit returns more than it costs. Red = it costs more than it returns.</div>\n    </div>\n  </div>\n  <div class=\"ss-tablewrap\"><table class=\"ss-table\"></table></div>\n  <div class=\"ss-msg\"></div>\n  <details class=\"ss-dbg\" style=\"font-size:11px;color:#6b7080\"><summary style=\"cursor:pointer\">Read details</summary>\n    <button type=\"button\" style=\"font-size:11px;margin:6px 0;padding:3px 8px;border:1px solid #eceef3;border-radius:6px;background:#fff;cursor:pointer\"\n      onclick=\"var p=this.parentNode.querySelector('pre');try{navigator.clipboard.writeText(p.textContent)}catch(e){};var r=document.createRange();r.selectNodeContents(p);var s=getSelection();s.removeAllRanges();s.addRange(r);\">Copy</button>\n    <pre style=\"white-space:pre-wrap;margin:0;font:11px/1.45 Consolas,monospace;max-height:220px;overflow:auto;background:#f6f7fa;padding:8px;border-radius:8px\"></pre></details>\n  <div class=\"ss-load\"><div class=\"box\"><div class=\"spin\"></div><div class=\"t\">Loading data\u2026</div>\n    <div class=\"bar indet\"><i></i></div><div class=\"n\">Looking for the grid</div></div></div>\n</div>";
  function mount() {
    document.querySelectorAll('[data-chart-embed="' + CHART_ID + '"]').forEach(ph => {
      if (ph.getAttribute("data-mounted")) return;
      ph.setAttribute("data-mounted", "1");
      ph.innerHTML = TEMPLATE;
      const t = ph.getAttribute("data-title"), h = ph.querySelector("h2");
      if (t && h) h.textContent = t;
    });
  }
  mount();

  /* ================= SETTINGS ================= */
  // Chart.js 4.4.1 – tried in order. Both are the identical official file; the browser checks its fingerprint
  // (integrity hash) and refuses to run it if even one byte differs, wherever it comes from.
  const CHART_JS_SOURCES = [
    "https://kaijxnes.github.io/HTML-Charts/chart.umd-4.4.1.js",   // self-hosted copy (kaijxnes GitHub)
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"    // fallback: official npm file via jsDelivr
  ];
  const CHART_JS_INTEGRITY = "sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG";
  const DEFAULT_PERIOD = "12";

  // Grid column headers this chart looks for (matched ignoring spaces and case).
  // Override them per placeholder:  data-columns='{"v12":"Your Header", ...}'
  // On-screen names default to the column names; override with  data-labels='{"v12":"Short name", ...}'
  const COLUMN_NAMES = {
    month: "Month Key", idx: "Month Index",
    v12: "Metric 1", v18: "Metric 2", v24: "Metric 3",
    act: "Metric 4", cost: "Metric 5"
  };
  function phJSON(name) {
    const ph = document.querySelector('[data-chart-embed="' + CHART_ID + '"][' + name + ']');
    try { return ph ? JSON.parse(ph.getAttribute(name)) : {}; } catch (e) { return {}; }
  }
  const cmp = s => (s || "").replace(/\s+/g, "").toLowerCase();
  const COLNAMES = Object.assign({}, COLUMN_NAMES, phJSON("data-columns"));
  const L = Object.assign({}, COLNAMES, phJSON("data-labels"));
  const NAMES_C = Object.values(COLNAMES).map(cmp);
  const KEYWORDS = { test: s => { const t = cmp(s); return /[a-z]/.test(t) && NAMES_C.some(h => h.includes(t)); } };
  const NOT_FOUND = "Couldn't find the grid. Check a grid with these columns is visible on this page: " + Object.values(COLNAMES).join(", ") + ".";
  // Optional: the CSS classes of the grid's container and its scroll box, for grids that draw rows in batches
  // (data-grid-class / data-scroll-class on the placeholder). Without them the scroll box is found by testing.
  const phAttr = n => { const ph = document.querySelector('[data-chart-embed="' + CHART_ID + '"][' + n + ']'); return ph ? ph.getAttribute(n) : ""; };
  const GRID_CLASS = phAttr("data-grid-class"), SCROLL_CLASS = phAttr("data-scroll-class");

  const PERIODS = ["12", "18", "24"].map(k => ({ key: k, name: L["v" + k] }));
  const COLS = Object.keys(COLUMN_NAMES).map(id => ({ id, test: t => t === cmp(COLNAMES[id]) }));
  const P = Object.fromEntries(PERIODS.map(p => [p.key, p]));
  const SPLITS = [];

  /* ================= SETUP (each copy finds its own box) ================= */
  let wrap = null;
  const $ = sel => wrap.querySelector(sel);
  const msg = t => { if (wrap) $(".ss-msg").textContent = t; };
  const dbg = [];
  const descEl = e => !e ? "none" : e.tagName.toLowerCase() + (e.id ? "#" + String(e.id).slice(0, 40) : "") +
    (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 3).join(".") : "");
  function dlog(t) {
    dbg.push(new Date().toTimeString().slice(0, 8) + "  " + t);
    if (dbg.length > 200) dbg.shift();
    const pre = wrap && wrap.querySelector(".ss-dbg pre");
    if (pre) pre.textContent = dbg.join("\n");
  }
  const isVisible = e => !!e && e.getClientRects().length > 0;
  const compact = s => (s || "").replace(/\s+/g, "").toLowerCase();
  const clean = s => (s || "").replace(/\s+/g, " ").trim();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function claimWrap() {
    mount();
    const free = Array.from(document.querySelectorAll('.ss-wrap[data-chart="cost-vs-return"]'))
      .filter(w => !w.getAttribute("data-ss-init") && isVisible(w));
    if (!free.length) return false;
    wrap = free[0];
    wrap.setAttribute("data-ss-init", "1");
    return true;
  }

  /* ================= FORMATTING ================= */
  const moneyShort = v => {
    const a = Math.abs(v), s = v < 0 ? "-$" : "$";
    if (a >= 1e9) return s + (a / 1e9).toFixed(2) + "B";
    if (a >= 1e6) return s + (a / 1e6).toFixed(2) + "M";
    if (a >= 1e3) return s + (a / 1e3).toFixed(1) + "K";
    return s + Math.round(a);
  };
  const moneyAxis = v => {
    const a = Math.abs(v), s = v < 0 ? "-$" : "$";
    if (a >= 1e6) return s + (a / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (a >= 1e3) return s + (a / 1e3).toFixed(0) + "K";
    return s + a;
  };
  const money = (v, dp) => (v < 0 ? "-$" : "$") + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  const count = v => Math.round(v).toLocaleString("en-US");
  const pct = v => (v * 100).toFixed(v >= 0.1 ? 0 : 1) + "%";
  function parseNum(t) {
    t = clean(t);
    if (!t || !/^\(?\s*[-−]?\s*[$£€]?\s*[\d,]*\.?\d+\s*[kmb%]?\s*\)?$/i.test(t)) return null;   // must look like a number
    const neg = /^\(.*\)$/.test(t) || /^-/.test(t);
    let mult = 1;
    const suf = t.match(/([kmb])\s*\)?$/i);
    if (suf) mult = { k: 1e3, m: 1e6, b: 1e9 }[suf[1].toLowerCase()];
    const digits = t.replace(/[^0-9.]/g, "");
    if (!digits || isNaN(Number(digits))) return null;
    return (neg ? -1 : 1) * Number(digits) * mult;
  }
  const MONTHS = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  function parseMonth(t) {
    t = clean(t);
    let m = t.match(/([A-Za-z]{3,9})[\s,.\-\/]+'?(\d{4}|\d{2})\b/);
    if (m) {
      const mi = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
      let y = Number(m[2]); if (y < 100) y += 2000;
      if (mi > -1) return { y, m: mi };
    }
    m = t.match(/^(\d{4})[-\/]?(\d{1,2})$/);
    if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) return { y: Number(m[1]), m: Number(m[2]) - 1 };
    return null;
  }
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const shortMonth = pm => cap(MONTHS[pm.m]) + " '" + String(pm.y).slice(2);
  const longMonth = pm => cap(MONTHS[pm.m]) + " " + pm.y;

  /* ================= READ THE GRID ================= */
  function textNodes(root, filter) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || !n.nodeValue.trim()) continue;
      if (p.closest("script,style,.ss-wrap")) continue;
      if (filter && !filter(n)) continue;
      out.push(n);
    }
    return out;
  }
  function depth(e) { let d = 0; while (e) { d++; e = e.parentElement; } return d; }
  function lcaDepth(a, b) {
    const seen = new Set();
    for (let n = a; n; n = n.parentElement) seen.add(n);
    for (let n = b; n; n = n.parentElement) if (seen.has(n)) return depth(n);
    return 0;
  }
  function lca(list) {
    let node = list[0];
    while (node && !list.every(e => node.contains(e))) node = node.parentElement;
    return node;
  }
  const vOverlap = (a, b) => Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0;

  function findHeaders() {
    const cands = {};
    COLS.forEach(c => { cands[c.id] = []; });
    const seen = new Set();
    textNodes(document.body, n => KEYWORDS.test(n.nodeValue)).forEach(n => {
      let e = n.parentElement;
      for (let up = 0; e && up < 5; up++, e = e.parentElement) {
        if (e === document.body || e.contains(wrap)) break;
        const t = compact(e.textContent);
        if (t.length > 60) break;
        const col = COLS.find(c => c.test(t));
        if (col) {
          if (!seen.has(e) && isVisible(e)) { seen.add(e); cands[col.id].push(e); }
          break;
        }
      }
    });
    const anchorId = PERIODS.map(p => "v" + p.key).find(id => cands[id].length);
    if (!anchorId) return null;
    let best = null, bestScore = -1;
    cands[anchorId].forEach(a => {
      const ra = a.getBoundingClientRect();
      let score = 0;
      COLS.forEach(c => { if (cands[c.id].some(e => e !== a && vOverlap(ra, e.getBoundingClientRect()))) score++; });
      if (score > bestScore) { bestScore = score; best = a; }
    });
    const ra = best.getBoundingClientRect();
    const heads = {};
    COLS.forEach(c => {
      const mates = cands[c.id].filter(e => vOverlap(ra, e.getBoundingClientRect()));
      if (mates.length) heads[c.id] = mates.sort((x, y) => lcaDepth(best, y) - lcaDepth(best, x))[0];
    });
    return heads;
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const range = document.createRange();

  // Find the headers, column extents, grid container and (if any) the grid's scroll box
  function locate() {
    const heads = findHeaders();
    if (!heads || !PERIODS.some(p => heads["v" + p.key])) return null;
    const ids = Object.keys(heads), els = ids.map(id => heads[id]);
    const ranges = {}, headCells = [];
    ids.forEach(id => {
      let cell = heads[id];
      while (cell.parentElement && !els.some(o => o !== heads[id] && cell.parentElement.contains(o))) cell = cell.parentElement;
      headCells.push(cell);
      const r = cell.getBoundingClientRect();
      ranges[id] = { left: r.left, right: r.right };
    });
    const headerBottom = Math.max(...els.map(e => e.getBoundingClientRect().bottom));

    let root = lca(els);
    while (root.parentElement && root.parentElement !== document.body && !root.parentElement.contains(wrap) &&
           root.getBoundingClientRect().bottom < headerBottom + 30) root = root.parentElement;

    // a text node in the first data row – used to find the grid's scroll box
    const firstBody = textNodes(root).find(n => {
      if (headCells.some(c => c.contains(n))) return false;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      return r.width && r.top >= headerBottom - 1;
    });
    return { heads, ranges, headCells, headEls: els, root, firstBody, baseEl: null };
  }

  // positions are measured from the top of the scrolling content, so reads at different scroll positions line up
  const base = ctx => ctx.baseEl ? ctx.baseEl.getBoundingClientRect().top - ctx.baseEl.scrollTop : -window.scrollY;
  const newStore = () => ({ bits: [], seen: new Map() });

  function collect(ctx, store) {
    const b0 = base(ctx);
    const ids = Object.keys(ctx.ranges);
    const hb = Math.max(...ctx.headEls.map(e => e.getBoundingClientRect().bottom));   // header may be frozen or scrolled away
    const rootBottom = ctx.root.getBoundingClientRect().bottom;
    textNodes(ctx.root).forEach(n => {
      if (ctx.headCells.some(c => c.contains(n))) return;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width) return;
      if (ctx.baseEl) {
        // scrolling: positions are measured within the scrolling content, so rows that have slid behind a frozen
        // header still count – only skip a header copy that sits inside the scrolling content itself
        if (ctx.headInBox !== null && ctx.headInBox !== undefined && (r.top + r.bottom) / 2 - b0 < ctx.headInBox) return;
      } else if (r.top < hb - 1) return;
      // below the grid? (rows clipped inside the grid's own scroll box still count)
      if (!ctx.baseEl && r.bottom > rootBottom + 1 && !(ctx.clip && ctx.clip.some(c => c.contains(n)))) return;
      const cx = (r.left + r.right) / 2;
      const id = ids.find(k => cx >= ctx.ranges[k].left && cx <= ctx.ranges[k].right);
      if (!id) return;
      const text = clean(n.nodeValue), cy = (r.top + r.bottom) / 2 - b0;
      const key = id + "|" + text;
      const ys = store.seen.get(key) || [];
      if (ys.some(y => Math.abs(y - cy) < 4)) return;           // already have this cell
      ys.push(cy); store.seen.set(key, ys);
      store.bits.push({ id, text, x: r.left, cy, h: r.height });
    });
  }
  const textsNow = ctx => { const st = newStore(); collect(ctx, st); return new Set(st.bits.map(b => b.id + "|" + b.text)); };

  function parseBits(bits, useGap) {
    bits = bits.slice().sort((a, b) => a.cy - b.cy || a.x - b.x);
    const lines = [];
    bits.forEach(b => {
      const last = lines[lines.length - 1];
      if (last && Math.abs(b.cy - last.cy) <= Math.max(4, b.h * 0.6)) last.bits.push(b);
      else lines.push({ cy: b.cy, bits: [b] });
    });
    const gaps = lines.slice(1).map((l, i) => l.cy - lines[i].cy).sort((a, b) => a - b);
    const typical = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;

    const rows = [];
    let prevIdx = "";
    for (let i = 0; i < lines.length; i++) {
      if (useGap && i > 0 && typical && lines[i].cy - lines[i - 1].cy > typical * 4 && rows.length) break;
      const cell = {};
      lines[i].bits.sort((a, b) => a.x - b.x).forEach(b => { cell[b.id] = clean((cell[b.id] || "") + " " + b.text); });
      const v = {};
      PERIODS.forEach(p => { v[p.key] = parseNum(cell["v" + p.key]); });
      const act = parseNum(cell.act), cost = parseNum(cell.cost);
      if (PERIODS.every(p => v[p.key] === null) && act === null && cost === null) {
        // a wrapped second line of a month label
        const last = rows[rows.length - 1];
        if (last && cell.month && last.month && cell.month !== last.month) { last.month = clean(last.month + " " + cell.month); last.pm = parseMonth(last.month); }
        continue;
      }
      // idx is a merged label, so carry it down; the month key is NOT carried down –
      // a blank month means the row came from a bad join and is left out later
      if (cell.idx) prevIdx = cell.idx;
      if (/total/i.test(cell.idx || "") || /total/i.test(cell.month || "")) continue;
      rows.push({ idx: cell.idx || prevIdx, month: cell.month || "", pm: parseMonth(cell.month || ""), v, act, cost });
    }
    return rows;
  }

  // wait for the grid to draw after a scroll, reading as rows appear
  async function settle(ctx, store, expectNew) {
    const start = store.bits.length, t0 = Date.now();
    const limit = expectNew === false ? 400 : expectNew ? 7000 : 3000;   // the grid can take a few seconds to draw a batch
    await wait(70);
    let last = -1;
    while (Date.now() - t0 < limit) {
      collect(ctx, store);
      const n = store.bits.length;
      if (n > start && n === last) break;
      last = n;
      await wait(n > start ? 60 : 150);
    }
  }

  // how far down rows have been read in one unbroken run, starting at content position `from`
  function coveredTo(store, from, gap) {
    const ys = store.bits.map(b => b.cy).filter(y => y >= from - gap).sort((a, b) => a - b);
    let last = from;
    for (const y of ys) { if (y - last > gap) break; if (y > last) last = y; }
    return last;
  }

  function setTop(e, v) {
    e.scrollTop = v;
    try { e.dispatchEvent(new Event("scroll")); } catch (x) {}
  }

  // every box near the grid that has more content than it shows
  function scrollCandidates(ctx) {
    const ok = e => e && e.nodeType === 1 && e !== document.body && e !== document.documentElement &&
      !e.contains(wrap) && !wrap.contains(e) && e.scrollHeight > e.clientHeight + 8 && e.clientHeight > 15;
    const list = [];
    if (ctx.firstBody) for (let e = ctx.firstBody.parentElement; e; e = e.parentElement) if (ok(e)) list.push(e);
    let area = ctx.root;
    for (let i = 0; i < 3 && area.parentElement && area.parentElement !== document.body && !area.parentElement.contains(wrap); i++) area = area.parentElement;
    area.querySelectorAll("*").forEach(e => { if (!list.includes(e) && ok(e)) list.push(e); });
    const pri = e => /(auto|scroll|overlay)/.test(getComputedStyle(e).overflowY) ? 0 : 1;
    return list.sort((a, b) => pri(a) - pri(b) || b.scrollHeight - a.scrollHeight).slice(0, 8);
  }

  // scroll a candidate a little: does the grid draw new rows? (then put it back)
  async function tryScroller(ctx, e) {
    const before = e.scrollTop, seen = textsNow(ctx);
    const step = Math.max(60, Math.floor(e.clientHeight * 0.85));
    setTop(e, before + step);
    if (e.scrollTop === before) setTop(e, Math.max(0, before - step));
    if (e.scrollTop === before) return null;
    let works = false;
    const t0 = Date.now();
    while (!works && Date.now() - t0 < 2500) {
      await wait(150);
      for (const t of textsNow(ctx)) if (!seen.has(t)) { works = true; break; }
    }
    let mover = null;
    if (works) {
      // the element whose scroll position actually moves the rows (can differ from a separate scrollbar)
      const st = newStore(); collect(ctx, st);
      const probe = textNodes(ctx.root).find(n => !ctx.headCells.some(c => c.contains(n)));
      for (let a = probe && probe.parentElement; a && a !== document.body; a = a.parentElement) if (a.scrollTop > 0) { mover = a; break; }
    }
    setTop(e, before);
    await wait(150);
    return works ? { el: e, baseEl: mover || e } : null;
  }

  let scrollMemo = null;          // remembers which box scrolls the grid between reads
  let lastInfo = "";

  // Read every row: scrolls the grid top to bottom if it only draws what's on screen
  async function readAll(progress) {
    const ctx = locate();
    if (!ctx) return null;
    let store = newStore();

    // find the box that scrolls the rows
    let sc = null;
    const cands = scrollCandidates(ctx);
    ctx.clip = cands;
    // Some grids sit inside a scroll box (class given by data-scroll-class) that also holds the
    // header – use that box directly (its rows draw in batches, so a quick test can wrongly reject it)
    const okBox = x => x && x.classList && SCROLL_CLASS && x.classList.contains(SCROLL_CLASS) && x.scrollHeight > x.clientHeight + 8 && !x.contains(wrap) && !wrap.contains(x);
    const scrollNodeOf = start => {
      for (let e = start; e && e !== document.body; e = e.parentElement) {
        if (okBox(e)) return e;
        if (e.classList && GRID_CLASS && e.classList.contains(GRID_CLASS)) {        // the grid's container: frozen header + scroll box
          const best = [e].concat(Array.from((SCROLL_CLASS ? e.querySelectorAll("." + SCROLL_CLASS) : []))).filter(okBox)
            .sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
          if (best) return best;
        }
      }
      return null;
    };
    let gridBox = null;
    for (const h of ctx.headEls) { gridBox = scrollNodeOf(h); if (gridBox) break; }
    if (!gridBox && ctx.firstBody) gridBox = scrollNodeOf(ctx.firstBody.parentElement);
    dlog("Headers: " + Object.keys(ctx.heads).join(", ") + " | header y=" + Math.round(ctx.headEls[0].getBoundingClientRect().top));
    if (gridBox) {
      sc = gridBox; ctx.baseEl = gridBox; scrollMemo = { el: sc, baseEl: sc };
      if (!ctx.root.contains(sc)) ctx.root = lca([ctx.root, sc]) || ctx.root;
      dlog("Grid scroll box: " + descEl(sc) + " | scrollH=" + sc.scrollHeight + " clientH=" + sc.clientHeight + " top=" + sc.scrollTop +
           " | header inside box: " + sc.contains(ctx.headEls[0]));
    } else if (scrollMemo && scrollMemo.el && document.contains(scrollMemo.el) && cands.includes(scrollMemo.el)) {
      sc = scrollMemo.el; ctx.baseEl = scrollMemo.baseEl;
    } else if (!(scrollMemo && scrollMemo.none && scrollMemo.root === ctx.root && scrollMemo.n === cands.length)) {
      for (const e of cands) {
        const res = await tryScroller(ctx, e);
        if (res) { sc = res.el; ctx.baseEl = res.baseEl; break; }
      }
      scrollMemo = sc ? { el: sc, baseEl: ctx.baseEl } : { none: true, root: ctx.root, n: cands.length };
    }
    if (sc) {
      const b0 = base(ctx);
      let hbIn = null;
      textNodes(sc, n => KEYWORDS.test(n.nodeValue)).forEach(n => {
        let e = n.parentElement;
        for (let up = 0; e && up < 4 && sc.contains(e); up++, e = e.parentElement) {
          const t = compact(e.textContent);
          if (t.length > 60) break;
          if (COLS.some(c => c.test(t))) { const bt = e.getBoundingClientRect().bottom - b0; if (hbIn === null || bt > hbIn) hbIn = bt; break; }
        }
      });
      // only treat it as a header if it's near the top of the content
      ctx.headInBox = hbIn !== null && hbIn < 200 ? hbIn : null;
      dlog("Header copy inside scroll box: " + (ctx.headInBox === null ? "no" : "yes, ends at " + Math.round(ctx.headInBox) + "px"));
    }
    if (!sc) collect(ctx, store);

    if (sc) {
      const orig = sc.scrollTop;
      store = newStore();
      setTop(sc, 0);
      await settle(ctx, store);
      let guard = 0;
      while (guard++ < 4000) {
        const before = sc.scrollTop;
        const rowH = store.bits.length ? Math.max(12, store.bits[store.bits.length - 1].h * 1.5) : 20;
        // skip ahead over rows already read in one unbroken run from here (the grid keeps drawn rows),
        // but never jump over a gap – rows further down may have been drawn earlier with unread rows in between
        const covered = coveredTo(store, before, Math.max(rowH * 3, 60));
        setTop(sc, Math.max(before + Math.max(40, Math.floor(sc.clientHeight * 0.85)), covered - Math.floor(sc.clientHeight * 0.25)));
        if (sc.scrollTop === before) {
          // at the bottom – wait in case more rows are loading from the server
          const h0 = sc.scrollHeight, t0 = Date.now();
          while (sc.scrollHeight <= h0 + 2 && Date.now() - t0 < 4000) { await wait(250); collect(ctx, store); }
          if (sc.scrollHeight > h0 + 2) continue;
          break;
        }
        {
          const gap = Math.max(rowH * 3, 60);
          await settle(ctx, store, sc.scrollTop + sc.clientHeight > coveredTo(store, sc.scrollTop, gap) + rowH);
          // still nothing new where rows should be? nudge the box so the grid notices the scroll
          if (sc.scrollTop + sc.clientHeight > coveredTo(store, sc.scrollTop, gap) + rowH * 2) {
            setTop(sc, sc.scrollTop - 2); await wait(120); setTop(sc, sc.scrollTop + 2);
            await settle(ctx, store, true);
          }
        }
        if (progress) progress(parseBits(store.bits, false).length, Math.min(1, (sc.scrollTop + sc.clientHeight) / sc.scrollHeight));
        if (guard % 5 === 1) dlog("  step " + guard + ": top=" + sc.scrollTop + "/" + sc.scrollHeight + " · cells=" + store.bits.length + " · rows=" + parseBits(store.bits, false).length);
      }
      await settle(ctx, store);
      setTop(sc, orig);
      lastInfo = "";
    } else {
      lastInfo = "";
    }
    const rows = parseBits(store.bits, !sc);
    if (!sc) dlog("No scroll box used – read what's drawn (" + cands.length + " scrollable boxes tested)");
    dlog("Finished: " + rows.length + " rows · months: " + Array.from(new Set(rows.map(r => r.month))).filter(Boolean).slice(0, 14).join(", "));
    if (!rows.length) return null;
    return {
      rows, hasAct: !!ctx.heads.act, hasCost: !!ctx.heads.cost,
      periods: PERIODS.filter(p => ctx.heads["v" + p.key]).map(p => p.key),
      scrollH: sc ? sc.scrollHeight : 0
    };
  }

  // Cheap check between full reads: has the grid changed (filters, selectors)?
  const rowKey = r => [r.act, r.cost].concat(PERIODS.map(p => r.v[p.key])).join("|");   // values only – merged labels may be off-screen
  function looksChanged(d) {
    const ctx = locate();
    if (!ctx) return false;
    const sc = scrollMemo && scrollMemo.el;
    if (sc && document.contains(sc) && Math.abs(sc.scrollHeight - d.scrollH) > 2) return true;
    if (sc && scrollMemo.baseEl) ctx.baseEl = scrollMemo.baseEl;
    if (!sc) ctx.clip = scrollCandidates(ctx);
    const store = { bits: [], seen: new Map() };
    collect(ctx, store);
    const known = new Set(d.rows.map(rowKey));
    const vis = parseBits(store.bits, false);
    return vis.some(r => !known.has(rowKey(r)));
  }


  /* ================= METRICS ================= */
  const monthKey = r => r.pm ? r.pm.y * 12 + r.pm.m : r.month;
  function compute(pk) {
    const all = current.rows;
    const kept = all.filter(r => clean(r.month) !== "");           // only rows with a month key
    const byMonth = new Map();
    kept.forEach(r => {
      const k = monthKey(r);
      const m = byMonth.get(k) || { pm: r.pm, text: r.month, cost: 0, act: 0, ret: 0, actWithValue: 0 };
      m.cost += r.cost || 0;
      m.act += r.act || 0;
      if (r.v[pk] !== null && r.act !== null) { m.ret += r.v[pk] * r.act; m.actWithValue += r.act; }
      byMonth.set(k, m);
    });
    const keys = Array.from(byMonth.keys()).sort((a, b) => (typeof a === "number" && typeof b === "number") ? a - b : String(a).localeCompare(String(b)));
    const months = keys.map(k => {
      const m = byMonth.get(k);
      m.label = m.pm ? shortMonth(m.pm) : m.text;
      m.long = m.pm ? longMonth(m.pm) : m.text;
      m.net = m.ret - m.cost;
      m.roi = m.cost ? m.net / m.cost : null;
      m.roas = m.cost ? m.ret / m.cost : null;
      m.cpu = m.act ? m.cost / m.act : null;
      m.vpp = m.actWithValue ? m.ret / m.actWithValue : null;
      return m;
    });
    const t = months.reduce((a, m) => ({ cost: a.cost + m.cost, act: a.act + m.act, ret: a.ret + m.ret, actWithValue: a.actWithValue + m.actWithValue }),
                            { cost: 0, act: 0, ret: 0, actWithValue: 0 });
    t.net = t.ret - t.cost;
    t.roi = t.cost ? t.net / t.cost : null;
    t.roas = t.cost ? t.ret / t.cost : null;
    t.cpu = t.act ? t.cost / t.act : null;
    t.vpp = t.actWithValue ? t.ret / t.actWithValue : null;
    return { months, t, excluded: all.length - kept.length };
  }

  /* ================= RENDER ================= */
  const state = { period: DEFAULT_PERIOD };
  let charts = {}, current = null, lastSig = "", view = null;
  const signed = (v, f) => (v > 0 ? "+" : v < 0 ? "-" : "") + f(Math.abs(v));
  const roiTxt = v => v === null ? "–" : signed(v, x => (x * 100).toFixed(x >= 10 ? 0 : 1) + "%");
  const cls = v => v === null ? "" : v >= 0 ? "pos" : "neg";

  function buildControls() {
    const seg = $(".ss-seg");
    seg.innerHTML = "";
    PERIODS.forEach(p => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = p.name; b.setAttribute("data-k", p.key);
      b.onclick = () => { state.period = p.key; if (current) render(); };
      seg.appendChild(b);
    });
  }

  const zeroLine = {
    id: "ssZero",
    afterDatasetsDraw(c) {
      const s = c.scales.y1;
      if (!s) return;
      const y = s.getPixelForValue(0), a = c.chartArea;
      if (y < a.top || y > a.bottom) return;
      const ctx = c.ctx;
      ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = "#9aa0ad"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
      ctx.restore();
    }
  };

  const tip = {
    backgroundColor: "#14161f", padding: 12, cornerRadius: 10,
    titleFont: { weight: "600" }, bodySpacing: 5, boxPadding: 5, usePointStyle: true
  };
  const axisTicks = { color: "#6b7080", font: { size: 11 } };

  function render() {
    if (!current.periods.includes(state.period)) state.period = current.periods[0] || DEFAULT_PERIOD;
    const p = P[state.period];
    view = compute(p.key);
    const { months, t, excluded } = view;
    const hz = p.name;

    $(".ss-sub").textContent = L.cost + " against return (" + hz + ") · live from grid";
    $(".ss-note").textContent = months.length + " months" +
      (excluded ? " · " + excluded + " row" + (excluded > 1 ? "s" : "") + " without a month key left out" : "");
    msg(!current.hasCost ? "Couldn't find " + L.cost + " in the grid." : !current.hasAct ? "Couldn't find " + L.act + " in the grid – cost per unit and return need it." : "");

    $(".ss-seg").querySelectorAll("button").forEach(b => {
      const k = b.getAttribute("data-k");
      b.classList.toggle("on", k === p.key);
      b.style.display = current.periods.includes(k) ? "" : "none";
    });
    $(".ss-seg").style.display = current.periods.length > 1 ? "" : "none";

    // cards
    const card = (lbl, val, sub, extra) => '<div class="ss-card' + (extra || "") + '"><div class="lbl">' + lbl + '</div><div class="val">' + val + '</div><div class="sub">' + sub + '</div></div>';
    $(".ss-cards").innerHTML =
      card("Net return (" + hz + ")", '<span class="' + cls(t.net) + '">' + signed(t.net, moneyShort) + '</span>', moneyShort(t.ret) + " return − " + moneyShort(t.cost) + " cost", " hero") +
      card("ROI", '<span class="' + cls(t.roi) + '">' + roiTxt(t.roi) + '</span>', t.roas === null ? "" : "ROAS " + t.roas.toFixed(2) + "× · $" + t.roas.toFixed(2) + " back per $1") +
      card(L.cost, moneyShort(t.cost), months.length + " months") +
      card("Return", moneyShort(t.ret), L.act + " × " + hz) +
      card("Cost per unit", t.cpu === null ? "–" : money(t.cpu, 2), t.vpp === null ? "" : 'vs <b>' + money(t.vpp, 2) + '</b> value per unit') +
      card(L.act, count(t.act), t.cpu !== null && t.vpp !== null ? '<span class="' + cls(t.vpp - t.cpu) + '">' + signed(t.vpp - t.cpu, x => money(x, 2)) + "</span> margin per unit" : "");

    // legends
    $('[data-l="main"]').innerHTML =
      '<span><i class="sw" style="background:#475569"></i>' + L.cost + '</span>' +
      '<span><i class="sw" style="background:#7C5CFF"></i>Return (' + hz + ')</span>' +
      '<span><i class="ln" style="border-color:#14161f"></i>ROI %</span>' +
      '<span><i class="ln" style="border-color:#9aa0ad;border-top-style:dashed;border-top-width:1.5px"></i>Break-even (0% ROI)</span>';
    $('[data-l="unit"]').innerHTML =
      '<span><i class="ln" style="border-color:#7C5CFF"></i>Value per unit</span>' +
      '<span><i class="ln" style="border-color:#F59E0B"></i>Cost per unit</span>';

    const labels = months.map(m => m.label);

    // main chart
    const mainSets = [
      { type: "bar", label: L.cost, data: months.map(m => m.cost), backgroundColor: "#475569", borderRadius: 4, yAxisID: "y", order: 2, maxBarThickness: 30, categoryPercentage: 0.7, barPercentage: 0.9 },
      { type: "bar", label: "Return", data: months.map(m => m.ret), backgroundColor: "#7C5CFF", borderRadius: 4, yAxisID: "y", order: 2, maxBarThickness: 30, categoryPercentage: 0.7, barPercentage: 0.9 },
      { type: "line", label: "ROI", data: months.map(m => m.roi === null ? null : m.roi * 100), yAxisID: "y1", order: 1,
        borderColor: "#14161f", borderWidth: 2.5, tension: 0.3, cubicInterpolationMode: "monotone", spanGaps: true,
        pointRadius: 4, pointBorderWidth: 2, pointBackgroundColor: months.map(m => m.roi === null ? "#fff" : m.roi >= 0 ? "#0E9F6E" : "#E5484D"),
        pointBorderColor: "#fff", pointHoverRadius: 6 }
    ];
    const unitSets = [
      { label: "Value per unit", data: months.map(m => m.vpp), borderColor: "#7C5CFF", backgroundColor: "#7C5CFF", borderWidth: 2.5,
        tension: 0.3, cubicInterpolationMode: "monotone", pointRadius: 3.5, pointBackgroundColor: "#fff", pointBorderWidth: 2, spanGaps: true, fill: false },
      { label: "Cost per unit", data: months.map(m => m.cpu), borderColor: "#F59E0B", backgroundColor: "#F59E0B", borderWidth: 2.5,
        tension: 0.3, cubicInterpolationMode: "monotone", pointRadius: 3.5, pointBackgroundColor: "#fff", pointBorderWidth: 2, spanGaps: true,
        fill: { target: "-1", above: "rgba(229,72,77,0.16)", below: "rgba(14,159,110,0.16)" } }
    ];

    if (!charts.main) {
      charts.main = new Chart($('[data-c="main"]'), {
        data: { labels, datasets: mainSets },
        plugins: [zeroLine],
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          animation: { duration: 600, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            tooltip: Object.assign({}, tip, { callbacks: {
              title: it => view.months[it[0].dataIndex].long,
              label: c => c.dataset.type === "line" ? " ROI: " + roiTxt(c.parsed.y / 100) : " " + c.dataset.label + ": " + moneyShort(c.parsed.y),
              footer: it => { const m = view.months[it[0].dataIndex]; return ["Net: " + signed(m.net, moneyShort), m.roas === null ? "" : "ROAS: " + m.roas.toFixed(2) + "×"]; }
            } })
          },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: Object.assign({ maxRotation: 0, autoSkip: true }, axisTicks) },
            y: { beginAtZero: true, grid: { color: "#eceef3" }, border: { display: false }, ticks: Object.assign({ callback: moneyAxis, maxTicksLimit: 6 }, axisTicks) },
            y1: { position: "right", grid: { display: false }, border: { display: false }, grace: "10%",
                  ticks: Object.assign({ callback: v => v + "%", maxTicksLimit: 6 }, axisTicks) }
          }
        }
      });
      charts.unit = new Chart($('[data-c="unit"]'), {
        type: "line",
        data: { labels, datasets: unitSets },
        options: {
          responsive: true, maintainAspectRatio: false,
          interaction: { mode: "index", intersect: false },
          animation: { duration: 600, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            tooltip: Object.assign({}, tip, { callbacks: {
              title: it => view.months[it[0].dataIndex].long,
              label: c => " " + c.dataset.label + ": " + (c.parsed.y === null ? "–" : money(c.parsed.y, 2)),
              footer: it => { const m = view.months[it[0].dataIndex]; return m.vpp !== null && m.cpu !== null ? "Margin per unit: " + signed(m.vpp - m.cpu, x => money(x, 2)) : ""; }
            } })
          },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: Object.assign({ maxRotation: 0, autoSkip: true }, axisTicks) },
            y: { beginAtZero: true, grid: { color: "#eceef3" }, border: { display: false }, ticks: Object.assign({ callback: v => "$" + v, maxTicksLimit: 6 }, axisTicks) }
          }
        }
      });
    } else {
      charts.main.data.labels = labels; charts.main.data.datasets = mainSets; charts.main.update();
      charts.unit.data.labels = labels; charts.unit.data.datasets = unitSets; charts.unit.update();
    }

    // monthly table
    const td = (v, c) => '<td' + (c ? ' class="' + c + '"' : "") + '>' + v + '</td>';
    const rowHtml = (m, total) => '<tr' + (total ? ' class="tot"' : "") + '>' +
      td(total ? "Total" : esc(m.long)) + td(moneyShort(m.cost)) + td(count(m.act)) +
      td(m.cpu === null ? "–" : money(m.cpu, 2)) + td(m.vpp === null ? "–" : money(m.vpp, 2)) +
      td(moneyShort(m.ret)) + td(signed(m.net, moneyShort), cls(m.net)) + td(roiTxt(m.roi), cls(m.roi)) + '</tr>';
    $(".ss-table").innerHTML =
      '<thead><tr><th>Month</th><th>' + esc(L.cost) + '</th><th>' + esc(L.act) + '</th><th>Cost / unit</th><th>Value / unit</th><th>Return</th><th>Net return</th><th>ROI</th></tr></thead>' +
      '<tbody>' + months.slice().reverse().map(m => rowHtml(m)).join("") + rowHtml(t, true) + '</tbody>';
  }

  /* ================= REFRESH LOOP ================= */
  // loading screen: the chart only appears once every row has been read
  function showLoad(title, frac, note) {
    const L = $(".ss-load");
    L.classList.add("show");
    if (title) L.querySelector(".t").textContent = title;
    const bar = L.querySelector(".bar");
    bar.classList.toggle("indet", frac === null || frac === undefined);
    bar.querySelector("i").style.width = frac === null || frac === undefined ? "" : Math.round(frac * 100) + "%";
    if (note !== undefined) L.querySelector(".n").textContent = note;
  }
  const hideLoad = () => $(".ss-load").classList.remove("show");

  let busy = false, pending = false;
  async function fullRefresh() {
    if (busy) { pending = true; return !!current; }
    busy = true;
    let d = null;
    showLoad(current ? "Refreshing data…" : "Loading data…", null, "Reading the grid");
    try {
      d = await readAll((n, f) => showLoad(null, f, Math.round(f * 100) + "% · " + count(n) + " rows read"));
    } catch (e) { msg("Error reading grid: " + e.message); }
    if (d) {
      current = d;
      lastSig = JSON.stringify(d.rows);
      try { render(); } catch (e) { msg("Chart error: " + e.message); }
      hideLoad();
    } else if (current) hideLoad();
    else showLoad("Loading data…", null, "Looking for the grid");
    await wait(400);                     // let the grid settle after scrolling back
    busy = false;
    if (pending) { pending = false; setTimeout(check, 300); }
    return !!d;
  }

  function check() {
    if (busy || !current) return;
    try { if (looksChanged(current)) fullRefresh(); } catch (e) {}
  }

  let watching = false;
  function watch() {
    if (watching) return;
    watching = true;
    let t;
    const bump = () => { if (busy) return; clearTimeout(t); t = setTimeout(check, 600); };
    try {
      new MutationObserver(muts => { if (muts.some(m => !wrap.contains(m.target))) bump(); })
        .observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    setInterval(check, 8000);
  }

  function start() {
    if (!wrap && !claimWrap()) { setTimeout(start, 500); return; }
    buildControls();
    let tries = 0;
    const attempt = async () => {
      if (await fullRefresh()) { watch(); return; }
      if (++tries === 30) {
        hideLoad();
        msg(NOT_FOUND);
        $(".ss-sub").textContent = "No grid found – still watching";
        watch();
        const retry = setInterval(async () => { if (!busy && await fullRefresh()) clearInterval(retry); }, 5000);
        return;
      }
      setTimeout(attempt, 500);
    };
    attempt();
  }

  function loadChartJs(i) {
    if (window.Chart) return start();
    if (i >= CHART_JS_SOURCES.length) {
      claimWrap();
      msg("Chart.js couldn't be loaded, or the file didn't match its expected fingerprint, so it wasn't run.");
      return;
    }
    const s = document.createElement("script");
    s.src = CHART_JS_SOURCES[i];
    s.integrity = CHART_JS_INTEGRITY;      // reject the file if it has been altered
    s.crossOrigin = "anonymous";           // required for the integrity check; sends no cookies
    s.onload = () => (window.Chart ? start() : loadChartJs(i + 1));
    s.onerror = () => { s.remove(); loadChartJs(i + 1); };
    document.head.appendChild(s);
  }
  loadChartJs(0);
})();
