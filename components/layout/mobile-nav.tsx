"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileNav({ dict, lang }: { dict: any; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 z-[100] w-3/4 max-w-sm border-l bg-background p-6 shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold tracking-tight text-xl">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 text-lg font-medium">
              <Link href={`/${lang}/about`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.about}</Link>
              <Link href={`/${lang}/blog`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.blog}</Link>
              <Link href={`/${lang}/projects`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.projects}</Link>
              <Link href={`/${lang}/journey`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.journey}</Link>
              <Link href={`/${lang}/explore`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.explore}</Link>
              <Link href={`/${lang}/brain`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.brain}</Link>
              <Link href={`/${lang}/lab`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.lab}</Link>
              <Link href={`/${lang}/capsule`} onClick={() => setIsOpen(false)} className="hover:text-foreground transition-colors">{dict.nav.capsule}</Link>
            </nav>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
