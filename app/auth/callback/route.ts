import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getAppBaseUrl } from "@/lib/auth/app-url";

function resolveBaseUrl(request: NextRequest): string {
  const fromEnv = getAppBaseUrl();
  if (!fromEnv.includes("localhost")) return fromEnv;

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host && !host.includes("localhost")) {
    return `${proto}://${host}`;
  }

  return fromEnv;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const base = resolveBaseUrl(request);

  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");
  if (error) {
    const login = new URL("/login", base);
    login.searchParams.set("error", "auth_callback");
    if (errorDescription) login.searchParams.set("message", errorDescription);
    else if (error === "access_denied") {
      login.searchParams.set(
        "message",
        "Link de confirmacao invalido ou expirado. Peça um novo email de confirmacao.",
      );
    }
    return NextResponse.redirect(login);
  }

  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const nextParam = requestUrl.searchParams.get("next") || "/perfil";
  const safeNext = nextParam.startsWith("/") ? nextParam : "/perfil";

  const response = NextResponse.redirect(new URL(safeNext, base));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      const login = new URL("/login", base);
      login.searchParams.set("error", "oauth_callback_failed");
      login.searchParams.set("message", exchangeError.message);
      return NextResponse.redirect(login);
    }
    return response;
  }

  if (tokenHash && type) {
    const otpType = type as "signup" | "email" | "recovery" | "invite" | "magiclink" | "email_change";
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: otpType,
    });
    if (verifyError) {
      const login = new URL("/login", base);
      login.searchParams.set("error", "auth_callback");
      login.searchParams.set("message", verifyError.message);
      return NextResponse.redirect(login);
    }
    return response;
  }

  return NextResponse.redirect(new URL("/login?error=auth_callback", base));
}
