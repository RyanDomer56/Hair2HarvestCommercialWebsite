import type { Metadata } from "next";
import NetworkView from "./network-view";

export const metadata: Metadata = {
  title: "Shop Partners",
  description:
    "See the barbershops that have partnered with Hair2Harvest. We show shop name, barangay and partnership status only — contact and pickup details stay private.",
};

export default function NetworkPage() {
  return <NetworkView />;
}
