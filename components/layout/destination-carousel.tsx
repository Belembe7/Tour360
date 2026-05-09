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
              className="group flex h-[330px] w-[280px] flex-none snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-zinc-900/[0.03] transition hover:-translate-y-1 hover:shadow-lg md:w-[300px]"
            >
              <div className="relative h-[185px] w-full overflow-hidden bg-zinc-100">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 280px, 300px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                />
                <div className="absolute left-3 top-3 inline-flex rounded-md bg-[color:var(--brand-900)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Destino
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h4 className="text-lg font-bold leading-tight text-[color:var(--brand-900)]">{item.title}</h4>
                <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm text-zinc-600">
                  {item.subtitle}
                </p>

                <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--brand-700)] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-900)]">
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
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white/90 p-3 text-[color:var(--brand-900)] shadow-sm backdrop-blur-sm transition hover:bg-white"
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

