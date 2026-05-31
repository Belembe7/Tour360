import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarRange, Car, UtensilsCrossed } from "lucide-react";
import { catalogImageUrl, type DestinationCatalogItem, type DestinationCatalogSectionId } from "@/lib/destinations/catalog";
import { buildCatalogReservationHref } from "@/lib/destinations/catalog-booking";
import { formatCurrency } from "@/lib/utils";

type Props = {
  item: DestinationCatalogItem;
  sectionId: DestinationCatalogSectionId;
};

export function DestinationCatalogCard({ item, sectionId }: Props) {
  const reserveHref = buildCatalogReservationHref(sectionId, item.name);

  return (
    <article className="ui-surface-lift flex flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-lg shadow-black/15 ring-1 ring-zinc-900/[0.04] transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-stretch bg-[color:var(--brand-900)]">
        <span className="flex w-11 shrink-0 items-center justify-center bg-[color:var(--brand-500)] text-sm font-extrabold text-white">
          {String(item.number).padStart(2, "0")}
        </span>
        <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
          <h3 className="truncate text-sm font-bold uppercase tracking-wide text-white">{item.name}</h3>
          <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-cyan-100/90">
            {item.region}
          </p>
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full bg-zinc-100">
        <Image
          src={catalogImageUrl(item.imageSeed)}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={75}
          loading="lazy"
          className="object-cover"
        />
      </div>

      <ul className="flex flex-1 flex-col gap-2.5 px-3 py-3 text-[11px] leading-snug text-zinc-700">
        <li className="flex items-start gap-2">
          <CalendarRange className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <span>{item.duration}</span>
        </li>
        <li className="flex items-start gap-2">
          <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <span>{item.hotel}</span>
        </li>
        <li className="flex items-start gap-2">
          <UtensilsCrossed className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <span>{item.meals}</span>
        </li>
        <li className="flex items-start gap-2">
          <Car className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <span>{item.transport}</span>
        </li>
      </ul>

      <div className="bg-[color:var(--brand-900)] px-3 py-3 text-center">
        <p className="text-[10px] font-medium uppercase tracking-wide text-white/80">A partir de</p>
        <p className="text-lg font-extrabold tabular-nums text-cyan-200">{formatCurrency(item.priceFrom)}</p>
        <Link
          href={reserveHref}
          className="ui-btn mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[color:var(--brand-500)] px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-400"
        >
          Fazer reserva
        </Link>
      </div>
    </article>
  );
}
