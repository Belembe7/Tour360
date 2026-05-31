import Link from "next/link";
import { Suspense } from "react";
import { format } from "date-fns";
import { AtendimentoDataError } from "@/components/atendimento/atendimento-data-error";
import { AtendimentoHistoryFilters } from "@/components/atendimento/atendimento-history-filters";
import { DeleteBookingButton } from "@/components/bookings/delete-booking-button";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all-rows";
import { getBookingClientLabel, matchesBookingSearch } from "@/lib/bookings/display";
import { formatCurrency } from "@/lib/utils";
import { RESERVATION_TYPE_LABELS } from "@/lib/atendimento/labels";

type Row = {
  id: string;
  created_at: string;
  reservation_type: string;
  client_name: string | null;
  client_contact: string | null;
  client_email: string | null;
  departure_date: string;
  return_date: string | null;
  total_price: number;
  status: string;
  notes: string | null;
  created_by_user_id: string | null;
};

function originLabel(b: Row): string {
  if (b.created_by_user_id) return "Balcao";
  return "Site";
}

/**
 * Historico completo de reservas (site + balcao), sem limite artificial de linhas.
 */
export default async function AtendimentoHistoricoPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;
  const tipo = typeof sp.tipo === "string" ? sp.tipo : undefined;
  const estado = typeof sp.estado === "string" ? sp.estado : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : undefined;

  const { data: fetched, error: queryError } = await fetchAllRows<Row>(async (fromOffset, toOffset) => {
    let query = supabase
      .from("bookings")
      .select(
        "id, created_at, reservation_type, client_name, client_contact, client_email, departure_date, return_date, total_price, status, notes, created_by_user_id",
      )
      .order("created_at", { ascending: false });

    if (from) {
      query = query.gte("created_at", new Date(from + "T00:00:00").toISOString());
    }
    if (to) {
      query = query.lte("created_at", new Date(to + "T23:59:59.999").toISOString());
    }
    if (tipo && ["pacote", "viagem", "aluguer"].includes(tipo)) {
      query = query.eq("reservation_type", tipo);
    }
    if (estado && ["pendente", "confirmada", "cancelada", "concluida"].includes(estado)) {
      query = query.eq("status", estado);
    }

    const { data, error } = await query.range(fromOffset, toOffset);
    return { data: data as Row[] | null, error };
  });

  const list = q ? fetched.filter((b) => matchesBookingSearch(b, q)) : fetched;

  if (queryError) {
    return <AtendimentoDataError error={queryError} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A2342]">Historico de reservas</h2>
        <p className="text-sm text-zinc-600">
          Todas as reservas do site e do balcao ({list.length} no total com os filtros actuais). Filtre por periodo,
          tipo, estado ou pesquise por nome, contacto ou email.
        </p>
      </div>

      <Suspense fallback={<div className="h-24 animate-pulse rounded-xl bg-zinc-100" />}>
        <AtendimentoHistoryFilters />
      </Suspense>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Partida</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Registo</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">
                  <p className="font-medium text-zinc-900">{getBookingClientLabel(b)}</p>
                  <p className="text-xs text-zinc-500">{b.client_contact ?? b.client_email ?? ""}</p>
                </td>
                <td className="px-4 py-3 text-xs text-zinc-600">{originLabel(b)}</td>
                <td className="px-4 py-3">
                  {RESERVATION_TYPE_LABELS[b.reservation_type as keyof typeof RESERVATION_TYPE_LABELS] ??
                    b.reservation_type}
                </td>
                <td className="px-4 py-3">{b.departure_date}</td>
                <td className="px-4 py-3 font-semibold text-orange-700">{formatCurrency(b.total_price)}</td>
                <td className="px-4 py-3">{b.status}</td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {format(new Date(b.created_at), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <Link href={`/atendimento/reservas/${b.id}`} className="font-semibold text-[#1D4E89] hover:underline">
                      Detalhes
                    </Link>
                    <DeleteBookingButton bookingId={b.id} />
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-500">
                  Nenhuma reserva encontrada com estes filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
