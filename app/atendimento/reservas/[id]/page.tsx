import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { AtendimentoDataError } from "@/components/atendimento/atendimento-data-error";
import { DeleteBookingButton } from "@/components/bookings/delete-booking-button";
import { StaffBookingPdfButton, type StaffBookingPdfPayload } from "@/components/atendimento/staff-booking-pdf-button";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { RESERVATION_TYPE_LABELS } from "@/lib/atendimento/labels";

const AGENCY_NAME = "TOUR 360";

type BookingDetail = {
  id: string;
  created_at: string;
  reservation_type: "pacote" | "viagem" | "aluguer";
  client_name: string | null;
  client_contact: string | null;
  client_email: string | null;
  destination_free: string | null;
  vehicle_type: string | null;
  departure_date: string;
  return_date: string | null;
  num_travelers: number;
  total_price: number;
  status: string;
  payment_status: string;
  notes: string | null;
  created_by_user_id: string | null;
};

function parseObservations(notes: string | null): string | null {
  if (!notes) return null;
  try {
    const j = JSON.parse(notes) as { observations?: string | null };
    return j.observations?.trim() || null;
  } catch {
    return notes.length > 200 ? notes.slice(0, 200) + "…" : notes;
  }
}

/**
 * Detalhe da reserva criada pelo caixa + botao de PDF (dados completos e funcionario).
 */
export default async function AtendimentoReservaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login/atendimento");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "client";
  const isAdmin = role === "admin";
  const isCaixa = role === "caixa";
  if (!isAdmin && !isCaixa) redirect("/perfil");

  const { data: booking, error: bookingError } = await supabase.from("bookings").select("*").eq("id", id).maybeSingle();
  if (bookingError) {
    return <AtendimentoDataError error={bookingError.message} />;
  }
  if (!booking) notFound();

  const b = booking as BookingDetail;

  const { data: staffProfile } = b.created_by_user_id
    ? await supabase.from("profiles").select("full_name").eq("id", b.created_by_user_id).maybeSingle()
    : { data: null };

  const staffName = b.created_by_user_id
    ? staffProfile?.full_name?.trim() || "Funcionario"
    : "Reserva online (site)";
  const tipo = (b.reservation_type ?? "pacote") as keyof typeof RESERVATION_TYPE_LABELS;
  const tipoLabel = RESERVATION_TYPE_LABELS[tipo] ?? b.reservation_type;
  const destinoOuViatura =
    b.reservation_type === "aluguer"
      ? (b.vehicle_type ?? "—")
      : (b.destination_free ?? b.vehicle_type ?? "—");

  const observations = parseObservations(b.notes);

  const pdfPayload: StaffBookingPdfPayload = {
    agencyName: AGENCY_NAME,
    clientName: b.client_name ?? "—",
    clientContact: b.client_contact ?? "—",
    clientEmail: b.client_email ?? "—",
    reservationType: tipo,
    destinationOrVehicle: destinoOuViatura,
    departureDate: b.departure_date,
    returnDate: b.return_date,
    numTravelers: b.num_travelers,
    observations,
    bookingCreatedAt: format(new Date(b.created_at), "dd/MM/yyyy HH:mm"),
    totalPrice: Number(b.total_price),
    status: b.status,
    staffName,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/atendimento/reservas" className="text-sm font-semibold text-[#1D4E89] hover:underline">
          Voltar ao historico
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <StaffBookingPdfButton payload={pdfPayload} />
          <DeleteBookingButton
            bookingId={b.id}
            label="Apagar reserva"
            redirectAfterDelete="/atendimento/reservas"
          />
        </div>
      </div>

      <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg ring-1 ring-zinc-900/5">
        <h2 className="text-2xl font-bold text-[#0A2342]">Reserva</h2>
        <p className="text-xs text-zinc-500">ID: {b.id}</p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Cliente</dt>
            <dd className="text-sm font-medium text-zinc-900">{b.client_name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Contacto</dt>
            <dd className="text-sm text-zinc-800">{b.client_contact}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Email</dt>
            <dd className="text-sm text-zinc-800">{b.client_email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Tipo</dt>
            <dd className="text-sm text-zinc-800">{tipoLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Destino / viatura</dt>
            <dd className="text-sm text-zinc-800">{destinoOuViatura}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Datas</dt>
            <dd className="text-sm text-zinc-800">
              Ida {b.departure_date}
              {b.return_date ? ` · Volta ${b.return_date}` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Pessoas</dt>
            <dd className="text-sm text-zinc-800">{b.num_travelers}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Valor total</dt>
            <dd className="text-lg font-bold text-orange-700">{formatCurrency(b.total_price)}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Estado</dt>
            <dd className="text-sm font-semibold text-zinc-900">{b.status}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-zinc-500">Pagamento</dt>
            <dd className="text-sm text-zinc-800">{b.payment_status}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase text-zinc-500">Registado por</dt>
            <dd className="text-sm text-zinc-800">{staffName}</dd>
          </div>
          {observations ? (
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase text-zinc-500">Observacoes</dt>
              <dd className="mt-1 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-800">{observations}</dd>
            </div>
          ) : null}
        </dl>
      </article>
    </div>
  );
}
