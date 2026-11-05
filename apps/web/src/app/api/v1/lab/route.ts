import { readResource } from "@/lib/read-resource";
import { labResults } from "@/lib/data";

/** GET /api/v1/lab — laboratory results. */
export async function GET() {
  return readResource("lab", labResults);
}
