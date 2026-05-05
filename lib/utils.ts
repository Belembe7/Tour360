export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("MZN", "MT");
}
