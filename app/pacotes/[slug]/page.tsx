import { notFound } from "next/navigation";
import { BookingForm } from "@/components/packages/booking-form";
import { PageBack } from "@/components/layout/page-back";
import { isCatalogSectionId } from "@/lib/destinations/catalog-booking";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { Destination, Package } from "@/types";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ destino?: string; secao?: string }>;

export default async function PackageDetailPage(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const [{ data }, { data: destinations }] = await Promise.all([
    supabase.from("packages").select("*").eq("slug", params.slug).single(),
    supabase.from("destinations").select("*").order("name", { ascending: true }),
  ]);

  const item = data as Package | null;
  if (!item) notFound();

  const initialDestination = searchParams.destino?.trim() || undefined;
  const catalogSection = isCatalogSectionId(searchParams.secao) ? searchParams.secao : undefined;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const nextParams = new URLSearchParams();
  if (initialDestination) nextParams.set("destino", initialDestination);
  if (catalogSection) nextParams.set("secao", catalogSection);
  const nextQuery = nextParams.toString();
  const loginNext = `/pacotes/${params.slug}${nextQuery ? `?${nextQuery}` : ""}#reservar`;

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <PageBack href="/pacotes" label="Voltar aos pacotes" className="mb-2" />

      <section className="mt-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-[#0A2342]">{item.name}</h1>
        <p className="mt-3 text-zinc-700">{item.description ?? "Sem descricao detalhada."}</p>

        <div className="mt-6 grid gap-3 text-sm text-zinc-700 sm:grid-cols-2">
          <p>
            <span className="font-medium">Tipo:</span> {item.type}
          </p>
          <p>
            <span className="font-medium">Categoria:</span> {item.category}
          </p>
          <p>
            <span className="font-medium">Preco inicial:</span>{" "}
            {formatCurrency(item.price_min)}
          </p>
          <p>
            <span className="font-medium">Preco maximo:</span>{" "}
            {item.price_max ? formatCurrency(item.price_max) : "Sob consulta"}
          </p>
        </div>

        <BookingForm
          packageId={item.id}
          packageSlug={item.slug}
          packageName={item.name}
          packageType={item.type}
          basePrice={item.price_min}
          destinations={(destinations ?? []) as Destination[]}
          initialDestinationCity={initialDestination}
          catalogSection={catalogSection}
          isAuthenticated={Boolean(user)}
          loginHref={`/login?next=${encodeURIComponent(loginNext)}`}
        />
      </section>
    </main>
  );
}
