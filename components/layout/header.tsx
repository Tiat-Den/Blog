import Link from "next/link";
import { Container } from "./container";
import { CommandPalette } from "@/components/search/CommandPalette";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

export function Header({ dict, lang }: { dict: any; lang: string }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <Link href={`/${lang}`} className="font-bold tracking-tight text-xl">
          Personal Universe
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground hidden md:flex">
            <Link href={`/${lang}/about`} className="hover:text-foreground transition-colors">{dict.nav.about}</Link>
            <Link href={`/${lang}/blog`} className="hover:text-foreground transition-colors">{dict.nav.blog}</Link>
            <Link href={`/${lang}/projects`} className="hover:text-foreground transition-colors">{dict.nav.projects}</Link>
            <Link href={`/${lang}/journey`} className="hover:text-foreground transition-colors">{dict.nav.journey}</Link>
            <Link href={`/${lang}/explore`} className="hover:text-foreground transition-colors">{dict.nav.explore}</Link>
            <Link href={`/${lang}/brain`} className="hover:text-foreground transition-colors">{dict.nav.brain}</Link>
            <Link href={`/${lang}/lab`} className="hover:text-foreground transition-colors">{dict.nav.lab}</Link>
            <Link href={`/${lang}/capsule`} className="hover:text-foreground transition-colors">{dict.nav.capsule}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <CommandPalette />
            <LanguageSwitcher currentLang={lang} />
            <MobileNav dict={dict} lang={lang} />
          </div>
        </div>
      </Container>
    </header>
  );
}
