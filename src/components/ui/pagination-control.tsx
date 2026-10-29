"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationControlProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: "portal" | "admin" | "table";
}

export function PaginationControl({
  currentPage,
  totalItems,
  pageSize = 12,
  onPageChange,
  className,
  variant = "portal",
}: PaginationControlProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // If there are no items or only 1 page, don't show pagination controls
  if (totalItems <= pageSize) {
    if (totalItems === 0) return null;
    return (
      <div
        className={cn(
          "flex items-center justify-between text-xs text-muted-foreground pt-4 pb-2 px-1",
          variant === "admin" && "border-t border-slate-200 text-slate-500",
          className,
        )}
      >
        <span>
          Showing all <span className="font-semibold text-foreground">{totalItems}</span> entries
        </span>
      </div>
    );
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate numbered pages with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const isAdmin = variant === "admin";

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 pb-2 text-xs",
        isAdmin
          ? "border-t border-slate-200 bg-slate-50/70 px-4 py-3 rounded-b-2xl text-slate-600"
          : "text-muted-foreground",
        className,
      )}
    >
      <div className="text-xs">
        Showing <span className={cn("font-semibold", isAdmin ? "text-slate-900" : "text-foreground")}>{startItem}</span> to{" "}
        <span className={cn("font-semibold", isAdmin ? "text-slate-900" : "text-foreground")}>{endItem}</span> of{" "}
        <span className={cn("font-semibold", isAdmin ? "text-slate-900" : "text-foreground")}>{totalItems}</span> entries
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-2xs",
            "disabled:opacity-40 disabled:cursor-not-allowed select-none",
            isAdmin
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "border-border bg-card text-foreground hover:bg-muted/70",
          )}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        {/* Number Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={currentPage === p ? "page" : undefined}
                className={cn(
                  "h-8 min-w-8 px-2.5 rounded-lg text-xs font-semibold transition select-none",
                  currentPage === p
                    ? isAdmin
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : isAdmin
                      ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                      : "bg-card border border-border text-foreground hover:bg-muted/70",
                )}
              >
                {p}
              </button>
            ) : (
              <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground/60 select-none">
                …
              </span>
            ),
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition shadow-2xs",
            "disabled:opacity-40 disabled:cursor-not-allowed select-none",
            isAdmin
              ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              : "border-border bg-card text-foreground hover:bg-muted/70",
          )}
          aria-label="Go to next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </nav>
  );
}
