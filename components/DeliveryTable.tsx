import { formatNaira } from "@/lib/format";
import type { CityCode } from "@/lib/city";
import type { City } from "@/lib/types";

export function DeliveryTable({
  cities,
  selected,
}: {
  cities: City[];
  selected: CityCode;
}) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
          Delivery days by city
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Delivery days are fixed per city so we can batch dispatches and keep
          fees low.
        </p>
        <div className="mt-6 overflow-x-auto rounded-[16px] border border-line">
          <table className="w-full min-w-[420px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-ground text-ink">
                <th scope="col" className="px-4 py-3 font-semibold">
                  City
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Delivery days
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Pickup fee
                </th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <tr
                  key={city.code}
                  className={`border-t border-line ${
                    city.code === selected ? "bg-green-tint" : "bg-paper"
                  }`}
                >
                  <th scope="row" className="px-4 py-3 font-medium text-ink">
                    {city.name}
                    {city.code === selected && (
                      <span className="ml-2 rounded-full bg-green px-2 py-0.5 text-[11px] font-semibold text-paper">
                        Selected
                      </span>
                    )}
                  </th>
                  <td className="px-4 py-3 text-muted">{city.delivery_days}</td>
                  <td className="px-4 py-3 text-muted">{formatNaira(city.pickup_fee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
