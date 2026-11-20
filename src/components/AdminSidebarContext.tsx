"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminSidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobileOpen: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType>({
  collapsed: false,
  toggleSidebar: () => {},
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
  toggleMobileOpen: () => {},
});

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("klickpro_admin_sidebar_collapsed");
      if (saved === "true") setCollapsed(true);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("klickpro_admin_sidebar_collapsed", String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const toggleMobileOpen = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <AdminSidebarContext.Provider
      value={{
        collapsed,
        toggleSidebar,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
        toggleMobileOpen,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  return useContext(AdminSidebarContext);
}
