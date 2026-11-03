/**
 * Shared geometry for the hero: a glass stirred-tank bioreactor plus a small
 * neural-network graph (the ML loop). Used by both the WebGL scene and the
 * static SVG poster so they line up during the cross-fade. World units.
 */
export const RX = {
  x: -0.62, // reactor centre offset (network sits to the right)
  r: 0.78,
  yBottom: -1.2,
  yTop: 0.92,
  corner: 0.3,
  liquidTop: 0.48,
  plateY: 0.97,
  plateR: 0.88,
  plateH: 0.08,
  motorY: 1.31,
  motorR: 0.17,
  motorH: 0.42,
  shaftBottom: -0.95,
  impellers: [-0.74, -0.14],
  impellerR: 0.2,
  spargerY: -1.0,
  spargerR: 0.28,
  baseY: -1.5,
  probes: [
    { a: 0.45, bottom: -0.38, capColor: "#c8a26b" },
    { a: -0.75, bottom: -0.08, capColor: "#7d878d" },
    { a: 2.55, bottom: 0.1, capColor: "#7d878d" },
  ],
  probeR: 0.52,
  wallPortY: -0.1,
} as const;

/** Vessel profile (r, y) from the axis at the bottom to the open top. */
export function vesselProfile(r: number = RX.r, top: number = RX.yTop, steps = 18) {
  const pts: { r: number; y: number }[] = [{ r: 0, y: RX.yBottom }];
  const c = RX.corner;
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
    pts.push({ r: r - c + Math.cos(a) * c, y: RX.yBottom + c + Math.sin(a) * c });
  }
  pts.push({ r, y: top });
  return pts;
}

export function probeTop(i: number) {
  const p = RX.probes[i];
  return {
    x: RX.x + Math.cos(p.a) * RX.probeR,
    y: RX.plateY + RX.plateH / 2 + 0.14,
    z: Math.sin(p.a) * RX.probeR,
  };
}

/** Neural-network layout (to the right of the reactor). */
export const NET = {
  layers: [
    { x: 0.72, ys: [1.02, 0.66, 0.3] },
    { x: 1.2, ys: [1.16, 0.84, 0.52, 0.2] },
    { x: 1.68, ys: [0.9, 0.42] },
  ],
  z: 0.15,
} as const;

/** Data-cloud placement for the scroll transition. */
export const CLOUD = { cx: 0.25, cy: 0.05, half: 1.25 } as const;
