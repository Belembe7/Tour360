import Link from "next/link";
import { History, LayoutDashboard, Ticket } from "lucide-react";

const items = [
  { href: "/atendimento", label: "Visao geral", Icon: LayoutDashboard },
  { href: "/atendimento/reservas/nova", label: "Nova reserva", Icon: Ticket },
  { href: "/atendimento/reservas", label: "Historico", Icon: History },
];

/**
 * Navegacao do balcao: viagens, pacotes e viaturas (mesma linha visual do resto do site).
 */
export function AtendimentoNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {items.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="ui-pill-tab inline-flex items-center gap-2 rounded-xl border border-sky-200/80 bg-white px-3.5 py-2.5 text-sm font-semibold text-[#0A2342] shadow-sm ring-1 ring-[#0A2342]/5 hover:border-sky-300 hover:bg-sky-50/80"
        >
          <Icon className="h-4 w-4 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );
}
