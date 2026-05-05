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
    <article className="group relative overflow-hidden rounded-xl border border-white/35 bg-transparent shadow-sm transition-transform duration-300 ease-out hover:scale-[1.08] hover:shadow-xl active:scale-[1.02]">
      <div
        className="pointer-events-none absolute -inset-1 -z-10 rounded-[1rem] bg-gradient-to-r from-cyan-300/45 via-sky-300/35 to-blue-300/45 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />
      <Image src={cover} alt={item.name} fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/75" />

      <div className="relative flex min-h-96 flex-col justify-end p-5">
        <div className="mb-2">
          <span className="inline-flex rounded-full bg-[color:var(--brand-700)] px-3 py-1 text-xs font-extrabold tracking-wide text-white shadow-sm">
            {categoryLabel(item.category)}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
          {item.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-zinc-100 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
          {item.description ?? "Pacote turistico com servico TOUR 360."}
        </p>
        <p className="mt-4 text-sm font-extrabold tracking-wide text-cyan-200 [text-shadow:0_1px_8px_rgba(0,0,0,0.7)]">
          Desde {formatCurrency(item.price_min)}
        </p>
        <Link
          href={`/pacotes/${item.slug}`}
          className="mt-4 inline-flex w-fit rounded-md border border-white/35 bg-black/45 px-3 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          Reservar
        </Link>
      </div>
    </article>
  );
}
