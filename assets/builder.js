// Snippet builder on the setup guide: pick a chart, map your header names, copy the snippet.
// Runs entirely in the page – nothing you type is sent anywhere.
(function () {
  var root = document.querySelector("[data-builder]");
  var dataEl = document.getElementById("chart-data");
  if (!root || !dataEl) return;
  var BASE = "https://kaijxnes.github.io/HTML-Charts";
  var charts = JSON.parse(dataEl.textContent);
  var $ = function (k) { return root.querySelector('[data-b="' + k + '"]'); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var attrJson = function (o) { return JSON.stringify(o).replace(/'/g, "&#39;"); };
  var version = (document.querySelector("footer") || document.body).textContent.match(/v(\d+\.\d+\.\d+)/);
  version = version ? version[1] : "1.1.0";

  $("chart").innerHTML = charts.map(function (c, i) { return '<option value="' + i + '">' + esc(c.name) + "</option>"; }).join("");
  var start = charts.findIndex(function (c) { return c.id === "time-series-trio"; });
  $("chart").value = String(start > -1 ? start : 0);

  function fillColumns() {
    var c = charts[+$("chart").value];
    $("cols").innerHTML = c.cols.map(function (col) {
      return '<tr><td><code>' + esc(col.header) + '</code>' + (col.req ? "" : ' <span class="opt">optional</span>') + '</td>' +
        '<td><input type="text" data-key="' + esc(col.key) + '" data-kind="col" placeholder="' + esc(col.header) + '" aria-label="Your header for ' + esc(col.header) + '"></td>' +
        '<td><input type="text" data-key="' + esc(col.key) + '" data-kind="lab" placeholder="–" aria-label="On-screen name for ' + esc(col.header) + '"></td></tr>';
    }).join("");
    var metrics = c.cols.filter(function (col) { return /^v\d+$/.test(col.key) || col.key === "cost"; });
    $("lower").innerHTML = metrics.map(function (col) {
      return '<label><input type="checkbox" value="' + esc(col.key) + '"> ' + esc(col.header) + "</label>";
    }).join("");
    $("lowerbox").hidden = !metrics.length;
    $("minbox").hidden = !c.minVolume;
    $("demo").href = c.id + ".html";
    $("demo").textContent = "Open the " + c.name + " demo";
    root.querySelectorAll("input").forEach(function (el) { el.oninput = build; el.onchange = build; });
    build();
  }

  function build() {
    var c = charts[+$("chart").value], cols = {}, labs = {}, notes = [];
    root.querySelectorAll('input[data-kind="col"]').forEach(function (el) {
      var v = el.value.trim();
      if (v && v.replace(/\s+/g, "").toLowerCase() !== el.placeholder.replace(/\s+/g, "").toLowerCase()) { cols[el.dataset.key] = v; notes.push("Reads “" + v + "” as " + el.placeholder); }
    });
    root.querySelectorAll('input[data-kind="lab"]').forEach(function (el) {
      var v = el.value.trim();
      if (v) { labs[el.dataset.key] = v; notes.push("Shows " + (cols[el.dataset.key] || el.closest("tr").querySelector("code").textContent) + " as “" + v + "”"); }
    });
    var lower = Array.prototype.map.call(root.querySelectorAll('[data-b="lower"] input:checked'), function (el) { return el.value; });
    var title = $("title").value.trim(), height = $("height").value.trim() || "100%", min = $("min").value.trim();
    var mstr = $("platform").value === "mstr";
    var lines = ['<div data-chart-embed="' + c.script + '"'];
    if (Object.keys(cols).length) lines.push("     data-columns='" + attrJson(cols) + "'");
    if (Object.keys(labs).length) lines.push("     data-labels='" + attrJson(labs) + "'");
    if (title) { lines.push('     data-title="' + esc(title) + '"'); notes.push("Heading: " + title); }
    if (lower.length) { lines.push("     data-lower-better='" + attrJson(lower) + "'"); notes.push("A fall counts as good for " + lower.length + " metric" + (lower.length > 1 ? "s" : "")); }
    if (c.minVolume && min) { lines.push('     data-min-volume="' + esc(min) + '"'); notes.push("Months under " + min + " Units are flagged"); }
    if (mstr) lines.push('     data-grid-class="mstrmojo-Xtab" data-scroll-class="mstrmojo-scrollNode"');
    lines.push('     style="height:' + esc(height) + '"></div>');
    var snippet = lines.join("\n") + "\n<script>\n(function () {\n  var s = document.createElement(\"script\");\n  s.src = \"" + BASE + "/charts/" + c.script + "-" + version + ".js\";\n  s.integrity = \"" + c.sri + "\";\n  s.crossOrigin = \"anonymous\";\n  document.head.appendChild(s);\n})();\n</" + "script>";
    document.getElementById("bout").textContent = snippet;
    if (mstr) notes.push("Reads big MicroStrategy grids in full by scrolling them");
    if (!notes.length) notes.push("Uses the default header names – type yours on the left to map them");
    $("changes").innerHTML = notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
  }

  $("chart").onchange = fillColumns;
  $("platform").onchange = build;
  fillColumns();
})();
