"use server";

import { revalidatePath } from "next/cache";
import {
  catalogSectionLabel,
  defaultPackageSlugForSection,
  getCatalogItem,
  isCatalogSectionId,
} from "@/lib/destinations/catalog-booking";
import { catalogBookingSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

export async function createCatalogBooking(input: {
  packageId: string;
  sectionId: string;
  destinationName: string;
  fullName: string;
  biNumber: string;
  departureDate: string;
  returnDate?: string;
  totalPrice: number;
}) {
  const parsed = catalogBookingSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  if (!isCatalogSectionId(parsed.data.sectionId)) {
    return { error: "Seccao do catalogo invalida." };
  }

  const catalogItem = getCatalogItem(parsed.data.sectionId, parsed.data.destinationName);
  if (!catalogItem) {
    return { error: "Destino nao encontrado no catalogo." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Precisa iniciar sessao para concluir a reserva." };
  }

  const { data: pkg, error: pkgError } = await supabase
    .from("packages")
    .select("id, slug")
    .eq("id", parsed.data.packageId)
    .single();

  if (pkgError || !pkg) {
    return { error: "Pacote associado nao encontrado." };
  }

  const expectedSlug = defaultPackageSlugForSection(parsed.data.sectionId);
  if (pkg.slug !== expectedSlug) {
    return { error: "Pacote nao corresponde a esta seccao do catalogo." };
  }

  const hasReturn = Boolean(parsed.data.returnDate?.trim());
  const travelType = hasReturn ? "round-trip" : "one-way";

  const structuredNotes = {
    source: "catalogo-destinos",
    catalogSection: parsed.data.sectionId,
    catalogSectionLabel: catalogSectionLabel(parsed.data.sectionId),
    passenger: {
      fullName: parsed.data.fullName.trim(),
      biNumber: parsed.data.biNumber.trim(),
    },
    destination: {
      name: catalogItem.name,
      region: catalogItem.region,
      duration: catalogItem.duration,
    },
  };

  const { data: inserted, error } = await supabase
    .from("bookings")
    .insert({
      user_id: user.id,
      reservation_type: "pacote",
      package_id: parsed.data.packageId,
      destination_id: null,
      destination_free: catalogItem.name,
      travel_type: travelType,
      departure_date: parsed.data.departureDate,
      return_date: hasReturn ? parsed.data.returnDate : null,
      num_travelers: 1,
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
