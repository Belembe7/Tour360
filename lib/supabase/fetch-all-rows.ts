const PAGE_SIZE = 1000;

type PageResult<T> = {
  data: T[] | null;
  error: { message: string } | null;
};

/**
 * Percorre todas as paginas do PostgREST (limite padrao 1000 linhas por pedido).
 */
export async function fetchAllRows<T>(
  fetchPage: (from: number, to: number) => Promise<PageResult<T>>,
): Promise<{ data: T[]; error: string | null }> {
  const all: T[] = [];
  let offset = 0;

  while (true) {
    const { data, error } = await fetchPage(offset, offset + PAGE_SIZE - 1);
    if (error) {
      return { data: all, error: error.message };
    }
    const page = data ?? [];
    all.push(...page);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return { data: all, error: null };
}
