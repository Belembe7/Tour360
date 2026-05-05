"use server";

import { createClient } from "@/lib/supabase/server";
import { vehicleBookingSchema } from "@/lib/validations";

type VehicleBookingInput = {
  vehicleId: string;
  startDate: string;
  endDate: string;
  destination: string;
};

export async function createVehicleBooking(input: VehicleBookingInput) {
  const parsed = vehicleBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Precisa iniciar sessao para reservar viaturas." };
  }

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("price_per_day")
    .eq("id", parsed.data.vehicleId)
    .single();

  if (vehicleError || !vehicle) {
    return { error: "Viatura invalida ou indisponivel." };
  }

  const start = new Date(parsed.data.startDate);
  const end = new Date(parsed.data.endDate);
  const diffMs = end.getTime() - start.getTime();
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  const totalPrice = totalDays * Number(vehicle.price_per_day);

  const { data: created, error } = await supabase
    .from("vehicle_bookings")
    .insert({
      user_id: user.id,
      vehicle_id: parsed.data.vehicleId,
      start_date: parsed.data.startDate,
      end_date: parsed.data.endDate,
      total_days: totalDays,
      total_price: totalPrice,
      destination: parsed.data.destination,
    })
    .select("id, start_date, end_date, total_days, total_price, destination")
    .single();

  if (error || !created) return { error: error?.message ?? "Nao foi possivel criar a reserva." };

  return {
    success: true,
    booking: {
      id: created.id as string,
      startDate: created.start_date as string,
      endDate: created.end_date as string,
      totalDays: created.total_days as number,
      totalPrice: Number(created.total_price),
      destination: (created.destination as string | null) ?? "",
    },
  };
}
