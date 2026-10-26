// Home page demo: an editable grid and a chart that follows it.
// Type in the grid or drag a bar; switch between bars, line and area; shuffle for new numbers.
(function () {
  var root = document.querySelector("[data-live]");
  if (!root) return;
  var svg = root.querySelector("[data-live-svg]");
  var rowsEl = root.querySelector("[data-live-rows]");
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var keys = ["202603", "202604", "202605", "202606", "202607", "202608", "202609"];
  var labels = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  var target = [41200, 47950, 44300, 58120, 62480, 60010, 71640];
  var shown = target.map(function () { return 0; });
  var mode = "bars", hover = -1, drag = -1;
  var W = 400, H = 300, P = { l: 44, r: 12, t: 26, b: 28 };
  var VIOLET = "#6D4AFF", TEAL = "#0F9D8A", INK = "#1B2238", MUTED = "#6A7290", RULE = "#E3E7F0";

  var money = function (v) { return "$" + Math.round(v).toLocaleString("en-US"); };
  var short = function (v) { return v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : v >= 1e3 ? "$" + Math.round(v / 1e3) + "K" : "$" + Math.round(v); };
  var el = function (tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); (parent || svg).appendChild(e); return e; };

  // ---------- grid
  rowsEl.innerHTML = keys.map(function (k, i) {
    return '<tr data-i="' + i + '"><td>' + k + '</td><td><input type="text" inputmode="numeric" aria-label="Metric 1 for ' + k + '" data-i="' + i + '"></td></tr>';
  }).join("");
  var inputs = Array.prototype.slice.call(rowsEl.querySelectorAll("input"));
  var trs = Array.prototype.slice.call(rowsEl.querySelectorAll("tr"));
  function syncInputs(except) {
    inputs.forEach(function (inp, i) { if (inp !== except) inp.value = money(target[i]); });
  }
  inputs.forEach(function (inp, i) {
    inp.addEventListener("input", function () {
      var v = Number(inp.value.replace(/[^0-9.]/g, ""));
      if (!isNaN(v) && inp.value.trim() !== "") { target[i] = Math.min(v, 999999); animate(); }
    });
    inp.addEventListener("blur", function () { syncInputs(); });
    inp.addEventListener("focus", function () { setHover(i); inp.select(); });
  });
  trs.forEach(function (tr, i) {
    tr.addEventListener("mouseenter", function () { setHover(i); });
    tr.addEventListener("mouseleave", function () { setHover(-1); });
  });
  function setHover(i) {
    hover = i;
    trs.forEach(function (tr, j) { tr.classList.toggle("on", j === i); });
    draw();
  }

  // ---------- scale and drawing
  function scaleMax() {          // round the axis to 4 tidy steps (1, 2, 2.5, 5 × 10ⁿ)
    var step = Math.max.apply(null, target.concat(shown)) * 1.12 / 4;
    var p = Math.pow(10, Math.floor(Math.log10(Math.max(step, 1)))), f = step / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p * 4;
  }
  var max = scaleMax();
  var X = function (i) { var w = (W - P.l - P.r) / keys.length; return P.l + w * i + w / 2; };
  var Y = function (v) { return H - P.b - (v / max) * (H - P.t - P.b); };

  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = el("defs", {});
    var g = el("linearGradient", { id: "liveFill", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0%", "stop-color": VIOLET, "stop-opacity": 0.35 }, g);
    el("stop", { offset: "100%", "stop-color": VIOLET, "stop-opacity": 0.02 }, g);
    var gb = el("linearGradient", { id: "liveBar", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0%", "stop-color": "#8B6FFF" }, gb);
    el("stop", { offset: "100%", "stop-color": VIOLET }, gb);

    // gridlines
    for (var t = 0; t <= 4; t++) {
      var v = max * t / 4, y = Y(v);
      el("line", { x1: P.l, x2: W - P.r, y1: y, y2: y, stroke: RULE, "stroke-width": 1 });
      var lab = el("text", { x: P.l - 8, y: y + 4, "text-anchor": "end", "font-size": 10.5, fill: MUTED });
      lab.textContent = short(v);
    }
    labels.forEach(function (m, i) {
      var tx = el("text", { x: X(i), y: H - 9, "text-anchor": "middle", "font-size": 11, fill: i === hover ? INK : MUTED, "font-weight": i === hover ? 700 : 400 });
      tx.textContent = m;
    });

    // average line
    var avg = shown.reduce(function (a, b) { return a + b; }, 0) / shown.length;
    el("line", { x1: P.l, x2: W - P.r, y1: Y(avg), y2: Y(avg), stroke: INK, "stroke-width": 1.2, "stroke-dasharray": "4 4", opacity: 0.55 });
    var al = el("text", { x: P.l + 4, y: Y(avg) - 6, "text-anchor": "start", "font-size": 10.5, "font-weight": 700, fill: INK,
      stroke: "#fff", "stroke-width": 4, "paint-order": "stroke", "stroke-linejoin": "round" });
    al.textContent = "avg " + short(avg);

    var best = shown.indexOf(Math.max.apply(null, shown));
    var bw = (W - P.l - P.r) / keys.length * 0.56;
    if (mode === "bars") {
      shown.forEach(function (v, i) {
        var y = Y(v), h = H - P.b - y;
        var r = el("rect", { x: X(i) - bw / 2, y: y, width: bw, height: Math.max(0, h), rx: 6,
          fill: i === best ? TEAL : "url(#liveBar)", opacity: hover === -1 || hover === i ? 1 : 0.45, "data-i": i, class: "bar" });
        r.style.cursor = "ns-resize";
      });
    } else {
      var pts = shown.map(function (v, i) { return [X(i), Y(v)]; });
      var d = pts.map(function (p, i) {
        if (!i) return "M" + p[0] + "," + p[1];
        var q = pts[i - 1], cx = (q[0] + p[0]) / 2;
        return "C" + cx + "," + q[1] + " " + cx + "," + p[1] + " " + p[0] + "," + p[1];
      }).join(" ");
      if (mode === "area") el("path", { d: d + " L" + pts[pts.length - 1][0] + "," + (H - P.b) + " L" + pts[0][0] + "," + (H - P.b) + " Z", fill: "url(#liveFill)" });
      el("path", { d: d, fill: "none", stroke: VIOLET, "stroke-width": 3, "stroke-linecap": "round" });
      pts.forEach(function (p, i) {
        el("circle", { cx: p[0], cy: p[1], r: i === hover ? 7 : 5, fill: i === best ? TEAL : "#fff", stroke: i === best ? TEAL : VIOLET, "stroke-width": 2.5, "data-i": i, class: "bar" }).style.cursor = "ns-resize";
      });
    }
    // hit areas for hover and drag (whole column)
    shown.forEach(function (v, i) {
      var w = (W - P.l - P.r) / keys.length;
      el("rect", { x: P.l + w * i, y: P.t - 20, width: w, height: H - P.t - P.b + 20, fill: "transparent", "data-i": i, class: "hit" }).style.cursor = "ns-resize";
    });
    // value tag
    var tagI = drag > -1 ? drag : hover;
    if (tagI > -1) {
      var tv = shown[tagI], tx = X(tagI), ty = Y(tv) - 12, txt = money(tv), tw = txt.length * 6.6 + 14;
      var bx = Math.min(Math.max(tx - tw / 2, P.l), W - P.r - tw);
      el("rect", { x: bx, y: ty - 17, width: tw, height: 20, rx: 6, fill: INK });
      var tt = el("text", { x: bx + tw / 2, y: ty - 3, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, fill: "#fff" });
      tt.textContent = txt;
    }
    // KPIs
    var total = target.reduce(function (a, b) { return a + b; }, 0);
    root.querySelector("[data-live-total]").textContent = money(total);
    var ch = target[6] / target[5] - 1;
    var de = root.querySelector("[data-live-delta]");
    de.textContent = (ch >= 0 ? "▲ +" : "▼ ") + (ch * 100).toFixed(1) + "% Sep vs Aug";
    de.className = ch >= 0 ? "up" : "down";
  }

  // ---------- animation: ease shown values towards the grid
  var raf = null;
  function animate() {
    var newMax = scaleMax();
    if (reduce) { shown = target.slice(); max = newMax; draw(); return; }
    var from = shown.slice(), fromMax = max, t0 = null, dur = 520;
    cancelAnimationFrame(raf);
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      shown = from.map(function (v, i) { return v + (target[i] - v) * e; });
      max = fromMax + (newMax - fromMax) * e;
      draw();
      if (k < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }

  // ---------- drag a bar or point to change its value
  function valueAt(evt) {
    var r = svg.getBoundingClientRect(), y = (evt.clientY - r.top) * (H / r.height);
    return Math.max(0, Math.min(max * 0.98, (H - P.b - y) / (H - P.t - P.b) * max));
  }
  svg.addEventListener("pointerdown", function (e) {
    var i = e.target.getAttribute && e.target.getAttribute("data-i");
    if (i === null || i === undefined) return;
    drag = Number(i); svg.setPointerCapture(e.pointerId); e.preventDefault();
    target[drag] = Math.round(valueAt(e) / 10) * 10; shown[drag] = target[drag];
    syncInputs(); setHover(drag);
  });
  svg.addEventListener("pointermove", function (e) {
    if (drag > -1) {
      target[drag] = Math.round(valueAt(e) / 10) * 10; shown[drag] = target[drag];
      syncInputs(); draw();
    } else {
      var i = e.target.getAttribute && e.target.getAttribute("data-i");
      var n = i === null || i === undefined ? -1 : Number(i);
      if (n !== hover) setHover(n);
    }
  });
  function endDrag() { if (drag > -1) { drag = -1; animate(); } }
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);
  svg.addEventListener("pointerleave", function () { if (drag === -1) setHover(-1); });

  // ---------- chart type and shuffle
  root.querySelectorAll("[data-mode]").forEach(function (b) {
    b.addEventListener("click", function () {
      mode = b.getAttribute("data-mode");
      root.querySelectorAll("[data-mode]").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      shown = shown.map(function () { return 0; }); animate();
    });
  });
  root.querySelector("[data-live-shuffle]").addEventListener("click", function () {
    var base = 30000 + Math.random() * 40000, g = -0.03 + Math.random() * 0.1;
    target = target.map(function (_, i) { return Math.round(base * Math.pow(1 + g, i) * (0.8 + Math.random() * 0.4) / 10) * 10; });
    syncInputs(); animate();
  });

  syncInputs();
  draw();
  // grow in once, when the demo first comes into view
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); animate(); } }, { threshold: 0.3 });
    io.observe(root);
  } else { animate(); }
})();
