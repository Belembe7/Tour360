"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type StaffFlowDayPoint = {
  label: string;
  viagem: number;
  pacote: number;
  aluguer: number;
  total: number;
};

type Props = {
  data: StaffFlowDayPoint[];
  monthLabel: string;
};

const COLORS = { viagem: "#0A2342", pacote: "#4EA8DE", aluguer: "#F97316" };

/**
 * Fluxo diario de reservas de balcao por tipo de servico (linhas empilhadas no tempo).
 */
export function StaffBookingsFlowChart({ data, monthLabel }: Props) {
  const hasAny = data.some((d) => d.total > 0);

  return (
    <div className="ui-chart-wrap ui-surface-lift rounded-2xl border border-sky-200/60 bg-white p-4 shadow-md ring-1 ring-[#0A2342]/5">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-[#0A2342]">Fluxo por dia e tipo de pedido</h3>
        <p className="text-[11px] text-zinc-500">
          Contagem de reservas criadas no balcao, por dia — {monthLabel}
        </p>
      </div>
      <div className="h-72 w-full">
        {!hasAny ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 text-sm text-zinc-500">
            Sem movimento neste periodo.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#71717a" interval="preserveStartEnd" />
              <YAxis allowDecimals={false} stroke="#71717a" width={32} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e4e4e7", fontSize: 12 }}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="viagem" name="Viagens" stroke={COLORS.viagem} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pacote" name="Pacotes" stroke={COLORS.pacote} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="aluguer" name="Aluguer" stroke={COLORS.aluguer} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
