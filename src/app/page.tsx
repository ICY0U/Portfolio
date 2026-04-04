"use client";

import { useState, useCallback } from "react";
import BootSequence from "@/components/BootSequence";
import Terminal from "@/components/Terminal";
import CRTOverlay from "@/components/CRTOverlay";

export default function Home() {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <div className="crt-flicker">
      <CRTOverlay />
      {booted ? (
        <Terminal />
      ) : (
        <BootSequence onComplete={handleBootComplete} />
      )}
    </div>
  );
}
