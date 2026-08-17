const fs = require('fs');

function processFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    const newContent = replacer(content);
    if (content !== newContent) {
      fs.writeFileSync(path, newContent, 'utf8');
      console.log('Updated:', path);
    }
  }
}

// 1. About Page
processFile('d:/Project_Web/Web-Blog/app/[lang]/about/page.tsx', content => {
  if (!content.includes('getDictionary')) {
    content = 'import { getDictionary } from "@/lib/dictionary";\n' + content;
  }
  content = content.replace('const { lang } = await params;', 'const { lang } = await params;\n  const dict = await getDictionary(lang as "en" | "vi");');
  
  content = content.replace(/Player Profile/, '{dict.about.title}');
  content = content.replace(/I am a builder exploring the intersection of design, engineering, and artificial intelligence\.\s*This is my digital avatar\./, '{dict.about.description}');
  content = content.replace(/Current Objectives/, '{dict.about.objectives}');
  content = content.replace(/My primary focus right now is building autonomous systems that can\s*reason, plan, and execute complex workflows\. I believe the future of software\s*is agentic, and I want to be at the forefront of this shift\./, '{dict.about.objectivesP1}');
  content = content.replace(/When I'm not writing code, I'm usually reading about philosophy, playing indie games, or learning new visual design techniques\./, '{dict.about.objectivesP2}');
  content = content.replace(/Skill Tree/, '{dict.about.skillTree}');
  content = content.replace(/Tech Stack/, '{dict.about.techStack}');
  content = content.replace(/Active Quests/, '{dict.about.activeQuests}');
  
  content = content.replace(/status: "Mastering"/g, 'status: dict.about.skills.ts');
  content = content.replace(/status: "Advanced"/g, 'status: dict.about.skills.nextjs');
  content = content.replace(/status: "Exploring deeply"/g, 'status: dict.about.skills.ai');
  content = content.replace(/status: "Practicing"/g, 'status: dict.about.skills.design');
  content = content.replace(/status: "Learning"/g, 'status: dict.about.skills.webgl');
  
  content = content.replace(/title: "Build Personal Universe", status: "In Progress"/g, 'title: dict.about.quests.q1, status: dict.about.quests.q1Status');
  content = content.replace(/title: "Master Autonomous Agents", status: "Active"/g, 'title: dict.about.quests.q2, status: dict.about.quests.q2Status');
  content = content.replace(/title: "First 1K users on a SaaS", status: "Locked"/g, 'title: dict.about.quests.q3, status: dict.about.quests.q3Status');
  
  content = content.replace(/const SKILLS = \[[^\]]*\];\s*const STACK = \[[^\]]*\];\s*const QUESTS = \[[^\]]*\];/m, '');
  
  const arrays = `
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
  `;
  content = content.replace(/const dict = await getDictionary[^;]*;/, `const dict = await getDictionary(lang as "en" | "vi");\n${arrays}`);
  return content;
});

// 2. Blog, Projects, Brain, Journey, Lab, Capsule
const listPages = {
  blog: {
    title: 'Blog',
    desc: 'My latest thoughts, experiments, and technical deep-dives.',
    empty: 'No posts found. Start writing in content/posts!'
  },
  projects: {
    title: 'Projects',
    desc: 'A showcase of things I have built, am building, or plan to build.',
    empty: 'No projects found. Add them to content/projects!'
  },
  brain: {
    title: 'Brain',
    desc: 'My digital garden and second brain. Concepts, ideas, and interconnected thoughts.',
    empty: 'No notes found. Start writing in content/notes!'
  },
  journey: {
    title: 'Journey',
    desc: 'A timeline of events, milestones, and personal growth.',
    empty: 'No events found. Start writing in content/journey!'
  },
  lab: {
    title: 'Lab',
    desc: 'Experimental playground for half-baked ideas and raw code. Expect things to be unpolished.',
    empty: 'No experiments found. Create one in content/lab!'
  },
  capsule: {
    title: 'Time Capsule',
    desc: "Monthly snapshots of what I'm learning, building, and thinking about.\\s*A structured way to look back and see how much has changed.",
    empty: 'No snapshots yet. Create one in content/capsule!'
  }
};

for (const [page, data] of Object.entries(listPages)) {
  processFile(`d:/Project_Web/Web-Blog/app/[lang]/${page}/page.tsx`, content => {
    if (!content.includes('getDictionary')) {
      content = 'import { getDictionary } from "@/lib/dictionary";\n' + content;
    }
    
    if (!content.includes('const dict = await getDictionary')) {
      content = content.replace(/const { lang } = await params;/, 'const { lang } = await params;\n  const dict = await getDictionary(lang as "en" | "vi");');
    }

    content = content.replace(new RegExp(`>${data.title}<`), `>{dict.${page}.title}<`);
    content = content.replace(new RegExp(data.desc), `{dict.${page}.description}`);
    content = content.replace(new RegExp(data.empty), `{dict.${page}.empty}`);

    return content;
  });
}
