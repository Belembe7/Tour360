"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="ui-btn rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100"
    >
      Terminar sessao
    </button>
  );
}
