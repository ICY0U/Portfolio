export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string[];
  stack: string[];
  status: "Live" | "In Development" | "Concept" | "Complete";
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  {
    id: "blacksite-07",
    name: "BLACKSITE-07",
    tagline: "Cinematic terminal-based AI thriller game",
    description: [
      "You're a new operator at a classified Department of",
      "Defense facility. Something has gone wrong with the AI",
      "research division. Navigate the retro terminal OS to",
      "uncover what happened at BLACKSITE-07.",
      "",
      "Features a full fake desktop OS with file system,",
      "email client, surveillance feeds, and a terminal",
      "where the real game unfolds. Inspired by classic",
      "DOS-era interfaces and government computing.",
    ],
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
    status: "In Development",
    links: [
      { label: "GitHub", url: "https://github.com/ICY0U/BlackSite-07" },
    ],
  },
  {
    id: "icu-terminal",
    name: "ICU.TERMINAL",
    tagline: "Interactive terminal portfolio (you're looking at it)",
    description: [
      "A retro CRT terminal interface that serves as a",
      "personal portfolio. Visitors type commands to explore",
      "projects, skills, and contact info.",
      "",
      "Built with the same attention to retro authenticity",
      "as BLACKSITE-07. Features boot sequence, scanlines,",
      "phosphor glow, and screen flicker effects.",
    ],
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion"],
    status: "Live",
    links: [
      { label: "Source", url: "https://github.com/ICY0U/Portfolio" },
    ],
  },
];

export function getProject(name: string): Project | undefined {
  const lower = name.toLowerCase().trim();
  return projects.find(
    (p) =>
      p.id === lower ||
      p.name.toLowerCase() === lower ||
      p.name.toLowerCase().replace(/[^a-z0-9]/g, "") ===
        lower.replace(/[^a-z0-9]/g, "")
  );
}
