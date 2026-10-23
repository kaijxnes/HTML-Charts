/*!
 * monthly-bars v1.1.0 – HTML-container chart
 * https://kaijxnes.github.io/HTML-Charts/
 * Reads a grid on the same page and draws the chart in the viewer's browser.
 * Makes no network requests except loading Chart.js (integrity-checked). No data leaves the page.
 */
(function () {
  /* ================= MOUNT ================= */
  // Builds this chart's layout inside every <div data-chart-embed="monthly-bars"> placeholder on the page.
  // Optional: data-title="..." on the placeholder replaces the heading.
  const CHART_ID = "monthly-bars";
  const TEMPLATE = "<div class=\"vc-wrap\" data-chart=\"monthly-bars\">\n  <style>\n    .vc-wrap {\n      --ink: #14161f; --muted: #6b7080; --line: #eceef3; --chip: #f6f7fa;\n      font-family: \"Inter\", \"Segoe UI\", system-ui, -apple-system, sans-serif;\n      background: #fff; color: var(--ink); box-sizing: border-box;\n      height: 100%; min-height: 500px; padding: 20px 22px 14px;\n      display: flex; flex-direction: column; gap: 14px; border-radius: 14px;\n    }\n    .vc-wrap * { box-sizing: border-box; }\n    .vc-wrap .vc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }\n    .vc-wrap h2 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }\n    .vc-wrap .vc-sub { font-size: 12px; color: var(--muted); margin-top: 3px; display: block; }\n    .vc-wrap .vc-seg { display: inline-flex; background: var(--chip); border: 1px solid var(--line); border-radius: 10px; padding: 3px; gap: 2px; }\n    .vc-wrap .vc-seg button {\n      all: unset; cursor: pointer; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 7px;\n      color: var(--muted); transition: background .15s, color .15s, box-shadow .15s;\n    }\n    .vc-wrap .vc-seg button:hover { color: var(--ink); }\n    .vc-wrap .vc-seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20,22,31,.14); }\n    .vc-wrap .vc-seg button .dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; vertical-align: 0; }\n    .vc-wrap .vc-cards { display: flex; gap: 10px; flex-wrap: wrap; }\n    .vc-wrap .vc-card {\n      flex: 1 1 170px; background: var(--chip); border: 1px solid var(--line); border-radius: 12px;\n      padding: 10px 14px 11px 16px; cursor: pointer; position: relative; overflow: hidden; user-select: none;\n      transition: background .15s, border-color .15s, box-shadow .15s, transform .15s;\n    }\n    .vc-wrap .vc-card:hover { transform: translateY(-1px); }\n    .vc-wrap .vc-card::before { content: \"\"; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--c); opacity: .3; }\n    .vc-wrap .vc-card.on { background: #fff; border-color: var(--c); box-shadow: 0 2px 12px rgba(20,22,31,.07); }\n    .vc-wrap .vc-card.on::before { opacity: 1; }\n    .vc-wrap .vc-card .lbl { font-size: 12px; color: var(--muted); }\n    .vc-wrap .vc-card .val { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; }\n    .vc-wrap .vc-card .sub { font-size: 11px; color: var(--muted); margin-top: 1px; }\n    .vc-wrap .vc-legend { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--muted); align-items: center; }\n    .vc-wrap .vc-legend .sw { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }\n    .vc-wrap .vc-legend .ln { display: inline-block; width: 18px; border-top: 2.5px solid; margin-right: 6px; vertical-align: 3px; }\n    .vc-wrap .vc-legend .ln.dash { border-top-style: dashed; border-top-width: 2px; }\n    .vc-wrap .vc-canvas { position: relative; flex: 1 1 auto; min-height: 290px; }\n    .vc-wrap .vc-legend .sw.striped { background-size: 6px 6px !important; }\n    .vc-wrap .vc-warn {\n      display: none; align-items: flex-start; gap: 9px; font-size: 12px; line-height: 1.45; color: #92400E;\n      background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 8px 12px;\n    }\n    .vc-wrap .vc-warn.show { display: flex; }\n    .vc-wrap .vc-warn .ic {\n      flex: none; width: 18px; height: 18px; border-radius: 50%; background: #D97706; color: #fff;\n      font-weight: 800; font-size: 12px; display: flex; align-items: center; justify-content: center; margin-top: 1px;\n    }\n    .vc-wrap .vc-card .sub .lowv { color: #B45309; font-weight: 600; }\n    .vc-wrap .vc-msg { font-size: 12px; color: #c2410c; white-space: pre-wrap; }\n  </style>\n\n  <div class=\"vc-head\">\n    <div>\n      <h2>Monthly Bars</h2>\n      <span class=\"vc-sub\">Looking for the grid\u2026</span>\n    </div>\n    <div class=\"vc-seg\"></div>\n  </div>\n  <div class=\"vc-cards\"></div>\n  <div class=\"vc-legend\"></div>\n  <div class=\"vc-warn\"><span class=\"ic\">!</span><span class=\"tx\"></span></div>\n  <div class=\"vc-canvas\"><canvas></canvas></div>\n  <div class=\"vc-msg\"></div>\n</div>";
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
    a12: "Metric 1 Avg", a18: "Metric 2 Avg", a24: "Metric 3 Avg",
    units: "Units"
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

  const PERIODS = [
    { key: "12", color: "#7C5CFF" },
    { key: "18", color: "#12A594" },
    { key: "24", color: "#E5484D" }
  ].map(p => Object.assign(p, { name: L["v" + p.key] }));
  const UNIT_COLOR  = "#14161f";
  // Bars whose Units are below this are flagged as a low-volume reading. 0 = off; set data-min-volume="600" on the placeholder.
  const MIN_UNITS   = (() => { const ph = document.querySelector('[data-chart-embed="' + CHART_ID + '"][data-min-volume]'); return ph ? Number(ph.getAttribute("data-min-volume")) || 0 : 0; })();
  const WARN_COLOR = "#D97706";
  const COLS = Object.keys(COLUMN_NAMES).map(id => ({ id, test: t => t === cmp(COLNAMES[id]) }));
  const P = Object.fromEntries(PERIODS.map(p => [p.key, p]));

  /* ================= SETUP (each copy finds its own box) ================= */
  let wrap = null;
  const $ = sel => wrap.querySelector(sel);
  const msg = t => { if (wrap) $(".vc-msg").textContent = t; };
  const isVisible = e => !!e && e.getClientRects().length > 0;
  const compact = s => (s || "").replace(/\s+/g, "").toLowerCase();
  const clean = s => (s || "").replace(/\s+/g, " ").trim();

  function claimWrap() {
    mount();
    const free = Array.from(document.querySelectorAll('.vc-wrap[data-chart="monthly-bars"]'))
      .filter(w => !w.getAttribute("data-vc-init") && isVisible(w));
    if (!free.length) return false;
    wrap = free[0];
    wrap.setAttribute("data-vc-init", "1");
    return true;
  }

  /* ================= FORMATTING ================= */
  const money = (v, dp) => (v < 0 ? "-$" : "$") +
    Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: dp || 0, maximumFractionDigits: dp || 0 });
  const moneyAxis = v => Math.abs(v) >= 1000 ? "$" + (v / 1000).toFixed(1).replace(/\.0$/, "") + "K" : "$" + v;
  const count = v => Math.round(v).toLocaleString("en-US");
  const countAxis = v => {
    const a = Math.abs(v);
    if (a >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (a >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(v);
  };
  const hexA = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  };
  function parseNum(t) {
    t = clean(t);
    if (!t || !/\d/.test(t)) return null;
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
  const shortMonth = pm => pm ? MONTHS[pm.m][0].toUpperCase() + MONTHS[pm.m].slice(1) + " '" + String(pm.y).slice(2) : null;
  const longMonth  = pm => pm ? MONTHS[pm.m][0].toUpperCase() + MONTHS[pm.m].slice(1) + " " + pm.y : null;

  /* ================= READ THE GRID ================= */
  function textNodes(root, filter) {
    const out = [];
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const p = n.parentElement;
      if (!p || !n.nodeValue.trim()) continue;
      if (p.closest("script,style,.vc-wrap")) continue;
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

  // 1. Find the column headers (deepest element whose text matches a column name)
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

    // The grid's headers sit on one row – pick the anchor with the most row-mates
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
      if (!mates.length) return;
      heads[c.id] = mates.sort((x, y) => lcaDepth(best, y) - lcaDepth(best, x))[0];
    });
    return heads;
  }

  // 2. Work out each column's horizontal extent (the full header cell)
  function columnRanges(heads) {
    const ids = Object.keys(heads), els = ids.map(id => heads[id]);
    const ranges = {};
    ids.forEach(id => {
      let cell = heads[id];
      while (cell.parentElement && !els.some(o => o !== heads[id] && cell.parentElement.contains(o))) cell = cell.parentElement;
      const r = cell.getBoundingClientRect();
      ranges[id] = { left: r.left, right: r.right };
    });
    return ranges;
  }

  // 3. Read the rows underneath, placing each value in the column it sits under
  function readGrid() {
    const heads = findHeaders();
    if (!heads || !PERIODS.some(p => heads["v" + p.key])) return null;
    const ranges = columnRanges(heads);
    const headEls = Object.values(heads);
    const headerBottom = Math.max(...headEls.map(e => e.getBoundingClientRect().bottom));

    let root = lca(headEls);
    while (root.parentElement && root.parentElement !== document.body && !root.parentElement.contains(wrap) &&
           root.getBoundingClientRect().bottom < headerBottom + 30) root = root.parentElement;
    const rootRect = root.getBoundingClientRect();

    const range = document.createRange();
    const bits = [];
    textNodes(root).forEach(n => {
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width || r.top < headerBottom - 1 || r.bottom > rootRect.bottom + 1) return;
      const cx = (r.left + r.right) / 2;
      const id = Object.keys(ranges).find(k => cx >= ranges[k].left && cx <= ranges[k].right);
      if (id) bits.push({ id, text: n.nodeValue, x: r.left, cy: (r.top + r.bottom) / 2, h: r.height });
    });
    bits.sort((a, b) => a.cy - b.cy || a.x - b.x);

    // group into visual rows
    const lines = [];
    bits.forEach(b => {
      const last = lines[lines.length - 1];
      if (last && Math.abs(b.cy - last.cy) <= Math.max(4, b.h * 0.6)) last.bits.push(b);
      else lines.push({ cy: b.cy, bits: [b] });
    });
    // stop at a big vertical gap (end of grid)
    const gaps = lines.slice(1).map((l, i) => l.cy - lines[i].cy).sort((a, b) => a - b);
    const typical = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;

    const rows = [];
    for (let i = 0; i < lines.length; i++) {
      if (i > 0 && typical && lines[i].cy - lines[i - 1].cy > typical * 3.5 && rows.length) break;
      const cell = {};
      lines[i].bits.sort((a, b) => a.x - b.x).forEach(b => { cell[b.id] = clean((cell[b.id] || "") + " " + b.text); });
      const label = cell.month || cell.idx || "";
      if (/total/i.test(label)) continue;
      const row = { monthText: cell.month || "", idx: parseNum(cell.idx), v: {}, avg: {}, units: parseNum(cell.units) };
      PERIODS.forEach(p => { row.v[p.key] = parseNum(cell["v" + p.key]); row.avg[p.key] = parseNum(cell["a" + p.key]); });
      if (PERIODS.every(p => row.v[p.key] === null)) continue;
      row.pm = parseMonth(row.monthText);
      rows.push(row);
    }
    if (!rows.length) return null;

    // oldest month on the left
    if (rows.every(r => r.pm)) rows.sort((a, b) => (a.pm.y - b.pm.y) || (a.pm.m - b.pm.m));
    else if (rows.every(r => r.idx !== null)) rows.sort((a, b) => b.idx - a.idx);
    else rows.reverse();
    rows.forEach((r, i) => {
      r.label = shortMonth(r.pm) || r.monthText || (r.idx !== null ? "Index " + r.idx : "Row " + (i + 1));
      r.long = longMonth(r.pm) || r.label;
    });
    return { rows, hasUnits: !!heads.units };
  }

  /* ================= CHART ================= */
  const state = { period: DEFAULT_PERIOD };
  let chart = null, current = null, lastSig = "", avgInfo = null;

  const avgLine = {
    id: "vcAvg",
    afterDatasetsDraw(c) {
      if (!avgInfo || avgInfo.value === null) return;
      const { ctx, chartArea: a } = c;
      const y = c.scales.y.getPixelForValue(avgInfo.value);
      if (y < a.top || y > a.bottom) return;
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = avgInfo.color;
      ctx.beginPath(); ctx.moveTo(a.left, y); ctx.lineTo(a.right, y); ctx.stroke();
      ctx.setLineDash([]);
      const text = "6M avg " + money(avgInfo.value, 2);
      ctx.font = "600 11px Inter, 'Segoe UI', system-ui, sans-serif";
      const w = ctx.measureText(text).width + 12, x = a.right - w - 6, h = 18;
      ctx.fillStyle = avgInfo.color;
      if (ctx.roundRect) { ctx.beginPath(); ctx.roundRect(x, y - h - 4, w, h, 5); ctx.fill(); }
      else ctx.fillRect(x, y - h - 4, w, h);
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "middle";
      ctx.fillText(text, x + 6, y - 4 - h / 2);
      ctx.restore();
    }
  };

  const isLow = r => !!(MIN_UNITS > 0 && current && current.hasUnits && r.units !== null && r.units < MIN_UNITS);

  // diagonal stripes = "don't fully trust this bar"
  const patternCache = {};
  function stripes(ctx, color) {
    const key = color;
    if (patternCache[key]) return patternCache[key];
    const cv = document.createElement("canvas");
    cv.width = cv.height = 8;
    const g = cv.getContext("2d");
    g.fillStyle = hexA(color, 0.18); g.fillRect(0, 0, 8, 8);
    g.strokeStyle = color; g.lineWidth = 2.2;
    g.beginPath(); g.moveTo(-2, 10); g.lineTo(10, -2); g.moveTo(-2, 2); g.lineTo(2, -2); g.moveTo(6, 10); g.lineTo(10, 6); g.stroke();
    return (patternCache[key] = ctx.createPattern(cv, "repeat"));
  }

  // amber "!" badge above low-volume bars
  const lowBadge = {
    id: "vcLow",
    afterDatasetsDraw(c) {
      if (!current) return;
      const meta = c.getDatasetMeta(0);
      const { ctx } = c;
      ctx.save();
      current.rows.forEach((r, i) => {
        if (!isLow(r) || !meta.data[i]) return;
        const bar = meta.data[i];
        const x = bar.x, y = Math.min(bar.y, bar.base) - 13;
        ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = WARN_COLOR; ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = "#fff"; ctx.stroke();
        ctx.fillStyle = "#fff"; ctx.font = "800 11px Inter, 'Segoe UI', system-ui, sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("!", x, y + 0.5);
      });
      ctx.restore();
    }
  };

  const mean = arr => { const v = arr.filter(x => x !== null); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };
  function windowLabel(rows, key) {
    const inW = rows.filter(r => r.avg[key] !== null);
    if (!inW.length) return "No 6-month data";
    const a = inW[0], b = inW[inW.length - 1];
    return inW.length === 1 ? a.long : a.long.split(" ")[0] + " – " + b.long;
  }

  function buildControls() {
    const seg = $(".vc-seg");
    seg.innerHTML = "";
    PERIODS.forEach(p => {
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<span class="dot" style="background:' + p.color + '"></span>' + p.name;
      b.onclick = () => { state.period = p.key; if (current) render(); };
      b.setAttribute("data-p", p.key);
      seg.appendChild(b);
    });
  }

  function render() {
    const rows = current.rows, p = P[state.period];
    const avg = mean(rows.map(r => r.avg[p.key]));
    avgInfo = { value: avg, color: p.color };

    $(".vc-sub").textContent = "By month · live from grid";
    msg("");

    // toggle buttons
    Array.from($(".vc-seg").children).forEach(b => b.classList.toggle("on", b.getAttribute("data-p") === p.key));

    // 6-month average cards
    const cards = $(".vc-cards");
    cards.innerHTML = "";
    PERIODS.forEach(pp => {
      const v = mean(rows.map(r => r.avg[pp.key]));
      const c = document.createElement("div");
      c.className = "vc-card" + (pp.key === p.key ? " on" : "");
      c.style.setProperty("--c", pp.color);
      c.innerHTML = '<div class="lbl">6M avg · ' + pp.name + '</div>' +
        '<div class="val">' + (v === null ? "–" : money(v, 2)) + '</div>' +
        '<div class="sub">' + windowLabel(rows, pp.key) + (() => {
          const n = rows.filter(r => r.avg[pp.key] !== null && isLow(r)).length;
          return n ? ' · <span class="lowv">⚠ ' + n + ' low-volume month' + (n > 1 ? "s" : "") + '</span>' : "";
        })() + '</div>';
      c.onclick = () => { state.period = pp.key; render(); };
      cards.appendChild(c);
    });

    // legend
    $(".vc-legend").innerHTML =
      '<span><i class="sw" style="background:' + p.color + '"></i>' + p.name + '</span>' +
      '<span><i class="sw" style="background:' + hexA(p.color, 0.3) + '"></i>Outside 6M window</span>' +
      '<span><i class="ln dash" style="border-color:' + p.color + '"></i>6M average</span>' +
      (current.hasUnits
        ? '<span><i class="ln" style="border-color:' + UNIT_COLOR + '"></i>' + L.units + '</span>'
        : '<span style="color:#c2410c">Add ' + L.units + ' to the grid to show the line</span>') +
      (rows.some(isLow)
        ? '<span><i class="sw striped" style="background:repeating-linear-gradient(135deg,' + p.color + ' 0 2px,' + hexA(p.color, 0.18) + ' 2px 5px)"></i>Low volume (&lt;' + count(MIN_UNITS) + ' ' + L.units + ')</span>'
        : "");

    const low = rows.filter(isLow);
    const warn = $(".vc-warn");
    warn.classList.toggle("show", low.length > 0);
    if (low.length) {
      const names = low.map(r => r.label + " (" + count(r.units) + ")");
      warn.querySelector(".tx").innerHTML = "<b>Low volume:</b> " + names.join(", ") +
        " – " + L.units + " under " + count(MIN_UNITS) + ", so the value for " + (low.length > 1 ? "these months is a less reliable reading" : "this month is a less reliable reading") + ".";
    }

    const labels = rows.map(r => r.label);
    const bar = {
      type: "bar", label: p.name, yAxisID: "y", order: 2,
      data: rows.map(r => r.v[p.key]),
      backgroundColor: c => {
        const r = current.rows[c.dataIndex];
        if (!r) return p.color;
        const col = r.avg[p.key] !== null ? p.color : hexA(p.color, 0.45);
        return isLow(r) ? stripes(c.chart.ctx, col) : (r.avg[p.key] !== null ? p.color : hexA(p.color, 0.3));
      },
      hoverBackgroundColor: c => {
        const r = current.rows[c.dataIndex];
        if (!r) return p.color;
        return isLow(r) ? stripes(c.chart.ctx, p.color) : (r.avg[p.key] !== null ? p.color : hexA(p.color, 0.5));
      },
      borderColor: rows.map(r => isLow(r) ? WARN_COLOR : "transparent"),
      borderWidth: rows.map(r => isLow(r) ? 1.5 : 0),
      borderRadius: 6, borderSkipped: false, maxBarThickness: 46, categoryPercentage: 0.72
    };
    const datasets = [bar];
    if (current.hasUnits) datasets.push({
      type: "line", label: L.units, yAxisID: "y1", order: 1,
      data: rows.map(r => r.units),
      borderColor: UNIT_COLOR, borderWidth: 2.5, tension: 0.35, cubicInterpolationMode: "monotone",
      pointRadius: rows.map(r => isLow(r) ? 4.5 : 3.5),
      pointBackgroundColor: rows.map(r => isLow(r) ? WARN_COLOR : "#fff"),
      pointBorderColor: rows.map(r => isLow(r) ? WARN_COLOR : UNIT_COLOR), pointBorderWidth: 2,
      pointHoverRadius: 5, spanGaps: true
    });

    if (!chart) {
      chart = new Chart($("canvas"), {
        data: { labels, datasets },
        plugins: [avgLine, lowBadge],
        options: {
          responsive: true, maintainAspectRatio: false,
          layout: { padding: { top: 18 } },            // room for the low-volume badges
          interaction: { mode: "index", intersect: false },
          animation: { duration: 600, easing: "easeOutQuart" },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#14161f", padding: 12, cornerRadius: 10,
              titleFont: { weight: "600" }, bodySpacing: 6, boxPadding: 5, usePointStyle: true,
              callbacks: {
                title: items => current.rows[items[0].dataIndex].long,
                label: c => c.dataset.yAxisID === "y1"
                  ? " " + L.units + ": " + count(c.parsed.y)
                  : " " + P[state.period].name + ": " + money(c.parsed.y),
                footer: items => {
                  const r = current.rows[items[0].dataIndex], out = [];
                  if (r.avg[state.period] !== null) out.push("Included in 6M average");
                  if (isLow(r)) out.push("⚠ Low volume: " + L.units + " " + count(r.units) + " (under " + count(MIN_UNITS) + ")", "   – treat this value as a less reliable reading");
                  return out;
                }
              }
            }
          },
          scales: {
            x: { grid: { display: false }, border: { display: false },
                 ticks: { color: "#6b7080", font: { size: 11 }, maxRotation: 0, autoSkip: true } },
            y: { position: "left", beginAtZero: true, grid: { color: "#eceef3" }, border: { display: false },
                 title: { display: true, text: "Value", color: "#6b7080", font: { size: 11 } },
                 ticks: { color: "#6b7080", font: { size: 11 }, callback: moneyAxis, maxTicksLimit: 6 } },
            y1: { position: "right", beginAtZero: true, display: current.hasUnits, grid: { display: false }, border: { display: false },
                  title: { display: true, text: L.units, color: "#6b7080", font: { size: 11 } },
                  ticks: { color: "#6b7080", font: { size: 11 }, callback: countAxis, maxTicksLimit: 6 } }
          }
        }
      });
    } else {
      chart.data.labels = labels;
      chart.data.datasets = datasets;
      chart.options.scales.y1.display = current.hasUnits;
      chart.update();
    }
  }

  /* ================= REFRESH LOOP ================= */
  function refresh() {
    let d;
    try { d = readGrid(); } catch (e) { msg("Error reading grid: " + e.message); return false; }
    if (!d) return false;
    const sig = JSON.stringify(d);
    if (sig !== lastSig) {
      lastSig = sig;
      current = d;
      try { render(); } catch (e) { msg("Chart error: " + e.message); }
    }
    return true;
  }

  let watching = false;
  function watch() {
    if (watching) return;
    watching = true;
    let t;
    const bump = () => { clearTimeout(t); t = setTimeout(refresh, 400); };
    try {
      new MutationObserver(muts => { if (muts.some(m => !wrap.contains(m.target))) bump(); })
        .observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
    setInterval(refresh, 5000);
  }

  function start() {
    if (!wrap && !claimWrap()) { setTimeout(start, 500); return; }
    buildControls();
    let tries = 0;
    const find = setInterval(() => {
      if (refresh()) { clearInterval(find); watch(); }
      else if (++tries === 30) {
        clearInterval(find);
        msg(NOT_FOUND);
        $(".vc-sub").textContent = "No grid found – still watching";
        watch();
      }
    }, 500);
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
