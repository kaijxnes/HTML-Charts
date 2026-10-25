# HTML Charts

Built and maintained by [Kai Jones](https://kaijxnes.com), data analyst.

41 free Chart.js charts for dashboards. Each one reads a grid on the same page – a MicroStrategy HTML container, a web page, or a Tableau/Looker extension – and redraws it. No API, no install, and no data leaves the browser.

**Site:** https://viz.kaijxnes.com/ · [Setup guide and snippet builder](https://viz.kaijxnes.com/platforms.html) · [About](https://viz.kaijxnes.com/about.html)

The home page can be filtered by chart type, number of metrics, number of dimensions and whether a date column is needed. Each chart has a page with a live demo on random data (hit *Shuffle data* to watch it redraw), the grid columns it reads, and a copy-paste snippet.

| Chart | Page | Script |
|---|---|---|
| Monthly Bars | `monthly-bars.html` | `charts/monthly-bars-1.2.0.js` |
| Stacked Segments | `stacked-segments.html` | `charts/stacked-segments-1.2.0.js` |
| Segment Breakdown | `segment-breakdown.html` | `charts/segment-breakdown-1.2.0.js` |
| Cost vs Return | `cost-vs-return.html` | `charts/cost-vs-return-1.2.0.js` |
| Month Heatmap | `month-heatmap.html` | `charts/month-heatmap-1.2.0.js` |
| KPI Scorecard | `kpi-scorecard.html` | `charts/kpi-scorecard-1.2.0.js` |
| Time Series Trio | `time-series-trio.html` | `charts/time-series-trio-1.2.0.js` |
| Funnel | `funnel.html` | `charts/funnel-1.2.0.js` |
| Change Bridge | `change-bridge.html` | `charts/change-bridge-1.2.0.js` |
| Pareto | `pareto.html` | `charts/pareto-1.2.0.js` |
| Target Pacing | `target-pacing.html` | `charts/target-pacing-1.2.0.js` |
| Quadrant Scatter | `quadrant-scatter.html` | `charts/quadrant-scatter-1.2.0.js` |
| Mix Shift | `mix-shift.html` | `charts/mix-shift-1.2.0.js` |
| Calendar Heatmap | `calendar-heatmap.html` | `charts/calendar-heatmap-1.2.0.js` |
| Year over Year | `year-over-year.html` | `charts/year-over-year-1.2.0.js` |
| Leaderboard | `leaderboard.html` | `charts/leaderboard-1.2.0.js` |
| Distribution | `distribution.html` | `charts/distribution-1.2.0.js` |
| Target Attainment | `target-attainment.html` | `charts/target-attainment-1.2.0.js` |
| Anomaly Watch | `anomaly-watch.html` | `charts/anomaly-watch-1.2.0.js` |
| Treemap | `treemap.html` | `charts/treemap-1.2.0.js` |
| Small Multiples | `small-multiples.html` | `charts/small-multiples-1.2.0.js` |
| Variance Table | `variance-table.html` | `charts/variance-table-1.2.0.js` |
| Gauges | `gauges.html` | `charts/gauges-1.2.0.js` |
| Combo Chart | `combo-chart.html` | `charts/combo-chart-1.2.0.js` |
| Flow (Sankey) | `flow-sankey.html` | `charts/flow-sankey-1.2.0.js` |
| Box Plot | `box-plot.html` | `charts/box-plot-1.2.0.js` |
| Radar Compare | `radar-compare.html` | `charts/radar-compare-1.2.0.js` |
| Bump Chart | `bump-chart.html` | `charts/bump-chart-1.2.0.js` |
| Indexed Growth | `indexed-growth.html` | `charts/indexed-growth-1.2.0.js` |
| Dumbbell | `dumbbell.html` | `charts/dumbbell-1.2.0.js` |
| Correlation Matrix | `correlation-matrix.html` | `charts/correlation-matrix-1.2.0.js` |
| Time Series Stack | `time-series-stack.html` | `charts/time-series-stack-1.2.0.js` |

The site also has variant pages (e.g. *Time Series – 2 metrics*, *Funnel – no segments*) that reuse one of these scripts with fewer columns in the grid – every chart only draws what it finds.

## How it works

The snippet adds a placeholder `<div data-chart-embed="…">` and loads the chart script, pinned with an SRI hash. The script reads the grid on the same page from what's on screen and draws the chart in the viewer's browser. It only downloads the chart script and Chart.js. No data is sent anywhere.

Charts look for generic headers (`Month Key`, `Metric 1`, `Dimension A`, …). To use your own header names, map them on the placeholder with `data-columns='{"v12":"Your Header"}'`. `data-labels` changes only the names shown on screen, and `data-title` changes the heading.

## Versioning

Published files are never edited. A change means a new file (e.g. `monthly-bars-1.3.0.js`), a new SRI hash and a new snippet.

- **1.2.0** – Chart.js loads from viz.kaijxnes.com; small wording fixes ("1 metric", treemap zoom hint only when there's a second level).
- **1.1.0** – the count column is called Units (key `units`); Cost vs Return's cost column is Cost.

Older versions stay online so existing snippets keep working.

## Third party

`chart.umd-4.4.1.js` is an unmodified copy of [Chart.js](https://www.chartjs.org/) 4.4.1 (MIT, see `LICENSE-chartjs.md`).
