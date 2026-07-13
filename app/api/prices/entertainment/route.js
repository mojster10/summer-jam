import { makePriceRoute } from "@/lib/priceHandler";
import { fetchEntertainment, isEntertainmentLive } from "@/lib/providers/entertainment";

export const dynamic = "force-dynamic";

export const GET = makePriceRoute({
  category: "entertainment",
  isLive: isEntertainmentLive,
  fetcher: fetchEntertainment,
});
