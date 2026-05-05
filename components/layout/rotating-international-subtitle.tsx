"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "Experiências fora do país com suporte completo e organização.",
  "Descubra o mundo com a Tour360.",
] as const;

export function RotatingInternationalSubtitle() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 700);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      className={`text-center text-sm font-medium text-white/95 transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
      }`}
    >
      {PHRASES[index]}
    </p>
  );
}

