import type { Metadata } from "next";
import SystemView from "./system-view";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "From the barber's chair to compost: five simple steps, explained in plain words. We come to the shop, collect the hair and turn it into soil.",
};

export default function SystemPage() {
  return <SystemView />;
}
