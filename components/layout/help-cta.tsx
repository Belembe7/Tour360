"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type Message = {
  title: string;
  subtitle: string;
  cta: string;
  href: string;
};

const ROTATE_EVERY_MS = 5500;

export function HelpCta() {
  const messages: Message[] = useMemo(
    () => [
      {
        title: "Planeamento de viagem com especialistas",
        subtitle:
          "Analisamos datas, destinos e orcamento e devolvemos uma proposta clara — sem complicar o processo.",
        cta: "Pedir orientacao",
        href: "/contacto",
      },
      {
        title: "Da primeira ideia ao regresso, com acompanhamento",
        subtitle:
          "Coordenamos rotas, reservas e suporte operacional para que se concentre apenas na experiencia.",
        cta: "Falar com a equipa",
        href: "/contacto",
      },
      {
        title: "Pacotes nacionais e internacionais sob medida",
        subtitle:
          "Indique o estilo de viagem e o perfil do grupo; montamos opcoes alinhadas ao que procura.",
        cta: "Ver pacotes",
        href: "/pacotes",
      },
      {
        title: "Viaturas para turismo, transfer e corporativo",
        subtitle:
          "Frota com disponibilidade controlada e tarifas transparentes — em Maputo, Beira e deslocacoes nacionais.",
        cta: "Reservar viatura",
        href: "/viaturas",
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);
  const active = messages[index]!;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2342] via-[#123a63] to-[#0d2850] text-white shadow-xl shadow-[#0A2342]/20 ring-1 ring-black/5">
      <div className="cta-pattern pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl"
        aria-hidden
      />

      <div className="relative px-5 py-10 text-center md:px-12 md:py-14">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-sky-100/95">
          <Sparkles className="h-3.5 w-3.5 text-cyan-200" aria-hidden />
          Assistencia TOUR 360
        </div>

        <div key={index} className="cta-swap">
          <h3 className="mx-auto min-h-[4.5rem] max-w-3xl text-2xl font-bold leading-snug tracking-tight text-white md:min-h-[5.5rem] md:text-3xl lg:text-[2.1rem]">
            {active.title}
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-sky-100/90 md:text-base">
            {active.subtitle}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Seleccionar mensagem">
          {messages.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              onClick={() => setIndex(i)}
              className={[
                "h-1.5 rounded-full transition-all",
                i === index ? "w-8 bg-cyan-200" : "w-2 bg-white/25 hover:bg-white/40",
              ].join(" ")}
              aria-label={`Mensagem ${i + 1} de ${messages.length}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href={active.href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[color:var(--brand-900)] shadow-sm transition hover:bg-sky-50"
          >
            {active.cta}
          </Link>
          <Link
            href="/contacto"
            className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-white/35 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            Brief rapido por email
          </Link>
        </div>

        <p className="mt-5 text-[11px] text-sky-200/60">
          Sugestao {index + 1} de {messages.length} · alterna automaticamente
        </p>
      </div>
    </section>
  );
}
