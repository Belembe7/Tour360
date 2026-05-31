import Link from "next/link";
import { NewStaffBookingForm } from "@/components/atendimento/new-staff-booking-form";
import { createClient } from "@/lib/supabase/server";
import type { Vehicle } from "@/types";

/**
 * Formulario para criar reserva em nome do cliente (persistencia via server action com validacao de perfil).
 */
export default async function NovaReservaAtendimentoPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("vehicles").select("*").order("price_per_day", { ascending: true });
  const vehicles = (data ?? []) as Vehicle[];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-[#0A2342]">Nova reserva no balcao</h2>
          <p className="text-sm text-zinc-600">
            Viagem, pacote turistico ou aluguer de viatura — os mesmos servicos do site, registados para o cliente
            presencial ou por telefone.
          </p>
        </div>
        <Link href="/atendimento/reservas" className="text-sm font-semibold text-[#1D4E89] hover:underline">
          Voltar ao historico
        </Link>
      </div>
      <NewStaffBookingForm vehicles={vehicles} />
    </div>
  );
}
