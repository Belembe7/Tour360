import Link from "next/link";
import {
  CalendarRange,
  CheckCircle2,
  Headphones,
  UserRound,
} from "lucide-react";

const STEPS = [
  {
    step: 1,
    title: "Escolha e datas",
    text: "Seleccione a viatura, o destino e o intervalo de datas (inicio e fim contam como dias completos).",
    icon: CalendarRange,
  },
  {
    step: 2,
    title: "Total estimado",
    text: "O sistema multiplica dias pela tarifa diaria do modelo — ve o valor antes de confirmar.",
    icon: CheckCircle2,
  },
  {
    step: 3,
    title: "Confirme a reserva",
    text: "Submeta o formulario sem conta; pode pagar com M-Pesa (simulado) e descarregar o comprovativo em PDF.",
    icon: UserRound,
  },
  {
    step: 4,
    title: "Uso e suporte",
    text: "Ideal para turismo, transfer e deslocacoes de equipa; duvidas pelo contacto ou area do cliente.",
    icon: Headphones,
  },
] as const;

type VehicleHowItWorksAsideProps = {
  /** Link do botao final (ex.: #reservar-viatura ou /viaturas#reservar-viatura) */
  ctaHref?: string;
  ctaLabel?: string;
};

export function VehicleHowItWorksAside({
  ctaHref = "/viaturas#reservar-viatura",
  ctaLabel = "Ir para o formulario de reserva",
}: VehicleHowItWorksAsideProps) {
  return (
    <aside className="ui-reveal rounded-3xl border border-white/60 bg-gradient-to-br from-[color:var(--brand-50)] via-white to-cyan-50/40 p-5 shadow-[0_16px_40px_-18px_rgba(10,35,66,0.35)] ring-1 ring-[color:var(--brand-500)]/15 lg:col-span-4 lg:sticky lg:top-24">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-800)]">Como funciona</p>
      <h3 className="mt-2 text-base font-bold leading-snug text-[color:var(--brand-900)]">
        Servicos de viatura em resumo
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-zinc-600">
        Aluguer por dia com tarifa fixa publicada. Reserve online sem criar conta.
      </p>
      <ol className="mt-5 space-y-3.5">
        {STEPS.map((item) => (
          <li
            key={item.step}
            className="group flex gap-3 rounded-xl border border-transparent p-2 transition hover:border-[color:var(--brand-500)]/20 hover:bg-white/80"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[11px] font-bold text-[color:var(--brand-700)] shadow-sm ring-1 ring-zinc-200/80">
              {item.step}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                <item.icon
                  className="h-3.5 w-3.5 shrink-0 text-[color:var(--brand-700)] transition group-hover:scale-110"
                  aria-hidden
                />
                {item.title}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link
        href={ctaHref}
        className="ui-btn mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--brand-900)] px-3 py-2.5 text-center text-xs font-semibold text-white transition hover:bg-[color:var(--brand-700)]"
      >
        {ctaLabel}
      </Link>
    </aside>
  );
}
