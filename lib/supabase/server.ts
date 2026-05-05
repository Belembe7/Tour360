import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Em Server Components o Next.js nao permite `cookies().set()` durante o render.
            // A sessao e actualizada no middleware e em Route Handlers / Server Actions.
            // Ver: https://nextjs.org/docs/app/api-reference/functions/cookies
          }
        },
      },
    },
  );
}
