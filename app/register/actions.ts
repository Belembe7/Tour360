"use server";

import { authCallbackUrl } from "@/lib/auth/app-url";
import { isReservedForClientSelfRegistration } from "@/lib/auth/reserved-client-emails";
import { registerSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

export type RegisterClientResult =
  | { ok: true; needsEmailConfirm: boolean; email: string }
  | { ok: false; error: string };

/**
 * Registo publico apenas para clientes. E-mails reservados ao caixa sao rejeitados no servidor.
 * O perfil continua a ser `client` (trigger + politica de nao escalar role no signUp).
 */
export async function registerClientUser(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<RegisterClientResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const email = parsed.data.email.trim();
  if (isReservedForClientSelfRegistration(email)) {
    return {
      ok: false,
      error:
        "Este e-mail e reservado a contas de atendimento e nao pode ser registado aqui. Contacte a administracao.",
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: authCallbackUrl("/perfil"),
      data: {
        full_name: parsed.data.fullName.trim(),
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("user already registered")) {
      return { ok: false, error: "Este email ja esta em uso. Tente iniciar sessao." };
    }
    return { ok: false, error: error.message };
  }

  const needsEmailConfirm = !data.session;
  return { ok: true, needsEmailConfirm, email };
}
