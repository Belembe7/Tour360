"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/app/admin/actions";

export function BookingStatusActions({ bookingId }: { bookingId: string }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onAction(status: "confirmada" | "cancelada") {
    setMessage(null);
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, status);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setMessage(`Reserva ${status}.`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        disabled={pending}
        onClick={() => onAction("confirmada")}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-70"
        type="button"
      >
        Confirmar
      </button>
      <button
        disabled={pending}
        onClick={() => onAction("cancelada")}
        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:opacity-70"
        type="button"
      >
        Cancelar
      </button>
      {message && <span className="text-xs text-zinc-600">{message}</span>}
    </div>
  );
}
