import { makePriceRoute } from "@/lib/priceHandler";
import { fetchFood, isFoodLive } from "@/lib/providers/food";

export const dynamic = "force-dynamic";

export const GET = makePriceRoute({
  category: "food",
  isLive: isFoodLive,
  fetcher: fetchFood,
});
