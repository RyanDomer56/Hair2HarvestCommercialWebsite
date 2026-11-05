# Hair2Harvest — Design System

**Direction** Soil Ledger · **Registers** Editorial (marketing) + Instrument (workspace)

---

## 1. The idea

Hair2Harvest turns something a barber sweeps off the floor into something a farmer plants in. The design has to hold both ends of that: the **tactile, printed, slightly imperfect** world of a shop floor, and the **precise, measured, accountable** world of a lab notebook.

So there are two registers of one system:

- **Editorial** — the commercial site. Cream stock, olive ink, hairline rules, a high-contrast serif, numbered sections, ledger tables. It should read like a field journal someone kept carefully, not like a SaaS landing page.
- **Instrument** — the workspace. Soft lime sidebar, white cards, 14 px radii, tabular numbers. It should read like a well-made tool you trust with a number.

They share one palette, one type family, and one rule: **no decoration that does not carry information.**

### What this is not

Not a greenwashed eco-brand. No leaf icons in every heading, no watercolour gradients, no "🌱". The sustainability claim is made with measured kilograms, graded contamination, and lab numbers. The restraint *is* the argument.

---

## 2. Palette

Every colour is named for a material in the process.

| Token | Hex | Where it lives |
| --- | --- | --- |
| `paper` | `#F6F2E6` | Marketing canvas. Warm cream, never white. |
| `paper-raised` | `#FCFAF2` | Cards, inputs, lifted surfaces |
| `paper-sunk` | `#ECE6D4` | Recessed bands, table headers |
| `ink` | `#242A12` | Body and display text. Olive-black, never `#000`. |
| `ink-soft` | `#4C5136` | Secondary copy |
| `ink-mute` | `#7C8066` | Labels, metadata, captions |
| `moss` | `#47552A` | Primary actions, the brand |
| `moss-deep` | `#2C3518` | Hover, dark panels, the 3D frame |
| `lime` | `#D9F26B` | The one accent. Living matter. Use on ≤ 4 % of any screen. |
| `lime-soft` | `#EAF7B8` | Selection, subtle highlight |
| `clay` | `#B06B3E` | Warning, "minor" grade, soil |
| `rust` | `#A6402A` | Destructive, "mixed" grade, rejected |

**Rules**

- `lime` never carries body text and never fills a large area. It marks one thing per view.
- Status colour is semantic and fixed: `Clean → moss`, `Minor → clay`, `Mixed → rust`, `Held → ink-mute`.
- No pure white on the marketing surface. `#FFF` appears only inside the workspace.
- Gradients are not used for decoration. The only gradients in the system are the shadow inside the 3D viewport and the hair-strand canvas.

**Contrast** — `ink` on `paper` 14.8:1, `moss` on `paper` 7.4:1, `moss` on `lime` 8.1:1, `ink-mute` on `paper` 4.6:1. All pass AA at body size; `ink-mute` is restricted to ≥ 12 px and non-essential text.

---

## 3. Type

Two families, and only two.

**Montserrat** — display. Geometric, wide, with a large x-height that holds up at 6rem. It carries headlines, pull quotes, section heads and the big numbers. Set tight (`-0.035em`).

**Poppins** — everything else: body, UI, labels, identifiers, tabular figures. The mono role is retired; tracking and uppercase do that job now, not a third typeface.

### Emphasis is weight, not italic

A slanted geometric sans reads as a mistake at display sizes. So `<em>` is **500 → 700**, not roman → italic. The colour accent (`moss`, `lime`) does the second half of the work. One emphasised word per headline, never a whole line.

### Scale

| Role | Size | Line | Tracking | Family / weight |
| --- | --- | --- | --- | --- |
| Display XL | `clamp(3rem, 7.4vw, 6.6rem)` | 0.98 | −0.035em | Montserrat 500 |
| Display L | `clamp(2.3rem, 4.4vw, 3.9rem)` | 0.98 | −0.035em | Montserrat 500 |
| Display M | `clamp(1.7rem, 2.8vw, 2.4rem)` | 1.02 | −0.03em | Montserrat 500 |
| Emphasis inside display | inherit | inherit | −0.04em | Montserrat 700 |
| Numerals in display | inherit | 1 | −0.03em | Montserrat 600, tabular |
| Section label | 11 px | 1 | 0.2em | Poppins 500, uppercase |
| Body L | 1.0625 rem | 1.65 | 0 | Poppins 400 |
| Body | 0.9375 rem | 1.65 | 0 | Poppins 400 |
| UI | 0.875 rem | 1.4 | −0.01em | Poppins 500 |
| Micro / identifier | 0.6875 rem | 1.3 | 0.1em | Poppins 500, uppercase |

Numbers are always `font-variant-numeric: tabular-nums`. A weight that shifts column width while animating is a bug.

## 4. Space, grid, radius

- Base unit **4 px**. Spacing steps: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96.
- Page gutter `clamp(1.15rem, 4vw, 3.25rem)`; max content width **1320 px**, reading width **940 px**.
- Section rhythm `clamp(4rem, 8vw, 7.5rem)` — generous, because the content is sparse and the argument is slow.
- **Editorial radius: 3 px.** Media frames, cards, inputs. Almost square. It reads as printed matter.
- **Workspace radius: 14 px.** Cards, panels. Softer, because it is a tool you sit inside.
- Buttons are always fully round (`999px`) in both registers. The tension between a square card and a round button is the system's signature.

---

## 5. Surface and border

- One border weight: **1 px**, `color-mix(ink 14%, transparent)`. There is no 2 px border anywhere.
- Shadow is used **only** on the workspace (`.app-shadow`) and inside the 3D viewport. The marketing surface has none — depth comes from the paper/raised/sunk steps.
- No glassmorphism. No backdrop blur except inside the 3D scene's own chrome.
- Grain: a single 180 px `feTurbulence` tile at 14 % opacity, `mix-blend-mode: multiply`, on hero and section bands only. It exists so the cream reads as stock, not as a hex value.

---

## 6. Motion

- One easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce, no spring, no elastic.
- Durations: `180 ms` state, `350 ms` transform, `900 ms` entrance.
- Entrance is a single 14 px rise with fade, staggered by 60 ms, and it happens **once**. Nothing loops except the ticker and the live dot.
- The hair-strand canvas drifts at 0.06 px/frame — perceptible only if you stop to look.
- `prefers-reduced-motion: reduce` collapses every duration to 0.001 ms and freezes the canvas on its first frame. The 3D scene stops its animation loop and holds a composed frame.

---

## 7. Components

### Editorial

| Component | Spec |
| --- | --- |
| `SiteHeader` | 72 px, cream, hairline bottom rule appears after 24 px scroll. Wordmark + 4 links + 2 actions. Collapses to a full-height sheet under 900 px. |
| `SectionHead` | Numbered label (`01 — INTAKE`) + display headline + optional lede, max 46 ch. |
| `LedgerTable` | No vertical rules, 1 px horizontal only, mono identifiers, tabular numbers, hover row tint `paper-sunk`. |
| `SpecRow` | Label left in mono micro, value right in tabular sans. The workhorse of the materials section. |
| `StatBlock` | Number in Display L, unit in mono micro, caption below in `ink-mute`. No card, no border — sits on paper. |
| `Ticker` | Infinite marquee of pickup records. Pauses on hover. Purely decorative but factually seeded from real records. |
| `HairWeave` | Canvas of 120 strands that drift. Static frame under reduced motion. |
| `HarvestLine3D` | The interactive five-station machine. See §9. |

### Workspace

| Component | Spec |
| --- | --- |
| `AppSidebar` | 244 px, `#F5FADF`, logo + workspace label, nav with 36 px rows, active row = white pill + 1 px border + `app-shadow`, badge counts right-aligned, user card pinned bottom. |
| `KpiCard` | White, 14 px radius, 1 px border, icon + label row, 30 px number, delta chip (`+2 vs previous 7 days`), optional micro bar strip. |
| `TrendChart` | Hand-built SVG area + line. No chart library. Crosshair on hover, value tooltip, 1 px grid. |
| `DataTable` | Sticky header, zebra-free, 48 px rows, status pill, right-aligned numeric columns. |
| `StatusPill` | 999 px, 1 px border, dot + label, semantic colour at 8 % fill. |
| `CommandBar` | Search input with `⌘K` hint, pill shape, `#F7F9EC` fill. |

---

## 8. Copy

- Second person, present tense, short. "We collect it. You keep cutting hair."
- Numbers always carry units and a period: `4.2 kg`, `last 7 days`, `twice weekly`.
- Never claim a certification, a regulation, or a health outcome that the research has not verified. Where the evidence is thin, say so in the interface — an assumption stated is stronger than a claim implied.
- Shop-facing words are Taglish-friendly: *sako* (sack) is acceptable in the collector view, `sack` in the admin view.

---

## 9. The 3D machine diagram

`MCH-01` is the actual machine from Modules 5 and 6, not a generic factory — a **diagram you can turn**.

- Six assemblies: **motor & gearbox**, **rotary drum**, **hair intake**, **compost discharge**, **core probe**, **control cabinet**. Every one matches a line in the system specification.
- Visible mechanics: finned motor and spinning fan, belt with moving treads, toothed ring gear, transparent drum shell with helical paddles lifting a granular compost bed, hair falling into the hopper, crumbs leaving the chute, steam above the pile, and a temperature probe whose screen updates.
- Four modes: `Assembled`, `Cutaway` (clipping plane opens the shell), `Assemblies` (exploded, callouts de-collided), `One batch` (camera follows the material path).
- Five cameras: `Overview`, `Drum`, `Motor`, `Top`, `Flight`.
- Hover/click any assembly for its module and its rule. `window.__drum` exposes `setMode`, `setCamera`, `focusPart`, `play`, `pause`.
- The scene sits in an **instrument frame**: a top status rail, five telemetry readouts (rpm, core °C, moisture, batch, session) from `/api/v1/overview`, and a footer stating the hardware safety boundary.
- The rust-coloured E-stop on the cabinet is deliberate: the web panel only sends authorised start/stop; emergency stop, lid interlock and motor shutoff remain local hardware.
- All six assemblies also exist as a text list in the machine section below the hero. Nothing is only available in 3D.
- The scene inherits `--font-sans` for its DOM chrome and every canvas-painted texture — no system font anywhere.
- Under `prefers-reduced-motion` it renders one composed frame and stops. Without WebGL it shows a labelled fallback card, not a blank box.
