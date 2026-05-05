"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  vehicleModel: string;
  destination: string | null;
  startDate: string;
  endDate: string;
};

function formatCountdown(ms: number) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { days, hours, minutes };
}

export function VehicleActiveBookingBanner({ vehicleModel, destination, startDate, endDate }: Props) {
  const endAt = useMemo(() => {
    // Consider booking valid until end of endDate local time.
    const d = new Date(endDate);
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, [endDate]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = endAt - now;
  const t = formatCountdown(remaining);
  const isExpired = remaining <= 0;

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 text-white ring-1 ring-white/10 backdrop-blur-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/90">Sua viatura reservada</p>
          <h2 className="mt-2 text-lg font-bold tracking-tight md:text-xl">
            {vehicleModel}{" "}
            <span className="text-sky-100/85">
              {destination ? `• ${destination}` : ""}
            </span>
          </h2>
          <p className="mt-1 text-sm text-sky-100/85">
            Periodo: {startDate} → {endDate}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-200/90">Tempo restante</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {isExpired ? "0h" : `${t.days}d ${t.hours}h ${t.minutes}m`}
          </p>
          <p className="text-[11px] text-sky-100/80">Actualiza a cada 30s</p>
        </div>
      </div>
    </section>
  );
}

