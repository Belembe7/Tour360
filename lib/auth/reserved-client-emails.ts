/**
 * E-mails reservados ao pessoal de caixa: nao podem ser usados no autocadastro de cliente.
 * As contas sao criadas pelo administrador (painel Admin > Caixa).
 */
export const CAIXA_RESERVED_EMAILS = new Set(
  ["caixa1@gmail.com", "caixa2@gmail.com", "caixa3@gmail.com"].map((e) => e.toLowerCase()),
);

export function isReservedForClientSelfRegistration(email: string): boolean {
  return CAIXA_RESERVED_EMAILS.has(email.trim().toLowerCase());
}
