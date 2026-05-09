"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, Headphones, LayoutGrid, LogOut, Ticket } from "lucide-react";

type NavbarUserMenuProps = {
  displayName: string;
  initial: string;
  email: string;
  isAdmin?: boolean;
  /** Mostra atalho para o painel de atendimento (caixa ou admin). */
  showAtendimento?: boolean;
};

export function NavbarUserMenu({ displayName, initial, email, isAdmin, showAtendimento }: NavbarUserMenuProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        className="ui-btn inline-flex max-w-[min(100vw-8rem,220px)] items-center gap-2 rounded-full border border-zinc-200/90 bg-white py-1 pl-1 pr-2.5 text-left shadow-sm ring-1 ring-zinc-900/5 hover:border-zinc-300 hover:shadow"
      >
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[color:var(--brand-500)] to-[color:var(--brand-800)] text-sm font-bold text-white shadow-inner"
          title={email}
        >
          {initial}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-800">{displayName}</span>
        <ChevronDown
          className={["h-4 w-4 shrink-0 text-zinc-500 transition", open ? "rotate-180" : ""].join(" ")}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="absolute right-0 z-[60] mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white py-1.5 shadow-xl ring-1 ring-zinc-900/5"
          role="menu"
        >
          <div className="border-b border-zinc-100 px-3.5 py-2.5">
            <p className="text-xs font-medium text-zinc-500">Sessao activa</p>
            <p className="truncate text-sm font-semibold text-zinc-800">{email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/perfil"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="ui-nav-link flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <LayoutGrid className="h-4 w-4 text-[color:var(--brand-700)]" />
              Meu painel
            </Link>
            <Link
              href="/reservas"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="ui-nav-link flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              <Ticket className="h-4 w-4 text-[color:var(--brand-700)]" />
              Reservas
            </Link>
            {showAtendimento ? (
              <Link
                href="/atendimento"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="ui-nav-link flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-indigo-900 hover:bg-indigo-50"
              >
                <Headphones className="h-4 w-4 text-indigo-700" />
                Atendimento
              </Link>
            ) : null}
            {isAdmin ? (
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="ui-nav-link flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-emerald-800 hover:bg-emerald-50"
              >
                <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
              </Link>
            ) : null}
          </div>
          <div className="border-t border-zinc-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="ui-nav-link flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Terminar sessao
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
