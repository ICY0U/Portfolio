export interface CommandResult {
  output: string[];
  isError?: boolean;
}

export type CommandHandler = (args: string[]) => CommandResult;

const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: [
      "",
      "  AVAILABLE COMMANDS",
      "  ==================",
      "",
      "  help          Show this help message",
      "  about         Who am I",
      "  projects      List all projects",
      "  open <name>   View project details",
      "  skills        Tech stack & tools",
      "  contact       Get in touch",
      "  clear         Clear the terminal",
      "  theme <color> Switch theme (green|amber|white)",
      "",
    ],
  }),

  about: () => ({
    output: [
      "",
      "  > ICU",
      "  > Developer / Creator",
      "",
      "  Building things that are fun to use.",
      "  Games, tools, and everything in between.",
      "",
      '  Type "projects" to see what I\'m working on.',
      "",
    ],
  }),

  projects: () => ({
    output: [
      "",
      "  PROJECTS",
      "  ========",
      "",
      "  [01] BLACKSITE-07    Cinematic terminal-based AI thriller game",
      "",
      '  Type "open <name>" for details.',
      '  Example: open blacksite-07',
      "",
    ],
  }),

  skills: () => ({
    output: [
      "",
      "  TECH STACK",
      "  ==========",
      "",
      "  Languages    TypeScript, JavaScript, C++, Python",
      "  Frontend     Next.js, React, Tailwind CSS",
      "  Tools        Blender, Git, Linux",
      "  Game Dev     Web-based game systems",
      "",
    ],
  }),

  contact: () => ({
    output: [
      "",
      "  CONTACT",
      "  =======",
      "",
      "  Discord      ._stinky",
      "  GitHub       [coming soon]",
      "",
    ],
  }),

  open: (args: string[]) => {
    const name = args.join(" ").toLowerCase();
    if (!name) {
      return {
        output: ['  Usage: open <project-name>', '  Example: open blacksite-07'],
        isError: true,
      };
    }

    if (name === "blacksite-07" || name === "blacksite") {
      return {
        output: [
          "",
          "  ╔══════════════════════════════════════════╗",
          "  ║          BLACKSITE-07                    ║",
          "  ╚══════════════════════════════════════════╝",
          "",
          "  Cinematic terminal-based AI thriller game.",
          "",
          "  You're a new operator at a classified DOD",
          "  facility. Something has gone wrong with the",
          "  AI research division. Navigate the terminal",
          "  to uncover what happened.",
          "",
          "  Stack:  Next.js 15, TypeScript, Tailwind",
          "  Style:  Retro CRT terminal aesthetic",
          "  Status: In Development",
          "",
        ],
      };
    }

    return {
      output: [`  Project "${name}" not found. Type "projects" to see available projects.`],
      isError: true,
    };
  },

  theme: (args: string[]) => {
    // Theme switching will be implemented in Phase 5
    const color = args[0]?.toLowerCase();
    if (!color || !["green", "amber", "white"].includes(color)) {
      return {
        output: ["  Usage: theme <green|amber|white>"],
        isError: true,
      };
    }
    return {
      output: [`  Theme switched to ${color}. [Coming soon]`],
    };
  },
};

export function executeCommand(input: string): CommandResult & { command: string } {
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
      output: [`  Command not found: ${cmd}. Type "help" for available commands.`],
      isError: true,
    };
  }

  const result = handler(args);
  return { command: cmd, ...result };
}
