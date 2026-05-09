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
    const margin = 14;
    const pageW = 210;
    const maxW = pageW - margin * 2;
    const brand = { r: 10, g: 35, b: 66 };
    const accent = { r: 78, g: 168, b: 222 };
    const muted = { r: 100, g: 116, b: 139 };
    const ink = { r: 15, g: 23, b: 42 };

    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.rect(0, 36.5, pageW, 1.5, "F");

    let y = 16.8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text(payload.agencyName || "TOUR 360", margin, y);
    y += 5.3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.7);
    doc.text("Travel & Corporate Mobility", margin, y);
    y += 7.4;
    doc.setFontSize(11);
    doc.text("Comprovativo de Reserva (Atendimento)", margin, y);

    doc.setFillColor(245, 249, 255);
    doc.roundedRect(margin, 46, maxW, 14, 2.5, 2.5, "F");
    doc.setDrawColor(208, 224, 244);
    doc.roundedRect(margin, 46, maxW, 14, 2.5, 2.5, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.text("Registo", margin + 4, 54.8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(ink.r, ink.g, ink.b);
    doc.text(new Date(payload.bookingCreatedAt).toLocaleString("pt-MZ"), margin + 24, 54.8);
    doc.setTextColor(muted.r, muted.g, muted.b);
    doc.text(`Emitido em ${new Date().toLocaleString("pt-MZ")}`, margin + maxW - 4, 54.8, { align: "right" });

    y = 68;
    const sectionTitle = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(brand.r, brand.g, brand.b);
      doc.text(title, margin, y);
      y += 2.8;
      doc.setDrawColor(219, 234, 254);
      doc.line(margin, y, margin + maxW, y);
      y += 6;
    };

    const row = (label: string, value: string) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(muted.r, muted.g, muted.b);
      doc.text(label, margin, y);
      doc.setTextColor(ink.r, ink.g, ink.b);
      const wrapped = doc.splitTextToSize(value, maxW - 48);
      doc.text(wrapped, margin + 46, y);
      y += Math.max(6.8, wrapped.length * 4.5 + 1.8);
    };

    const tipo = RESERVATION_TYPE_LABELS[payload.reservationType] ?? payload.reservationType;
    sectionTitle("Dados do cliente");
    row("Nome", payload.clientName);
    row("Contacto", payload.clientContact);
    row("Email", payload.clientEmail);

    y += 1.5;
    sectionTitle("Detalhes da reserva");
    row("Tipo", tipo);
    row("Destino / viatura", payload.destinationOrVehicle);
    row("Data de ida", payload.departureDate);
    row("Data de volta", payload.returnDate ?? "Nao aplicavel");
    row("Pessoas", String(payload.numTravelers));
    row("Registado por", payload.staffName);

    y += 2.8;
    doc.setDrawColor(accent.r, accent.g, accent.b);
    doc.setFillColor(235, 247, 255);
    doc.roundedRect(margin, y, maxW, 19, 3, 3, "FD");
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total da reserva", margin + 4, y + 11.6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.setTextColor(80, 104, 130);
    doc.text("Valor estimado no momento da emissao", margin + 4, y + 15.9);
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFontSize(14);
    doc.text(formatCurrency(payload.totalPrice), margin + maxW - 4, y + 12, { align: "right" });

    y += 28.5;
    sectionTitle("Estado");
    row("Situacao", payload.status);

    const pillText = payload.status;
    const pillW = Math.min(80, Math.max(36, doc.getTextWidth(pillText) + 14));
    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.roundedRect(margin, y + 1.2, pillW, 8.2, 4.2, 4.2, "F");
    doc.setFontSize(9.2);
    doc.setTextColor(255, 255, 255);
    doc.text(pillText, margin + pillW / 2, y + 6.55, { align: "center" });

    if (payload.observations) {
      y += 14;
      sectionTitle("Observacoes");
      row("Nota", payload.observations);
    }

    doc.setDrawColor(230, 237, 246);
    doc.line(margin, 283, margin + maxW, 283);
    doc.setTextColor(muted.r, muted.g, muted.b);
    doc.setFontSize(8.8);
    doc.text("TOUR 360 · Qualidade, seguranca e conforto", margin, 288);
    doc.text("Documento digital valido sem assinatura manual", margin + maxW, 288, { align: "right" });

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
