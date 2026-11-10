import type { Metadata } from "next";
import ImpactView from "./impact-view";

export const metadata: Metadata = {
  title: "Our Collection Results",
  description:
    "What Hair2Harvest has collected so far in Barangay Nova Proper — weighed pickups, laboratory results and cured batches, all from real measurements.",
};

export default function ImpactPage() {
  return <ImpactView />;
}
