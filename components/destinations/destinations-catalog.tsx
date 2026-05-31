"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DESTINATION_CATALOG_SECTIONS,
  DESTINATION_SECTION_LABELS,
  getCatalogSection,
  type DestinationCatalogSectionId,
} from "@/lib/destinations/catalog";
import { DestinationCatalogCard } from "@/components/destinations/destination-catalog-card";

const SECTION_IDS = DESTINATION_CATALOG_SECTIONS.map((s) => s.id);

function isValidSection(value: string | null): value is DestinationCatalogSectionId {
  return value !== null && SECTION_IDS.includes(value as DestinationCatalogSectionId);
}

export function DestinationsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("secao");
  const activeId: DestinationCatalogSectionId = isValidSection(param) ? param : "nacional";
  const section = getCatalogSection(activeId);

  function selectSection(id: DestinationCatalogSectionId) {
    router.push(`/pacotes?secao=${id}#catalogo-destinos`, { scroll: false });
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/90">Catalogo de destinos</p>
        <p className="mt-2 text-sm font-medium italic text-white/80">O mundo ao seu alcance!</p>

        <h2 className="mt-4 text-2xl font-extrabold uppercase tracking-wide text-white md:text-3xl">
          {section.title}
        </h2>

        {section.badge ? (
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-cyan-300/40" aria-hidden />
            <span className="text-sm font-extrabold uppercase tracking-[0.25em] text-cyan-200">
              {section.badge}
            </span>
            <span className="h-px w-12 bg-cyan-300/40" aria-hidden />
          </div>
        ) : (
          <div className="mt-3 flex justify-center gap-1 text-cyan-200" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        )}

        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-cyan-100/90">{section.subtitle}</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80">{section.intro}</p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        {DESTINATION_CATALOG_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => selectSection(s.id)}
            className={[
              "rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
              s.id === activeId
                ? "bg-white text-[color:var(--brand-900)] shadow-sm"
                : "border border-white/30 bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            {DESTINATION_SECTION_LABELS[s.id]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {section.items.map((item) => (
            <DestinationCatalogCard
              key={`${activeId}-${item.number}-${item.name}`}
              item={item}
              sectionId={activeId}
            />
        ))}
      </div>
    </div>
  );
}
