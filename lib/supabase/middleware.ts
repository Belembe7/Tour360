import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { canAccessAtendimento } from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");
  const isStaffLogin = path.startsWith("/login/atendimento");
  const isPerfilRoute = path.startsWith("/perfil");
  const isReservasRoute = path.startsWith("/reservas");
  const isAdminRoute = path.startsWith("/admin");
  const isAtendimentoRoute = path.startsWith("/atendimento");
  const isRegisterRoute = path.startsWith("/register");

  if (user && isRegisterRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role === "caixa") {
      return NextResponse.redirect(new URL("/atendimento", request.url));
    }
  }

  if (!user && (isPerfilRoute || isReservasRoute || isAdminRoute || isAtendimentoRoute)) {
    const url = request.nextUrl.clone();
    url.pathname = isAtendimentoRoute ? "/login/atendimento" : "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAtendimentoRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (!canAccessAtendimento(profile?.role)) {
      return NextResponse.redirect(new URL("/perfil", request.url));
    }
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    const role = profile?.role ?? "client";

    if (isStaffLogin) {
      if (canAccessAtendimento(role)) {
        return NextResponse.redirect(new URL("/atendimento", request.url));
      }
      return NextResponse.redirect(new URL("/perfil", request.url));
    }

    if (role === "caixa") {
      return NextResponse.redirect(new URL("/atendimento", request.url));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/perfil", request.url));
  }

  if (user && isAdminRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/perfil", request.url));
    }
  }

  return response;
}
