"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteBooking } from "@/app/bookings/actions";

type Props = {
  bookingId: string;
  label?: string;
  className?: string;
  redirectAfterDelete?: string;
};

export function DeleteBookingButton({
  bookingId,
  label = "Apagar",
  className = "",
  redirectAfterDelete,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function onDelete() {
    const ok = window.confirm("Tem a certeza que deseja apagar esta reserva do historico? Esta accao nao pode ser desfeita.");
    if (!ok) return;

    setMessage(null);
    startTransition(async () => {
      const result = await deleteBooking(bookingId);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (redirectAfterDelete) {
        router.push(redirectAfterDelete);
        return;
      }
      router.refresh();
    });
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className={[
          "inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 disabled:opacity-60",
          className,
        ].join(" ")}
      >
        <Trash2 className="h-3.5 w-3.5" aria-hidden />
        {pending ? "A apagar..." : label}
      </button>
      {message ? <span className="text-[10px] text-red-600">{message}</span> : null}
    </span>
  );
}
