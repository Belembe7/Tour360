type Props = {
  title: string;
  value: string;
  subtitle?: string;
};

export function StatsCard({ title, value, subtitle }: Props) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-zinc-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[#0A2342]">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
    </article>
  );
}
