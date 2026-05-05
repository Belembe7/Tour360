"use server";

import { revalidatePath } from "next/cache";
import { adminCreateCaixaSchema } from "@/lib/validations";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { createClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase: null, error: "Nao autenticado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { supabase: null, error: "Sem permissao de admin." };
  return { supabase, error: null };
}

export async function updateBookingStatus(bookingId: string, status: "confirmada" | "cancelada") {
  const { supabase, error: authError } = await ensureAdmin();
  if (authError || !supabase) return { error: authError };

  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
  revalidatePath("/reservas");
  return { success: true };
}

export async function updateCorporateValidation(clientId: string, isValidated: boolean) {
  const { supabase, error: authError } = await ensureAdmin();
  if (authError || !supabase) return { error: authError };

  const { error } = await supabase
    .from("corporate_clients")
    .update({ is_validated: isValidated })
    .eq("id", clientId);

  if (error) return { error: error.message };

  revalidatePath("/admin/corporativo");
  return { success: true };
}

const DEMO_CAIXA_ROWS = [
  { email: "caixa1@gmail.com", fullName: "Caixa 1" },
  { email: "caixa2@gmail.com", fullName: "Caixa 2" },
  { email: "caixa3@gmail.com", fullName: "Caixa 3" },
] as const;

const DEMO_PASSWORD = "123456";

function isUserAlreadyExistsError(msg: string) {
  const m = msg.toLowerCase();
  return m.includes("already been registered") || m.includes("already registered") || m.includes("user already");
}

async function countCaixaProfiles(admin: ReturnType<typeof createServiceRoleClient>) {
  const { count, error } = await admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "caixa");
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function findAuthUserIdByEmail(admin: ReturnType<typeof createServiceRoleClient>, email: string) {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) return null;
  const u = data.users.find((x) => x.email?.toLowerCase() === normalized);
  return u?.id ?? null;
}

async function setProfileCaixa(admin: ReturnType<typeof createServiceRoleClient>, userId: string, fullName: string) {
  const { error } = await admin.from("profiles").update({ role: "caixa", full_name: fullName }).eq("id", userId);
  if (error) return { error: error.message };
  return { ok: true as const };
}

/**
 * Cria um utilizador Auth + perfil `caixa` (maximo 3 contas com este role).
 * Requer `SUPABASE_SERVICE_ROLE_KEY` no ambiente do servidor.
 */
export async function createCaixaUser(input: unknown) {
  const parsed = adminCreateCaixaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const auth = await ensureAdmin();
  if (auth.error || !auth.supabase) return { error: auth.error ?? "Sem permissao." };

  let adminClient: ReturnType<typeof createServiceRoleClient>;
  try {
    adminClient = createServiceRoleClient();
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : "Configure SUPABASE_SERVICE_ROLE_KEY no servidor para criar contas de caixa.",
    };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const n = await countCaixaProfiles(adminClient);
  const existingId = await findAuthUserIdByEmail(adminClient, email);
  const { data: existingProfile } = existingId
    ? await adminClient.from("profiles").select("role").eq("id", existingId).maybeSingle()
    : { data: null };

  if (n >= 3 && existingProfile?.role !== "caixa") {
    return { error: "Ja existem 3 contas de caixa. Remova ou altere o perfil de uma antes de criar outra." };
  }

  if (existingId) {
    const { error: upErr } = await adminClient.auth.admin.updateUserById(existingId, {
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.fullName.trim() },
    });
    if (upErr) return { error: upErr.message };
    const r = await setProfileCaixa(adminClient, existingId, parsed.data.fullName.trim());
    if ("error" in r) return { error: r.error };
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: { full_name: parsed.data.fullName.trim() },
    });
    if (error) return { error: error.message };
    const uid = data.user?.id;
    if (!uid) return { error: "Utilizador nao criado." };
    const r = await setProfileCaixa(adminClient, uid, parsed.data.fullName.trim());
    if ("error" in r) return { error: r.error };
  }

  revalidatePath("/admin/caixa");
  return { success: true as const };
}

/**
 * Garante as 3 contas de demonstracao (caixa1..3 @ gmail, senha 123456), idempotente.
 * Apenas admin; requer service role.
 */
export async function ensureDemoCaixaAccounts() {
  const auth = await ensureAdmin();
  if (auth.error) return { error: auth.error };

  let adminClient: ReturnType<typeof createServiceRoleClient>;
  try {
    adminClient = createServiceRoleClient();
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : "Configure SUPABASE_SERVICE_ROLE_KEY no servidor.",
    };
  }

  const messages: string[] = [];

  for (const row of DEMO_CAIXA_ROWS) {
    const email = row.email.toLowerCase();
    const existingId = await findAuthUserIdByEmail(adminClient, email);

    if (existingId) {
      const { error: upErr } = await adminClient.auth.admin.updateUserById(existingId, {
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: row.fullName },
      });
      if (upErr) {
        messages.push(`${email}: ${upErr.message}`);
        continue;
      }
      const r = await setProfileCaixa(adminClient, existingId, row.fullName);
      if ("error" in r) messages.push(`${email}: ${r.error}`);
      else messages.push(`${email}: actualizado.`);
      continue;
    }

    const n = await countCaixaProfiles(adminClient);
    if (n >= 3) {
      messages.push(`${email}: ignorado — ja existem 3 contas caixa.`);
      continue;
    }

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: row.fullName },
    });

    if (error) {
      if (isUserAlreadyExistsError(error.message)) {
        const id = await findAuthUserIdByEmail(adminClient, email);
        if (id) {
          await adminClient.auth.admin.updateUserById(id, {
            password: DEMO_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: row.fullName },
          });
          const r = await setProfileCaixa(adminClient, id, row.fullName);
          messages.push(`${email}: ${"error" in r ? r.error : "sincronizado."}`);
        } else {
          messages.push(`${email}: ${error.message}`);
        }
      } else {
        messages.push(`${email}: ${error.message}`);
      }
      continue;
    }

    const uid = data.user?.id;
    if (!uid) {
      messages.push(`${email}: falha sem ID.`);
      continue;
    }
    const r = await setProfileCaixa(adminClient, uid, row.fullName);
    messages.push(`${email}: ${"error" in r ? r.error : "criado."}`);
  }

  revalidatePath("/admin/caixa");
  return { success: true as const, messages };
}

export type CaixaAccountRow = { id: string; full_name: string | null; email: string | null };

/** Lista contas com perfil `caixa` (emails via API admin; requer service role). */
export async function listCaixaAccountsWithEmails(): Promise<{
  error?: string;
  rows: CaixaAccountRow[];
}> {
  const a = await ensureAdmin();
  if (a.error || !a.supabase) return { error: a.error ?? undefined, rows: [] };

  let adminClient: ReturnType<typeof createServiceRoleClient>;
  try {
    adminClient = createServiceRoleClient();
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "SUPABASE_SERVICE_ROLE_KEY em falta.",
      rows: [],
    };
  }

  const { data: profs, error: pe } = await adminClient.from("profiles").select("id, full_name").eq("role", "caixa");
  if (pe) return { error: pe.message, rows: [] };

  const { data: userList, error: ue } = await adminClient.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (ue) return { error: ue.message, rows: [] };

  const byId = new Map((userList?.users ?? []).map((u) => [u.id, u.email ?? null]));
  const rows: CaixaAccountRow[] = (profs ?? []).map((p) => ({
    id: p.id,
    full_name: p.full_name,
    email: byId.get(p.id) ?? null,
  }));

  return { rows };
}
