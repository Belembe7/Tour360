"use client";

import { downloadPackageBookingReceiptPdf } from "@/lib/pdf/package-booking-receipt";

type Props = {
  bookingId: string;
  packageName: string;
  destinationName: string;
  departureDate: string;
  returnDate: string | null;
  travelers: number;
  modalityLabel?: string | null;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  passengerName?: string | null;
  passengerBi?: string | null;
};

export function BookingReceiptButton(props: Props) {
  async function downloadReceipt() {
    await downloadPackageBookingReceiptPdf({
      bookingId: props.bookingId,
      packageName: props.packageName,
      destinationName: props.destinationName,
      departureDate: props.departureDate,
      returnDate: props.returnDate,
      travelers: props.travelers,
      modalityLabel: props.modalityLabel,
      totalPrice: props.totalPrice,
      status: props.status,
      paymentStatus: props.paymentStatus,
      passengerName: props.passengerName,
      passengerBi: props.passengerBi,
    });
  }

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
