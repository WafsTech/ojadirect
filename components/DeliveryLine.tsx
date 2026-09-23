import { formatNaira } from "@/lib/format";
import { minFeeToCity } from "@/lib/delivery";
import type { City, DeliveryRate } from "@/lib/types";

export function DeliveryLine({
  city,
  rates,
}: {
  city: City;
  rates: DeliveryRate[];
}) {
  const fee = minFeeToCity(rates, city.code);

  return (
    <div className="border-b border-line bg-green-tint">
      <p className="mx-auto max-w-6xl px-4 py-2 text-center text-sm text-green-dark sm:px-6">
        Delivering to <strong>{city.name}</strong>: {city.delivery_days}
        {typeof fee === "number" && <> · from {formatNaira(fee)}</>}
      </p>
    </div>
  );
}
