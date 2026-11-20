"use client";

import Link from "next/link";
import Image from "next/image";
import { fetchCurrentUser } from "@/lib/current-user";
import { useEffect, useState } from "react";

export function Logo({
  className = "",
  preview = false,
  collapsed = false,
}: {
  className?: string;
  preview?: boolean;
  collapsed?: boolean;
}) {
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    void fetchCurrentUser()
      .then((data) => setRole(data.user?.role ?? null))
      .catch(() => setRole(null));
  }, []);
  const href = role === "PROFESSIONAL" ? "/professional-home" : "/";
  return (
    <Link
      href={href}
      onClick={preview ? (event) => event.preventDefault() : undefined}
      className={`flex items-center gap-2 font-display font-bold ${className.includes("text-") ? className : `text-foreground ${className}`}`}
      title="Klick-Pro"
    >
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl overflow-hidden bg-white shadow-soft border border-slate-200/80">
        <Image src="/logo-icon.png" alt="" aria-hidden="true" width={36} height={36} className="h-full w-full object-contain p-0.5" priority />
      </span>
      <span
        className={`whitespace-nowrap text-xl tracking-tight transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden ${
          collapsed
            ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none"
            : "max-w-[160px] opacity-100 translate-x-0"
        }`}
      >
        Klick-Pro
      </span>
    </Link>
  );
}
