import Link from "next/link";
import { Logo } from "./Logo";
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, Clock } from "lucide-react";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-6 lg:px-8">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Logo className="text-white text-xl" />
          <p className="mt-4 max-w-sm text-sm text-white/70 leading-relaxed">
            The trusted marketplace where clients meet vetted professionals. Post jobs, hire
            verified specialists, track work, and pay safely with milestone escrow protection.
          </p>

          {/* Direct Clickable Contact Details */}
          <div className="mt-5 space-y-2.5 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <a
                href="mailto:support@klick-pro.com"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                support@klick-pro.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary shrink-0" />
              <a
                href="tel:+918000000000"
                className="hover:text-white transition-colors underline-offset-4 hover:underline font-medium"
              >
                +91 80000 00000
              </a>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex gap-2 text-white/70">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-2 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Marketplace Links */}
        <FooterCol
          title="Marketplace"
          links={[
            { l: "Find Services", to: "/services" },
            { l: "How It Works", to: "/how-it-works" },
            { l: "For Clients", to: "/for-clients" },
            { l: "For Professionals", to: "/for-professionals" },
            { l: "Transparent Pricing", to: "/pricing" },
          ]}
        />

        {/* Company Links */}
        <FooterCol
          title="Company"
          links={[
            { l: "About Us", to: "/about" },
            { l: "Careers", to: "/careers" },
            { l: "Blog & Guides", to: "/blog" },
            { l: "Trust & Safety", to: "/about#trust" },
          ]}
        />

        {/* Support Links */}
        <FooterCol
          title="Support"
          links={[
            { l: "Help & FAQ", to: "/faq" },
            { l: "Contact Support", to: "/contact" },
            { l: "Escrow Protection", to: "/how-it-works#escrow" },
            { l: "Dispute Assistance", to: "/faq#disputes" },
          ]}
        />

        {/* Legal Links */}
        <FooterCol
          title="Legal"
          links={[
            { l: "Privacy Policy", to: "/privacy-policy" },
            { l: "Terms of Service", to: "/terms" },
            { l: "Cookie Policy", to: "/cookies" },
          ]}
        />
      </div>

      {/* Bottom Bar with Dynamic Year */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:px-6 lg:px-8">
          <span>© {currentYear} Klick-Pro, Inc. All rights reserved.</span>
          <span>Made for trusted residential, commercial & industrial work.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { l: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-white tracking-wide">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm text-white/65">
        {links.map((l) => (
          <li key={l.l}>
            <Link
              href={l.to}
              prefetch={false}
              className="hover:text-white transition-colors duration-150"
            >
              {l.l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
