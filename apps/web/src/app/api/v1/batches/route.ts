import { readResource } from "@/lib/read-resource";
import { batches } from "@/lib/data";

/** GET /api/v1/batches — composting batches. */
export async function GET() {
  return readResource("batches", batches);
}
