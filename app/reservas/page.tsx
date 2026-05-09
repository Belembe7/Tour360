import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CircleDollarSign,
  Luggage,
  MapPin,
  Ticket,
  Users,
} from "lucide-react";
import { BookingReceiptButton } from "@/components/packages/booking-receipt-button";
import { PageBack } from "@/components/layout/page-back";
import { MpesaPayButton } from "@/components/payments/mpesa-pay-button";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

type BookingRow = {
  id: string;
  created_at?: string;
  departure_date: string;
  return_date: string | null;
  num_travelers: number;
  total_price: number;
  status: string;
  payment_status: string;
  notes: string | null;
  packages: { name: string } | null;
  destinations: { name: string } | null;
};

type BookingNotesPayload = {
  passenger?: {
    fullName?: string;
    biNumber?: string;
  };
};

function parseBookingNotes(notes: string | null): BookingNotesPayload | null {
  if (!notes) return null;
  try {
    const parsed: unknown = JSON.parse(notes);
    if (parsed && typeof parsed === "object") return parsed as BookingNotesPayload;
    return null;
  } catch {
    return null;
  }
}

function formatDatePt(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("pt-MZ", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

function statusBookingStyles(status: string) {
  const s = status.toLowerCase();
  if (s === "confirmada")
    return "bg-emerald-100 text-emerald-900 ring-emerald-200/80";
  if (s === "cancelada") return "bg-red-100 text-red-900 ring-red-200/80";
  if (s === "concluida") return "bg-sky-100 text-sky-900 ring-sky-200/80";
  return "bg-amber-100 text-amber-900 ring-amber-200/80";
}

function statusPaymentStyles(payment: string) {
  const p = payment.toLowerCase();
  if (p === "pago") return "bg-emerald-50 text-emerald-800 ring-emerald-200/70";
  if (p === "reembolsado") return "bg-violet-50 text-violet-800 ring-violet-200/70";
  return "bg-zinc-100 text-zinc-800 ring-zinc-200/80";
}

export default async function ReservasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/reservas");
  }

  const { data } = await supabase
    .from("bookings")
    .select(
      "id, created_at, departure_date, return_date, num_travelers, total_price, status, payment_status, notes, packages(name), destinations(name)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const bookings = (data ?? []) as unknown as BookingRow[];

  const total = bookings.length;
  const pendentesPagamento = bookings.filter((b) => b.payment_status !== "pago").length;
  const confirmadas = bookings.filter((b) => b.status === "confirmada").length;
  const totalInvestido = bookings.reduce((sum, b) => sum + (b.total_price ?? 0), 0);

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-b from-zinc-100/80 via-zinc-50 to-white pb-16">
      <div className="mx-auto w-full max-w-5xl px-4 pt-6 md:px-6 md:pt-8">
        <PageBack href="/perfil" label="Voltar ao meu painel" className="mb-5" />
      </div>

      <section className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2342] via-[#143a6b] to-[#1D4E89] px-5 py-8 text-white shadow-xl md:px-10 md:py-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/90">Reservas</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Minhas reservas</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-sky-100/95 md:text-base">
              Acompanhe cada viagem: datas, viajantes, estado da reserva e pagamento. Baixe o comprovativo ou conclua o
              pagamento quando estiver disponivel.
            </p>
          </div>
          <Link
            href="/pacotes"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#0A2342] shadow-sm transition hover:bg-sky-50"
          >
            Novo pacote
          </Link>
        </div>

        {total > 0 ? (
          <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total de reservas", value: String(total), accent: "from-white/15 to-white/5" },
              { label: "Confirmadas", value: String(confirmadas), accent: "from-emerald-400/25 to-emerald-600/10" },
              { label: "Pagamento pendente", value: String(pendentesPagamento), accent: "from-amber-300/25 to-amber-600/10" },
              { label: "Valor total", value: formatCurrency(totalInvestido), accent: "from-orange-300/25 to-orange-600/10" },
            ].map((card) => (
              <div
                key={card.label}
                className={`rounded-2xl bg-gradient-to-br ${card.accent} p-4 ring-1 ring-white/15`}
              >
                <p className="text-xs font-medium uppercase tracking-wide text-sky-100/80">{card.label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-white">{card.value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 md:px-6">
        <div className="-mt-6 space-y-5 md:-mt-8">
          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-8 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-900/5 md:p-12">
              <div className="mx-auto max-w-md text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0A2342] to-[#1D4E89] text-white shadow-md">
                  <Luggage className="h-8 w-8" aria-hidden />
                </span>
                <h2 className="mt-6 text-xl font-bold text-[#0A2342]">Ainda sem reservas</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Quando reservar um pacote, ele aparecera aqui com todos os detalhes e opcoes de pagamento.
                </p>
                <Link
                  href="/pacotes"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#0A2342] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#143a6b]"
                >
                  Explorar pacotes
                </Link>
              </div>
            </div>
          ) : null}

          {bookings.map((booking, index) => (
            <article
              key={booking.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md shadow-zinc-900/5 ring-1 ring-zinc-900/[0.04] transition hover:shadow-lg hover:ring-zinc-900/[0.06]"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#4EA8DE] to-[#0A2342] opacity-90" />
              <div className="p-5 pl-6 md:p-6 md:pl-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-mono font-medium text-zinc-600">
                        #{String(index + 1).padStart(2, "0")}
                      </span>
                      {booking.created_at ? (
                        <span className="text-[11px] text-zinc-500">
                          Registada em {formatDatePt(booking.created_at)}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-2 flex items-center gap-2 text-xl font-bold text-[#0A2342]">
                      <Luggage className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
                      <span className="truncate">{booking.packages?.name ?? "Pacote removido"}</span>
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-zinc-600">
                      <MapPin className="h-4 w-4 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
                      {booking.destinations?.name ?? "Destino nao informado"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${statusBookingStyles(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusPaymentStyles(booking.payment_status)}`}
                    >
                      Pag. {booking.payment_status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex gap-3 rounded-xl bg-zinc-50/80 p-3 ring-1 ring-zinc-200/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A2342] shadow-sm ring-1 ring-zinc-200/80">
                      <CalendarDays className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Partida</p>
                      <p className="text-sm font-semibold text-zinc-900">{formatDatePt(booking.departure_date)}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-zinc-50/80 p-3 ring-1 ring-zinc-200/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A2342] shadow-sm ring-1 ring-zinc-200/80">
                      <CalendarDays className="h-5 w-5 opacity-80" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Regresso</p>
                      <p className="text-sm font-semibold text-zinc-900">
                        {booking.return_date ? formatDatePt(booking.return_date) : "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-zinc-50/80 p-3 ring-1 ring-zinc-200/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#0A2342] shadow-sm ring-1 ring-zinc-200/80">
                      <Users className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Viajantes</p>
                      <p className="text-sm font-semibold text-zinc-900">{booking.num_travelers}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50/50 p-3 ring-1 ring-orange-200/60">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#C2410C] shadow-sm ring-1 ring-orange-200/80">
                      <CircleDollarSign className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-800/80">Total</p>
                      <p className="text-lg font-bold text-[#C2410C]">{formatCurrency(booking.total_price)}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 border-t border-zinc-100 pt-5 sm:flex-row sm:items-stretch sm:justify-between">
                  <div className="flex flex-1 flex-wrap items-end gap-3">
                    {(() => {
                      let passengerName: string | null = null;
                      let passengerBi: string | null = null;
                      const parsedNotes = parseBookingNotes(booking.notes);
                      passengerName = parsedNotes?.passenger?.fullName ?? null;
                      passengerBi = parsedNotes?.passenger?.biNumber ?? null;
                      return (
                        <BookingReceiptButton
                          bookingId={booking.id}
                          packageName={booking.packages?.name ?? "Pacote removido"}
                          destinationName={booking.destinations?.name ?? "Nao informado"}
                          departureDate={booking.departure_date}
                          returnDate={booking.return_date}
                          travelers={booking.num_travelers}
                          totalPrice={booking.total_price}
                          status={booking.status}
                          paymentStatus={booking.payment_status}
                          passengerName={passengerName}
                          passengerBi={passengerBi}
                        />
                      );
                    })()}
                    <MpesaPayButton bookingId={booking.id} disabled={booking.payment_status === "pago"} />
                  </div>
                  <div className="flex items-center justify-end sm:shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs text-zinc-600">
                      <Ticket className="h-3.5 w-3.5" aria-hidden />
                      ID: {booking.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
