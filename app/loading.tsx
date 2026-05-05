/**
 * Estado de carregamento entre rotas (Suspense / navegação).
 * Leve: apenas CSS, sem JS extra.
 */
export default function RootLoading() {
  return (
    <div
      className="flex min-h-[40vh] flex-1 flex-col items-center justify-center gap-5 px-4 py-16"
      aria-busy
      aria-live="polite"
    >
      <div className="relative flex flex-col items-center gap-3">
        <div className="ui-loading-track">
          <div className="ui-loading-bar" />
        </div>
        <p className="text-sm font-medium text-white/75">A carregar...</p>
      </div>
    </div>
  );
}
