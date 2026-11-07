import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { SystemAssistant } from "@/components/site/system-assistant";
import { LanguageProvider } from "@/lib/i18n";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="relative flex min-h-screen flex-col bg-paper">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <SystemAssistant />
      </div>
    </LanguageProvider>
  );
}
