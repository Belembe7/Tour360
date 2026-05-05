"use server";

import { revalidatePath } from "next/cache";
import { canAccessAtendimento } from "@/lib/auth/roles";
import { staffReservationSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = { role: string };

/** Garante sessao e perfil caixa ou admin — autorizacao no servidor para todas as accoes do painel. */
export async function requireAtendimentoStaff(): Promise<
  | { ok: true; userId: string; role: string; supabase: Awaited<ReturnType<typeof createClient>> }
  | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sessao expirada. Inicie sessao novamente." };
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (error || !profile) {
    return { ok: false, error: "Perfil nao encontrado." };
  }
  const role = (profile as ProfileRow).role;
  if (!canAccessAtendimento(role)) {
    return { ok: false, error: "Sem permissao para esta area." };
  }
  return { ok: true, userId: user.id, role, supabase };
}

export type StaffReservationFormInput = {
  clientName: string;
  clientContact: string;
  clientEmail: string;
  reservationType: "viagem" | "pacote" | "aluguer";
  destination?: string;
  departureDate: string;
  returnDate?: string;
  vehicleType?: string;
  numTravelers: number;
  observations?: string;
  totalPrice: number;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
};

/**
 * Insere reserva em nome do cliente, associada ao funcionario autenticado (`created_by_user_id`).
 * O `user_id` fica null (cliente sem conta na plataforma).
 */
export async function createStaffReservation(input: StaffReservationFormInput) {
  const auth = await requireAtendimentoStaff();
  if (!auth.ok) return { error: auth.error };

  const parsed = staffReservationSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const d = parsed.data;
  const hasReturn = Boolean(d.returnDate?.trim());
  const notesPayload = {
    observations: d.observations?.trim() || null,
    staffEntry: true as const,
  };

  const { error } = await auth.supabase.from("bookings").insert({
    user_id: null,
    created_by_user_id: auth.userId,
    package_id: null,
    destination_id: null,
    reservation_type: d.reservationType,
    travel_type: hasReturn ? "round-trip" : "one-way",
    departure_date: d.departureDate,
    return_date: hasReturn ? d.returnDate!.trim() : null,
    num_travelers: d.numTravelers,
    total_price: d.totalPrice,
    status: d.status,
    payment_status: "aguardando",
    notes: JSON.stringify(notesPayload),
    client_name: d.clientName.trim(),
    client_contact: d.clientContact.trim(),
    client_email: d.clientEmail.trim(),
    destination_free: d.reservationType !== "aluguer" ? (d.destination?.trim() ?? null) : null,
    vehicle_type: d.reservationType === "aluguer" ? (d.vehicleType?.trim() ?? null) : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/atendimento");
  revalidatePath("/atendimento/reservas");
  return { success: true as const };
}
