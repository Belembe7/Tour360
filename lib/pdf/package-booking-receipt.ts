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

/**
 * Gera e descarrega o PDF do comprovativo (mesmo layout do botao em detalhe da reserva).
 */
export async function downloadPackageBookingReceiptPdf(args: PackageBookingReceiptArgs): Promise<void> {
  const doc = new jsPDF();
  const fileName = `comprovativo-${args.bookingId}.pdf`;

  const brand = { r: 10, g: 35, b: 66 };
  const accent = { r: 78, g: 168, b: 222 };

  doc.setFillColor(brand.r, brand.g, brand.b);
  doc.rect(0, 0, 210, 36, "F");
  doc.setFillColor(accent.r, accent.g, accent.b);
  doc.rect(0, 34.5, 210, 1.5, "F");

  try {
    const logo = await loadLogoDataUrl();
    doc.addImage(logo, "PNG", 16, 9, 18, 18);
  } catch {
    // Logo opcional
  }

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text("TOUR 360", 38, 18);
  doc.setFontSize(11);
  doc.text("Comprovativo de Reserva", 38, 27);

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

  row("Reserva", args.bookingId);
  row("Pacote", args.packageName);
  row("Destino", args.destinationName);
  row("Partida", args.departureDate);
  row("Regresso", args.returnDate ?? "N/A");
  if (args.modalityLabel?.trim()) {
    row("Modalidade", args.modalityLabel.trim());
  }
  row("Viajantes", String(args.travelers));

  if (args.passengerName) row("Nome", args.passengerName);
  if (args.passengerBi) row("Nr de BI", args.passengerBi);

  y += 4;
  doc.setDrawColor(accent.r, accent.g, accent.b);
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(left, y, 210 - left * 2, 18, 3, 3, "FD");
  doc.setTextColor(brand.r, brand.g, brand.b);
  doc.setFontSize(12);
  doc.text("Total", left + 4, y + 12);
  doc.setFontSize(14);
  doc.text(`${args.totalPrice.toLocaleString("pt-MZ")} MT`, 210 - left - 4, y + 12, { align: "right" });

  y += 28;
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  row("Estado", args.status);
  row("Pagamento", args.paymentStatus);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9.5);
  doc.text("Obrigado por escolher a TOUR 360.", left, 285);
  doc.text(`Documento gerado em ${new Date().toLocaleString("pt-MZ")}`, 210 - left, 285, { align: "right" });

  doc.save(fileName);
}
