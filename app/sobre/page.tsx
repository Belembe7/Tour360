import { AboutHeroRotating } from "@/components/layout/about-hero-rotating";
import { PageBack } from "@/components/layout/page-back";
import { CountUp } from "@/components/ui/count-up";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function SobrePage() {
  return (
    <main className="w-full flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-[color:var(--brand-900)]/95" aria-hidden />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <PageBack href="/" label="Voltar ao inicio" variant="inverted" className="mb-6" />
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest ring-1 ring-white/15">
              Sobre a TOUR 360
            </p>
            <AboutHeroRotating />
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-12 md:py-14">
        {/* About Us */}
        <ScrollReveal as="section">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Quem somos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">
              Planeamos, reservamos e acompanhamos — para que voce viaje com tranquilidade.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="ui-glass-surface rounded-2xl p-6 ring-1 ring-white/10 backdrop-blur-sm">
              <p className="text-sm leading-relaxed text-white/85">
                A TOUR 360 apoia particulares e empresas com solucoes completas: pacotes
                nacionais e internacionais, aluguer de viaturas para turismo/transfer e
                modalidades corporativas (antecipado/postecipado).
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                O nosso foco e simplificar o processo, garantir boa comunicacao e entregar uma
                experiencia premium — desde o primeiro contacto ate ao retorno.
              </p>
              <div className="mt-6">
                <a
                  href="/contacto"
                  className="inline-flex rounded-md bg-[color:var(--brand-700)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-500)]"
                >
                  Saber mais
                </a>
              </div>
            </div>

            <div className="ui-glass-surface rounded-2xl p-2 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="divide-y divide-white/10">
                <details className="group p-5" open>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
                    O que a TOUR 360 faz?
                    <span className="text-white/70 transition group-open:rotate-90">›</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Organizamos pacotes, reservas e suporte de viagem, incluindo transfer e
                    viaturas, para turismo e servicos executivos.
                  </p>
                </details>
                <details className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
                    Voces atendem empresas?
                    <span className="text-white/70 transition group-open:rotate-90">›</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Sim. Temos opcoes corporativas com abertura de ficha, limites e modalidades
                    de pagamento adaptadas ao seu negocio.
                  </p>
                </details>
                <details className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
                    Como garantir suporte durante a viagem?
                    <span className="text-white/70 transition group-open:rotate-90">›</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/80">
                    Mantemos comunicacao rapida e acompanhamento para garantir tranquilidade em
                    cada etapa.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats band */}
        <ScrollReveal
          as="section"
          className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-r from-[color:var(--brand-700)]/55 via-cyan-400/25 to-[color:var(--brand-900)]/55 ring-1 ring-white/10"
        >
          <div className="grid gap-4 p-6 text-white md:grid-cols-4 md:gap-6 md:p-8">
            {[
              { value: "24/7", label: "Suporte e acompanhamento" },
              { value: "50+", label: "Opcoes de destinos" },
              { value: "100+", label: "Clientes atendidos" },
              { value: "100%", label: "Foco em seguranca" },
            ].map((s) => (
              <div key={s.label} className="ui-grid-card p-5 text-center backdrop-blur-sm ring-1 ring-white/10">
                <p className="text-3xl font-extrabold">
                  {s.value === "24/7" || s.value === "100%" ? (
                    s.value
                  ) : (
                    <>
                      <CountUp to={Number.parseInt(s.value, 10)} />
                      +
                    </>
                  )}
                </p>
                <p className="mt-2 text-sm text-white/85">{s.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Why Us */}
        <ScrollReveal as="section" className="mt-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Por que a TOUR 360?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">
              Uma experiencia completa, com qualidade, conforto e transparência.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Planeamento inteligente",
                desc: "Recomendacoes, rotas e opcoes ajustadas ao seu perfil e orcamento.",
                img: "/images/about-hq-1.jpg",
                floatClass: "floating-card floating-card-1",
              },
              {
                title: "Conforto e seguranca",
                desc: "Frota e parceiros selecionados para garantir uma viagem tranquila.",
                img: "/images/about-hq-2.jpg",
                floatClass: "floating-card floating-card-2",
              },
              {
                title: "Suporte rapido",
                desc: "Acompanhamento e comunicacao clara antes, durante e depois da viagem.",
                img: "/images/suporte.png",
                floatClass: "floating-card floating-card-3",
              },
            ].map((c) => (
              <article
                key={c.title}
                className={`group relative overflow-hidden rounded-2xl ring-1 ring-white/10 transition-transform duration-500 will-change-transform hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(0,0,0,0.35)] ${c.floatClass}`}
              >
                <div className="absolute inset-0 bg-[color:var(--brand-900)]/30" aria-hidden />
                <div className="relative h-40 overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-[1.03]">
                    <img
                      src={c.img}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      aria-hidden
                    />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/70" aria-hidden />
                <div className="relative p-6">
                  <h3 className="text-lg font-extrabold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm text-white/80">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </ScrollReveal>

        {/* Our Services */}
        <ScrollReveal as="section" className="mt-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white md:text-4xl">Os nossos servicos</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-base">
              Tudo o que voce precisa para viajar com qualidade e previsibilidade.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Pacotes nacionais",
                desc: "Experiencias em Mocambique com suporte completo e roteiros personalizados.",
              },
              {
                title: "Pacotes internacionais",
                desc: "Planeamento, reservas e acompanhamento para destinos fora do pais.",
              },
              {
                title: "Viaturas e transfer",
                desc: "Frota para turismo, transfer e servicos executivos com conforto.",
              },
              {
                title: "Corporativo",
                desc: "Modalidades de pagamento e ficha empresarial para gestao de viagens.",
              },
              {
                title: "Assistencia e suporte",
                desc: "Atendimento rapido e acompanhamento em todas as etapas da viagem.",
              },
              {
                title: "Orcamentos sob medida",
                desc: "Propostas claras, transparentes e adaptadas ao seu objetivo.",
              },
            ].map((s) => (
              <div key={s.title} className="ui-grid-card p-6 ring-1 ring-white/10 backdrop-blur-sm">
                <p className="text-base font-extrabold text-white">{s.title}</p>
                <p className="mt-2 text-sm text-white/80">{s.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
