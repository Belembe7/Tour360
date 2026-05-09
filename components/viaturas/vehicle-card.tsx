import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Vehicle } from "@/types";

/** Query evita cache antigo do optimizador Next (`/_next/image`) quando o ficheiro em `public/` e substituido. */
const LAND_CRUISER_COVER = "/images/landcruiser.png?v=3";

function isLandCruiserModel(model: string) {
  const m = model.toLowerCase();
  return m.includes("land cruiser") || m.includes("prado");
}

function pickCoverImage(vehicle: Vehicle) {
  const m = vehicle.model.toLowerCase();
  if (m.includes("quantum")) return "/images/quantum.png";
  if (isLandCruiserModel(vehicle.model)) return LAND_CRUISER_COVER;
  if (vehicle.image_url?.trim()) return vehicle.image_url;
  return LAND_CRUISER_COVER;
}

function isRemoteUrl(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function categoryLabel(vehicle: Vehicle) {
  if (vehicle.model.toLowerCase().includes("quantum")) return "Transfer / Van";
  return "Turismo / SUV";
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = pickCoverImage(vehicle);
  const unavailable = !vehicle.is_available;

  return (
    <article
      className={[
        "group ui-surface-lift flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md ring-1 ring-zinc-900/[0.04]",
        unavailable ? "opacity-[0.92]" : "hover:-translate-y-0.5 hover:border-[color:var(--brand-500)]/30 hover:shadow-lg hover:ring-[color:var(--brand-500)]/15",
      ].join(" ")}
    >
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-zinc-100">
        {isRemoteUrl(cover) ? (
          // eslint-disable-next-line @next/next/no-img-element -- URLs dinamicas de armazenamento
          <img
            src={cover}
            alt={vehicle.model}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <Image
            src={cover}
            alt={vehicle.model}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-md bg-[color:var(--brand-900)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
          {categoryLabel(vehicle)}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-zinc-100 bg-gradient-to-b from-white to-zinc-50/80 p-4">
        <h3 className="text-lg font-bold leading-tight text-[color:var(--brand-900)]">{vehicle.model}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500">
          {typeof vehicle.capacity === "number" && vehicle.capacity > 0 ? <span>{vehicle.capacity} lugares</span> : null}
          {vehicle.plate ? <span className="font-mono">{vehicle.plate}</span> : null}
        </div>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-zinc-600">
          {vehicle.description ?? "Viatura para turismo, transfer e deslocacoes com conforto e seguranca."}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-zinc-100/80 pt-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tarifa diaria</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-[color:var(--brand-900)]">
              {formatCurrency(vehicle.price_per_day)}
            </p>
          </div>
          <span
            className={[
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
              unavailable
                ? "bg-zinc-100 text-zinc-600 ring-zinc-200"
                : "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
            ].join(" ")}
          >
            {unavailable ? "Indisponivel" : "Disponivel"}
          </span>
        </div>

        <Link
          href={unavailable ? "/viaturas" : `/viaturas?viatura=${vehicle.id}#reservar-viatura`}
          className={[
            "ui-btn mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold",
            unavailable
              ? "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
              : "bg-[color:var(--brand-900)] text-white shadow-sm hover:bg-[color:var(--brand-700)]",
          ].join(" ")}
        >
          {unavailable ? (
            <>
              Ver frota
              <Car className="h-4 w-4" aria-hidden />
            </>
          ) : (
            <>
              Reservar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </Link>
      </div>
    </article>
  );
}
