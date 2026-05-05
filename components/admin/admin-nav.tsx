import Link from "next/link";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/caixa", label: "Caixa" },
  { href: "/admin/reservas", label: "Reservas" },
  { href: "/admin/pacotes", label: "Pacotes" },
  { href: "/admin/viaturas", label: "Viaturas" },
  { href: "/admin/pagamentos", label: "Pagamentos" },
  { href: "/admin/corporativo", label: "Corporativo" },
  { href: "/admin/clientes", label: "Clientes" },
];

export function AdminNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium transition hover:bg-zinc-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
