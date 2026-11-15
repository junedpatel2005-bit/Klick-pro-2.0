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
  iconBgColor?: string;
  definition?: string;
  description?: string;
  formula?: string;
  source?: string;
  why?: string;
  valueClassName?: string;
  cardClassName?: string;
};

export function ReportKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = "text-slate-500",
  definition,
  description,
  formula,
  source,
  why,
  valueClassName = "text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums mt-3",
  cardClassName,
}: ReportKpiCardProps) {
  const paragraph = description || definition || "";

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4.5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors relative ${
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
                  className="rounded p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors focus:outline-hidden"
                  aria-label={`Metric information for ${title}`}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="z-[9999] max-w-xs sm:max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 shadow-xl space-y-1.5"
              >
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1">
                  <span className="font-semibold text-white text-xs">{title}</span>
                </div>

                {paragraph && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {paragraph}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className={valueClassName}>{value}</div>

      {subtitle && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>}
    </div>
  );
}
