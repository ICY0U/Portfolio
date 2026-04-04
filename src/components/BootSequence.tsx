"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { text: "POST... OK", delay: 200 },
  { text: "BIOS v3.2.1 (c) 1987", delay: 150 },
  { text: "Memory Test: 640K OK", delay: 300 },
  { text: "", delay: 100 },
  { text: "Loading ICU.SYS...", delay: 400 },
  { text: "INIT KERNEL.............. OK", delay: 250 },
  { text: "INIT DISPLAY............. OK", delay: 200 },
  { text: "INIT NETWORK............. OK", delay: 300 },
  { text: "INIT FILESYSTEM.......... OK", delay: 200 },
  { text: "INIT SECURITY............ OK", delay: 250 },
  { text: "", delay: 100 },
  { text: "All systems nominal.", delay: 200 },
  { text: "Establishing secure connection...", delay: 600 },
  { text: "Connection established.", delay: 300 },
  { text: "", delay: 200 },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [skipped, setSkipped] = useState(false);

  // Typing effect: character by character
  useEffect(() => {
    if (skipped) return;
    if (currentLine >= BOOT_LINES.length) {
      const timeout = setTimeout(onComplete, 400);
      return () => clearTimeout(timeout);
    }

    const line = BOOT_LINES[currentLine];

    // Empty lines: just add and move on
    if (line.text === "") {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => [...prev, ""]);
        setCurrentLine((prev) => prev + 1);
        setCharIndex(0);
      }, line.delay);
      return () => clearTimeout(timeout);
    }

    // Type character by character
    if (charIndex < line.text.length) {
      const speed = 18 + Math.random() * 12; // slight randomness
      const timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }

    // Line complete, wait then move to next
    const timeout = setTimeout(() => {
      setVisibleLines((prev) => [...prev, line.text]);
      setCurrentLine((prev) => prev + 1);
      setCharIndex(0);
    }, line.delay);
    return () => clearTimeout(timeout);
  }, [currentLine, charIndex, skipped, onComplete]);

  // Skip on keypress or click
  useEffect(() => {
    const handleSkip = () => {
      if (!skipped) {
        setSkipped(true);
        setVisibleLines(BOOT_LINES.map((l) => l.text));
        setTimeout(onComplete, 200);
      }
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("click", handleSkip);
    return () => {
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("click", handleSkip);
    };
  }, [skipped, onComplete]);

  // Current partially-typed line
  const currentText =
    currentLine < BOOT_LINES.length && !skipped
      ? BOOT_LINES[currentLine].text.slice(0, charIndex)
      : null;

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] p-4 font-mono text-sm">
      {visibleLines.map((line, i) => (
        <div key={i} className="text-green-400 leading-6 whitespace-pre">
          {line}
        </div>
      ))}
      {currentText !== null && (
        <div className="text-green-400 leading-6 whitespace-pre">
          {currentText}
          <span className="animate-pulse">_</span>
        </div>
      )}
      <div className="fixed bottom-4 right-4 text-green-700 text-xs">
        Press any key to skip
      </div>
    </div>
  );
}
