"use client";

import Link from "next/link";
import { fetchCurrentUser } from "@/lib/current-user";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ClientAccountMenu } from "@/components/ClientAccountMenu";
import { Logo } from "./Logo";
import { Menu, X, Mail, Phone, ChevronRight } from "lucide-react";

const desktopLinks = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/services", label: "Services" },
  { to: "/for-clients", label: "For Clients" },
  { to: "/for-professionals", label: "For Professionals" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

const mobileLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/for-clients", label: "For Clients" },
  { to: "/for-professionals", label: "For Professionals" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Support" },
];

export function SiteHeader({
  preview = false,
  onNavigate,
}: {
  preview?: boolean;
  onNavigate?: (href: string) => void;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);

  useEffect(() => {
    void fetchCurrentUser()
      .then((data) => setUser(data.user ? { role: data.user.role ?? "" } : null))
      .catch(() => setUser(null));
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const homeHref = user?.role === "PROFESSIONAL" ? "/professional-home" : "/";
  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "PROFESSIONAL"
        ? "/professional/dashboard"
        : "/dashboard";

  return (
    <header
      onClickCapture={
        preview
          ? (event) => {
              const link = (event.target as HTMLElement).closest("a");
              if (link) {
                event.preventDefault();
                onNavigate?.(link.getAttribute("href") ?? "/");
              }
            }
          : undefined
      }
      className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo preview={preview} />
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Desktop Navigation">
            {desktopLinks.map((l) => {
              const active =
                l.to === "/"
                  ? pathname === homeHref
                  : pathname === l.to || pathname.startsWith(`${l.to}/`);
              return (
                <Link
                  key={l.to}
                  href={l.to === "/" ? homeHref : l.to}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-1 py-2 text-sm transition-colors after:absolute after:inset-x-1 after:bottom-0 after:h-0.5 after:rounded-full after:transition-transform ${
                    active
                      ? "font-semibold text-primary after:scale-x-100 after:bg-primary"
                      : "text-muted-foreground after:scale-x-0 hover:text-foreground hover:after:scale-x-100 hover:after:bg-primary/40"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href={dashboardHref} prefetch={false}>
                  Dashboard
                </Link>
              </Button>
              <div className="hidden sm:block">
                <ClientAccountMenu />
              </div>
            </div>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login" prefetch={false}>
                  Log in
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/signup" prefetch={false}>
                  Sign up
                </Link>
              </Button>
            </>
          )}
          {user?.role === "CLIENT" ? (
            <Button
              asChild
              size="sm"
              className="bg-cta text-cta-foreground hover:bg-cta/90 shadow-soft"
            >
              <Link href="/post-job" prefetch={false}>
                Post a Job
              </Link>
            </Button>
          ) : null}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-surface text-foreground shadow-2xs hover:bg-muted lg:hidden transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation-menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div
          id="mobile-navigation-menu"
          className="border-t border-border bg-background/98 shadow-xl backdrop-blur-md lg:hidden animate-in fade-in-0 slide-in-from-top-2 duration-150"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-4 space-y-3">
            {/* Nav links */}
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {mobileLinks.map((l) => {
                const active =
                  l.to === "/"
                    ? pathname === homeHref
                    : pathname === l.to || pathname.startsWith(`${l.to}/`);
                return (
                  <Link
                    key={l.to}
                    href={l.to === "/" ? homeHref : l.to}
                    prefetch={false}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                  </Link>
                );
              })}
            </nav>

            {/* Auth Actions */}
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {user ? (
                <>
                  <Button asChild size="default" className="w-full">
                    <Link href={dashboardHref} prefetch={false} onClick={() => setOpen(false)}>
                      Go to Dashboard
                    </Link>
                  </Button>
                  {user.role === "CLIENT" && (
                    <Button
                      asChild
                      size="default"
                      className="w-full bg-cta text-cta-foreground hover:bg-cta/90"
                    >
                      <Link href="/post-job" prefetch={false} onClick={() => setOpen(false)}>
                        Post a Job
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="default" className="w-full">
                    <Link href="/login" prefetch={false} onClick={() => setOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="default"
                    className="w-full bg-brand text-brand-foreground hover:bg-brand-hover shadow-soft"
                  >
                    <Link href="/signup" prefetch={false} onClick={() => setOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Contact Quick Bar */}
            <div className="pt-3 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs text-muted-foreground">
              <a
                href="tel:+918000000000"
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>+91 80000 00000</span>
              </a>
              <a
                href="mailto:support@klick-pro.com"
                className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors py-1"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>support@klick-pro.com</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
