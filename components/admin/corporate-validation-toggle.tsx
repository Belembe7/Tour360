"use client";

import { useState, useTransition } from "react";
import { updateCorporateValidation } from "@/app/admin/actions";

type Props = {
  clientId: string;
  initialValue: boolean;
};

export function CorporateValidationToggle({ clientId, initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const nextValue = !value;
    startTransition(async () => {
      const result = await updateCorporateValidation(clientId, nextValue);
      if (!result.error) setValue(nextValue);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`rounded-md px-3 py-1.5 text-xs font-medium text-white ${
        value ? "bg-emerald-600 hover:bg-emerald-700" : "bg-zinc-500 hover:bg-zinc-600"
      } disabled:opacity-70`}
    >
      {value ? "Validado" : "Pendente"}
    </button>
  );
}
