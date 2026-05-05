"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

type DestinationOption = {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
};

export function DestinationCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const items: DestinationOption[] = useMemo(
    () => [
      {
        title: "Cidade da Beira",
        subtitle: "Arquitectura, praia e vida cultural",
        imageSrc: "/images/dest-beira.png",
        href: "/pacotes?destino=Cidade%20da%20Beira",
      },
      {
        title: "Tofo",
        subtitle: "Praia, mergulho e experiencias costeiras",
        imageSrc: "/images/dest-tofo.png",
        href: "/pacotes?destino=Tofo",
      },
      {
        title: "Vilankulo",
        subtitle: "Bazaruto, dunas e mar turquesa",
        imageSrc: "/images/dest-vilankulo.png",
        href: "/pacotes?destino=Vilankulo",
      },
      {
        title: "Ponta do Ouro",
        subtitle: "Escapadinhas, praia e natureza",
        imageSrc: "/images/dest-ponta-do-ouro.png",
        href: "/pacotes?destino=Ponta%20do%20Ouro",
      },
      {
        title: "Maputo",
        subtitle: "Cultura urbana, historia e gastronomia",
        imageSrc: "/images/dest-maputo.png",
        href: "/pacotes?destino=Maputo",
      },
      {
        title: "Inhambane",
        subtitle: "Patrimonio, praias e tranquilidade",
        imageSrc: "/images/dest-inhambane.png",
        href: "/pacotes?destino=Inhambane",
      },
    ],
    [],
  );

  function scrollNext() {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-destination-card]");
    const step = (card?.offsetWidth ?? 320) + 16;
    el.scrollBy({ left: step * 2, behavior: "smooth" });
  }

  return (
    <section className="relative">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-extrabold text-white md:text-2xl">Opcoes de destino</h3>
          <p className="mt-1 text-sm text-white/75">
            Explore ideas rapidas — deslize ou clique na seta para ver mais.
          </p>
        </div>
        <Link href="/pacotes" className="text-sm font-semibold text-cyan-200 hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="destination-scroll flex gap-4 overflow-x-auto pb-2 pr-10"
        >
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              data-destination-card
              className="group relative h-[340px] w-[280px] flex-none snap-start overflow-hidden rounded-2xl border border-white/20 bg-black/20 shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg md:w-[300px]"
            >
              <Image
                src={item.imageSrc}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80" />

              <div className="absolute left-4 top-4 inline-flex rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm">
                Destino
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h4 className="text-lg font-extrabold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
                  {item.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-2 rounded-md border border-white/25 bg-black/35 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/50">
                  Ver opcoes
                  <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-black/35 p-3 text-white shadow-sm backdrop-blur-sm transition hover:bg-black/50"
          aria-label="Ver mais destinos"
          title="Ver mais destinos"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}

