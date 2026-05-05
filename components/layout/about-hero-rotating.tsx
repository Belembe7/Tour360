"use client";

import { useEffect, useMemo, useState } from "react";

type Slide = {
  title: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

const ROTATE_EVERY_MS = 5000;

export function AboutHeroRotating() {
  const slides: Slide[] = useMemo(
    () => [
      {
        title: "O mundo ao seu alcance, com conforto e seguranca.",
        subtitle:
          "Somos uma agencia de viagens e turismo focada no mercado mocambicano, com pacotes nacionais e internacionais, transfer e servicos corporativos.",
        primary: { label: "Contactar", href: "/contacto" },
        secondary: { label: "Ver pacotes", href: "/pacotes" },
      },
      {
        title: "Planeamento completo, do inicio ao fim.",
        subtitle:
          "Sugerimos destinos, datas e opcoes de acordo com o seu orcamento — e acompanhamos cada etapa para voce viajar sem stress.",
        primary: { label: "Falar com a equipa", href: "/contacto" },
        secondary: { label: "Explorar destinos", href: "/pacotes" },
      },
      {
        title: "Transfer e viaturas para turismo e servicos executivos.",
        subtitle:
          "Opcoes para grupos e deslocacoes corporativas, com foco em conforto, pontualidade e seguranca.",
        primary: { label: "Ver viaturas", href: "/viaturas" },
        secondary: { label: "Solicitar proposta", href: "/contacto" },
      },
      {
        title: "Solucao corporativa para a sua empresa.",
        subtitle:
          "Modalidades antecipado/postecipado, abertura de ficha e suporte para gestao de viagens com previsibilidade de custos.",
        primary: { label: "Ver corporativo", href: "/corporativo" },
        secondary: { label: "Contactar", href: "/contacto" },
      },
    ],
    [],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[index]!;

  return (
    <div key={index} className="cta-swap">
      <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">{slide.title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-white/85 md:text-base">{slide.subtitle}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <a
          href={slide.primary.href}
          className="inline-flex rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-[color:var(--brand-900)] transition hover:bg-white/90"
        >
          {slide.primary.label}
        </a>
        <a
          href={slide.secondary.href}
          className="inline-flex rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          {slide.secondary.label}
        </a>
      </div>
    </div>
  );
}

