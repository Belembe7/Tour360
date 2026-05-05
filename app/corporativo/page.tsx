import { CorporateForm } from "@/components/corporativo/corporate-form";
import { PageBack } from "@/components/layout/page-back";
import {
  BadgeCheck,
  Banknote,
  Building2,
  Headphones,
  LineChart,
  UsersRound,
} from "lucide-react";

const highlights = [
  {
    title: "Logistica de eventos",
    text: "Transferes, alojamento em grupo e coordenacao para congressos, feiras e team buildings.",
    icon: LineChart,
  },
  {
    title: "Pagamento B2B",
    text: "Modalidades antecipadas ou com limite aprovado, alinhadas ao calendario da sua empresa.",
    icon: Banknote,
  },
  {
    title: "Acompanhamento",
    text: "Contacto dedicado, propostas claras e acompanhamento antes, durante e apos a viagem.",
    icon: Headphones,
  },
] as const;

const trust = [
  { label: "Proposta sob medida", icon: Building2 },
  { label: "Equipa comercial", icon: UsersRound },
  { label: "Ficha validada", icon: BadgeCheck },
] as const;

export default function CorporativoPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12">
      <PageBack href="/" label="Voltar ao inicio" variant="inverted" className="mb-6" />

      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-12">
        <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-200/90">B2B · TOUR 360</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.4rem]">
              Servicos corporativos
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-sky-100/90 md:text-lg">
              Deslocacoes em grupo, pacotes para equipas e logistica de eventos, com faturacao e condicoes de pagamento
              pensadas para administracao e financas.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2">
              {trust.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-50 ring-1 ring-white/5 backdrop-blur-sm"
                >
                  <item.icon className="h-3.5 w-3.5 text-cyan-200" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-10 space-y-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="group flex gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 ring-1 ring-white/5 transition hover:border-white/20 hover:bg-white/[0.09]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/25 to-sky-900/40 text-cyan-100 ring-1 ring-white/10">
                    <item.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="font-semibold text-white">{item.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-sky-100/85">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <section className="rounded-3xl border border-white/15 bg-white p-1 shadow-2xl shadow-black/30 ring-1 ring-white/20">
          <div className="rounded-[1.35rem] bg-gradient-to-b from-zinc-50 to-white p-5 md:p-7">
            <div className="border-b border-zinc-200/80 pb-5">
              <h2 className="text-lg font-bold text-[color:var(--brand-900)]">Abertura de ficha corporativa</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                Preencha os campos com dados oficiais da empresa. A nossa equipa analisa, valida e responde com uma
                proposta ou pedido de documentacao adicional.
              </p>
              <p className="mt-2 text-xs text-zinc-500">Campos marcados com * sao obrigatorios.</p>
            </div>
            <div className="pt-5">
              <CorporateForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
