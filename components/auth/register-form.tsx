"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { registerClientUser } from "@/app/register/actions";
import { isReservedForClientSelfRegistration } from "@/lib/auth/reserved-client-emails";
import { registerSchema, type RegisterSchema } from "@/lib/validations";
import { AuthCardShell, GoogleIcon } from "@/components/auth/auth-card-shell";
import { authCallbackUrl, getAppBaseUrlClient } from "@/lib/auth/app-url";

const inputFilled =
  "ui-field w-full rounded-2xl border-0 bg-zinc-100 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none " +
  "focus:bg-white focus:ring-2 focus:ring-[color:var(--brand-500)]/40";

const inputOutlined =
  "ui-field w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/25";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  async function onSubmit(values: RegisterSchema) {
    setServerError(null);
    setSuccessMessage(null);
    if (isReservedForClientSelfRegistration(values.email)) {
      setServerError(
        "Este e-mail e reservado a contas de atendimento. O registo de caixa e feito pela administracao.",
      );
      return;
    }
    setLoading(true);

    const result = await registerClientUser({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    setLoading(false);

    if (!result.ok) {
      const msg = result.error.toLowerCase();
      if (msg.includes("rate limit")) {
        setCooldownSeconds(45);
        setServerError(
          "Muitas tentativas de cadastro em pouco tempo. Aguarde alguns segundos e tente novamente.",
        );
      } else {
        setServerError(result.error);
      }
      return;
    }

    if (result.needsEmailConfirm) {
      setSuccessMessage("Conta criada! Verifique o seu email para confirmar o registo.");
      window.setTimeout(() => {
        router.push(`/login?registered=check-email&email=${encodeURIComponent(result.email)}`);
        router.refresh();
      }, 1400);
      return;
    }

    window.location.assign("/perfil");
  }

  async function handleGoogleSignUp() {
    setServerError(null);
    setSuccessMessage(null);
    setOauthLoading(true);
    const supabase = createClient();
    const redirectTo = authCallbackUrl("/perfil");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    setOauthLoading(false);

    if (error) {
      setServerError("Nao foi possivel iniciar o registo com Google.");
    }
  }

  return (
    <AuthCardShell
      title="Criar conta"
      subtitle={
        <>
          <p>Cliente TOUR 360 — reserve pacotes e viaturas com a sua conta.</p>
          <p className="mt-2 text-[11px] leading-relaxed text-zinc-400">
            Registo exclusivo para clientes. Funcionarios de caixa recebem conta criada pela administracao.
          </p>
        </>
      }
      bottomSlot={
        <>
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/95">
            Ou registar com
          </p>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading || oauthLoading}
            className="ui-btn mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white shadow-inner shadow-black/10 backdrop-blur-sm hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            {oauthLoading ? "A redirecionar..." : "Continuar com Google"}
          </button>
          <p className="mt-3 text-center text-[11px] text-sky-200/75">
            O registo com Google cria apenas perfil de cliente.
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[color:var(--brand-900)]">Email</label>
          <input
            type="email"
            className={inputFilled}
            placeholder="seu@email.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[color:var(--brand-900)]">Nome completo</label>
          <input
            className={inputOutlined}
            placeholder="Como quer ser tratado na reserva"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[color:var(--brand-900)]">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            className={inputFilled}
            placeholder="Minimo 6 caracteres"
            autoComplete="new-password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-xs font-medium text-[color:var(--brand-700)] hover:underline"
          >
            {showPassword ? "Ocultar senha" : "Ver senha"}
          </button>
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[color:var(--brand-900)]">Confirmar senha</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className={inputOutlined}
            placeholder="Repita a senha"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="text-xs font-medium text-[color:var(--brand-700)] hover:underline"
          >
            {showConfirmPassword ? "Ocultar senha" : "Ver senha"}
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {successMessage && <p className="text-sm text-emerald-700">{successMessage}</p>}

        <button
          disabled={loading || oauthLoading || cooldownSeconds > 0}
          type="submit"
          className="ui-btn mt-2 w-full rounded-full bg-[color:var(--brand-700)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[color:var(--brand-900)]/25 hover:bg-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? "A criar conta..."
            : cooldownSeconds > 0
              ? `Tente novamente em ${cooldownSeconds}s`
              : "Criar conta"}
        </button>

        <p className="pt-2 text-center text-sm text-zinc-600">
          Ja tem conta?{" "}
          <Link href="/login" className="font-bold text-[color:var(--brand-700)] hover:underline">
            Entrar
          </Link>
        </p>

        <p className="text-center text-[11px] text-zinc-400">
          <Link href="/" className="hover:text-[color:var(--brand-700)] hover:underline">
            Voltar ao site
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
