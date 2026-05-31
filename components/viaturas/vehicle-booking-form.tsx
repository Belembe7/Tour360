"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, Car, FileText, MapPin } from "lucide-react";
import { createVehicleBooking } from "@/app/viaturas/actions";
import { formatCurrency } from "@/lib/utils";
import { vehicleBookingSchema, type VehicleBookingSchema } from "@/lib/validations";
import type { Vehicle } from "@/types";
import { VehicleBookingReceipt } from "@/components/viaturas/vehicle-booking-receipt";
import { VehicleMpesaPayButton } from "@/components/viaturas/vehicle-mpesa-pay-button";

const fieldClass =
  "ui-field mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 " +
  "placeholder:text-zinc-400 focus:border-[color:var(--brand-500)] focus:outline-none focus:ring-2 " +
  "focus:ring-[color:var(--brand-500)]/25";

type Props = {
  vehicles: Vehicle[];
  isAuthenticated: boolean;
  loginHref: string;
};

export function VehicleBookingForm({ vehicles, isAuthenticated, loginHref }: Props) {
  const formId = useId();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState<{
    id: string;
    vehicleModel: string;
    destination: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalPrice: number;
  } | null>(null);
  const [mpesaReference, setMpesaReference] = useState<string | null>(null);
  const [receiptAutoKey, setReceiptAutoKey] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VehicleBookingSchema>({
    resolver: zodResolver(vehicleBookingSchema),
    defaultValues: {
      vehicleId: vehicles[0]?.id ?? "",
      startDate: "",
      endDate: "",
      destination: "",
    },
  });

  useEffect(() => {
    const fromUrl = searchParams.get("viatura");
    if (!fromUrl || vehicles.length === 0) return;
    const exists = vehicles.some((v) => v.id === fromUrl);
    if (exists) setValue("vehicleId", fromUrl);
  }, [searchParams, vehicles, setValue]);

  const vehicleId = useWatch({ control, name: "vehicleId" });
  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const estimate = useMemo(() => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle || !startDate || !endDate) return { days: 0, total: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return { days: 0, total: 0 };
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return { days, total: days * Number(vehicle.price_per_day) };
  }, [vehicles, vehicleId, startDate, endDate]);

  function onSubmit(values: VehicleBookingSchema) {
    setMessage(null);
    setSuccess(false);
    setCreated(null);
    setMpesaReference(null);
    setReceiptAutoKey(null);
    startTransition(async () => {
      const result = await createVehicleBooking(values);
      if (result.error) {
        setMessage(result.error);
        return;
      }

      const vehicle = vehicles.find((v) => v.id === values.vehicleId);
      if (result.booking && vehicle) {
        setCreated({
          id: result.booking.id,
          vehicleModel: vehicle.model,
          destination: result.booking.destination,
          startDate: result.booking.startDate,
          endDate: result.booking.endDate,
          totalDays: result.booking.totalDays,
          totalPrice: result.booking.totalPrice,
        });
        setReceiptAutoKey(result.booking.id);
      }
      setSuccess(true);
      setMessage("Reserva criada. Agora pode confirmar com M-Pesa (simulado) e baixar o comprovativo em PDF.");
      reset({ vehicleId: vehicles[0]?.id ?? "", startDate: "", endDate: "", destination: "" });
    });
  }

  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div id="reservar-viatura" className="mt-10 scroll-mt-24">
      <div className="mb-4 rounded-2xl border border-[color:var(--brand-500)]/20 bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-500)]/10 md:p-5">
        <h2 className="text-base font-bold text-[color:var(--brand-900)]">Como reservar</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-zinc-700">
          <li>Seleccione a <strong className="font-semibold text-[color:var(--brand-800)]">viatura</strong> e indique o <strong className="font-semibold text-[color:var(--brand-800)]">destino</strong>.</li>
          <li>Defina a <strong className="font-semibold text-[color:var(--brand-800)]">data de inicio e fim</strong> (inclusive). O total e os dias sao calculados automaticamente.</li>
          <li>
            Confirme no resumo e submeta — pode pagar com M-Pesa (simulado) e descarregar o comprovativo em PDF.
          </li>
        </ol>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ui-surface-lift rounded-2xl border border-zinc-200 bg-white p-5 shadow-md ring-1 ring-zinc-900/5 md:p-7"
        aria-label="Reserva de viatura"
        noValidate
      >
        <div className="border-b border-zinc-100 pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[color:var(--brand-900)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--brand-50)] text-[color:var(--brand-800)]">
              <Car className="h-5 w-5" aria-hidden />
            </span>
            Reservar viatura
          </h2>
          <p className="mt-1.5 text-sm text-zinc-600">Preencha os campos. O resumo abaixo actualiza o valor e o numero de dias.</p>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <Car className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">Viatura e destino</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${formId}-v`} className="text-xs font-semibold text-zinc-800">
                  Viatura <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-zinc-500">Modelo e tarifa diaria de referencia.</p>
                <select id={`${formId}-v`} className={fieldClass} {...register("vehicleId")}>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} — {formatCurrency(vehicle.price_per_day)}/dia
                    </option>
                  ))}
                </select>
                {errors.vehicleId && <p className="mt-1 text-xs text-red-600">{errors.vehicleId.message}</p>}
              </div>
              <div>
                <label htmlFor={`${formId}-dest`} className="text-xs font-semibold text-zinc-800">
                  Destino <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-zinc-500">Cidade ou regiao (ex.: Pemba, Maputo).</p>
                <div className="mt-1.5 flex items-start gap-2">
                  <MapPin className="mt-2.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden />
                  <input
                    id={`${formId}-dest`}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[color:var(--brand-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
                    placeholder="Onde necessita a viatura?"
                    {...register("destination")}
                  />
                </div>
                {errors.destination && <p className="mt-1 text-xs text-red-600">{errors.destination.message}</p>}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
              <CalendarRange className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">Periodo</h3>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${formId}-start`} className="text-xs font-semibold text-zinc-800">
                  Data inicial <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-zinc-500">Primeiro dia de utilizacao (conta inclusive).</p>
                <input id={`${formId}-start`} type="date" className={fieldClass} {...register("startDate")} />
                {errors.startDate && <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>}
              </div>
              <div>
                <label htmlFor={`${formId}-end`} className="text-xs font-semibold text-zinc-800">
                  Data final <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-zinc-500">Ultimo dia de utilizacao (inclusive).</p>
                <input id={`${formId}-end`} type="date" className={fieldClass} {...register("endDate")} />
                {errors.endDate && <p className="mt-1 text-xs text-red-600">{errors.endDate.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-[color:var(--brand-500)]/25 bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-500)]/10">
          <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--brand-900)]">Resumo</p>
            <p className="mt-1 text-sm text-zinc-700">
              Dias: <span className="font-semibold text-[color:var(--brand-900)] tabular-nums">{estimate.days}</span>
            </p>
            <p className="text-lg font-bold text-[color:var(--brand-900)] tabular-nums">
              Total estimado: {formatCurrency(estimate.total)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Preco = dias {estimate.days} x tarifa diaria da viatura escolhida.</p>
          </div>
        </div>

        {message && (
          <p
            className={`mt-4 rounded-lg px-3 py-2.5 text-sm ${success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}
            role="status"
          >
            {message}
          </p>
        )}

        {success && created ? (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 ring-1 ring-emerald-200/60 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Proximos passos</p>
              <p className="mt-1 text-sm text-emerald-900">
                Confirme com M-Pesa (simulado) para marcar como <strong className="font-semibold">confirmada</strong>.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <VehicleBookingReceipt
                bookingId={created.id}
                vehicleModel={created.vehicleModel}
                destination={created.destination}
                startDate={created.startDate}
                endDate={created.endDate}
                totalDays={created.totalDays}
                totalPrice={created.totalPrice}
                status="pendente"
                paymentStatus={mpesaReference ? "pago" : "aguardando"}
                paymentReference={mpesaReference}
                autoDownloadKey={receiptAutoKey}
              />
              <VehicleMpesaPayButton
                vehicleBookingId={created.id}
                onPaid={(ref) => {
                  setMpesaReference(ref);
                  setReceiptAutoKey(ref);
                }}
              />
            </div>
          </div>
        ) : null}

        {!isAuthenticated ? (
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">
            Para reservar,{" "}
            <Link href={loginHref} className="font-semibold text-[color:var(--brand-700)] underline underline-offset-2">
              inicie sessao
            </Link>
            .
          </p>
        ) : null}

        {isAuthenticated ? (
          <button
            type="submit"
            disabled={pending}
            className={[
              "ui-btn mt-5 w-full rounded-xl bg-[color:var(--brand-900)] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8",
              pending ? "ui-btn-loading" : "",
            ].join(" ")}
          >
            {pending ? "A confirmar..." : "Confirmar reserva de viatura"}
          </button>
        ) : (
          <Link
            href={loginHref}
            className="ui-btn mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--brand-900)] py-3 text-sm font-semibold text-white hover:bg-[color:var(--brand-700)] sm:w-auto sm:px-8"
          >
            Iniciar sessao para reservar
          </Link>
        )}
      </form>
    </div>
  );
}
