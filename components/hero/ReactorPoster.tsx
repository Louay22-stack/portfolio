import { NET, RX, vesselProfile } from "./reactorGeometry";

const S = 100; // world unit → px
const X = (x: number) => +(x * S).toFixed(1);
const Y = (y: number) => +(-y * S).toFixed(1);

/**
 * Static vector rendering of the bioreactor and its ML loop. Serves as the
 * LCP image, the reduced-motion / no-WebGL fallback, and the poster the 3D
 * scene cross-fades over. Framing matches the WebGL camera.
 */
export function ReactorPoster({ className }: { className?: string }) {
  const prof = vesselProfile();
  const right = prof.map((p) => `${X(RX.x + p.r)},${Y(p.y)}`);
  const left = [...prof].reverse().map((p) => `${X(RX.x - p.r)},${Y(p.y)}`);
  const vessel = `M ${right.join(" L ")} L ${left.join(" L ")} Z`;
  const lprof = vesselProfile(RX.r - 0.035, RX.liquidTop);
  const lr = lprof.map((p) => `${X(RX.x + p.r)},${Y(p.y)}`);
  const ll = [...lprof].reverse().map((p) => `${X(RX.x - p.r)},${Y(p.y)}`);
  const liquid = `M ${lr.join(" L ")} L ${ll.join(" L ")} Z`;

  const nodes = NET.layers.map((l) => l.ys.map((y) => ({ x: X(l.x), y: Y(y) })));
  const cx = X(RX.x);
  const plateTop = Y(RX.plateY + RX.plateH / 2);
  const motorTop = Y(RX.motorY + RX.motorH / 2);
  const probeXs = RX.probes.map((p) => X(RX.x + Math.cos(p.a) * RX.probeR));

  return (
    <svg viewBox="-243 -250 486 440" className={className} role="img" aria-label="Glass stirred-tank bioreactor with probes and impellers, connected to a small neural network that feeds optimised setpoints back to the reactor">
      <defs>
        <linearGradient id="rp-liquid" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#c99b5e" stopOpacity="0.55" />
          <stop offset="1" stopColor="#7a5a32" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="rp-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#dfe9ee" stopOpacity="0.28" />
          <stop offset="0.18" stopColor="#dfe9ee" stopOpacity="0.04" />
          <stop offset="0.68" stopColor="#dfe9ee" stopOpacity="0.02" />
          <stop offset="0.74" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="0.8" stopColor="#dfe9ee" stopOpacity="0.04" />
          <stop offset="1" stopColor="#dfe9ee" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="rp-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#59636a" />
          <stop offset="0.45" stopColor="#a9b2b6" />
          <stop offset="1" stopColor="#4a5359" />
        </linearGradient>
        <radialGradient id="rp-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={X(RX.x + 0.4)} cy={Y(RX.baseY) + 6} rx="200" ry="18" fill="url(#rp-shadow)" />
      {/* base + legs */}
      <rect x={cx - 100} y={Y(RX.baseY) - 4} width="200" height="8" rx="2" fill="#4a5359" />
      {[-0.55, 0, 0.55].map((k) => (
        <line key={k} x1={cx + k * 100} x2={cx + k * 100} y1={Y(RX.yBottom + 0.12)} y2={Y(RX.baseY)} stroke="#7d878d" strokeWidth="3" />
      ))}

      {/* liquid + internals */}
      <path d={liquid} fill="url(#rp-liquid)" />
      <line x1={cx} x2={cx} y1={plateTop} y2={Y(RX.shaftBottom)} stroke="#a9b2b6" strokeWidth="3" />
      {RX.impellers.map((y) => (
        <g key={y}>
          <rect x={cx - 20} y={Y(y) - 6} width="40" height="12" fill="#8e989e" />
          <rect x={cx - 13} y={Y(y) - 1} width="26" height="2" fill="#5d666c" />
        </g>
      ))}
      <ellipse cx={cx} cy={Y(RX.spargerY)} rx={RX.spargerR * S} ry="4" fill="none" stroke="#5d666c" strokeWidth="2" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={cx + Math.sin(i * 2.3) * 24} cy={Y(RX.spargerY + 0.1 + ((i * 0.37) % 1) * 1.3)} r={1.6 + (i % 3) * 0.5} fill="#eef3f4" fillOpacity="0.55" />
      ))}
      {RX.probes.map((p, i) => (
        <g key={i}>
          <line x1={probeXs[i]} x2={probeXs[i]} y1={plateTop} y2={Y(p.bottom)} stroke="#8e989e" strokeWidth="2" />
          <rect x={probeXs[i] - 3.5} y={plateTop - 14} width="7" height="14" fill={p.capColor} />
        </g>
      ))}

      {/* glass */}
      <path d={vessel} fill="url(#rp-glass)" stroke="#dfe9ee" strokeOpacity="0.35" strokeWidth="1.2" />
      <line x1={X(RX.x - RX.r) - 2} x2={X(RX.x + RX.r) + 2} y1={Y(RX.liquidTop)} y2={Y(RX.liquidTop)} stroke="#d9b178" strokeOpacity="0.6" />

      {/* head plate + motor */}
      <rect x={X(RX.x - RX.plateR)} y={plateTop} width={RX.plateR * 2 * S} height={RX.plateH * S} rx="2" fill="url(#rp-steel)" />
      <rect x={cx - RX.motorR * S} y={motorTop} width={RX.motorR * 2 * S} height={RX.motorH * S} rx="3" fill="#6b757b" />
      <rect x={cx - 6} y={Y(RX.motorY + 0.09)} width="12" height="6" fill="#c8a26b" />

      {/* ML loop */}
      <g fill="none" strokeWidth="1">
        {nodes.slice(0, -1).flatMap((layer, l) =>
          layer.flatMap((a) => nodes[l + 1].map((b) => <line key={`${a.x}${a.y}${b.x}${b.y}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7fb6a8" strokeOpacity="0.22" />)),
        )}
        <path d={`M ${probeXs[0]} ${plateTop - 14} Q ${(probeXs[0] + nodes[0][0].x) / 2} ${nodes[0][0].y - 30} ${nodes[0][0].x} ${nodes[0][0].y}`} stroke="#7fb6a8" strokeOpacity="0.5" />
        <path d={`M ${X(RX.x + RX.r + 0.15)} ${Y(RX.wallPortY)} Q ${(X(RX.x + RX.r) + nodes[0][2].x) / 2} ${nodes[0][2].y - 10} ${nodes[0][2].x} ${nodes[0][2].y}`} stroke="#7fb6a8" strokeOpacity="0.5" />
        <path d={`M ${nodes[2][0].x} ${nodes[2][0].y} C ${nodes[2][0].x + 35} ${nodes[2][0].y - 85} ${X(RX.x + 0.6)} ${motorTop - 55} ${cx} ${motorTop - 6}`} stroke="#c8a26b" strokeOpacity="0.6" strokeDasharray="4 4" />
      </g>
      {nodes.map((layer, l) =>
        layer.map((n) => <circle key={`${n.x}${n.y}`} cx={n.x} cy={n.y} r="4" fill={l === 2 ? "#c8a26b" : "#7fb6a8"} />),
      )}
    </svg>
  );
}
