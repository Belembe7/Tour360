"use client";

import jsPDF from "jspdf";
import { useEffect, useRef } from "react";

type Props = {
  bookingId: string;
  vehicleModel: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  paymentReference?: string | null;
  paymentStatus?: string | null;
  /** Quando mudar, faz auto-download 1 vez por valor. */
  autoDownloadKey?: string | null;
};

function formatDatePt(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("pt-MZ", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(isoDate),
    );
  } catch {
    return isoDate;
  }
}

function paymentLabel(status?: string | null) {
  if (!status) return "nao informado";
  return status;
}

export function VehicleBookingReceipt(props: Props) {
  const lastAutoKey = useRef<string | null>(null);

  async function loadLogoDataUrl() {
    const res = await fetch("/images/logo-v2.png");
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Falha ao ler logo."));
      reader.readAsDataURL(blob);
    });
    return dataUrl;
  }

  async function downloadReceipt() {
    const doc = new jsPDF({ unit: "mm", format: "a4" });

    const brand = { r: 10, g: 35, b: 66 }; // #0A2342
    const accent = { r: 78, g: 168, b: 222 }; // #4EA8DE
    const ink = { r: 15, g: 23, b: 42 };
    const muted = { r: 100, g: 116, b: 139 };
    const left = 14;
    const pageW = 210;
    const contentW = pageW - left * 2;

    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.rect(0, 36.5, pageW, 1.5, "F");

    try {
      const logo = await loadLogoDataUrl();
      doc.addImage(logo, "PNG", 14, 8.5, 20, 20);
    } catch {
      // optional
    }

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("TOUR 360", 38, 16.8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.7);
    doc.text("Travel & Corporate Mobility", 38, 22.1);
    doc.setFontSize(11);
    doc.text("Comprovativo de Reserva de Viatura", 38, 29.6);

    doc.setFillColor(245, 249, 255);
    doc.roundedRect(left, 46, contentW, 14, 2.5, 2.5, "F");
    doc.setDrawColor(208, 224, 244);
    doc.roundedRect(left, 46, contentW, 14, 2.5, 2.5, "S");
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Reserva", left + 4, 54.8);
    doc.setTextColor(ink.r, ink.g, ink.b);
    doc.setFont("helvetica", "normal");
    doc.text(`#${props.bookingId}`, left + 26, 54.8);
    doc.setTextColor(muted.r, muted.g, muted.b);
    doc.text(`Emitido em ${new Date().toLocaleString("pt-MZ")}`, left + contentW - 4, 54.8, { align: "right" });

    let y = 68;
    function sectionTitle(title: string) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(brand.r, brand.g, brand.b);
      doc.text(title, left, y);
      y += 2.8;
      doc.setDrawColor(219, 234, 254);
      doc.line(left, y, left + contentW, y);
      y += 6;
    }

    function row(label: string, value: string) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(muted.r, muted.g, muted.b);
      doc.text(label, left, y);
      doc.setTextColor(ink.r, ink.g, ink.b);
      doc.text(value, left + 46, y);
      y += 6.8;
    }

    sectionTitle("Detalhes da mobilidade");
    row("Viatura", props.vehicleModel);
    row("Destino", props.destination || "—");
    row("Inicio", formatDatePt(props.startDate));
    row("Fim", formatDatePt(props.endDate));
    row("Dias", String(props.totalDays));

    y += 3.5;
    doc.setDrawColor(accent.r, accent.g, accent.b);
    doc.setFillColor(235, 247, 255);
    doc.roundedRect(left, y, contentW, 19, 3, 3, "FD");
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total da reserva", left + 4, y + 11.6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.2);
    doc.setTextColor(80, 104, 130);
    doc.text("Valor estimado no momento da emissao", left + 4, y + 15.9);
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFontSize(14);
    doc.text(`${props.totalPrice.toLocaleString("pt-MZ")} MT`, left + contentW - 4, y + 12, { align: "right" });

    y += 28.5;
    sectionTitle("Estado da reserva");
    row("Estado", props.status);
    if (props.paymentStatus) row("Pagamento", props.paymentStatus);
    if (props.paymentReference) row("Referencia", props.paymentReference);

    const statusText = `${props.status} · ${paymentLabel(props.paymentStatus)}`;
    const pillW = Math.min(100, Math.max(42, doc.getTextWidth(statusText) + 14));
    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.roundedRect(left, y + 2, pillW, 8.2, 4.2, 4.2, "F");
    doc.setFontSize(9.2);
    doc.setTextColor(255, 255, 255);
    doc.text(statusText, left + pillW / 2, y + 7.35, { align: "center" });

    doc.setDrawColor(230, 237, 246);
    doc.line(left, 283, left + contentW, 283);
    doc.setTextColor(muted.r, muted.g, muted.b);
    doc.setFontSize(8.8);
    doc.text("TOUR 360 · Qualidade, seguranca e conforto", left, 288);
    doc.text("Documento digital valido sem assinatura manual", left + contentW, 288, { align: "right" });

    doc.save(`comprovativo-viatura-${props.bookingId}.pdf`);
  }

  useEffect(() => {
    const key = props.autoDownloadKey ?? null;
    if (!key) return;
    if (lastAutoKey.current === key) return;
    lastAutoKey.current = key;
    void downloadReceipt();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- PDF content intentionally bound to latest props
  }, [props.autoDownloadKey]);

  return (
    <button
      type="button"
      onClick={() => void downloadReceipt()}
      className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      Baixar comprovativo (PDF)
    </button>
  );
}

