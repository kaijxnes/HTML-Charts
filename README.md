# HTML Charts

Built and maintained by [Kai Jones](https://kaijxnes.com), data analyst.

Custom Chart.js charts for HTML containers, hosted on GitHub Pages.

**Site:** https://kaijxnes.github.io/HTML-Charts/

Each chart has a page with a live demo on random data (hit *Shuffle data* to watch it redraw), the grid columns it reads, and a copy-paste snippet.

| Chart | Page | Script |
|---|---|---|
| Monthly Bars | `monthly-bars.html` | `charts/monthly-bars-1.0.0.js` |
| Stacked Segments | `stacked-segments.html` | `charts/stacked-segments-1.0.0.js` |
| Segment Breakdown | `segment-breakdown.html` | `charts/segment-breakdown-1.0.0.js` |
| Cost vs Return | `cost-vs-return.html` | `charts/cost-vs-return-1.0.0.js` |
| Month Heatmap | `month-heatmap.html` | `charts/month-heatmap-1.0.0.js` |
| KPI Scorecard | `kpi-scorecard.html` | `charts/kpi-scorecard-1.0.0.js` |
| Time Series Trio | `time-series-trio.html` | `charts/time-series-trio-1.0.0.js` |
| Funnel | `funnel.html` | `charts/funnel-1.0.0.js` |
| Change Bridge | `change-bridge.html` | `charts/change-bridge-1.0.0.js` |
| Pareto | `pareto.html` | `charts/pareto-1.0.0.js` |
| Target Pacing | `target-pacing.html` | `charts/target-pacing-1.0.0.js` |

## How it works

The snippet adds a placeholder `<div data-chart-embed="…">` and loads the chart script, pinned with an SRI hash. The script reads the grid on the same page from what's on screen and draws the chart in the viewer's browser. It only downloads the chart script and Chart.js. No data is sent anywhere.

Charts look for generic headers (`Month Key`, `Metric 1`, `Dimension A`, …). To use your own header names, map them on the placeholder with `data-columns='{"v12":"Your Header"}'`. `data-labels` changes only the names shown on screen, and `data-title` changes the heading.

## Versioning

Published files are never edited. A change means a new file (e.g. `monthly-bars-1.1.0.js`), a new SRI hash and a new snippet.

## Third party

`chart.umd-4.4.1.js` is an unmodified copy of [Chart.js](https://www.chartjs.org/) 4.4.1 (MIT, see `LICENSE-chartjs.md`).
