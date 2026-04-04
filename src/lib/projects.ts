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
  // ─── LIVE ───
  {
    id: "write4you",
    name: "WRITE4YOU",
    tagline: "Lyric generation app powered by real artist data",
    description: [
      "A lyric generating app built on a database of over",
      "188 real artists. Matches vocal style, lyric structure,",
      "and cadence to produce authentic results.",
      "",
      "Select an artist and generate lyrics that match their",
      "writing patterns, flow, and rhythm.",
    ],
    stack: ["Firebase", "Web App"],
    status: "Live",
    links: [
      { label: "Live", url: "https://write4you.web.app/" },
    ],
  },
  {
    id: "icu-tools",
    name: "ICU TOOLS",
    tagline: "VS Code extension for custom action bar buttons",
    description: [
      "A Visual Studio Code plugin that lets you customise",
      "the action bar with your own buttons for quick",
      "commands.",
      "",
      "Set up one-click buttons for Run, Build, Build & Run",
      "and any other command you use frequently. Each button",
      "supports custom presets so you can tailor your",
      "workflow without touching keybinds.",
    ],
    stack: ["TypeScript", "VS Code API"],
    status: "Live",
    links: [
      { label: "GitHub", url: "https://github.com/ICY0U/ICU-Tools" },
    ],
  },
  // ─── IN DEVELOPMENT ───
  {
    id: "blacksite-07",
    name: "BLACKSITE-07",
    tagline: "Cinematic terminal-based thriller game",
    description: [
      "You're a new operator at a classified Department of",
      "Defense facility. Something has gone wrong in the",
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
    id: "war-times",
    name: "WAR TIMES",
    tagline: "Custom FPS game engine built from scratch in C++",
    description: [
      "A custom game engine built from the ground up in C++.",
      "Designed for first-person shooter gameplay with a",
      "focus on performance and low-level control.",
      "",
      "Features custom editor tools, rendering pipeline,",
      "and engine systems -- all hand-written without",
      "relying on third-party engines.",
    ],
    stack: ["C++", "OpenGL", "Custom Engine"],
    status: "In Development",
    links: [
      { label: "GitHub", url: "https://github.com/ICY0U/War-Times_V0.01" },
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
