"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type PlannerState = {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
};

export function TravelPlannerCard() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<PlannerState>({
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
  });

  const canSubmit = useMemo(() => {
    if (!state.destination || !state.startDate) return false;
    if (state.endDate && new Date(state.endDate) < new Date(state.startDate)) return false;
    return true;
  }, [state.destination, state.endDate, state.startDate]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!state.destination || !state.startDate) {
      setError("Preencha pelo menos destino e data inicio.");
      return;
    }
    if (state.endDate && new Date(state.endDate) < new Date(state.startDate)) {
      setError("A data fim deve ser igual ou superior a data inicio.");
      return;
    }

    const params = new URLSearchParams();
    if (state.origin) params.set("origem", state.origin);
    params.set("destino", state.destination);
    params.set("inicio", state.startDate);
    if (state.endDate) params.set("fim", state.endDate);

    startTransition(() => {
      router.push(`/pacotes?${params.toString()}`);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-white/20 bg-white/95 p-4 text-[color:var(--brand-900)] shadow-lg md:self-end"
    >
      <p className="text-sm font-semibold">Planeie a sua viagem</p>
      <p className="mt-1 text-xs text-zinc-600">
        Informe o destino e as datas para comecar.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-semibold text-zinc-700">Origem</span>
          <input
            value={state.origin}
            onChange={(e) => setState((s) => ({ ...s, origin: e.target.value }))}
            placeholder="Ex.: Maputo"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[color:var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold text-zinc-700">Destino *</span>
          <input
            value={state.destination}
            onChange={(e) => setState((s) => ({ ...s, destination: e.target.value }))}
            placeholder="Ex.: Vilankulo"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[color:var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold text-zinc-700">Data inicio *</span>
          <input
            type="date"
            value={state.startDate}
            onChange={(e) => setState((s) => ({ ...s, startDate: e.target.value }))}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[color:var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
            required
          />
        </label>

        <label className="space-y-1">
          <span className="text-xs font-semibold text-zinc-700">Data fim</span>
          <input
            type="date"
            value={state.endDate}
            onChange={(e) => setState((s) => ({ ...s, endDate: e.target.value }))}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 focus:border-[color:var(--brand-700)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="mt-4 w-full rounded-md bg-[color:var(--brand-900)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "A iniciar..." : "Iniciar"}
      </button>
    </form>
  );
}

