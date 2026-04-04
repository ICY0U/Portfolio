"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { executeCommand } from "@/lib/commands";
import { projects } from "@/lib/projects";
import { projectHeaders } from "@/lib/ascii";

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function LinkifyText({ text }: { text: string }) {
  const parts = text.split(URL_REGEX);
  if (parts.length === 1) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-200 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface TerminalLine {
  id: number;
  type: "input" | "output" | "error";
  text: string;
}

const PROMPT = "visitor@icu.terminal:~$ ";

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lineCounter, setLineCounter] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && hasInteracted) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, hasInteracted]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let id = 0;
    const welcome: TerminalLine[] = [
      { id: id++, type: "output", text: "" },
      { id: id++, type: "output", text: "  ██╗ ██████╗██╗   ██╗" },
      { id: id++, type: "output", text: "  ██║██╔════╝██║   ██║" },
      { id: id++, type: "output", text: "  ██║██║     ██║   ██║" },
      { id: id++, type: "output", text: "  ██║██║     ██║   ██║" },
      { id: id++, type: "output", text: "  ██║╚██████╗╚██████╔╝" },
      { id: id++, type: "output", text: "  ╚═╝ ╚═════╝ ╚═════╝ " },
      { id: id++, type: "output", text: "" },
      { id: id++, type: "output", text: "  ICU.TERMINAL v1.0" },
      { id: id++, type: "output", text: "  Interactive Portfolio System" },
      { id: id++, type: "output", text: "  https://github.com/ICY0U" },
      { id: id++, type: "output", text: "" },
      { id: id++, type: "output", text: "  ─── PROJECTS ───────────────────────────" },
      { id: id++, type: "output", text: "" },
    ];

    projects.forEach((p) => {
      const header = projectHeaders[p.id];
      if (header) {
        header.forEach((line) => {
          welcome.push({ id: id++, type: "output", text: line });
        });
      }
      const status =
        p.status === "Live" ? "LIVE" :
        p.status === "In Development" ? "IN DEV" :
        p.status === "Complete" ? "DONE" : "IDEA";
      welcome.push({ id: id++, type: "output", text: `  ${p.tagline}` });
      welcome.push({ id: id++, type: "output", text: `  Status: ${status}  |  Type: open ${p.id}` });
      if (p.links && p.links.length > 0) {
        p.links.forEach((link) => {
          welcome.push({ id: id++, type: "output", text: `  ${link.label}: ${link.url}` });
        });
      }
      welcome.push({ id: id++, type: "output", text: "" });
    });

    welcome.push({ id: id++, type: "output", text: "  ───────────────────────────────────────" });
    welcome.push({ id: id++, type: "output", text: "" });
    welcome.push({ id: id++, type: "output", text: '  Type "help" for available commands.' });
    welcome.push({ id: id++, type: "output", text: "" });

    setLines(welcome);
    setLineCounter(id);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    const inputLine: TerminalLine = {
      id: lineCounter,
      type: "input",
      text: PROMPT + input,
    };

    const result = executeCommand(input);

    if (result.command === "clear") {
      setLines([]);
      setInput("");
      setLineCounter(lineCounter + 1);
      if (trimmed) {
        setHistory((prev) => [trimmed, ...prev]);
        setHistoryIndex(-1);
      }
      return;
    }

    let nextId = lineCounter + 1;
    const outputLines: TerminalLine[] = result.output.map((text) => ({
      id: nextId++,
      type: result.isError ? ("error" as const) : ("output" as const),
      text,
    }));

    setLines((prev) => [...prev, inputLine, ...outputLines]);
    setLineCounter(nextId);
    setInput("");

    if (trimmed) {
      setHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);
    }
  }, [input, lineCounter, hasInteracted]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length > 0) {
          const newIndex = Math.min(historyIndex + 1, history.length - 1);
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput("");
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [handleSubmit, history, historyIndex]
  );

  return (
    <div
      className="h-screen w-screen flex flex-col bg-[#0a0a0a] cursor-text terminal-glow"
      onClick={handleClick}
    >
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-4 pb-2 ${
          hasInteracted ? "pt-4" : "flex flex-col justify-center"
        }`}
      >
        <div>
          {lines.map((line) => (
            <div
              key={line.id}
              className={`whitespace-pre-wrap text-sm leading-6 ${
                line.type === "error"
                  ? "text-red-400"
                  : line.type === "input"
                  ? "text-green-300"
                  : "text-green-400"
              }`}
            >
              <LinkifyText text={line.text} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center text-sm">
        <span className="text-green-500 whitespace-pre select-none">
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none text-sm"
          style={{ caretColor: "transparent" }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span className="text-green-400 cursor-blink">_</span>
      </div>
    </div>
  );
}
