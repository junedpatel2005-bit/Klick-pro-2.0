import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-background">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
