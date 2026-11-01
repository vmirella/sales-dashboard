import { parseRange } from "@/lib/date-range";
import { getOrdersForRange } from "@/lib/orders";

/**
 * GET /api/orders?range=7d|30d|90d
 *
 * Exposes the same data the dashboard page renders, so it can be consumed by any client.
 * The page itself calls `getOrdersForRange` directly instead of fetching this route.
 */
export async function GET(request: Request) {
  const range = parseRange(new URL(request.url).searchParams.get("range") ?? undefined);
  return Response.json(getOrdersForRange(range));
}
