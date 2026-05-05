/**
 * Novo instance por navegação — permite entrada suave da página sem estado persistente.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <div className="ui-page-enter flex min-h-0 flex-1 flex-col">{children}</div>;
}
