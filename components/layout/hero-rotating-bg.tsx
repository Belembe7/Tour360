"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/images/hero-rotate-1.png", alt: "Vista aerea no aviao ao por do sol" },
  { src: "/images/hero-rotate-2.png", alt: "Vista aerea de aguas tropicais" },
  { src: "/images/hero-rotate-3.png", alt: "Ondas no mar em vista aerea" },
] as const;

const INTERVAL_MS = 6000;

export function HeroRotatingBg() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            quality={95}
            priority={i === 0}
            className="object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
