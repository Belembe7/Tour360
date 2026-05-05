"use client";

import { useMemo, useRef, useState } from "react";
import type { Package } from "@/types";
import { PackageCard } from "@/components/packages/package-card";

type Props = {
  items: Package[];
};

export function PackagesDiscovery({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const visibleItems = useMemo(() => items, [items]);

  function scrollNext() {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-package-card]");
    const step = (card?.offsetWidth ?? 260) + 16;
    el.scrollBy({ left: step * 2, behavior: "smooth" });
  }

  return (
    <section className="space-y-10">
      <section className="relative">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Viagens na ponta dos dedos
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-white/75 md:text-base">
            Libere seu explorador de viagem com essas ofertas de pacotes de ferias.
          </p>
        </div>

        <div className="relative">
          <div ref={scrollerRef} className="destination-scroll flex gap-4 overflow-x-auto pb-2 pr-10">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                data-package-card
                className="w-[255px] flex-none md:w-[270px]"
              >
                <PackageCard item={item} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-zinc-700 shadow-lg transition hover:scale-105"
            aria-label="Ver mais pacotes"
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
    </section>
  );
}

