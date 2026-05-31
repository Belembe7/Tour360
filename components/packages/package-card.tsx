import Link from "next/link";
import Image from "next/image";
import type { Package } from "@/types";
import { formatCurrency } from "@/lib/utils";

function categoryLabel(category: Package["category"]) {
  if (category === "economico") return "Economico";
  if (category === "intermediario") return "Intermediario";
  return "Premium";
}

export function PackageCard({ item }: { item: Package }) {
  const coverBySlug: Record<string, string> = {
    // Pacotes nacionais (imagens atualizadas)
    hinkwero: "/images/package-nacional-1.png",
    ciriro: "/images/package-nacional-2.png",
    kaiyssa: "/images/package-nacional-3.png",
    "premium-internacional": "/images/package-international-premium.png",
    "intermediario-internacional": "/images/package-international-intermediario.png",
    "basico-internacional": "/images/package-international-economico.png",
  };
  const cover =
    coverBySlug[item.slug] ??
    (item.type === "nacional" ? "/images/package-nacional-1.png" : "/images/maputo.jpg");

  return (
    <article className="group ui-surface-lift flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm ring-1 ring-zinc-900/[0.03]">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        <Image
          src={cover}
          alt={item.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 inline-flex rounded-md bg-[color:var(--brand-900)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {item.type === "nacional" ? "Nacional" : "Internacional"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-full bg-[color:var(--brand-50)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--brand-900)] ring-1 ring-[color:var(--brand-500)]/20">
            {categoryLabel(item.category)}
          </span>
          <span className="text-[11px] font-medium text-zinc-500">TOUR 360</span>
        </div>

        <h3 className="text-lg font-bold leading-tight text-[color:var(--brand-900)]">{item.name}</h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-zinc-600">
          {item.description ?? "Pacote turistico com servico TOUR 360."}
        </p>

        <div className="mt-4 border-t border-zinc-100 pt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Preco inicial</p>
          <p className="mt-1 text-xl font-bold text-[color:var(--brand-900)]">{formatCurrency(item.price_min)}</p>
        </div>

        <Link
          href={`/pacotes/${item.slug}`}
          className="ui-btn mt-4 inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--brand-700)] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[color:var(--brand-900)]"
        >
          Fazer reserva
        </Link>
      </div>
    </article>
  );
}
