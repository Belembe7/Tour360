import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function AdminViaturasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/viaturas");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/perfil");

  const [{ data: vehicles }, { data: vehicleBookings }] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id, model, plate, capacity, price_per_day, is_available")
      .order("model", { ascending: true }),
    supabase
      .from("vehicle_bookings")
      .select("id, destination, start_date, end_date, status, vehicles(model)")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Viaturas e reservas</h1>
      <p className="mb-6 text-zinc-600">Gestao da frota e ultimas reservas.</p>
      <AdminNav />

      <div className="mb-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Matricula</th>
              <th className="px-4 py-3">Capacidade</th>
              <th className="px-4 py-3">Preco/dia</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(vehicles ?? []).map((item) => (
              <tr key={item.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">{item.model}</td>
                <td className="px-4 py-3">{item.plate ?? "-"}</td>
                <td className="px-4 py-3">{item.capacity ?? "-"}</td>
                <td className="px-4 py-3">{formatCurrency(Number(item.price_per_day))}</td>
                <td className="px-4 py-3">{item.is_available ? "Disponivel" : "Indisponivel"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Viatura</th>
              <th className="px-4 py-3">Destino</th>
              <th className="px-4 py-3">Inicio</th>
              <th className="px-4 py-3">Fim</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {(vehicleBookings ?? []).map((item) => (
              <tr key={item.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">{(item.vehicles as { model?: string } | null)?.model ?? "-"}</td>
                <td className="px-4 py-3">{item.destination ?? "-"}</td>
                <td className="px-4 py-3">{item.start_date}</td>
                <td className="px-4 py-3">{item.end_date}</td>
                <td className="px-4 py-3">{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
