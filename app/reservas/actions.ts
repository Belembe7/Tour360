"use server";

import { revalidatePath } from "next/cache";
import { simulateMpesaCharge } from "@/lib/payments/mpesa";
import { createClient } from "@/lib/supabase/server";

export async function payBookingWithMpesa(bookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Inicie sessao para pagar." };

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("id, user_id, total_price, payment_status")
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) return { error: "Reserva nao encontrada." };
  if (booking.user_id !== user.id) return { error: "Sem permissao para pagar esta reserva." };
  if (booking.payment_status === "pago") return { error: "Esta reserva ja foi paga." };

  const simulation = simulateMpesaCharge();

  const { error: paymentInsertError } = await supabase.from("payments").insert({
    booking_id: booking.id,
    amount: booking.total_price,
    method: "mpesa",
    status: simulation.status,
    reference: simulation.reference,
    paid_at: simulation.status === "confirmado" ? new Date().toISOString() : null,
  });

  if (paymentInsertError) return { error: paymentInsertError.message };

  if (simulation.status === "confirmado") {
    const { error: bookingUpdateError } = await supabase
      .from("bookings")
      .update({ payment_status: "pago", status: "confirmada" })
      .eq("id", booking.id);

    if (bookingUpdateError) return { error: bookingUpdateError.message };
  }

  revalidatePath("/reservas");
  revalidatePath("/admin/reservas");
  revalidatePath("/atendimento");
  revalidatePath("/atendimento/reservas");

  if (simulation.status === "confirmado") {
    return { success: `Pagamento confirmado. Referencia: ${simulation.reference}` };
  }

  return { error: `Pagamento falhou na simulacao. Referencia: ${simulation.reference}` };
}
