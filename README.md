# School-Agent

Small tools to help with CNC machining coursework at Tehnička Škola Gradiška.

## Feeds & Speeds Calculator (`index.html`)

A single self-contained HTML file — no install, no server, works offline.
Just open `index.html` in a browser (or host it on GitHub Pages).

Given operation (milling / drilling / turning), workpiece material, tool
material, and tool/workpiece diameter, it estimates:

- **Spindle speed (RPM)** from the material's recommended cutting speed (Vc)
- **Feed rate** from chip load per tooth (milling/drilling) or feed per
  revolution (turning)

Metric is the default (mm, m/min) with an Imperial toggle (in, SFM) for
following English-language references. Suggested chip loads and cutting
speeds are reasonable starting points for a school shop, not a substitute
for the tool manufacturer's data — always verify and adjust from chip
color, sound, and finish, especially on an unfamiliar material or setup.
