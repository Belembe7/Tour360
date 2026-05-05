/** Perfis de utilizador em `public.profiles.role`. */
export const USER_ROLES = ["client", "admin", "caixa"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isStaffRole(role: string | null | undefined): role is "caixa" | "admin" {
  return role === "caixa" || role === "admin";
}

/** Acesso ao painel /atendimento: apenas caixa ou admin. */
export function canAccessAtendimento(role: string | null | undefined): boolean {
  return isStaffRole(role);
}
