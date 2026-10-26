// Snippet builder on the setup guide: pick a chart, map your header names, copy the snippet.
// Runs entirely in the page – nothing you type is sent anywhere.
(function () {
  var root = document.querySelector("[data-builder]");
  var dataEl = document.getElementById("chart-data");
  if (!root || !dataEl) return;
  var BASE = "https://viz.kaijxnes.com";
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
    $("demo").href = "/" + c.id;
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
    var plat = $("platform").value, mstr = plat === "mstr";
    var lines = ['<div data-chart-embed="' + c.script + '"'];
    if (Object.keys(cols).length) lines.push("     data-columns='" + attrJson(cols) + "'");
    if (Object.keys(labs).length) lines.push("     data-labels='" + attrJson(labs) + "'");
    if (title) { lines.push('     data-title="' + esc(title) + '"'); notes.push("Heading: " + title); }
    if (lower.length) { lines.push("     data-lower-better='" + attrJson(lower) + "'"); notes.push("A fall counts as good for " + lower.length + " metric" + (lower.length > 1 ? "s" : "")); }
    if (c.minVolume && min) { lines.push('     data-min-volume="' + esc(min) + '"'); notes.push("Months under " + min + " Units are flagged"); }
    if (mstr) lines.push('     data-grid-class="mstrmojo-Xtab" data-scroll-class="mstrmojo-scrollNode"');
    var h = plat === "tableau" ? "100vh" : (plat === "web" && height === "100%") ? "600px" : height;
    lines.push('     style="height:' + esc(h) + '"></div>');
    var placeholder = lines.join("\n");
    var src = BASE + "/charts/" + c.script + "-" + version + ".js";
    var loaderBody = '  var s = document.createElement("script");\n  s.src = "' + src + '";\n  s.integrity = "' + c.sri + '";\n  s.crossOrigin = "anonymous";\n  document.head.appendChild(s);';
    var loadFn = "function loadChart() {\n" + loaderBody + "\n}";
    var writeTable = 'function writeTable(headers, rows) {\n  var t = document.getElementById("grid");\n  if (!t) { t = document.createElement("table"); t.id = "grid"; document.body.appendChild(t); }\n' +
      '  t.innerHTML = "<thead><tr>" + headers.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" +\n' +
      '    rows.map(function (r) { return "<tr>" + r.map(function (v) { return "<td>" + v + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody>";\n}';
    var ws = ($("src").value || "Chart data").replace(/"/g, '\\"');
    var out, label, steps;
    if (plat === "mstr" || plat === "web") {
      out = placeholder + "\n<script>\n(function () {\n" + loaderBody + "\n})();\n</" + "script>";
      label = plat === "mstr" ? "MicroStrategy HTML container" : "Web page";
      steps = plat === "mstr"
        ? ["Add a grid with these columns to the same dossier page, behind the chart.", "Add an HTML container, choose HTML Text, and paste this in.", "Point filters at the grid, then check it in presentation mode."]
        : ["Put this next to a table (or grid) with these column headers on the same page.", "Hide the table with CSS if you only want the chart – keep it in the page.", "Change the height in the style if you need more room."];
    } else if (plat === "tableau") {
      label = "Tableau extension page (index.html)";
      out = "<!doctype html>\n<html>\n<head><meta charset=\"utf-8\"></head>\n<body style=\"margin:0\">\n" + placeholder +
        "\n<!-- Tableau Extensions API library, downloaded from Tableau and hosted next to this file -->\n<script src=\"tableau.extensions.1.latest.min.js\"></" + "script>\n<script>\n" + writeTable + "\n\n" + loadFn +
        "\n\ntableau.extensions.initializeAsync().then(async function () {\n  var ws = tableau.extensions.dashboardContent.dashboard.worksheets.find(function (w) { return w.name === \"" + ws + "\"; });\n" +
        "  async function refresh() {\n    var reader = await ws.getSummaryDataReaderAsync();\n    var table = await reader.getAllPagesAsync();\n    await reader.releaseAsync();\n" +
        "    writeTable(table.columns.map(function (c) { return c.fieldName; }),\n               table.data.map(function (row) { return row.map(function (v) { return v.formattedValue; }); }));\n  }\n" +
        "  await refresh();\n  loadChart();\n  // redraw when filters change the worksheet\n  ws.addEventListener(tableau.TableauEventType.FilterChanged, refresh);\n});\n</" + "script>\n</body>\n</html>";
      steps = ["Add a worksheet called “" + ($("src").value || "Chart data") + "” with the chart's fields to the dashboard (it can be tiny or hidden).",
               "Host this page and the Tableau Extensions API file somewhere your Tableau site allows, and create a .trex manifest pointing at it.",
               "Add an Extension object to the dashboard and choose the .trex file. Field names act as the chart's headers."];
    } else if (plat === "looker") {
      label = "Looker custom visualization (.js)";
      out = writeTable + "\n\n" + loadFn + "\n\nlooker.plugins.visualizations.add({\n  create: function (element) {\n    element.innerHTML = `" + placeholder.replace(/`/g, "\\`") + "`;\n    loadChart();\n  },\n" +
        "  updateAsync: function (data, element, config, queryResponse, details, done) {\n    var f = queryResponse.fields.dimension_like.concat(queryResponse.fields.measure_like);\n" +
        "    writeTable(f.map(function (x) { return x.label_short || x.label; }),\n               data.map(function (row) { return f.map(function (x) { return row[x.name].rendered || row[x.name].value; }); }));\n    done();\n  }\n});";
      steps = ["Host this file somewhere Looker can reach.", "Register it under Admin → Visualizations (or in a LookML project manifest).",
               "In an Explore, pick dimensions and measures whose short labels match the chart's headers, then choose this visualization."];
    } else if (plat === "pbi") {
      label = "Power BI custom visual – src/visual.ts (sketch)";
      out = "// Bundle Chart.js first (so window.Chart exists), then this chart script:\n//    " + src + "\n// Power BI visuals run in a sandbox and shouldn't load scripts from the internet.\n\n" +
        "const PLACEHOLDER = `" + placeholder.replace(/`/g, "\\`") + "`;\n\n" + writeTable.replace("function writeTable(headers, rows)", "function writeTable(headers: string[], rows: any[][])") +
        "\n\nexport class Visual implements IVisual {\n  constructor(options: VisualConstructorOptions) {\n    options.element.innerHTML = PLACEHOLDER;\n    // the bundled chart script finds this placeholder by itself\n  }\n" +
        "  public update(options: VisualUpdateOptions) {\n    const t = options.dataViews[0].table;\n    writeTable(t.columns.map(c => c.displayName),\n               t.rows.map(r => r.map(v => String(v))));\n  }\n}";
      steps = ["Create a visual with the pbiviz tools (pbiviz new) and add a table data role.", "Bundle the chart script and Chart.js into the visual instead of loading them from the web.",
               "Package it (pbiviz package) and import it into the report. Your organisation may need to approve custom visuals first."];
    } else {
      label = "Qlik Sense extension (sketch)";
      out = writeTable + "\n\n" + loadFn + "\n\ndefine([], function () {\n  return {\n    initialProperties: { qHyperCubeDef: { qDimensions: [], qMeasures: [], qInitialDataFetch: [{ qWidth: 10, qHeight: 1000 }] } },\n" +
        "    definition: { type: \"items\", component: \"accordion\", items: { dimensions: { uses: \"dimensions\" }, measures: { uses: \"measures\" } } },\n" +
        "    paint: function ($element, layout) {\n      var hc = layout.qHyperCube;\n      writeTable(hc.qDimensionInfo.concat(hc.qMeasureInfo).map(function (f) { return f.qFallbackTitle; }),\n" +
        "                 hc.qDataPages[0].qMatrix.map(function (row) { return row.map(function (c) { return c.qText; }); }));\n" +
        "      if (!$element.find(\"[data-chart-embed]\").length) { $element.html(`" + placeholder.replace(/`/g, "\\`") + "`); loadChart(); }\n    }\n  };\n});";
      steps = ["Create an extension folder with this .js file and a .qext file.", "Import it in the Qlik management console (or put it in the Extensions folder).",
               "Add it to a sheet and choose dimensions and measures named like the chart's headers."];
    }
    document.getElementById("bout").textContent = out;
    var bar = document.getElementById("bout").closest(".code").querySelector(".bar span");
    if (bar) bar.textContent = label;
    $("srcbox").hidden = plat !== "tableau";
    if (mstr) notes.push("Reads big MicroStrategy grids in full by scrolling them");
    if (!mstr && plat !== "web") notes.push("Writes the platform's data into a table, then the chart reads it – not tested on " + $("platform").selectedOptions[0].text + " yet");
    if (!notes.length) notes.push("Uses the default header names – type yours on the left to map them");
    $("changes").innerHTML = notes.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
    $("steps").innerHTML = steps.map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
  }

  $("chart").onchange = fillColumns;
  $("platform").onchange = build;
  $("src").oninput = build;
  fillColumns();
})();
