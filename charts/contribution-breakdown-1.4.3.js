/*!
 * contribution-breakdown v1.4.3 – HTML-container chart
 * https://viz.kaijxnes.com/
 * Reads a grid on the same page and draws the chart in the viewer's browser.
 * Makes no network requests. No data leaves the page.
 */
(function () {
  /* ================= MOUNT ================= */
  // Builds this chart's layout inside every <div data-chart-embed="contribution-breakdown"> placeholder on the page.
  // Optional: data-title="..." on the placeholder replaces the heading.
  const CHART_ID = "contribution-breakdown";
  const TEMPLATE = "<div class=\"cc-wrap\" data-chart=\"contribution-breakdown\">\n  <style>\n    .cc-wrap {\n      --ink: #14161f; --muted: #6b7080; --line: #eceef3; --chip: #f6f7fa;\n      font-family: \"Inter\", \"Segoe UI\", system-ui, -apple-system, sans-serif;\n      background: #fff; color: var(--ink); box-sizing: border-box;\n      height: 100%; min-height: 560px; padding: 20px 22px 14px;\n      display: flex; flex-direction: column; gap: 14px; border-radius: 14px;\n    }\n    .cc-wrap * { box-sizing: border-box; }\n    .cc-wrap .cc-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }\n    .cc-wrap h2 { margin: 0; font-size: 17px; font-weight: 650; letter-spacing: -0.01em; }\n    .cc-wrap .cc-sub { font-size: 12px; color: var(--muted); margin-top: 3px; display: block; }\n    .cc-wrap .cc-controls { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }\n    .cc-wrap .cc-ctl { display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; }\n    .cc-wrap .cc-seg { display: inline-flex; background: var(--chip); border: 1px solid var(--line); border-radius: 10px; padding: 3px; gap: 2px; }\n    .cc-wrap .cc-seg button {\n      all: unset; cursor: pointer; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 7px;\n      color: var(--muted); text-transform: none; letter-spacing: 0; transition: background .15s, color .15s, box-shadow .15s;\n    }\n    .cc-wrap .cc-seg button:hover { color: var(--ink); }\n    .cc-wrap .cc-seg button.on { background: #fff; color: var(--ink); box-shadow: 0 1px 3px rgba(20,22,31,.14); }\n    .cc-wrap .cc-cards { display: flex; gap: 10px; flex-wrap: wrap; }\n    .cc-wrap .cc-card { flex: 1 1 160px; background: var(--chip); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px 11px; }\n    .cc-wrap .cc-card.hero { background: #14161f; border-color: #14161f; }\n    .cc-wrap .cc-card.hero .lbl, .cc-wrap .cc-card.hero .sub { color: #b8bccb; }\n    .cc-wrap .cc-card.hero .val { color: #fff; }\n    .cc-wrap .cc-card .lbl { font-size: 12px; color: var(--muted); }\n    .cc-wrap .cc-card .val { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\n    .cc-wrap .cc-card .sub { font-size: 11px; color: var(--muted); margin-top: 1px; }\n    .cc-wrap .cc-legend { display: flex; gap: 14px; flex-wrap: wrap; font-size: 12px; color: var(--muted); align-items: center; }\n    .cc-wrap .cc-legend .sw { display: inline-block; width: 11px; height: 11px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }\n    .cc-wrap .cc-legend .ln { display: inline-block; width: 18px; border-top: 2.5px solid #14161f; margin-right: 6px; vertical-align: 3px; }\n    .cc-wrap .cc-body { display: flex; gap: 18px; flex: 1 1 auto; flex-wrap: wrap; min-height: 320px; }\n    .cc-wrap .cc-canvas { position: relative; flex: 3 1 480px; min-height: 320px; }\n    .cc-wrap .cc-rank { flex: 1 1 230px; max-width: 100%; display: flex; flex-direction: column; gap: 4px; }\n    .cc-wrap .cc-rank h3 { margin: 0 0 6px; font-size: 13px; font-weight: 650; }\n    .cc-wrap .cc-list { max-height: 380px; overflow-y: auto; padding-right: 4px; }\n    .cc-wrap .cc-item { padding: 8px 0; border-top: 1px solid var(--line); }\n    .cc-wrap .cc-item .top { display: flex; justify-content: space-between; gap: 8px; font-size: 12.5px; }\n    .cc-wrap .cc-item .name { display: flex; align-items: center; gap: 7px; font-weight: 600; min-width: 0; }\n    .cc-wrap .cc-item .name span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-item .dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }\n    .cc-wrap .cc-item .amt { font-weight: 700; white-space: nowrap; }\n    .cc-wrap .cc-item .bar { height: 6px; background: var(--chip); border-radius: 3px; margin: 6px 0 4px; overflow: hidden; }\n    .cc-wrap .cc-item .bar i { display: block; height: 100%; border-radius: 3px; }\n    .cc-wrap .cc-item .meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); }\n    .cc-wrap { position: relative; }\n    .cc-wrap .cc-filters { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; position: relative; }\n    .cc-wrap .cc-filters .ttl { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .04em; font-weight: 600; margin-right: 2px; }\n    .cc-wrap .cc-fbtn {\n      all: unset; cursor: pointer; font-size: 12px; padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line);\n      background: #fff; color: var(--ink); display: inline-flex; gap: 6px; align-items: center; white-space: nowrap;\n    }\n    .cc-wrap .cc-fbtn b { font-weight: 600; }\n    .cc-wrap .cc-fbtn .chev { color: var(--muted); font-size: 10px; }\n    .cc-wrap .cc-fbtn.on { background: #14161f; border-color: #14161f; color: #fff; }\n    .cc-wrap .cc-fbtn.on .chev { color: #b8bccb; }\n    .cc-wrap .cc-clear { all: unset; cursor: pointer; font-size: 12px; color: #7C5CFF; font-weight: 600; padding: 6px 4px; }\n    .cc-wrap .cc-pop {\n      position: absolute; z-index: 20; top: 100%; margin-top: 6px; width: 290px; background: #fff; border: 1px solid var(--line);\n      border-radius: 12px; box-shadow: 0 12px 32px rgba(20,22,31,.16); padding: 8px; font-size: 12.5px;\n    }\n    .cc-wrap .cc-pop input[type=text] {\n      width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 7px 9px; font: inherit; margin-bottom: 6px; outline: none;\n    }\n    .cc-wrap .cc-pop .opts { max-height: 250px; overflow-y: auto; }\n    .cc-wrap .cc-pop label { display: flex; align-items: center; gap: 8px; padding: 6px 6px; border-radius: 7px; cursor: pointer; }\n    .cc-wrap .cc-pop label:hover { background: var(--chip); }\n    .cc-wrap .cc-pop label span.n { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n    .cc-wrap .cc-pop label span.a { color: var(--muted); font-size: 11.5px; }\n    .cc-wrap .cc-pop input[type=checkbox] { accent-color: #7C5CFF; margin: 0; }\n    .cc-wrap .cc-pop .foot { display: flex; justify-content: space-between; border-top: 1px solid var(--line); margin-top: 6px; padding-top: 6px; }\n    .cc-wrap .cc-pop .foot button { all: unset; cursor: pointer; font-size: 12px; font-weight: 600; color: #7C5CFF; padding: 4px 6px; }\n    .cc-wrap .cc-card .delta { font-weight: 600; }\n    .cc-wrap .cc-load {\n      position: absolute; inset: 0; z-index: 30; display: none; align-items: center; justify-content: center;\n      background: rgba(255,255,255,.94); border-radius: 14px;\n    }\n    .cc-wrap .cc-load.show { display: flex; }\n    .cc-wrap .cc-load .box { width: min(340px, 80%); text-align: center; }\n    .cc-wrap .cc-load .spin {\n      width: 34px; height: 34px; margin: 0 auto 14px; border-radius: 50%;\n      border: 3px solid #eceef3; border-top-color: #7C5CFF; animation: ccSpin .8s linear infinite;\n    }\n    .cc-wrap .cc-load .t { font-size: 14px; font-weight: 650; }\n    .cc-wrap .cc-load .bar { height: 6px; background: #eceef3; border-radius: 3px; margin: 12px 0 8px; overflow: hidden; position: relative; }\n    .cc-wrap .cc-load .bar i { position: absolute; left: 0; top: 0; bottom: 0; width: 0; background: #7C5CFF; border-radius: 3px; transition: width .25s; }\n    .cc-wrap .cc-load .bar.indet i { width: 30%; animation: ccSlide 1.1s ease-in-out infinite; }\n    .cc-wrap .cc-load .n { font-size: 12px; color: var(--muted); min-height: 16px; }\n    @keyframes ccSpin { to { transform: rotate(360deg); } }\n    @keyframes ccSlide { 0% { left: -30%; } 100% { left: 100%; } }\n    .cc-wrap .cc-msg { font-size: 12px; color: #c2410c; white-space: pre-wrap; }\n  \n    .cc-wrap .cc-card .val .nm { font-size: 17px; }\n    .cc-wrap .cb-body { display: flex; gap: 18px; flex: 1 1 auto; min-height: 0; flex-wrap: wrap; }\n    .cc-wrap .cb-chart { position: relative; flex: 3 1 460px; min-width: 0; min-height: 260px; }\n    .cc-wrap .cb-chart svg { position: absolute; inset: 0; display: block; }\n    .cc-wrap .cb-chart svg text { font-family: inherit; }\n    .cc-wrap .cb-rank { flex: 1 1 220px; min-width: 0; display: flex; flex-direction: column; min-height: 0; max-height: 100%; }\n    .cc-wrap .cb-rank h3 { margin: 0 0 6px; font-size: 13px; font-weight: 650; }\n    .cc-wrap .cb-list { overflow-y: auto; min-height: 0; padding-right: 4px; max-height: 420px; }\n    .cc-wrap .cb-tip { position: absolute; z-index: 25; display: none; pointer-events: none; background: #14161f; color: #fff; font-size: 12px; line-height: 1.45; padding: 8px 10px; border-radius: 9px; max-width: 260px; }\n  </style>\n\n  <div class=\"cc-head\">\n    <div>\n      <h2>Contribution Breakdown</h2>\n      <span class=\"cc-sub\">Looking for the grid\u2026</span>\n    </div>\n    <div class=\"cc-controls\">\n      <div class=\"cc-ctl\">Show <div class=\"cc-seg\" data-ctl=\"show\"></div></div>\n      <div class=\"cc-ctl\">Value <div class=\"cc-seg\" data-ctl=\"p\"></div></div>\n      <div class=\"cc-ctl\">Split by <div class=\"cc-seg\" data-ctl=\"split\"></div></div>\n      <div class=\"cc-ctl\">Bars <div class=\"cc-seg\" data-ctl=\"mode\"></div></div>\n    </div>\n  </div>\n  <div class=\"cc-cards\"></div>\n  <div class=\"cc-legend\"></div>\n  <div class=\"cb-body\">\n    <div class=\"cb-chart\"><svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Bar chart\"></svg></div>\n    <div class=\"cb-rank\"><h3></h3><div class=\"cb-list\"></div></div>\n  </div>\n  <div class=\"cc-msg\"></div>\n  <div class=\"cb-tip\"></div>\n  <details class=\"cc-dbg\" style=\"font-size:11px;color:#6b7080\"><summary style=\"cursor:pointer\">Read details</summary>\n    <button type=\"button\" style=\"font-size:11px;margin:6px 0;padding:3px 8px;border:1px solid #eceef3;border-radius:6px;background:#fff;cursor:pointer\"\n      onclick=\"var p=this.parentNode.querySelector('pre');try{navigator.clipboard.writeText(p.textContent)}catch(e){};var r=document.createRange();r.selectNodeContents(p);var s=getSelection();s.removeAllRanges();s.addRange(r);\">Copy</button>\n    <pre style=\"white-space:pre-wrap;margin:0;font:11px/1.45 Consolas,monospace;max-height:220px;overflow:auto;background:#f6f7fa;padding:8px;border-radius:8px\"></pre></details>\n  <div class=\"cc-load\"><div class=\"box\"><div class=\"spin\"></div><div class=\"t\">Loading data\u2026</div>\n    <div class=\"bar indet\"><i></i></div><div class=\"n\">Looking for the grid</div></div></div>\n</div>";
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
    dimA: "Dimension A", dimB: "Dimension B", dimC: "Dimension C",
    units: "Units",
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
  const COLS = Object.keys(COLUMN_NAMES).map(id => ({ id, attr: ["dimA", "dimB", "dimC"].includes(id), test: t => t === cmp(COLNAMES[id]) }));
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
    const free = Array.from(document.querySelectorAll('.cc-wrap[data-chart="contribution-breakdown"]'))
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
  let current = null, lastSig = "";

  function kind(key) {
    const txt = current.rows.map(r => (r.raw && r.raw["v" + key]) || "").join(" ");
    if (/%/.test(txt)) return "pct";
    const cur = txt.match(/[$£€]/);
    return cur ? cur[0] : "count";
  }
  function fmtK(k, v, short) {
    if (v === null || v === undefined || isNaN(v)) return "–";
    if (k === "pct") return v.toFixed(Math.abs(v) >= 10 ? 1 : 2) + "%";
    if (k === "count") return short && Math.abs(v) >= 1e4 ? moneyShort(v).replace("$", "") : count(v);
    const s = short || Math.abs(v) >= 1e5 ? (Math.abs(v) >= 1000 ? moneyShort(v) : money(v, 0)) : money(v, Math.abs(v) < 1000 ? 2 : 0);
    return s.replace("$", k);
  }
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
  const PALETTE = ["#7C5CFF", "#12A594", "#F59E0B", "#3B82F6", "#EC4899", "#84CC16", "#0EA5E9"];
  const OTHER = "#B8BCCB";
  const MAX_PARTS = 7;
  const state = { p: null, show: "value", split: null, mode: "abs" };
  let ro = null;
  function buildControls() {
    try { ro = new ResizeObserver(() => { if (current) drawChart(); }); ro.observe($(".cb-chart")); } catch (e) {}
  }

  // totals for a set of rows: units, total value (value per unit × units) and value per unit weighted by units
  function stats(rows, pk) {
    let u = 0, val = 0, wu = 0, sum = 0, n = 0;
    rows.forEach(r => {
      const v = r.v[pk];
      if (r.units !== null) u += r.units;
      if (v === null) return;
      if (r.units !== null && r.units > 0) { val += v * r.units; wu += r.units; }
      sum += v; n++;
    });
    return { units: u, val, vpu: wu ? val / wu : n ? sum / n : null };
  }

  let model = null;
  function render() {
    const rows = current.rows;
    const avail = PERIODS.filter(p => rows.some(r => r.v[p.key] !== null));
    if (!avail.length) { msg("No metric values found under the column headers." + dateHint()); return; }
    if (!avail.some(p => p.key === state.p)) state.p = avail[0].key;
    const hasU = current.hasUnits;
    const splits = ["dimB", "dimC"].filter(d => rows.some(r => r[d]));
    if (state.split !== "none" && !splits.includes(state.split)) state.split = splits[0] || "none";
    if (!hasU) state.show = "vpu";
    const shows = hasU ? [{ key: "value", name: "Total value" }, { key: "units", name: L.units }, { key: "vpu", name: "Value / " + unitName() }] : [{ key: "vpu", name: "Value" }];
    segButtons('[data-ctl="show"]', shows, state.show, k => { state.show = k; render(); });
    $('[data-ctl="show"]').parentElement.style.display = shows.length > 1 ? "" : "none";
    segButtons('[data-ctl="p"]', avail.map(p => ({ key: p.key, name: p.name })), state.p, k => { state.p = k; render(); });
    $('[data-ctl="p"]').parentElement.style.display = avail.length > 1 && state.show !== "units" ? "" : "none";
    segButtons('[data-ctl="split"]', splits.map(d => ({ key: d, name: L[d] })).concat([{ key: "none", name: "None" }]), state.split, k => { state.split = k; render(); });
    $('[data-ctl="split"]').parentElement.style.display = splits.length ? "" : "none";
    segButtons('[data-ctl="mode"]', [{ key: "abs", name: "Totals" }, { key: "mix", name: "Mix %" }], state.mode, k => { state.mode = k; render(); });
    $('[data-ctl="mode"]').parentElement.style.display = state.show !== "vpu" && state.split !== "none" ? "" : "none";

    const pk = state.p, k = kind(pk), sd = state.split === "none" ? null : state.split;
    const metric = st => state.show === "value" ? st.val : state.show === "units" ? st.units : st.vpu;
    const all = stats(rows, pk);
    // split parts: the biggest by total value (or units), the rest as Other
    let parts = [];
    if (sd) {
      const pm = new Map();
      rows.forEach(r => { const p = r[sd] || "(blank)"; if (!pm.has(p)) pm.set(p, []); pm.get(p).push(r); });
      parts = Array.from(pm.entries()).map(([name, rs]) => ({ name, st: stats(rs, pk) }))
        .sort((a, b) => (hasU ? b.st.val - a.st.val || b.st.units - a.st.units : (b.st.vpu || 0) - (a.st.vpu || 0)));
      if (parts.length > MAX_PARTS) {
        const keep = parts.slice(0, MAX_PARTS - 1).map(p => p.name), rest = rows.filter(r => !keep.includes(r[sd] || "(blank)"));
        parts = parts.slice(0, MAX_PARTS - 1).concat([{ name: "Other", other: true, st: stats(rest, pk) }]);
      }
      parts.forEach((p, i) => { p.col = p.other ? OTHER : PALETTE[i % PALETTE.length]; });
    }
    const partOf = r => { if (!sd) return null; const n = r[sd] || "(blank)"; return parts.find(p => p.name === n) || parts.find(p => p.other); };
    const bm = new Map();
    rows.forEach(r => { const b = r.dimA || "(blank)"; if (!bm.has(b)) bm.set(b, []); bm.get(b).push(r); });
    const bars = Array.from(bm.entries()).map(([name, rs]) => ({
      name, st: stats(rs, pk),
      parts: sd ? parts.map(p => ({ p, st: stats(rs.filter(r => partOf(r) === p), pk) })) : []
    })).sort((a, b) => (metric(b.st) || 0) - (metric(a.st) || 0));
    model = { bars, parts, sd, pk, k, all, metric, hasU };

    // cards
    const un = unitName();
    const biggest = hasU ? bars.slice().sort((a, b) => b.st.val - a.st.val)[0] : null;
    const bestV = bars.filter(b => b.st.vpu !== null).sort((a, b) => b.st.vpu - a.st.vpu)[0];
    const topPart = sd && parts.length ? parts.filter(p => !p.other)[0] : null;
    const card = (lbl, val, sub, cls) => '<div class="cc-card' + (cls || "") + '"><div class="lbl">' + lbl + '</div><div class="val">' + val + '</div><div class="sub">' + sub + '</div></div>';
    $(".cc-cards").innerHTML =
      (hasU ? card("Total value (" + esc(L["v" + pk]) + ")", fmtK(k, all.val, true), count(all.units) + " " + esc(L.units).toLowerCase() + " × " + fmtK(k, all.vpu) + " per " + esc(un), " hero")
            : card(esc(L["v" + pk]), fmtK(k, all.vpu), "average of the rows", " hero")) +
      (biggest ? card("Biggest " + esc(L.dimA).toLowerCase(), '<span class="nm">' + esc(biggest.name) + '</span>', (all.val ? Math.round(biggest.st.val / all.val * 100) : 0) + "% of total value") : "") +
      (bestV ? card("Highest value per " + esc(un), '<span class="nm">' + esc(bestV.name) + '</span>', fmtK(k, bestV.st.vpu) + (all.vpu ? " vs " + fmtK(k, all.vpu) + " overall" : "")) : "") +
      (topPart && hasU ? card("Top " + esc(L[sd]).toLowerCase(), '<span class="nm">' + esc(topPart.name) + '</span>', (all.val ? Math.round(topPart.st.val / all.val * 100) : 0) + "% of total value") : "");

    $(".cc-legend").innerHTML = (state.show === "vpu" && sd ? '<span><i class="sw" style="background:#e3dcff"></i>' + esc(L.dimA) + ' overall</span>' : "") +
      (sd ? parts.map(p => '<span><i class="sw" style="background:' + p.col + '"></i>' + esc(p.name) + '</span>').join("") : "");
    const what = state.show === "value" ? L.units + " × " + L["v" + pk] : state.show === "units" ? L.units : L["v" + pk] + (hasU ? " per " + un + " (weighted)" : "");
    $(".cc-sub").textContent = what + " by " + L.dimA + (sd ? ", split by " + L[sd] : "") + " · " + bars.length + " bars · " + rows.length + " grid rows";

    // ranked list
    const mx = Math.max(...bars.map(b => metric(b.st) || 0)) || 1;
    const fm = v => state.show === "units" ? count(v) : fmtK(k, v, state.show === "value");
    $(".cb-rank h3").textContent = esc(L.dimA) + " by " + (state.show === "value" ? "total value" : state.show === "units" ? L.units.toLowerCase() : "value per " + un);
    $(".cb-list").innerHTML = bars.map(b => '<div class="cc-item"><div class="top"><span class="name"><span>' + esc(b.name) + '</span></span><span class="amt">' + fm(metric(b.st)) + '</span></div>' +
      '<div class="bar"><i style="width:' + Math.max(0, (metric(b.st) || 0) / mx * 100).toFixed(1) + '%;background:#7C5CFF"></i></div>' +
      '<div class="meta"><span>' + (hasU ? count(b.st.units) + " " + esc(L.units).toLowerCase() : "") + '</span><span>' + fmtK(k, b.st.vpu) + ' / ' + esc(un) + '</span></div></div>').join("");
    msg("");
    drawChart();
  }
  function unitName() { const u = (L.units || "unit").toLowerCase(); return u.replace(/ies$/, "y").replace(/s$/, ""); }

  const NS = "http://www.w3.org/2000/svg";
  function drawChart() {
    if (!model) return;
    const box = $(".cb-chart"), svg = $(".cb-chart svg"), tip = $(".cb-tip");
    const W = Math.max(280, box.clientWidth), H = Math.max(220, box.clientHeight);
    svg.setAttribute("viewBox", "0 0 " + W + " " + H); svg.setAttribute("width", W); svg.setAttribute("height", H);
    const { bars, sd, k, metric } = model, mix = state.mode === "mix" && state.show !== "vpu" && sd;
    const P = { l: 58, r: 8, t: 22, b: 30 };
    const fm = v => state.show === "units" ? (Math.abs(v) >= 1e4 ? moneyShort(v).replace("$", "") : count(v)) : fmtK(k, v, true);
    let mx;
    if (state.show === "vpu") mx = Math.max(...bars.map(b => Math.max(b.st.vpu || 0, ...b.parts.map(p => p.st.units ? p.st.vpu || 0 : 0)))) * 1.12;
    else mx = mix ? 1 : Math.max(...bars.map(b => metric(b.st) || 0)) * 1.1;
    mx = mx || 1;
    if (!mix) {                                  // tidy axis: 4 equal steps of a round number
      const st = mx / 4, p10 = Math.pow(10, Math.floor(Math.log10(st))), f = st / p10;
      mx = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find(x => f <= x + 1e-9) * p10 * 4;
    }
    const bw = (W - P.l - P.r) / Math.max(1, bars.length), Y = v => H - P.b - v / mx * (H - P.t - P.b);
    let s = "";
    for (let g = 0; g <= 4; g++) {
      const gv = mx * g / 4;
      s += '<line x1="' + P.l + '" x2="' + (W - P.r) + '" y1="' + Y(gv) + '" y2="' + Y(gv) + '" stroke="#f1f2f6"/>' +
        '<text x="' + (P.l - 8) + '" y="' + (Y(gv) + 4) + '" text-anchor="end" font-size="11" fill="#6b7080">' + (mix ? Math.round(gv * 100) + "%" : fm(gv)) + '</text>';
    }
    const tips = [];
    const tipAttr = lines => { tips.push(lines); return ' data-tip="' + (tips.length - 1) + '"'; };
    const maxLbl = Math.max(3, Math.floor(bw / 7));
    bars.forEach((b, i) => {
      const x = P.l + bw * i + bw * 0.16, w = bw * 0.68;
      const nm = b.name.length > maxLbl ? b.name.slice(0, maxLbl - 1) + "…" : b.name;
      s += '<text x="' + (x + w / 2) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="11.5" font-weight="600" fill="#14161f">' + esc(nm) + '<title>' + esc(b.name) + '</title></text>';
      if (state.show === "vpu") {
        const v = b.st.vpu || 0;
        s += '<rect x="' + x + '" y="' + Y(v) + '" width="' + w + '" height="' + Math.max(0, H - P.b - Y(v)) + '" rx="5" fill="#7C5CFF" opacity=".16"' + tipAttr([b.name, fmtK(k, v) + " per " + unitName(), model.hasU ? count(b.st.units) + " " + L.units.toLowerCase() : ""]) + '/>' +
          '<line x1="' + x + '" x2="' + (x + w) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#7C5CFF" stroke-width="3"/>' +
          "";
        const ps = b.parts.filter(p => p.st.vpu !== null && p.st.units !== 0);
        const topY = Math.min(Y(v), ...ps.map(p => Y(p.st.vpu) - 6));     // label above the bar and its dots
        s += '<text x="' + (x + w / 2) + '" y="' + (topY - 7) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#14161f">' + fmtK(k, v) + '</text>';
        ps.forEach((p, j) => {
          const cx = x + w * (j + 0.5) / ps.length;
          s += '<circle cx="' + cx + '" cy="' + Y(p.st.vpu) + '" r="5.5" fill="' + p.p.col + '" stroke="#fff" stroke-width="1.5"' +
            tipAttr([b.name + " · " + p.p.name, fmtK(k, p.st.vpu) + " per " + unitName(), model.hasU ? count(p.st.units) + " " + L.units.toLowerCase() : ""]) + '/>';
        });
        return;
      }
      const tot = metric(b.st) || 0;
      if (!sd) {
        s += '<rect x="' + x + '" y="' + Y(tot) + '" width="' + w + '" height="' + Math.max(0, H - P.b - Y(tot)) + '" rx="4" fill="#7C5CFF"' + tipAttr([b.name, fm(tot), fmtK(k, b.st.vpu) + " per " + unitName()]) + '/>';
      } else {
        let y0 = H - P.b;
        b.parts.forEach(p => {
          const raw = metric(p.st) || 0, v = mix ? (tot ? raw / tot : 0) : raw, h = v / mx * (H - P.t - P.b);
          if (h <= 0) return;
          s += '<rect x="' + x + '" y="' + (y0 - h) + '" width="' + w + '" height="' + Math.max(0, h - 1) + '" fill="' + p.p.col + '"' +
            tipAttr([b.name + " · " + p.p.name, (state.show === "units" ? count(raw) + " " + L.units.toLowerCase() : fmtK(k, raw) + " total value"),
                     (tot ? (raw / tot * 100).toFixed(1) + "% of " + b.name : ""), fmtK(k, p.st.vpu) + " per " + unitName()]) + '/>';
          y0 -= h;
        });
      }
      if (!mix) s += '<text x="' + (x + w / 2) + '" y="' + (Y(tot) - 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#14161f">' + fm(tot) + '</text>';
    });
    svg.innerHTML = s;
    svg.querySelectorAll("[data-tip]").forEach(el => {
      el.style.cursor = "pointer";
      el.addEventListener("mousemove", e => {
        const t = tips[+el.getAttribute("data-tip")].filter(Boolean), r = wrap.getBoundingClientRect();
        tip.innerHTML = "<b>" + esc(t[0]) + "</b><br>" + t.slice(1).map(esc).join("<br>");
        tip.style.display = "block";
        const tx = Math.min(e.clientX - r.left + 14, r.width - tip.offsetWidth - 6);
        tip.style.left = tx + "px"; tip.style.top = (e.clientY - r.top + 12) + "px";
      });
      el.addEventListener("mouseleave", () => { tip.style.display = "none"; });
    });
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
  start();
})();
