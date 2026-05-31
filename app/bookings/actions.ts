"use server";

import { revalidatePath } from "next/cache";
import { canAccessAtendimento } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function deleteBooking(bookingId: string) {
  const id = bookingId?.trim();
  if (!id) return { error: "Reserva invalida." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Inicie sessao para apagar reservas." };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role ?? "client";
  const isStaff = canAccessAtendimento(role) || role === "admin";

  const { data: booking, error: loadError } = await supabase
    .from("bookings")
    .select("id, user_id")
    .eq("id", id)
    .maybeSingle();

  if (loadError) return { error: loadError.message };
  if (!booking) return { error: "Reserva nao encontrada." };

  const isOwner = booking.user_id === user.id;
  if (!isStaff && !isOwner) {
    return { error: "Sem permissao para apagar esta reserva." };
  }

  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/reservas");
  revalidatePath("/perfil");
  revalidatePath("/admin/reservas");
  revalidatePath("/atendimento/reservas");
  revalidatePath("/atendimento");

  return { success: true as const };
}
