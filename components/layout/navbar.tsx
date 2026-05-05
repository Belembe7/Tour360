import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { canAccessAtendimento } from "@/lib/auth/roles";
import { mainNavItems } from "@/components/layout/nav-config";
import { NavbarUserMenu } from "@/components/layout/navbar-user-menu";
import { NavbarMobileDrawer } from "@/components/layout/navbar-mobile-drawer";

function computeDisplayName(fullName: string | null | undefined, email: string | null | undefined) {
  const fromProfile = fullName?.trim();
  if (fromProfile) return fromProfile;
  const local = email?.split("@")[0];
  return local || "Conta";
}

function computeInitial(fullName: string | null | undefined, displayName: string, email: string | null | undefined) {
  const fromProfile = fullName?.trim();
  if (fromProfile) return fromProfile.charAt(0).toUpperCase();
  if (displayName.length > 0) return displayName.charAt(0).toUpperCase();
  const e = email?.charAt(0);
  return e ? e.toUpperCase() : "?";
}

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? null;
    role = profile?.role ?? null;
  }

  const displayName = computeDisplayName(fullName, user?.email);
  const initial = computeInitial(fullName, displayName, user?.email);
  const isAdmin = role === "admin";
  const showAtendimento = canAccessAtendimento(role);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 shadow-sm shadow-zinc-900/5 backdrop-blur-md transition-shadow duration-300">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <Link
            href="/"
            className="flex min-w-0 items-center transition-opacity duration-200 hover:opacity-90 active:opacity-80"
          >
            <Image
              src="/images/logo-v2.png"
              alt="TOUR 360"
              width={340}
              height={110}
              priority
              className="h-14 w-auto -my-1 md:h-20 md:-my-3"
            />
          </Link>
          <div className="shrink-0 md:hidden">
            <NavbarMobileDrawer />
          </div>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-0.5 text-sm md:flex">
          {mainNavItems.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="ui-nav-link flex items-center gap-2 rounded-md px-2.5 py-1.5 font-medium text-zinc-700 hover:bg-zinc-100/90 hover:text-[color:var(--brand-900)]"
            >
              <Icon className="h-4 w-4 shrink-0 text-[color:var(--brand-700)] opacity-90" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>

        <div className="shrink-0">
          {user ? (
            <NavbarUserMenu
              displayName={displayName}
              initial={initial}
              email={user.email ?? ""}
              isAdmin={isAdmin}
              showAtendimento={showAtendimento}
            />
          ) : (
            <Link
              href="/login"
              className="ui-btn inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-900)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--brand-700)]"
            >
              <LogIn className="h-4 w-4 shrink-0 opacity-95" aria-hidden />
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
