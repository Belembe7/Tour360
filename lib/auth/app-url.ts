/**
 * URL publica da app para redirects de auth (email, OAuth, recuperacao de senha).
 * Em producao nunca deve cair em localhost — configure NEXT_PUBLIC_APP_URL na Vercel.
 */
export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit?.startsWith("http")) return explicit;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) {
    const host = prod.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://tour360-cyan.vercel.app";
  }

  return "http://localhost:3000";
}

/** URL de callback apos confirmar email ou OAuth. */
export function authCallbackUrl(next = "/perfil"): string {
  const base = getAppBaseUrl();
  return `${base}/auth/callback?next=${encodeURIComponent(next)}`;
}

/** Base URL no browser (usa env publica ou origem actual). */
export function getAppBaseUrlClient(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");
  if (explicit?.startsWith("http")) return explicit;
  if (typeof window !== "undefined") return window.location.origin;
  return "http://localhost:3000";
}
