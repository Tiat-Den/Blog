import { Container } from "./container";
import { Github } from "lucide-react";

export function Footer({ dict }: { dict: any }) {
  return (
    <footer className="border-t py-6 md:py-0">
      <Container className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {dict.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Tiat-Den"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </div>
      </Container>
    </footer>
  );
}
