import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

type BookingRow = {
  id: string;
  departure_date: string;
  num_travelers: number;
  total_price: number;
  status: string;
  payment_status: string;
  client_name: string | null;
  packages: { name: string } | null;
  profiles: { full_name: string | null } | null;
};

export default async function AdminReservasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/reservas");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/perfil");

  const { data } = await supabase
    .from("bookings")
    .select(
      "id, departure_date, num_travelers, total_price, status, payment_status, client_name, packages(name), profiles(full_name)",
    )
    .order("created_at", { ascending: false });

  const bookings = (data ?? []) as unknown as BookingRow[];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Gestao de reservas</h1>
      <p className="mb-6 text-zinc-600">Confirme, cancele e monitore pagamentos.</p>
      <AdminNav />
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Pacote</th>
              <th className="px-4 py-3">Partida</th>
              <th className="px-4 py-3">Viajantes</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Pagamento</th>
              <th className="px-4 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">
                  {booking.client_name?.trim() || booking.profiles?.full_name?.trim() || "Sem nome"}
                </td>
                <td className="px-4 py-3">{booking.packages?.name ?? "—"}</td>
                <td className="px-4 py-3">{booking.departure_date}</td>
                <td className="px-4 py-3">{booking.num_travelers}</td>
                <td className="px-4 py-3">{formatCurrency(booking.total_price)}</td>
                <td className="px-4 py-3">{booking.status}</td>
                <td className="px-4 py-3">{booking.payment_status}</td>
                <td className="px-4 py-3">
                  <BookingStatusActions bookingId={booking.id} />
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-zinc-500" colSpan={8}>
                  Sem reservas encontradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
