"use server";

import { corporateSchema } from "@/lib/validations";
import { createClient } from "@/lib/supabase/server";

type CorporateInput = {
  fullName: string;
  phone: string;
  companyName: string;
  nuit: string;
  contactPerson: string;
  paymentModality: "antecipado" | "postecipado";
  creditLimit: number;
};

export async function submitCorporateForm(input: CorporateInput) {
  const parsed = corporateSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados invalidos." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Inicie sessao para submeter a ficha corporativa." };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: parsed.data.fullName,
    phone: parsed.data.phone,
    client_type: "corporativo",
  });

  if (profileError) return { error: profileError.message };

  const { data: existing } = await supabase
    .from("corporate_clients")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("corporate_clients")
      .update({
        company_name: parsed.data.companyName,
        nuit: parsed.data.nuit,
        contact_person: parsed.data.contactPerson,
        payment_modality: parsed.data.paymentModality,
        credit_limit: parsed.data.creditLimit,
      })
      .eq("id", existing.id);

    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("corporate_clients").insert({
      profile_id: user.id,
      company_name: parsed.data.companyName,
      nuit: parsed.data.nuit,
      contact_person: parsed.data.contactPerson,
      payment_modality: parsed.data.paymentModality,
      credit_limit: parsed.data.creditLimit,
      is_validated: false,
    });

    if (error) return { error: error.message };
  }

  return { success: true };
}
