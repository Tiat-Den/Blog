"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function LanguageSwitcher({ currentLang = "vi" }: { currentLang?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const activeLang = languages.find((l) => l.code === currentLang) || languages[0];

  const handleSelect = (code: string) => {
    setIsOpen(false);
    if (code === currentLang) return;
    
    // Replace the current language in the pathname with the new one
    // e.g., /vi/blog -> /en/blog
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-2"
        aria-label="Select language"
      >
        <span className="text-lg leading-none">{activeLang.flag}</span>
        <span className="text-xs font-medium uppercase">{activeLang.code}</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  currentLang === lang.code ? "bg-accent/50 font-medium" : ""
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

