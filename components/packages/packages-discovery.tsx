"use client";

import { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { Package } from "@/types";
import { PackageCard } from "@/components/packages/package-card";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Props = {
  items: Package[];
};

export function PackagesDiscovery({ items }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");

  const visibleItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.description ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

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
          <div className="mx-auto mt-5 max-w-lg">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-400"
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar pacotes, categoria ou destino..."
                className="ui-field w-full rounded-xl border border-white/25 bg-white/95 py-3 pl-10 pr-3 text-sm text-zinc-800 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-[color:var(--brand-500)] focus:bg-white focus:ring-2 focus:ring-[color:var(--brand-500)]/20"
              />
            </label>
            <p className="mt-2 text-xs text-white/75">{visibleItems.length} pacotes encontrados</p>
          </div>
        </div>

        <ScrollReveal as="div" className="relative">
          <div ref={scrollerRef} className="destination-scroll flex gap-4 overflow-x-auto pb-2 pr-10">
            {visibleItems.map((item, index) => (
              <div
                key={item.id}
                data-package-card
                className={`floating-card floating-card-${(index % 3) + 1} w-[255px] flex-none md:w-[270px]`}
              >
                <PackageCard item={item} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            className="ui-btn absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 text-zinc-700 shadow-lg hover:scale-105"
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
        </ScrollReveal>
        {!visibleItems.length ? (
          <div className="mt-5 rounded-2xl border border-white/20 bg-white/10 px-4 py-4 text-center text-sm text-white/90">
            Nenhum pacote encontrado para essa pesquisa.
          </div>
        ) : null}
      </section>
    </section>
  );
}
