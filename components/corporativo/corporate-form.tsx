"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Handshake, UserCircle2, Wallet } from "lucide-react";
import { submitCorporateForm } from "@/app/corporativo/actions";
import { corporateSchema, type CorporateFormValues } from "@/lib/validations";

const controlClass =
  "ui-field w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 " +
  "placeholder:text-zinc-400 focus:border-[color:var(--brand-500)] focus:outline-none focus:ring-2 " +
  "focus:ring-[color:var(--brand-500)]/25";

const fieldClass = "mt-1.5 " + controlClass;

export function CorporateForm() {
  const id = useId();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CorporateFormValues>({
    resolver: zodResolver(corporateSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      companyName: "",
      nuit: "",
      contactPerson: "",
      paymentModality: "antecipado",
      creditLimit: 0,
    },
  });

  function onSubmit(values: CorporateFormValues) {
    setMessage(null);
    setSuccess(false);
    startTransition(async () => {
      const parsed = corporateSchema.safeParse(values);
      if (!parsed.success) {
        setMessage(parsed.error.issues[0]?.message ?? "Dados invalidos.");
        return;
      }

      const result = await submitCorporateForm(parsed.data);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      setSuccess(true);
      setMessage("Ficha corporativa submetida com sucesso. Entraremos em contacto em breve.");
      reset();
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <UserCircle2 className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">Responsavel e contacto</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-name`} className="text-xs font-semibold text-zinc-800">
              Nome completo <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Titular do pedido ou director de viagens / RH.</p>
            <input
              id={`${id}-name`}
              className={fieldClass}
              placeholder="Ex.: Joao Manuel Capila"
              autoComplete="name"
              {...register("fullName")}
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-phone`} className="text-xs font-semibold text-zinc-800">
              Telefone <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Comercial ou estacionario — preferencia com indicativo.</p>
            <input
              id={`${id}-phone`}
              className={fieldClass}
              placeholder="+258 84 000 0000"
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <Building2 className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">Dados da empresa</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor={`${id}-company`} className="text-xs font-semibold text-zinc-800">
              Designacao social / nome comercial <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Nome de facturacao tal como consta do NUIT.</p>
            <input
              id={`${id}-company`}
              className={fieldClass}
              placeholder="Ex.: Empresa XYZ, Limitada"
              autoComplete="organization"
              {...register("companyName")}
            />
            {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-nuit`} className="text-xs font-semibold text-zinc-800">
              NUIT <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Numero de identificacao fiscal em Mocambique.</p>
            <input
              id={`${id}-nuit`}
              className={fieldClass}
              placeholder="Ex.: 400123456"
              inputMode="numeric"
              {...register("nuit")}
            />
            {errors.nuit && <p className="mt-1 text-xs text-red-600">{errors.nuit.message}</p>}
          </div>
          <div>
            <label htmlFor={`${id}-contact`} className="text-xs font-semibold text-zinc-800">
              Pessoa de contacto (operacional) <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Quem acompanha reservas e confirmacoes no dia a dia.</p>
            <input
              id={`${id}-contact`}
              className={fieldClass}
              placeholder="Ex.: Maria dos Santos"
              {...register("contactPerson")}
            />
            {errors.contactPerson && (
              <p className="mt-1 text-xs text-red-600">{errors.contactPerson.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <Wallet className="h-5 w-5 shrink-0 text-[color:var(--brand-700)]" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-800">Condicoes comerciais</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-mod`} className="text-xs font-semibold text-zinc-800">
              Modalidade de pagamento <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Antecipado: liquida antes da prestacao. Postecipado: acordado com limite.</p>
            <div className="mt-1.5 flex items-center gap-2">
              <Handshake className="h-4 w-4 shrink-0 self-center text-zinc-400" aria-hidden />
              <select id={`${id}-mod`} className={`min-w-0 flex-1 ${controlClass}`} {...register("paymentModality")}>
                <option value="antecipado">Antecipado (pagamento antes do servico)</option>
                <option value="postecipado">Postecipado (pagamento apos faturacao acordada)</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={`${id}-limit`} className="text-xs font-semibold text-zinc-800">
              Limite de credito (MT) <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-zinc-500">Tecto de referencia para aprovacao interna. Use 0 se nao aplicavel.</p>
            <input
              id={`${id}-limit`}
              type="number"
              min={0}
              className={fieldClass}
              placeholder="0"
              {...register("creditLimit")}
            />
          </div>
        </div>
      </div>

      {message && (
        <p
          className={`rounded-lg px-3 py-2.5 text-sm ${success ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}
          role="status"
        >
          {message}
        </p>
      )}

      {!success && (
        <p className="text-xs leading-relaxed text-zinc-600">
          E necessario ter sessao na TOUR 360.{" "}
          <Link
            href="/login?next=/corporativo"
            className="font-semibold text-[color:var(--brand-700)] underline underline-offset-2 hover:text-[color:var(--brand-900)]"
          >
            Iniciar sessao
          </Link>{" "}
          antes de submeter.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[color:var(--brand-900)] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[color:var(--brand-700)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "A enviar..." : "Submeter ficha para validacao"}
      </button>
    </form>
  );
}
