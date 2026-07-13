import { makePriceRoute } from "@/lib/priceHandler";
import { fetchHotels, isHotelLive } from "@/lib/providers/hotel";

export const dynamic = "force-dynamic";

export const GET = makePriceRoute({
  category: "hotel",
  isLive: isHotelLive,
  fetcher: fetchHotels,
});
