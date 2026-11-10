import type { Metadata } from "next";
import AboutView from "./about-view";

export const metadata: Metadata = {
  title: "About us · Hair2Harvest",
  description:
    "Hair2Harvest is a student capstone project with Barangay Nova Proper. We collect hair clippings from barbershops and turn them into compost for local planting beds.",
};

export default function AboutPage() {
  return <AboutView />;
}
