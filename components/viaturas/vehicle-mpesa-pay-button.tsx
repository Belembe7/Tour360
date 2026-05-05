"use client";

import { useState, useTransition } from "react";
import { payVehicleBookingWithMpesa } from "@/app/viaturas/payments-actions";

type Props = {
  vehicleBookingId: string;
  disabled?: boolean;
  onPaid?: (reference: string) => void;
};

export function VehicleMpesaPayButton({ vehicleBookingId, disabled, onPaid }: Props) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  function onPay() {
    setMessage(null);
    setIsError(false);
    startTransition(async () => {
      const result = await payVehicleBookingWithMpesa(vehicleBookingId);
      if (result.error) {
        setIsError(true);
        setMessage(result.error);
        return;
      }
      setMessage(result.success ?? null);
      setIsError(false);
      if (result.reference) onPaid?.(result.reference);
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onPay}
        disabled={disabled || pending}
        className="rounded-xl bg-[#0A2342] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#143a6b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "A processar M-Pesa..." : "Confirmar reserva com M-Pesa (simulado)"}
      </button>
      {message && <p className={`text-xs ${isError ? "text-red-600" : "text-emerald-700"}`}>{message}</p>}
    </div>
  );
}

