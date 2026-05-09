"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "O mundo ao seu alcance.",
  "Viaje mais, preocupe-se menos.",
  "Explore o mundo com a Tour360.",
] as const;

const INTERVAL_MS = 8000;
const FADE_MS = 550;

export function HeroRotatingHeadline() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setPhase("out");
      window.setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setPhase("in");
      }, FADE_MS);
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, [reduceMotion]);

  const visible = reduceMotion ? true : phase === "in";

  return (
    <h1
      className="mt-4 min-h-[5.5rem] text-4xl font-extrabold leading-tight transition-[opacity,transform] duration-[550ms] ease-out motion-reduce:transition-none md:min-h-[4.5rem] md:text-5xl"
      style={
        reduceMotion
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(0.5rem)",
            }
      }
      aria-live="polite"
    >
      {PHRASES[index]}
    </h1>
  );
}
