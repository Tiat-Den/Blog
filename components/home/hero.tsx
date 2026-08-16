import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <Container className="relative z-10 flex flex-col items-center text-center gap-8">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Welcome to my <br />
            <span className="text-primary">Personal Universe</span>
          </h1>
          <p className="text-xl text-muted-foreground md:text-2xl leading-relaxed">
            A digital universe of what I learn, build and think. Not just a blog, but a living map of my journey.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild size="lg">
            <Link href="/blog">Read Blog</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/brain">Enter Brain</Link>
          </Button>
        </div>
      </Container>
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    </section>
  );
}
