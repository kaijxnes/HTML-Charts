/*!
 * segment-change-finder v1.5.13 – HTML-container chart
 * https://viz.kaijxnes.com/
 * Reads a grid on the same page and draws the chart in the viewer's browser.
 * Makes no network requests. No data leaves the page.
 */
(function () {
  /* ================= MOUNT ================= */
  // Builds this chart's layout inside every <div data-chart-embed="segment-change-finder"> placeholder on the page.
  // Optional: data-title="..." on the placeholder replaces the heading.
  const CHART_ID = "segment-change-finder";
  const TEMPLATE = "<div class=\"cc-wrap\" data-chart=\"segment-change-finder\">\n  <style>\n    .cc-wrap {\n      --ink: #14161f; --muted: #6b7080; --line: #eceef3; --chip: #f6f7fa;\n      font-family: \"Inter\", \"Segoe UI\", system-ui, -apple-system, sans-serif;\n      background: #fff; color: var(--ink); box-sizing: border-box;\n      height: 100%; min-height: 0; overflow: hidden; padding: 18px 20px 12px;\n      display: flex; flex-direction: column; gap: 14px; border-radius: 14px;\n    }\n    .cc-wrap * { box-sizing: border-box; }\n    .cc-wrap .cc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }\n    .cc-wrap h2 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }\n    .cc-wrap .cc-sub { font-size: 12px; color: var(--muted); margin-top: 3px; display: block; }\n    .cc-wrap .cc-controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }\n    .cc-wrap .cc-ctl { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; }\n    .cc-wrap .cc-seg { display: inline-flex; background: var(--chip); border: 1px solid var(--line); border-radius: 10px; padding: 3px; gap: 2px; }\n    .cc-wrap .cc-seg button {\n      all: unset; cursor: pointer; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 7px;\n      color: var(--muted); text-transform: none; letter-spacing: 0; transition: background .15s, color .15s, box-shadow .15s;\n    }\n    .cc-wrap .cc-seg button:hover { color: var(--ink); }\n    .cc-wrap .cc-seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20,22,31,.14); }\n    .cc-wrap .cc-cards { display: flex; gap: 10px; flex-wrap: wrap; }\n    .cc-wrap .cc-card { flex: 1 1 160px; background: var(--chip); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px 11px; }\n    .cc-wrap .cc-card.hero { background: #14161f; border-color: #14161f; }\n    .cc-wrap .cc-card.hero .lbl, .cc-wrap .cc-card.hero .sub { color: #b8bccb; }\n    .cc-wrap .cc-card.hero .val { color: #fff; }\n    .cc-wrap .cc-card .lbl { font-size: 12px; color: var(--muted); }\n    .cc-wrap .cc-card .val { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .cc-wrap .cc-card .sub { font-size: 11px; color: var(--muted); margin-top: 1px; }\n    .cc-wrap .cc-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); align-items: center; }\n    .cc-wrap .cc-legend .sw { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }\n    .cc-wrap .cc-legend .ln { display: inline-block; width: 18px; border-top: 2.5px solid #14161f; margin-right: 6px; vertical-align: 3px; }\n    .cc-wrap .cc-body { display: flex; gap: 18px; flex: 1 1 0; min-height: 0; }\n    .cc-wrap .cc-canvas { position: relative; flex: 3 1 0; min-height: 0; min-width: 0; }\n    .cc-wrap .cc-rank { flex: 0 1 260px; min-width: 200px; min-height: 0; display: flex; flex-direction: column; gap: 4px; }\n    .cc-wrap .cc-rank h3 { margin: 0 0 6px; font-size: 13px; font-weight: 650; }\n    .cc-wrap .cc-list { flex: 1 1 0; min-height: 0; overflow-y: auto; padding-right: 4px; }\n    .cc-wrap .cc-item { padding: 8px 0; border-top: 1px solid var(--line); }\n    .cc-wrap .cc-item .top { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; }\n    .cc-wrap .cc-item .name { display: flex; align-items: center; gap: 7px; font-weight: 600; min-width: 0; }\n    .cc-wrap .cc-item .name span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-item .dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }\n    .cc-wrap .cc-item .amt { font-weight: 700; white-space: nowrap; }\n    .cc-wrap .cc-item .bar { height: 6px; background: var(--chip); border-radius: 3px; margin: 6px 0 4px; overflow: hidden; }\n    .cc-wrap .cc-item .bar i { display: block; height: 100%; border-radius: 3px; }\n    .cc-wrap .cc-item .meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }\n    .cc-wrap { position: relative; }\n    .cc-wrap .cc-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; position: relative; }\n    .cc-wrap .cc-filters .ttl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; margin-right: 2px; }\n    .cc-wrap .cc-fbtn {\n      all: unset; cursor: pointer; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line);\n      background: #fff; color: var(--ink); display: inline-flex; gap: 6px; align-items: center; white-space: nowrap;\n    }\n    .cc-wrap .cc-fbtn b { font-weight: 600; }\n    .cc-wrap .cc-fbtn .chev { color: var(--muted); font-size: 10px; }\n    .cc-wrap .cc-fbtn.on { background: #14161f; border-color: #14161f; color: #fff; }\n    .cc-wrap .cc-fbtn.on .chev { color: #b8bccb; }\n    .cc-wrap .cc-clear { all: unset; cursor: pointer; font-size: 12px; color: #7C5CFF; font-weight: 600; padding: 6px 4px; }\n    .cc-wrap .cc-pop {\n      position: absolute; z-index: 20; top: 100%; margin-top: 6px; width: 290px; background: #fff; border: 1px solid var(--line);\n      border-radius: 12px; box-shadow: 0 12px 32px rgba(20,22,31,.16); padding: 8px; font-size: 12.5px;\n    }\n    .cc-wrap .cc-pop input[type=text] {\n      width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 7px 9px; font: inherit; margin-bottom: 6px; outline: none;\n    }\n    .cc-wrap .cc-pop .opts { max-height: 250px; overflow-y: auto; }\n    .cc-wrap .cc-pop label { display: flex; align-items: center; gap: 8px; padding: 6px 6px; border-radius: 7px; cursor: pointer; }\n    .cc-wrap .cc-pop label:hover { background: var(--chip); }\n    .cc-wrap .cc-pop label span.n { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-pop label span.a { color: var(--muted); font-size: 11.5px; }\n    .cc-wrap .cc-pop input[type=checkbox] { accent-color: #7C5CFF; margin: 0; }\n    .cc-wrap .cc-pop .foot { display: flex; justify-content: space-between; border-top: 1px solid var(--line); margin-top: 6px; padding-top: 6px; }\n    .cc-wrap .cc-pop .foot button { all: unset; cursor: pointer; font-size: 12px; font-weight: 600; color: #7C5CFF; padding: 4px 6px; }\n    .cc-wrap .cc-card .delta { font-weight: 600; }\n    .cc-wrap .cc-load {\n      position: absolute; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center;\n      background: rgba(255,255,255,.94); border-radius: 14px;\n    }\n    .cc-wrap .cc-load.show { display: flex; }\n    .cc-wrap .cc-load .box { width: min(340px, 80%); text-align: center; }\n    .cc-wrap .cc-load .spin {\n      width: 34px; height: 34px; margin: 0 auto 14px; border-radius: 50%;\n      border: 3px solid #eceef3; border-top-color: #7C5CFF; animation: ccSpin .8s linear infinite;\n    }\n    .cc-wrap .cc-load .t { font-size: 14px; font-weight: 650; }\n    .cc-wrap .cc-load .bar { height: 6px; background: #eceef3; border-radius: 3px; margin: 12px 0 8px; overflow: hidden; position: relative; }\n    .cc-wrap .cc-load .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #7C5CFF; border-radius: 3px; transition: width .25s; }\n    .cc-wrap .cc-load .bar.indet i { width: 30%; animation: ccSlide 1.1s ease-in-out infinite; }\n    .cc-wrap .cc-load .n { font-size: 12px; color: var(--muted); min-height: 16px; }\n    @keyframes ccSpin { to { transform: rotate(360deg); } }\n    @keyframes ccSlide { 0% { left: -30%; } 100% { left: 100%; } }\n    .cc-wrap .cc-msg { font-size: 12px; color: #c2410c; white-space: pre-wrap; }\n  \n    .cc-wrap .up { color: #0E9F6E; } .cc-wrap .down { color: #E5484D; } .cc-wrap .flat { color: var(--muted); }\n    .cc-wrap select.cc-sel { font: inherit; font-size: 12px; font-weight: 600; padding: 6px 8px; border: 1px solid var(--line); border-radius: 8px; background: #fff; color: var(--ink); text-transform: none; letter-spacing: 0; }\n\n    .cc-wrap .cc-item .amt.up { color: #0E9F6E; } .cc-wrap .cc-item .amt.down { color: #E5484D; }\n    /* size steps, set from the box's own size: compact when short, hide the side list when narrow */\n    .cc-wrap > * { flex-shrink: 0; }\n    .cc-wrap > .cc-body { flex-shrink: 1; }\n    .cc-wrap.cc-short { gap: 10px; padding-top: 14px; }\n    .cc-wrap.cc-short .cc-card { padding: 8px 12px; }\n    .cc-wrap.cc-short .cc-card .val { font-size: 18px; }\n    .cc-wrap.cc-short .cc-card .sub, .cc-wrap.cc-short .cc-sub { display: none; }\n    .cc-wrap.cc-tiny .cc-cards { display: none; }\n    .cc-wrap.cc-tiny .cc-dbg { display: none; }\n    .cc-wrap.cc-narrow .cc-rank { display: none; }\n    .cc-wrap .nc-chart { position: relative; flex: 3 1 0; min-height: 0; min-width: 0; }\n    .cc-wrap .nc-chart svg { position: absolute; inset: 0; display: block; overflow: visible; }\n    .cc-wrap .nc-chart svg text { font-family: inherit; }\n    .cc-wrap .nc-chart [data-g] { transition: opacity .15s; }\n    .cc-wrap .nc-tip { position: absolute; z-index: 25; display: none; pointer-events: none; background: #14161f; color: #fff; font-size: 12px; line-height: 1.45; padding: 8px 10px; border-radius: 9px; max-width: 280px; }\n    .cc-wrap .nc-scroll { flex: 1 1 0; min-height: 0; min-width: 0; overflow: auto; }\n    .cc-wrap .nc-tri { border-collapse: separate; border-spacing: 3px; font-variant-numeric: tabular-nums; font-size: 12px; }\n    .cc-wrap .nc-tri th { font-weight: 600; color: var(--muted); padding: 4px 6px; position: sticky; top: 0; background: #fff; z-index: 1; text-align: center; white-space: nowrap; }\n    .cc-wrap .nc-tri tbody th { position: sticky; left: 0; z-index: 1; text-align: left; color: var(--ink); }\n    .cc-wrap .nc-tri th span { display: block; font-weight: 500; color: var(--muted); font-size: 10.5px; }\n    .cc-wrap .nc-tri th.corner { left: 0; z-index: 2; text-align: left; }\n    .cc-wrap .nc-tri td { min-width: 46px; padding: 6px 4px; border-radius: 6px; text-align: center; cursor: default; }\n    .cc-wrap .nc-tri td.none { background: transparent; }\n    .cc-wrap .nc-tri tr.avg td { background: var(--chip); color: var(--ink); font-weight: 700; }\n    .cc-wrap .nc-tri tr.avg th { color: var(--ink); }\n    .cc-wrap .nc-player { display: flex; align-items: center; gap: 8px; }\n    .cc-wrap .nc-play { all: unset; cursor: pointer; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px; background: #14161f; color: #fff; text-transform: none; letter-spacing: 0; white-space: nowrap; }\n    .cc-wrap .nc-player input[type=range] { width: 160px; accent-color: #7C5CFF; }\n    .cc-wrap .nc-tbl { border-collapse: collapse; width: 100%; font-size: 12.5px; font-variant-numeric: tabular-nums; }\n    .cc-wrap .nc-tbl th { text-align: right; font-weight: 600; color: var(--muted); font-size: 11.5px; padding: 6px 10px; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: #fff; z-index: 1; white-space: nowrap; }\n    .cc-wrap .nc-tbl th:first-child, .cc-wrap .nc-tbl td.nm { text-align: left; }\n    .cc-wrap .nc-tbl td { text-align: right; padding: 5px 10px; border-bottom: 1px solid var(--line); white-space: nowrap; }\n    .cc-wrap .nc-tbl td.nm { font-weight: 600; max-width: 220px; overflow: hidden; text-overflow: ellipsis; }\n    .cc-wrap .nc-tbl td.b { font-weight: 700; }\n    .cc-wrap .nc-tbl td.mut { color: var(--muted); }\n    .cc-wrap .nc-tbl td svg { display: block; margin-left: auto; }\n    .cc-wrap .nc-tbl tr:hover td { background: var(--chip); }\n    .cc-wrap.cc-narrow .nc-player input[type=range] { width: 110px; }\n  </style>\n\n  <div class=\"cc-head\">\n    <div>\n      <h2>Segment Change Finder</h2>\n      <span class=\"cc-sub\">Looking for the grid\u2026</span>\n    </div>\n    <div class=\"cc-controls\">\n      <div class=\"cc-ctl\">Show <div class=\"cc-seg\" data-ctl=\"show\"></div></div>\n      <div class=\"cc-ctl\">Compare with <div class=\"cc-seg\" data-ctl=\"cmp\"></div></div>\n    </div>\n  </div>\n  <div class=\"cc-cards\"></div>\n  <div class=\"cc-legend\"></div>\n  <div class=\"cc-body\">\n    <div class=\"nc-chart\"><svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Chart\"></svg></div>\n  </div>\n  <div class=\"cc-msg\"></div>\n  <div class=\"nc-tip\"></div>\n  <details class=\"cc-dbg\" style=\"font-size:11px;color:#6b7080\"><summary style=\"cursor:pointer\">Read details</summary>\n    <button type=\"button\" style=\"font-size:11px;margin:6px 0;padding:3px 8px;border:1px solid #eceef3;border-radius:6px;background:#fff;cursor:pointer\"\n      onclick=\"var p=this.parentNode.querySelector('pre');try{navigator.clipboard.writeText(p.textContent)}catch(e){};var r=document.createRange();r.selectNodeContents(p);var s=getSelection();s.removeAllRanges();s.addRange(r);\">Copy</button>\n    <pre style=\"white-space:pre-wrap;margin:0;font:11px/1.45 Consolas,monospace;max-height:220px;overflow:auto;background:#f6f7fa;padding:8px;border-radius:8px\"></pre></details>\n  <div class=\"cc-load\"><div class=\"box\"><div class=\"spin\"></div><div class=\"t\">Loading data\u2026</div>\n    <div class=\"bar indet\"><i></i></div><div class=\"n\">Looking for the grid</div></div></div>\n</div>";
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
    month: "Date", dimA: "Dimension A", dimB: "Dimension B", units: "Units",
    v1: "Metric 1"
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

  const PERIODS = ["1"].map(k => ({ key: k, name: L["v" + k] }));
  const SPLITS = [];
  const COLS = Object.keys(COLUMN_NAMES).map(id => ({ id, attr: ["month", "dimA", "dimB"].includes(id), test: t => t === cmp(COLNAMES[id]) }));
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
    const free = Array.from(document.querySelectorAll('.cc-wrap[data-chart="segment-change-finder"]'))
      .filter(w => !w.getAttribute("data-cc-init") && isVisible(w));
    if (!free.length) return false;
    wrap = free[0];
    wrap.setAttribute("data-cc-init", "1");
    fitToBox();
    return true;
  }

  // Fit the box: the chart fills whatever height the container gives it. If the container has no height
  // of its own, fall back to 520px. Short boxes get compact cards, very short ones drop the cards,
  // and narrow ones drop the side list, so nothing has to scroll.
  function fitToBox() {
    const host = wrap.parentElement;
    if (host && host.clientHeight < 150) wrap.style.minHeight = "520px";
    const apply = () => {
      const h = wrap.clientHeight, w = wrap.clientWidth;
      wrap.classList.toggle("cc-short", h < 620);
      wrap.classList.toggle("cc-tiny", h < 440);
      wrap.classList.toggle("cc-narrow", w < 700);
    };
    apply();
    try { new ResizeObserver(apply).observe(wrap); } catch (e) { window.addEventListener("resize", apply); }
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
  /* ---------- dates ----------
     Auto-detects 20261023, 2026-10-23, 23/10/2026, 10/23/2026, 23 Oct 2026, Oct 23 2026, 2026 W44,
     202610, 2026-10, Oct 2026, October, 2026. To pin one format, add data-date-format to the placeholder,
     e.g. data-date-format="DD/MM/YYYY". Tokens: YYYY YY MMMM MMM MM M DD D ww (ISO week number);
     anything else is matched as written, so "YYYY Www" reads 2026 W44. */
  const D_MS = 864e5;
  const DATE_FMT = (phAttr("data-date-format") || "").trim();
  let badDate = "";
  const dateHint = () => badDate ? " Couldn't read dates like \"" + badDate + "\"" + (DATE_FMT ? " with the format " + DATE_FMT : "") + " – set data-date-format on the placeholder to match the grid." : "";
  const monthIdx = s => MONTHS.indexOf(String(s).slice(0, 3).toLowerCase());
  const okDay = (y, m, d) => m >= 0 && m < 12 && d >= 1 && d <= 31 && y > 1900 && y < 2200;
  function isoWeekStart(y, w) {                 // day number of the Monday of ISO week w
    const jan4 = Date.UTC(y, 0, 4) / D_MS;
    return jan4 - ((new Date(jan4 * D_MS).getUTCDay() + 6) % 7) + (w - 1) * 7;
  }
  const FMT_RX = (() => {
    if (!DATE_FMT) return null;
    const toks = [], order = [];
    let f = DATE_FMT;
    const T = ["YYYY", "YY", "MMMM", "MMM", "MM", "M", "DD", "D", "ww"];
    while (f.length) {
      const t = T.find(x => f.startsWith(x));
      if (t) { toks.push({ t }); f = f.slice(t.length); }
      else { toks.push({ lit: f[0] }); f = f.slice(1); }
    }
    const num = t => t && /^(YYYY|YY|MM|M|DD|D|ww)$/.test(t.t || "");
    const rx = toks.map((k, i) => {
      if (k.lit !== undefined) return /\s/.test(k.lit) ? "\\s*" : k.lit === "," ? ",?" : k.lit.replace(/[.*+?^${}()|[\]\\\/-]/g, "\\$&");
      order.push(k.t);
      const tight = num(toks[i - 1]) || num(toks[i + 1]);       // no separator next to it → fixed width
      return { YYYY: "(\\d{4})", YY: "(\\d{2})", MMMM: "([A-Za-z]{3,9})\\.?", MMM: "([A-Za-z]{3,9})\\.?",
        MM: tight ? "(\\d{2})" : "(\\d{1,2})", M: "(\\d{1,2})", DD: tight ? "(\\d{2})" : "(\\d{1,2})", D: "(\\d{1,2})", ww: tight ? "(\\d{2})" : "(\\d{1,2})" }[k.t];
    }).join("");
    return { re: new RegExp("^\\s*" + rx + "\\s*$", "i"), order };
  })();
  function readFmt(t) {                         // → { y, m, d, w } or null
    const m = clean(t).match(FMT_RX.re);
    if (!m) return null;
    const o = {};
    FMT_RX.order.forEach((k, i) => {
      const v = m[i + 1];
      if (k === "YYYY") o.y = +v; else if (k === "YY") o.y = 2000 + +v;
      else if (k === "MMMM" || k === "MMM") o.m = monthIdx(v); else if (k === "MM" || k === "M") o.m = +v - 1;
      else if (k === "DD" || k === "D") o.d = +v; else if (k === "ww") o.w = +v;
    });
    // no year in the format (e.g. "DD/MM" for 22/11): take the most recent year that doesn't put the date in the future
    if (!o.y && !/Y/.test(DATE_FMT) && o.m !== undefined && o.d !== undefined) { const now = new Date(); o.y = now.getUTCFullYear(); if (Date.UTC(o.y, o.m, o.d) > now.getTime() + 864e5) o.y--; }
    if (!o.y || (o.m !== undefined && (o.m < 0 || o.m > 11)) || (o.w !== undefined && (o.w < 1 || o.w > 53))) return null;
    return o;
  }
  const miss = t => { t = clean(t); if (/\d/.test(t) && !badDate) badDate = t.slice(0, 30); return null; };
  // ISO week labels → week index (week 0 starts Monday 1970-01-05)
  function parseWeek(t) {
    let y, w, m;
    if (FMT_RX) { const o = readFmt(t); if (!o || o.w === undefined) return null; y = o.y; w = o.w; }
    else {
      t = clean(t);
      if ((m = t.match(/^(\d{4})\s*[-\/,]?\s*W(?:ee)?k?\s*(\d{1,2})$/i))) { y = +m[1]; w = +m[2]; }
      else if ((m = t.match(/^W(?:ee)?k?\s*(\d{1,2})\s*[-\/,]?\s*(\d{4})$/i))) { y = +m[2]; w = +m[1]; }
      else return null;
      if (w < 1 || w > 53) return null;
    }
    return (isoWeekStart(y, w) - 4) / 7;
  }
  // full dates → day number (days since 1970-01-01)
  function parseDay(t) {
    if (FMT_RX) {
      const o = readFmt(t);
      return o && o.d !== undefined && o.m !== undefined && okDay(o.y, o.m, o.d) ? Date.UTC(o.y, o.m, o.d) / D_MS : null;
    }
    t = clean(t); let m, y, mo, d;
    if ((m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) { y = +m[1]; mo = +m[2] - 1; d = +m[3]; }
    else if ((m = t.match(/^(\d{4})(\d{2})(\d{2})$/))) { y = +m[1]; mo = +m[2] - 1; d = +m[3]; }
    else if ((m = t.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/))) {   // dd/mm/yyyy, or mm/dd/yyyy when that's the only reading
      y = +m[3]; d = +m[1]; mo = +m[2] - 1;
      if (mo > 11 && +m[1] <= 12) { d = +m[2]; mo = +m[1] - 1; }
    }
    else if ((m = t.match(/^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/))) { y = +m[3]; mo = monthIdx(m[2]); d = +m[1]; }
    else if ((m = t.match(/^([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})$/))) { y = +m[3]; mo = monthIdx(m[1]); d = +m[2]; }
    else return null;
    return okDay(y, mo, d) ? Date.UTC(y, mo, d) / D_MS : null;
  }
  // anything date-like → { y, m } (days and weeks roll up to their month; a week counts in the month of its Thursday)
  function parseMonth(t) {
    if (FMT_RX) {
      const o = readFmt(t);
      if (!o) return miss(t);
      if (o.w !== undefined) { const th = new Date((isoWeekStart(o.y, o.w) + 3) * D_MS); return { y: th.getUTCFullYear(), m: th.getUTCMonth() }; }
      return o.m !== undefined ? { y: o.y, m: o.m } : miss(t);
    }
    const c = clean(t); let m;
    if ((m = c.match(/^(\d{4})[-\/]?(\d{1,2})$/)) && +m[2] >= 1 && +m[2] <= 12) return { y: +m[1], m: +m[2] - 1 };
    const d = parseDay(c);
    if (d !== null) { const x = new Date(d * D_MS); return { y: x.getUTCFullYear(), m: x.getUTCMonth() }; }
    const w = parseWeek(c);
    if (w !== null) { const th = new Date((w * 7 + 4 + 3) * D_MS); return { y: th.getUTCFullYear(), m: th.getUTCMonth() }; }
    m = c.match(/([A-Za-z]{3,9})[\s,.\-\/]+'?(\d{4}|\d{2})\b/);
    if (m && monthIdx(m[1]) > -1) { let y = +m[2]; if (y < 100) y += 2000; return { y, m: monthIdx(m[1]) }; }
    return miss(t);
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
      // grow to the header's own cell, but stop before a box that holds other text (e.g. a whole frozen pane
      // of row headers), so values in that box aren't mistaken for header text
      const own = compact(cell.textContent);
      const free = el => !els.some(o => o !== heads[id] && el.contains(o));
      while (cell.parentElement && free(cell.parentElement) && compact(cell.parentElement.textContent) === own) cell = cell.parentElement;
      const box = cell.closest && cell.closest("td,th,[role=columnheader],[role=gridcell]");
      if (box && free(box) && compact(box.textContent) === own) cell = box;
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

  // Is the text actually on show inside every scrolling/clipping box around it? Text that MSTR has drawn
  // but that is scrolled out of, or hidden behind, its pane is skipped – it is read again once it scrolls into view.
  function shownInBoxes(el, r, root, cache) {
    for (let a = el; a && a !== root.parentElement && a !== document.body; a = a.parentElement) {
      let st = cache.get(a);
      if (!st) { const cs = getComputedStyle(a); st = /(auto|scroll|hidden|clip)/.test(cs.overflowX + cs.overflowY) ? 1 : 2; cache.set(a, st); }
      if (st !== 1) continue;
      const b = a.getBoundingClientRect();
      if (r.bottom <= b.top + 1 || r.top >= b.bottom - 1 || r.right <= b.left + 1 || r.left >= b.right - 1) return false;
    }
    return true;
  }

  function collect(ctx, store) {
    const b0 = base(ctx);
    const ids = Object.keys(ctx.ranges);
    const hb = Math.max(...ctx.headEls.map(e => e.getBoundingClientRect().bottom));   // header may be frozen or scrolled away
    const rootBottom = ctx.root.getBoundingClientRect().bottom;
    const cache = new Map(), cand = [];
    textNodes(ctx.root).forEach(n => {
      if (ctx.headCells.some(c => c.contains(n))) return;
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      if (!r.width) return;
      if (ctx.baseEl) {
        // scrolling: positions are measured within the scrolling content, so rows that have slid behind a frozen
        // header still count – only skip a header copy that sits inside the scrolling content itself
        if (ctx.headInBox !== null && ctx.headInBox !== undefined && (r.top + r.bottom) / 2 - b0 < ctx.headInBox) return;
        if (!shownInBoxes(n.parentElement, r, ctx.root, cache)) return;
      } else if (r.top < hb - 1) return;
      // below the grid? (rows clipped inside the grid's own scroll box still count)
      if (!ctx.baseEl && r.bottom > rootBottom + 1 && !(ctx.clip && ctx.clip.some(c => c.contains(n)))) return;
      const cx = (r.left + r.right) / 2;
      const id = ids.find(k => cx >= ctx.ranges[k].left && cx <= ctx.ranges[k].right);
      if (!id) return;
      cand.push({ id, text: clean(n.nodeValue), sy: (r.top + r.bottom) / 2, x: r.left, h: r.height,
                  own: !ctx.baseEl || ctx.baseEl.contains(n) });
    });
    // Line the cells up by where they are on screen right now, then give the whole line the position of its
    // cells in the scrolling content. Row labels in a separate frozen pane (as in MicroStrategy) then always
    // land on the same row as their values, however the two panes scroll.
    cand.sort((a, b) => a.sy - b.sy);
    const lines = [];
    cand.forEach(c => {
      const l = lines[lines.length - 1];
      if (l && Math.abs(c.sy - l.sy) <= Math.max(4, c.h * 0.6)) l.items.push(c); else lines.push({ sy: c.sy, items: [c] });
    });
    lines.forEach(l => {
      const own = l.items.filter(c => c.own);
      const cy = (own.length ? own[0].sy : l.sy) - b0;
      l.items.forEach(c => {
        const key = c.id + "|" + c.text;
        const ys = store.seen.get(key) || [];
        if (ys.some(y => Math.abs(y - cy) < 4)) return;           // already have this cell
        ys.push(cy); store.seen.set(key, ys);
        store.bits.push({ id: c.id, text: c.text, x: c.x, cy, h: c.h });
      });
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
      lines[i].bits.sort((a, b) => a.x - b.x).forEach(b => { cell[b.id] = cell[b.id] && cell[b.id].split(" ").includes(b.text) ? cell[b.id] : clean((cell[b.id] || "") + " " + b.text); });
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
    // Wait for the grid to finish drawing, then read it. A reading only counts once two in a row agree,
    // so a frozen pane that catches up a moment after the values never pairs labels with the wrong row.
    const t0 = Date.now(), had = store.bits.length;
    const limit = expectNew === false ? 600 : expectNew ? 7000 : 3000;   // the grid can take a few seconds to draw a batch
    await wait(70);
    let prevSig = null, snap = null;
    while (Date.now() - t0 < limit) {
      const st = newStore();
      collect(ctx, st);
      const sig = st.bits.map(b => b.id + "|" + b.text + "|" + Math.round(b.cy)).join("\n");
      snap = st;
      if (sig === prevSig && st.bits.length) {
        // stable – but if new rows were expected and none have appeared yet, keep waiting
        const fresh = st.bits.some(b => { const ys = store.seen.get(b.id + "|" + b.text); return !ys || !ys.some(y => Math.abs(y - b.cy) < 4); });
        if (fresh || !expectNew || store.bits.length > had) break;
      }
      prevSig = sig;
      await wait(110);
    }
    if (snap) snap.bits.forEach(b => {
      const key = b.id + "|" + b.text, ys = store.seen.get(key) || [];
      if (ys.some(y => Math.abs(y - b.cy) < 4)) return;
      ys.push(b.cy); store.seen.set(key, ys); store.bits.push(b);
    });
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
  // While the chart scrolls a big grid to read it, the grid is hidden so it doesn't visibly jump.
  // Opt out with data-hide-while-reading="false" on the placeholder.
  const VEIL = phAttr("data-hide-while-reading") !== "false";
  function veil(ctx, on) {
    const el = ctx && ctx.root;
    if (!VEIL || !el || !el.style) return;
    if (on) { if (!el.hasAttribute("data-cc-veil")) { el.setAttribute("data-cc-veil", el.style.visibility || ""); el.style.visibility = "hidden"; } }
    else if (el.hasAttribute("data-cc-veil")) { el.style.visibility = el.getAttribute("data-cc-veil"); el.removeAttribute("data-cc-veil"); }
  }

  async function tryScroller(ctx, e) {
    const before = e.scrollTop, seen = textsNow(ctx);
    veil(ctx, true);
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
    veil(ctx, false);
    return works ? { el: e, baseEl: mover || e } : null;
  }

  let scrollMemo = null;          // remembers which box scrolls the grid between reads
  let lastInfo = "";

  // Read every row: scrolls the grid top to bottom if it only draws what's on screen
  /* ---------- MicroStrategy data model ----------
     In MicroStrategy (Library / dossiers) every grid keeps its full result set in memory: mstrmojo.all[...].gridData
     (row headers in ghs.rhs, values in gvs, metric names in ghs.chs). Reading that is exact and needs no scrolling,
     so it is tried first; the on-screen reader below is the fallback for other platforms. */
  let modelSig = null;
  function mstrAll() {
    let mm = null;
    try { mm = window.mstrmojo; } catch (e) {}
    try { if ((!mm || !mm.all) && window.top.mstrmojo) mm = window.top.mstrmojo; } catch (e) {}
    return mm && mm.all ? mm.all : null;
  }
  const cellText = c => c == null ? "" : clean(String(c.v !== undefined && c.v !== null ? c.v : (c._e && c._e.n) || ""));
  function modelGrids() {
    const all = mstrAll(); if (!all) return [];
    const out = [];
    for (const id in all) {
      let g; try { const o = all[id]; g = o && o.gridData; } catch (e) { continue; }
      if (!g || !g.ghs || !g.ghs.rhs || !g.gvs || !Array.isArray(g.gvs.items) || !Array.isArray(g.ghs.rhs.items)) continue;
      const attrs = ((g.gsi && g.gsi.rows) || []).map(a => cmp(a && a.n));
      const chs = (g.ghs.chs && g.ghs.chs.items) || [], lastCh = chs[chs.length - 1];
      const mets = lastCh && Array.isArray(lastCh.items) ? lastCh.items.map(c => cmp(cellText(c))) : [];
      const aIdx = {}, mIdx = {};
      COLS.forEach(c => { const ai = attrs.findIndex(n => c.test(n)); if (ai >= 0) aIdx[c.id] = ai; else { const mi = mets.findIndex(n => c.test(n)); if (mi >= 0) mIdx[c.id] = mi; } });
      if (!PERIODS.some(p => mIdx["v" + p.key] !== undefined)) continue;
      out.push({ g, aIdx, mIdx, score: Object.keys(aIdx).length + Object.keys(mIdx).length });
    }
    // the same grid can be registered twice (editor + viewer): keep the best match, then the one with most rows
    return out.sort((a, b) => b.score - a.score || b.g.gvs.items.length - a.g.gvs.items.length);
  }
  const sigOf = g => { try { const v = g.gvs.items, a = v[0], z = v[v.length - 1]; return v.length + "|" + JSON.stringify(a && a.items && a.items.map(cellText)) + "|" + JSON.stringify(z && z.items && z.items.map(cellText)); } catch (e) { return ""; } };
  function readModel() {
    modelDiagMsg = "";
    const found = modelGrids()[0];
    if (!found) return null;
    const { g, aIdx, mIdx } = found, R = g.ghs.rhs.items, V = g.gvs.items, ATTRS = COLS.filter(c => c.attr).map(c => c.id);
    const rows = []; let prev = {}, rawN = 0, grand = null, unlabelled = 0;
    // a header cell's text, or – if MicroStrategy hasn't filled it in yet – its element from the attribute's element list
    const ES = (g.gts && Array.isArray(g.gts.row)) ? g.gts.row : [];
    const headText = (c, u) => { const t = cellText(c); if (t || !c || c.idx === undefined || !ES[u] || !Array.isArray(ES[u].es)) return t; const e = ES[u].es[c.idx]; return e ? clean(String(e.n || "")) : ""; };
    for (let r = 0; r < V.length; r++) {
      const hc = (R[r] && R[r].items) || [], byUnit = {};
      hc.forEach((c, i) => { const u = c && c.ui !== undefined ? c.ui : i; byUnit[u] = headText(c, u); });
      const row = {};
      ATTRS.forEach(id => { row[id] = aIdx[id] !== undefined ? (byUnit[aIdx[id]] || prev[id] || "") : ""; });
      // a Total row: labelled "Total", or a row with no labels of its own (MicroStrategy leaves the grand total's header blank)
      const ownLabels = Object.values(byUnit).filter(Boolean).length;
      if (!ownLabels) unlabelled++;
      const isTotal = ATTRS.some(id => /total/i.test(row[id] || "")) || ownLabels === 0;
      const vc = (V[r] && V[r].items) || [], byCol = {};
      vc.forEach((c, i) => { const ci = c && c.pi && c.pi.top && typeof c.pi.top.ci === "number" ? c.pi.top.ci : i; byCol[ci] = c; });
      const num = c => { if (!c) return null; const rv = c.rv !== undefined ? c.rv : c.raw !== undefined ? c.raw : c.rawValue; if (rv !== undefined && rv !== null && rv !== "" && !isNaN(Number(rv))) { rawN++; return Number(rv); } return parseNum(cellText(c)); };
      row.v = {}; row.raw = {};
      PERIODS.forEach(p => { const c = byCol[mIdx["v" + p.key]]; row.v[p.key] = mIdx["v" + p.key] === undefined ? null : num(c); if (c) row.raw["v" + p.key] = cellText(c); });
      row.units = mIdx.units !== undefined ? num(byCol[mIdx.units]) : null;
      if (isTotal) { if (ownLabels === 0 || ATTRS.every(id => aIdx[id] === undefined || /total/i.test(row[id] || ""))) grand = row; dlog("Skipped a total row (" + (ownLabels ? "labelled Total" : "no labels") + ")"); continue; }
      if (PERIODS.every(p => row.v[p.key] === null) && row.units === null) { prev = row; continue; }
      row.pm = parseMonth(row.month);
      rows.push(row); prev = row;
    }
    if (!grand && rows.length > 2) {
      const k1 = PERIODS.find(p => rows.some(x => x.v[p.key] !== null)).key, all = rows.reduce((a, x) => a + (x.v[k1] || 0), 0);
      [rows.length - 1, 0].some(i => { const v = rows[i].v[k1]; if (v && Math.abs(v - (all - v)) <= Math.abs(v) * 0.002) { grand = rows.splice(i, 1)[0]; dlog("Removed a row that equals the sum of all the others (a grand total)"); return true; } return false; });
    }
    // labels not filled in yet (more than the one grand-total row without labels): wait for them
    if (unlabelled > 1) { modelDiagMsg = "Waiting for MicroStrategy to finish loading the row labels (" + unlabelled + " of " + V.length + " rows have none yet)…"; dlog(modelDiagMsg); return null; }
    // only show data once it is complete: every row loaded, and – when the grid has a grand total – the sums match it
    const tc = g.rw && g.rw.row && typeof g.rw.row.tc === "number" && g.rw.row.tc > 0 ? g.rw.row.tc : null;
    if (tc !== null && V.length < tc) { modelDiagMsg = "Waiting for the whole grid: " + V.length + " of " + tc + " rows loaded so far. If this doesn't change, turn off incremental fetch on the grid."; dlog(modelDiagMsg); return null; }
    if (grand) {
      const bad = [];
      PERIODS.concat([{ key: "u" }]).forEach(p => {
        const tot = p.key === "u" ? grand.units : grand.v[p.key]; if (tot === null || tot === undefined || !isFinite(tot) || !tot) return;
        const sum = rows.reduce((a, r) => a + ((p.key === "u" ? r.units : r.v[p.key]) || 0), 0), tol = rawN ? 0.001 : 0.02;
        if (Math.abs(sum - tot) > Math.abs(tot) * tol + 0.5) bad.push((p.key === "u" ? L.units : L["v" + p.key]) + ": rows add up to " + count(Math.round(sum)) + " but the grid total is " + count(Math.round(tot)));
      });
      // a note, not a block: unique counts, averages and rates don't add up to their total by design
      if (bad.length) dlog("Note – rows vs the grid's total row: " + bad.join("; ") + ". Normal for unique counts, averages and rates.");
      else dlog("Checked against the grid's total row: matches.");
    }
    modelSig = sigOf(g);
    modelDiagMsg = "";
    dlog("Read from MicroStrategy's data (no scrolling): " + rows.length + " rows of " + V.length + (g.rw && g.rw.row ? " · grid says " + g.rw.row.tc + " in total" : "") +
         " · " + (rawN ? "exact values" : "values as formatted in the grid"));
    if (g.rw && g.rw.row && g.rw.row.tc > V.length) dlog("Only " + V.length + " of " + g.rw.row.tc + " rows are loaded – turn off incremental fetch on the grid.");
    if (!rows.length) return null;
    dlog("Complete: " + rows.length + " data rows" + (tc !== null ? " from all " + tc + " grid rows" : "") + (grand ? ", grand-total row left out" : "") + ".");
    return { rows, hasUnits: mIdx.units !== undefined, splits: [], scrollH: 0, model: true, exact: rawN > 0 };
  }

  // data-read="model": only read MicroStrategy's data – never scroll the grid on screen
  const MODEL_ONLY = (phAttr("data-read") || "").trim().toLowerCase() === "model";
  let modelDiagMsg = "";
  function modelDiag() {
    const all = mstrAll();
    if (!all) return "Couldn't reach MicroStrategy's data from this container (mstrmojo not found). Check the container is set to HTML Text, not iFrame.";
    const seen = [];
    for (const id in all) {
      let g; try { g = all[id] && all[id].gridData; } catch (e) { continue; }
      if (!g || !g.ghs) continue;
      const attrs = ((g.gsi && g.gsi.rows) || []).map(a => a && a.n), chs = (g.ghs.chs && g.ghs.chs.items) || [], lastCh = chs[chs.length - 1];
      const mets = lastCh && lastCh.items ? lastCh.items.map(cellText) : [];
      seen.push("[" + attrs.concat(mets).join(", ") + "] " + ((g.gvs && g.gvs.items && g.gvs.items.length) || 0) + " rows");
    }
    if (!seen.length) return "MicroStrategy's data has no grids yet – it may still be loading. Press Refresh data in a moment.";
    return "No grid matched the column names. Looking for: " + COLS.map(c => COLNAMES[c.id]).join(", ") + ". Grids on this page: " + seen.slice(0, 4).join(" · ");
  }

  // Page lock: if anything scrolls the page (or a box the chart sits in) without the viewer doing it, put it back.
  // Stops the whole MicroStrategy page jumping and the toolbar being pushed off the top. data-lock-page="false" turns it off.
  function lockPage() {
    if ((phAttr("data-lock-page") || "").trim().toLowerCase() === "false" || lockPage.on) return;
    lockPage.on = true;
    let userAt = 0; const mark = () => { userAt = Date.now(); };
    ["wheel", "touchstart", "touchmove", "keydown", "mousedown"].forEach(t => { try { window.addEventListener(t, mark, { capture: true, passive: true }); } catch (e) {} });
    const root = document.scrollingElement || document.documentElement, saved = new Map();
    const guarded = el => !!el && (el === root || el === document.documentElement || el === document.body || (el.contains && el.contains(wrap)));
    const keep = el => saved.set(el, [el.scrollTop, el.scrollLeft]);
    [root, document.documentElement, document.body].forEach(keep);
    for (let e = wrap.parentElement; e; e = e.parentElement) keep(e);
    let fixes = 0;
    document.addEventListener("scroll", ev => {
      const el = ev.target === document ? root : ev.target;
      if (!guarded(el)) return;
      if (Date.now() - userAt < 1200) { keep(el); return; }            // the viewer scrolled: that's fine
      const s = saved.get(el); if (!s) { keep(el); return; }
      if (el.scrollTop !== s[0] || el.scrollLeft !== s[1]) { el.scrollTop = s[0]; el.scrollLeft = s[1]; if (++fixes <= 5) dlog("Page lock: put back a scroll on " + descEl(el)); }
    }, true);
  }

  async function readAll(progress) {
    try { const m = readModel(); if (m) { lastInfo = ""; modelDiagMsg = ""; return m; } } catch (e) { dlog("Model read failed: " + e.message); }
    if (MODEL_ONLY || modelDiagMsg) { if (!modelDiagMsg) modelDiagMsg = modelDiag(); dlog(modelDiagMsg); return null; }
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
      veil(ctx, true);
      try {
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
      } finally { veil(ctx, false); }
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
    if (d && d.model) { const f = modelGrids()[0]; return !!f && sigOf(f.g) !== modelSig; }
    const ctx = locate();
    if (!ctx) return false;
    const sc = scrollMemo && scrollMemo.el;
    if (sc && scrollMemo.baseEl) ctx.baseEl = scrollMemo.baseEl;
    if (!sc) ctx.clip = scrollCandidates(ctx);
    const store = { bits: [], seen: new Map() };
    collect(ctx, store);
    const known = new Set(d.rows.map(rowKey));
    const vis = parseBits(store.bits, false);
    return vis.some(r => !known.has(rowKey(r)));
  }

  /* ================= RENDER ================= */
  let current = null, lastSig = "";

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
  const PALETTE = ["#7C5CFF", "#12A594", "#E5484D", "#F59E0B", "#3B82F6", "#EC4899", "#0F172A", "#84CC16"];
  const OTHER = "#B8BCCB";
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
  const pick = (attr, ok, dflt) => { const v = (phAttr(attr) || "").trim().toLowerCase(); return ok.includes(v) ? v : dflt; };
  const pctTxt = x => (x >= 0 ? "▲ +" : "▼ ") + (x * 100).toFixed(1) + "%";
  const monthKey = pm => pm.y * 12 + pm.m;
  // tidy axis maximum: 4 equal steps of a round number
  function niceMax(mx) {
    if (!(mx > 0)) return 1;
    const st = mx / 4, p10 = Math.pow(10, Math.floor(Math.log10(st))), f = st / p10;
    return [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => f <= x + 1e-9) * p10 * 4;
  }
  // hover boxes for SVG marks with data-tip
  function bindTips(svg, tips, groupAttr) {
    const tip = $(".nc-tip"), all = groupAttr ? svg.querySelectorAll("[" + groupAttr + "]") : [];
    svg.querySelectorAll("[data-tip]").forEach(el => {
      el.style.cursor = "pointer";
      el.addEventListener("mousemove", e => {
        const t = tips[+el.getAttribute("data-tip")].filter(Boolean), r = wrap.getBoundingClientRect();
        if (groupAttr) { const g = el.getAttribute(groupAttr); all.forEach(x => { x.style.opacity = x.getAttribute(groupAttr) === g ? "1" : "0.25"; }); }
        tip.innerHTML = "<b>" + esc(t[0]) + "</b>" + (t.length > 1 ? "<br>" + t.slice(1).map(esc).join("<br>") : "");
        tip.style.display = "block";
        tip.style.left = Math.max(4, Math.min(e.clientX - r.left + 14, r.width - tip.offsetWidth - 6)) + "px";
        tip.style.top = (e.clientY - r.top + 12) + "px";
      });
      el.addEventListener("mouseleave", () => { tip.style.display = "none"; all.forEach(x => { x.style.opacity = ""; }); });
    });
  }
  let model = null;
  function buildControls() {
    try { new ResizeObserver(() => { if (model) draw(); }).observe($(".nc-chart")); } catch (e) {}
  }
  function svgBox() {
    const box = $(".nc-chart"), svg = box.querySelector("svg");
    const W = Math.max(240, box.clientWidth), H = Math.max(140, box.clientHeight);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("width", W); svg.setAttribute("height", H);
    return { svg, W, H };
  }
  const tipList = () => { const tips = []; return { tips, attr: t => { tips.push(t); return ' data-tip="' + (tips.length - 1) + '"'; } }; };

  // shared for this batch
  const card = (lbl, val, sub, cls) => '<div class="cc-card' + (cls || "") + '"><div class="lbl">' + lbl + '</div><div class="val">' + val + '</div><div class="sub">' + sub + '</div></div>';
  const nameOf = (r, f) => clean(r[f] || "") || "(blank)";
  function sumBy(rows, f, key) { const m = new Map(); rows.forEach(r => { const s = nameOf(r, f); m.set(s, (m.get(s) || 0) + (r.v[key || "1"] || 0)); }); return m; }
  const short = (t, n) => t.length > n ? t.slice(0, Math.max(1, n - 1)) + "…" : t;
  // biggest n by value, the rest folded into "Other (k)"
  function topN(entries, n) {
    const l = entries.slice().sort((a, b) => b[1] - a[1]);
    if (l.length <= n) return l.map(([s, v]) => ({ s, v }));
    const rest = l.slice(n - 1);
    return l.slice(0, n - 1).map(([s, v]) => ({ s, v })).concat([{ s: "Other (" + rest.length + ")", v: rest.reduce((a, x) => a + x[1], 0), other: rest.map(x => x[0]) }]);
  }
  const colorFor = (list) => { const m = new Map(); list.forEach((o, i) => m.set(o.s, o.other ? OTHER : PALETTE[i % PALETTE.length])); return m; };
  const groupOf = (list, s) => list.find(o => o.s === s) || list.find(o => o.other) || null;
  const legendHTML = (list, cols) => list.map(o => '<span><i class="sw" style="background:' + cols.get(o.s) + '"></i>' + esc(o.s) + '</span>').join("");
  const lastMonthRows = rows => {
    const ks = rows.filter(r => r.pm).map(r => monthKey(r.pm));
    if (ks.length < rows.length * 0.8 || !ks.length) return { rows, label: "" };
    const last = Math.max(...ks), pm = rows.find(r => r.pm && monthKey(r.pm) === last).pm;
    return { rows: rows.filter(r => r.pm && monthKey(r.pm) === last), label: shortMonth(pm) };
  };

  // time keys for monthly, weekly or daily grids
  const DAYMS = 864e5, WD = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayLabel = d => { const x = new Date(d * DAYMS); return x.getUTCDate() + " " + cap(MONTHS[x.getUTCMonth()]); };
  function weekLabel(k) { const th = new Date((k * 7 + 4 + 3) * DAYMS), y = th.getUTCFullYear(), w = Math.round((k * 7 + 4 - isoWeekStart(y, 1)) / 7) + 1; return "W" + String(w).padStart(2, "0") + " '" + String(y).slice(2); }
  function timeKeys(rows, allowDay) {
    const n = rows.length || 1, src = r => r.month || r.date || "";
    if (allowDay && rows.filter(r => parseDay(src(r)) !== null).length >= n * 0.8) return { unit: "day", keyOf: r => parseDay(src(r)), label: dayLabel, per: 365 };
    if (rows.filter(r => src(r) && parseWeek(src(r)) !== null).length >= n * 0.8) return { unit: "week", keyOf: r => parseWeek(src(r)), label: weekLabel, per: 52 };
    return { unit: "month", keyOf: r => r.pm ? monthKey(r.pm) : null, label: k => cap(MONTHS[((k % 12) + 12) % 12]) + " '" + String(Math.floor(k / 12)).slice(2), per: 12 };
  }
  // sum Metric `key` by time key (and optionally by Dimension A)
  function series(rows, tk, key, byA) {
    const m = new Map();
    rows.forEach(r => { const t = tk.keyOf(r), v = r.v[key || "1"]; if (t === null || v === null || v === undefined) return;
      const g = byA ? nameOf(r, "dimA") : "_"; if (!m.has(g)) m.set(g, new Map()); const s = m.get(g); s.set(t, (s.get(t) || 0) + v); });
    return m;
  }
  const allKeys = (m) => Array.from(new Set([].concat(...Array.from(m.values()).map(s => Array.from(s.keys()))))).sort((a, b) => a - b);
  // y axis with tidy ticks; returns svg and the Y function
  function yAxis(lo, hi, P, W, H, fmt, nice) {
    if (nice !== false) { hi = niceMax(Math.max(hi, 1e-9)); if (lo < 0) lo = -niceMax(-lo); else lo = 0; }
    const Y = v => H - P.b - (v - lo) / ((hi - lo) || 1) * (H - P.t - P.b);
    let s = "";
    for (let i = 0; i <= 4; i++) { const v = lo + (hi - lo) * i / 4; s += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="' + (v === 0 && lo < 0 ? "#c5c9d6" : "#f1f2f6") + '"/><text x="' + (P.l - 7) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="10.5" fill="#6b7080">' + fmt(v) + '</text>'; }
    return { s, Y, lo, hi };
  }
  function xLabels(n, X, lab, H, W, P) {
    const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor((W - P.l - P.r) / 58)))); let s = "";
    for (let i = 0; i < n; i++) if ((n - 1 - i) % every === 0) s += '<text x="' + X(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10.5" fill="#6b7080">' + esc(lab(i)) + '</text>';
    return s;
  }
  const pathOf = pts => pts.filter(p => p).map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  // line path that breaks at gaps (null y)
  function linePath(xs, ys) { let d = "", on = false; ys.forEach((y, i) => { if (y === null || isNaN(y)) { on = false; return; } d += (on ? " L" : " M") + xs[i].toFixed(1) + "," + y.toFixed(1); on = true; }); return d; }
  const quant = (sorted, q) => { if (!sorted.length) return null; const p = (sorted.length - 1) * q, i = Math.floor(p), f = p - i; return sorted[i] + (sorted[Math.min(i + 1, sorted.length - 1)] - sorted[i]) * f; };
  // hover strips across a time axis
  function hoverCols(n, X, P, H, W, T, tipFor) {
    let s = "";
    for (let i = 0; i < n; i++) { const a = i === 0 ? P.l : (X(i - 1) + X(i)) / 2, b = i === n - 1 ? W - P.r : (X(i) + X(i + 1)) / 2;
      s += '<rect x="' + a + '" y="' + P.t + '" width="' + Math.max(1, b - a) + '" height="' + (H - P.t - P.b) + '" fill="transparent"' + T.attr(tipFor(i)) + '/>'; }
    return s;
  }
  // play / pause + slider for the animated charts
  function player(n, idx, onFrame) {
    let box = $(".nc-player");
    if (!box) {
      box = document.createElement("div"); box.className = "nc-player";
      box.innerHTML = '<button type="button" class="nc-play">▶ Play</button><input type="range" min="0" step="1" aria-label="Period">';
      $(".cc-controls").appendChild(box);
    }
    const btn = box.querySelector("button"), rng = box.querySelector("input");
    rng.max = String(n - 1); rng.value = String(idx);
    rng.oninput = () => { stop(); onFrame(+rng.value); };
    let timer = null;
    function stop() { if (timer) clearInterval(timer); timer = null; btn.textContent = "▶ Play"; }
    btn.onclick = () => {
      if (timer) { stop(); return; }
      if (+rng.value >= n - 1) rng.value = "0";
      btn.textContent = "❚❚ Pause"; onFrame(+rng.value);
      timer = setInterval(() => { const v = +rng.value + 1; if (v > n - 1) { stop(); return; } rng.value = String(v); onFrame(v); }, 900);
    };
    return { set: v => { rng.value = String(v); } };
  }

  // shared by Venn Overlap and UpSet Plot: Dimension A holds the combination, e.g. "A & B"
  const SPLIT = /\s*(?:&|\+|,|\/|\||;|\band\b)\s*/i;
  function readCombos(rows) {
    const combos = new Map();
    rows.forEach(r => { const parts = Array.from(new Set(nameOf(r, "dimA").split(SPLIT).map(clean).filter(Boolean))).sort();
      if (!parts.length) return; const key = parts.join(" & "); const o = combos.get(key) || { sets: parts, v: 0 }; o.v += r.v["1"]; combos.set(key, o); });
    const sizes = new Map(); combos.forEach(o => o.sets.forEach(s => sizes.set(s, (sizes.get(s) || 0) + o.v)));
    const tot = Array.from(combos.values()).reduce((a, o) => a + o.v, 0);
    return { combos: Array.from(combos.entries()).map(([key, o]) => ({ key, sets: o.sets, v: o.v })).sort((a, b) => b.v - a.v), sizes, tot };
  }
  // Segment Change Finder: a grid of small daily charts – Dimension A down, Dimension B across – each coloured by how
  // much it changed in the latest 7 days against the 7 before (or the 4 before), for revenue, players or revenue per player.
  const PER = (phAttr("data-period") || "").toLowerCase(), DOD = PER === "dod", DAY = PER === "day" || DOD;   // dod = latest day vs the day before; day = vs same day last week
  const state = { sel: null, show: pick("data-show", ["avg", "value", "units"], "avg"), cmp: pick("data-compare", ["week", "4wk"], "week") };
  const MAXA = 6, MAXB = 4;
  function render() {
    const k = kind("1"), rows = current.rows.filter(r => r.v["1"] !== null);
    if (!rows.length) { msg("No metric values found under the column headers." + dateHint()); return; }
    const tk = timeKeys(rows, true);
    if (tk.unit !== "day") { msg("Needs daily dates in " + L.month + "." + dateHint()); return; }
    const hasU = rows.some(r => r.units !== null);
    segButtons('[data-ctl="show"]', (hasU ? [{ key: "avg", name: "Per " + L.units.toLowerCase().replace(/s$/, "") }] : []).concat([{ key: "value", name: esc(L.v1) }], hasU ? [{ key: "units", name: esc(L.units) }] : []), hasU ? state.show : "value", x => { state.show = x; render(); });
    if (DAY) { const c = $('[data-ctl="cmp"]'); if (c && c.parentNode) c.parentNode.style.display = "none"; } else segButtons('[data-ctl="cmp"]', [{ key: "week", name: "Previous 7 days" }, { key: "4wk", name: "Previous 4 weeks" }], state.cmp, x => { state.cmp = x; render(); });
    const show = hasU ? state.show : "value";
    const cell = new Map(), aT = new Map(), bT = new Map();
    rows.forEach(r => { const d = tk.keyOf(r); if (d === null) return; const a = nameOf(r, "dimA"), b = r.dimB ? nameOf(r, "dimB") : "All", key = a + "\u0001" + b;
      if (!cell.has(key)) cell.set(key, new Map()); const m = cell.get(key), o = m.get(d) || { v: 0, u: 0 }; o.v += r.v["1"]; o.u += r.units || 0; m.set(d, o);
      aT.set(a, (aT.get(a) || 0) + r.v["1"]); bT.set(b, (bT.get(b) || 0) + r.v["1"]); });
    const A = Array.from(aT.entries()).sort((x, y) => y[1] - x[1]).slice(0, MAXA).map(e => e[0]), B = Array.from(bT.entries()).sort((x, y) => y[1] - x[1]).slice(0, MAXB).map(e => e[0]);
    const dks = rows.map(tk.keyOf).filter(x => x !== null), end = Math.max(...dks), last = state.sel !== null && dks.includes(state.sel) ? state.sel : end, minK = Math.min(...dks), first = minK, prevD = DOD ? Math.max(-1e9, ...dks.filter(d => d < last)) : last - 7, cur0 = DAY ? last : last - 6, prevN = DAY ? 1 : state.cmp === "4wk" ? 4 : 1, pLo = DAY ? prevD : cur0 - 7 * prevN, pHi = DAY ? prevD : cur0 - 1, span = DAY ? 1 : 7;
    const agg = (m, lo, hi) => { let v = 0, u = 0, n = 0; for (let d = lo; d <= hi; d++) { const o = m.get(d); if (o) { v += o.v; u += o.u; n++; } } return { v, u, n }; };
    const val = (s, weeks) => show === "units" ? s.u / weeks : show === "avg" ? (s.u ? s.v / s.u : null) : s.v / weeks;
    const tiles = [];
    A.forEach(a => B.forEach(b => { const m = cell.get(a + "\u0001" + b); if (!m) return;
      const c = agg(m, cur0, last), p = agg(m, pLo, pHi), cv = val(c, 1), pv = val(p, prevN);
      const daily = []; for (let d = first; d <= end; d++) { const o = m.get(d); daily.push(o ? (show === "units" ? o.u : show === "avg" ? (o.u ? o.v / o.u : null) : o.v) : null); }
      const ch = cv !== null && pv ? cv / pv - 1 : null, rc = p.v ? c.v / (p.v / prevN) - 1 : null, uc = p.u ? c.u / (p.u / prevN) - 1 : null, ac = c.u && p.u ? (c.v / c.u) / (p.v / p.u) - 1 : null;
      tiles.push({ a, b, cv, pv, ch, rc, uc, ac, daily, cur: c, prev: p }); }));
    if (!tiles.length) { msg("No " + L.dimA + " × " + L.dimB + " combinations found."); return; }
    const sorted = tiles.filter(t => t.ch !== null).sort((x, y) => x.ch - y.ch), worst = sorted[0], best = sorted[sorted.length - 1];
    const kk = show === "units" ? "count" : k, lab = show === "avg" ? L.v1 + " per " + L.units.toLowerCase().replace(/s$/, "") : show === "units" ? L.units : L.v1;
    const why = t => { if (!hasU || t.uc === null || t.ac === null) return ""; const one = L.units.toLowerCase().replace(/s$/, ""), fu = t.uc <= -0.02, fa = t.ac <= -0.02, big = fu && fa ? "fewer " + L.units.toLowerCase() + " and lower spend per " + one : fa ? "lower spend per " + one + " – " + L.units.toLowerCase() + " held up" : fu ? "fewer " + L.units.toLowerCase() + " – spend per " + one + " held up" : "small moves in both";
      return esc(L.units) + " " + pctTxt(t.uc) + " · per " + esc(L.units.toLowerCase().replace(/s$/, "")) + " " + pctTxt(t.ac) + (t.rc < 0 ? "<br>Why: " + big : ""); };
    const allC = agg({ get: d => { let v = 0, u = 0, f = false; tiles.forEach(t => { const o = cell.get(t.a + "\u0001" + t.b).get(d); if (o) { v += o.v; u += o.u; f = true; } }); return f ? { v, u } : undefined; } }, cur0, last);
    const allP = agg({ get: d => { let v = 0, u = 0, f = false; tiles.forEach(t => { const o = cell.get(t.a + "\u0001" + t.b).get(d); if (o) { v += o.v; u += o.u; f = true; } }); return f ? { v, u } : undefined; } }, pLo, pHi);
    const cmpTxt = DAY ? (DOD ? "the day before (" : "the same day last week (") + dayLabel(prevD) + ")" : state.cmp === "4wk" ? "the 4 weeks before (weekly average)" : "the 7 days before";
    model = { tiles, A, B, worst, k: kk, first, last, end, cur0, prevN, show, span, pLo, prevD, lab };
    $(".cc-cards").innerHTML = (worst && worst.ch < 0 ? card("Biggest fall in " + esc(/^[A-Z]{2}/.test(lab) ? lab : lab.charAt(0).toLowerCase() + lab.slice(1)), esc(worst.a + " · " + worst.b), '<b class="down">' + pctTxt(worst.ch) + "</b> " + fmtK(kk, worst.pv, true) + " → " + fmtK(kk, worst.cv, true) + (why(worst) ? "<br>" + why(worst) : ""), " hero alert") : "") +
      (best && best.ch > 0 ? card("Biggest rise", esc(best.a + " · " + best.b), '<b class="up">' + pctTxt(best.ch) + "</b> " + fmtK(kk, best.pv, true) + " → " + fmtK(kk, best.cv, true)) : "") +
      card("Total " + esc(L.v1) + (DAY ? ", " + dayLabel(last) : ", last 7 days"), fmtK(k, allC.v, true), allP.v ? pctTxt(allC.v / (allP.v / prevN) - 1) + " vs " + cmpTxt : "") +
      card("Groups down", sorted.filter(t => t.ch < 0).length + " of " + sorted.length, sorted.filter(t => t.ch <= -0.1).length + " down 10% or more");
    $(".cc-legend").innerHTML = '<span><i class="sw" style="background:#fde2e3"></i>Down</span><span><i class="sw" style="background:#dcf5ea"></i>Up</span><span><i class="sw" style="background:#ede9ff"></i>' + (DAY ? "Selected day" : "Last 7 days") + '</span><span><i class="ln" style="border-color:#9aa0ad;border-top-style:dashed"></i>' + (DOD ? "Day before" : DAY ? "Same day last week" : state.cmp === "4wk" ? "Previous 4 weeks" : "Previous 7 days") + ' level</span>';
    $(".cc-sub").textContent = lab + " by day for each " + L.dimA + " and " + L.dimB + (DAY ? " · " + dayLabel(last) + " vs " + cmpTxt : " · last 7 days (to " + dayLabel(last) + ") vs " + cmpTxt) + " · biggest fall outlined · click any point to compare that day" + (last !== end ? " (click the last point to go back to the latest)" : "");
    const noCmp = !tiles.some(t => t.pv !== null && t.pv !== undefined && t.prev.n);
    msg(noCmp ? "Nothing to compare with: the grid starts on " + dayLabel(minK) + " but this needs " + (DAY ? (DOD ? "the day before (" : "the same day last week (") + dayLabel(prevD) + ")" : "the 7 days before " + dayLabel(cur0)) + ". Include at least " + (DOD ? 2 : DAY ? 8 : 14) + " days in the grid – 4 weeks or more gives fuller trend lines." : (lastInfo || "")); draw();
  }
  function draw() {
    if (!model) return;
    const { svg, W, H } = svgBox(), { tiles, A, B, worst, k, first, last, end, cur0, prevN, span, pLo, prevD, lab } = model, T = tipList();
    const lw = Math.min(W * 0.24, Math.max(60, Math.max(...A.map(x => String(x).length)) * 6.9 + 16)), th = 22, gap = 10, cw = (W - lw - gap * (B.length - 1)) / B.length, ch = (H - th - gap * (A.length - 1)) / A.length, n = end - first + 1; let dots = '';
    let s = "";
    B.forEach((b, j) => { s += '<text x="' + (lw + j * (cw + gap) + cw / 2) + '" y="15" text-anchor="middle" font-size="12.5" font-weight="700" fill="#14161f">' + esc(short(b, 30)) + '</text>'; });
    A.forEach((a, i) => { s += '<text x="' + (lw - 10) + '" y="' + (th + i * (ch + gap) + ch / 2 + 4) + '" text-anchor="end" font-size="12.5" font-weight="700" fill="#14161f">' + esc(short(a, Math.max(6, Math.floor((lw - 14) / 6.9)))) + '</text>'; });
    tiles.forEach(t => { const i = A.indexOf(t.a), j = B.indexOf(t.b), x0 = lw + j * (cw + gap), y0 = th + i * (ch + gap);
      const neg = t.ch !== null && t.ch < 0, sev = t.ch === null ? 0 : Math.min(1, Math.abs(t.ch) / 0.25), bg = t.ch === null ? "#f6f7fa" : neg ? "hsl(358," + Math.round(60 + 30 * sev) + "%," + Math.round(97 - 8 * sev) + "%)" : "hsl(155," + Math.round(40 + 30 * sev) + "%," + Math.round(97 - 7 * sev) + "%)";
      const isW = worst && t === worst && t.ch < 0;
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + cw + '" height="' + ch + '" rx="10" fill="' + bg + '" stroke="' + (isW ? "#E5484D" : "#e6e8ee") + '" stroke-width="' + (isW ? 2.5 : 1) + '"/>';
      const compact = ch < 120, big = compact ? Math.max(14, Math.min(19, ch * 0.3)) : Math.max(15, Math.min(24, ch * 0.16)), chg = t.ch === null ? "–" : (neg ? "▼ " : "▲ +") + Math.abs(t.ch * 100).toFixed(1) + "%";
      const tc = t.ch === null ? "#6b7080" : neg ? "#C8353A" : "#0B8A5E", vals = fmtK(k, t.pv, true) + ' → <tspan font-weight="700" fill="#14161f">' + fmtK(k, t.cv, true) + '</tspan>';
      if (compact) {
        s += '<text x="' + (x0 + 10) + '" y="' + (y0 + 6 + big) + '" font-size="' + big + '" font-weight="800" fill="' + tc + '">' + chg + '</text>' +
          '<text x="' + (x0 + cw - 10) + '" y="' + (y0 + 6 + big * 0.8) + '" text-anchor="end" font-size="11" fill="#6b7080">' + vals + (isW ? ' <tspan font-weight="700" fill="#E5484D">· biggest fall</tspan>' : "") + '</text>';
      } else {
        s += '<text x="' + (x0 + 12) + '" y="' + (y0 + 10 + big) + '" font-size="' + big + '" font-weight="800" fill="' + tc + '">' + chg + '</text>' +
          '<text x="' + (x0 + cw - 12) + '" y="' + (y0 + 10 + big * 0.55) + '" text-anchor="end" font-size="11" fill="#6b7080">' + vals + '</text>';
        if (isW) s += '<text x="' + (x0 + cw - 12) + '" y="' + (y0 + 14 + big) + '" text-anchor="end" font-size="10.5" font-weight="700" fill="#E5484D">BIGGEST FALL</text>';
      }
      // mini daily chart
      const P = compact ? { l: x0 + 10, r: x0 + cw - 10, t: y0 + big + 12, b: y0 + ch - 6 } : { l: x0 + 10, r: x0 + cw - 10, t: y0 + big + 24, b: y0 + ch - 10 }, have = t.daily.filter(v => v !== null);
      if (have.length && P.b - P.t > 8 && P.r - P.l > 40) { const lvl0 = t.pv === null ? null : model.show === "avg" ? t.pv : t.pv / span, mn = Math.min(...have, lvl0 === null ? Infinity : lvl0), mx = Math.max(...have, lvl0 === null ? -Infinity : lvl0), ref = lvl0 || (mn + mx) / 2, lo = Math.min(mn, ref * 0.6), hi = Math.max(mx, ref * 1.4), X = d => P.l + d / Math.max(1, n - 1) * (P.r - P.l), Y = v => P.b - (v - lo) / (hi - lo) * (P.b - P.t);
        s += '<rect x="' + Math.max(P.l, X(cur0 - first - 0.5)) + '" y="' + P.t + '" width="' + Math.max(2, Math.min(P.r, X(last - first + 0.5)) - Math.max(P.l, X(cur0 - first - 0.5))) + '" height="' + (P.b - P.t) + '" fill="#7C5CFF" fill-opacity=".09"/>';
        if (t.pv !== null) { const lvl = model.show === "avg" ? t.pv : t.pv / span; s += '<line x1="' + X(pLo - first) + '" x2="' + P.r + '" y1="' + Y(lvl) + '" y2="' + Y(lvl) + '" stroke="#9aa0ad" stroke-dasharray="4 3"/>'; }
        s += '<path d="' + linePath(t.daily.map((v, d) => X(d)), t.daily.map(v => v === null ? null : Y(v))) + '" fill="none" stroke="' + (neg ? "#C8353A" : "#14161f") + '" stroke-width="1.6" stroke-opacity=".9"/>';
        // a point on every date: hover for the value, click to compare that day
        let pv = null;
        t.daily.forEach((v, d) => { if (v === null || v === undefined) return;
          const key = first + d, isSel = key === last, isPrev = DAY && key === pLo, c = isSel ? (neg ? "#C8353A" : "#14161f") : isPrev ? "#9aa0ad" : "#fff", r = isSel || isPrev ? 4 : Math.max(2.2, Math.min(3.2, (P.r - P.l) / n / 3));
          dots += '<circle data-day="' + key + '" cx="' + X(d) + '" cy="' + Y(v) + '" r="' + r + '" fill="' + c + '" stroke="' + (isSel || isPrev ? "#fff" : neg ? "#C8353A" : "#14161f") + '" stroke-width="1.5" style="cursor:pointer"' +
            T.attr([t.a + " · " + t.b, dayLabel(key) + ": " + fmtK(k, v), pv !== null && pv ? "vs previous day: " + pctTxt(v / pv - 1) : "", isSel ? "Selected day" : "Click to compare this day"]) + '/>';
          dots += '<circle data-day="' + key + '" cx="' + X(d) + '" cy="' + Y(v) + '" r="' + Math.max(7, (P.r - P.l) / n / 2) + '" fill="transparent" style="cursor:pointer"' + T.attr([t.a + " · " + t.b, dayLabel(key) + ": " + fmtK(k, v), pv !== null && pv ? "vs previous day: " + pctTxt(v / pv - 1) : "", isSel ? "Selected day" : "Click to compare this day"]) + '/>';
          pv = v; }); }
      s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + cw + '" height="' + ch + '" fill="transparent"' + T.attr([t.a + " · " + t.b, (DAY ? dayLabel(last) : "Last 7 days") + ": " + fmtK(k, t.cv), (DAY ? dayLabel(prevD) : "Before") + ": " + fmtK(k, t.pv), t.rc !== null ? L.v1 + ": " + pctTxt(t.rc) : "", t.uc !== null && t.cur.u ? L.units + ": " + pctTxt(t.uc) : "", t.ac !== null ? "Per " + L.units.toLowerCase().replace(/s$/, "") + ": " + pctTxt(t.ac) : ""]) + '/>'; });
    svg.innerHTML = s + dots; bindTips(svg, T.tips);
    svg.onclick = e => { const el = e.target.closest && e.target.closest("[data-day]"); if (!el) return; const d = +el.getAttribute("data-day"); state.sel = d === model.end ? null : d; render(); };
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
      const sig = JSON.stringify(d.rows), same = sig === lastSig;
      // a re-read that found nothing new: keep the chart as it is and check less often (30s, 1, 2, 4… up to 5 minutes)
      quiet = same ? Math.min(quiet ? quiet * 2 : 30000, 300000) : 0;
      quietUntil = Date.now() + quiet;
      lastSig = sig;
      if (!same) try { render(); } catch (e) { msg("Chart error: " + e.message); }
      hideLoad();
    } else if (current) { hideLoad(); if (modelDiagMsg) msg(modelDiagMsg); }
    else showLoad("Loading data…", null, "Looking for the grid");
    await wait(400);                     // let the grid settle after scrolling back
    busy = false;
    if (pending) { pending = false; setTimeout(check, 300); }
    return !!d;
  }

  // The chart holds its data and only re-reads the grid when the grid's values really change (a filter or
  // selector), not when the page is resized or the grid redraws. data-refresh="manual" turns automatic
  // re-reading off; "Refresh data" at the bottom of the chart always re-reads on demand.
  const AUTO = (phAttr("data-refresh") || "auto").trim().toLowerCase() !== "manual";
  let quiet = 0, quietUntil = 0, resizedAt = 0, confirmT = null;
  function check(confirmed) {
    if (busy || !current || !AUTO) return;
    if (Date.now() < quietUntil || Date.now() - resizedAt < 2500) return;     // just resized: let the grid settle
    try {
      if (!looksChanged(current)) return;
      // ask again a moment later – a grid half-way through redrawing can look different for an instant
      if (confirmed !== true) { clearTimeout(confirmT); confirmT = setTimeout(() => check(true), 1500); return; }
      fullRefresh();
    } catch (e) {}
  }

  let watching = false;
  function watch() {
    if (watching) return;
    watching = true;
    const rb = document.createElement("button");
    rb.type = "button"; rb.textContent = "\u21bb Refresh data"; rb.title = "Read the grid again";
    rb.style.cssText = "position:absolute;right:14px;bottom:6px;z-index:6;font:11px/1.4 inherit;color:#6b7080;background:rgba(255,255,255,.85);border:0;border-radius:6px;padding:2px 6px;cursor:pointer";
    rb.onclick = () => { quiet = 0; quietUntil = 0; fullRefresh(); };
    wrap.appendChild(rb);
    const sized = () => { resizedAt = Date.now(); };
    window.addEventListener("resize", sized);
    try { new ResizeObserver(sized).observe(wrap); } catch (e) {}
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
    try { lockPage(); } catch (e) {}
    let tries = 0;
    const attempt = async () => {
      if (await fullRefresh()) { watch(); return; }
      if (++tries === (MODEL_ONLY ? 6 : 30)) {
        hideLoad();
        msg(modelDiagMsg || NOT_FOUND);
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
  start();
})();
