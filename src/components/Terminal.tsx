"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { executeCommand } from "@/lib/commands";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const welcome: TerminalLine[] = [
      { id: 0, type: "output", text: "" },
      { id: 1, type: "output", text: "  ██╗ ██████╗██╗   ██╗" },
      { id: 2, type: "output", text: "  ██║██╔════╝██║   ██║" },
      { id: 3, type: "output", text: "  ██║██║     ██║   ██║" },
      { id: 4, type: "output", text: "  ██║██║     ██║   ██║" },
      { id: 5, type: "output", text: "  ██║╚██████╗╚██████╔╝" },
      { id: 6, type: "output", text: "  ╚═╝ ╚═════╝ ╚═════╝ " },
      { id: 7, type: "output", text: "" },
      { id: 8, type: "output", text: "  ICU.TERMINAL v1.0" },
      { id: 9, type: "output", text: "  Interactive Portfolio System" },
      { id: 10, type: "output", text: "" },
      { id: 11, type: "output", text: '  Type "help" for available commands.' },
      { id: 12, type: "output", text: "" },
    ];
    setLines(welcome);
    setLineCounter(13);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();

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
  }, [input, lineCounter]);

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
        className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
      >
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
            {line.text}
          </div>
        ))}
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
