"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffReservation, type StaffReservationFormInput } from "@/app/atendimento/actions";
import { staffReservationSchema } from "@/lib/validations";

const field =
  "ui-field w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/20";

const defaults: StaffReservationFormInput = {
  clientName: "",
  clientContact: "",
  clientEmail: "",
  reservationType: "viagem",
  destination: "",
  departureDate: "",
  returnDate: "",
  vehicleType: "",
  numTravelers: 1,
  observations: "",
  totalPrice: 1,
  status: "pendente",
};

/**
 * Formulario para o caixa registar reserva em nome do cliente (validacao Zod + accao no servidor).
 */
export function NewStaffBookingForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<StaffReservationFormInput>({
    resolver: zodResolver(staffReservationSchema) as Resolver<StaffReservationFormInput>,
    defaultValues: defaults,
  });

  const tipo = watch("reservationType");

  async function onSubmit(values: Parameters<typeof createStaffReservation>[0]) {
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
      vehicleType: values.vehicleType,
      numTravelers: values.numTravelers,
      observations: values.observations,
      totalPrice: values.totalPrice,
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
        <p className="text-sm text-zinc-500">Tipo de produto: rota/viagem, pacote turistico catalogado no site, ou periodo de aluguer de viatura.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700">Tipo</label>
        <select className={field} {...register("reservationType")}>
          <option value="viagem">Viagem / rota</option>
          <option value="pacote">Pacote turistico</option>
          <option value="aluguer">Aluguer de viatura</option>
        </select>
        {errors.reservationType && <p className="text-xs text-red-600">{errors.reservationType.message}</p>}
      </div>

      {tipo === "aluguer" ? (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700">Tipo de carro / viatura</label>
          <input className={field} placeholder="Ex.: Toyota Quantum, SUV automatico" {...register("vehicleType")} />
          {errors.vehicleType && <p className="text-xs text-red-600">{errors.vehicleType.message}</p>}
        </div>
      ) : (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700">Destino</label>
          <input
            className={field}
            placeholder="Ex.: Maputo – Vilankulo, Lisboa"
            {...register("destination")}
          />
          {errors.destination && <p className="text-xs text-red-600">{errors.destination.message}</p>}
        </div>
      )}

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
        <p className="md:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{serverError}</p>
      )}

      <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="ui-btn rounded-xl bg-[#0A2342] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#143a6b] disabled:opacity-60"
        >
          {loading ? "A guardar..." : "Guardar reserva"}
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
