import Link from "next/link";
import { redirect } from "next/navigation";
import { Luggage } from "lucide-react";
import { AtendimentoNav } from "@/components/atendimento/atendimento-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { canAccessAtendimento } from "@/lib/auth/roles";
import { roleLabel } from "@/lib/atendimento/labels";
import { createClient } from "@/lib/supabase/server";

export default async function AtendimentoLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login/atendimento?next=/atendimento");
  }

  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();

  if (!canAccessAtendimento(profile?.role)) {
    redirect("/perfil");
  }

  const display = profile?.full_name?.trim() || user.email?.split("@")[0] || "Atendimento";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-100/90 via-zinc-50/80 to-white">
      <header className="border-b border-sky-200/60 bg-white/95 shadow-sm shadow-sky-900/5 backdrop-blur-md transition-shadow duration-300">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0A2342] to-[#1D4E89] text-white shadow-md ring-1 ring-white/20">
              <Luggage className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-700/90">TOUR 360 · Balcao</p>
              <h1 className="text-lg font-bold tracking-tight text-[#0A2342]">Atendimento e reservas</h1>
              <p className="text-xs text-zinc-600">
                Viagens, pacotes e viaturas · {display} · {roleLabel(profile?.role)}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="ui-nav-link text-sm font-semibold text-[#1D4E89] underline-offset-4 hover:text-[#0A2342] hover:underline"
            >
              Site publico
            </Link>
            {profile?.role === "admin" ? (
              <Link
                href="/admin"
                className="ui-btn rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100/80"
              >
                Admin
              </Link>
            ) : null}
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <AtendimentoNav />
        {children}
      </div>
    </div>
  );
}
