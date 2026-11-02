import Link from "next/link";
import { Plus, Download, Filter, MapPin } from "lucide-react";
import { Panel, PageHead, StatusPill } from "@/components/app/ui";
import { shops } from "@/lib/data";

export default function ShopsPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <PageHead
        title="Shops"
        subtitle="Records staff manage. No shop ever logs in — the code on the sack is the identity."
      >
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e9e8db] bg-white px-3.5 text-[0.75rem] font-medium text-[#4b4e28] transition-colors hover:border-[#cfd3bd]"
        >
          <Filter size={13} className="text-[#9a9c74]" />
          Filter
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e9e8db] bg-white px-3.5 text-[0.75rem] font-medium text-[#4b4e28] transition-colors hover:border-[#cfd3bd]"
        >
          Export CSV
          <Download size={13} className="text-[#9a9c74]" />
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[#41431b] px-3.5 text-[0.75rem] font-medium text-white transition-colors hover:bg-[#33361a]"
        >
          <Plus size={13} />
          Register shop
        </button>
      </PageHead>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Enrolled", shops.filter((s) => s.status === "Enrolled").length, "Active pickup rule"],
          ["Candidate", shops.filter((s) => s.status === "Candidate").length, "Awaiting first visit"],
          ["Paused", shops.filter((s) => s.status === "Paused").length, "History retained"],
          ["In pilot area", shops.filter((s) => s.inPilotArea).length, "Eligible for sampling"],
        ].map(([k, v, note]) => (
          <div key={String(k)} className="app-card app-shadow p-4">
            <p className="text-[0.75rem] font-medium text-[#6b6d4c]">{k}</p>
            <p className="mt-2 text-[1.5rem] font-semibold tabular-nums leading-none text-[#26280f]">
              {v}
            </p>
            <p className="mt-1.5 text-[0.6875rem] text-[#9a9c74]">{note}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Shop registry"
        subtitle={`${shops.length} records · sorted by status`}
        bodyClassName="p-0"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#eef0e2] bg-[#fafbf4]">
                {["Code", "Shop", "Contact", "Pickup rule", "Access", "Net kg", "Status", ""].map(
                  (h, i) => (
                    <th
                      key={`${h}-${i}`}
                      className={`px-5 py-2.5 text-[0.625rem] font-medium uppercase tracking-[0.08em] text-[#9a9c74] ${
                        i === 5 ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {shops.map((s) => (
                <tr
                  key={s.code}
                  className="border-b border-[#f2f4e8] transition-colors last:border-b-0 hover:bg-[#fafbf4]"
                >
                  <td className="px-5 py-3.5">
                    <span className="rounded bg-[#f5f7ea] px-1.5 py-0.5 font-mono text-[0.6875rem] text-[#5d6432]">
                      {s.code}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[0.8125rem] font-medium text-[#33361a]">{s.name}</p>
                    <p className="flex items-center gap-1 text-[0.6875rem] text-[#9a9c74]">
                      <MapPin size={9} />
                      {s.barangay}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[0.75rem] text-[#33361a]">{s.contact}</p>
                    <p className="text-[0.6875rem] text-[#9a9c74]">
                      {s.mobile} · {s.channel}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[0.75rem] text-[#33361a]">{s.days.join(" & ")}</p>
                    <p className="text-[0.6875rem] text-[#9a9c74]">{s.window}</p>
                  </td>
                  <td className="max-w-[220px] px-5 py-3.5">
                    <p className="truncate text-[0.6875rem] text-[#9a9c74]" title={s.access}>
                      {s.access}
                    </p>
                  </td>
                  <td className="px-5 py-3.5 text-right text-[0.8125rem] tabular-nums text-[#33361a]">
                    {s.totalKg.toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={s.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/dashboard/pickups"
                      className="text-[0.6875rem] font-medium text-[#4f7a1f] hover:underline"
                    >
                      History
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#eef0e2] bg-[#fafbf4] px-5 py-3">
          <p className="text-[0.6875rem] text-[#9a9c74]">
            Showing {shops.length} of {shops.length} records
          </p>
          <p className="text-[0.6875rem] text-[#7a7f52]">GET /api/v1/shops</p>
        </div>
      </Panel>
    </div>
  );
}
