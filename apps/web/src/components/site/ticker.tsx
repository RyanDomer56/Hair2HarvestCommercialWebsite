import { pickups } from "@/lib/data";

const items = [
  ...pickups.map((p) => ({
    code: p.shopCode,
    detail: `${p.sacks} sacks · ${p.netKg.toFixed(2)} kg`,
    grade: p.grade,
  })),
  { code: "HB-002", detail: "4 sacks · 7.38 kg", grade: "Minor" },
  { code: "HB-003", detail: "2 sacks · 3.74 kg", grade: "Clean" },
  { code: "HB-004", detail: "2 sacks · 3.26 kg", grade: "Clean" },
  { code: "HB-001", detail: "3 sacks · 5.16 kg", grade: "Mixed" },
];

export function Ticker() {
  const row = [...items, ...items];
  return (
    <div className="marquee relative overflow-hidden border-y border-[var(--line)] bg-[var(--paper-sunk)] py-3.5">
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={`${item.code}-${i}`}
            className="flex shrink-0 items-center gap-3 whitespace-nowrap px-5"
          >
            <span className="mono-tag text-clay">{item.code}</span>
            <span className="mono-tag text-ink-soft">{item.detail}</span>
            <span
              className="mono-tag uppercase"
              style={{
                color:
                  item.grade === "Clean"
                    ? "var(--moss)"
                    : item.grade === "Minor"
                      ? "var(--clay)"
                      : "var(--rust)",
              }}
            >
              {item.grade}
            </span>
            <span className="h-3 w-px bg-[var(--line)]" aria-hidden />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--paper-sunk)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--paper-sunk)] to-transparent" />
    </div>
  );
}
