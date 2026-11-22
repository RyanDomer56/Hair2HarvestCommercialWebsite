import type { Metadata } from "next";
import { LegalView } from "@/components/site/legal-view";
import { termsDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms and Conditions · Hair2Harvest",
  description:
    "Terms for participating barbershops in the Hair2Harvest hair collection and composting programme in Barangay Nova Proper.",
};

export default function TermsPage() {
  return (
    <LegalView
      doc={termsDocument}
      index="05"
      other={{
        href: "/privacy",
        label: { en: "Read the Privacy Policy", tl: "Basahin ang Privacy Policy" },
      }}
    />
  );
}
