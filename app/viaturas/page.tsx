import Link from "next/link";
import { Suspense } from "react";
import { Car, ChevronDown, MapPinned, Shield } from "lucide-react";
import { VehicleCard } from "@/components/viaturas/vehicle-card";
import { VehicleHowItWorksAside } from "@/components/viaturas/vehicle-how-it-works-aside";
import { VehicleBookingForm } from "@/components/viaturas/vehicle-booking-form";
import { VehicleRotatingInfo } from "@/components/viaturas/vehicle-rotating-info";
import { VehicleActiveBookingBanner } from "@/components/viaturas/vehicle-active-booking-banner";
import { PageBack } from "@/components/layout/page-back";
import { CountUp } from "@/components/ui/count-up";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/types";

type ActiveVehicleBookingRow = {
  start_date: string;
  end_date: string;
  destination: string | null;
  vehicles: { model: string } | { model: string }[] | null;
};

export default async function ViaturasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .order("price_per_day", { ascending: true });

  const vehicles = (data ?? []) as Vehicle[];

  const activeVehicleBooking = user
    ? await supabase
        .from("vehicle_bookings")
        .select("id, start_date, end_date, destination, status, vehicles(model)")
        .eq("user_id", user.id)
        .eq("status", "confirmada")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : null;

  const active = (activeVehicleBooking?.data ?? null) as ActiveVehicleBookingRow | null;
  const activeVehicleModel = Array.isArray(active?.vehicles) ? active?.vehicles[0]?.model : active?.vehicles?.model;

  const minPrice = vehicles.length
    ? Math.min(...vehicles.map((v) => Number(v.price_per_day) || 0))
    : 0;
  const availableCount = vehicles.filter((v) => v.is_available).length;

  return (
    <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-6 md:px-6 md:pb-20 md:pt-8">
        <PageBack href="/" label="Voltar ao inicio" variant="inverted" className="mb-6" />

        <ScrollReveal as="section" className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f3560] via-[#143a6b] to-[#1D4E89] px-5 py-10 text-white shadow-xl ring-1 ring-white/10 md:px-10 md:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" aria-hidden />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/90">Frota & mobilidade</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Viaturas</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-sky-100 md:text-base">
              Aluguer por dia, transferes, turismo e apoio a grupos. Escolha o modelo, defina o periodo e o destino — o
              valor estimado actualiza de imediato.
            </p>
            <div className="mt-5">
              <VehicleRotatingInfo />
            </div>
          </div>

          {vehicles.length > 0 ? (
            <div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Modelos na frota",
                  value: String(vehicles.length),
                  sub: "Actualizado em tempo real",
                  icon: Car,
                },
                {
                  label: "Desde",
                  value: formatCurrency(minPrice),
                  sub: "por dia (estimado)",
                  icon: MapPinned,
                },
                {
                  label: "Disponiveis hoje",
                  value: String(availableCount),
                  sub: "para novas reservas",
                  icon: Shield,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="ui-grid-card flex items-start gap-3 p-4 ring-1 ring-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-cyan-100">
                    <s.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-sky-200/90">{s.label}</p>
                    <p className="text-xl font-bold tabular-nums">
                      {s.label === "Desde" ? (
                        s.value
                      ) : (
                        <CountUp to={Number(s.value) || 0} />
                      )}
                    </p>
                    <p className="text-[11px] text-sky-100/80">{s.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </ScrollReveal>

        {active?.end_date && activeVehicleModel ? (
          <VehicleActiveBookingBanner
            vehicleModel={activeVehicleModel}
            destination={active.destination ?? null}
            startDate={active.start_date}
            endDate={active.end_date}
          />
        ) : null}

        <div className="mt-8 md:mt-10">
          <ScrollReveal as="section" className="rounded-3xl border border-white/15 bg-white p-6 shadow-2xl shadow-black/20 ring-1 ring-white/20 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 border-b border-zinc-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-700)]">Frota</p>
                <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[color:var(--brand-900)] md:text-3xl">
                  Frota disponivel
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 md:text-[0.95rem]">
                  Em cada cartao ve o <strong className="font-semibold text-zinc-800">modelo</strong>, a{" "}
                  <strong className="font-semibold text-zinc-800">lotacao</strong> e a{" "}
                  <strong className="font-semibold text-zinc-800">tarifa diaria em MT</strong>. A esquerda, o resumo
                  do servico; a direita, a seleccao de viaturas. O formulario de reserva esta no fim da pagina.
                </p>
              </div>
              <Link
                href="#reservar-viatura"
                className="ui-btn inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-[color:var(--brand-900)] hover:border-[color:var(--brand-500)]/40 hover:bg-white sm:self-end"
              >
                Ir para reserva
                <ChevronDown className="h-4 w-4 opacity-90" aria-hidden />
              </Link>
            </div>

            {vehicles.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-8 text-center text-sm text-zinc-600">
                Nenhuma viatura cadastrada de momento. Volte em breve.
              </div>
            ) : (
              <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
                <VehicleHowItWorksAside ctaHref="#reservar-viatura" />
                <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-2">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              </div>
            )}
          </ScrollReveal>

          <Suspense
            fallback={
              <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-8 text-center text-sm text-sky-100/80 backdrop-blur-sm">
                A carregar formulario de reserva...
              </div>
            }
          >
            <VehicleBookingForm
              vehicles={vehicles}
              isAuthenticated={Boolean(user)}
              loginHref={`/login?next=${encodeURIComponent("/viaturas#reservar-viatura")}`}
            />
          </Suspense>
        </div>
    </main>
  );
}
