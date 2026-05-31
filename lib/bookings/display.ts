export type BookingClientFields = {
  client_name: string | null;
  client_contact?: string | null;
  client_email?: string | null;
  notes: string | null;
};

export function getBookingClientLabel(booking: BookingClientFields): string {
  const direct = booking.client_name?.trim();
  if (direct) return direct;
  if (booking.notes) {
    try {
      const j = JSON.parse(booking.notes) as { passenger?: { fullName?: string } };
      const fromNotes = j.passenger?.fullName?.trim();
      if (fromNotes) return fromNotes;
    } catch {
      /* texto livre */
    }
  }
  return "Cliente";
}

export function matchesBookingSearch(booking: BookingClientFields, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  const label = getBookingClientLabel(booking).toLowerCase();
  const contact = (booking.client_contact ?? "").toLowerCase();
  const email = (booking.client_email ?? "").toLowerCase();
  const notes = (booking.notes ?? "").toLowerCase();

  return (
    label.includes(needle) ||
    contact.includes(needle) ||
    email.includes(needle) ||
    notes.includes(needle)
  );
}
