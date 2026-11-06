# Hair2Harvest — Commercial Website & Operations System

A commercial web presence and operations workspace for a barbershop hair-to-compost network in Bataan, Philippines. React + TypeScript on the front, Express + MongoDB behind it.

**Live:** https://hair2harvest-commercial-website.vercel.app

> **The decision everything else follows from:** shops are records, not users. A barbershop never signs up, never logs in, never resets a password. Staff register it on site in about two minutes and write a code on its sack.

---

## What is in here

```
hair2harvest/
├── apps/
│   ├── web/          Next.js 16 · App Router · TypeScript · Tailwind v4
│   │   ├── (site)    commercial surface — editorial, static, SEO
│   │   └── (app)     operations workspace — dashboard, shops, pickups, batches, lab
│   └── api/          Express 5 · Mongoose 9 · MongoDB · zod
├── docs/
│   ├── 01-system-design.md    modules, roles, status machines, NFRs
│   ├── 02-design-system.md    "Soil Ledger" — palette, type, motion, components
│   └── 03-data-model.md       collections, invariants, REST contract
└── package.json      npm workspaces
```

## Routes

**Public site** — every page here is linked from the navigation and indexed.

| Route | Content |
| --- | --- |
| `/` | Hero, live 3D harvest line, problem, process, network, materials, evidence |
| `/system` | Station detail, grading standard, pickup rules, batch timeline, roles |
| `/network` | Filterable shop directory, pickup rules, contact |
| `/impact` | Collection chart, lab register, batch mass balance, planting trials |
| `/partner` | Registration form with consent capture |

**Operations workspace** — built but deliberately unlinked. No public page points at it and
`robots.txt` disallows it, so it is reachable by URL only, for staff. It is kept in the
codebase so it can be handed over or re-exposed on request.

| Route | Content |
| --- | --- |
| `/dashboard` | Operations overview |
| `/dashboard/shops`, `/pickups`, `/batches` | Shops, collection, composting |
| `/dashboard/inventory`, `/machine`, `/lab` | Stock, machine telemetry, lab results |
| `/dashboard/experiments`, `/reports` | Planting trials, exports and audit trail |

---

## Run it

```bash
npm install

# web only (uses bundled fixture data)
npm run dev            # http://localhost:3000

# api
cp apps/api/.env.example apps/api/.env
npm run dev:api        # http://localhost:4000
npm run seed           # loads 8 shops, 7 pickups, 5 batches, 1 lab report

# point the site's partner form at the API
echo "API_URL=http://localhost:4000" >> apps/web/.env.local
```

```bash
npm run build          # production build of the web app
npm run typecheck
```

The marketing site renders from typed fixtures in `apps/web/src/lib/data.ts` so it builds and deploys with no database. The workspace pages read the same fixtures; swap them for `fetch` calls to `apps/api` when you wire the live data.

---

## Backend

**It already exists.** `apps/api` is a full Express 5 + Mongoose 9 service for MongoDB — it was built
in the first pass but not deployed, because Vercel is serverless and will not keep a long-running
Express process alive. Until now the site rendered from typed fixtures in `apps/web/src/lib/data.ts`.

| Layer | What it holds |
| --- | --- |
| Models | `shops`, `pickups`, `batches`, `labresults`, `users`, `auditlogs` (append-only) |
| Routes | `/api/v1/shops`, `/pickups`, `/pickups/route`, `/batches`, `/lab`, `/overview`, `/health` |
| Rules | Net kg derived from gross − tare; idempotent offline sync on `clientId`; a batch cannot be approved without a reviewed lab result; only clean/minor untreated stock enters a batch |
| Seed | `npm run seed` — 8 shops, 7 pickups, 5 batches, 1 lab report |

### Run the whole stack

```bash
docker compose up -d              # MongoDB 7 on :27017
cp apps/api/.env.example apps/api/.env
npm run dev:api                   # Express on :4000
npm run seed                      # load the pilot data
cp apps/web/.env.example apps/web/.env.local
npm run dev                       # Next on :3000
```

`docker compose --profile tools up -d` also starts mongo-express on `:8081`.

### How the site consumes it

The deployed site already exposes the same read endpoints (`/api/v1/overview`, `/shops`, `/pickups`,
`/batches`, `/lab`, `/health`). Set `API_URL` in the Vercel project environment to point them at the
hosted Express service and they become a read-through to MongoDB. Unset, they return the fixtures —
so the site never shows a broken state, and the swap is a single env var.

`GET /api/v1/health` reports exactly which source is in use. `POST /api/v1/shops` (the partner form)
forwards to Express when `API_URL` is set, otherwise returns `202 { reference }` and queues the visit.

`ShopDirectory` and the machine telemetry read live through `lib/api-client.ts`, which caches the
last good response and always falls back to fixtures on a network failure.

## The 3D machine

`apps/web/src/components/site/composting-drum-3d.tsx` is a procedural three.js model of **MCH-01**,
the rotary composting drum from Modules 5 and 6 — not a generic factory.

- A finned motor, cooling fan and gearbox drive a belt with moving treads around the drum shaft; a
  toothed ring gear turns a transparent barrel whose helical paddles lift a granular compost bed.
- Hair falls through the intake hopper, crumbs leave the discharge chute, steam rises off the pile,
  and a core probe paints a live temperature onto a canvas screen.
- Six clickable assemblies: motor, drum, intake, discharge, probe, control cabinet. Four modes
  (Assembled / Cutaway / Assemblies / One batch) and five cameras.
- `window.__drum` exposes `setMode`, `setCamera`, `focusPart`, `play`, `pause`.
- It sits inside an instrument frame with five telemetry readouts fed by `/api/v1/overview`.
- No models, no images, no network. Two font families only. Degrades to a labelled fallback without
  WebGL and freezes on one frame under `prefers-reduced-motion`.

## System assistant

A floating **animated avatar** bottom-right on every public page opens a compact chat panel. The
avatar blinks and floats at rest, and its mouth animates while a reply is being composed — the
same talking avatar appears in the panel header and beside the typing indicator.

- Primitive: `apps/web/src/components/ui/components-primitives-avatar.tsx` (`motion` v12).
  12 colour presets, 3 sizes, 3 shapes, with `blinking` and `talking` props. Brand preset is `lime`.
- Reference usage: `components-primitives-avatar.demo.tsx` in the same folder.
- Answers come from `apps/web/src/lib/chat-knowledge.ts` — 35 verified Q&A pairs drawn from the
  three design documents. Retrieval is deterministic (exact canonical question, then phrase/keyword
  scoring), so nothing is invented; an out-of-corpus question gets an honest "no verified answer"
  reply with suggestions. Suggested questions on open and related questions after each reply.
- Escape closes, input autofocuses, reduced-motion is respected, mobile becomes a bottom sheet.
- `.assistant-scope` pins the panel palette so the workspace's `.dark` tokens cannot make the dark
  panel unreadable.
- Mounted in the `(site)` layout only — it does not appear in the operations workspace.

### shadcn layout

`apps/web/components.json` uses the `new-york` style with `@/components/ui` →
`apps/web/src/components/ui`. That folder now exists. shadcn CLI writes generated primitives there,
so keeping this path is what lets `npx shadcn@latest add <component>` resolve without extra config.
Tailwind CSS v4 lives in `src/app/globals.css`; TypeScript is configured in `apps/web/tsconfig.json`.

## Design

Two registers, one system. **Editorial** for the commercial site — cream stock `#F6F2E6`, olive ink `#242A12`, Montserrat for display over Poppins, hairline rules, almost-square corners. **Instrument** for the workspace — pale lime sidebar `#F5FADF`, white cards, 14 px radii, tabular numbers. One accent only: `#D9F26B`, used on less than 4% of any screen. Full spec in [`docs/02-design-system.md`](docs/02-design-system.md).

---

## Chatbot

The assistant answers in English or Tagalog and can **locate where anything lives on the site** —
every reply can include a "Find it here" link, and the **?** button in the chat header opens a
browseable map of all pages (including staff dashboard sections).

It works in two modes:

| Mode | Setup | Cost |
| --- | --- | --- |
| Verified local answers (default) | none | Free, works offline |
| AI-written answers | `CHAT_API_KEY` + `CHAT_BASE_URL` + `CHAT_MODEL` | Free with Gemini / OpenRouter free models / Groq; OpenAI is paid |

The endpoint is `POST /api/v1/chat` (and `GET` reports the active mode). Answers are grounded in
`src/lib/chat-knowledge.ts`; the model is instructed never to invent pickup times, registration
details or contact information, and any API failure falls back to the checked local answer. Keys
are server-side only — never use a `NEXT_PUBLIC_` prefix. See
[`apps/web/.env.example`](apps/web/.env.example) for the free provider URLs and model names.
The page index lives in `src/lib/site-help.ts`.

---

## Honest limits

The research behind this build has open questions, and the interface says so rather than rounding up:

- Which of the nine candidate shops are inside the pilot barangay.
- Whether treated hair (~15% of clients) is acceptable in compost.
- The real sack tare weight — configured at 0.18 kg and labelled an assumption.
- Planting trials are `n = 1` per treatment and marked preliminary.

## Stack

MongoDB · Express 5 · React 19 · Next.js 16 · TypeScript · Tailwind CSS v4 · three.js · Mongoose 9 · zod

Built by Ryan Cepeda Domer · Balanga, Bataan · 2026
