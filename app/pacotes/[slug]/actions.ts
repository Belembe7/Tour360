"use server";

import { revalidatePath } from "next/cache";
import { bookingSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

type CreateBookingInput = {
  packageId: string;
  destinationId?: string;
  originCity: string;
  destinationCity: string;
  travelType: "one-way" | "round-trip";
  departureDate: string;
  returnDate?: string;
  numTravelers: number;
  packageOptionLabel?: string;
  fullName: string;
  biNumber: string;
  baggageQty?: number;
  notes?: string;
  totalPrice: number;
};

export async function createBooking(input: CreateBookingInput) {
  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Precisa iniciar sessao para concluir a reserva." };
  }

  const optLabel = parsed.data.packageOptionLabel?.trim();
  const structuredNotes = {
    passenger: {
      fullName: parsed.data.fullName.trim(),
      biNumber: parsed.data.biNumber.trim(),
      baggageQty: typeof parsed.data.baggageQty === "number" ? parsed.data.baggageQty : null,
    },
    route: {
      origin: parsed.data.originCity.trim(),
      destination: parsed.data.destinationCity.trim(),
      label: `${parsed.data.originCity.trim()} - ${parsed.data.destinationCity.trim()}`,
    },
    packageOption: optLabel
      ? { label: optLabel, numTravelers: parsed.data.numTravelers, travelType: parsed.data.travelType }
      : null,
    notes: parsed.data.notes?.trim() || null,
  };

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      reservation_type: "pacote",
      package_id: parsed.data.packageId,
      destination_id: parsed.data.destinationId ?? null,
      travel_type: parsed.data.travelType,
      departure_date: parsed.data.departureDate,
      return_date: parsed.data.travelType === "round-trip" ? parsed.data.returnDate : null,
      num_travelers: parsed.data.numTravelers,
      total_price: input.totalPrice,
      client_name: parsed.data.fullName.trim(),
      notes: JSON.stringify(structuredNotes),
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/reservas");
  revalidatePath("/perfil");
  revalidatePath("/atendimento");
  revalidatePath("/atendimento/reservas");

  return { success: true as const, bookingId: inserted.id as string };
}
