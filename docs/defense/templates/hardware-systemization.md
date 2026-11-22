# [Machine Name] — Hardware Systemization

**Version** [x.y] · **Date** [YYYY-MM-DD] · **Source** [blueprint / measurement / assumption]

## 1. Purpose and boundary
The machine [function]. The web system may [authorised start/stop/telemetry view]. It may not [E-stop, lid interlock, motor shutoff].

## 2. Subsystem register
| ID | Subsystem | Function | Driven by | Verified from |
| --- | --- | --- | --- | --- |
| HW-01 | [Frame] | [Support and align] | — | [BLUEPRINT] |
| HW-02 | [Vessel] | [Contain the mix] | Stationary | [BLUEPRINT] |
| HW-03 | [Agitator] | [Lift and fold] | Shaft | [CODE] |
| HW-04 | [Drive] | [Reduce speed, transmit torque] | Motor | [BLUEPRINT] |
| HW-05 | [Access] | [Load / lock / unload] | Manual | [BLUEPRINT] |
| HW-06 | [Cabinet] | [Power and control] | Mains / DC | [TO CONFIRM] |
| HW-07 | [Sensing] | [Measure state] | [TO CONFIRM] | [TO CONFIRM] |
| HW-08 | [Safety] | [Stop and isolate] | Hardware | [DESIGN RULE] |

## 3. Functional geometry
| Parameter | Value | Unit / basis | Source |
| --- | --- | --- | --- |
| [Drum length] | [5.33] | model-space | [CODE] |
| [Mid diameter] | [315] | mm physical | [BLUEPRINT — TO CONFIRM] |

## 4. Power and motion chain
```text
[Power source] → [Motor] → [Reduction] → [Sprocket ratio] → [Shaft] → [Paddles]
```
State ratio and output speed only when verified.

## 5. Operating sequence
1. Pre-start check: [door locked, guards fitted, area clear].
2. Load: [material and carbon/greens input].
3. Mix: [shaft speed, interval].
4. Sample: [who, when, where].
5. Discharge: [lockout before access].
6. Log: [what the software records].

## 6. Safety hierarchy
1. **Physical** — E-stop, lid interlock, motor shutoff.
2. **Electrical** — [fuse/breaker/isolator — TO CONFIRM].
3. **Software** — authorised start/stop only; no safety function delegated to web.
4. **Procedure** — [PPE, lockout/tagout — TO CONFIRM].

## 7. Sensing and telemetry
| Signal | Source | Displayed as | Used for |
| --- | --- | --- | --- |
| [Temperature] | [TO CONFIRM] | [°C] | [Operator readout] |
| [Speed] | [TO CONFIRM] | [rpm] | [Status] |

## 8. Maintenance
| Interval | Check | Action |
| --- | --- | --- |
| Each run | Chain tension, door lock | Adjust / stop |
| [TO CONFIRM] | Bearings, bushings | Lubricate / replace |

## 9. Verification checklist
- [ ] Drawing revision matches the model.
- [ ] Every part in the callout list exists in the scene/paper.
- [ ] Safety boundary stated in both document and demo.
- [ ] All guessed values tagged `TO CONFIRM`.
