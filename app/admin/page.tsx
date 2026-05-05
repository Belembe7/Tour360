import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { BookingsChart } from "@/components/admin/bookings-chart";
import { StatsCard } from "@/components/admin/stats-card";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/perfil");
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const [{ count: totalBookings }, { count: pendingBookings }, { data: monthBookings }] =
    await Promise.all([
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pendente"),
      supabase
        .from("bookings")
        .select("total_price")
        .gte("departure_date", monthStart)
        .neq("status", "cancelada"),
    ]);

  const revenueMonth = (monthBookings ?? []).reduce(
    (sum, item) => sum + Number(item.total_price),
    0,
  );

  const { data: bookingsForChart } = await supabase
    .from("bookings")
    .select("departure_date")
    .neq("status", "cancelada");

  const map = new Map<string, number>();
  (bookingsForChart ?? []).forEach((item) => {
    const key = item.departure_date.slice(0, 7);
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  const chartData = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, total]) => ({ month, total }));

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Painel Admin TOUR 360</h1>
      <p className="mb-6 text-zinc-600">Visao geral de reservas e receita.</p>
      <AdminNav />
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total de reservas" value={String(totalBookings ?? 0)} />
        <StatsCard
          title="Receita do mes"
          value={formatCurrency(revenueMonth)}
          subtitle="Reservas nao canceladas"
        />
        <StatsCard
          title="Reservas pendentes"
          value={String(pendingBookings ?? 0)}
          subtitle="Aguardando confirmacao"
        />
      </div>
      <div className="mt-6">
        <BookingsChart data={chartData} />
      </div>
    </main>
  );
}
