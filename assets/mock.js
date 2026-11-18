// Demo grids for the chart pages. Every value is random and regenerated on each load or "Shuffle data" click.
// Nothing here is real data – it only exists so the charts have something to read.
(function () {
  var R = function (a, b) { return a + Math.random() * (b - a); };
  var RI = function (a, b) { return Math.round(R(a, b)); };
  var noise = function (x) { return 1 + R(-x, x); };
  var money = function (v) { return "$" + Math.round(v).toLocaleString("en-US"); };
  var money2 = function (v) { return "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var count = function (v) { return Math.round(v).toLocaleString("en-US"); };
  var pct = function (v) { return v.toFixed(2) + "%"; };

  // month keys, newest first (e.g. 202609, 202608, …)
  function keys(n) {
    var out = [], y = 2026, m = 9;
    for (var i = 0; i < n; i++) { out.push(String(y) + (m < 10 ? "0" : "") + m); if (--m === 0) { m = 12; y--; } }
    return out;
  }

  var GEN = {
    "monthly-bars": function () {
      var hd = ["Month Index", "Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 1 Avg", "Metric 2 Avg", "Metric 3 Avg", "Units"];
      var ks = keys(12), base = R(30, 90), trend = R(-0.03, 0.04), low = RI(6, 11), rows = [];
      ks.forEach(function (k, i) {
        var v1 = base * Math.pow(1 + trend, 11 - i) * noise(0.18), v2 = v1 * R(1.1, 1.3), v3 = v2 * R(1.1, 1.3);
        rows.push({ k: k, i: i, v: [v1, v2, v3], c: i === low ? RI(180, 560) : RI(800, 4500) });
      });
      var avg = [0, 1, 2].map(function (j) { var s = 0; for (var i = 0; i < 6; i++) s += rows[i].v[j]; return s / 6; });
      return { hd: hd, num: [2, 3, 4, 5, 6, 7, 8], rows: rows.map(function (r) {
        return [String(r.i), r.k, money(r.v[0]), money(r.v[1]), money(r.v[2])]
          .concat(r.i < 6 ? avg.map(money) : ["", "", ""]).concat([count(r.c)]);
      }) };
    },

    "stacked-segments": function () {
      var hd = ["Month Index", "Dimension C", "Dimension A", "Dimension B", "Month Key", "Metric 1", "Metric 2", "Metric 3", "Units"];
      var A = ["A1", "A2", "A3", "A4"], B = ["B1", "B2", "B3"], C = ["C1", "C2", "C3"];
      var w = {}; A.concat(B, C).forEach(function (x) { w[x] = R(0.4, 1.6); });
      var rows = [];
      keys(12).forEach(function (k, t) {
        var season = noise(0.15);
        C.forEach(function (c, ci) { A.forEach(function (a, ai) { B.forEach(function (b, bi) {
          var v = R(20, 160) * w[b], n = RI(20, 900) * w[a] * w[c] * season;
          rows.push([(ci + ai + bi) ? "" : String(t), (ai + bi) ? "" : c, bi ? "" : a, b, k,
                     money(v), money(v * R(1.1, 1.3)), money(v * R(1.35, 1.7)), count(n)]);
        }); }); });
      });
      return { hd: hd, num: [5, 6, 7, 8], rows: rows };
    },

    "segment-breakdown": function () {
      var hd = ["Month Key", "Dimension C", "Month Index", "Dimension A", "Units", "Metric 1"];
      var A = ["A1", "A2", "A3", "A4", "A5"], C = ["C1", "C2", "C3", "C4"];
      var w = {}; A.concat(C).forEach(function (x) { w[x] = R(0.4, 1.6); });
      var rows = [];
      keys(12).forEach(function (k, t) {
        C.forEach(function (c, ci) { A.forEach(function (a, ai) {
          rows.push([(ci + ai) ? "" : k, ai ? "" : c, (ci + ai) ? "" : String(t), a,
                     count(RI(30, 1200) * w[a] * w[c]), money(R(15, 140) * w[a])]);
        }); });
      });
      return { hd: hd, num: [4, 5], rows: rows };
    },

    "cost-vs-return": function () {
      var hd = ["Month Index", "Month Key", "Units", "Metric 1", "Cost"];
      var rows = [], eff = R(0.45, 0.85);
      for (var t = -2; t < 0; t++) rows.push([String(t), "", "", "$0", money2(R(2000, 20000))]);     // no month key: left out
      keys(12).forEach(function (k, t) {
        var n = RI(300, 3000), v = R(20, 90), cost = n * v * eff * R(0.55, 1.35);
        rows.push([String(t), k, count(n), money(v), money2(cost)]);
      });
      rows.push(["12", "", "", "$0", money2(R(2000, 20000))]);
      return { hd: hd, num: [2, 3, 4], rows: rows };
    },

    "month-heatmap": function () {
      var hd = ["Month Key", "Month Index", "Metric 1", "Units"];
      var rows = [], ks = keys(12).reverse(), decay = R(0.72, 0.88);
      ks.forEach(function (k, mi) {
        var base = RI(400, 3000), vpu = R(8, 30) * noise(0.25), age = ks.length - mi;
        for (var i = 0; i < age; i++) {
          var kept = base * Math.pow(decay, i) * noise(0.06);
          rows.push([i ? "" : k, String(i), money(kept * vpu * (i ? R(0.6, 0.9) : 1) * noise(0.1)), count(kept)]);
        }
      });
      return { hd: hd, num: [2, 3], rows: rows };
    },

    "time-series-trio": function () {
      var hd = ["Date", "Metric 1", "Metric 2", "Metric 3"], rows = [];
      var b1 = R(8000, 30000), b2 = R(300, 1500), b3 = R(2, 9), t1 = R(-0.0004, 0.0012), t2 = R(-0.0004, 0.0012);
      var wk = [R(0.7, 0.9), R(0.9, 1.05), R(0.9, 1.05), R(0.95, 1.1), R(1.05, 1.25), R(1.15, 1.45), R(0.85, 1.1)];
      var end = Date.UTC(2026, 9, 22);
      for (var i = 0; i < 400; i++) {
        var d = new Date(end - i * 864e5), t = 399 - i, w = wk[d.getUTCDay()], season = 1 + 0.12 * Math.sin(t / 58);
        rows.push([d.toISOString().slice(0, 10), money(b1 * Math.pow(1 + t1, t) * w * season * noise(0.12)),
                   count(b2 * Math.pow(1 + t2, t) * w * noise(0.15)), pct(b3 * season * noise(0.1))]);
      }
      return { hd: hd, num: [1, 2, 3], rows: rows };
    },

    "funnel": function () {
      var hd = ["Stage", "Dimension A", "Metric 1"], rows = [];
      var stages = ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"], A = ["A1", "A2", "A3", "A4"];
      var conv = A.map(function () { return [1, R(0.35, 0.7), R(0.4, 0.8), R(0.3, 0.7), R(0.4, 0.85)]; });
      var top = A.map(function () { return RI(4000, 30000); });
      stages.forEach(function (st, si) {
        A.forEach(function (a, ai) {
          var v = top[ai]; for (var k = 1; k <= si; k++) v *= conv[ai][k];
          rows.push([ai ? "" : st, a, count(v)]);
        });
      });
      return { hd: hd, num: [2], rows: rows };
    },

    "change-bridge": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
      for (var i = 1; i <= 12; i++) { var a = R(5000, 90000); rows.push(["A" + i, money(a), money(a * (1 + R(-0.35, 0.45)))]); }
      return { hd: hd, num: [1, 2], rows: rows };
    },

    "pareto": function () {
      var hd = ["Dimension A", "Metric 1"], rows = [];
      for (var i = 1; i <= 40; i++) rows.push(["A" + (i < 10 ? "0" : "") + i, money(Math.exp(R(6, 12)))]);
      return { hd: hd, num: [1], rows: rows };
    },

    "target-pacing": function () {
      var hd = ["Date", "Metric 1", "Metric 2"], rows = [];
      var base = R(5000, 20000), perf = R(0.85, 1.15), wk = [0.8, 0.95, 1, 1, 1.05, 1.25, 1.2];
      [[2026, 8, 30, 30], [2026, 9, 31, 22]].forEach(function (m) {
        for (var d = m[2]; d >= 1; d--) {
          var dt = new Date(Date.UTC(m[0], m[1], d)), tgt = base * wk[dt.getUTCDay()] * (1 + (m[1] - 8) * 0.04);
          rows.push([dt.toISOString().slice(0, 10), d <= m[3] ? money(tgt * perf * noise(0.18)) : "", money(tgt)]);
        }
      });
      return { hd: hd, num: [1, 2], rows: rows };
    },

    "quadrant-scatter": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2", "Metric 3"], rows = [];
      for (var i = 1; i <= 24; i++) {
        var size = Math.exp(R(5, 9)), x = R(20, 160) * noise(0.2), y = R(1, 12) + x / 40 * R(-1, 2);
        rows.push(["A" + (i < 10 ? "0" : "") + i, money(x), pct(Math.max(0.3, y)), count(size)]);
      }
      return { hd: hd, num: [1, 2, 3], rows: rows };
    },

    "mix-shift": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"];
      var base = A.map(function () { return R(0.3, 1.5); }), drift = A.map(function () { return R(-0.05, 0.06); });
      keys(12).forEach(function (k, i) {
        var t = 11 - i;
        A.forEach(function (a, j) { rows.push([j ? "" : k, a, money(1e5 * base[j] * Math.pow(1 + drift[j], t) * noise(0.08))]); });
      });
      return { hd: hd, num: [2], rows: rows };
    },

    "calendar-heatmap": function () {
      var hd = ["Date", "Metric 1"], rows = [], end = Date.UTC(2026, 9, 22), base = R(200, 900);
      var wk = [R(0.5, 0.8), R(0.9, 1.1), R(0.9, 1.1), R(0.95, 1.15), R(1.05, 1.3), R(1.2, 1.6), R(0.7, 1.0)];
      for (var i = 0; i < 540; i++) {
        var d = new Date(end - i * 864e5), t = 539 - i, season = 1 + 0.25 * Math.sin((d.getUTCMonth() + 1) / 12 * 6.283);
        rows.push([d.toISOString().slice(0, 10), count(base * (1 + t * 0.0006) * wk[d.getUTCDay()] * season * noise(0.22))]);
      }
      return { hd: hd, num: [1], rows: rows };
    },

    "year-over-year": function () {
      var hd = ["Month Key", "Metric 1"], rows = [], base = R(1e5, 6e5), g = R(-0.05, 0.25);
      var season = [0.85, 0.82, 0.95, 0.97, 1.0, 0.98, 0.92, 0.94, 1.02, 1.08, 1.12, 1.3];
      for (var y = 2023; y <= 2026; y++) for (var m = 1; m <= 12; m++) {
        if (y === 2026 && m > 9) break;
        rows.unshift([String(y) + (m < 10 ? "0" : "") + m, money(base * Math.pow(1 + g, y - 2023 + m / 12) * season[m - 1] * noise(0.07))]);
      }
      return { hd: hd, num: [1], rows: rows };
    },

    "leaderboard": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], n = 15;
      var base = [], tr = [];
      for (var j = 0; j < n; j++) { base.push(Math.exp(R(9, 12))); tr.push(R(-0.06, 0.08)); }
      keys(13).forEach(function (k, i) {
        var t = 12 - i;
        for (var j = 0; j < n; j++) rows.push([j ? "" : k, "A" + (j + 1), money(base[j] * Math.pow(1 + tr[j], t) * noise(0.15))]);
      });
      return { hd: hd, num: [2], rows: rows };
    },

    "distribution": function () {
      var hd = ["Dimension A", "Metric 1"], rows = [], mu = R(3, 4.5), sh = R(0, 0.5);
      for (var i = 0; i < 600; i++) { var g = i % 3 ? "A1" : "A2"; rows.push([g, money2(Math.exp(mu + (g === "A2" ? sh : 0) + 0.7 * (R(-1, 1) + R(-1, 1) + R(-1, 1))))]); }
      return { hd: hd, num: [1], rows: rows };
    },

    "target-attainment": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
      for (var i = 1; i <= 14; i++) { var t = R(2e4, 2e5); rows.push(["A" + i, money(t * R(0.7, 1.25)), money(t)]); }
      return { hd: hd, num: [1, 2], rows: rows };
    },

    "anomaly-watch": function () {
      var hd = ["Date", "Metric 1"], rows = [], end = Date.UTC(2026, 9, 22), base = R(800, 4000);
      var wk = [0.8, 1, 1, 1.02, 1.08, 1.25, 1.1], spikes = {};
      for (var s = 0; s < 6; s++) spikes[RI(30, 239)] = R(0, 1) > 0.5 ? R(1.5, 2.1) : R(0.35, 0.6);
      spikes[RI(0, 3)] = R(0, 1) > 0.5 ? R(1.6, 2) : R(0.4, 0.6);
      for (var i = 0; i < 240; i++) {
        var d = new Date(end - i * 864e5), t = 239 - i;
        rows.push([d.toISOString().slice(0, 10), count(base * (1 + t * 0.0008) * wk[d.getUTCDay()] * noise(0.06) * (spikes[i] || 1))]);
      }
      return { hd: hd, num: [1], rows: rows };
    },

    "treemap": function () {
      var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [];
      for (var a = 1; a <= 7; a++) { var n = RI(2, 6), w = Math.exp(R(0, 2)); for (var b = 1; b <= n; b++) rows.push([b === 1 ? "A" + a : "", "B" + a + "." + b, money(w * Math.exp(R(9, 11.5)))]); }
      return { hd: hd, num: [2], rows: rows };
    },

    "small-multiples": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], n = 12, base = [], tr = [], amp = [];
      for (var j = 0; j < n; j++) { base.push(Math.exp(R(9, 11.5))); tr.push(R(-0.05, 0.07)); amp.push(R(0, 0.25)); }
      keys(18).forEach(function (k, i) {
        var t = 17 - i;
        for (var j = 0; j < n; j++) rows.push([j ? "" : k, "A" + (j + 1), money(base[j] * Math.pow(1 + tr[j], t) * (1 + amp[j] * Math.sin(t / 2)) * noise(0.08))]);
      });
      return { hd: hd, num: [2], rows: rows };
    },

    "variance-table": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1", "Metric 2", "Metric 3"], rows = [], n = 10, b = [], tr = [];
      for (var j = 0; j < n; j++) { b.push([Math.exp(R(9, 12)), R(100, 3000), R(2, 15)]); tr.push(R(-0.04, 0.05)); }
      keys(13).forEach(function (k, i) {
        var t = 12 - i;
        for (var j = 0; j < n; j++) { var f = Math.pow(1 + tr[j], t); rows.push([j ? "" : k, "A" + (j + 1), money(b[j][0] * f * noise(0.12)), count(b[j][1] * f * noise(0.1)), pct(b[j][2] * noise(0.12))]); }
      });
      return { hd: hd, num: [2, 3, 4], rows: rows };
    },

    "gauges": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2"], t;
      var rows = [];
      t = R(2e5, 9e5); rows.push(["Goal 1", money(t * R(0.8, 1.2)), money(t)]);
      t = R(1000, 9000); rows.push(["Goal 2", count(t * R(0.8, 1.2)), count(t)]);
      t = R(5, 30); rows.push(["Goal 3", pct(t * R(0.8, 1.2)), pct(t)]);
      t = R(20, 90); rows.push(["Goal 4", money2(t * R(0.85, 1.2)), money2(t)]);
      t = R(50, 400); rows.push(["Goal 5", count(t * R(0.8, 1.2)), count(t)]);
      t = R(40, 95); rows.push(["Goal 6", pct(Math.min(99, t * R(0.85, 1.15))), pct(t)]);
      return { hd: hd, num: [1, 2], rows: rows };
    },

    "combo-chart": function () {
      var hd = ["Date", "Metric 1", "Metric 2", "Metric 3"], rows = [], b = R(1e5, 6e5), g = R(-0.01, 0.025), m = R(10, 35), c = R(500, 5000);
      var season = [0.85, 0.82, 0.95, 0.97, 1.0, 0.98, 0.92, 0.94, 1.02, 1.08, 1.12, 1.3];
      keys(30).forEach(function (k, i) {
        var t = 29 - i, mo = Number(k.slice(4)) - 1;
        rows.push([k, money(b * Math.pow(1 + g, t) * season[mo] * noise(0.08)), pct(m * noise(0.12)), count(c * Math.pow(1 + g, t) * season[mo] * noise(0.1))]);
      });
      return { hd: hd, num: [1, 2, 3], rows: rows };
    },

    "flow-sankey": function () {
      var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], A = 6, B = 5;
      for (var a = 1; a <= A; a++) { var w = Math.exp(R(0, 1.8)), first = true; for (var bb = 1; bb <= B; bb++) if (bb === 1 || R(0, 1) > 0.15) { rows.push([first ? "A" + a : "", "B" + bb, count(w * Math.exp(R(5, 8)) * (bb === a % B + 1 ? 2.5 : 1))]); first = false; } }
      return { hd: hd, num: [2], rows: rows };
    },

    "box-plot": function () {
      var hd = ["Dimension A", "Metric 1"], rows = [];
      for (var a = 1; a <= 6; a++) { var mu = R(3, 4.5), sd = R(0.3, 0.7); for (var i = 0; i < 80; i++) rows.push(["A" + a, money2(Math.exp(mu + sd * (R(-1, 1) + R(-1, 1) + R(-1, 1))))]); }
      return { hd: hd, num: [1], rows: rows };
    },

    "radar-compare": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5", "Metric 6"], rows = [];
      for (var a = 1; a <= 6; a++) rows.push(["A" + a, money(R(1e5, 9e5)), count(R(500, 5000)), pct(R(2, 15)), money2(R(20, 120)), pct(R(40, 90)), count(R(10, 200))]);
      return { hd: hd, num: [1, 2, 3, 4, 5, 6], rows: rows };
    },

    "bump-chart": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], n = 10, base = [], tr = [];
      for (var j = 0; j < n; j++) { base.push(R(4e4, 1.2e5)); tr.push(R(-0.08, 0.1)); }
      keys(12).forEach(function (k, i) { var t = 11 - i; for (var j = 0; j < n; j++) rows.push([j ? "" : k, "A" + (j + 1), money(base[j] * Math.pow(1 + tr[j], t) * noise(0.12))]); });
      return { hd: hd, num: [2], rows: rows };
    },

    "indexed-growth": function () {
      var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], n = 7, base = [], tr = [];
      for (var j = 0; j < n; j++) { base.push(Math.exp(R(9, 12))); tr.push(R(-0.04, 0.07)); }
      keys(18).forEach(function (k, i) { var t = 17 - i; for (var j = 0; j < n; j++) rows.push([j ? "" : k, "A" + (j + 1), money(base[j] * Math.pow(1 + tr[j], t) * noise(0.06))]); });
      return { hd: hd, num: [2], rows: rows };
    },

    "dumbbell": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
      for (var i = 1; i <= 14; i++) { var a = R(3, 25); rows.push(["A" + i, pct(a), pct(Math.max(0.5, a * (1 + R(-0.35, 0.45))))]); }
      return { hd: hd, num: [1, 2], rows: rows };
    },

    "correlation-matrix": function () {
      var hd = ["Dimension A", "Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5"], rows = [];
      var w = [R(0.5, 1.5), R(-1.2, 1.2), R(-1, 1), R(-0.5, 0.5)];
      for (var i = 1; i <= 120; i++) {
        var f = R(-1, 1) + R(-1, 1), g = R(-1, 1);
        rows.push(["A" + i, money(5e4 * (2 + f + 0.3 * g)), count(2000 * (2 + w[0] * f + 0.5 * R(-1, 1))), pct(10 + 3 * (w[1] * f + R(-1, 1))), money2(60 + 15 * (w[2] * g + R(-1, 1))), count(300 * (2 + w[3] * f + R(-1, 1)))]);
      }
      return { hd: hd, num: [1, 2, 3, 4, 5], rows: rows };
    },

    "time-series-stack": function () {
      var hd = ["Date", "Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5", "Metric 6"], rows = [], end = Date.UTC(2026, 9, 22);
      var b = [R(8000, 30000), R(300, 1500), R(2, 9), R(20, 80), R(1000, 6000), R(30, 70)], tr = b.map(function () { return R(-0.0004, 0.0012); });
      var wk = [R(0.7, 0.9), R(0.9, 1.05), R(0.9, 1.05), R(0.95, 1.1), R(1.05, 1.25), R(1.15, 1.45), R(0.85, 1.1)];
      for (var i = 0; i < 400; i++) {
        var d = new Date(end - i * 864e5), t = 399 - i, w = wk[d.getUTCDay()], se = 1 + 0.12 * Math.sin(t / 58), f = function (j) { return b[j] * Math.pow(1 + tr[j], t); };
        rows.push([d.toISOString().slice(0, 10), money(f(0) * w * se * noise(0.12)), count(f(1) * w * noise(0.15)), pct(b[2] * se * noise(0.1)),
                   money2(f(3) * noise(0.08)), count(f(4) * w * noise(0.12)), pct(Math.min(99, b[5] * noise(0.06)))]);
      }
      return { hd: hd, num: [1, 2, 3, 4, 5, 6], rows: rows };
    },

    "kpi-scorecard": function () {
      var hd = ["Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5", "Metric 6"];
      var s = { m1: R(2e5, 9e5), m2: R(2000, 9000), m3: R(5e4, 2e5), m4: R(8, 30), m5: R(40, 120), m6: R(200, 1500) };
      var tr = { m1: R(-0.01, 0.03), m2: R(-0.01, 0.03), m3: R(-0.02, 0.02), m4: R(-0.01, 0.015), m5: R(-0.01, 0.02), m6: R(-0.02, 0.03) };
      var ks = keys(24), rows = [];
      ks.forEach(function (k, i) {
        var t = 23 - i, f = function (x, n) { return s[x] * Math.pow(1 + tr[x], t) * noise(n); };
        rows.push([k, money(f("m1", 0.12)), count(f("m2", 0.1)), money(f("m3", 0.15)), pct(f("m4", 0.08)), money2(f("m5", 0.1)), count(f("m6", 0.2))]);
      });
      return { hd: hd, num: [1, 2, 3, 4, 5, 6], rows: rows };
    }
  };

  // variants reuse a generator and keep only some of its columns
  var pick = function (base, cols, names) {
    return function () {
      var d = GEN[base]();
      return { hd: cols.map(function (i, j) { return names ? names[j] : d.hd[i]; }), num: cols.map(function (i, j) { return d.num.indexOf(i) > -1 ? j : -1; }).filter(function (j) { return j > -1; }),
               rows: d.rows.map(function (r) { return cols.map(function (i) { return r[i]; }); }).filter(function (r) { return r.some(function (v) { return v !== ""; }); }) };
    };
  };
  GEN["time-series-single"] = pick("time-series-trio", [0, 1]);
  GEN["time-series-duo"] = pick("time-series-trio", [0, 1, 2]);
  GEN["kpi-scorecard-trio"] = pick("kpi-scorecard", [0, 1, 2, 4], ["Month Key", "Metric 1", "Metric 2", "Metric 3"]);
  GEN["combo-bar-line"] = pick("combo-chart", [0, 1, 2]);
  GEN["variance-table-single"] = pick("variance-table", [0, 1, 2]);
  GEN["funnel-simple"] = function () {
    var d = GEN["funnel"](), tot = {}, order = [], cur = "";
    d.rows.forEach(function (r) { if (r[0]) cur = r[0]; if (!(cur in tot)) { tot[cur] = 0; order.push(cur); } tot[cur] += Number(r[2].replace(/,/g, "")); });
    return { hd: ["Stage", "Metric 1"], num: [1], rows: order.map(function (k) { return [k, count(tot[k])]; }) };
  };
  GEN["treemap-flat"] = function () {
    var hd = ["Dimension A", "Metric 1"], rows = [];
    for (var a = 1; a <= 14; a++) rows.push(["A" + a, money(Math.exp(R(9, 13)))]);
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["value-matrix"] = function () {
    var hd = ["Dimension A", "Dimension B", "Units", "Metric 1", "Metric 2", "Metric 3"], rows = [];
    var bs = ["B1", "B2", "B3", "B4"], lift = [1, 1.45, 0.75, 1.15];
    for (var a = 1; a <= 6; a++) {
      var af = R(0.7, 1.3), vol = R(300, 2600);
      bs.forEach(function (b, j) {
        var v = R(40, 70) * af * lift[j], g = R(1.15, 1.35);
        rows.push([j ? "" : "A" + a, b, count(vol * R(0.3, 1.2)), money2(v), money2(v * g), money2(v * (g + R(0.1, 0.25)))]);
      });
    }
    return { hd: hd, num: [2, 3, 4, 5], rows: rows };
  };
  GEN["contribution-breakdown"] = function () {
    var hd = ["Dimension A", "Dimension B", "Dimension C", "Units", "Metric 1", "Metric 2", "Metric 3"], rows = [];
    var bs = ["B1", "B2", "B3", "B4", "B5"], cs = ["C1", "C2", "C3"];
    for (var a = 1; a <= 6; a++) {
      var af = R(0.8, 1.25), vol = R(80, 900) * (7 - a) / 3, first = true;
      bs.forEach(function (b, j) {
        cs.forEach(function (c, k) {
          var v = R(40, 80) * af * [1, 1.4, 0.75][k] * [1, 0.85, 0.7, 1.25, 1.1][j], g = R(1.15, 1.35);
          rows.push([first ? "A" + a : "", k ? "" : b, c, count(vol * R(0.3, 1.3)), money2(v), money2(v * g), money2(v * (g + R(0.1, 0.25)))]);
          first = false;
        });
      });
    }
    return { hd: hd, num: [3, 4, 5, 6], rows: rows };
  };
  GEN["donut-chart"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5"], w = {}, g = {};
    A.forEach(function (a) { w[a] = R(0.4, 1.8); g[a] = R(-0.04, 0.05); });
    keys(12).forEach(function (k, t) { A.forEach(function (a) { rows.push([k, a, count(w[a] * 900 * Math.pow(1 + g[a], 11 - t) * noise(0.12))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["bullet-chart"] = function () {
    var hd = ["Dimension A", "Metric 1", "Target", "Previous"], rows = [];
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7"].forEach(function (a) {
      var t = R(20000, 90000), v = t * R(0.55, 1.2);
      rows.push([a, money(v), money(t), money(v * R(0.8, 1.15))]);
    });
    return { hd: hd, num: [1, 2, 3], rows: rows };
  };
  GEN["slope-chart"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5", "A6", "A7"], w = {}, g = {};
    A.forEach(function (a) { w[a] = R(1500, 9000); g[a] = R(-0.05, 0.06); });
    keys(13).forEach(function (k, t) { A.forEach(function (a) { rows.push([k, a, count(w[a] * Math.pow(1 + g[a], 12 - t) * noise(0.08))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["cohort-triangle"] = function () {
    var hd = ["Month Key", "Period", "Units", "Metric 1"], rows = [], ks = keys(12).reverse(), keep = R(0.5, 0.65), decay = R(0.82, 0.9);
    ks.forEach(function (k, c) {
      var size = R(800, 2400), f = R(0.92, 1.08);
      for (var o = 0; o < 12 - c; o++) {
        var share = o === 0 ? 1 : keep * f * Math.pow(decay, o - 1) * noise(0.04);
        rows.push([k, String(o), count(size), count(size * Math.min(1, share))]);
      }
    });
    return { hd: hd, num: [2, 3], rows: rows };
  };
  GEN["marimekko"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [];
    ["A1", "A2", "A3", "A4", "A5"].forEach(function (a) { var s = R(0.3, 2); ["B1", "B2", "B3", "B4"].forEach(function (b) { rows.push([a, b, count(s * R(200, 2500))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["sunburst"] = GEN["marimekko"];
  GEN["waffle-chart"] = function () {
    var hd = ["Dimension A", "Metric 1"], rows = [];
    ["A1", "A2", "A3", "A4", "A5"].forEach(function (a, i) { rows.push([a, count(R(300, 3000) / (1 + i * 0.4))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["diverging-bars"] = function () {
    var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"].forEach(function (a) { var b = R(8000, 60000); rows.push([a, money(b * R(0.65, 1.4)), money(b)]); });
    return { hd: hd, num: [1, 2], rows: rows };
  };
  GEN["horizon-chart"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"], p = {};
    A.forEach(function (a) { p[a] = { b: R(1000, 8000), g: R(-0.03, 0.04), s: R(0, 6) }; });
    keys(24).forEach(function (k, t) { A.forEach(function (a) { var q = p[a], i = 23 - t; rows.push([k, a, count(q.b * Math.pow(1 + q.g, i) * (1 + 0.25 * Math.sin((i + q.s) / 1.9)) * noise(0.08))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["rose-chart"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3"], w = {};
    A.forEach(function (a) { w[a] = R(400, 1600); });
    keys(24).forEach(function (k, t) { var season = 1 + 0.35 * Math.sin((t + 3) / 1.9); A.forEach(function (a) { rows.push([k, a, count(w[a] * season * (t < 12 ? 1.1 : 1) * noise(0.12))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["beeswarm"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], A = ["A1", "A2", "A3"];
    for (var i = 1; i <= 90; i++) { var a = A[i % 3], m = [9000, 14000, 6000][i % 3]; rows.push([a, "B" + i, money(Math.max(100, m * Math.exp(R(-1.1, 0.9))))]); }
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["butterfly-chart"] = function () {
    var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
    ["A1", "A2", "A3", "A4", "A5", "A6", "A7"].forEach(function (a, i) { var c = 1 - Math.abs(i - 2.5) / 4; rows.push([a, count(R(800, 1400) * c * 3), count(R(800, 1400) * c * 3 * R(0.7, 1.3))]); });
    return { hd: hd, num: [1, 2], rows: rows };
  };
  GEN["chord-diagram"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5"];
    A.forEach(function (a) { A.forEach(function (b) { if (a !== b && Math.random() > 0.15) rows.push([a, b, count(R(40, 900))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["bubble-cloud"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4"];
    for (var i = 1; i <= 40; i++) rows.push([A[i % 4], "B" + i, count(Math.exp(R(4, 8.5)))]);
    return { hd: hd, num: [2], rows: rows };
  };
  // ---- 25 more (v1.5.2) ----
  var A_ = function (n, p) { var o = []; for (var i = 1; i <= n; i++) o.push((p || "A") + i); return o; };
  var ymd = function (d) { var x = new Date(d * 864e5); return x.getUTCFullYear() + "-" + String(x.getUTCMonth() + 1).padStart(2, "0") + "-" + String(x.getUTCDate()).padStart(2, "0"); };
  var season = function (m) { return 1 + 0.22 * Math.sin((m - 2) / 12 * 2 * Math.PI) + (m === 11 ? 0.18 : 0); };
  GEN["ytd-race"] = function () {
    var hd = ["Month Key", "Metric 1", "Metric 2"], rows = [], b = R(40000, 90000), g = R(0.04, 0.16);
    for (var m = 12; m >= 1; m--) { var k = "2026" + (m < 10 ? "0" : "") + m, t = b * (1 + g * 0.8) * season(m - 1); rows.push([k, m <= 9 ? money(b * (1 + g) * season(m - 1) * noise(0.1)) : "", money(t)]); }
    for (m = 12; m >= 1; m--) rows.push(["2025" + (m < 10 ? "0" : "") + m, money(b * season(m - 1) * noise(0.1)), ""]);
    return { hd: hd, num: [1, 2], rows: rows };
  };
  GEN["streamgraph"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = A_(6), p = {};
    A.forEach(function (a) { p[a] = { b: R(300, 2000), g: R(-0.05, 0.07), ph: R(0, 6) }; });
    keys(24).forEach(function (k, t) { var i = 23 - t; A.forEach(function (a) { var q = p[a]; rows.push([k, a, count(q.b * Math.pow(1 + q.g, i) * (1 + 0.2 * Math.sin(i / 2 + q.ph)) * noise(0.06))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["timeline-chart"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1", "Metric 2", "Metric 3"], rows = [], today = Math.floor(Date.now() / 864e5), B = ["B1", "B2", "B3"];
    for (var i = 1; i <= 12; i++) { var st = today + RI(-150, 90), len = RI(10, 120); rows.push(["Item " + i, B[i % 3], ymd(st), ymd(st + len), money(R(5000, 80000))]); }
    rows.sort(function (a, b) { return a[2] < b[2] ? -1 : 1; });
    return { hd: hd, num: [4], rows: rows };
  };
  GEN["punch-card"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], D = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], pk = R(18, 21);
    D.forEach(function (d, i) { for (var h = 0; h < 24; h++) { var day = Math.exp(-Math.pow(h - 12.5, 2) / 30) + 0.9 * Math.exp(-Math.pow(h - pk, 2) / 6) + 0.05, wk = i >= 5 ? 1.25 : 1; rows.push([d, String(h), count(400 * day * wk * noise(0.15))]); } });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["sparkline-table"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = A_(10), p = {};
    A.forEach(function (a) { p[a] = { b: R(500, 6000), g: R(-0.06, 0.07) }; });
    keys(13).forEach(function (k, t) { A.forEach(function (a) { rows.push([k, a, money(p[a].b * Math.pow(1 + p[a].g, 12 - t) * noise(0.1))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["concentration-curve"] = function () {
    var hd = ["Dimension A", "Metric 1"], rows = [], sk = R(1, 1.6);
    for (var i = 1; i <= 60; i++) rows.push(["A" + i, money(Math.exp(R(5, 9) * sk / 1.3) * R(0.6, 1.4))]);
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["venn-overlap"] = function () {
    var hd = ["Dimension A", "Metric 1"], S = ["Set A", "Set B", "Set C"], w = [R(3000, 6000), R(2000, 4000), R(1000, 3000)];
    var rows = [[S[0], count(w[0])], [S[1], count(w[1])], [S[2], count(w[2])], [S[0] + " & " + S[1], count(R(400, 1200))], [S[0] + " & " + S[2], count(R(200, 800))], [S[1] + " & " + S[2], count(R(100, 600))], [S[0] + " & " + S[1] + " & " + S[2], count(R(50, 300))]];
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["upset-plot"] = function () {
    var hd = ["Dimension A", "Metric 1"], S = ["Set A", "Set B", "Set C", "Set D", "Set E"], rows = [], w = [5, 4, 3, 2, 1.5];
    for (var m = 1; m < 32; m++) { var parts = S.filter(function (s, i) { return m & (1 << i); }), v = parts.reduce(function (a, s) { return a * w[S.indexOf(s)]; }, 1) * Math.pow(0.18, parts.length - 1) * R(150, 260);
      if (parts.length > 3 && Math.random() < 0.5) continue; rows.push([parts.join(" & "), count(v)]); }
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["percentile-bands"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = A_(40), base = {};
    A.forEach(function (a) { base[a] = Math.exp(R(-0.9, 0.9)); });
    keys(18).forEach(function (k, t) { var lvl = 120 * Math.pow(1.015, 17 - t); A.forEach(function (a) { rows.push([k, a, money2(lvl * base[a] * Math.exp(R(-0.25, 0.25)))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["forecast-chart"] = function () {
    var hd = ["Month Key", "Metric 1"], rows = [], b = R(20000, 50000), g = R(0.004, 0.015);
    keys(30).forEach(function (k, t) { var i = 29 - t, m = +k.slice(4) - 1; rows.push([k, count(b * (1 + g * i) * season(m) * noise(0.05))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["rolling-12"] = function () {
    var hd = ["Month Key", "Metric 1"], rows = [], b = R(20000, 50000), g = R(-0.004, 0.012);
    keys(36).forEach(function (k, t) { var i = 35 - t, m = +k.slice(4) - 1; rows.push([k, money(b * (1 + g * i) * season(m) * noise(0.08))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["weekday-profile"] = function () {
    var hd = ["Date", "Metric 1"], rows = [], end = Date.UTC(2026, 8, 30) / 864e5, f = [1, 1.04, 1.06, 1.1, 1.3, 1.45, 0.9].map(function (x) { return x * R(0.9, 1.1); });
    for (var d = end; d > end - 120; d--) { var wd = (new Date(d * 864e5).getUTCDay() + 6) % 7; rows.push([ymd(d), count(1800 * f[wd] * noise(0.14))]); }
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["parallel-coordinates"] = function () {
    var hd = ["Dimension A", "Metric 1", "Metric 2", "Metric 3", "Metric 4", "Metric 5"], rows = [];
    for (var i = 1; i <= 20; i++) { var s = R(0.3, 1.7), q = R(0.5, 1.5); rows.push(["A" + i, money(s * 40000 * noise(0.2)), count(s * 900 * noise(0.3)), pct(q * 4), money2(q * 35 * noise(0.2)), pct(R(20, 70) / q)]); }
    return { hd: hd, num: [1, 2, 3, 4, 5], rows: rows };
  };
  GEN["dot-plot"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], B = ["B1", "B2", "B3"];
    A_(12).forEach(function (a) { var s = R(20, 80); B.forEach(function (b, j) { rows.push([a, b, pct(Math.min(99, s * [1, R(0.7, 1.3), R(0.6, 1.5)][j]))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["grouped-bars"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], B = ["B1", "B2", "B3", "B4"];
    A_(6).forEach(function (a) { var s = R(0.4, 1.6); B.forEach(function (b, j) { rows.push([a, b, count(s * [1600, 1100, 800, 500][j] * R(0.6, 1.4))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["likert-bars"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], L5 = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
    for (var i = 1; i <= 8; i++) { var m = R(-0.8, 1.2); L5.forEach(function (l, j) { rows.push(["Statement " + i, l, count(200 * Math.exp(-Math.pow(j - 2 - m, 2) / 2.2) * noise(0.2))]); }); }
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["target-trend"] = function () {
    var hd = ["Month Key", "Metric 1", "Metric 2"], rows = [], b = R(30000, 60000);
    for (var m = 12; m >= 1; m--) { var t = b * (1 + 0.02 * m); rows.push(["2026" + (m < 10 ? "0" : "") + m, m <= 9 ? money(t * R(0.85, 1.12)) : "", money(t)]); }
    return { hd: hd, num: [1, 2], rows: rows };
  };
  GEN["cohort-curves"] = function () {
    var hd = ["Month Key", "Period", "Units", "Metric 1"], rows = [], ks = keys(12).reverse(), arpu = R(20, 45), decay = R(0.8, 0.9);
    ks.forEach(function (k, c) { var size = R(800, 2400), f = R(0.85, 1.2) * (1 + c * 0.01);
      for (var o = 0; o < 12 - c; o++) rows.push([k, String(o), count(size), money(size * arpu * f * Math.pow(decay, o) * noise(0.06))]); });
    return { hd: hd, num: [2, 3], rows: rows };
  };
  GEN["bar-chart-race"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = A_(14), p = {};
    A.forEach(function (a) { p[a] = { b: R(200, 2000), g: R(-0.06, 0.12) }; });
    keys(24).forEach(function (k, t) { A.forEach(function (a) { rows.push([k, a, count(p[a].b * Math.pow(1 + p[a].g, 23 - t) * noise(0.15))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["motion-scatter"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1", "Metric 2", "Metric 3"], rows = [], A = A_(10), p = {};
    A.forEach(function (a) { p[a] = { x: R(5000, 40000), y: R(1, 6), z: R(200, 3000), gx: R(-0.04, 0.08), gy: R(-0.05, 0.06) }; });
    keys(12).forEach(function (k, t) { var i = 11 - t; A.forEach(function (a) { var q = p[a]; rows.push([k, a, money(q.x * Math.pow(1 + q.gx, i) * noise(0.05)), pct(q.y * Math.pow(1 + q.gy, i) * noise(0.05)), count(q.z * Math.pow(1.02, i))]); }); });
    return { hd: hd, num: [2, 3, 4], rows: rows };
  };
  GEN["interval-plot"] = function () {
    var hd = ["Dimension A", "Metric 1", "Metric 2", "Metric 3"], rows = [];
    A_(14).forEach(function (a) { var v = R(2, 9), w = R(0.4, 2.5); rows.push([a, pct(v), pct(Math.max(0, v - w)), pct(v + w * R(0.8, 1.2))]); });
    return { hd: hd, num: [1, 2, 3], rows: rows };
  };
  GEN["goal-rings"] = function () {
    var hd = ["Dimension A", "Metric 1", "Metric 2"], rows = [];
    A_(7).forEach(function (a) { var t = R(20000, 120000); rows.push([a, money(t * R(0.45, 1.2)), money(t)]); });
    return { hd: hd, num: [1, 2], rows: rows };
  };
  GEN["word-cloud"] = function () {
    var hd = ["Dimension A", "Metric 1"], W = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima", "mike", "november", "oscar", "papa", "quebec", "romeo", "sierra", "tango", "uniform", "victor", "whiskey", "x-ray", "yankee", "zulu", "amber", "cobalt", "crimson", "indigo", "jade", "lemon", "olive", "orchid", "pearl", "ruby", "saffron", "silver", "teal", "violet"];
    W.sort(function () { return Math.random() - 0.5; });
    return { hd: hd, num: [1], rows: W.map(function (w, i) { return [w, count(9000 / Math.pow(i + 1, 0.85) * noise(0.1))]; }) };
  };
  GEN["radial-bars"] = function () {
    var hd = ["Dimension A", "Metric 1"], rows = [];
    A_(12).forEach(function (a) { rows.push([a, count(Math.exp(R(6, 9.5)))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["trend-scatter"] = function () {
    var hd = ["Dimension A", "Units", "Metric 1", "Metric 2"], rows = [], roi = R(1.4, 2.6);
    for (var i = 1; i <= 50; i++) { var x = R(2000, 60000), y = x * roi * noise(0.18) + R(-3000, 3000); if (i % 17 === 0) y *= R(0, 1) < 0.5 ? 0.35 : 1.8; rows.push(["A" + i, count(R(50, 2000)), money(x), money(Math.max(0, y))]); }
    return { hd: hd, num: [1, 2, 3], rows: rows };
  };
  // ---- 11 more (v1.5.2) ----
  GEN["growth-accounting"] = function () {
    var hd = ["Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 4"], rows = [], act = R(20000, 40000), ks = keys(18).reverse(), out = [];
    ks.forEach(function (k, i) { var m = +k.slice(4) - 1, nw = act * R(0.08, 0.13) * season(m), rt = act * R(0.03, 0.06), lo = act * R(0.1, 0.15); out.push([k, count(nw), count(rt), count(lo), count(act)]); act = act + nw + rt - lo; });
    return { hd: hd, num: [1, 2, 3, 4], rows: out.reverse() };
  };
  GEN["burn-down"] = function () {
    var hd = ["Date", "Metric 1", "Metric 2"], rows = [], b = Math.round(R(40, 90)) * 1000, start = Date.UTC(2026, 10, 1) / 864e5, f = R(0.85, 1.25);
    for (var d = 0; d < 18; d++) { var wd = (new Date((start + d) * 864e5).getUTCDay() + 6) % 7; rows.push([ymd(start + d), money(b / 30 * f * (wd >= 5 ? 0.7 : 1.1) * noise(0.25)), money(b)]); }
    return { hd: hd, num: [1, 2], rows: rows.reverse() };
  };
  GEN["pvm-bridge"] = function () {
    var hd = ["Month Key", "Dimension A", "Units", "Metric 1"], rows = [], A = ["A1", "A2", "A3", "A4", "A5"], p = {};
    A.forEach(function (a, i) { p[a] = { u: R(300, 3000), r: R(20, 200), gu: R(-0.06, 0.08), gr: R(-0.03, 0.04) }; });
    keys(13).forEach(function (k, t) { var i = 12 - t; A.forEach(function (a) { var q = p[a], u = q.u * Math.pow(1 + q.gu, i) * noise(0.06); rows.push([k, a, count(u), money(u * q.r * Math.pow(1 + q.gr, i) * noise(0.04))]); }); });
    return { hd: hd, num: [2, 3], rows: rows };
  };
  GEN["cycle-plot"] = function () {
    var hd = ["Month Key", "Metric 1"], rows = [], b = R(20000, 40000), g = R(0.002, 0.012);
    keys(48).forEach(function (k, t) { var i = 47 - t, m = +k.slice(4) - 1; rows.push([k, count(b * (1 + g * i) * season(m) * noise(0.05))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["spiral-plot"] = function () {
    var hd = ["Month Key", "Metric 1"], rows = [], b = R(20000, 40000), g = R(0.003, 0.012);
    keys(60).forEach(function (k, t) { var i = 59 - t, m = +k.slice(4) - 1; rows.push([k, count(b * (1 + g * i) * season(m) * noise(0.06))]); });
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["ridgeline"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], A = A_(7);
    A.forEach(function (a, j) { var mu = R(3.5, 5.5), sd = R(0.3, 0.8); for (var i = 0; i < 60; i++) { var z = (Math.random() + Math.random() + Math.random() - 1.5) * 2; rows.push([a, "B" + (j * 60 + i), money2(Math.exp(mu + sd * z))]); } });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["cumulative-distribution"] = function () {
    var hd = ["Dimension A", "Metric 1"], rows = [], A = ["A1", "A2", "A3"], mu = [4, 4.4, 3.7];
    for (var i = 0; i < 240; i++) { var j = i % 3, z = (Math.random() + Math.random() + Math.random() - 1.5) * 2; rows.push([A[j], money2(Math.exp(mu[j] + 0.6 * z))]); }
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["lollipop-chart"] = function () {
    var hd = ["Month Key", "Dimension A", "Metric 1"], rows = [], A = A_(12), w = {};
    A.forEach(function (a) { w[a] = R(800, 9000); });
    keys(2).forEach(function (k) { A.forEach(function (a) { rows.push([k, a, count(w[a] * R(0.8, 1.2))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["heat-table"] = function () {
    var hd = ["Dimension A", "Dimension B", "Metric 1"], rows = [], B = ["B1", "B2", "B3", "B4", "B5", "B6"], bw = B.map(function () { return R(0.4, 1.6); });
    A_(10).forEach(function (a) { var s = R(0.3, 2); B.forEach(function (b, j) { if (Math.random() > 0.06) rows.push([a, b, money(s * bw[j] * R(2000, 9000))]); }); });
    return { hd: hd, num: [2], rows: rows };
  };
  GEN["conversion-trend"] = function () {
    var hd = ["Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 4"], rows = [], c1 = R(0.06, 0.1), c2 = R(0.3, 0.5), c3 = R(0.5, 0.7);
    keys(18).forEach(function (k, t) { var i = 17 - t, v = R(80000, 120000), r = v * c1 * (1 + 0.004 * i) * noise(0.06), f = r * c2 * noise(0.05), d = f * c3 * (1 - 0.006 * i) * noise(0.04); rows.push([k, count(v), count(r), count(f), count(d)]); });
    return { hd: hd, num: [1, 2, 3, 4], rows: rows };
  };
  GEN["mtd-compare"] = function () {
    var hd = ["Date", "Metric 1"], rows = [], end = Date.UTC(2026, 10, 17) / 864e5, start = Date.UTC(2025, 10, 1) / 864e5, f = [1, 1.04, 1.06, 1.1, 1.3, 1.45, 0.9];
    for (var d = end; d >= start; d--) { var dm = new Date(d * 864e5).getUTCMonth(), dy = new Date(d * 864e5).getUTCFullYear(); if (!(dy === 2026 && dm >= 9) && !(dy === 2025 && dm === 10)) continue; var wd = (new Date(d * 864e5).getUTCDay() + 6) % 7, grow = 1 + (d - start) / 365 * 0.12; rows.push([ymd(d), money(3000 * f[wd] * grow * noise(0.15))]); }
    return { hd: hd, num: [1], rows: rows };
  };
  GEN["quadrant-scatter-plain"] = pick("quadrant-scatter", [0, 1, 2]);
  GEN["radar-compare-four"] = pick("radar-compare", [0, 1, 2, 3, 5], ["Dimension A", "Metric 1", "Metric 2", "Metric 3", "Metric 4"]);

  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  function draw(table) {
    var g = GEN[table.getAttribute("data-gen")];
    if (!g) return;
    var d = g(), num = {};
    d.num.forEach(function (i) { num[i] = 1; });
    var cell = function (tag, v, i) { return "<" + tag + (num[i] ? ' class="n"' : "") + ">" + esc(v) + "</" + tag + ">"; };
    table.innerHTML = "<thead><tr>" + d.hd.map(function (h, i) { return cell("th", h, i); }).join("") + "</tr></thead><tbody>" +
      d.rows.map(function (r) { return "<tr>" + r.map(function (v, i) { return cell("td", v, i); }).join("") + "</tr>"; }).join("") + "</tbody>";
    var n = document.querySelector("[data-rows]");
    if (n) n.textContent = d.rows.length;
  }

  document.querySelectorAll("table[data-gen]").forEach(draw);
  document.querySelectorAll("[data-shuffle]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll("table[data-gen]").forEach(draw);
      b.classList.add("spin");
      setTimeout(function () { b.classList.remove("spin"); }, 500);
    });
  });
})();
