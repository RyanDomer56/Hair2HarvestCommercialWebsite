# Hair2Harvest — Hardware Systemization: v17 Chain-Drive Composter

**Version** 1.0 · **Date** 22 November 2026 · **Primary source** `Hair2Harvest_v17_Blueprint.pdf` + current 3D model  
**Status** Working baseline. Values from Three.js are **model-space**, not fabrication dimensions unless confirmed.

---

## 1. Purpose and system boundary

The v17 machine turns collected, graded barber hair into a composted output by slowly agitating a contained mix. The defining change from the earlier concept is:

> **The drum is stationary. The central shaft rotates.** A 12 V worm-gear motor drives the shaft through a 40T/10T roller chain. Five rings of three paddles lift and fold the material.

`[VERIFIED — BLUEPRINT + VERIFIED — CODE: apps/web/src/components/site/composting-drum-3d.tsx]`

The software boundary is equally important:

- Web/dashboard may show telemetry and request **authorised start/stop**.
- **E-stop, lid interlock, and motor shutoff remain local hardware.**
- The chain guard was deliberately removed from the public 3D view at the user’s request; do not describe a guard as present in the current viewer. `[VERIFIED — CODE: no guard geometry in current component]`

---

## 2. Subsystem register

| ID | Subsystem | Function | Motion | Evidence |
| --- | --- | --- | --- | --- |
| HW-01 | Square-tube frame | Supports drum, shaft bearings, motor, cabinet | Static | BLUEPRINT |
| HW-02 | Bulged drum shell | Contains hair/carbon/greens mix | **Stationary** | BLUEPRINT + CODE |
| HW-03 | Central shaft + paddles | Lifts, folds, and aerates the mix | Rotates | CODE |
| HW-04 | Chain drive | Transmits reduced motor speed to shaft | 40T/10T, 58 links | BLUEPRINT + CODE |
| HW-05 | 12 V worm-gear motor | Provides slow high-torque drive | Rotates | BLUEPRINT + CODE |
| HW-06 | Sliding top door + lock pin | Loading access and interlock point | Manual | BLUEPRINT |
| HW-07 | Discharge box + cabinet/tank | Unload finished material; house controls | Manual / static | BLUEPRINT |
| HW-08 | Safety and sensing | E-stop, lid interlock, shutoff, telemetry | Hardware + TO CONFIRM sensors | DESIGN RULE + TO CONFIRM |

---

## 3. Functional geometry

These values are from the current procedural model. Use them to explain proportions and relationships, **not as shop-fabrication dimensions**.

| Parameter | Model value | Meaning | Source |
| --- | --- | --- | --- |
| Drum centre | `x = -0.6`, `y = 5.5` | Position in model space | CODE |
| Drum length | `5.33` | Axial length, model space | CODE |
| Mid radius | `1.575` | Bulge at centre | CODE |
| Left end radius | `1.335` | Smaller end profile | CODE |
| Right end radius | `1.305` | Smaller end profile | CODE |
| Profile note | `Ø267 / Ø315 / Ø261` | Blueprint diameter note in code comment | BLUEPRINT — physical units TO CONFIRM |
| Paddle rings | `5` at x `-1.155, -0.405, 0.345, 1.095, 1.845` | Axial distribution | CODE |
| Paddles per ring | `3` | 120° apart; rings staggered by 40° | CODE |
| Big sprocket | `R = 0.82`, comment `40T, PCD 161.9 mm` | Keyed to mixing shaft | BLUEPRINT + CODE |
| Small sprocket | `R = 0.21` | Motor-side 10T | CODE |
| Chain links | `58` | Instanced moving links | CODE |
| Motor height | `y = 1.95` | Below shaft, slotted mount | CODE |
| Frame tube | `0.25` | Square-tube section in model | CODE |

### 3.1 Why the drum stays still

A rotating drum would require the shell, door, and discharge path to move together. The v17 design instead fixes the shell and rotates only the shaft. This makes the door simpler, keeps the discharge box accessible, and reduces the mass the motor must accelerate. It also matches the blueprint’s chain-drive layout.

---

## 4. Power and motion chain

```text
12 V DC supply [TO CONFIRM rating]
      ↓
Worm-gear motor (self-locking tendency [TO CONFIRM])
      ↓
10T motor sprocket
      ↓
roller chain — 58 modelled links
      ↓
40T shaft sprocket (PCD note 161.9 mm)
      ↓
central shaft on UCP205 pillow blocks + flanged end bushings
      ↓
5 rings × 3 paddles → material lifted and folded
```

The model animates the shaft at about `10 rpm` equivalent and the motor inversely faster; the displayed “SHAFT rpm” readout is telemetry-style presentation, not a measured physical speed unless the final blueprint confirms it. `[VERIFIED — CODE: animation loop + MachineFrame fallback]`

**Do not claim** torque, motor wattage, reduction ratio, or throughput until the final paper/blueprint is supplied. Mark them `TO CONFIRM`.

---

## 5. Operating sequence

1. **Pre-start** — confirm door closed and lock pin seated; confirm chain path clear; confirm E-stop released.
2. **Load** — place graded hair with carbon/greens input through the sliding top door. Exact recipe is a research parameter and must come from the final paper.
3. **Mix** — authorised start request; local hardware permits motor run; shaft turns paddles; web view shows status/telemetry.
4. **Sample** — after the composting/curing stage, a sample is taken for lab review. Sampling responsible role: Researcher.
5. **Discharge** — stop and isolate before opening; slide out discharge box; no access while shaft is running.
6. **Record** — batch stage, lab result, and decision are written in the system. Approval requires a reviewed result.

---

## 6. Safety hierarchy

| Layer | Control | Owner | Status |
| --- | --- | --- | --- |
| Physical | E-stop | Hardware | Design rule — VERIFIED as boundary |
| Physical | Lid/door interlock | Hardware | Design rule — implementation TO CONFIRM |
| Physical | Motor shutoff | Hardware | Design rule — implementation TO CONFIRM |
| Mechanical | Chain path guarded in physical build | Hardware | User removed it from the **viewer**; physical build TO CONFIRM |
| Electrical | Fuse / breaker / isolator | Hardware | TO CONFIRM |
| Software | Authorised start/stop only | Web/API | VERIFIED — CODE |
| Procedure | PPE, lockout before discharge | Team | TO CONFIRM in final SOP |

**Defence line:** “The website never holds the safety function. If the network, browser, or dashboard fails, local hardware still stops the machine.”

---

## 7. Sensing and telemetry

| Signal | Current digital representation | Physical sensor | Use |
| --- | --- | --- | --- |
| Shaft speed | `SHAFT … rpm` readout | TO CONFIRM | Operator status |
| Core temperature | `TEMP … °C` readout with small drift | TO CONFIRM | Process observation |
| Moisture | `MOISTURE … %` readout | TO CONFIRM | Process observation |
| Session time | `SESSION … min` readout | Derived/software | Traceability |
| Door state | Lock pin modelled; interlock implied | TO CONFIRM | Safety |

The current built-in values are presentation fallbacks from `MachineFrame`; do not present them as live sensor measurements unless the final hardware paper includes a validated sensor interface.

---

## 8. Maintenance and failure modes

| Check | Frequency | Symptom | Action |
| --- | --- | --- | --- |
| Chain tension | Before each run | Slip, uneven shaft motion | Adjust/replace chain |
| Sprocket alignment | Weekly [TO CONFIRM] | Chain walk, noise | Re-align |
| Shaft bearings / UCP205 | Each run / weekly [TO CONFIRM] | Rough rotation | Lubricate or replace |
| Door lock pin | Each run | Door opens during mixing | Stop and repair before use |
| Discharge box slide | Each discharge | Jam / spillage | Clear and clean |
| Cabinet/tank | Monthly [TO CONFIRM] | Leak / fault | Isolate and service |

---

## 9. Verification checklist before the defence

- [ ] Blueprint revision number printed in the hardware document.
- [ ] Physical dimensions copied from the final drawing, with units.
- [ ] Motor voltage, wattage, and reduction ratio confirmed.
- [ ] Chain guard status reconciled: removed from viewer; physical build decision stated.
- [ ] Sensor models and calibration method confirmed.
- [ ] E-stop/interlock/shutoff demonstration or photo available.
- [ ] Every TO CONFIRM item assigned to a person.
- [ ] 3D callout names match the figure/table register.
- [ ] Presenter can explain: drum stationary, shaft rotating, chain drive, local safety.

---

## 10. One-minute hardware explanation

> “The v17 machine keeps the drum still and rotates a central shaft through a 12-volt worm-gear motor and a 40-to-10 tooth chain drive. Five rings of three paddles lift and fold the mix. The top door and lock pin control loading, and the discharge box slides out after the run. The website shows telemetry and can request an authorised start or stop, but the emergency stop, lid interlock, and motor shutoff stay in local hardware. The 3D viewer is an explanatory diagram built from the blueprint; final fabrication values are still being reconciled with the drawing set.”
