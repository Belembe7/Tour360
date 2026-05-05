import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { CorporateValidationToggle } from "@/components/admin/corporate-validation-toggle";
import { createClient } from "@/lib/supabase/server";

type CorporateRow = {
  id: string;
  company_name: string;
  nuit: string | null;
  contact_person: string | null;
  payment_modality: string | null;
  credit_limit: number;
  is_validated: boolean;
  profiles: { full_name: string | null; phone: string | null } | null;
};

export default async function AdminCorporativoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/corporativo");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/perfil");

  const { data } = await supabase
    .from("corporate_clients")
    .select(
      "id, company_name, nuit, contact_person, payment_modality, credit_limit, is_validated, profiles(full_name, phone)",
    )
    .order("created_at", { ascending: false });

  const clients = (data ?? []) as unknown as CorporateRow[];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Clientes corporativos</h1>
      <p className="mb-6 text-zinc-600">Valide fichas e monitore limites de credito.</p>
      <AdminNav />
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">NUIT</th>
              <th className="px-4 py-3">Modalidade</th>
              <th className="px-4 py-3">Limite</th>
              <th className="px-4 py-3">Validacao</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((item) => (
              <tr key={item.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">{item.company_name}</td>
                <td className="px-4 py-3">
                  {item.profiles?.full_name ?? "-"} ({item.contact_person ?? "-"})
                </td>
                <td className="px-4 py-3">{item.nuit ?? "-"}</td>
                <td className="px-4 py-3">{item.payment_modality ?? "-"}</td>
                <td className="px-4 py-3">{item.credit_limit.toLocaleString("pt-MZ")} MT</td>
                <td className="px-4 py-3">
                  <CorporateValidationToggle
                    clientId={item.id}
                    initialValue={item.is_validated}
                  />
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-zinc-500">
                  Sem fichas corporativas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
