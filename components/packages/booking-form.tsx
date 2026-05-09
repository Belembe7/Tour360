"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarRange, FileText, MapPin, UserRound, IdCard, Briefcase } from "lucide-react";
import { createBooking } from "@/app/pacotes/[slug]/actions";
import { downloadPackageBookingReceiptPdf } from "@/lib/pdf/package-booking-receipt";
import { formatCurrency } from "@/lib/utils";
import { bookingSchema, type BookingFormValues } from "@/lib/validations";
import type { Destination } from "@/types";

const fieldClass =
  "ui-field w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none " +
  "focus:border-[color:var(--brand-500)] focus:ring-2 focus:ring-[color:var(--brand-500)]/25 " +
  "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";

/** Modalidades pre-definidas: numero de lugares x tipo de viagem (o total e calculado no resumo). */
const PACKAGE_MODALITIES: {
  key: string;
  numTravelers: number;
  travelType: "one-way" | "round-trip";
  label: string;
}[] = (() => {
  const out: { key: string; numTravelers: number; travelType: "one-way" | "round-trip"; label: string }[] = [];
  for (const n of [1, 2, 3, 4, 5, 6, 8] as const) {
    const p = n === 1 ? "pessoa" : "pessoas";
    out.push(
      { key: `${n}|one-way`, numTravelers: n, travelType: "one-way", label: `${n} ${p} · Ida simples` },
      { key: `${n}|round-trip`, numTravelers: n, travelType: "round-trip", label: `${n} ${p} · Ida e volta` },
    );
  }
  return out;
})();

function resolveModalityKey(numTravelers: unknown, travelType: unknown): string {
  const n = Number(numTravelers) || 1;
  const tt = travelType === "round-trip" ? "round-trip" : "one-way";
  const k = `${n}|${tt}`;
  return PACKAGE_MODALITIES.some((m) => m.key === k) ? k : "1|one-way";
}

type Props = {
  packageId: string;
  packageSlug: string;
  packageName: string;
  basePrice: number;
  destinations: Destination[];
};

export function BookingForm({ packageId, packageSlug, packageName, basePrice, destinations }: Props) {
  const formId = useId();
  const [pending, startTransition] = useTransition();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageId,
      destinationId: destinations[0]?.id ?? "",
      originCity: "Beira",
      destinationCity: "Maputo",
      travelType: "one-way",
      departureDate: "",
      returnDate: "",
      numTravelers: 1,
      packageOptionLabel: PACKAGE_MODALITIES[0]?.label ?? "1 pessoa · Ida simples",
      fullName: "",
      biNumber: "",
      baggageQty: 0,
      notes: "",
    },
  });

  const travelType = useWatch({ control, name: "travelType" });
  const numTravelers = useWatch({ control, name: "numTravelers" });
  const originCity = useWatch({ control, name: "originCity" });
  const destinationCity = useWatch({ control, name: "destinationCity" });
  const isRoundTrip = travelType === "round-trip";

  const totalPrice = useMemo(() => {
    const multiplier = isRoundTrip ? 2 : 1;
    const travelers = Number(numTravelers) || 1;
    return basePrice * travelers * multiplier;
  }, [basePrice, isRoundTrip, numTravelers]);

  const nationalCities = useMemo(() => {
    const fallback = ["Beira", "Maputo", "Nampula", "Lichinga", "Vilankulo"];
    const seeded = destinations
      .filter((d) => d.is_national)
      .map((d) => d.name)
      .filter((name) => !name.includes(" - "));
    const unique = Array.from(new Set([...fallback, ...seeded]));
    return unique.sort((a, b) => a.localeCompare(b, "pt"));
  }, [destinations]);

  const routeNameToId = useMemo(() => {
    const map = new Map<string, string>();
    for (const d of destinations) {
      map.set(d.name, d.id);
    }
    return map;
  }, [destinations]);

  const computedRouteLabel = useMemo(() => {
    const o = (originCity || "").trim();
    const d = (destinationCity || "").trim();
    if (!o || !d) return "";
    return `${o} - ${d}`;
  }, [originCity, destinationCity]);

  useEffect(() => {
    if (!computedRouteLabel) return;
    const routeId = routeNameToId.get(computedRouteLabel);
    if (routeId) {
      setValue("destinationId", routeId, { shouldValidate: true });
      return;
    }
    // fallback: if a route row doesn't exist, try destination city row
    const destId = routeNameToId.get(destinationCity ?? "");
    if (destId) setValue("destinationId", destId, { shouldValidate: true });
  }, [computedRouteLabel, routeNameToId, setValue, destinationCity]);

  function onSubmit(values: BookingFormValues) {
    setServerMessage(null);
    setSuccess(false);

    startTransition(async () => {
      const destinationId = routeNameToId.get(`${values.originCity} - ${values.destinationCity}`) ?? values.destinationId;
      const parsed = bookingSchema.safeParse({ ...values, packageId, destinationId });
      if (!parsed.success) {
        setServerMessage(parsed.error.issues[0]?.message ?? "Dados invalidos.");
        return;
      }

      const result = await createBooking({ ...parsed.data, packageId, totalPrice });

      if (result.error) {
        setServerMessage(result.error);
        return;
      }

      const bookingId = "bookingId" in result ? result.bookingId : undefined;
      if (bookingId) {
        try {
          await downloadPackageBookingReceiptPdf({
            bookingId,
            packageName,
            destinationName: `${parsed.data.originCity.trim()} - ${parsed.data.destinationCity.trim()}`,
            departureDate: parsed.data.departureDate,
            returnDate: parsed.data.travelType === "round-trip" ? (parsed.data.returnDate ?? null) : null,
            travelers: parsed.data.numTravelers,
            modalityLabel: parsed.data.packageOptionLabel,
            totalPrice,
            status: "pendente",
            paymentStatus: "aguardando",
            passengerName: parsed.data.fullName.trim(),
            passengerBi: parsed.data.biNumber.trim(),
          });
        } catch {
          // PDF e opcional; a reserva ja foi criada
        }
      }

      setSuccess(true);
      setServerMessage("Reserva criada com sucesso. O comprovativo em PDF foi descarregado.");
      reset({
        packageId,
        destinationId: destinations[0]?.id ?? "",
        originCity: "Beira",
        destinationCity: "Maputo",
        travelType: "one-way",
        departureDate: "",
        returnDate: "",
        numTravelers: 1,
        packageOptionLabel: PACKAGE_MODALITIES[0]?.label ?? "1 pessoa · Ida simples",
        fullName: "",
        biNumber: "",
        baggageQty: 0,
        notes: "",
      });
    });
  }

  if (destinations.length === 0) {
    return (
      <div
        className="mt-6 rounded-xl border border-[color:var(--brand-500)]/25 bg-[color:var(--brand-50)] p-4 ring-1 ring-[color:var(--brand-500)]/10"
        role="alert"
      >
        <p className="text-sm text-[color:var(--brand-900)]">
          Ainda nao ha destinos cadastrados. Adicione destinos na base de dados para activar o formulario de reserva.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5 rounded-2xl border border-[color:var(--brand-500)]/20 bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-500)]/10 md:p-5">
        <h2 className="text-base font-bold text-[color:var(--brand-900)]">Como preencher</h2>
        <ol className="mt-2 list-inside list-decimal space-y-1.5 text-sm leading-relaxed text-zinc-700">
          <li>
            <strong className="font-semibold text-[color:var(--brand-800)]">Destino</strong> — escolha partida e
            chegada; a rota seleccionada actualiza-se em baixo.
          </li>
          <li>
            <strong className="font-semibold text-[color:var(--brand-800)]">Opcao do pacote</strong> — lugares e se e
            ida simples ou ida e volta; o total estimado actualiza-se automaticamente.
          </li>
          <li>
            <strong className="font-semibold text-[color:var(--brand-800)]">Datas e dados</strong> — partida,
            regresso se aplicavel, nome e BI; ao confirmar recebe o comprovativo em PDF.
          </li>
        </ol>
        <p className="mt-3 text-xs text-zinc-500">
          Todos os campos obrigatorios estao assinalados. O resumo em baixo mostra o total estimado antes de confirmar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ui-surface-lift space-y-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-zinc-900/5 md:p-6"
        aria-label="Dados da reserva"
        id={formId}
      >
        <h2 className="text-lg font-bold text-[color:var(--brand-900)]">Dados da reserva</h2>
        <input type="hidden" value={packageId} {...register("packageId")} />
        <input type="hidden" {...register("destinationId")} />
        <input type="hidden" {...register("packageOptionLabel")} />

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <MapPin className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">1. Destino</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor={`${formId}-from`} className="text-xs font-semibold text-zinc-800">
                Local de partida <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-from-hint`}>
                De onde esta a sair (ex.: Beira).
              </p>
              <select id={`${formId}-from`} className={fieldClass} aria-describedby={`${formId}-from-hint`} {...register("originCity")}>
                {nationalCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.originCity && <p className="text-xs text-red-600">{errors.originCity.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${formId}-to`} className="text-xs font-semibold text-zinc-800">
                Destino <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-to-hint`}>
                Para onde vai (ex.: Maputo).
              </p>
              <select id={`${formId}-to`} className={fieldClass} aria-describedby={`${formId}-to-hint`} {...register("destinationCity")}>
                {nationalCities
                  .filter((c) => c !== originCity)
                  .map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {errors.destinationCity && <p className="text-xs text-red-600">{errors.destinationCity.message}</p>}
            </div>
          </div>

          <div className="rounded-xl border border-[color:var(--brand-500)]/15 bg-[color:var(--brand-50)]/60 p-3 ring-1 ring-[color:var(--brand-500)]/10">
            <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--brand-800)]">Rota seleccionada</p>
            <p className="mt-1 text-sm font-semibold text-[color:var(--brand-900)]">{computedRouteLabel || "—"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <UserRound className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">2. Opcao do pacote</h3>
          </div>
          <div className="space-y-1.5 sm:max-w-xl">
            <label htmlFor={`${formId}-mod`} className="text-xs font-semibold text-zinc-800">
              Lugares e tipo de viagem <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500" id={`${formId}-mod-hint`}>
              O total estimado usa o preco base do pacote, o numero de lugares e o dobro do valor em ida e volta.
            </p>
            <select
              id={`${formId}-mod`}
              className={fieldClass}
              aria-describedby={`${formId}-mod-hint`}
              value={resolveModalityKey(numTravelers, travelType)}
              onChange={(e) => {
                const m = PACKAGE_MODALITIES.find((x) => x.key === e.target.value);
                if (!m) return;
                setValue("numTravelers", m.numTravelers, { shouldValidate: true, shouldDirty: true });
                setValue("travelType", m.travelType, { shouldValidate: true, shouldDirty: true });
                setValue("packageOptionLabel", m.label, { shouldValidate: true, shouldDirty: true });
              }}
            >
              {PACKAGE_MODALITIES.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
            {(errors.numTravelers || errors.travelType) && (
              <p className="text-xs text-red-600">
                {errors.numTravelers?.message ?? errors.travelType?.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <CalendarRange className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">3. Datas</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor={`${formId}-dep`} className="text-xs font-semibold text-zinc-800">
                Data de partida <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-dep-hint`}>
                Dia em que a viagem (ou o primeiro percurso) comeca.
              </p>
              <input
                id={`${formId}-dep`}
                type="date"
                className={fieldClass}
                aria-describedby={`${formId}-dep-hint`}
                {...register("departureDate")}
              />
              {errors.departureDate && (
                <p className="text-xs text-red-600">{errors.departureDate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor={`${formId}-ret`} className="text-xs font-semibold text-zinc-800">
                Data de regresso {isRoundTrip && <span className="text-red-600">*</span>}
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-ret-hint`}>
                {isRoundTrip
                  ? "Obrigatoria quando a viagem e ida e volta."
                  : "Nao aplica a viagem so de ida. Escolha Ida e volta em cima se precisar."}
              </p>
              <input
                id={`${formId}-ret`}
                type="date"
                disabled={!isRoundTrip}
                className={fieldClass}
                aria-describedby={`${formId}-ret-hint`}
                {...register("returnDate")}
              />
              {errors.returnDate && (
                <p className="text-xs text-red-600">{errors.returnDate.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <IdCard className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">4. Dados pessoais</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor={`${formId}-full`} className="text-xs font-semibold text-zinc-800">
                Nome completo <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-full-hint`}>
                Como consta no documento de identificacao.
              </p>
              <input
                id={`${formId}-full`}
                className={fieldClass}
                placeholder="Ex.: Elton Mateus"
                aria-describedby={`${formId}-full-hint`}
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${formId}-bi`} className="text-xs font-semibold text-zinc-800">
                Nr de BI <span className="text-red-600">*</span>
              </label>
              <p className="text-xs text-zinc-500" id={`${formId}-bi-hint`}>
                Apenas para facilitar a confirmacao da reserva (nao exibimos publicamente).
              </p>
              <input
                id={`${formId}-bi`}
                className={fieldClass}
                placeholder="Ex.: 1101020XXXXB"
                aria-describedby={`${formId}-bi-hint`}
                {...register("biNumber")}
              />
              {errors.biNumber && <p className="text-xs text-red-600">{errors.biNumber.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <Briefcase className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">5. Bagagem (opcional)</h3>
          </div>
          <div className="space-y-1.5 sm:max-w-md">
            <label htmlFor={`${formId}-bag`} className="text-xs font-semibold text-zinc-800">
              Quantidade de bagagem
            </label>
            <p className="text-xs text-zinc-500" id={`${formId}-bag-hint`}>
              Ex.: 0 = sem bagagem extra, 1 = 1 mala, 2 = 2 malas.
            </p>
            <input
              id={`${formId}-bag`}
              type="number"
              min={0}
              className={fieldClass}
              aria-describedby={`${formId}-bag-hint`}
              {...register("baggageQty")}
            />
            {errors.baggageQty && <p className="text-xs text-red-600">{errors.baggageQty.message}</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-100 pb-2">
            <FileText className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
            <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">6. Observacoes (opcional)</h3>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${formId}-notes`} className="text-xs font-semibold text-zinc-800">
              Notas ou pedidos especiais
            </label>
            <p className="text-xs text-zinc-500" id={`${formId}-notes-hint`}>
              Ex.: alimentacao, mobilidade, horario preferido. A equipa podera contactar para alinhar.
            </p>
            <textarea
              id={`${formId}-notes`}
              rows={3}
              className={fieldClass}
              placeholder="Escreva aqui se tiver requisitos ou duvidas"
              aria-describedby={`${formId}-notes-hint`}
              {...register("notes")}
            />
          </div>
        </div>

        <div className="rounded-xl border border-[color:var(--brand-500)]/25 bg-gradient-to-br from-[color:var(--brand-50)] to-white p-4 ring-1 ring-[color:var(--brand-500)]/10">
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--brand-800)]">Resumo</p>
          <p className="mt-1 text-sm text-zinc-700">
            Pacote: <span className="font-medium text-[color:var(--brand-900)]">{packageName}</span>{" "}
            <span className="text-zinc-500">({packageSlug})</span>
          </p>
          <p className="text-sm text-zinc-700">
            Total estimado:{" "}
            <span className="text-lg font-bold text-[color:var(--brand-800)]">
              {formatCurrency(totalPrice)}
            </span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">Valor indicativo; confirmacao e pagamento em Minhas reservas.</p>
        </div>

        {serverMessage && (
          <p
            className={`rounded-lg px-3 py-2 text-sm ${success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
            role="status"
          >
            {serverMessage}
          </p>
        )}

        {!success && (
          <p className="text-xs leading-relaxed text-zinc-600">
            Para concluir a reserva com a sua conta, inicie{" "}
            <Link
              href={`/login?next=/pacotes/${packageSlug}`}
              className="font-semibold text-[color:var(--brand-700)] underline underline-offset-2 hover:text-[color:var(--brand-900)]"
            >
              sessao (login)
            </Link>{" "}
            antes de confirmar.
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={[
            "ui-btn w-full rounded-xl bg-[color:var(--brand-900)] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto",
            pending ? "ui-btn-loading" : "",
          ].join(" ")}
        >
          {pending ? "A confirmar..." : "Confirmar reserva"}
        </button>
      </form>
    </div>
  );
}
