export interface CommandResult {
  output: string[];
  isError?: boolean;
  action?: { type: "theme"; value: string };
}

export type CommandHandler = (args: string[]) => CommandResult;

import { projects, getProject } from "./projects";
import { projectHeaders } from "./ascii";

function pad(str: string, len: number): string {
  return str + " ".repeat(Math.max(0, len - str.length));
}

const THEMES = ["green", "amber", "white"];

const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      "",
      "  AVAILABLE COMMANDS",
      "  ==================",
      "",
      "  help              Show this help message",
      "  about             Who am I",
      "  projects          List all projects",
      "  open <name>       View project details",
      "  skills            Tech stack & tools",
      "  contact           Get in touch",
      "  clear             Clear the terminal",
      "  theme <color>     Switch theme (green|amber|white)",
      "  banner            Show the welcome banner",
      "  whoami            Display current user",
      "  date              Show current date/time",
      "  echo <text>       Print text to terminal",
      "",
    ],
  }),

  about: () => ({
    output: [
      "",
      "  ╔══════════════════════════════════════════════╗",
      "  ║                 ABOUT ME                     ║",
      "  ╚══════════════════════════════════════════════╝",
      "",
      "  > ICU",
      "  > Developer / Creator",
      "",
      "  I build things for the web and beyond.",
      "  Games, tools, interactive experiences.",
      "",
      "  Currently focused on game development and",
      "  creative coding projects. I like making things",
      "  that feel good to use -- retro aesthetics,",
      "  tight interactions, and clean code.",
      "",
      '  Type "projects" to see what I\'m working on.',
      '  Type "skills" to see my tech stack.',
      "",
    ],
  }),

  projects: () => {
    const lines = [
      "",
      "  PROJECTS",
      "  ========",
      "",
    ];

    projects.forEach((p, i) => {
      const num = String(i + 1).padStart(2, "0");
      const status =
        p.status === "Live"
          ? "[LIVE]"
          : p.status === "In Development"
          ? "[DEV]"
          : p.status === "Complete"
          ? "[DONE]"
          : "[IDEA]";

      lines.push(
        `  [${num}] ${pad(p.name, 20)} ${pad(status, 8)} ${p.tagline}`
      );
    });

    lines.push("");
    lines.push('  Type "open <name>" for details.');
    lines.push("  Example: open blacksite-07");
    lines.push("");

    return { output: lines };
  },

  open: (args: string[]) => {
    const name = args.join(" ");
    if (!name) {
      return {
        output: [
          "  Usage: open <project-name>",
          "  Example: open blacksite-07",
        ],
        isError: true,
      };
    }

    const project = getProject(name);
    if (!project) {
      return {
        output: [
          `  Project "${name}" not found.`,
          '  Type "projects" to see available projects.',
        ],
        isError: true,
      };
    }

    const lines: string[] = [""];

    // ASCII header if available, otherwise box header
    const header = projectHeaders[project.id];
    if (header) {
      header.forEach((line) => lines.push(line));
    } else {
      const divider = "═".repeat(46);
      lines.push(`  ╔${divider}╗`);
      lines.push(`  ║  ${pad(project.name, 44)}║`);
      lines.push(`  ╚${divider}╝`);
    }

    lines.push("");
    lines.push(`  ${project.tagline}`);
    lines.push("");

    project.description.forEach((line) => {
      lines.push(`  ${line}`);
    });

    lines.push("");
    lines.push(`  Stack:   ${project.stack.join(", ")}`);
    lines.push(`  Status:  ${project.status}`);

    if (project.links && project.links.length > 0) {
      lines.push("");
      project.links.forEach((link) => {
        lines.push(`  ${link.label}: ${link.url}`);
      });
    }

    lines.push("");
    return { output: lines };
  },

  skills: () => ({
    output: [
      "",
      "  TECH STACK & TOOLS",
      "  ==================",
      "",
      "  LANGUAGES",
      "  ----------",
      "  C++    TypeScript    JavaScript    Python",
      "",
      "  FRONTEND",
      "  ----------",
      "  Next.js    React    Tailwind CSS    Framer Motion",
      "",
      "  TOOLS & EDITORS",
      "  ----------",
      "  VS Code    Linux    Blender",
      "",
      "  GAME DEV",
      "  ----------",
      "  Custom Engine (C++/OpenGL)    Web-based game systems",
      "  Terminal UI    Retro aesthetics",
      "",
      "  EXTENSIONS",
      "  ----------",
      "  VS Code API    Extension development",
      "",
    ],
  }),

  contact: () => ({
    output: [
      "",
      "  ╔══════════════════════════════════════════════╗",
      "  ║                 CONTACT                      ║",
      "  ╚══════════════════════════════════════════════╝",
      "",
      "  Discord      ._stinky",
      "  GitHub       https://github.com/ICY0U",
      "  Email        icumadethis@gmail.com",
      "",
      "  Feel free to reach out.",
      "",
    ],
  }),

  theme: (args: string[]) => {
    const color = args[0]?.toLowerCase();
    if (!color || !THEMES.includes(color)) {
      return {
        output: [
          `  Usage: theme <${THEMES.join("|")}>`,
          `  Current themes: ${THEMES.join(", ")}`,
        ],
        isError: true,
      };
    }
    return {
      output: [`  Theme switched to ${color}.`],
      action: { type: "theme", value: color },
    };
  },

  banner: () => ({
    output: [
      "",
      "  ██╗ ██████╗██╗   ██╗",
      "  ██║██╔════╝██║   ██║",
      "  ██║██║     ██║   ██║",
      "  ██║██║     ██║   ██║",
      "  ██║╚██████╗╚██████╔╝",
      "  ╚═╝ ╚═════╝ ╚═════╝ ",
      "",
      "  ICU.TERMINAL v1.0",
      "  Interactive Portfolio System",
      "",
    ],
  }),

  whoami: () => ({
    output: ["  visitor"],
  }),

  date: () => ({
    output: [`  ${new Date().toString()}`],
  }),

  echo: (args: string[]) => ({
    output: [args.length > 0 ? `  ${args.join(" ")}` : ""],
  }),
};

export function executeCommand(
  input: string
): CommandResult & { command: string } {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0]?.toLowerCase() || "";
  const args = parts.slice(1);

  if (cmd === "") {
    return { command: "", output: [] };
  }

  if (cmd === "clear") {
    return { command: "clear", output: [] };
  }

  const handler = commands[cmd];
  if (!handler) {
    return {
      command: cmd,
      output: [
        `  Command not found: ${cmd}`,
        '  Type "help" for available commands.',
      ],
      isError: true,
    };
  }

  const result = handler(args);
  return { command: cmd, ...result };
}
