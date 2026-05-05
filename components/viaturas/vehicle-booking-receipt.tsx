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
    const doc = new jsPDF();

    const brand = { r: 10, g: 35, b: 66 }; // #0A2342
    const accent = { r: 78, g: 168, b: 222 }; // #4EA8DE

    doc.setFillColor(brand.r, brand.g, brand.b);
    doc.rect(0, 0, 210, 36, "F");
    doc.setFillColor(accent.r, accent.g, accent.b);
    doc.rect(0, 34.5, 210, 1.5, "F");

    try {
      const logo = await loadLogoDataUrl();
      doc.addImage(logo, "PNG", 16, 9, 18, 18);
    } catch {
      // optional
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("TOUR 360", 38, 18);
    doc.setFontSize(11);
    doc.text("Comprovativo de Reserva (Viatura)", 38, 27);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);

    let y = 52;
    const left = 16;
    const labelColor = [100, 116, 139] as const;

    function row(label: string, value: string) {
      doc.setTextColor(...labelColor);
      doc.text(label, left, y);
      doc.setTextColor(17, 24, 39);
      doc.text(value, left + 44, y);
      y += 8;
    }

    row("Reserva", props.bookingId);
    row("Viatura", props.vehicleModel);
    row("Destino", props.destination || "—");
    row("Inicio", formatDatePt(props.startDate));
    row("Fim", formatDatePt(props.endDate));
    row("Dias", String(props.totalDays));

    y += 4;
    doc.setDrawColor(accent.r, accent.g, accent.b);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(left, y, 210 - left * 2, 18, 3, 3, "FD");
    doc.setTextColor(brand.r, brand.g, brand.b);
    doc.setFontSize(12);
    doc.text("Total", left + 4, y + 12);
    doc.setFontSize(14);
    doc.text(`${props.totalPrice.toLocaleString("pt-MZ")} MT`, 210 - left - 4, y + 12, { align: "right" });

    y += 28;
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    row("Estado", props.status);
    if (props.paymentStatus) row("Pagamento", props.paymentStatus);
    if (props.paymentReference) row("Referencia", props.paymentReference);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(9.5);
    doc.text("Obrigado por escolher a TOUR 360.", left, 285);
    doc.text(`Documento gerado em ${new Date().toLocaleString("pt-MZ")}`, 210 - left, 285, { align: "right" });

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

