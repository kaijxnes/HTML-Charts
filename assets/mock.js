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
      var hd = ["Month Index", "Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 1 Avg", "Metric 2 Avg", "Metric 3 Avg", "Metric 4"];
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
      var hd = ["Month Index", "Dimension C", "Dimension A", "Dimension B", "Month Key", "Metric 1", "Metric 2", "Metric 3", "Metric 4"];
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
      var hd = ["Month Key", "Dimension C", "Month Index", "Dimension A", "Metric 4", "Metric 1"];
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
      var hd = ["Month Index", "Month Key", "Metric 4", "Metric 1", "Metric 5"];
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
      var hd = ["Month Key", "Month Index", "Metric 1", "Metric 2"];
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
