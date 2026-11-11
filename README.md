# HTML Charts

Built and maintained by [Kai Jones](https://kaijxnes.com), data analyst.

43 free charts for dashboards. Each one reads a grid on the same page – a MicroStrategy HTML container, a web page, or a Tableau/Looker extension – and redraws it. No API, no install, and no data leaves the browser.

**Site:** https://viz.kaijxnes.com · [Setup guide and snippet builder](https://viz.kaijxnes.com/platforms) · [About](https://viz.kaijxnes.com/about)

The home page can be filtered by chart type, number of metrics, number of dimensions and whether a date column is needed. Each chart has a page with a live demo on random data (hit *Shuffle data* to watch it redraw), the grid columns it reads, and a copy-paste snippet.

| Chart | Page | Script |
|---|---|---|
| Monthly Bars | `monthly-bars.html` | `charts/monthly-bars-1.4.3.js` |
| Stacked Segments | `stacked-segments.html` | `charts/stacked-segments-1.4.3.js` |
| Segment Breakdown | `segment-breakdown.html` | `charts/segment-breakdown-1.4.3.js` |
| Cost vs Return | `cost-vs-return.html` | `charts/cost-vs-return-1.4.3.js` |
| Month Heatmap | `month-heatmap.html` | `charts/month-heatmap-1.4.3.js` |
| KPI Scorecard | `kpi-scorecard.html` | `charts/kpi-scorecard-1.4.3.js` |
| Time Series Trio | `time-series-trio.html` | `charts/time-series-trio-1.4.4.js` |
| Funnel | `funnel.html` | `charts/funnel-1.4.3.js` |
| Change Bridge | `change-bridge.html` | `charts/change-bridge-1.4.3.js` |
| Pareto | `pareto.html` | `charts/pareto-1.4.3.js` |
| Target Pacing | `target-pacing.html` | `charts/target-pacing-1.4.3.js` |
| Quadrant Scatter | `quadrant-scatter.html` | `charts/quadrant-scatter-1.4.3.js` |
| Mix Shift | `mix-shift.html` | `charts/mix-shift-1.4.4.js` |
| Calendar Heatmap | `calendar-heatmap.html` | `charts/calendar-heatmap-1.4.3.js` |
| Year over Year | `year-over-year.html` | `charts/year-over-year-1.4.3.js` |
| Leaderboard | `leaderboard.html` | `charts/leaderboard-1.4.3.js` |
| Distribution | `distribution.html` | `charts/distribution-1.4.3.js` |
| Target Attainment | `target-attainment.html` | `charts/target-attainment-1.4.3.js` |
| Anomaly Watch | `anomaly-watch.html` | `charts/anomaly-watch-1.4.3.js` |
| Treemap | `treemap.html` | `charts/treemap-1.4.3.js` |
| Small Multiples | `small-multiples.html` | `charts/small-multiples-1.4.3.js` |
| Variance Table | `variance-table.html` | `charts/variance-table-1.4.3.js` |
| Gauges | `gauges.html` | `charts/gauges-1.4.3.js` |
| Combo Chart | `combo-chart.html` | `charts/combo-chart-1.4.3.js` |
| Flow (Sankey) | `flow-sankey.html` | `charts/flow-sankey-1.4.3.js` |
| Box Plot | `box-plot.html` | `charts/box-plot-1.4.3.js` |
| Radar Compare | `radar-compare.html` | `charts/radar-compare-1.4.3.js` |
| Bump Chart | `bump-chart.html` | `charts/bump-chart-1.4.3.js` |
| Indexed Growth | `indexed-growth.html` | `charts/indexed-growth-1.4.3.js` |
| Dumbbell | `dumbbell.html` | `charts/dumbbell-1.4.3.js` |
| Correlation Matrix | `correlation-matrix.html` | `charts/correlation-matrix-1.4.3.js` |
| Value Matrix | `value-matrix.html` | `charts/value-matrix-1.4.3.js` |
| Contribution Breakdown | `contribution-breakdown.html` | `charts/contribution-breakdown-1.4.3.js` |
| Time Series Stack | `time-series-stack.html` | `charts/time-series-stack-1.4.3.js` |

The site also has variant pages (e.g. *Time Series – 2 metrics*, *Funnel – no segments*) that reuse one of these scripts with fewer columns in the grid – every chart only draws what it finds.

## How it works

The snippet adds a placeholder `<div data-chart-embed="…">` and loads the chart script, pinned with an SRI hash. The script reads the grid on the same page from what's on screen and draws the chart in the viewer's browser. It only downloads the chart script and Chart.js. No data is sent anywhere.

Charts look for generic headers (`Month Key`, `Metric 1`, `Dimension A`, …). To use your own header names, map them on the placeholder with `data-columns='{"v12":"Your Header"}'`. `data-labels` changes only the names shown on screen, and `data-title` changes the heading. `data-date-format` pins how dates are written in the grid (tokens `YYYY YY MMMM MMM MM M DD D ww`; anything else is matched as written). Without it the format is detected. `data-hide-while-reading="false"` keeps a big grid visible while the chart scrolls it to read every row.

## Privacy

The website uses Google Analytics only after a visitor accepts (`assets/consent.js`); the choice can be changed from *Cookie settings* in the footer. The chart scripts contain no analytics and send no data. See [Privacy](https://viz.kaijxnes.com/privacy).

## Versioning

Published files are never edited. A change means a new file (e.g. `monthly-bars-1.3.0.js`), a new SRI hash and a new snippet.

- **1.4.4** (Mix Shift) – *Layout* switch: stacked, side by side, or a line per segment (`data-layout="side"` / `"line"` to start there); fits short containers (minimum height 380px, scrolls inside if needed).
- **1.4.4** (Time Series Trio) – *Compare with: Last year*: the scorecards compare the latest period with the same weeks, days or months a year earlier (same ISO week number for weekly data), and each chart shows the latest year with last year as a dashed line. `data-compare="prev"` starts on the previous-period comparison instead.
- **1.4.3** – new chart: **Contribution Breakdown** (bars by any dimension split by up to two others; no date needed).
- **1.4.3** – new chart: **Value Matrix** (heatmap of value per unit across two dimensions, weighted by volume; no date needed).
- **1.4.3** – all charts: while a chart scrolls a big grid to read every row, the grid is hidden so it doesn't visibly jump, then shown again (`data-hide-while-reading="false"` turns this off). Includes the 1.4.2 changes below.
- **1.4.2** (Cost vs Return) – fits its container: the charts grow and shrink with the space and the monthly table scrolls inside the chart instead of forcing a 900px height.
- **1.4.2** (Mix Shift) – a *Compare with* control: the latest month against the same month last year (default), the month before, or the first month in the grid.
- **1.4.1** – fixes grids where the row headers and the metrics sit in separate side-by-side panes (as in MicroStrategy): a column's header no longer swallows its whole pane.
- **1.4.0** – every chart reads dates the same way: auto-detects 20261023, 2026-10-23, 23/10/2026, 10/23/2026, 23 Oct 2026, 2026 W44, 202610, Oct 2026 and October, 2026, and monthly charts roll daily or weekly dates up to months. `data-date-format` (e.g. `"DD/MM/YYYY"`, `"YYYY Www"`) pins a format; each chart page and the snippet builder has a picker for it. If dates can't be read, the chart says which value it couldn't read.
- **1.3.0** (Time Series Trio only) – reads week labels such as `2026 W44`, `2026-W44` or `Week 44, 2026` as ISO weeks, with week ranges (1, 4, 13, 52 weeks), weekly or monthly grouping and per-week averages.
- **1.2.0** – Chart.js loads from viz.kaijxnes.com; small wording fixes ("1 metric", treemap zoom hint only when there's a second level).
- **1.1.0** – the count column is called Units (key `units`); Cost vs Return's cost column is Cost.

Older versions stay online so existing snippets keep working.

## Third party

`chart.umd-4.4.1.js` is an unmodified copy of [Chart.js](https://www.chartjs.org/) 4.4.1 (MIT, see `LICENSE-chartjs.md`).
