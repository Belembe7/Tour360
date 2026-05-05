"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0A2342", "#4EA8DE", "#F97316"];

export type DemandSlice = {
  tipo: string;
  label: string;
  count: number;
};

type Props = {
  data: DemandSlice[];
  monthLabel: string;
};

/**
 * Volume de reservas registadas pelo balcao, por tipo (viagem, pacote, aluguer).
 */
export function DemandTypeChart({ data, monthLabel }: Props) {
  const [mode, setMode] = useState<"pie" | "bar">("pie");
  const barData = useMemo(() => data.map((d) => ({ name: d.label, total: d.count })), [data]);
  const totalCount = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);

  return (
    <div className="ui-chart-wrap ui-surface-lift rounded-2xl border border-sky-200/60 bg-white p-4 shadow-md ring-1 ring-[#0A2342]/5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-[#0A2342]">Reservas por tipo de servico</h3>
          <p className="text-[11px] text-zinc-500">Viagens, pacotes turisticos e aluguer de viatura</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">{monthLabel}</span>
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50/80 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setMode("pie")}
              className={[
                "rounded-md px-2.5 py-1 font-medium",
                mode === "pie" ? "bg-[#0A2342] text-white shadow-sm" : "text-zinc-600 hover:bg-white",
              ].join(" ")}
            >
              Circular
            </button>
            <button
              type="button"
              onClick={() => setMode("bar")}
              className={[
                "rounded-md px-2.5 py-1 font-medium",
                mode === "bar" ? "bg-[#0A2342] text-white shadow-sm" : "text-zinc-600 hover:bg-white",
              ].join(" ")}
            >
              Barras
            </button>
          </div>
        </div>
      </div>
      <div className="h-72 w-full">
        {totalCount === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-3 text-center text-sm text-zinc-500">
            Ainda nao ha reservas de balcao neste periodo. O grafico preenche-se quando existir movimento.
          </div>
        ) : mode === "pie" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="count" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#71717a" />
              <YAxis allowDecimals={false} stroke="#71717a" />
              <Tooltip />
              <Bar dataKey="total" name="Reservas" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
