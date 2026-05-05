import type { LucideIcon } from "lucide-react";
import { Building2, Car, Home, Info, Luggage, Mail } from "lucide-react";

export const mainNavItems: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/", label: "Inicio", Icon: Home },
  { href: "/pacotes", label: "Pacotes", Icon: Luggage },
  { href: "/viaturas", label: "Viaturas", Icon: Car },
  { href: "/corporativo", label: "Corporativo", Icon: Building2 },
  { href: "/sobre", label: "Sobre", Icon: Info },
  { href: "/contacto", label: "Contacto", Icon: Mail },
];
