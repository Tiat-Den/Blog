import { getDictionary } from "@/lib/dictionary";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Metadata } from "next";
import { Target, Code2, Trophy, Cpu, Zap, Star, BookOpen, MonitorSmartphone, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me | Personal Universe",
  description: "Interactive profile, skills, and current objectives.",
};



export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "vi");

  const SKILLS = [
    { name: "TypeScript / React", level: 90, status: dict.about.skills.ts },
    { name: "Next.js Architecture", level: 85, status: dict.about.skills.nextjs },
    { name: "Agentic AI / LLMs", level: 75, status: dict.about.skills.ai },
    { name: "UI/UX Design", level: 70, status: dict.about.skills.design },
    { name: "Three.js / WebGL", level: 40, status: dict.about.skills.webgl },
  ];
  const STACK = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Zod", "Lucide"];
  const QUESTS = [
    { title: dict.about.quests.q1, status: dict.about.quests.q1Status, xp: "+500 XP" },
    { title: dict.about.quests.q2, status: dict.about.quests.q2Status, xp: "+1000 XP" },
    { title: dict.about.quests.q3, status: dict.about.quests.q3Status, xp: "???" },
  ];
  
  return (
    <Container className="py-12 flex flex-col gap-12 max-w-4xl">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{dict.about.title}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          {dict.about.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <Target className="w-5 h-5 text-primary" /> {dict.about.objectives}
            </h2>
            <div className="prose prose-neutral dark:prose-invert">
              <p>
                {dict.about.objectivesP1}
              </p>
              <p>
                {dict.about.objectivesP2}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <BookOpen className="w-5 h-5 text-primary" /> {dict.about.origin}
            </h2>
            <div className="prose prose-neutral dark:prose-invert">
              <p>
                {dict.about.originText}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <Code2 className="w-5 h-5 text-primary" /> {dict.about.skillTree}
            </h2>
            <div className="flex flex-col gap-4">
              {SKILLS.map(skill => (
                <div key={skill.name} className="flex flex-col gap-1">
                  <div className="flex justify-between items-end">
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-xs text-muted-foreground">{skill.status}</span>
                  </div>
                  <Progress value={skill.level} className="h-2" />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Cpu className="w-4 h-4" /> {dict.about.techStack}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {STACK.map(tech => (
                <Badge key={tech} variant="secondary">{tech}</Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-4 h-4" /> {dict.about.activeQuests}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {QUESTS.map(quest => (
                <div key={quest.title} className="flex flex-col gap-1 border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <span className="font-medium text-sm">{quest.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`flex items-center gap-1 ${
                      quest.status === 'Locked' ? 'text-muted-foreground' : 'text-primary'
                    }`}>
                      {quest.status === 'Locked' ? <Star className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                      {quest.status}
                    </span>
                    <span className="text-muted-foreground font-mono">{quest.xp}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4" /> {dict.about.arsenal}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-3 border-b pb-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{dict.about.gear.g1}</span>
              </div>
              <div className="flex items-center gap-3 border-b pb-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{dict.about.gear.g2}</span>
              </div>
              <div className="flex items-center gap-3 border-b pb-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{dict.about.gear.g3}</span>
              </div>
              <div className="flex items-center gap-3 border-b pb-2">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{dict.about.gear.g4}</span>
              </div>
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{dict.about.gear.g5}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
