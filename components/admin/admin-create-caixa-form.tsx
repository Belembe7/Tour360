"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCaixaUser, ensureDemoCaixaAccounts } from "@/app/admin/actions";
import { adminCreateCaixaSchema, type AdminCreateCaixaSchema } from "@/lib/validations";

const defaultPassword = "123456";

/**
 * Formulario admin para criar utilizador caixa (Auth + perfil). Limite de 3 contas caixa.
 */
export function AdminCreateCaixaForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminCreateCaixaSchema>({
    resolver: zodResolver(adminCreateCaixaSchema) as Resolver<AdminCreateCaixaSchema>,
    defaultValues: {
      email: "",
      fullName: "",
      password: defaultPassword,
    },
  });

  async function onSubmit(values: AdminCreateCaixaSchema) {
    setServerError(null);
    setInfo(null);
    setLoading(true);
    const res = await createCaixaUser(values);
    setLoading(false);
    if ("error" in res && res.error) {
      setServerError(res.error);
      return;
    }
    setInfo("Conta de caixa criada ou actualizada.");
    reset({ email: "", fullName: "", password: defaultPassword });
    router.refresh();
  }

  async function onSeedDemo() {
    setServerError(null);
    setInfo(null);
    setSeedLoading(true);
    const res = await ensureDemoCaixaAccounts();
    setSeedLoading(false);
    if ("error" in res && res.error) {
      setServerError(res.error);
      return;
    }
    setInfo(res.messages?.join(" ") ?? "Concluido.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-[#0A2342]">Criar ou actualizar caixa</h3>
        <p className="mt-1 text-sm text-zinc-600">
          Maximo 3 utilizadores com perfil caixa. Se o e-mail ja existir, a conta e actualizada (senha e perfil).
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-zinc-700">Email</label>
            <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Nome</label>
            <input className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" {...register("fullName")} />
            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-700">Senha (min. 6)</label>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
              type="password"
              autoComplete="new-password"
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
          </div>
          {serverError && <p className="sm:col-span-2 text-sm text-red-600">{serverError}</p>}
          {info && <p className="sm:col-span-2 text-sm text-emerald-700">{info}</p>}
          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#0A2342] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-950 disabled:opacity-60"
            >
              {loading ? "A guardar..." : "Guardar caixa"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5">
        <h3 className="text-lg font-semibold text-amber-950">Contas de demonstracao</h3>
        <p className="mt-1 text-sm text-amber-900/90">
          Cria ou sincroniza <strong>caixa1@gmail.com</strong>, <strong>caixa2@gmail.com</strong> e{" "}
          <strong>caixa3@gmail.com</strong> com a senha <strong>{defaultPassword}</strong> (todas com perfil caixa).
          Idempotente: pode clicar varias vezes.
        </p>
        <button
          type="button"
          disabled={seedLoading}
          onClick={onSeedDemo}
          className="mt-3 rounded-lg border border-amber-700 bg-white px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-60"
        >
          {seedLoading ? "A processar..." : "Garantir caixa1, caixa2 e caixa3"}
        </button>
      </div>
    </div>
  );
}
