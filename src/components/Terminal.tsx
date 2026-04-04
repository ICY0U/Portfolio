"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { executeCommand } from "@/lib/commands";
import { projects } from "@/lib/projects";

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
            className="underline hover:text-green-200 cursor-pointer c-function"
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

type LineStyle = "title" | "heading" | "text" | "dim" | "keyword" | "string" | "value" | "error" | "input" | "link";

interface TerminalLine {
  id: number;
  style: LineStyle;
  text: string;
}

function lineClass(style: LineStyle): string {
  switch (style) {
    case "title":    return "glow-green";
    case "heading":  return "c-keyword";
    case "text":     return "c-text";
    case "dim":      return "c-comment";
    case "keyword":  return "c-keyword";
    case "string":   return "c-string";
    case "value":    return "c-number";
    case "error":    return "c-variable";
    case "input":    return "c-green";
    case "link":     return "c-function";
    default:         return "c-text";
  }
}

function buildWelcome(startId: number): { lines: TerminalLine[]; nextId: number } {
  let id = startId;
  const w: TerminalLine[] = [
    { id: id++, style: "title", text: "" },
    { id: id++, style: "title", text: "  ██╗ ██████╗██╗   ██╗" },
    { id: id++, style: "title", text: "  ██║██╔════╝██║   ██║" },
    { id: id++, style: "title", text: "  ██║██║     ██║   ██║" },
    { id: id++, style: "title", text: "  ██║██║     ██║   ██║" },
    { id: id++, style: "title", text: "  ██║╚██████╗╚██████╔╝" },
    { id: id++, style: "title", text: "  ╚═╝ ╚═════╝ ╚═════╝ " },
    { id: id++, style: "text", text: "" },
    { id: id++, style: "keyword", text: "  ICU.TERMINAL v1.0" },
    { id: id++, style: "dim", text: "  Interactive Portfolio System" },
    { id: id++, style: "link", text: "  https://github.com/ICY0U" },
    { id: id++, style: "text", text: "" },
    { id: id++, style: "heading", text: "  ─── PROJECTS ───────────────────────────" },
    { id: id++, style: "text", text: "" },
  ];

  // Compact list: one line per project
  const liveProjects = projects.filter(p => p.status === "Live");
  const devProjects = projects.filter(p => p.status !== "Live");

  liveProjects.forEach((p) => {
    w.push({ id: id++, style: "text", text: `  ▸ ${p.name.padEnd(16)} │ ${p.tagline}` });
  });

  if (devProjects.length > 0) {
    w.push({ id: id++, style: "text", text: "" });
    w.push({ id: id++, style: "dim", text: "  IN DEVELOPMENT" });
    devProjects.forEach((p) => {
      w.push({ id: id++, style: "dim", text: `  ▸ ${p.name.padEnd(16)} │ ${p.tagline}` });
    });
  }

  w.push({ id: id++, style: "text", text: "" });
  w.push({ id: id++, style: "heading", text: "  ───────────────────────────────────────" });
  w.push({ id: id++, style: "text", text: "" });
  w.push({ id: id++, style: "dim", text: '  Type "open <name>" for details  │  "help" for commands' });
  w.push({ id: id++, style: "text", text: "" });

  return { lines: w, nextId: id };
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

  // Initial welcome
  useEffect(() => {
    const { lines: w, nextId } = buildWelcome(0);
    setLines(w);
    setLineCounter(nextId);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    const inputLine: TerminalLine = {
      id: lineCounter,
      style: "input",
      text: PROMPT + input,
    };

    const result = executeCommand(input);

    // Clear: re-show welcome instead of blanking
    if (result.command === "clear") {
      const { lines: w, nextId } = buildWelcome(lineCounter + 1);
      setLines(w);
      setLineCounter(nextId);
      setInput("");
      setHasInteracted(false);
      if (trimmed) {
        setHistory((prev) => [trimmed, ...prev]);
        setHistoryIndex(-1);
      }
      return;
    }

    let nextId = lineCounter + 1;
    const outputLines: TerminalLine[] = result.output.map((text) => ({
      id: nextId++,
      style: result.isError ? ("error" as const) : ("text" as const),
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
        const { lines: w, nextId } = buildWelcome(lineCounter + 1);
        setLines(w);
        setLineCounter(nextId);
        setHasInteracted(false);
      }
    },
    [handleSubmit, history, historyIndex, lineCounter]
  );

  return (
    <div
      className="h-screen w-screen flex flex-col bg-[#0a0a0a] cursor-text"
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
              className={`whitespace-pre-wrap text-sm leading-6 ${lineClass(line.style)}`}
            >
              <LinkifyText text={line.text} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4 flex items-center text-sm">
        <span className="c-green whitespace-pre select-none">
          {PROMPT}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent c-text outline-none text-sm"
          style={{ caretColor: "transparent" }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />
        <span className="c-green cursor-blink">_</span>
      </div>
    </div>
  );
}
