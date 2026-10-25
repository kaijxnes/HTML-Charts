/*!
 * quadrant-scatter v1.2.0 – HTML-container chart
 * https://viz.kaijxnes.com/
 * Reads a grid on the same page and draws the chart in the viewer's browser.
 * Makes no network requests except loading Chart.js (integrity-checked). No data leaves the page.
 */
(function () {
  /* ================= MOUNT ================= */
  // Builds this chart's layout inside every <div data-chart-embed="quadrant-scatter"> placeholder on the page.
  // Optional: data-title="..." on the placeholder replaces the heading.
  const CHART_ID = "quadrant-scatter";
  const TEMPLATE = "<div class=\"cc-wrap\" data-chart=\"quadrant-scatter\">\n  <style>\n    .cc-wrap {\n      --ink: #14161f; --muted: #6b7080; --line: #eceef3; --chip: #f6f7fa;\n      font-family: \"Inter\", \"Segoe UI\", system-ui, -apple-system, sans-serif;\n      background: #fff; color: var(--ink); box-sizing: border-box;\n      height: 100%; min-height: 560px; padding: 20px 22px 14px;\n      display: flex; flex-direction: column; gap: 14px; border-radius: 14px;\n    }\n    .cc-wrap * { box-sizing: border-box; }\n    .cc-wrap .cc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }\n    .cc-wrap h2 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }\n    .cc-wrap .cc-sub { font-size: 12px; color: var(--muted); margin-top: 3px; display: block; }\n    .cc-wrap .cc-controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }\n    .cc-wrap .cc-ctl { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; }\n    .cc-wrap .cc-seg { display: inline-flex; background: var(--chip); border: 1px solid var(--line); border-radius: 10px; padding: 3px; gap: 2px; }\n    .cc-wrap .cc-seg button {\n      all: unset; cursor: pointer; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 7px;\n      color: var(--muted); text-transform: none; letter-spacing: 0; transition: background .15s, color .15s, box-shadow .15s;\n    }\n    .cc-wrap .cc-seg button:hover { color: var(--ink); }\n    .cc-wrap .cc-seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20,22,31,.14); }\n    .cc-wrap .cc-cards { display: flex; gap: 10px; flex-wrap: wrap; }\n    .cc-wrap .cc-card { flex: 1 1 160px; background: var(--chip); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px 11px; }\n    .cc-wrap .cc-card.hero { background: #14161f; border-color: #14161f; }\n    .cc-wrap .cc-card.hero .lbl, .cc-wrap .cc-card.hero .sub { color: #b8bccb; }\n    .cc-wrap .cc-card.hero .val { color: #fff; }\n    .cc-wrap .cc-card .lbl { font-size: 12px; color: var(--muted); }\n    .cc-wrap .cc-card .val { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .cc-wrap .cc-card .sub { font-size: 11px; color: var(--muted); margin-top: 1px; }\n    .cc-wrap .cc-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); align-items: center; }\n    .cc-wrap .cc-legend .sw { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }\n    .cc-wrap .cc-legend .ln { display: inline-block; width: 18px; border-top: 2.5px solid #14161f; margin-right: 6px; vertical-align: 3px; }\n    .cc-wrap .cc-body { display: flex; gap: 18px; flex: 1 1 auto; flex-wrap: wrap; min-height: 320px; }\n    .cc-wrap .cc-canvas { position: relative; flex: 3 1 480px; min-height: 320px; }\n    .cc-wrap .cc-rank { flex: 1 1 230px; max-width: 100%; display: flex; flex-direction: column; gap: 4px; }\n    .cc-wrap .cc-rank h3 { margin: 0 0 6px; font-size: 13px; font-weight: 650; }\n    .cc-wrap .cc-list { max-height: 380px; overflow-y: auto; padding-right: 4px; }\n    .cc-wrap .cc-item { padding: 8px 0; border-top: 1px solid var(--line); }\n    .cc-wrap .cc-item .top { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; }\n    .cc-wrap .cc-item .name { display: flex; align-items: center; gap: 7px; font-weight: 600; min-width: 0; }\n    .cc-wrap .cc-item .name span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-item .dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }\n    .cc-wrap .cc-item .amt { font-weight: 700; white-space: nowrap; }\n    .cc-wrap .cc-item .bar { height: 6px; background: var(--chip); border-radius: 3px; margin: 6px 0 4px; overflow: hidden; }\n    .cc-wrap .cc-item .bar i { display: block; height: 100%; border-radius: 3px; }\n    .cc-wrap .cc-item .meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }\n    .cc-wrap { position: relative; }\n    .cc-wrap .cc-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; position: relative; }\n    .cc-wrap .cc-filters .ttl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; margin-right: 2px; }\n    .cc-wrap .cc-fbtn {\n      all: unset; cursor: pointer; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line);\n      background: #fff; color: var(--ink); display: inline-flex; gap: 6px; align-items: center; white-space: nowrap;\n    }\n    .cc-wrap .cc-fbtn b { font-weight: 600; }\n    .cc-wrap .cc-fbtn .chev { color: var(--muted); font-size: 10px; }\n    .cc-wrap .cc-fbtn.on { background: #14161f; border-color: #14161f; color: #fff; }\n    .cc-wrap .cc-fbtn.on .chev { color: #b8bccb; }\n    .cc-wrap .cc-clear { all: unset; cursor: pointer; font-size: 12px; color: #7C5CFF; font-weight: 600; padding: 6px 4px; }\n    .cc-wrap .cc-pop {\n      position: absolute; z-index: 20; top: 100%; margin-top: 6px; width: 290px; background: #fff; border: 1px solid var(--line);\n      border-radius: 12px; box-shadow: 0 12px 32px rgba(20,22,31,.16); padding: 8px; font-size: 12.5px;\n    }\n    .cc-wrap .cc-pop input[type=text] {\n      width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 7px 9px; font: inherit; margin-bottom: 6px; outline: none;\n    }\n    .cc-wrap .cc-pop .opts { max-height: 250px; overflow-y: auto; }\n    .cc-wrap .cc-pop label { display: flex; align-items: center; gap: 8px; padding: 6px 6px; border-radius: 7px; cursor: pointer; }\n    .cc-wrap .cc-pop label:hover { background: var(--chip); }\n    .cc-wrap .cc-pop label span.n { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-pop label span.a { color: var(--muted); font-size: 11.5px; }\n    .cc-wrap .cc-pop input[type=checkbox] { accent-color: #7C5CFF; margin: 0; }\n    .cc-wrap .cc-pop .foot { display: flex; justify-content: space-between; border-top: 1px solid var(--line); margin-top: 6px; padding-top: 6px; }\n    .cc-wrap .cc-pop .foot button { all: unset; cursor: pointer; font-size: 12px; font-weight: 600; color: #7C5CFF; padding: 4px 6px; }\n    .cc-wrap .cc-card .delta { font-weight: 600; }\n    .cc-wrap .cc-load {\n      position: absolute; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center;\n      background: rgba(255,255,255,.94); border-radius: 14px;\n    }\n    .cc-wrap .cc-load.show { display: flex; }\n    .cc-wrap .cc-load .box { width: min(340px, 80%); text-align: center; }\n    .cc-wrap .cc-load .spin {\n      width: 34px; height: 34px; margin: 0 auto 14px; border-radius: 50%;\n      border: 3px solid #eceef3; border-top-color: #7C5CFF; animation: ccSpin .8s linear infinite;\n    }\n    .cc-wrap .cc-load .t { font-size: 14px; font-weight: 650; }\n    .cc-wrap .cc-load .bar { height: 6px; background: #eceef3; border-radius: 3px; margin: 12px 0 8px; overflow: hidden; position: relative; }\n    .cc-wrap .cc-load .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #7C5CFF; border-radius: 3px; transition: width .25s; }\n    .cc-wrap .cc-load .bar.indet i { width: 30%; animation: ccSlide 1.1s ease-in-out infinite; }\n    .cc-wrap .cc-load .n { font-size: 12px; color: var(--muted); min-height: 16px; }\n    @keyframes ccSpin { to { transform: rotate(360deg); } }\n    @keyframes ccSlide { 0% { left: -30%; } 100% { left: 100%; } }\n    .cc-wrap .cc-msg { font-size: 12px; color: #c2410c; white-space: pre-wrap; }\n  \n    .cc-wrap .up { color: #0E9F6E; } .cc-wrap .down { color: #E5484D; } .cc-wrap .flat { color: var(--muted); }\n    .cc-wrap select.cc-sel { font: inherit; font-size: 12px; font-weight: 600; padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; background: #fff; color: var(--ink); text-transform: none; letter-spacing: 0; }\n\n    .cc-wrap .cc-canvas { min-height: 420px; flex: 1 1 auto; }\n    .cc-wrap .cc-card .q { display: inline-block; width: 10px; height: 10px; border-radius: 3px; margin-right: 6px; vertical-align: 0; }\n  </style>\n\n  <div class=\"cc-head\">\n    <div>\n      <h2>Quadrant Scatter</h2>\n      <span class=\"cc-sub\">Looking for the grid\u2026</span>\n    </div>\n    <div class=\"cc-controls\">\n      <div class=\"cc-ctl\">Labels <div class=\"cc-seg\" data-ctl=\"lab\"></div></div>\n    </div>\n  </div>\n  <div class=\"cc-cards\"></div>\n  <div class=\"cc-canvas\"><canvas></canvas></div>\n  <div class=\"cc-msg\"></div>\n  <details class=\"cc-dbg\" style=\"font-size:11px;color:#6b7080\"><summary style=\"cursor:pointer\">Read details</summary>\n    <button type=\"button\" style=\"font-size:11px;margin:6px 0;padding:3px 8px;border:1px solid #eceef3;border-radius:6px;background:#fff;cursor:pointer\"\n      onclick=\"var p=this.parentNode.querySelector('pre');try{navigator.clipboard.writeText(p.textContent)}catch(e){};var r=document.createRange();r.selectNodeContents(p);var s=getSelection();s.removeAllRanges();s.addRange(r);\">Copy</button>\n    <pre style=\"white-space:pre-wrap;margin:0;font:11px/1.45 Consolas,monospace;max-height:220px;overflow:auto;background:#f6f7fa;padding:8px;border-radius:8px\"></pre></details>\n  <div class=\"cc-load\"><div class=\"box\"><div class=\"spin\"></div><div class=\"t\">Loading data\u2026</div>\n    <div class=\"bar indet\"><i></i></div><div class=\"n\">Looking for the grid</div></div></div>\n</div>";
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
    "https://viz.kaijxnes.com/chart.umd-4.4.1.js",   // self-hosted copy (viz.kaijxnes.com)
    "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js"    // fallback: official npm file via jsDelivr
  ];
  const CHART_JS_INTEGRITY = "sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG";
  // Grid column headers this chart looks for (matched ignoring spaces and case).
  // Override them per placeholder:  data-columns='{"v12":"Your Header", ...}'
  // On-screen names default to the column names; override with  data-labels='{"v12":"Short name", ...}'
  const COLUMN_NAMES = {
    dimA: "Dimension A",
    v1: "Metric 1", v2: "Metric 2", v3: "Metric 3"
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

  const PERIODS = ["1", "2", "3"].map(k => ({ key: k, name: L["v" + k] }));
  const SPLITS = [];
  const COLS = Object.keys(COLUMN_NAMES).map(id => ({ id, attr: ["dimA"].includes(id), test: t => t === cmp(COLNAMES[id]) }));
  // Metrics where a fall is good news (e.g. a cost): data-lower-better='["v2"]'
  const LOWER_BETTER = new Set((() => { const v = phJSON("data-lower-better"); return Array.isArray(v) ? v : []; })());
  const ACCENT = "#7C5CFF";

  /* ================= SETUP (each copy finds its own box) ================= */
  let wrap = null;
  const $ = sel => wrap.querySelector(sel);
  const msg = t => { if (wrap) $(".cc-msg").textContent = t; };
  const dbg = [];
  const descEl = e => !e ? "none" : e.tagName.toLowerCase() + (e.id ? "#" + String(e.id).slice(0, 40) : "") +
    (typeof e.className === "string" && e.className.trim() ? "." + e.className.trim().split(/\s+/).slice(0, 3).join(".") : "");
  function dlog(t) {
    dbg.push(new Date().toTimeString().slice(0, 8) + "  " + t);
    if (dbg.length > 200) dbg.shift();
    const pre = wrap && wrap.querySelector(".cc-dbg pre");
    if (pre) pre.textContent = dbg.join("\n");
  }
  const isVisible = e => !!e && e.getClientRects().length > 0;
  const compact = s => (s || "").replace(/\s+/g, "").toLowerCase();
  const clean = s => (s || "").replace(/\s+/g, " ").trim();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function claimWrap() {
    mount();
    const free = Array.from(document.querySelectorAll('.cc-wrap[data-chart="quadrant-scatter"]'))
      .filter(w => !w.getAttribute("data-cc-init") && isVisible(w));
    if (!free.length) return false;
    wrap = free[0];
    wrap.setAttribute("data-cc-init", "1");
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
      if (p.closest("script,style,.cc-wrap")) continue;
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

    const ATTRS = COLS.filter(c => c.attr).map(c => c.id);
    const rows = [];
    let prev = {};                                   // carries merged labels down
    for (let i = 0; i < lines.length; i++) {
      if (useGap && i > 0 && typical && lines[i].cy - lines[i - 1].cy > typical * 4 && rows.length) break;
      const cell = {};
      lines[i].bits.sort((a, b) => a.x - b.x).forEach(b => { cell[b.id] = clean((cell[b.id] || "") + " " + b.text); });
      const vals = {};
      PERIODS.forEach(p => { vals[p.key] = parseNum(cell["v" + p.key]); });
      const units = parseNum(cell.units);

      if (PERIODS.every(p => vals[p.key] === null) && units === null) {
        // a wrapped second line of a label: add it to the row above
        const last = rows[rows.length - 1];
        if (last) ATTRS.forEach(id => { if (cell[id] && last.own[id] && cell[id] !== last[id]) last[id] = clean(last[id] + " " + cell[id]); });
        continue;
      }
      const row = { own: {} };
      ATTRS.forEach(id => {
        if (cell[id]) { row[id] = cell[id]; row.own[id] = true; }
        else row[id] = prev[id] || "";
      });
      if (ATTRS.some(id => /total/i.test(row[id] || ""))) { prev = row; continue; }
      row.v = vals; row.units = units; row.pm = parseMonth(row.month);
      row.raw = {};
      PERIODS.forEach(p => { if (cell["v" + p.key]) row.raw["v" + p.key] = cell["v" + p.key]; });
      rows.push(row);
      prev = row;
    }
    rows.forEach(r => { delete r.own; });
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
      rows, hasUnits: !!ctx.heads.units,
      splits: SPLITS.filter(s => ctx.heads[s.key]).map(s => s.key),
      scrollH: sc ? sc.scrollHeight : 0
    };
  }

  // Cheap check between full reads: has the grid changed (filters, selectors)?
  const rowKey = r => [r.units].concat(PERIODS.map(p => r.v[p.key])).join("|");   // values only – merged labels may be off-screen
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

  /* ================= RENDER ================= */
  let chart = null, current = null, lastSig = "";

  function kind(key) {
    const txt = current.rows.map(r => (r.raw && r.raw["v" + key]) || "").join(" ");
    if (/%/.test(txt)) return "pct";
    const cur = txt.match(/[$£€]/);
    return cur ? cur[0] : "count";
  }
  const countShort = v => { const a = Math.abs(v); return a >= 1e6 ? (v / 1e6).toFixed(2) + "M" : a >= 1e4 ? (v / 1e3).toFixed(1) + "K" : count(v); };
  function fmtK(k, v, short) {
    if (v === null || v === undefined || isNaN(v)) return "–";
    if (k === "pct") return v.toFixed(Math.abs(v) >= 10 ? 1 : 2) + "%";
    if (k === "count") return short && Math.abs(v) >= 1e4 ? countShort(v) : count(v);
    const s = short && Math.abs(v) >= 1000 ? moneyShort(v) : money(v, Math.abs(v) < 100 ? 2 : 0);
    return s.replace("$", k);
  }
  const axisK = k => v => k === "pct" ? v + "%" : k === "count" ? countShort(v) : moneyAxis(v).replace("$", k);
  // totals for $ and counts, averages for percentages
  const aggK = (k, arr) => { const v = arr.filter(x => x !== null && x !== undefined && !isNaN(x)); if (!v.length) return null; const s = v.reduce((a, b) => a + b, 0); return k === "pct" ? s / v.length : s; };
  function change(k, v, c, lowerBetter) {
    if (v === null || c === null || v === undefined || c === undefined) return { cls: "flat", txt: "–" };
    const d = k === "pct" ? v - c : (c ? v / c - 1 : null);
    if (d === null) return { cls: "flat", txt: "–" };
    const good = d === 0 ? null : (d > 0) !== !!lowerBetter;
    return { cls: good === null ? "flat" : good ? "up" : "down",
             txt: (d > 0 ? "▲ +" : d < 0 ? "▼ " : "") + (k === "pct" ? d.toFixed(2) + " pts" : (d * 100).toFixed(1) + "%") };
  }
  const DAY = 864e5;
  function parseDay(t) {
    t = clean(t); let m;
    if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY;
    if ((m = t.match(/^(\d{1,2})[\/.](\d{1,2})[\/.](\d{4})$/))) return Date.UTC(+m[3], +m[2] - 1, +m[1]) / DAY;      // dd/mm/yyyy
    if ((m = t.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/))) { const mi = MONTHS.indexOf(m[2].slice(0, 3).toLowerCase()); if (mi > -1) return Date.UTC(+m[3], mi, +m[1]) / DAY; }
    if ((m = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/))) { const mi = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()); if (mi > -1) return Date.UTC(+m[3], mi, +m[2]) / DAY; }
    return null;
  }
  const dayDate = d => new Date(d * DAY);
  const dayLbl = d => { const x = dayDate(d); return x.getUTCDate() + " " + cap(MONTHS[x.getUTCMonth()]); };
  const dayLong = d => { const x = dayDate(d); return x.getUTCDate() + " " + cap(MONTHS[x.getUTCMonth()]) + " " + x.getUTCFullYear(); };
  const PALETTE = ["#7C5CFF", "#12A594", "#E5484D", "#F59E0B", "#3B82F6", "#EC4899", "#0F172A", "#84CC16"];
  const TT = { backgroundColor: "#14161f", padding: 10, cornerRadius: 10, titleFont: { weight: "600" }, bodySpacing: 5, boxPadding: 4, usePointStyle: true };
  const AX = { color: "#6b7080", font: { size: 11 } };
  function segButtons(sel, items, cur, onPick) {
    const seg = $(sel);
    seg.innerHTML = "";
    items.forEach(it => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = it.name; b.setAttribute("data-k", it.key);
      b.classList.toggle("on", it.key === cur);
      b.onclick = () => onPick(it.key);
      seg.appendChild(b);
    });
  }

  const state = { lab: "top" };
  const QC = { hh: "#12A594", hl: "#F59E0B", lh: "#3B82F6", ll: "#9AA0AD" };
  function buildControls() {}
  const quadPlugin = {
    id: "qsQuad",
    beforeDatasetsDraw(c) {
      const o = c.options.plugins.qsQuad; if (!o) return;
      const { ctx, chartArea: a, scales: { x, y } } = c, px = x.getPixelForValue(o.mx), py = y.getPixelForValue(o.my);
      ctx.save();
      [["hh", px, a.top, a.right, py], ["lh", a.left, a.top, px, py], ["hl", px, py, a.right, a.bottom], ["ll", a.left, py, px, a.bottom]].forEach(([q, l, t, r, b]) => {
        ctx.fillStyle = QC[q] + "0D"; ctx.fillRect(l, t, r - l, b - t);
      });
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "#9AA0AD"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(px, a.top); ctx.lineTo(px, a.bottom); ctx.moveTo(a.left, py); ctx.lineTo(a.right, py); ctx.stroke();
      ctx.setLineDash([]); ctx.font = "600 11px Inter, 'Segoe UI', system-ui, sans-serif"; ctx.fillStyle = "#6b7080";
      ctx.textAlign = "right"; ctx.fillText(o.names.hh, a.right - 6, a.top + 14); ctx.fillText(o.names.hl, a.right - 6, a.bottom - 8);
      ctx.textAlign = "left"; ctx.fillText(o.names.lh, a.left + 6, a.top + 14); ctx.fillText(o.names.ll, a.left + 6, a.bottom - 8);
      ctx.restore();
    },
    afterDatasetsDraw(c) {
      const o = c.options.plugins.qsQuad; if (!o || !o.label.size) return;
      const ctx = c.ctx, meta = c.getDatasetMeta(0);
      ctx.save(); ctx.font = "600 11px Inter, 'Segoe UI', system-ui, sans-serif"; ctx.fillStyle = "#14161f"; ctx.textAlign = "center";
      meta.data.forEach((pt, i) => { const d = c.data.datasets[0].data[i]; if (o.label.has(d.name)) ctx.fillText(d.name, pt.x, pt.y - d.r - 4); });
      ctx.restore();
    }
  };
  function render() {
    const ks = { x: kind("1"), y: kind("2"), s: kind("3") };
    const by = new Map();
    current.rows.forEach(r => {
      const k = clean(r.dimA || "") || "Unknown";
      const o = by.get(k) || { name: k, x: [], y: [], s: [] };
      if (r.v["1"] !== null) o.x.push(r.v["1"]); if (r.v["2"] !== null) o.y.push(r.v["2"]); if (r.v["3"] !== null) o.s.push(r.v["3"]);
      by.set(k, o);
    });
    const items = Array.from(by.values()).map(o => ({ name: o.name, x: aggK(ks.x, o.x), y: aggK(ks.y, o.y), s: aggK(ks.s, o.s) })).filter(o => o.x !== null && o.y !== null);
    if (!items.length) { msg("No rows with both " + L.v1 + " and " + L.v2 + "."); return; }
    const hasS = items.some(o => o.s !== null);
    const mx = items.reduce((a, o) => a + o.x, 0) / items.length, my = items.reduce((a, o) => a + o.y, 0) / items.length;
    const smax = Math.max(...items.map(o => Math.abs(o.s || 0)), 1);
    items.forEach(o => { o.q = (o.x >= mx ? "h" : "l") + (o.y >= my ? "h" : "l"); o.r = hasS ? 5 + 17 * Math.sqrt(Math.abs(o.s || 0) / smax) : 7; });
    segButtons('[data-ctl="lab"]', [{ key: "top", name: "Top 8" }, { key: "all", name: "All" }, { key: "none", name: "None" }], state.lab, k => { state.lab = k; render(); });
    const rank = items.slice().sort((a, b) => hasS ? (b.s || 0) - (a.s || 0) : (b.x * b.y) - (a.x * a.y));
    const label = new Set(state.lab === "all" ? items.map(o => o.name) : state.lab === "top" ? rank.slice(0, 8).map(o => o.name) : []);
    $(".cc-sub").textContent = L.v1 + " vs " + L.v2 + (hasS ? " · size = " + L.v3 : "") + " · " + items.length + " " + L.dimA + " values · " + current.rows.length + " grid rows";
    msg(lastInfo || "");
    const names = { hh: "High " + L.v1 + " · high " + L.v2, hl: "High " + L.v1 + " · low " + L.v2, lh: "Low " + L.v1 + " · high " + L.v2, ll: "Low " + L.v1 + " · low " + L.v2 };
    const cnt = q => items.filter(o => o.q === q);
    $(".cc-cards").innerHTML = ["hh", "lh", "hl", "ll"].map(q => {
      const list = cnt(q);
      return '<div class="cc-card"><div class="lbl"><span class="q" style="background:' + QC[q] + '"></span>' + esc(names[q]) + '</div><div class="val">' + list.length + '</div><div class="sub">' +
        esc(list.slice(0, 3).map(o => o.name).join(", ")) + (list.length > 3 ? " …" : "") + '</div></div>';
    }).join("");
    const cfg = { type: "bubble",
      data: { datasets: [{ data: items.map(o => ({ x: o.x, y: o.y, r: o.r, name: o.name, s: o.s, q: o.q })),
        backgroundColor: items.map(o => QC[o.q] + "B3"), borderColor: items.map(o => QC[o.q]), borderWidth: 1.5 }] },
      plugins: [quadPlugin],
      options: { responsive: true, maintainAspectRatio: false, animation: { duration: 400 }, layout: { padding: { top: 10, right: 10 } },
        plugins: { legend: { display: false }, qsQuad: { mx, my, names, label },
          tooltip: { ...TT, callbacks: { title: it => it[0].raw.name, label: c => [" " + L.v1 + ": " + fmtK(ks.x, c.raw.x), " " + L.v2 + ": " + fmtK(ks.y, c.raw.y)].concat(hasS ? [" " + L.v3 + ": " + fmtK(ks.s, c.raw.s)] : []) } } },
        scales: { x: { grid: { color: "#f1f2f6" }, border: { display: false }, title: { display: true, text: L.v1 + " (avg " + fmtK(ks.x, mx, true) + ")", ...AX }, ticks: { ...AX, callback: axisK(ks.x) } },
                  y: { grid: { color: "#f1f2f6" }, border: { display: false }, title: { display: true, text: L.v2 + " (avg " + fmtK(ks.y, my, true) + ")", ...AX }, ticks: { ...AX, callback: axisK(ks.y) } } } } };
    if (chart) chart.destroy();
    chart = new Chart($("canvas"), cfg);
  }

  /* ================= REFRESH LOOP ================= */
  // loading screen: the chart only appears once every row has been read
  function showLoad(title, frac, note) {
    const L = $(".cc-load");
    L.classList.add("show");
    if (title) L.querySelector(".t").textContent = title;
    const bar = L.querySelector(".bar");
    bar.classList.toggle("indet", frac === null || frac === undefined);
    bar.querySelector("i").style.width = frac === null || frac === undefined ? "" : Math.round(frac * 100) + "%";
    if (note !== undefined) L.querySelector(".n").textContent = note;
  }
  const hideLoad = () => $(".cc-load").classList.remove("show");

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
        $(".cc-sub").textContent = "No grid found – still watching";
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
