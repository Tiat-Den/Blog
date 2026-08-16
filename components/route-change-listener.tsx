"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteChangeListener() {
  const pathname = usePathname();

  useEffect(() => {
    // Phóng sự kiện custom để các component khác (như ViewCounter) biết mà cập nhật
    window.dispatchEvent(new Event("route-changed"));
  }, [pathname]);

  return null;
}
