"use server";

import { revalidatePath } from "next/cache";
import { simulateMpesaCharge } from "@/lib/payments/mpesa";
import { createClient } from "@/lib/supabase/server";

export async function payVehicleBookingWithMpesa(vehicleBookingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Inicie sessao para pagar." };

  const { data: booking, error: bookingError } = await supabase
    .from("vehicle_bookings")
    .select("id, user_id, total_price, status")
    .eq("id", vehicleBookingId)
    .single();

  if (bookingError || !booking) return { error: "Reserva de viatura nao encontrada." };
  if (booking.user_id !== user.id) return { error: "Sem permissao para pagar esta reserva." };
  if (String(booking.status).toLowerCase() === "confirmada") {
    return { error: "Esta reserva de viatura ja foi confirmada." };
  }

  const simulation = simulateMpesaCharge();

  const { error: paymentInsertError } = await supabase.from("payments").insert({
    vehicle_booking_id: booking.id,
    amount: booking.total_price,
    method: "mpesa",
    status: simulation.status,
    reference: simulation.reference,
    paid_at: simulation.status === "confirmado" ? new Date().toISOString() : null,
  });

  if (paymentInsertError) return { error: paymentInsertError.message };

  if (simulation.status === "confirmado") {
    const { error: bookingUpdateError } = await supabase
      .from("vehicle_bookings")
      .update({ status: "confirmada" })
      .eq("id", booking.id);

    if (bookingUpdateError) return { error: bookingUpdateError.message };
  }

  revalidatePath("/perfil");
  revalidatePath("/reservas");
  revalidatePath("/viaturas");
  revalidatePath("/atendimento");
  revalidatePath("/atendimento/reservas");
  revalidatePath("/admin/viaturas");

  if (simulation.status === "confirmado") {
    return { success: `Pagamento confirmado. Referencia: ${simulation.reference}`, reference: simulation.reference };
  }

  return { error: `Pagamento falhou na simulacao. Referencia: ${simulation.reference}` };
}
