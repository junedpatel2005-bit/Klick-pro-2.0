"use client";
import { useEffect, useState } from "react";

type AdminRecord = Record<string, unknown>;

export function AdminDataPage({
  resource,
  title,
  description,
}: {
  resource: string;
  title: string;
  description: string;
}) {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    void fetch(`/api/v1/admin/data/${resource}`, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [resource]);
  const rows: AdminRecord[] = data
    ? Object.entries(data)
        .flatMap(([, v]) => (Array.isArray(v) ? v : []))
        .filter((value): value is AdminRecord => typeof value === "object" && value !== null)
    : [];
  const columns = Object.keys(rows[0] ?? {}).slice(0, 6);
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">{description}</p>
      </div>
      <section className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-700">
          Total records · <span className="tabular-nums font-semibold">{rows.length}</span>
        </div>
        {!data ? (
          <div className="h-44 animate-pulse bg-slate-100" />
        ) : rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wide border-b border-slate-200">
                <tr>
                  {columns.map((k) => (
                    <th key={k} className="px-4 py-3">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, i) => (
                  <tr key={i} className="text-slate-700 hover:bg-slate-50/70 transition-colors">
                    {columns.map((k) => (
                      <td key={k} className="max-w-56 truncate px-4 py-3">
                        {typeof row[k] === "object"
                          ? JSON.stringify(row[k])
                          : String(row[k] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-xs text-slate-500 text-center">No records found.</p>
        )}
      </section>
    </div>
  );
}
