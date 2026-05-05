"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

type Props = {
  /** Intervalo entre actualizacoes quando o separador esta visivel (ms). */
  intervalMs?: number;
};

/**
 * Actualiza o painel do servidor (RSC) periodicamente para aproximar tempo real no historico e nos graficos.
 */
export function AtendimentoDashboardRefresh({ intervalMs = 22000 }: Props) {
  const router = useRouter();
  const [lastAt, setLastAt] = useState<Date | null>(null);

  useEffect(() => {
    const run = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") return;
      router.refresh();
      setLastAt(new Date());
    };
    const id = window.setInterval(run, intervalMs);
    return () => window.clearInterval(id);
  }, [router, intervalMs]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800 ring-1 ring-emerald-200/80">
        <Radio className="h-3 w-3 shrink-0" aria-hidden />
        Tempo real
      </span>
      <span>
        Actualizacao automatica a cada {Math.round(intervalMs / 1000)}s (separador visivel).
        {lastAt ? ` Ultima: ${lastAt.toLocaleTimeString("pt-MZ")}.` : ""}
      </span>
    </div>
  );
}
