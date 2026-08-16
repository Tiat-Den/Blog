import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <Container className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built as a Personal Universe. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
