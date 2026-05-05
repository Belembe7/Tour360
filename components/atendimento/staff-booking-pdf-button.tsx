"use client";

import { jsPDF } from "jspdf";
import { FileDown } from "lucide-react";
import { RESERVATION_TYPE_LABELS } from "@/lib/atendimento/labels";
import { formatCurrency } from "@/lib/utils";

export type StaffBookingPdfPayload = {
  agencyName: string;
  clientName: string;
  clientContact: string;
  clientEmail: string;
  reservationType: "pacote" | "viagem" | "aluguer";
  destinationOrVehicle: string;
  departureDate: string;
  returnDate: string | null;
  numTravelers: number;
  observations: string | null;
  bookingCreatedAt: string;
  totalPrice: number;
  status: string;
  staffName: string;
};

/**
 * Gera PDF da reserva (jsPDF) com dados da agencia, cliente, tipo e funcionario.
 */
export function StaffBookingPdfButton({ payload }: { payload: StaffBookingPdfPayload }) {
  function download() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 18;
    let y = 22;
    const maxW = 175;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(payload.agencyName, margin, y);
    y += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Comprovativo de reserva (atendimento)", margin, y);
    y += 12;

    doc.setDrawColor(200);
    doc.line(margin, y, margin + maxW, y);
    y += 10;

    const tipo = RESERVATION_TYPE_LABELS[payload.reservationType] ?? payload.reservationType;
    const lines: string[] = [
      `Cliente: ${payload.clientName}`,
      `Contacto: ${payload.clientContact}`,
      `Email: ${payload.clientEmail}`,
      `Tipo de reserva: ${tipo}`,
      `Destino / viatura: ${payload.destinationOrVehicle}`,
      `Data de ida: ${payload.departureDate}`,
      `Data de volta: ${payload.returnDate ?? "—"}`,
      `Pessoas: ${payload.numTravelers}`,
      `Data do registo: ${payload.bookingCreatedAt}`,
      `Valor total: ${formatCurrency(payload.totalPrice)}`,
      `Estado: ${payload.status}`,
      `Registado por: ${payload.staffName}`,
    ];
    if (payload.observations) {
      lines.push("", "Observacoes:", payload.observations);
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const raw of lines) {
      const wrapped = doc.splitTextToSize(raw, maxW);
      if (y + wrapped.length * 5 > 285) {
        doc.addPage();
        y = 22;
      }
      doc.text(wrapped, margin, y);
      y += wrapped.length * 5 + 1;
    }

    doc.save(`reserva-${payload.clientName.replace(/\s+/g, "-").slice(0, 24)}.pdf`);
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-[#0A2342] shadow-sm transition hover:bg-sky-50"
    >
      <FileDown className="h-4 w-4" aria-hidden />
      Gerar PDF
    </button>
  );
}
