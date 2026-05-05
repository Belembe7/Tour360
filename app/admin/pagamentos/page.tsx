import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type PaymentRow = {
  id: string;
  amount: number;
  method: "mpesa" | "transferencia" | "dinheiro" | "cartao";
  status: "aguardando" | "confirmado" | "falhado";
  reference: string | null;
  paid_at: string | null;
  created_at: string;
  bookings: {
    id: string;
    user_id: string | null;
    profiles: { full_name: string | null } | null;
    packages: { name: string } | null;
  } | null;
};

type SearchParams = Promise<{
  method?: string;
  status?: string;
}>;

export default async function AdminPagamentosPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/pagamentos");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/perfil");

  let query = supabase
    .from("payments")
    .select(
      "id, amount, method, status, reference, paid_at, created_at, bookings(id, user_id, profiles(full_name), packages(name))",
    )
    .order("created_at", { ascending: false });

  if (searchParams.method) query = query.eq("method", searchParams.method);
  if (searchParams.status) query = query.eq("status", searchParams.status);

  const { data } = await query;
  const payments = (data ?? []) as unknown as PaymentRow[];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Pagamentos</h1>
      <p className="mb-6 text-zinc-600">
        Historico de pagamentos com suporte a M-Pesa simulado e filtros por estado.
      </p>
      <AdminNav />

      <div className="mb-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700">
        <p>
          Filtros por URL: <code>?method=mpesa&status=confirmado</code>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Reserva</th>
              <th className="px-4 py-3">Pacote</th>
              <th className="px-4 py-3">Metodo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Referencia</th>
              <th className="px-4 py-3">Pago em</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">
                  {new Date(payment.created_at).toLocaleDateString("pt-MZ")}
                </td>
                <td className="px-4 py-3">
                  {payment.bookings?.profiles?.full_name ?? "Sem nome"}
                </td>
                <td className="px-4 py-3">{payment.bookings?.id ?? "-"}</td>
                <td className="px-4 py-3">{payment.bookings?.packages?.name ?? "-"}</td>
                <td className="px-4 py-3">{payment.method}</td>
                <td className="px-4 py-3">{payment.status}</td>
                <td className="px-4 py-3">{formatCurrency(Number(payment.amount))}</td>
                <td className="px-4 py-3">{payment.reference ?? "-"}</td>
                <td className="px-4 py-3">
                  {payment.paid_at
                    ? new Date(payment.paid_at).toLocaleString("pt-MZ")
                    : "-"}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-zinc-500">
                  Nenhum pagamento encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
