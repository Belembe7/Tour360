import type { UserRole } from "@/lib/auth/roles";

/** Etiquetas em portugues para UI e PDFs do painel de atendimento. */
export const RESERVATION_TYPE_LABELS: Record<"pacote" | "viagem" | "aluguer", string> = {
  pacote: "Pacote turistico",
  viagem: "Viagem",
  aluguer: "Aluguer de carro",
};

export function roleLabel(role: string | null | undefined): string {
  const r = role as UserRole | undefined;
  if (r === "caixa") return "Caixa / Atendimento";
  if (r === "admin") return "Administrador";
  return "Cliente";
}
