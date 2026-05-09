import jsPDF from "jspdf";

export type PackageBookingReceiptArgs = {
  bookingId: string;
  packageName: string;
  destinationName: string;
  departureDate: string;
  returnDate: string | null;
  travelers: number;
  /** Ex.: "4 pessoas · Ida e volta" */
  modalityLabel?: string | null;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  passengerName?: string | null;
  passengerBi?: string | null;
};

async function loadLogoDataUrl(): Promise<string> {
  const res = await fetch("/images/logo-v2.png");
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler logo."));
    reader.readAsDataURL(blob);
  });
}

function formatDatePt(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("pt-MZ", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(isoDate));
  } catch {
    return isoDate;
  }
}

/**
 * Gera e descarrega o PDF do comprovativo (mesmo layout do botao em detalhe da reserva).
 */
export async function downloadPackageBookingReceiptPdf(args: PackageBookingReceiptArgs): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const fileName = `comprovativo-${args.bookingId}.pdf`;

  const brand = { r: 10, g: 35, b: 66 };
  const accent = { r: 78, g: 168, b: 222 };
  const ink = { r: 15, g: 23, b: 42 };
  const muted = { r: 100, g: 116, b: 139 };
  const pageW = 210;
  const left = 14;
  const contentW = pageW - left * 2;

  doc.setFillColor(brand.r, brand.g, brand.b);
  doc.rect(0, 0, pageW, 38, "F");
  doc.setFillColor(accent.r, accent.g, accent.b);
  doc.rect(0, 36.5, pageW, 1.5, "F");

  try {
    const logo = await loadLogoDataUrl();
    doc.addImage(logo, "PNG", 14, 8.5, 20, 20);
  } catch {
    // Logo opcional
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("TOUR 360", 38, 16.8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.7);
  doc.text("Travel & Corporate Mobility", 38, 22.1);
  doc.setFontSize(11);
  doc.text("Comprovativo de Reserva de Pacote", 38, 29.6);

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
  doc.text(`#${args.bookingId}`, left + 26, 54.8);
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

  sectionTitle("Detalhes da viagem");
  row("Pacote", args.packageName);
  row("Destino", args.destinationName);
  row("Partida", formatDatePt(args.departureDate));
  row("Regresso", args.returnDate ? formatDatePt(args.returnDate) : "Nao aplicavel");
  if (args.modalityLabel?.trim()) row("Modalidade", args.modalityLabel.trim());
  row("Viajantes", String(args.travelers));

  if (args.passengerName || args.passengerBi) {
    y += 2;
    sectionTitle("Dados do passageiro");
    if (args.passengerName) row("Nome", args.passengerName);
    if (args.passengerBi) row("BI", args.passengerBi);
  }

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
  doc.text(`${args.totalPrice.toLocaleString("pt-MZ")} MT`, left + contentW - 4, y + 12, { align: "right" });

  y += 28.5;
  sectionTitle("Estado da reserva");
  row("Situacao", args.status);
  row("Pagamento", args.paymentStatus);

  const statusText = `${args.status} · ${args.paymentStatus}`;
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

  doc.save(fileName);
}
