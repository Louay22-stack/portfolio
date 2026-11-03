import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Shared social card: slate canvas, bioreactor mark, title block. */
export function ogCard({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#1f272d",
          color: "#e7ecee",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: -0.5 }}>
            Louay Ouhibi<span style={{ color: "#c8a26b" }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 4, color: "#c8a26b", textTransform: "uppercase" }}>{kicker}</div>
            <div style={{ fontSize: 68, lineHeight: 1.04, letterSpacing: -2, marginTop: 20, maxWidth: 760 }}>{title}</div>
            <div style={{ fontSize: 26, color: "#8c9aa3", marginTop: 24, maxWidth: 720 }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 300 }}>
          <svg width="250" height="340" viewBox="0 0 66 90">
            <rect x="8" y="80" width="40" height="3" rx="1" fill="#4a5359" />
            <path d="M12 22 V66 Q12 76 22 76 H34 Q44 76 44 66 V22 Z" fill="#b88a4f" fillOpacity="0.35" />
            <path d="M10 18 V66 Q10 78 22 78 H34 Q46 78 46 66 V18" fill="none" stroke="#dfe9ee" strokeOpacity="0.55" strokeWidth="1.2" />
            <line x1="28" y1="14" x2="28" y2="70" stroke="#a9b2b6" strokeWidth="1.2" />
            <rect x="22" y="44" width="12" height="3" fill="#8e989e" />
            <rect x="22" y="62" width="12" height="3" fill="#8e989e" />
            <rect x="7" y="14" width="42" height="4" rx="1" fill="#8e989e" />
            <rect x="23" y="4" width="10" height="10" rx="1.5" fill="#6b757b" />
            <line x1="52" y1="20" x2="60" y2="28" stroke="#7fb6a8" strokeOpacity="0.5" />
            <line x1="52" y1="36" x2="60" y2="28" stroke="#7fb6a8" strokeOpacity="0.5" />
            <circle cx="52" cy="20" r="2" fill="#7fb6a8" />
            <circle cx="52" cy="36" r="2" fill="#7fb6a8" />
            <circle cx="60" cy="28" r="2.4" fill="#c8a26b" />
          </svg>
        </div>
      </div>
    ),
    ogSize,
  );
}
