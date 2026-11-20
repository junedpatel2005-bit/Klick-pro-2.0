"use client";

import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";
import {
  GoogleMapsContext,
  isGoogleMapsConfigured,
  type GoogleMapsContextValue,
} from "@/components/google-maps-context";

export {
  GOOGLE_MAPS_LIBRARIES,
  isGoogleMapsConfigured,
  useGoogleMaps,
  type GoogleMapsContextValue,
} from "@/components/google-maps-context";

// Loaded on-demand only when a map subscriber requests it.
const GoogleMapsScriptLoader = dynamic(() => import("@/components/GoogleMapsScriptLoader"), {
  ssr: false,
});

const UNCONFIGURED: GoogleMapsContextValue = {
  isLoaded: false,
  isConfigured: false,
  hasError: false,
  loadError: null,
};

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  const configured = isGoogleMapsConfigured();
  const [requested, setRequested] = useState(false);
  const [status, setStatus] = useState<GoogleMapsContextValue>({
    isLoaded: false,
    isConfigured: true,
    hasError: false,
    loadError: null,
  });

  const requestLoad = useCallback(() => {
    setRequested(true);
  }, []);

  const value = useMemo<GoogleMapsContextValue>(() => {
    if (!configured) return UNCONFIGURED;
    return { ...status, requestLoad };
  }, [configured, status, requestLoad]);

  return (
    <GoogleMapsContext.Provider value={value}>
      {configured && requested ? <GoogleMapsScriptLoader onStatusChange={setStatus} /> : null}
      {children}
    </GoogleMapsContext.Provider>
  );
}