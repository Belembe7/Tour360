import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PageBack } from "@/components/layout/page-back";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

type BookingLite = {
  id: string;
  departure_date: string;
  return_date: string | null;
  status: string;
  payment_status: string;
  total_price: number;
  packages: { name: string } | null;
  destinations: { name: string } | null;
};

type VehicleBookingLite = {
  id: string;
  start_date: string;
  end_date: string;
  status: string;
  destination: string | null;
  total_price: number;
  vehicles: { model: string; plate: string | null } | null;
};

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "caixa") {
    redirect("/atendimento");
  }

  const [{ data: bookingsData }, { data: vehicleBookingsData }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, departure_date, return_date, status, payment_status, total_price, packages(name), destinations(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("vehicle_bookings")
      .select("id, start_date, end_date, status, destination, total_price, vehicles(model, plate)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const bookings = (bookingsData ?? []) as unknown as BookingLite[];
  const vehicleBookings = (vehicleBookingsData ?? []) as unknown as VehicleBookingLite[];

  const totalBookings = bookings.length + vehicleBookings.length;
  const pendingPayments = bookings.filter((item) => item.payment_status !== "pago").length;
  const confirmedTrips = [
    ...bookings.filter((item) => item.status === "confirmada"),
    ...vehicleBookings.filter((item) => item.status === "confirmada"),
  ].length;
  const totalInvested = [...bookings, ...vehicleBookings].reduce((sum, item) => sum + (item.total_price ?? 0), 0);

  const nextFlight = bookings.find((item) => item.status !== "cancelada");

  const displayName = profile?.full_name ?? user.email?.split("@")[0] ?? "Cliente";
  const isAdmin = profile?.role === "admin";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <PageBack href="/" label="Voltar ao inicio" />
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2342] via-[#1D4E89] to-[#4EA8DE] p-6 text-white shadow-2xl md:p-10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="absolute -bottom-20 right-24 h-56 w-56 rounded-full bg-sky-200/20 blur-3xl" aria-hidden />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-sky-100">Cockpit do Cliente</p>
            <h1 className="mt-2 text-2xl font-semibold md:text-4xl">Bem-vindo, {displayName}</h1>
            <p className="mt-3 max-w-2xl text-sm text-sky-100 md:text-base">
              Gerencie suas viagens, monitorize reservas em tempo real e acompanhe pagamentos em um painel moderno da
              TOUR 360.
            </p>
            {nextFlight ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-sky-50 ring-1 ring-white/25">
                Proxima viagem: {nextFlight.packages?.name ?? "Pacote"} em {nextFlight.departure_date}
              </div>
            ) : (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm text-sky-50 ring-1 ring-white/25">
                Nenhuma viagem agendada ainda. Explore novos pacotes!
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pacotes"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0A2342] transition hover:bg-sky-100"
            >
              Explorar pacotes
            </Link>
            <SignOutButton />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Reservas recentes", value: totalBookings.toString(), tone: "text-[#0A2342]" },
          { label: "Viagens confirmadas", value: confirmedTrips.toString(), tone: "text-emerald-700" },
          { label: "Pagamentos pendentes", value: pendingPayments.toString(), tone: "text-amber-700" },
          { label: "Investimento total", value: formatCurrency(totalInvested), tone: "text-[#F97316]" },
        ].map((item) => (
          <article key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${item.tone}`}>{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#0A2342]">Atividade de viagens</h2>
            <Link href="/reservas" className="text-sm font-medium text-[#1D4E89] hover:underline">
              Ver tudo
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {bookings.length === 0 && vehicleBookings.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-600">
                Ainda nao ha reservas. Comece por escolher um pacote ou viatura para montar o seu proximo roteiro.
              </p>
            ) : null}

            {bookings.map((booking) => (
              <article
                key={booking.id}
                className="rounded-xl border border-zinc-200 bg-gradient-to-r from-white to-sky-50/60 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#0A2342]">{booking.packages?.name ?? "Pacote"}</h3>
                    <p className="text-sm text-zinc-600">
                      {booking.destinations?.name ?? "Destino nao informado"} • Partida {booking.departure_date}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#0A2342]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0A2342]">
                    {booking.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <p className="text-zinc-600">Pagamento: {booking.payment_status}</p>
                  <p className="font-semibold text-[#F97316]">{formatCurrency(booking.total_price)}</p>
                </div>
              </article>
            ))}

            {vehicleBookings.map((booking) => (
              <article key={booking.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[#0A2342]">
                      Viatura {booking.vehicles?.model ?? "nao disponivel"}
                    </h3>
                    <p className="text-sm text-zinc-600">
                      {booking.destination ?? "Destino nao informado"} • {booking.start_date} ate {booking.end_date}
                    </p>
                  </div>
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    {booking.status}
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#F97316]">{formatCurrency(booking.total_price)}</p>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0A2342]">Perfil do passageiro</h2>
            <div className="mt-4 space-y-2 text-sm text-zinc-700">
              <p>
                <span className="font-medium">Nome:</span> {profile?.full_name ?? "Nao informado"}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Telefone:</span> {profile?.phone ?? "Nao informado"}
              </p>
              <p>
                <span className="font-medium">Nivel:</span> {profile?.role ?? "client"}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#0A2342]">Acoes rapidas</h2>
            <div className="mt-4 grid gap-3">
              <Link
                href="/reservas"
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Minhas reservas
              </Link>
              <Link
                href="/viaturas"
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Reservar viatura
              </Link>
              <Link
                href="/contacto"
                className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Falar com suporte
              </Link>
              <Link
                href="/"
                className="rounded-lg bg-[#0A2342] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950"
              >
                Voltar ao inicio
              </Link>
              {isAdmin ? (
                <Link
                  href="/admin"
                  className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Ir para painel admin
                </Link>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
