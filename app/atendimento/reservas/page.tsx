import Link from "next/link";
import { Suspense } from "react";
import { format } from "date-fns";
import { AtendimentoDataError } from "@/components/atendimento/atendimento-data-error";
import { AtendimentoHistoryFilters } from "@/components/atendimento/atendimento-history-filters";
import { createClient } from "@/lib/supabase/server";
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
};

/**
 * Historico completo com filtros (data, tipo, estado, pesquisa por cliente).
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

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "client";
  const scopeOwnOnly = role === "caixa";

  const from = typeof sp.from === "string" ? sp.from : undefined;
  const to = typeof sp.to === "string" ? sp.to : undefined;
  const tipo = typeof sp.tipo === "string" ? sp.tipo : undefined;
  const estado = typeof sp.estado === "string" ? sp.estado : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : undefined;

  let query = supabase
    .from("bookings")
    .select(
      "id, created_at, reservation_type, client_name, client_contact, client_email, departure_date, return_date, total_price, status",
    )
    .not("created_by_user_id", "is", null)
    .order("created_at", { ascending: false });

  if (scopeOwnOnly) {
    query = query.eq("created_by_user_id", user.id);
  }
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
  if (q) {
    const safe = q.replace(/%/g, "").replace(/,/g, "");
    query = query.or(
      `client_name.ilike.%${safe}%,client_contact.ilike.%${safe}%,client_email.ilike.%${safe}%`,
    );
  }

  const { data: rows, error: queryError } = await query;

  if (queryError) {
    return <AtendimentoDataError error={queryError.message} />;
  }

  const list = (rows ?? []) as Row[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#0A2342]">Historico de reservas (balcao)</h2>
        <p className="text-sm text-zinc-600">
          Viagens, pacotes turisticos e aluguer de viatura registados em nome do cliente. Filtre por periodo, tipo,
          estado ou pesquise por nome, contacto ou email.
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
                  <p className="font-medium text-zinc-900">{b.client_name ?? "—"}</p>
                  <p className="text-xs text-zinc-500">{b.client_contact ?? ""}</p>
                </td>
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
                  <Link href={`/atendimento/reservas/${b.id}`} className="font-semibold text-[#1D4E89] hover:underline">
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {list.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-zinc-500">
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
