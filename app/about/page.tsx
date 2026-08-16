import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Metadata } from "next";
import { Target, Code2, Trophy, Cpu, Zap, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Me | Personal Universe",
  description: "Interactive profile, skills, and current objectives.",
};

const SKILLS = [
  { name: "TypeScript / React", level: 90, status: "Mastering" },
  { name: "Next.js Architecture", level: 85, status: "Advanced" },
  { name: "Agentic AI / LLMs", level: 75, status: "Exploring deeply" },
  { name: "UI/UX Design", level: 70, status: "Practicing" },
  { name: "Three.js / WebGL", level: 40, status: "Learning" },
];

const STACK = [
  "Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Three.js", "Zod", "Lucide"
];

const QUESTS = [
  { title: "Build Personal Universe", status: "In Progress", xp: "+500 XP" },
  { title: "Master Autonomous Agents", status: "Active", xp: "+1000 XP" },
  { title: "First 1K users on a SaaS", status: "Locked", xp: "???" },
];

export default function AboutPage() {
  return (
    <Container className="py-12 flex flex-col gap-12 max-w-4xl">
      <header className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Player Profile</h1>
        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          I am a builder exploring the intersection of design, engineering, and artificial intelligence. 
          This is my digital avatar.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <Target className="w-5 h-5 text-primary" /> Current Objectives
            </h2>
            <div className="prose prose-neutral dark:prose-invert">
              <p>
                My primary focus right now is building autonomous systems that can 
                reason, plan, and execute complex workflows. I believe the future of software
                is agentic, and I want to be at the forefront of this shift.
              </p>
              <p>
                When I'm not writing code, I'm usually reading about philosophy, playing indie games, or learning new visual design techniques.
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 border-b pb-2">
              <Code2 className="w-5 h-5 text-primary" /> Skill Tree
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
                <Cpu className="w-4 h-4" /> Tech Stack
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
                <Trophy className="w-4 h-4" /> Active Quests
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
        </div>
      </div>
    </Container>
  );
}
