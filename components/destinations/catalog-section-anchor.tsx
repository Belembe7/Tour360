"use client";

import { useEffect, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Garante scroll ao ancora #catalogo-destinos apos navegacao (ex.: "Explorar mais destinos").
 */
export function CatalogSectionAnchor({ children }: Props) {
  useEffect(() => {
    const scrollToCatalog = () => {
      if (window.location.hash !== "#catalogo-destinos") return;
      const el = document.getElementById("catalogo-destinos");
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    scrollToCatalog();
    const t = window.setTimeout(scrollToCatalog, 150);
    window.addEventListener("hashchange", scrollToCatalog);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", scrollToCatalog);
    };
  }, []);

  return <>{children}</>;
}
