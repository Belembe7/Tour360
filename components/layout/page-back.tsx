import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type PageBackProps = {
  href: string;
  label?: string;
  className?: string;
  /** Texto claro para fundos escuros (hero, contacto, etc.) */
  variant?: "default" | "inverted";
};

export function PageBack({ href, label = "Voltar", className = "", variant = "default" }: PageBackProps) {
  const isInverted = variant === "inverted";

  return (
    <Link
      href={href}
      className={[
        "group ui-nav-link inline-flex w-fit items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-medium",
        isInverted
          ? "text-white/90 ring-1 ring-white/20 hover:bg-white/10"
          : "text-[color:var(--brand-800)] hover:bg-zinc-100 hover:text-[color:var(--brand-900)]",
        className,
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-md transition-transform duration-200",
          isInverted ? "bg-white/10 group-hover:bg-white/15" : "bg-zinc-100 group-hover:bg-zinc-200",
        ].join(" ")}
        aria-hidden
      >
        <ChevronLeft className="h-4 w-4" />
      </span>
      {label}
    </Link>
  );
}
