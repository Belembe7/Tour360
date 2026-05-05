"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginSchema } from "@/lib/validations";
import { AuthCardShell, GoogleIcon } from "@/components/auth/auth-card-shell";

type LoginFormProps = {
  variant?: "client" | "staff";
  defaultNext?: string;
};

const inputFilled =
  "ui-field w-full rounded-2xl border-0 bg-zinc-100 px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none " +
  "focus:bg-white focus:ring-2 focus:ring-[color:var(--brand-500)]/40";

const inputOutlined =
  "ui-field w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/25";

export function LoginForm({ variant = "client", defaultNext = "/perfil" }: LoginFormProps) {
  const params = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
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

  async function handleGoogleLogin() {
    setServerError(null);
    setInfoMessage(null);
    setOauthLoading(true);
    const supabase = createClient();
    const redirectTo = `${getBaseUrl()}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    setOauthLoading(false);

    if (error) {
      setServerError("Nao foi possivel iniciar o login com Google.");
    }
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
    variant === "staff" ? (
      <>
        <p>Acesso reservado a funcionarios autorizados.</p>
        <p className="mt-3 rounded-2xl bg-[color:var(--brand-50)] px-3 py-2.5 text-left text-[11px] leading-relaxed text-[color:var(--brand-900)] ring-1 ring-[color:var(--brand-500)]/20">
          A conta tem de existir no Supabase (criada em <strong>Admin → Caixa</strong>). Se ainda nao clicou em{" "}
          <strong>Garantir caixa1, caixa2 e caixa3</strong>, o login com caixa1@gmail.com / 123456 falha.
        </p>
      </>
    ) : (
      <p>Sentimos a sua falta. Entre com o seu email e senha.</p>
    );

  return (
    <AuthCardShell
      title={variant === "staff" ? "Atendimento" : "Entrar"}
      subtitle={subtitle}
      bottomSlot={
        variant === "client" ? (
          <>
            <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200/95">
              Ou entrar com
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || oauthLoading}
              className="ui-btn mt-4 flex w-full items-center justify-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white shadow-inner shadow-black/10 backdrop-blur-sm hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <GoogleIcon className="h-5 w-5 shrink-0" />
              {oauthLoading ? "A redirecionar..." : "Continuar com Google"}
            </button>
          </>
        ) : (
          <p className="text-center text-xs leading-relaxed text-sky-200/90">
            Contas de atendimento nao se criam aqui — sao registadas pelo administrador.
          </p>
        )
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
          <label className="text-xs font-semibold text-[color:var(--brand-900)]">Senha</label>
          <input
            type={showPassword ? "text" : "password"}
            className={inputOutlined}
            placeholder="••••••••"
            autoComplete="current-password"
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

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300 text-[color:var(--brand-700)] focus:ring-[color:var(--brand-500)]"
            />
            Lembrar-me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetLoading}
            className="text-xs font-semibold text-[color:var(--brand-700)] hover:underline disabled:opacity-70"
          >
            {resetLoading ? "A enviar..." : "Esqueceu a senha?"}
          </button>
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {variant === "staff" && serverError?.toLowerCase().includes("invalidos") ? (
          <p className="rounded-2xl bg-zinc-50 px-3 py-2 text-left text-xs leading-relaxed text-zinc-600 ring-1 ring-zinc-200">
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
          disabled={loading || oauthLoading}
          type="submit"
          className="ui-btn mt-2 w-full rounded-full bg-[color:var(--brand-700)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[color:var(--brand-900)]/25 hover:bg-[color:var(--brand-900)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "A entrar..." : "Entrar"}
        </button>

        {variant === "client" ? (
          <>
            <p className="pt-2 text-center text-sm text-zinc-600">
              Nao tem conta?{" "}
              <Link href="/register" className="font-bold text-[color:var(--brand-700)] hover:underline">
                Criar conta
              </Link>
            </p>
            <p className="text-center text-xs text-zinc-500">
              Funcionario de caixa?{" "}
              <Link href="/login/atendimento" className="font-semibold text-[color:var(--brand-700)] hover:underline">
                Entrar em atendimento
              </Link>
            </p>
          </>
        ) : null}

        <p className="text-center text-[11px] text-zinc-400">
          <Link href="/" className="hover:text-[color:var(--brand-700)] hover:underline">
            Voltar ao site
          </Link>
        </p>
      </form>
    </AuthCardShell>
  );
}
