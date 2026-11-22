import type { Metadata } from "next";
import { LegalView } from "@/components/site/legal-view";
import { privacyDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Hair2Harvest",
  description:
    "How Hair2Harvest collects, uses, and protects barbershop information under the Data Privacy Act of 2012.",
};

export default function PrivacyPage() {
  return (
    <LegalView
      doc={privacyDocument}
      index="06"
      other={{
        href: "/terms",
        label: { en: "Read the Terms and Conditions", tl: "Basahin ang mga Tuntunin at Kundisyon" },
      }}
    />
  );
}
