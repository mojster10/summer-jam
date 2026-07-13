import { makePriceRoute } from "@/lib/priceHandler";
import { fetchFlights, isFlightsLive } from "@/lib/providers/flights";

export const dynamic = "force-dynamic";

export const GET = makePriceRoute({
  category: "flights",
  isLive: isFlightsLive,
  fetcher: fetchFlights,
});
