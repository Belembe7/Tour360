import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/pacotes", label: "Pacotes" },
  { href: "/viaturas", label: "Viaturas" },
  { href: "/corporativo", label: "Corporativo" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-zinc-200 bg-white text-zinc-600">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--brand-500)]/35 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-lg outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-[color:var(--brand-500)]"
            >
              <Image
                src="/images/logo-v2.png"
                alt="TOUR 360"
                width={140}
                height={46}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-600">
              Viagens, viaturas e solucoes corporativas com a mesma exigencia de quem planeja cada detalhe ao seu lado.
            </p>
            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--brand-700)]">
              Mocambique · com confianca
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-900)]">Navegar</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group inline-flex items-center text-sm text-zinc-700 transition hover:text-[color:var(--brand-900)]"
                  >
                    <span
                      className="mr-2 h-px w-3 bg-[color:var(--brand-500)]/0 transition-all group-hover:w-4 group-hover:bg-[color:var(--brand-500)]"
                      aria-hidden
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-900)]">Contacto</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="tel:+258840000000"
                  className="inline-flex items-center gap-3 rounded-lg text-zinc-800 transition hover:text-[color:var(--brand-900)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-50)] ring-1 ring-[color:var(--brand-500)]/15">
                    <Phone className="h-4 w-4 text-[color:var(--brand-700)]" aria-hidden />
                  </span>
                  +258 84 000 0000
                </a>
              </li>
              <li>
                <a
                  href="mailto:contacto@tour360.co.mz"
                  className="inline-flex items-center gap-3 rounded-lg text-zinc-800 transition hover:text-[color:var(--brand-900)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[color:var(--brand-50)] ring-1 ring-[color:var(--brand-500)]/15">
                    <Mail className="h-4 w-4 text-[color:var(--brand-700)]" aria-hidden />
                  </span>
                  contacto@tour360.co.mz
                </a>
              </li>
              <li className="inline-flex items-start gap-3 pt-1 text-zinc-500">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 ring-1 ring-zinc-200/80">
                  <MapPin className="h-4 w-4 text-[color:var(--brand-700)]" aria-hidden />
                </span>
                <span className="pt-1.5 text-xs leading-relaxed">Beira, Mocambique</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-zinc-200 bg-zinc-50/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-4 py-5 text-center text-[11px] text-zinc-500 sm:flex-row sm:items-start sm:text-left md:px-6">
          <div>
            <p>© {year} TOUR 360, Lda. Todos os direitos reservados.</p>
            <p className="mt-1.5 text-[10px] font-medium tracking-wide text-zinc-400">
              Desenvolvido por E.Belembe
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-end">
            <Link href="/contacto" className="ui-link-animated font-medium text-zinc-600 hover:text-[color:var(--brand-900)]">
              Pedir proposta
            </Link>
            <span className="hidden text-zinc-300 sm:inline" aria-hidden>
              ·
            </span>
            <Link href="/login" className="ui-link-animated font-medium text-zinc-600 hover:text-[color:var(--brand-900)]">
              Area do cliente
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
