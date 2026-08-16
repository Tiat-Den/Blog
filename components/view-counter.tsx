"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { usePathname } from "next/navigation";

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
  hidden?: boolean;
}

export function ViewCounter({ slug, trackView = false, hidden = false }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const fetchViews = async () => {
      try {
        let method = "GET";
        const sessionKey = `viewed_${slug}`;

        if (trackView && !sessionStorage.getItem(sessionKey)) {
          method = "POST";
          sessionStorage.setItem(sessionKey, "true");
        }

        const res = await fetch(`/api/views/${slug}?t=${Date.now()}`, {
          method,
          headers: { "Cache-Control": "no-store, max-age=0" },
        });
        
        const data = await res.json();
        
        if (isMounted && typeof data.count === "number") {
          setViews(data.count);
        }
      } catch (err) {
        console.error("Failed to load views:", err);
      }
    };

    fetchViews();

    // Lắng nghe sự kiện focus (khi chuyển tab hoặc quay lại cửa sổ)
    const onFocus = () => fetchViews();
    window.addEventListener("focus", onFocus);
    
    // Lắng nghe sự kiện custom khi Next.js đổi route (sẽ phát từ layout)
    window.addEventListener("route-changed", onFocus);

    return () => {
      isMounted = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("route-changed", onFocus);
    };
  }, [slug, trackView, pathname]);

  if (views === null || hidden) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Eye className="w-4 h-4" />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
