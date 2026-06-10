import type { ComponentProps, ReactNode } from "react";
import Navigation from "./Navigation";
import SEO from "./SEO";
import Footer from "./Footer";

type SEOProps = ComponentProps<typeof SEO>;

interface PageShellProps extends SEOProps {
  children: ReactNode;
  className?: string;
  hideNavigation?: boolean;
  hideFooter?: boolean;
}

export default function PageShell({
  children,
  className = "",
  hideNavigation = false,
  hideFooter = false,
  ...seoProps
}: PageShellProps) {
  return (
    <div className={`min-h-screen bg-[#050505] text-white bg-scanlines flex flex-col ${className}`}>
      <SEO {...seoProps} />
      {!hideNavigation && <Navigation />}
      
      <main className="flex-1">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}
