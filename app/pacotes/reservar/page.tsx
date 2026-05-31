import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CatalogBookingForm } from "@/components/destinations/catalog-booking-form";
import { PageBack } from "@/components/layout/page-back";
import {
  defaultPackageSlugForSection,
  getCatalogItem,
  isCatalogSectionId,
} from "@/lib/destinations/catalog-booking";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/types";

type SearchParams = Promise<{ destino?: string; secao?: string }>;

export default async function CatalogReservePage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const destino = searchParams.destino?.trim();
  const secao = searchParams.secao?.trim();

  if (!destino || !isCatalogSectionId(secao)) {
    redirect("/pacotes#catalogo-destinos");
  }

  const catalogItem = getCatalogItem(secao, destino);
  if (!catalogItem) {
    notFound();
  }

  const supabase = await createClient();
  const packageSlug = defaultPackageSlugForSection(secao);

  const [{ data: pkg }, { data: { user } }] = await Promise.all([
    supabase.from("packages").select("id, name, slug").eq("slug", packageSlug).eq("is_active", true).single(),
    supabase.auth.getUser(),
  ]);

  if (!pkg) {
    notFound();
  }

  const packageRow = pkg as Pick<Package, "id" | "name" | "slug">;
  const loginNext = `/pacotes/reservar?secao=${encodeURIComponent(secao)}&destino=${encodeURIComponent(destino)}`;

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-10">
      <PageBack href={`/pacotes?secao=${secao}#catalogo-destinos`} label="Voltar ao catalogo" className="mb-6" />

      <CatalogBookingForm
        packageId={packageRow.id}
        packageName={packageRow.name}
        sectionId={secao}
        item={catalogItem}
        isAuthenticated={Boolean(user)}
        loginHref={`/login?next=${encodeURIComponent(loginNext)}`}
      />

      <p className="mt-6 text-center text-xs text-zinc-500">
        A reserva aparece em{" "}
        <Link href="/reservas" className="font-semibold text-[color:var(--brand-700)] underline underline-offset-2">
          Minhas reservas
        </Link>{" "}
        apos confirmar.
      </p>
    </main>
  );
}
