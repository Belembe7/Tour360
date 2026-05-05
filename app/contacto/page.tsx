import { PageBack } from "@/components/layout/page-back";

export default function ContactoPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <PageBack href="/" label="Voltar ao inicio" variant="inverted" className="mb-6" />
      <section className="grid items-center gap-8 md:grid-cols-[1.05fr_1fr] md:gap-12">
        <div className="md:px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Estamos aqui para ajudar
          </p>
          <h1 className="mt-3 text-4xl font-light leading-tight text-white md:text-5xl">
            <span className="font-extrabold text-cyan-200">Discuta</span> a sua proxima viagem
            connosco
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/85">
            Procura pacotes, viaturas ou suporte corporativo? A equipa da TOUR 360 prepara
            uma proposta a sua medida com rapidez, seguranca e acompanhamento completo.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 6.5 12 12l8-5.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/65">Email</p>
                <p className="text-sm font-medium text-white/90">contacto@tour360.co.mz</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cyan-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.52a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.56-1.06a2 2 0 0 1 2.11-.45c.82.24 1.66.42 2.52.54A2 2 0 0 1 22 16.92Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/65">
                  Telefone
                </p>
                <p className="text-sm font-medium text-white/90">+258 84 000 0000</p>
              </div>
            </div>
          </div>
        </div>

        <form className="w-full max-w-xl rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.2)] md:p-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wide text-white/95" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Digite o seu nome"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[color:var(--brand-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
              />

              <label className="block text-xs font-bold uppercase tracking-wide text-white/95" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Digite o seu email"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[color:var(--brand-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
              />

              <label className="block text-xs font-bold uppercase tracking-wide text-white/95" htmlFor="servico">
                Servico
              </label>
              <select
                id="servico"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-700 focus:border-[color:var(--brand-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
                defaultValue=""
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option>Pacotes nacionais</option>
                <option>Pacotes internacionais</option>
                <option>Viaturas</option>
                <option>Corporativo</option>
              </select>

              <label className="block text-xs font-bold uppercase tracking-wide text-white/95" htmlFor="mensagem">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                rows={4}
                placeholder="Escreva a sua mensagem"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[color:var(--brand-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-500)]/25"
              />
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-700)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-900)]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                →
              </span>
              Enviar mensagem
            </button>
        </form>
      </section>
    </main>
  );
}
