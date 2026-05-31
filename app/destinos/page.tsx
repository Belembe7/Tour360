import { redirect } from "next/navigation";

type SearchParams = Promise<{ secao?: string }>;

/** Destinos passaram para /pacotes — mantem URLs antigas. */
export default async function DestinosRedirectPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const secao = sp.secao?.trim();
  const query = secao ? `?secao=${encodeURIComponent(secao)}` : "";
  redirect(`/pacotes${query}#catalogo-destinos`);
}
