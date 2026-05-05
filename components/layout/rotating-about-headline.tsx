"use client";

import { useEffect, useState } from "react";

const HEADLINES = [
  "A TOUR 360 e a sua agencia completa para viagens, turismo e mobilidade em Mocambique.",
  "Criamos experiencias de viagem com conforto, seguranca e acompanhamento em cada etapa.",
  "Atendemos particulares e empresas com solucoes nacionais, internacionais e corporativas.",
  "Planeamos, reservamos e apoiamos a sua jornada com atendimento rapido e transparente.",
] as const;

export function RotatingAboutHeadline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % HEADLINES.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <h3
      className={`mt-3 max-w-xl text-3xl font-extrabold leading-tight text-white transition-all duration-500 ease-out md:text-4xl ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      {HEADLINES[index]}
    </h3>
  );
}

