import Link from "next/link";
import { Suspense } from "react";
import { format } from "date-fns";
import { AtendimentoDataError } from "@/components/atendimento/atendimento-data-error";
import { AtendimentoHistoryFilters } from "@/components/atendimento/atendimento-history-filters";
import { DeleteBookingButton } from "@/components/bookings/delete-booking-button";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRows } from "@/lib/supabase/fetch-all-rows";
import { getBookingClientLabel, matchesBookingSearch } from "@/lib/bookings/display";
import {
  mapVehicleBookingToHistorico,
  matchesVehicleHistoricoSearch,
  sortByCreatedDesc,
  type AtendimentoHistoricoRow,
  type VehicleBookingHistoryRow,
} from "@/lib/bookings/vehicle-history";
import { formatCurrency } from "@/lib/utils";
import { RESERVATION_TYPE_LABELS } from "@/lib/atendimento/labels";

type Row = AtendimentoHistoricoRow;

function originLabel(b: Row): string {
  if (b.isVehicleSite) return "Site (/viaturas)";
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

  const includeVehicleBookings = !tipo || tipo === "aluguer";

  const { data: fetched, error: queryError } = await fetchAllRows<Omit<Row, "isVehicleSite">>(async (fromOffset, toOffset) => {
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
    return { data: data as Omit<Row, "isVehicleSite">[] | null, error };
  });

  let vehicleRows: Row[] = [];
  let vehicleError: string | null = null;

  if (includeVehicleBookings) {
    const { data: vehicleData, error: vErr } = await fetchAllRows<VehicleBookingHistoryRow>(
      async (fromOffset, toOffset) => {
        let query = supabase
          .from("vehicle_bookings")
          .select(
            "id, created_at, start_date, end_date, total_days, total_price, status, destination, user_id, vehicles(model)",
          )
          .order("created_at", { ascending: false });

        if (from) {
          query = query.gte("created_at", new Date(from + "T00:00:00").toISOString());
        }
        if (to) {
          query = query.lte("created_at", new Date(to + "T23:59:59.999").toISOString());
        }
        if (estado && ["pendente", "confirmada", "cancelada"].includes(estado)) {
          query = query.eq("status", estado);
        } else if (estado === "concluida") {
          return { data: [], error: null };
        }

        const { data, error } = await query.range(fromOffset, toOffset);
        return { data: data as VehicleBookingHistoryRow[] | null, error };
      },
    );

    if (vErr) {
      vehicleError = vErr;
    } else {
      const userIds = [...new Set(vehicleData.map((v) => v.user_id).filter(Boolean))] as string[];
      const profileMap = new Map<string, { full_name: string | null; phone: string | null }>();

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, full_name, phone")
          .in("id", userIds);

        for (const profile of profiles ?? []) {
          profileMap.set(profile.id, {
            full_name: profile.full_name,
            phone: profile.phone,
          });
        }
      }

      vehicleRows = vehicleData.map((row) =>
        mapVehicleBookingToHistorico(row, row.user_id ? profileMap.get(row.user_id) : null),
      );
    }
  }

  const bookingRows: Row[] = fetched.map((b) => ({ ...b, isVehicleSite: false }));
  const merged = sortByCreatedDesc([...bookingRows, ...vehicleRows]);
  const list = q
    ? merged.filter((b) =>
        b.isVehicleSite ? matchesVehicleHistoricoSearch(b, q) : matchesBookingSearch(b, q),
      )
    : merged;

  if (queryError || vehicleError) {
    return <AtendimentoDataError error={queryError ?? vehicleError ?? "Erro desconhecido"} />;
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
                  <p className="text-xs text-zinc-500">
                    {b.isVehicleSite && b.notes ? `${b.notes} · ` : ""}
                    {b.client_contact ?? b.client_email ?? ""}
                  </p>
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
                    {b.isVehicleSite ? (
                      <span className="text-xs text-zinc-500">Reserva em /viaturas</span>
                    ) : (
                      <Link href={`/atendimento/reservas/${b.id}`} className="font-semibold text-[#1D4E89] hover:underline">
                        Detalhes
                      </Link>
                    )}
                    {!b.isVehicleSite ? <DeleteBookingButton bookingId={b.id} /> : null}
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
