"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNavItems } from "@/components/layout/nav-config";
import { Menu, X } from "lucide-react";

export function NavbarMobileDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="ui-btn inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
        aria-expanded={open}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <>
          <button
            type="button"
            className="ui-backdrop-fade fixed inset-0 z-40 bg-zinc-900/40"
            aria-label="Fechar"
            onClick={() => setOpen(false)}
          />
          <div className="ui-drawer-panel fixed left-4 right-4 top-[4.5rem] z-50 max-h-[min(70vh,480px)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl">
            {mainNavItems.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="ui-nav-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                <Icon className="h-4 w-4 text-[color:var(--brand-700)]" />
                {label}
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
