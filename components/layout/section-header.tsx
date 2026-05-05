type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({ title, subtitle, action, align = "left" }: Props) {
  const isCenter = align === "center";

  return (
    <div
      className={[
        "mb-5 flex flex-wrap gap-3",
        isCenter ? "items-center justify-center text-center" : "items-end justify-between",
      ].join(" ")}
    >
      <div className={isCenter ? "w-full" : undefined}>
        <h2 className="text-2xl font-bold text-[color:var(--brand-900)] dark:text-white">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-600 dark:text-white/80">{subtitle}</p>}
      </div>
      {action && (
        <div className={isCenter ? "w-full" : undefined}>
          {action}
        </div>
      )}
    </div>
  );
}

