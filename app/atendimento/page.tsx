import Link from "next/link";
import { connection } from "next/server";
import { addMonths, eachDayOfInterval, endOfMonth, format, parse, startOfDay, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CarFront, Luggage, MapPin } from "lucide-react";
import { AtendimentoDashboardRefresh } from "@/components/atendimento/atendimento-dashboard-refresh";
import { AtendimentoDataError } from "@/components/atendimento/atendimento-data-error";
import { DemandTypeChart, type DemandSlice } from "@/components/atendimento/demand-type-chart";
import { StaffBookingsFlowChart, type StaffFlowDayPoint } from "@/components/atendimento/staff-bookings-flow-chart";
import { StaffTopRoutesChart, type StaffRouteSlice } from "@/components/atendimento/staff-top-routes-chart";
import { RESERVATION_TYPE_LABELS } from "@/lib/atendimento/labels";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type StaffBookingRow = {
  id: string;
  created_at: string;
  reservation_type: string;
  client_name: string | null;
  destination_free: string | null;
  total_price: number;
  status: string;
  created_by_user_id: string | null;
};

function originLabel(b: StaffBookingRow): string {
  return b.created_by_user_id ? "Balcao" : "Site";
}

function parseMonthKey(mes: string | undefined): Date {
  const key = mes && /^\d{4}-\d{2}$/.test(mes) ? mes : format(new Date(), "yyyy-MM");
  return parse(`${key}-01`, "yyyy-MM-dd", new Date());
}

function resolveRange(searchParams: Record<string, string | string[] | undefined>): {
  fromIso: string;
  toIso: string;
  label: string;
  mesNav: { prev: string; next: string; current: string };
} {
  const fromParam = typeof searchParams.from === "string" ? searchParams.from : undefined;
  const toParam = typeof searchParams.to === "string" ? searchParams.to : undefined;
  const mes = typeof searchParams.mes === "string" ? searchParams.mes : undefined;

  if (fromParam && toParam && /^\d{4}-\d{2}-\d{2}$/.test(fromParam) && /^\d{4}-\d{2}-\d{2}$/.test(toParam)) {
    const fromD = new Date(fromParam + "T00:00:00.000Z");
    const toD = new Date(toParam + "T23:59:59.999Z");
    return {
      fromIso: fromD.toISOString(),
      toIso: toD.toISOString(),
      label: `${fromParam} — ${toParam}`,
      mesNav: {
        prev: format(addMonths(fromD, -1), "yyyy-MM"),
        next: format(addMonths(fromD, 1), "yyyy-MM"),
        current: format(fromD, "yyyy-MM"),
      },
    };
  }

  const monthDate = parseMonthKey(mes);
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  return {
    fromIso: start.toISOString(),
    toIso: end.toISOString(),
    label: format(monthDate, "MMMM yyyy", { locale: ptBR }),
    mesNav: {
      prev: format(addMonths(monthDate, -1), "yyyy-MM"),
      next: format(addMonths(monthDate, 1), "yyyy-MM"),
      current: format(monthDate, "yyyy-MM"),
    },
  };
}

function typeLabel(t: string) {
  const k = t as keyof typeof RESERVATION_TYPE_LABELS;
  return RESERVATION_TYPE_LABELS[k] ?? t;
}

/** Dados sempre frescos (polling no cliente via router.refresh). */
export const dynamic = "force-dynamic";

/**
 * Painel do balcao: reservas registadas em nome do cliente (viagem, pacote, viatura), alinhado ao resto do site.
 */
export default async function AtendimentoDashboardPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();

  const sp = (await searchParams) ?? {};
  const { fromIso, toIso, label, mesNav } = resolveRange(sp);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const bookingSelect =
    "id, created_at, reservation_type, client_name, destination_free, total_price, status, created_by_user_id";

  const { data: rows, error: queryError } = await supabase
    .from("bookings")
    .select(bookingSelect)
    .gte("created_at", fromIso)
    .lte("created_at", toIso)
    .order("created_at", { ascending: false });

  if (queryError) {
    return <AtendimentoDataError error={queryError.message} />;
  }

  const list = (rows ?? []) as StaffBookingRow[];

  const total = list.length;
  const pendentes = list.filter((b) => b.status === "pendente").length;
  const confirmadas = list.filter((b) => b.status === "confirmada").length;
  const canceladas = list.filter((b) => b.status === "cancelada").length;
  const vendido = list.filter((b) => b.status !== "cancelada").reduce((s, b) => s + Number(b.total_price ?? 0), 0);

  const byType = new Map<string, number>();
  for (const b of list) {
    const k = b.reservation_type || "pacote";
    byType.set(k, (byType.get(k) ?? 0) + 1);
  }
  const chartData: DemandSlice[] = ["viagem", "pacote", "aluguer"].map((tipo) => ({
    tipo,
    label:
      tipo === "viagem" ? "Viagens" : tipo === "pacote" ? "Pacotes turisticos" : "Aluguer de viaturas",
    count: byType.get(tipo) ?? 0,
  }));

  const recent = list.slice(0, 10);

  const rangeStart = startOfDay(new Date(fromIso));
  const rangeEnd = startOfDay(new Date(toIso));
  const dayStart = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
  const dayEnd = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
  const calendarDays = eachDayOfInterval({ start: dayStart, end: dayEnd });

  const flowByDay: StaffFlowDayPoint[] = calendarDays.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    let viagem = 0;
    let pacote = 0;
    let aluguer = 0;
    for (const b of list) {
      if (format(new Date(b.created_at), "yyyy-MM-dd") !== key) continue;
      const t = (b.reservation_type || "pacote") as "viagem" | "pacote" | "aluguer";
      if (t === "viagem") viagem += 1;
      else if (t === "aluguer") aluguer += 1;
      else pacote += 1;
    }
    return {
      label: format(d, "dd/MM", { locale: ptBR }),
      viagem,
      pacote,
      aluguer,
      total: viagem + pacote + aluguer,
    };
  });

  const destCounts = new Map<string, number>();
  for (const b of list) {
    const raw =
      (b.destination_free && b.destination_free.trim()) || typeLabel(b.reservation_type);
    const label = raw.trim() || "Sem descricao";
    destCounts.set(label, (destCounts.get(label) ?? 0) + 1);
  }
  const topRoutes: StaffRouteSlice[] = Array.from(destCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2342] via-[#143a6b] to-[#1D4E89] px-5 py-8 text-white shadow-xl md:px-10 md:py-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/90">Balcao TOUR 360</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">Reservas em nome do cliente</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-sky-100/95 md:text-base">
              Registe viagens, pacotes turisticos ou aluguer de viatura; acompanhe estados e valores no mesmo ecra do
              cliente final.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/atendimento?mes=${mesNav.prev}`}
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Mes anterior
            </Link>
            <Link
              href={`/atendimento?mes=${mesNav.next}`}
              className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
            >
              Mes seguinte
            </Link>
            <Link
              href="/atendimento/reservas/nova"
              className="rounded-xl bg-white px-5 py-2 text-sm font-semibold text-[#0A2342] shadow-sm hover:bg-sky-50"
            >
              Nova reserva
            </Link>
          </div>
        </div>

        <p className="relative z-10 mt-6 text-xs text-sky-100/85">
          Periodo: <span className="font-semibold capitalize text-white">{label}</span>
          {" · "}
          Filtros por data no <Link className="font-semibold underline underline-offset-2 hover:text-white" href="/atendimento/reservas">historico</Link>.
        </p>

        <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { title: "Total de reservas", value: String(total), accent: "from-white/15 to-white/5" },
            { title: "Pendentes", value: String(pendentes), accent: "from-amber-300/25 to-amber-600/10" },
            { title: "Confirmadas", value: String(confirmadas), accent: "from-emerald-400/25 to-emerald-700/10" },
            { title: "Canceladas", value: String(canceladas), accent: "from-red-300/25 to-red-700/10" },
            {
              title: "Valor (nao cancel.)",
              value: formatCurrency(vendido),
              accent: "from-orange-300/25 to-orange-600/10",
            },
          ].map((c) => (
            <div
              key={c.title}
              className={`rounded-2xl bg-gradient-to-br ${c.accent} p-4 ring-1 ring-white/15`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wide text-sky-100/85">{c.title}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-white">{c.value}</p>
            </div>
          ))}
        </div>
      </section>

      {total === 0 ? (
        <div className="rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4 shadow-sm ring-1 ring-[#0A2342]/10 md:flex md:items-center md:justify-between md:gap-4 md:p-5">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A2342] to-[#1D4E89] text-white shadow-md">
              <Luggage className="h-6 w-6" aria-hidden />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A2342]">Ainda sem reservas de balcao neste periodo</h3>
              <p className="mt-1 text-sm text-zinc-700">
                Os graficos e a lista em baixo actualizam-se automaticamente. Registe a primeira reserva para ver o fluxo
                por dia e por tipo.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:shrink-0">
            <Link
              href="/atendimento/reservas/nova"
              className="inline-flex items-center justify-center rounded-xl bg-[#0A2342] px-4 py-2 text-sm font-semibold text-white hover:bg-[#143a6b]"
            >
              Nova reserva
            </Link>
            <Link
              href="/pacotes"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-[#0A2342] hover:bg-zinc-50"
            >
              <MapPin className="h-4 w-4 text-[color:var(--brand-700)]" aria-hidden />
              Pacotes
            </Link>
            <Link
              href="/viaturas"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold text-[#0A2342] hover:bg-zinc-50"
            >
              <CarFront className="h-4 w-4 text-[color:var(--brand-700)]" aria-hidden />
              Viaturas
            </Link>
          </div>
        </div>
      ) : null}

      <section className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <DemandTypeChart data={chartData} monthLabel={label} />
            <StaffBookingsFlowChart data={flowByDay} monthLabel={label} />
          </div>

          <StaffTopRoutesChart data={topRoutes} monthLabel={label} />

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-md ring-1 ring-zinc-900/5">
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#0A2342]">Ultimas reservas no periodo</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Site e balcao no periodo seleccionado; actualiza automaticamente em baixo.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <AtendimentoDashboardRefresh intervalMs={22000} />
                <Link href="/atendimento/reservas" className="text-sm font-semibold text-[#1D4E89] hover:underline">
                  Historico completo
                </Link>
              </div>
            </div>
            {recent.length === 0 ? (
              <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 px-4 py-8 text-center text-sm text-zinc-600">
                Nenhuma entrada neste mes. Os registos feitos em{" "}
                <Link className="font-semibold text-[#1D4E89] underline" href="/atendimento/reservas/nova">
                  Nova reserva
                </Link>{" "}
                aparecem aqui apos guardar.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100">
                {recent.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <div>
                      <p className="font-semibold text-zinc-900">{b.client_name ?? "Cliente"}</p>
                      <p className="text-xs text-zinc-500">
                        {originLabel(b)} · {typeLabel(b.reservation_type)}
                        {b.destination_free?.trim() ? ` · ${b.destination_free.trim()}` : ""} ·{" "}
                        {format(new Date(b.created_at), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700">
                        {b.status}
                      </span>
                      <span className="font-semibold text-orange-700">{formatCurrency(b.total_price)}</span>
                      <Link
                        href={`/atendimento/reservas/${b.id}`}
                        className="text-xs font-semibold text-[#1D4E89] hover:underline"
                      >
                        Detalhes
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </section>
    </div>
  );
}
