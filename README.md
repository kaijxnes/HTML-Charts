# HTML-Charts

A pinned, self-hosted copy of **Chart.js 4.4.1**, used by the MicroStrategy (MSTR) HTML-container dashboards
(Value Curve, Cohort Contribution, Static Cohort Breakdown, Spend vs Performance).

It is served through GitHub Pages at:

    https://kaijxnes.github.io/HTML-Charts/chart.umd-4.4.1.js

## What's in here

| File | What it is |
|---|---|
| `chart.umd-4.4.1.js` | Chart.js 4.4.1, byte-for-byte the official `dist/chart.umd.js` from the npm package `chart.js@4.4.1` (registry.npmjs.org) |
| `LICENSE-chartjs.md` | Chart.js MIT licence – (c) Chart.js Contributors |

**No data is stored or collected here.** This repo only holds an open-source charting library. The dashboards
draw their charts in the viewer's browser; nothing is sent back to this site.

## Integrity

The dashboards load this file with a Subresource Integrity (SRI) check, so the browser refuses to run it if even
one byte has changed – whether here or on the fallback CDN.

- SRI: `sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG`
- SHA-256: `74401d738dd3e03ee5dfb3b6841210fe2c4ead8a960c4011ca4ba0b78a9fd8f3`

To verify: `openssl dgst -sha384 -binary chart.umd-4.4.1.js | openssl base64 -A` should print the SRI value
above (after the `sha384-` prefix).

## Rules for this repo

- Don't edit `chart.umd-4.4.1.js`. Any change breaks the integrity check and the dashboards will refuse it
  (they then fall back to the identical official file on jsDelivr).
- To upgrade Chart.js, add a **new** file (e.g. `chart.umd-4.5.0.js`) and update the URL **and** SRI hash in the
  dashboards together.
