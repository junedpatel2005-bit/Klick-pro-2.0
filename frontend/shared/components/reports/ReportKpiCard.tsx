"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ReportKpiCardProps = {
  title: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  iconBgColor?: string; // e.g. "bg-blue-500/10 text-blue-600"
  definition: string;
  formula: string;
  source: string;
  why: string;
  valueClassName?: string;
  cardClassName?: string;
};

export function ReportKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "bg-blue-500/10 text-blue-600",
  definition,
  formula,
  source,
  why,
  valueClassName = "text-2xl font-bold mt-2 text-slate-900 dark:text-white",
  cardClassName,
}: ReportKpiCardProps) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow relative group ${
        cardClassName || ""
      }`}
    >
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-medium">
        <div className="flex items-center gap-1.5 min-w-0 pr-1">
          <span className="truncate">{title}</span>
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full p-0.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
                  aria-label={`Metric information for ${title}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="z-[9999] max-w-xs sm:max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-3.5 text-xs text-slate-100 shadow-2xl space-y-2.5"
              >
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                  <span className="grid h-4 w-4 place-items-center rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">
                    i
                  </span>
                  <span className="font-bold text-white text-xs">{title}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{definition}</p>

                <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                    Formula & Calculation Logic
                  </span>
                  <p className="font-mono text-[10.5px] text-emerald-400 break-words leading-tight">
                    {formula}
                  </p>
                </div>

                <div className="space-y-1.5 text-[11px] pt-0.5">
                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-400 shrink-0">Source:</span>
                    <span className="text-slate-200">{source}</span>
                  </div>
                  <div className="flex items-start gap-1">
                    <span className="font-bold text-slate-400 shrink-0">Why It Matters:</span>
                    <span className="text-slate-300 leading-snug">{why}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className={`p-2 rounded-xl shrink-0 ${iconBgColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className={valueClassName}>{value}</div>

      {subtitle && <div className="mt-1">{subtitle}</div>}
    </div>
  );
}
