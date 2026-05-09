"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginSchema } from "@/lib/validations";

type LoginFormProps = {
  variant?: "client" | "staff";
  defaultNext?: string;
};

const inputBase =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/20";

export function LoginForm({ variant = "client", defaultNext = "/perfil" }: LoginFormProps) {
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const nextPath = params.get("next") || defaultNext;
  const oauthError = params.get("error") === "oauth_callback_failed";
  const registeredStatus = params.get("registered");
  const registeredEmail = params.get("email");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  function getBaseUrl() {
    if (appUrl && appUrl.startsWith("http")) return appUrl;
    if (typeof window !== "undefined") return window.location.origin;
    return "http://localhost:3000";
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginSchema) {
    setServerError(null);
    setInfoMessage(null);
    setPendingEmail(values.email);
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email.trim(),
      password: values.password,
    });

    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setInfoMessage("Seu email ainda nao foi confirmado. Verifique sua caixa de entrada.");
      } else if (error.message.toLowerCase().includes("invalid login credentials")) {
        setServerError("Email ou senha invalidos.");
      } else {
        setServerError(error.message);
      }
      return;
    }

    const {
      data: { user: signedUser },
    } = await supabase.auth.getUser();
    if (!signedUser?.id) {
      window.location.assign(nextPath.startsWith("/") ? nextPath : "/perfil");
      return;
    }
    const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", signedUser.id).maybeSingle();
    const r = profileRow?.role as string | undefined;

    if (variant === "staff") {
      if (r !== "caixa" && r !== "admin") {
        await supabase.auth.signOut();
        setServerError("Acesso reservado a funcionarios de caixa ou administracao.");
        return;
      }
      const dest = nextPath.startsWith("/") ? nextPath : "/atendimento";
      window.location.assign(dest);
      return;
    }

    if (r === "caixa") {
      window.location.assign("/atendimento");
      return;
    }
    if (r === "admin") {
      const dest = nextPath.startsWith("/admin") ? nextPath : "/admin";
      window.location.assign(dest);
      return;
    }
    const dest = nextPath.startsWith("/") ? nextPath : "/perfil";
    window.location.assign(dest);
  }

  async function handleResendConfirmation() {
    const email = (watch("email") || pendingEmail).trim();
    if (!email) return;
    setServerError(null);
    setResendLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });

    setResendLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit")) {
        setServerError("Muitas tentativas de reenvio. Aguarde um pouco e tente novamente.");
      } else {
        setServerError("Nao foi possivel reenviar o email de confirmacao.");
      }
      return;
    }

    setInfoMessage("Email de confirmacao reenviado com sucesso.");
  }

  async function handleForgotPassword() {
    setServerError(null);
    setInfoMessage(null);
    const email = (watch("email") || pendingEmail).trim();
    if (!email) {
      setServerError("Digite o seu email para recuperar a senha.");
      return;
    }

    setResetLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getBaseUrl()}/login`,
    });
    setResetLoading(false);

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("rate limit")) {
        setServerError("Muitas tentativas de recuperacao. Aguarde um pouco e tente novamente.");
      } else {
        setServerError("Nao foi possivel enviar o email de recuperacao.");
      }
      return;
    }

    setInfoMessage("Enviamos um email com instrucoes para redefinir a senha.");
  }

  const subtitle =
    variant === "staff"
      ? "Acesso reservado a funcionarios autorizados."
      : "Bem-vindo de volta. Entre com o seu email e senha.";

  return (
    <div className="login-floating group relative w-full max-w-[360px] rounded-2xl border border-white/70 bg-gradient-to-b from-white to-zinc-50/95 p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 md:p-5">
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(80%_60%_at_0%_0%,rgba(78,168,222,0.14),transparent_70%)] opacity-80"
        aria-hidden
      />
      <div className="relative mb-4 text-center">
        <div className="flex justify-center">
          <Image src="/images/logo-v2.png" alt="TOUR 360" width={88} height={88} className="h-20 w-20 object-contain" />
        </div>
        <p className="mt-2 text-xs text-zinc-500">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-3.5">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-700">Email</label>
          <input
            type="email"
            className={inputBase}
            placeholder="seu@email.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-700">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            className={inputBase}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-[11px] font-medium text-zinc-600 hover:underline"
          >
            {showPassword ? "Ocultar senha" : "Ver senha"}
          </button>
          {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] text-zinc-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-[color:var(--brand-700)]"
            />
            Lembrar-me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-[11px] font-semibold text-[color:var(--brand-700)] hover:underline disabled:opacity-70"
          >
            {resetLoading ? "A enviar..." : "Esqueceu a senha?"}
          </button>
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {variant === "staff" && serverError?.toLowerCase().includes("invalidos") ? (
          <p className="rounded-lg bg-zinc-50 px-3 py-2 text-left text-[11px] leading-relaxed text-zinc-600 ring-1 ring-zinc-200">
            Se ainda nao criou as contas de caixa: inicie sessao como <strong>admin</strong>, abra{" "}
            <strong>Admin → Caixa</strong>, confirme <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code> no
            servidor e clique em <strong>Garantir caixa1, caixa2 e caixa3</strong>.
          </p>
        ) : null}
        {registeredStatus === "check-email" && registeredEmail ? (
          <p className="text-sm text-emerald-700">
            Conta criada para {registeredEmail}. Confirme o email e depois inicie sessao.
          </p>
        ) : null}
        {oauthError && !serverError ? (
          <p className="text-sm text-red-600">Falha ao concluir o login com Google. Tente novamente.</p>
        ) : null}
        {infoMessage && <p className="text-sm text-amber-800">{infoMessage}</p>}
        {infoMessage && pendingEmail ? (
          <button
            type="button"
            onClick={handleResendConfirmation}
            disabled={resendLoading}
            className="text-sm font-medium text-[color:var(--brand-700)] hover:underline disabled:opacity-70"
          >
            {resendLoading ? "A reenviar..." : "Reenviar email de confirmacao"}
          </button>
        ) : null}

        <button
          disabled={loading}
          type="submit"
          className="mt-1 w-full rounded-lg bg-[color:var(--brand-700)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>

        {variant === "client" ? (
          <>
            <p className="pt-1 text-center text-xs text-zinc-600">
              Nao tem conta?{" "}
              <Link href="/register" className="font-bold text-[color:var(--brand-700)] hover:underline">
                Criar conta
              </Link>
            </p>
            <p className="text-center text-[11px] text-zinc-500">
              Funcionario de caixa?{" "}
              <Link href="/login/atendimento" className="font-semibold text-[color:var(--brand-700)] hover:underline">
                Entrar em atendimento
              </Link>
            </p>
          </>
        ) : null}

        <p className="text-center text-[10px] text-zinc-400">
          <Link href="/" className="hover:text-[color:var(--brand-700)] hover:underline">
            Voltar ao site
          </Link>
        </p>
      </form>
      {variant === "staff" ? (
        <p className="mt-3 rounded-lg bg-[color:var(--brand-50)] px-3 py-2 text-left text-[10px] leading-relaxed text-[color:var(--brand-900)] ring-1 ring-[color:var(--brand-500)]/20">
          A conta tem de existir no Supabase (criada em <strong>Admin → Caixa</strong>). Se ainda nao clicou em{" "}
          <strong>Garantir caixa1, caixa2 e caixa3</strong>, o login com caixa1@gmail.com / 123456 falha.
        </p>
      ) : null}
    </div>
  );
}
