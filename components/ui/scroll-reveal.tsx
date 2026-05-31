"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayClass?: "ui-observe-delay-1" | "ui-observe-delay-2" | "ui-observe-delay-3";
  as?: "div" | "section" | "article" | "form";
};

function isElementInViewport(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < vh * 0.92 && rect.bottom > vh * 0.08;
}

export function ScrollReveal({ children, className = "", delayClass, as = "div" }: ScrollRevealProps) {
  const ref = useRef<Element | null>(null);
  const [inView, setInView] = useState(false);
  const setRef = (node: Element | null) => {
    ref.current = node;
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      setInView(true);
      observer?.disconnect();
      observer = null;
    };

    const tryReveal = () => {
      if (isElementInViewport(el)) reveal();
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.08, rootMargin: "0px 0px 5% 0px" },
    );
    observer.observe(el);

    tryReveal();
    const raf = requestAnimationFrame(tryReveal);
    const t1 = window.setTimeout(tryReveal, 80);
    const t2 = window.setTimeout(tryReveal, 320);

    const onHash = () => tryReveal();
    window.addEventListener("hashchange", onHash);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("hashchange", onHash);
      observer?.disconnect();
    };
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
