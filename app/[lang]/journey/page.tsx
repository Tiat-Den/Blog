import { getDictionary } from "@/lib/dictionary";
import { getAllContent, journeyFrontmatterSchema } from "@/lib/content";
import { Container } from "@/components/layout/container";
import { MdxContent } from "@/components/mdx/MdxContent";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journey | Personal Universe",
  description: "A timeline of my life, career, and projects.",
};

export default async function JourneyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "vi");
  const events = await getAllContent(lang, "journey", journeyFrontmatterSchema);

  return (
    <Container className="py-12 flex flex-col gap-12 max-w-3xl">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{dict.journey.title}</h1>
        <p className="text-muted-foreground text-lg">
          A timeline of significant events, milestones, and turning points in my life and career.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border rounded-xl border-dashed">
          The timeline is empty. Add events to content/journey!
        </div>
      ) : (
        <div className="relative border-l border-muted ml-3 pl-8 md:ml-0 md:pl-0 md:border-l-0">
          <div className="md:absolute md:left-[50%] md:top-0 md:bottom-0 md:border-l md:border-muted md:-ml-px hidden md:block"></div>
          
          <div className="flex flex-col gap-12">
            {events.map((event, index) => (
              <div key={event.slug} className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                
                {/* Timeline Dot */}
                <div className="absolute -left-[37px] md:left-[50%] md:-ml-[9px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background border border-border"></div>

                {/* Content Card */}
                <div className="md:w-1/2 flex flex-col gap-2">
                  <div className={`flex flex-col gap-2 ${index % 2 === 0 ? "md:items-start" : "md:items-end"}`}>
                    <span className="text-sm font-medium text-muted-foreground">
                      {new Date(event.metadata.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                    <h3 className={`text-xl font-bold ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                      {event.metadata.title}
                    </h3>
                    <Badge variant="secondary" className="w-fit">{event.metadata.category}</Badge>
                  </div>
                  
                  <div className={`prose prose-neutral dark:prose-invert prose-sm max-w-none mt-2 ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}>
                    <MdxContent source={event.source} />
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
