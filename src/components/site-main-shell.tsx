"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteMainShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = pathname === "/";
  const isAboutRoute = pathname === "/about";

  return <main className={`flex-1 ${isAdminRoute || isHomeRoute || isAboutRoute ? "" : "site-page-shell"}`}>{children}</main>;
}
