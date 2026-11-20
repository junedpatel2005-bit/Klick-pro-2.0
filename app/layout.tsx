import type { Metadata, Viewport } from "next";
import "../src/styles.css";
import "react-loading-skeleton/dist/skeleton.css";
import { Providers } from "@/components/providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1748b5",
};

export const metadata: Metadata = {
  title: { default: "Klick-Pro — Hire trusted professionals near you", template: "%s | Klick-Pro" },
  description: "Post jobs, hire experts, track work, and manage Projects in one platform.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="notranslate" translate="no">
      <head>
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://maps.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window !== 'undefined' && typeof Node === 'function' && Node.prototype) {
                  var origRemove = Node.prototype.removeChild;
                  Node.prototype.removeChild = function(child) {
                    try {
                      if (child && child.parentNode !== this) {
                        if (child.parentNode) {
                          return child.parentNode.removeChild(child);
                        }
                        return child;
                      }
                      return origRemove.apply(this, arguments);
                    } catch (e) {
                      try {
                        if (child && child.parentNode) {
                          return child.parentNode.removeChild(child);
                        }
                      } catch (_) {}
                      return child;
                    }
                  };

                  var origInsert = Node.prototype.insertBefore;
                  Node.prototype.insertBefore = function(newNode, refNode) {
                    try {
                      if (refNode && refNode.parentNode !== this) {
                        if (refNode.parentNode) {
                          return refNode.parentNode.insertBefore(newNode, refNode);
                        }
                        return this.appendChild(newNode);
                      }
                      return origInsert.apply(this, arguments);
                    } catch (e) {
                      try {
                        return this.appendChild(newNode);
                      } catch (_) {
                        return newNode;
                      }
                    }
                  };
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen max-w-full overflow-x-clip bg-background text-foreground antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
