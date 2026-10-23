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
