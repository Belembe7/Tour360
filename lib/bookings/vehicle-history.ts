export type VehicleBookingHistoryRow = {
  id: string;
  created_at: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  status: string;
  destination: string | null;
  user_id: string | null;
  vehicles: { model: string } | { model: string }[] | null;
};

export type AtendimentoHistoricoRow = {
  id: string;
  created_at: string;
  reservation_type: string;
  client_name: string | null;
  client_contact: string | null;
  client_email: string | null;
  departure_date: string;
  return_date: string | null;
  total_price: number;
  status: string;
  notes: string | null;
  created_by_user_id: string | null;
  /** Reserva feita no site em /viaturas (tabela vehicle_bookings). */
  isVehicleSite?: boolean;
};

export function vehicleModelFromRow(row: VehicleBookingHistoryRow): string {
  const v = row.vehicles;
  if (Array.isArray(v)) return v[0]?.model ?? "Viatura";
  return v?.model ?? "Viatura";
}

export function mapVehicleBookingToHistorico(
  row: VehicleBookingHistoryRow,
  profile?: { full_name: string | null; phone: string | null } | null,
): AtendimentoHistoricoRow {
  const model = vehicleModelFromRow(row);
  return {
    id: row.id,
    created_at: row.created_at,
    reservation_type: "aluguer",
    client_name: profile?.full_name ?? null,
    client_contact: profile?.phone ?? null,
    client_email: null,
    departure_date: row.start_date,
    return_date: row.end_date,
    total_price: Number(row.total_price),
    status: row.status,
    notes: model,
    created_by_user_id: null,
    isVehicleSite: true,
  };
}

export function mapVehicleBookingToStaffRow(
  row: VehicleBookingHistoryRow,
  profile?: { full_name: string | null } | null,
): {
  id: string;
  created_at: string;
  reservation_type: string;
  client_name: string | null;
  destination_free: string | null;
  total_price: number;
  status: string;
  created_by_user_id: string | null;
} {
  const model = vehicleModelFromRow(row);
  const dest = row.destination?.trim();
  return {
    id: row.id,
    created_at: row.created_at,
    reservation_type: "aluguer",
    client_name: profile?.full_name ?? "Cliente site",
    destination_free: dest ? `${model} · ${dest}` : model,
    total_price: Number(row.total_price),
    status: row.status,
    created_by_user_id: null,
  };
}

export function matchesVehicleHistoricoSearch(
  row: AtendimentoHistoricoRow,
  query: string,
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    (row.client_name ?? "").toLowerCase().includes(needle) ||
    (row.client_contact ?? "").toLowerCase().includes(needle) ||
    (row.notes ?? "").toLowerCase().includes(needle) ||
    (row.departure_date ?? "").includes(needle)
  );
}

export function sortByCreatedDesc<T extends { created_at: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
