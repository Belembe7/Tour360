import { redirect } from "next/navigation";
import { AdminCreateCaixaForm } from "@/components/admin/admin-create-caixa-form";
import { AdminNav } from "@/components/admin/admin-nav";
import { listCaixaAccountsWithEmails } from "@/app/admin/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCaixaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin/caixa");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/perfil");

  const { rows, error: listError } = await listCaixaAccountsWithEmails();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#0A2342]">Contas de caixa / atendimento</h1>
      <p className="mb-2 text-zinc-600">
        Apenas administradores criam estes utilizadores. O autocadastro em <code className="rounded bg-zinc-100 px-1">/register</code>{" "}
        e apenas para clientes; e-mails caixa1–3 estao reservados.
      </p>
      <p className="mb-6 text-sm text-zinc-500">
        Requer <code className="rounded bg-zinc-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> no servidor (.env.local).
      </p>
      <AdminNav />

      {listError ? <p className="mb-4 text-sm text-red-600">{listError}</p> : null}

      <section className="mb-8 overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Nome</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-200">
                <td className="px-4 py-3 font-mono text-xs">{r.email ?? "—"}</td>
                <td className="px-4 py-3">{r.full_name ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-6 text-center text-zinc-500">
                  Ainda nao ha contas com perfil caixa.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <AdminCreateCaixaForm />
    </main>
  );
}
