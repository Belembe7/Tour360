"use client";

import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Formulario GET (via router) para filtrar o historico de reservas do caixa.
 */
export function AtendimentoHistoryFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const p = new URLSearchParams();
    const q = String(fd.get("q") ?? "").trim();
    const tipo = String(fd.get("tipo") ?? "");
    const estado = String(fd.get("estado") ?? "");
    const from = String(fd.get("from") ?? "");
    const to = String(fd.get("to") ?? "");
    if (q) p.set("q", q);
    if (tipo) p.set("tipo", tipo);
    if (estado) p.set("estado", estado);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    router.push(`/atendimento/reservas?${p.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-3 lg:grid-cols-6"
    >
      <div className="space-y-1 lg:col-span-2">
        <label className="text-xs font-semibold text-zinc-600">Pesquisar</label>
        <input
          name="q"
          defaultValue={sp.get("q") ?? ""}
          placeholder="Nome, contacto ou email"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-600">Tipo</label>
        <select
          name="tipo"
          defaultValue={sp.get("tipo") ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="viagem">Viagem</option>
          <option value="pacote">Pacote turistico</option>
          <option value="aluguer">Aluguer de viatura</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-600">Estado</label>
        <select
          name="estado"
          defaultValue={sp.get("estado") ?? ""}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Todos</option>
          <option value="pendente">Pendente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="concluida">Concluida</option>
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-600">De</label>
        <input
          type="date"
          name="from"
          defaultValue={sp.get("from") ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-zinc-600">Ate</label>
        <input
          type="date"
          name="to"
          defaultValue={sp.get("to") ?? ""}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex items-end gap-2 md:col-span-3 lg:col-span-6">
        <button
          type="submit"
          className="rounded-lg bg-[#0A2342] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#143a6b]"
        >
          Aplicar filtros
        </button>
        <button
          type="button"
          onClick={() => router.push("/atendimento/reservas")}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
