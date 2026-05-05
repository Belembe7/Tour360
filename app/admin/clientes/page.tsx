import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";
import { createClient } from "@/lib/supabase/server";

export default async function AdminClientesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/clientes");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/perfil");

  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, phone, client_type, role, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Clientes</h1>
      <p className="mb-6 text-zinc-600">Base de clientes registrados no sistema.</p>
      <AdminNav />
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {(clients ?? []).map((item) => (
              <tr key={item.id} className="border-t border-zinc-200">
                <td className="px-4 py-3">{item.full_name ?? "Sem nome"}</td>
                <td className="px-4 py-3">{item.phone ?? "-"}</td>
                <td className="px-4 py-3">{item.client_type}</td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">
                  {new Date(item.created_at).toLocaleDateString("pt-MZ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
