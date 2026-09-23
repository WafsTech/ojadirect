export function formatNaira(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function percentOff(price: number, mallPrice: number): number {
  if (mallPrice <= 0) return 0;
  return Math.round(((mallPrice - price) / mallPrice) * 100);
}
