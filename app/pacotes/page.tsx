import { PackagesDiscovery } from "@/components/packages/packages-discovery";
import { PageBack } from "@/components/layout/page-back";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { createClient } from "@/lib/supabase/server";
import type { Package } from "@/types";

type SearchParams = Promise<{
  type?: "nacional" | "internacional";
  category?: "economico" | "intermediario" | "premium";
}>;

export default async function PacotesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("price_min", { ascending: true });

  if (searchParams.type) query = query.eq("type", searchParams.type);
  if (searchParams.category) query = query.eq("category", searchParams.category);

  const { data } = await query;
  const items = (data ?? []) as Package[];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageBack href="/" label="Voltar ao inicio" className="mb-4" />
      <ScrollReveal as="section">
        <PackagesDiscovery items={items} />
      </ScrollReveal>
    </main>
  );
}
