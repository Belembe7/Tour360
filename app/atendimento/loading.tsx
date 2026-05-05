/** Carregamento dentro da área /atendimento (fundo claro). */
export default function AtendimentoLoading() {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 py-16" aria-busy aria-live="polite">
      <div className="h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200">
        <div className="ui-loading-bar h-full w-[35%] rounded-full bg-[color:var(--brand-500)]" />
      </div>
      <p className="text-sm font-medium text-zinc-600">A carregar painel...</p>
    </div>
  );
}
