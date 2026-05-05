"use client";

import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type StaffRouteSlice = {
  name: string;
  count: number;
};

type Props = {
  data: StaffRouteSlice[];
  monthLabel: string;
};

/**
 * Volume por destino / descricao do pedido (texto livre do balcao), para ver quais fluxos pesam mais.
 */
export function StaffTopRoutesChart({ data, monthLabel }: Props) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        name: d.name.length > 36 ? `${d.name.slice(0, 34)}…` : d.name,
        fullName: d.name,
        total: d.count,
      })),
    [data],
  );

  return (
    <div className="ui-chart-wrap ui-surface-lift rounded-2xl border border-sky-200/60 bg-white p-4 shadow-md ring-1 ring-[#0A2342]/5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[#0A2342]">Principais destinos / pedidos</h3>
        <p className="text-[11px] text-zinc-500">Top entradas por texto de destino no periodo — {monthLabel}</p>
      </div>
      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 text-sm text-zinc-500">
            Sem destinos registados neste periodo.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
              <XAxis type="number" allowDecimals={false} stroke="#71717a" />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 10 }}
                stroke="#71717a"
                interval={0}
              />
              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)}`, "Reservas"]}
                labelFormatter={(_, payload) => {
                  const p = payload?.[0]?.payload as { fullName?: string } | undefined;
                  return p?.fullName ?? "";
                }}
                contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }}
              />
              <Bar dataKey="total" name="Reservas" fill="#1D4E89" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
