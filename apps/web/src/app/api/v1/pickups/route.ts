import { readResource } from "@/lib/read-resource";
import { pickups } from "@/lib/data";

/** GET /api/v1/pickups — collection log. */
export async function GET() {
  return readResource("pickups", pickups);
}
