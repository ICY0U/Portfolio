export default function CRTOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* Screen edge vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), inset 0 0 200px rgba(0,0,0,0.3)",
        }}
      />

      {/* Subtle green glow around edges */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          boxShadow: "inset 0 0 60px rgba(0,255,65,0.03)",
        }}
      />
    </>
  );
}
