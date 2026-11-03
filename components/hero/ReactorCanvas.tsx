"use client";

import { Canvas, useFrame, type RootState } from "@react-three/fiber";
import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import cloudData from "@/content/data/av-pointcloud.json";
import { CLOUD, NET, RX, probeTop, vesselProfile } from "./reactorGeometry";

/* ───────────────────────── palette ───────────────────────── */
const COL = {
  steel: "#8e989e",
  steelDark: "#5d666c",
  glass: new THREE.Color("#dfe9ee"),
  liquid: "#b88a4f",
  accent: "#c8a26b",
  signal: "#7fb6a8",
  neutral: new THREE.Color("#cfd6d9"),
  stable: new THREE.Color("#7fb6a8"),
  inhib: new THREE.Color("#d9a75f"),
};

export type MorphBus = {
  /** raw scroll progress 0–1, written by the page */
  target: number;
  /** element whose --cloud / --solid CSS vars mirror the smoothed progress */
  el: HTMLElement | null;
};

/* ───────────────────────── helpers ───────────────────────── */
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.55, "rgba(255,255,255,0.5)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(0,0,0,0.6)");
  grd.addColorStop(0.5, "rgba(0,0,0,0.22)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

/* Fresnel glass: transparent centre, bright rim and a vertical highlight streak. */
function glassMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    uniforms: { uOpacity: { value: 1 }, uColor: { value: COL.glass } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uOpacity; uniform vec3 uColor;
      varying vec3 vN; varying vec3 vV;
      void main() {
        vec3 n = normalize(vN);
        if (!gl_FrontFacing) n = -n;
        float f = pow(1.0 - abs(dot(n, vV)), 2.4);
        float streak = smoothstep(0.42, 0.52, n.x) * (1.0 - smoothstep(0.58, 0.7, n.x));
        float a = (0.04 + 0.5 * f + 0.2 * streak) * uOpacity;
        gl_FragColor = vec4(uColor + streak * 0.15, a);
      }`,
  });
}

/* ───────────────────────── solid reactor + ML loop ───────────────────────── */

type Built = {
  root: THREE.Group;
  impellers: THREE.Group[];
  fadeables: { m: THREE.Material & { opacity: number }; base: number }[];
  glass: THREE.ShaderMaterial;
  bubbles: THREE.Points;
  bubbleSeeds: { a: number; r: number; speed: number; phase: number }[];
  forwardPaths: THREE.CurvePath<THREE.Vector3>[];
  controlPaths: THREE.Curve<THREE.Vector3>[];
  fwdPulses: THREE.InstancedMesh;
  ctlPulses: THREE.InstancedMesh;
  labelAnchors: THREE.Vector3[];
};

function buildScene(): Built {
  const root = new THREE.Group();
  const fadeables: Built["fadeables"] = [];
  const std = (color: string, rough = 0.55, metal = 0.35, opts: THREE.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...opts });
    fadeables.push({ m, base: opts.opacity ?? 1 });
    return m;
  };
  const basic = (opts: THREE.MeshBasicMaterialParameters) => {
    const m = new THREE.MeshBasicMaterial(opts);
    fadeables.push({ m, base: opts.opacity ?? 1 });
    return m;
  };
  const line = (opts: THREE.LineBasicMaterialParameters | THREE.LineDashedMaterialParameters, dashed = false) => {
    const m = dashed ? new THREE.LineDashedMaterial(opts) : new THREE.LineBasicMaterial(opts);
    fadeables.push({ m, base: opts.opacity ?? 1 });
    return m;
  };
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, pos: [number, number, number] = [0, 0, 0], parent: THREE.Object3D = root) => {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...pos);
    parent.add(mesh);
    return mesh;
  };

  const reactor = new THREE.Group();
  reactor.position.x = RX.x;
  root.add(reactor);

  const steel = std(COL.steel, 0.38, 0.55);
  const steelDark = std(COL.steelDark, 0.6, 0.3);

  /* stand: base disc + cradle ring + three legs */
  add(new THREE.CylinderGeometry(0.98, 1.02, 0.08, 64), steelDark, [0, RX.baseY, 0], reactor);
  const cradle = add(new THREE.TorusGeometry(RX.r - 0.1, 0.022, 12, 96), steel, [0, RX.yBottom + 0.12, 0], reactor);
  cradle.rotation.x = Math.PI / 2;
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.4;
    const leg = add(new THREE.CylinderGeometry(0.018, 0.018, RX.yBottom + 0.12 - RX.baseY, 8), steel, [Math.cos(a) * (RX.r - 0.1), (RX.yBottom + 0.12 + RX.baseY) / 2, Math.sin(a) * (RX.r - 0.1)], reactor);
    leg.castShadow = false;
  }

  /* internals (opaque, drawn before glass/liquid) */
  add(new THREE.CylinderGeometry(0.018, 0.018, RX.plateY - RX.shaftBottom, 12), steel, [0, (RX.plateY + RX.shaftBottom) / 2, 0], reactor);
  const impellers: THREE.Group[] = [];
  for (const y of RX.impellers) {
    const g = new THREE.Group();
    g.position.y = y;
    add(new THREE.CylinderGeometry(RX.impellerR * 0.62, RX.impellerR * 0.62, 0.012, 32), steel, [0, 0, 0], g);
    add(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16), steel, [0, 0, 0], g);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      const b = add(new THREE.BoxGeometry(0.11, 0.1, 0.008), steel, [Math.cos(a) * RX.impellerR * 0.7, 0, Math.sin(a) * RX.impellerR * 0.7], g);
      b.rotation.y = -a;
    }
    reactor.add(g);
    impellers.push(g);
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    const baffle = add(new THREE.BoxGeometry(0.075, RX.liquidTop - RX.yBottom - 0.35, 0.008), steelDark, [Math.cos(a) * (RX.r - 0.07), (RX.liquidTop + RX.yBottom + 0.3) / 2, Math.sin(a) * (RX.r - 0.07)], reactor);
    baffle.rotation.y = -a;
  }
  const sparger = add(new THREE.TorusGeometry(RX.spargerR, 0.013, 10, 64), steelDark, [0, RX.spargerY, 0], reactor);
  sparger.rotation.x = Math.PI / 2;

  /* probes */
  RX.probes.forEach((p) => {
    const x = Math.cos(p.a) * RX.probeR, z = Math.sin(p.a) * RX.probeR;
    const top = RX.plateY + RX.plateH / 2;
    add(new THREE.CylinderGeometry(0.012, 0.012, top - p.bottom, 8), steel, [x, (top + p.bottom) / 2, z], reactor);
    add(new THREE.CylinderGeometry(0.032, 0.032, 0.14, 16), std(p.capColor, 0.5, 0.2), [x, top + 0.07, z], reactor);
  });

  /* liquid: amber culture */
  const liqProf = vesselProfile(RX.r - 0.035, RX.liquidTop).map((p) => new THREE.Vector2(p.r, p.y));
  const liquid = add(new THREE.LatheGeometry(liqProf, 96), std(COL.liquid, 0.35, 0, { transparent: true, opacity: 0.3, depthWrite: false, emissive: new THREE.Color("#6e4d24"), emissiveIntensity: 0.85 }), [0, 0, 0], reactor);
  liquid.renderOrder = 1;
  const surf = add(new THREE.CircleGeometry(RX.r - 0.035, 96), basic({ color: "#d9b178", transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }), [0, RX.liquidTop, 0], reactor);
  surf.rotation.x = -Math.PI / 2;
  surf.renderOrder = 1;

  /* glass vessel */
  const glass = glassMaterial();
  const vessel = new THREE.Mesh(new THREE.LatheGeometry(vesselProfile().map((p) => new THREE.Vector2(p.r, p.y)), 128), glass);
  vessel.renderOrder = 2;
  reactor.add(vessel);
  const rim = add(new THREE.TorusGeometry(RX.r + 0.01, 0.02, 12, 128), steel, [0, RX.yTop, 0], reactor);
  rim.rotation.x = Math.PI / 2;

  /* head plate, motor, wall port */
  add(new THREE.CylinderGeometry(RX.plateR, RX.plateR, RX.plateH, 96), steel, [0, RX.plateY, 0], reactor);
  add(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 24), steelDark, [0, RX.plateY + 0.1, 0], reactor);
  add(new THREE.CylinderGeometry(RX.motorR, RX.motorR, RX.motorH, 48), std("#6b757b", 0.5, 0.4), [0, RX.motorY, 0], reactor);
  add(new THREE.CylinderGeometry(RX.motorR * 0.9, RX.motorR, 0.04, 48), steel, [0, RX.motorY + RX.motorH / 2 + 0.02, 0], reactor);
  add(new THREE.BoxGeometry(0.12, 0.06, 0.12), std(COL.accent, 0.5, 0.2, { emissive: new THREE.Color(COL.accent), emissiveIntensity: 0.2 }), [0, RX.motorY + 0.06, RX.motorR + 0.01], reactor);
  add(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 12), steel, [RX.r + 0.07, RX.wallPortY, 0], reactor).rotation.z = Math.PI / 2;

  /* bubbles rising from the sparger */
  const BN = 70;
  const bubbleSeeds = Array.from({ length: BN }, (_, i) => ({
    a: (i * 2.399) % (Math.PI * 2),
    r: RX.spargerR * (0.6 + ((i * 37) % 10) / 22),
    speed: 0.18 + ((i * 13) % 9) / 50,
    phase: (i * 0.618) % 1,
  }));
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(BN * 3), 3));
  const bMat = new THREE.PointsMaterial({ size: 0.045, map: dotTexture(), color: "#eef3f4", transparent: true, opacity: 0.6, depthWrite: false, sizeAttenuation: true });
  fadeables.push({ m: bMat, base: 0.6 });
  const bubbles = new THREE.Points(bGeo, bMat);
  bubbles.renderOrder = 1;
  reactor.add(bubbles);

  /* ── ML loop: process data → neural network → operating setpoints ── */
  const net = new THREE.Group();
  root.add(net);
  const nodes = NET.layers.map((l) => l.ys.map((y) => new THREE.Vector3(l.x, y, NET.z)));
  const nodeGeo = new THREE.SphereGeometry(0.04, 16, 12);
  const nodeMat = std(COL.signal, 0.4, 0, { emissive: new THREE.Color(COL.signal), emissiveIntensity: 0.55 });
  const outMat = std(COL.accent, 0.4, 0, { emissive: new THREE.Color(COL.accent), emissiveIntensity: 0.6 });
  nodes.forEach((layer, li) => layer.forEach((p) => add(nodeGeo, li === 2 ? outMat : nodeMat, [p.x, p.y, p.z], net)));
  const edgePts: number[] = [];
  for (let l = 0; l < nodes.length - 1; l++)
    for (const a of nodes[l]) for (const b of nodes[l + 1]) edgePts.push(a.x, a.y, a.z, b.x, b.y, b.z);
  const edges = new THREE.BufferGeometry();
  edges.setAttribute("position", new THREE.Float32BufferAttribute(edgePts, 3));
  net.add(new THREE.LineSegments(edges, line({ color: COL.signal, transparent: true, opacity: 0.22 })));

  // sensor curves (two probes + wall port) → input layer
  const p0 = probeTop(0), p1 = probeTop(1);
  const sensors = [
    new THREE.Vector3(p0.x, p0.y, p0.z),
    new THREE.Vector3(p1.x, p1.y, p1.z),
    new THREE.Vector3(RX.x + RX.r + 0.15, RX.wallPortY, 0),
  ];
  const sensorCurves = sensors.map((s, i) => {
    const t = nodes[0][i];
    const mid = new THREE.Vector3((s.x + t.x) / 2, Math.max(s.y, t.y) + 0.28 - i * 0.12, (s.z + t.z) / 2);
    return new THREE.QuadraticBezierCurve3(s, mid, t);
  });
  sensorCurves.forEach((c) => {
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(40));
    net.add(new THREE.Line(g, line({ color: COL.signal, transparent: true, opacity: 0.45 })));
  });

  // control curves: output → motor (agitation), output → gas inlet (aeration)
  const motorTop = new THREE.Vector3(RX.x, RX.motorY + RX.motorH / 2 + 0.06, 0);
  const gasIn = new THREE.Vector3(RX.x + RX.r * 0.45, RX.baseY + 0.12, 0.25);
  const out0 = nodes[2][0], out1 = nodes[2][1];
  const controlPaths: THREE.Curve<THREE.Vector3>[] = [
    new THREE.CubicBezierCurve3(out0, new THREE.Vector3(out0.x + 0.35, out0.y + 0.85, out0.z), new THREE.Vector3(RX.x + 0.6, motorTop.y + 0.55, 0), motorTop),
    new THREE.CubicBezierCurve3(out1, new THREE.Vector3(out1.x + 0.45, out1.y - 0.6, out1.z), new THREE.Vector3(gasIn.x + 0.9, gasIn.y - 0.05, gasIn.z), gasIn),
  ];
  controlPaths.forEach((c) => {
    const g = new THREE.BufferGeometry().setFromPoints(c.getPoints(60));
    const l = new THREE.Line(g, line({ color: COL.accent, transparent: true, opacity: 0.55, dashSize: 0.05, gapSize: 0.05 }, true));
    l.computeLineDistances();
    net.add(l);
  });

  // forward pulse paths: sensor → input → hidden → output
  const forwardPaths: THREE.CurvePath<THREE.Vector3>[] = [];
  const rng = mulberry32(7);
  for (let k = 0; k < 9; k++) {
    const i = k % 3;
    const h = Math.floor(rng() * 4);
    const o = Math.floor(rng() * 2);
    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(sensorCurves[i]);
    path.add(new THREE.LineCurve3(nodes[0][i], nodes[1][h]));
    path.add(new THREE.LineCurve3(nodes[1][h], nodes[2][o]));
    forwardPaths.push(path);
  }
  const pulseGeo = new THREE.SphereGeometry(0.026, 10, 8);
  const fwdMat = basic({ color: "#bfe3da", transparent: true, opacity: 1 });
  const ctlMat = basic({ color: "#f0cf98", transparent: true, opacity: 1 });
  const fwdPulses = new THREE.InstancedMesh(pulseGeo, fwdMat, forwardPaths.length);
  const ctlPulses = new THREE.InstancedMesh(pulseGeo, ctlMat, 4);
  net.add(fwdPulses, ctlPulses);

  /* contact shadow */
  const shadow = add(new THREE.PlaneGeometry(4.4, 2.4), basic({ map: shadowTexture(), transparent: true, opacity: 1, depthWrite: false }), [RX.x + 0.4, RX.baseY - 0.045, 0]);
  shadow.rotation.x = -Math.PI / 2;

  const labelAnchors = [
    new THREE.Vector3(nodes[1][0].x, nodes[1][0].y + 0.3, NET.z), // ML model
    new THREE.Vector3(nodes[0][2].x + 0.22, nodes[0][2].y - 0.45, NET.z), // process data
    new THREE.Vector3(RX.x + 1.05, RX.motorY + RX.motorH / 2 + 0.42, 0), // setpoints (above control arc)
  ];

  return { root, impellers, fadeables, glass, bubbles, bubbleSeeds, forwardPaths, controlPaths, fwdPulses, ctlPulses, labelAnchors };
}

/* ───────────────────────── point cloud (morph) ───────────────────────── */

function samplePoints(n: number) {
  const rnd = mulberry32(42);
  const start = new Float32Array(n * 3);
  const put = (i: number, x: number, y: number, z: number) => {
    start[i * 3] = x + RX.x;
    start[i * 3 + 1] = y;
    start[i * 3 + 2] = z;
  };
  for (let i = 0; i < n; i++) {
    const u = rnd();
    const a = rnd() * Math.PI * 2;
    if (u < 0.5) {
      // glass wall
      const y = RX.yBottom + RX.corner + rnd() * (RX.yTop - RX.yBottom - RX.corner);
      put(i, Math.cos(a) * RX.r, y, Math.sin(a) * RX.r);
    } else if (u < 0.6) {
      // rounded bottom
      const t = rnd() * (Math.PI / 2);
      const rr = RX.r - RX.corner + Math.cos(-t) * RX.corner;
      put(i, Math.cos(a) * rr, RX.yBottom + RX.corner - Math.sin(t) * RX.corner, Math.sin(a) * rr);
    } else if (u < 0.72) {
      // head plate (top face)
      const rr = Math.sqrt(rnd()) * RX.plateR;
      put(i, Math.cos(a) * rr, RX.plateY + RX.plateH / 2, Math.sin(a) * rr);
    } else if (u < 0.82) {
      // motor
      put(i, Math.cos(a) * RX.motorR, RX.motorY - RX.motorH / 2 + rnd() * RX.motorH, Math.sin(a) * RX.motorR);
    } else if (u < 0.9) {
      // liquid surface
      const rr = Math.sqrt(rnd()) * (RX.r - 0.04);
      put(i, Math.cos(a) * rr, RX.liquidTop, Math.sin(a) * rr);
    } else {
      // shaft + impellers
      const which = RX.impellers[Math.floor(rnd() * 2)];
      const rr = rnd() * RX.impellerR;
      put(i, Math.cos(a) * rr, which + (rnd() - 0.5) * 0.08, Math.sin(a) * rr);
    }
  }
  return start;
}

function buildCloud() {
  {
    const pts = cloudData.points as number[][];
    const n = pts.length;
    const T = pts.map((p) => p[0]), PH = pts.map((p) => p[1]), Y = pts.map((p) => p[2]);
    const rng = (v: number[]) => [Math.min(...v), Math.max(...v)] as const;
    const [t0, t1] = rng(T), [h0, h1] = rng(PH), [y0, y1] = rng(Y);
    const H = CLOUD.half;
    const norm = (v: number, a: number, b: number) => ((v - a) / (b - a)) * 2 * H - H;
    const target = new Float32Array(n * 3);
    const inhib = new Float32Array(n);
    const delay = new Float32Array(n);
    const seed = new Float32Array(n);
    const r = mulberry32(3);
    pts.forEach((p, i) => {
      target[i * 3] = norm(p[0], t0, t1);
      target[i * 3 + 1] = norm(p[2], y0, y1);
      target[i * 3 + 2] = norm(p[1], h0, h1);
      inhib[i] = p[3];
      delay[i] = r() * 0.3;
      seed[i] = r();
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(samplePoints(n), 3));
    geo.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
    geo.setAttribute("aInhib", new THREE.BufferAttribute(inhib, 1));
    geo.setAttribute("aDelay", new THREE.BufferAttribute(delay, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 6);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uRot: { value: 0 },
        uSize: { value: 26 },
        uPR: { value: 1 },
        uCenter: { value: new THREE.Vector3(CLOUD.cx, CLOUD.cy, 0) },
        uNeutral: { value: COL.neutral },
        uStable: { value: COL.stable },
        uInhib: { value: COL.inhib },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aTarget; attribute float aInhib; attribute float aDelay; attribute float aSeed;
        uniform float uProgress, uTime, uRot, uSize, uPR;
        uniform vec3 uCenter, uNeutral, uStable, uInhib;
        varying vec3 vColor; varying float vAlpha;
        float ease(float t) { return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0; }
        void main() {
          float appear = smoothstep(0.02, 0.14, uProgress);
          float t = clamp((uProgress - 0.1 - aDelay) / 0.6, 0.0, 1.0);
          float e = ease(t);
          float c = cos(uRot), s = sin(uRot);
          vec3 tg = vec3(c*aTarget.x + s*aTarget.z, aTarget.y, -s*aTarget.x + c*aTarget.z) + uCenter;
          vec3 p = mix(position, tg, e);
          float arc = sin(e * 3.14159);
          p += vec3(sin(aSeed*12.0 + uTime*0.6), cos(aSeed*7.0 + uTime*0.5), sin(aSeed*5.0 + uTime*0.4)) * 0.22 * arc;
          p.y += sin(uTime*0.8 + aSeed*20.0) * 0.01 * e;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPR * (1.0 + aInhib * 0.4 * e) / -mv.z;
          vColor = mix(uNeutral, mix(uStable, uInhib, aInhib), e);
          vAlpha = appear * (0.5 + 0.45 * e);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor; varying float vAlpha;
        void main() {
          vec2 d = gl_PointCoord - 0.5;
          float r = length(d);
          if (r > 0.5) discard;
          gl_FragColor = vec4(vColor, smoothstep(0.5, 0.12, r) * vAlpha);
        }`,
    });
    return { geo, mat };
  }
}

/* ───────────────────────── scene ───────────────────────── */

const AXES = [
  { to: [1, -1, -1] },
  { to: [-1, 1, -1] },
  { to: [-1, -1, 1] },
] as const;

/** Owns every three.js object and mutates them per frame (outside React's render). */
class ReactorController {
  built = buildScene();
  cloud = buildCloud();
  scene = new THREE.Group();
  axes = new THREE.Group();
  axisMat = new THREE.LineBasicMaterial({ color: "#8c9aa3", transparent: true, opacity: 0 });
  private prog = 0;
  private spin = 0;
  private fadingOn = false;
  private tmp = new THREE.Object3D();
  private v = new THREE.Vector3();

  constructor() {
    const H = CLOUD.half;
    const o = new THREE.Vector3(-H, -H, -H);
    const pts: THREE.Vector3[] = [];
    AXES.forEach((a) => pts.push(o.clone(), new THREE.Vector3(a.to[0] * H, a.to[1] * H, a.to[2] * H)));
    this.axes.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), this.axisMat));
    this.axes.position.set(CLOUD.cx, CLOUD.cy, 0);
    const points = new THREE.Points(this.cloud.geo, this.cloud.mat);
    points.frustumCulled = false;
    this.scene.add(this.built.root, points, this.axes);
  }

  update(state: RootState, delta: number, bus: MorphBus | null, labels: (HTMLDivElement | null)[] | null) {
    const { built, cloud, tmp, v } = this;
    const t = state.clock.getElapsedTime();
    this.prog += ((bus?.target ?? 0) - this.prog) * Math.min(1, delta * 4);
    const p = this.prog;
    const solid = 1 - smooth(0.04, 0.24, p);
    const cloudVis = smooth(0.72, 0.95, p);

    if (bus?.el) {
      bus.el.style.setProperty("--solid", solid.toFixed(3));
      bus.el.style.setProperty("--cloud", cloudVis.toFixed(3));
      bus.el.style.setProperty("--morph", p.toFixed(3));
    }

    // pointer parallax
    const g = this.scene;
    g.rotation.y += (state.pointer.x * 0.14 - g.rotation.y) * 0.04;
    g.rotation.x += (-state.pointer.y * 0.05 - g.rotation.x) * 0.04;

    // solid fade
    const fading = solid < 0.999;
    if (fading && !this.fadingOn) {
      built.fadeables.forEach(({ m }) => {
        if (!m.transparent) {
          m.transparent = true;
          m.needsUpdate = true;
        }
      });
      this.fadingOn = true;
    }
    built.fadeables.forEach(({ m, base }) => (m.opacity = base * solid));
    built.glass.uniforms.uOpacity.value = solid;
    built.root.visible = solid > 0.005;

    if (built.root.visible) {
      built.impellers.forEach((imp) => (imp.rotation.y += delta * 1.9));
      const pos = built.bubbles.geometry.attributes.position as THREE.BufferAttribute;
      built.bubbleSeeds.forEach((s, i) => {
        const life = (s.phase + t * s.speed) % 1;
        const y = RX.spargerY + life * (RX.liquidTop - RX.spargerY - 0.02);
        const rr = s.r + Math.sin(t * 2 + i) * 0.03 + life * 0.15;
        pos.setXYZ(i, Math.cos(s.a + life * 2.2) * rr, y, Math.sin(s.a + life * 2.2) * rr);
      });
      pos.needsUpdate = true;

      built.forwardPaths.forEach((path, i) => {
        const u = (t * 0.22 + i / built.forwardPaths.length) % 1;
        path.getPointAt(u, v);
        tmp.position.copy(v);
        tmp.scale.setScalar(0.6 + 0.4 * Math.sin(u * Math.PI));
        tmp.updateMatrix();
        built.fwdPulses.setMatrixAt(i, tmp.matrix);
      });
      built.fwdPulses.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 4; i++) {
        const c = built.controlPaths[i % 2];
        const u = (t * 0.18 + i * 0.5 + (i % 2) * 0.25) % 1;
        c.getPointAt(u, v);
        tmp.position.copy(v);
        tmp.scale.setScalar(1);
        tmp.updateMatrix();
        built.ctlPulses.setMatrixAt(i, tmp.matrix);
      }
      built.ctlPulses.instanceMatrix.needsUpdate = true;
    }

    // data cloud
    this.spin += delta * 0.07 * cloudVis;
    const rot = -0.8 + p * 0.4 + this.spin;
    const u = cloud.mat.uniforms;
    u.uProgress.value = p;
    u.uTime.value = t;
    u.uRot.value = rot;
    u.uPR.value = state.gl.getPixelRatio();
    this.axes.rotation.y = rot;
    this.axisMat.opacity = cloudVis * 0.6;

    // projected HTML labels
    if (!labels) return;
    const { width, height } = state.size;
    const project = (wp: THREE.Vector3, el: HTMLDivElement | null, alpha: number) => {
      if (!el) return;
      v.copy(wp).applyEuler(g.rotation).project(state.camera);
      el.style.transform = `translate(${((v.x + 1) / 2) * width}px, ${((1 - v.y) / 2) * height}px) translate(-50%, -50%)`;
      el.style.opacity = alpha.toFixed(3);
    };
    built.labelAnchors.forEach((a, i) => project(a, labels[i], solid));
    const H = CLOUD.half * 1.12;
    const c = Math.cos(rot), sn = Math.sin(rot);
    AXES.forEach((a, i) => {
      const x = a.to[0] * H, y = a.to[1] * H, z = a.to[2] * H;
      project(new THREE.Vector3(c * x + sn * z + CLOUD.cx, y + CLOUD.cy, -sn * x + c * z), labels[3 + i], cloudVis);
    });
  }
}

function Scene({ bus, labels }: { bus: RefObject<MorphBus>; labels: RefObject<(HTMLDivElement | null)[]> }) {
  const [ctl] = useState(() => new ReactorController());
  useFrame((state, delta) => ctl.update(state, delta, bus.current, labels.current));
  return <primitive object={ctl.scene} />;
}

const LABELS = [
  { text: "ML model", cls: "text-signal" },
  { text: "Process data", cls: "text-muted" },
  { text: "Optimised setpoints", cls: "text-accent" },
  { text: "Temperature →", cls: "text-muted" },
  { text: "Methane yield ↑", cls: "text-muted" },
  { text: "pH", cls: "text-muted" },
];

export default function ReactorCanvas({ bus, onReady }: { bus: RefObject<MorphBus>; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.3, 7.2], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        onCreated={() => onReady?.()}
        aria-hidden
      >
        <hemisphereLight args={["#e3eaed", "#1f272d", 1.1]} />
        <directionalLight position={[4, 6, 5]} intensity={2.1} color="#f4f1ea" />
        <directionalLight position={[-5, 2.5, -4]} intensity={1.3} color="#9fb8c4" />
        <ambientLight intensity={0.15} />
        <Scene bus={bus} labels={labels} />
      </Canvas>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {LABELS.map((l, i) => (
          <div
            key={l.text}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={`absolute top-0 left-0 font-mono text-[0.625rem] tracking-[0.14em] whitespace-nowrap uppercase opacity-0 ${l.cls}`}
          >
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
}
