"use client";

import { useEffect, useRef } from "react";

// Proportions are set for a 46px mark and scale with the rendered size.
const DESIGN_SIZE = 46;
const CARBON_RADIUS = 6.5;
const HYDROGEN_RADIUS = 3.8;
const BOND_WIDTH = 1.5;
const BOND_LENGTH = 0.33; // share of the canvas size
const CAMERA_DISTANCE = 6; // in bond lengths; larger means flatter perspective

const SPIN_PER_MS = 0.00035;
const TILT = 0.38;
const TILT_SWAY = 0.1;
const TILT_SWAY_PER_MS = 0.0002;
const START_YAW = 0.6;
const MAX_FRAME_MS = 50;

const CARBON = ["#ecd6b0", "#c8a26b", "#7d6038"] as const;
const HYDROGEN = ["#ffffff", "#dfe4e7", "#98a3aa"] as const;
const BOND = "#8c9aa3";

const INV_SQRT3 = 1 / Math.sqrt(3);
const TETRAHEDRON = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
].map((v) => v.map((n) => n * INV_SQRT3));

function sphere(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  [light, base, edge]: readonly [string, string, string],
) {
  const shade = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  shade.addColorStop(0, light);
  shade.addColorStop(0.55, base);
  shade.addColorStop(1, edge);
  ctx.fillStyle = shade;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawMolecule(ctx: CanvasRenderingContext2D, size: number, yaw: number, tilt: number) {
  const unit = size / DESIGN_SIZE;
  const center = size / 2;
  const bond = size * BOND_LENGTH;
  const carbonRadius = CARBON_RADIUS * unit;
  const [cosYaw, sinYaw, cosTilt, sinTilt] = [Math.cos(yaw), Math.sin(yaw), Math.cos(tilt), Math.sin(tilt)];

  const hydrogens = TETRAHEDRON.map(([x, y, z]) => {
    const rx = x * cosYaw + z * sinYaw;
    const rz = z * cosYaw - x * sinYaw;
    const ry = y * cosTilt - rz * sinTilt;
    const depth = y * sinTilt + rz * cosTilt;
    const scale = CAMERA_DISTANCE / (CAMERA_DISTANCE - depth);
    return { rx, ry, depth, scale };
  });

  const drawHydrogen = ({ rx, ry, scale }: (typeof hydrogens)[number]) => {
    const x = center + rx * bond * scale;
    const y = center + ry * bond * scale;
    // The bond leaves from the carbon's surface, so a near bond never crosses its face.
    ctx.strokeStyle = BOND;
    ctx.lineWidth = BOND_WIDTH * unit;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(center + rx * carbonRadius, center + ry * carbonRadius);
    ctx.lineTo(x, y);
    ctx.stroke();
    sphere(ctx, x, y, HYDROGEN_RADIUS * unit * scale, HYDROGEN);
  };

  const layers = [
    { depth: 0, draw: () => sphere(ctx, center, center, carbonRadius, CARBON) },
    ...hydrogens.map((h) => ({ depth: h.depth, draw: () => drawHydrogen(h) })),
  ];
  ctx.clearRect(0, 0, size, size);
  layers.sort((a, b) => a.depth - b.depth).forEach((layer) => layer.draw());
}

/** A slowly turning methane molecule, drawn in 2D so the bar adds no second WebGL scene. */
export function MethaneMark() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastTime = 0;
    let elapsed = 0;

    const render = () => {
      const size = canvas.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      const pixels = Math.round(size * dpr);
      if (canvas.width !== pixels) canvas.width = canvas.height = pixels;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const tilt = TILT + TILT_SWAY * Math.sin(elapsed * TILT_SWAY_PER_MS);
      drawMolecule(ctx, size, START_YAW + elapsed * SPIN_PER_MS, tilt);
    };

    const tick = (now: number) => {
      // Capped so the molecule resumes where it stopped instead of jumping ahead.
      if (lastTime) elapsed += Math.min(now - lastTime, MAX_FRAME_MS);
      lastTime = now;
      render();
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };

    const sync = () => {
      if (reducedMotion.matches || document.hidden) stop();
      else if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMotionChange = () => {
      sync();
      render();
    };

    render();
    sync();

    // The size changes at the md breakpoint, which matters most for the still frame.
    const resize = new ResizeObserver(render);
    resize.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      stop();
      resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="block size-9 shrink-0 md:size-[46px]" />;
}
