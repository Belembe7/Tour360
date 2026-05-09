import Link from "next/link";
import { BadgeDollarSign, Headphones, PhoneCall } from "lucide-react";
import { HeroRotatingBg } from "@/components/layout/hero-rotating-bg";
import { HeroRotatingHeadline } from "@/components/layout/hero-rotating-headline";
import { RotatingMozambiqueSubtitle } from "@/components/layout/rotating-mozambique-subtitle";
import { RotatingInternationalSubtitle } from "@/components/layout/rotating-international-subtitle";
import { RotatingAboutHeadline } from "@/components/layout/rotating-about-headline";
import { PackageCard } from "@/components/packages/package-card";
import { VehicleCard } from "@/components/viaturas/vehicle-card";
import { VehicleHowItWorksAside } from "@/components/viaturas/vehicle-how-it-works-aside";
import { HelpCta } from "@/components/layout/help-cta";
import { TravelPlannerCard } from "@/components/layout/travel-planner-card";
import { DestinationCarousel } from "@/components/layout/destination-carousel";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { createClient } from "@/lib/supabase/server";
import type { Package, Vehicle } from "@/types";

export default async function Home() {
  const supabase = await createClient();
  const [{ data: nationalPackages }, { data: internationalPackages }, { data: vehicles }] =
    await Promise.all([
      supabase
        .from("packages")
        .select("*")
        .eq("type", "nacional")
        .eq("is_active", true)
        .order("price_min", { ascending: true })
        .limit(3),
      supabase
        .from("packages")
        .select("*")
        .eq("type", "internacional")
        .eq("is_active", true)
        .order("price_min", { ascending: true })
        .limit(3),
      supabase
        .from("vehicles")
        .select("*")
        .eq("is_available", true)
        .order("price_per_day", { ascending: true })
        .limit(3),
    ]);

  const nationalItems = ((nationalPackages ?? []) as Package[]).slice(0, 3);
  const internationalItems = ((internationalPackages ?? []) as Package[]).slice(0, 3);
  const vehicleItems = ((vehicles ?? []) as Vehicle[]).slice(0, 3);

  return (
    <main className="flex w-full flex-1 flex-col">
      {/* Fundo fotográfico em largura total (abaixo da navbar); conteúdo por cima, sem imagem dentro de card */}
      <section className="relative w-full min-h-[min(78vh,760px)] overflow-hidden">
        <HeroRotatingBg />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/50"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 text-white md:grid-cols-2 md:py-14 md:pb-16">
          <div>
            <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              Agencia de viagens e turismo - Mocambique
            </p>
            <HeroRotatingHeadline />
            <p className="mt-4 max-w-xl text-white/90">
              Pacotes nacionais e internacionais, viaturas, e servicos corporativos com
              qualidade, seguranca e conforto.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pacotes"
                className="ui-btn rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--brand-900)] hover:bg-white/90"
              >
                Explorar pacotes
              </Link>
              <Link
                href="/contacto"
                className="ui-btn rounded-md border border-white/60 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Contactar
              </Link>
            </div>
          </div>

          <TravelPlannerCard />
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-4 py-8">
      {/* Cards destaques (template-inspired) */}
      <ScrollReveal as="section" className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Pacotes",
            desc: "Escolha experiencias nacionais e internacionais com suporte total.",
            href: "/pacotes",
          },
          {
            title: "Viaturas",
            desc: "Reservas por dia para turismo, transfer e deslocacoes corporativas.",
            href: "/viaturas",
          },
          {
            title: "Corporativo",
            desc: "Modalidades antecipado/postecipado e abertura de ficha empresarial.",
            href: "/corporativo",
          },
        ].map((card, index) => (
          <Link
            key={card.title}
            href={card.href}
            className={`floating-card floating-card-${index + 1} ui-reveal ${
              index === 1 ? "ui-reveal-delay-1" : index === 2 ? "ui-reveal-delay-2" : ""
            } rounded-xl border border-zinc-200 bg-white p-6 shadow-lg shadow-[color:var(--brand-900)]/10 transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-[color:var(--brand-700)]/20`}
          >
            <p className="text-sm font-semibold text-[color:var(--brand-900)]">{card.title}</p>
            <p className="mt-2 text-sm text-zinc-600">{card.desc}</p>
            <p className="mt-4 text-sm font-semibold text-[color:var(--brand-700)]">
              Saiba mais →
            </p>
          </Link>
        ))}
      </ScrollReveal>

      {/* Opcoes de destino (carousel) */}
      <DestinationCarousel />

      <ScrollReveal as="section" className="ui-section-sep">
        <div className="mb-5 rounded-xl bg-[color:var(--brand-900)] px-5 py-4 text-center">
          <h2 className="text-2xl font-bold text-white">Pacotes nacionais</h2>
          <div className="mt-1">
            <RotatingMozambiqueSubtitle />
          </div>
          <Link
            href="/pacotes?type=nacional"
            className="mt-2 inline-block text-sm font-semibold text-cyan-200 hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {nationalItems.map((item) => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className="ui-section-sep">
        <div className="mb-5 rounded-xl bg-[color:var(--brand-900)] px-5 py-4 text-center">
          <h2 className="text-2xl font-bold text-white">Pacotes internacionais</h2>
          <div className="mt-1">
            <RotatingInternationalSubtitle />
          </div>
          <Link
            href="/pacotes?type=internacional"
            className="mt-2 inline-block text-sm font-semibold text-cyan-200 hover:underline"
          >
            Ver todos
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {internationalItems.map((item) => (
            <PackageCard key={item.id} item={item} />
          ))}
        </div>
      </ScrollReveal>

      {/* CTA (template-inspired) */}
      <HelpCta />

      <ScrollReveal
        as="section"
        className="relative overflow-hidden rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm ring-1 ring-zinc-900/[0.04] md:p-8 lg:p-10"
      >
        <div
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[color:var(--brand-500)]/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl"
          aria-hidden
        />
        <div className="ui-reveal relative flex flex-col gap-6 border-b border-zinc-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-700)]">Frota</p>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-[color:var(--brand-900)] md:text-3xl">
              Viaturas em destaque
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-[0.95rem]">
              Seleccao de modelos para turismo, transfer e deslocacoes executivas. Tarifas por dia visiveis em cada
              cartao; a reserva confirma-se no seu painel apos autenticacao.
            </p>
          </div>
          <Link
            href="/viaturas"
            className="ui-btn inline-flex shrink-0 items-center justify-center self-start rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-semibold text-[color:var(--brand-900)] transition hover:border-[color:var(--brand-500)]/40 hover:bg-white sm:self-end"
          >
            Ver toda a frota
          </Link>
        </div>
        <div className="relative mt-8 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          <VehicleHowItWorksAside />
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-2">
            {vehicleItems.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={`ui-reveal ${index === 1 ? "ui-reveal-delay-1" : index === 2 ? "ui-reveal-delay-2" : ""}`}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal
        as="section"
        className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-[#0A2342] via-[#143a6b] to-[#0c2848] text-white shadow-lg ring-1 ring-zinc-900/10"
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(70%_50%_at_100%_0%,rgba(78,168,222,0.12),transparent)]"
          aria-hidden
        />
        <div className="relative p-6 md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">
            <div>
              <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100">
                Quem somos
              </p>
              <div className="mt-4">
                <RotatingAboutHeadline />
              </div>
              <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300/80 to-transparent" aria-hidden />
              <Link
                href="/sobre"
                className="mt-6 inline-flex text-sm font-semibold text-cyan-200 transition hover:text-white"
              >
                Conhecer a TOUR 360 →
              </Link>
            </div>

            <div className="space-y-5 text-sm leading-relaxed text-sky-50/90 md:text-[0.95rem] md:leading-relaxed">
              <p>
                Agencia de viagens e turismo com foco em experiencias memoraveis: processos claros, resposta rapida e
                acompanhamento humano desde o primeiro contacto ate ao regresso.
              </p>
              <p>
                Integramos pacotes nacionais e internacionais com mobilidade (transfer e aluguer por dia), apoiando
                particulares e empresas com previsibilidade de custos e seguranca operacional.
              </p>
              <p className="font-medium text-white">
                Sugerimos rotas e solucoes completas alinhadas ao seu perfil, calendario e orcamento — para viajar com
                tranquilidade.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Suporte dedicado",
                text: "Equipa disponivel antes, durante e apos a viagem para ajustes e imprevistos.",
                icon: Headphones,
              },
              {
                title: "Transparencia de custos",
                text: "Propostas por escrito, sem surpresas — opcoes para diferentes niveis de investimento.",
                icon: BadgeDollarSign,
              },
              {
                title: "Canais de contacto",
                text: "Linha directa e email para duvidas, alteracoes e confirmacao de servicos.",
                icon: PhoneCall,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left ring-1 ring-white/5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/[0.09]"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-cyan-100 ring-1 ring-white/10">
                  <item.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-sky-100/80">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
      </div>
    </main>
  );
}
