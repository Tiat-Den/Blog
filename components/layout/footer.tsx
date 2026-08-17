import { Container } from "./container";

export function Footer({ dict }: { dict: any }) {
  return (
    <footer className="border-t py-6 md:py-0">
      <Container className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
