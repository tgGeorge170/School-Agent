# Treći razred — Tehničar CNC tehnologije

Reference notes on the official Republika Srpska curriculum for **Техничар CNC
технологије** (sector: Машинство и обрада метала), 3rd year (III разред).
Source: [Republički pedagoški zavod RS](https://rpz-rs.org/nastavni-planovi-srednja-skola/)
official curriculum package for this profile.

Years 1–2 build the foundations (mechanics, materials, technical drawing,
computer graphics, measuring technique). **3rd year is where CNC programming
and machine operation actually start** — everything before this was building
toward it.

## Core vocational subjects

### CNC програмирање (CNC Programming)

The centerpiece subject, 3 modules:

1. **Програмирање НУМА** — CNC fundamentals: coordinate systems, reference
   points (machine zero, workpiece zero, tool zero), G-codes and M-codes,
   absolute vs. incremental positioning, reading technical/technological
   documentation.
2. **Програмирање НУМА глодалица** — CNC **milling** programming: face
   milling, contour milling (with tool radius compensation), slots and
   pockets, holes, thread milling.
3. **Програмирање НУМА струга** — CNC **turning** programming: contour
   turning, grooving, drilling on the lathe, thread turning.

### Практична настава (Shop / Practical Training)

Hands-on, also 3 modules:

1. **Обрада на стругу** — manual/conventional lathe work: turning tools,
   longitudinal turning, tapers, grooving.
2. **Обрада на глодалици и брусилици** — conventional milling & grinding:
   milling tools, flat surface machining, angle milling, dividing head
   (indexing) work.
3. **Припрема НУМА за рад** — actual CNC machine operation: setting up
   mills and lathes, running the control unit, preparing tools /
   workholding / measuring equipment, setting zero points, producing and
   **inspecting** parts on both CNC mill and CNC lathe.

### Технологија обраде (Machining Technology theory)

The "why" behind the practice: cutting theory fundamentals, sawing,
turning, drilling, milling, then broaching, grinding/honing, thread and
gear cutting, non-conventional machining, and how to design a
technological process.

### Машински елементи (Machine Elements)

Shafts, bearings, couplings, then gears (spur, bevel), worm drives, chain
and belt drives.

### Моделирање и симулација помоћу рачунара (CAD Modeling & Simulation)

3D modeling of everything from Mašinski elementi (shafts, bearings, gears,
gear trains, chain/belt drives) plus building out technical documentation.

### Рачунари и програмирање (Computers & Programming)

General programming in C/C++ (linear and branching program structures) —
not CNC-specific, more of a general computing skill.

### Хидраулика и пнеуматика (Hydraulics & Pneumatics)

Hydraulic system fundamentals, laws, and schematic symbols — used
constantly in machine tools and industrial automation.

### Термодинамика (Thermodynamics)

Gas laws, heat transfer, thermodynamic cycles, then heating/cooling basics
and power plant fundamentals.

### Основи предузетништва (Entrepreneurship Basics)

What entrepreneurship is, entrepreneur profile, then business plans,
marketing, and finance basics.

## General subjects

Math, Serbian language, foreign language (English/German/Italian/Russian),
PE, plus one elective from the Вјеронаука / Етика / Демократија и људска
права / Култура религија block.

## Why the feeds & speeds calculator matters this year

Both *CNC програмирање* and *Технологија обраде* explicitly call for
choosing **режими обраде** (machining regimes/cutting parameters) — that's
speeds and feeds. `index.html` in this repo is directly on-syllabus, not
just a side tool.

## Sources

- [RPZ RS — Наставни планови, средња школа (Машинство и обрада метала)](https://rpz-rs.org/nastavni-planovi-srednja-skola/)
- [RPZ RS — Наставни програми, средње стручне школе](https://rpz-rs.org/nastavni-programi-sss/)
- [RPZ RS — official curriculum package: Техничар CNC технологије](https://rpz-rs.org/wp-content/uploads/2025/08/Техничар-cnc-технологије.zip)
- [Micro Mreža — Tehnička škola Gradiška director on CNC/technician programs](https://micromreza.com/posao-poslije-skole-direktor-tehnicke-skole-gradiska-otkriva-koja-zanimanja-imaju-buducnost/)
