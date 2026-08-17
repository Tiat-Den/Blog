import Link from "next/link";
import { Container } from "./container";
import { CommandPalette } from "@/components/search/CommandPalette";
import { LanguageSwitcher } from "./language-switcher";
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-bold tracking-tight text-xl">
          Personal Universe
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 text-sm font-medium text-muted-foreground hidden md:flex">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link href="/projects" className="hover:text-foreground transition-colors">Projects</Link>
            <Link href="/journey" className="hover:text-foreground transition-colors">Journey</Link>
            <Link href="/explore" className="hover:text-foreground transition-colors">Explore</Link>
            <Link href="/brain" className="hover:text-foreground transition-colors">Brain</Link>
            <Link href="/lab" className="hover:text-foreground transition-colors">Lab</Link>
            <Link href="/capsule" className="hover:text-foreground transition-colors">Capsule</Link>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <CommandPalette />
          </div>
        </div>
      </Container>
    </header>
  );
}
