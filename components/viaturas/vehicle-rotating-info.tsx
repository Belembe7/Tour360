"use client";

import { useEffect, useMemo, useState } from "react";

const ROTATE_EVERY_MS = 5000;

export function VehicleRotatingInfo() {
  const messages = useMemo(
    () => [
      "Conforto e seguranca em cada quilometro — turismo, transfer e eventos.",
      "Opcoes para grupos, executivos e familias; motorista sob consulta na TOUR 360.",
      "Fluxo simples: escolha a viatura, datas e destino; o total actualiza no resumo.",
      "Suporte durante a viagem para disfrutar com tranquilidade total.",
    ],
    [],
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, ROTATE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left ring-1 ring-white/5 backdrop-blur-sm md:max-w-2xl"
      aria-live="polite"
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan-200/90">A saber</p>
      <p key={index} className="cta-swap mt-1 min-h-[2.75rem] text-sm leading-relaxed text-sky-50/95 md:min-h-[2.25rem] md:text-[0.95rem]">
        {messages[index]}
      </p>
      <div className="mt-2 flex gap-1" role="status" aria-label="Mensagem">
        {messages.map((_, i) => (
          <span
            key={String(i)}
            className={[
              "h-1 rounded-full transition-all",
              i === index ? "w-4 bg-cyan-200" : "w-1.5 bg-white/25",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
