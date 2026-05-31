"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import { type Resolver, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, Car, FileText, MapPin } from "lucide-react";
import { createStaffReservation, type StaffReservationFormInput } from "@/app/atendimento/actions";
import { staffReservationSchema } from "@/lib/validations";
import { formatCurrency } from "@/lib/utils";
import type { Vehicle } from "@/types";

const field =
  "ui-field w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/20";

const fieldClass =
  "ui-field mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 " +
  "placeholder:text-zinc-400 focus:border-[color:var(--brand-500)] focus:outline-none focus:ring-2 " +
  "focus:ring-[color:var(--brand-500)]/25";

type Props = {
  vehicles: Vehicle[];
};

/**
 * Formulario para o caixa registar reserva em nome do cliente (validacao Zod + accao no servidor).
 */
export function NewStaffBookingForm({ vehicles }: Props) {
  const formId = useId();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const defaults: StaffReservationFormInput = {
    clientName: "",
    clientContact: "",
    clientEmail: "",
    reservationType: "viagem",
    destination: "",
    departureDate: "",
    returnDate: "",
    vehicleId: vehicles[0]?.id ?? "",
    numTravelers: 1,
    observations: "",
    totalPrice: 1,
    status: "pendente",
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StaffReservationFormInput>({
    resolver: zodResolver(staffReservationSchema) as Resolver<StaffReservationFormInput>,
    defaultValues: defaults,
  });

  const tipo = useWatch({ control, name: "reservationType" });
  const vehicleId = useWatch({ control, name: "vehicleId" });
  const departureDate = useWatch({ control, name: "departureDate" });
  const returnDate = useWatch({ control, name: "returnDate" });

  const estimate = useMemo(() => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle || !departureDate || !returnDate) return { days: 0, total: 0 };
    const start = new Date(departureDate);
    const end = new Date(returnDate);
    if (end < start) return { days: 0, total: 0 };
    const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return { days, total: days * Number(vehicle.price_per_day) };
  }, [vehicles, vehicleId, departureDate, returnDate]);

  useEffect(() => {
    if (tipo === "aluguer" && estimate.total > 0) {
      setValue("totalPrice", estimate.total);
    }
  }, [tipo, estimate.total, setValue]);

  async function onSubmit(values: StaffReservationFormInput) {
    setServerError(null);
    setLoading(true);
    const res = await createStaffReservation({
      clientName: values.clientName,
      clientContact: values.clientContact,
      clientEmail: values.clientEmail,
      reservationType: values.reservationType,
      destination: values.destination,
      departureDate: values.departureDate,
      returnDate: values.returnDate,
      vehicleId: values.vehicleId,
      numTravelers: values.numTravelers,
      observations: values.observations,
      totalPrice: values.reservationType === "aluguer" ? estimate.total : values.totalPrice,
      status: values.status,
    });
    setLoading(false);
    if ("error" in res && res.error) {
      setServerError(res.error);
      return;
    }
    router.push("/atendimento/reservas");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-2"
      noValidate
    >
      <div className="md:col-span-2">
        <h2 className="text-lg font-semibold text-[#0A2342]">Passageiro / cliente</h2>
        <p className="text-sm text-zinc-500">Quem viaja ou contrata o servico (presencial ou contacto telefonico).</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700">Nome completo</label>
        <input className={field} {...register("clientName")} />
        {errors.clientName && <p className="text-xs text-red-600">{errors.clientName.message}</p>}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700">Contacto</label>
        <input className={field} {...register("clientContact")} />
        {errors.clientContact && <p className="text-xs text-red-600">{errors.clientContact.message}</p>}
      </div>
      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-semibold text-zinc-700">Email</label>
        <input type="email" className={field} {...register("clientEmail")} />
        {errors.clientEmail && <p className="text-xs text-red-600">{errors.clientEmail.message}</p>}
      </div>

      <div className="md:col-span-2 mt-2 border-t border-zinc-100 pt-4">
        <h2 className="text-lg font-semibold text-[#0A2342]">Servico TOUR 360</h2>
        <p className="text-sm text-zinc-500">
          Tipo de produto: rota/viagem, pacote turistico catalogado no site, ou periodo de aluguer de viatura.
        </p>
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-semibold text-zinc-700">Tipo</label>
        <select className={`${field} max-w-md`} {...register("reservationType")}>
          <option value="viagem">Viagem / rota</option>
          <option value="pacote">Pacote turistico</option>
          <option value="aluguer">Aluguer de viatura</option>
        </select>
        {errors.reservationType && <p className="text-xs text-red-600">{errors.reservationType.message}</p>}
      </div>

      {tipo === "aluguer" ? (
        <>
          {vehicles.length === 0 ? (
            <p className="md:col-span-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 ring-1 ring-amber-200">
              Nenhuma viatura cadastrada. Adicione modelos em Admin antes de registar aluguer.
            </p>
          ) : (
            <>
              <div className="md:col-span-2 space-y-6">
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
                      <input id={`${formId}-start`} type="date" className={fieldClass} {...register("departureDate")} />
                      {errors.departureDate && (
                        <p className="mt-1 text-xs text-red-600">{errors.departureDate.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor={`${formId}-end`} className="text-xs font-semibold text-zinc-800">
                        Data final <span className="text-red-600">*</span>
                      </label>
                      <p className="text-xs text-zinc-500">Ultimo dia de utilizacao (inclusive).</p>
                      <input id={`${formId}-end`} type="date" className={fieldClass} {...register("returnDate")} />
                      {errors.returnDate && <p className="mt-1 text-xs text-red-600">{errors.returnDate.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 flex items-start gap-2 rounded-xl border border-[color:var(--brand-500)]/25 bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-500)]/10">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--brand-900)]">Resumo</p>
                  <p className="mt-1 text-sm text-zinc-700">
                    Dias: <span className="font-semibold text-[color:var(--brand-900)] tabular-nums">{estimate.days}</span>
                  </p>
                  <p className="text-lg font-bold text-[color:var(--brand-900)] tabular-nums">
                    Total estimado: {formatCurrency(estimate.total)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Preco = dias {estimate.days} x tarifa diaria da viatura escolhida.
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-zinc-700">Destino</label>
            <input className={field} placeholder="Ex.: Maputo – Vilankulo, Lisboa" {...register("destination")} />
            {errors.destination && <p className="text-xs text-red-600">{errors.destination.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Data de ida</label>
            <input type="date" className={field} {...register("departureDate")} />
            {errors.departureDate && <p className="text-xs text-red-600">{errors.departureDate.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Data de volta (opcional)</label>
            <input type="date" className={field} {...register("returnDate")} />
            {errors.returnDate && <p className="text-xs text-red-600">{errors.returnDate.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Quantidade de pessoas</label>
            <input type="number" min={1} className={field} {...register("numTravelers")} />
            {errors.numTravelers && <p className="text-xs text-red-600">{errors.numTravelers.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700">Valor total (MZN)</label>
            <input type="number" step="0.01" min={0} className={field} {...register("totalPrice")} />
            {errors.totalPrice && <p className="text-xs text-red-600">{errors.totalPrice.message}</p>}
          </div>
        </>
      )}

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-semibold text-zinc-700">Estado da reserva</label>
        <select className={`${field} max-w-md`} {...register("status")}>
          <option value="pendente">Pendente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="concluida">Concluida</option>
        </select>
        {errors.status && <p className="text-xs text-red-600">{errors.status.message}</p>}
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label className="text-xs font-semibold text-zinc-700">Observacoes</label>
        <textarea rows={3} className={field} {...register("observations")} />
        {errors.observations && <p className="text-xs text-red-600">{errors.observations.message}</p>}
      </div>

      {serverError && (
        <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {serverError}
        </p>
      )}

      <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || (tipo === "aluguer" && vehicles.length === 0)}
          className={[
            "ui-btn rounded-xl bg-[#0A2342] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#143a6b] disabled:opacity-60",
            tipo === "aluguer" ? "sm:px-8" : "",
          ].join(" ")}
        >
          {loading ? "A guardar..." : tipo === "aluguer" ? "Confirmar reserva de viatura" : "Guardar reserva"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="ui-btn rounded-xl border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
