"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, IdCard, MapPin, UserRound } from "lucide-react";
import { createCatalogBooking } from "@/app/pacotes/reservar/actions";
import { catalogImageUrl } from "@/lib/destinations/catalog";
import {
  catalogSectionLabel,
  type DestinationCatalogSectionId,
} from "@/lib/destinations/catalog-booking";
import type { DestinationCatalogItem } from "@/lib/destinations/catalog";
import { catalogBookingSchema, type CatalogBookingFormValues } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

const fieldClass =
  "ui-field w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/25 " +
  "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

type Props = {
  packageId: string;
  packageName: string;
  sectionId: DestinationCatalogSectionId;
  item: DestinationCatalogItem;
  isAuthenticated: boolean;
  loginHref: string;
};

export function CatalogBookingForm({
  packageId,
  packageName,
  sectionId,
  item,
  isAuthenticated,
  loginHref,
}: Props) {
  const formId = useId();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogBookingFormValues>({
    resolver: zodResolver(catalogBookingSchema),
    defaultValues: {
      packageId,
      sectionId,
      destinationName: item.name,
      fullName: "",
      biNumber: "",
      departureDate: "",
      returnDate: "",
    },
  });

  function onSubmit(values: CatalogBookingFormValues) {
    setServerMessage(null);

    startTransition(async () => {
      const result = await createCatalogBooking({
        packageId,
        sectionId: values.sectionId,
        destinationName: values.destinationName,
        fullName: values.fullName,
        biNumber: values.biNumber,
        departureDate: values.departureDate,
        returnDate: values.returnDate?.trim() || undefined,
        totalPrice: item.priceFrom,
      });

      if (result.error) {
        setServerMessage(result.error);
        return;
      }

      router.push("/reservas?reserva=ok");
      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-zinc-900/5">
        <div className="flex items-stretch bg-[color:var(--brand-900)]">
          <span className="flex w-11 shrink-0 items-center justify-center bg-[color:var(--brand-500)] text-sm font-extrabold text-white">
            {String(item.number).padStart(2, "0")}
          </span>
          <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
            <h1 className="truncate text-base font-bold uppercase tracking-wide text-white">{item.name}</h1>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-cyan-100/90">
              {item.region} · {catalogSectionLabel(sectionId)}
            </p>
          </div>
        </div>
        <div className="relative aspect-[16/10] w-full bg-zinc-100">
          <Image
            src={catalogImageUrl(item.imageSeed)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            quality={75}
            priority
            className="object-cover"
          />
        </div>
        <div className="grid gap-2 border-t border-zinc-100 px-4 py-3 text-sm text-zinc-700 sm:grid-cols-2">
          <p>
            <span className="font-medium text-zinc-500">Duracao:</span> {item.duration}
          </p>
          <p>
            <span className="font-medium text-zinc-500">Pacote:</span> {packageName}
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium text-zinc-500">A partir de:</span>{" "}
            <span className="font-bold text-[color:var(--brand-800)]">{formatCurrency(item.priceFrom)}</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={[
          "ui-surface-lift space-y-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-zinc-900/5 md:p-6",
          !isAuthenticated ? "opacity-75" : "",
        ].join(" ")}
        aria-label="Reserva do destino"
      >
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[color:var(--brand-700)]" aria-hidden />
          <h2 className="text-lg font-bold text-[color:var(--brand-900)]">Dados da reserva</h2>
        </div>

        <input type="hidden" {...register("packageId")} />
        <input type="hidden" {...register("sectionId")} />
        <input type="hidden" {...register("destinationName")} />

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-full`} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
            <UserRound className="h-3.5 w-3.5" aria-hidden />
            Nome completo <span className="text-red-600">*</span>
          </label>
          <input
            id={`${formId}-full`}
            className={fieldClass}
            placeholder="Ex.: Elton Mateus"
            disabled={!isAuthenticated}
            {...register("fullName")}
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor={`${formId}-bi`} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
            <IdCard className="h-3.5 w-3.5" aria-hidden />
            Nr de BI <span className="text-red-600">*</span>
          </label>
          <input
            id={`${formId}-bi`}
            className={fieldClass}
            placeholder="Ex.: 1101020XXXXB"
            disabled={!isAuthenticated}
            {...register("biNumber")}
          />
          {errors.biNumber && <p className="text-xs text-red-600">{errors.biNumber.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor={`${formId}-dep`} className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
              <CalendarRange className="h-3.5 w-3.5" aria-hidden />
              Data de ida <span className="text-red-600">*</span>
            </label>
            <input
              id={`${formId}-dep`}
              type="date"
              className={fieldClass}
              disabled={!isAuthenticated}
              {...register("departureDate")}
            />
            {errors.departureDate && (
              <p className="text-xs text-red-600">{errors.departureDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor={`${formId}-ret`} className="text-xs font-semibold text-zinc-800">
              Data de volta <span className="font-normal text-zinc-500">(opcional)</span>
            </label>
            <input
              id={`${formId}-ret`}
              type="date"
              className={fieldClass}
              disabled={!isAuthenticated}
              {...register("returnDate")}
            />
            {errors.returnDate && <p className="text-xs text-red-600">{errors.returnDate.message}</p>}
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            Para reservar,{" "}
            <Link href={loginHref} className="font-semibold text-[color:var(--brand-800)] underline underline-offset-2">
              inicie sessao
            </Link>
            . Depois do login volta a este destino.
          </div>
        ) : null}

        {serverMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {serverMessage}
          </p>
        ) : null}

        {isAuthenticated ? (
          <button
            type="submit"
            disabled={pending}
            className={[
              "ui-btn w-full rounded-xl bg-[color:var(--brand-900)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
              pending ? "ui-btn-loading" : "",
            ].join(" ")}
          >
            {pending ? "A confirmar..." : "Confirmar reserva"}
          </button>
        ) : (
          <Link
            href={loginHref}
            className="ui-btn inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--brand-900)] px-4 py-3 text-sm font-semibold text-white hover:bg-[color:var(--brand-700)] sm:w-auto"
          >
            Iniciar sessao para reservar
          </Link>
        )}
      </form>
    </div>
  );
}
