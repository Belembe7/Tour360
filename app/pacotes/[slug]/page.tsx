import { notFound } from "next/navigation";
import { BookingForm } from "@/components/packages/booking-form";
import { PageBack } from "@/components/layout/page-back";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import type { Destination, Package } from "@/types";

type Params = Promise<{ slug: string }>;

export default async function PackageDetailPage(props: { params: Params }) {
  const params = await props.params;
  const supabase = await createClient();

  const [{ data }, { data: destinations }] = await Promise.all([
    supabase.from("packages").select("*").eq("slug", params.slug).single(),
    supabase.from("destinations").select("*").order("name", { ascending: true }),
  ]);

  const item = data as Package | null;
  if (!item) notFound();

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
          basePrice={item.price_min}
          destinations={(destinations ?? []) as Destination[]}
        />
      </section>
    </main>
  );
}
