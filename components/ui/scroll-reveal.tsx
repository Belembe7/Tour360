"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayClass?: "ui-observe-delay-1" | "ui-observe-delay-2" | "ui-observe-delay-3";
  as?: "div" | "section" | "article" | "form";
};

export function ScrollReveal({ children, className = "", delayClass, as = "div" }: ScrollRevealProps) {
  const ref = useRef<Element | null>(null);
  const [inView, setInView] = useState(false);
  const setRef = (node: Element | null) => {
    ref.current = node;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = ["ui-observe", inView ? "in-view" : "", delayClass ?? "", className].join(" ").trim();

  if (as === "section") {
    return (
      <section ref={setRef} className={classes}>
        {children}
      </section>
    );
  }
  if (as === "article") {
    return (
      <article ref={setRef} className={classes}>
        {children}
      </article>
    );
  }
  if (as === "form") {
    return (
      <form ref={setRef} className={classes}>
        {children}
      </form>
    );
  }
  return (
    <div ref={setRef} className={classes}>
      {children}
    </div>
  );
}
