/**
 * Quando a query ao Supabase falha (ex.: migration ainda nao aplicada ou RLS).
 */
export function AtendimentoDataError({ error }: { error: string }) {
  const hintSchema = /column|does not exist|schema cache|42703|42P01/i.test(error);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/95 p-6 text-sm text-amber-950 shadow-sm ring-1 ring-amber-300/40">
      <p className="text-base font-bold text-[#0A2342]">Nao foi possivel carregar os dados do atendimento</p>
      <p className="mt-2 font-mono text-xs text-amber-900/90">{error}</p>
      {hintSchema ? (
        <p className="mt-4 text-xs leading-relaxed text-amber-950/90">
          Confirme que aplicou a migration <code className="rounded bg-white px-1 py-0.5">20260504120000_caixa_atendimento_bookings.sql</code> no
          SQL Editor do Supabase (campos <code className="rounded bg-white px-1">created_by_user_id</code>,{" "}
          <code className="rounded bg-white px-1">reservation_type</code>, etc. na tabela <code className="rounded bg-white px-1">bookings</code>).
        </p>
      ) : null}
    </div>
  );
}
