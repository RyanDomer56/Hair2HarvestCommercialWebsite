"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * MCH-01 — Rotary composting drum
 *
 * The actual machine described by Modules 5 (Batch & Composting) and 6
 * (Machine Monitoring & Control), not a generic factory: a finned motor and
 * gearbox drive a belt around the drum shaft, a cutaway shell reveals the
 * helical paddles and the compost bed, hair enters through the intake hopper,
 * and finished compost leaves the discharge chute. A probe and a control
 * cabinet carry the live telemetry.
 *
 * Everything is procedural three.js — no models, no images, no network.
 * The web panel only ever sends authorised start/stop: the E-stop is local
 * hardware, and it is drawn here in rust as a reminder of that boundary.
 */

export type CompostingDrum3DProps = {
  height?: number | string;
  className?: string;
  /** Clean hero mode: chrome hidden, wheel scrolls the page. */
  embed?: boolean;
  onPart?: (id: PartId) => void;
  onReady?: () => void;
};

export default function CompostingDrum3D({
  height = "100%",
  className,
  embed = false,
  onPart,
  onReady,
}: CompostingDrum3DProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onPart, onReady });

  useEffect(() => {
    handlers.current = { onPart, onReady };
  }, [onPart, onReady]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let dispose: (() => void) | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      dispose = initDrumScene(root, getComputedStyle(root).fontFamily, {
        embedded: embed,
        onPart: (id) => handlers.current.onPart?.(id),
        onReady: () => handlers.current.onReady?.(),
      });
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [embed]);

  return (
    <div
      ref={rootRef}
      className={["h2h-drum", embed && "embed", className].filter(Boolean).join(" ")}
      style={{ height }}
    >
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        id="scene"
        role="img"
        aria-label="Interactive 3D cutaway of the Hair2Harvest rotary composting drum: a finned motor drives a belt and gearbox, a transparent drum reveals helical paddles turning a bed of compost, hair enters through a hopper and finished compost leaves through a discharge chute. Drag to rotate, scroll to zoom, click a part to inspect it."
      />
      <div className="vignette" />
      <header className="topbar debug-ui">
        <div className="identity">
          <div className="mark">
            <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 3.5v13M3.5 10h13" stroke="currentColor" strokeWidth="1.1" />
            </svg>
          </div>
          <div>
            <strong>MCH-01 · Rotary drum</strong>
            <small>Batch &amp; composting · live</small>
          </div>
        </div>
        <div className="status" id="status">
          <i />
          <span id="status-text">Motor running</span>
          <span>8 RPM</span>
        </div>
      </header>
      <div className="scene-heading debug-ui">
        Hair in · compost out <span className="index">MODULE 5 / MODULE 6</span>
      </div>
      <div className="coordinates debug-ui">MCH-01 — BALANGA LINE</div>
      <div id="journey" className="debug-ui">
        <div className="journey-icon">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 5h10v6H3zM6 2v3m4-3v3M5 11v3m6-3v3" stroke="currentColor" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <strong id="journey-title">Intake</strong>
          <small id="journey-detail">Clean hair · BATCH-2603</small>
        </div>
        <div className="track">
          <i id="journey-progress" />
        </div>
      </div>
      <div id="labels" />
      <div id="tooltip" role="tooltip">
        <strong />
        <p />
      </div>
      <div className="controls debug-ui">
        <nav className="mode-bar" aria-label="Diagram mode">
          <button data-mode="assembled" aria-pressed="true">
            <svg viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" />
              <path d="M8 2v12M2 8h12" stroke="currentColor" />
            </svg>
            Assembled
          </button>
          <button data-mode="cutaway" aria-pressed="false">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M2 3h12v10H2zM8 3v10M10 5l2 2m-2 1l2 2" stroke="currentColor" strokeLinejoin="round" />
            </svg>
            Cutaway
          </button>
          <button data-mode="parts" aria-pressed="false">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5l6 3-6 3-6-3 6-3zM2 8l6 3 6-3M2 11.5l6 3 6-3" stroke="currentColor" strokeLinejoin="round" />
            </svg>
            Assemblies
          </button>
          <button data-mode="flow" aria-pressed="false">
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M5 2.5l8 5.5-8 5.5v-11z" stroke="currentColor" strokeLinejoin="round" />
            </svg>
            One batch
          </button>
        </nav>
        <nav className="camera-row" aria-label="Camera">
          <span className="caption">VIEW</span>
          <button data-camera="overview" aria-pressed="true">Overview</button>
          <button data-camera="drum" aria-pressed="false">Drum</button>
          <button data-camera="motor" aria-pressed="false">Motor</button>
          <button data-camera="top" aria-pressed="false">Top</button>
          <button data-camera="flight" aria-pressed="false">Flight</button>
          <span className="divider" />
          <button id="play" aria-label="Pause the animation" aria-pressed="false">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="2" y="1" width="2.5" height="10" rx=".5" />
              <rect x="7.5" y="1" width="2.5" height="10" rx=".5" />
            </svg>
          </button>
        </nav>
      </div>
      <footer className="footer">
        <a className="wordmark" href="/system" target="_blank" rel="noopener">
          hair2harvest.ph · <span>system spec</span>
        </a>
        <span className="footer-center debug-ui">E-STOP IS LOCAL HARDWARE</span>
        <span className="hint debug-ui">
          <svg width="13" height="16" viewBox="0 0 13 16" fill="none">
            <rect x="2" y="1" width="9" height="14" rx="4.5" stroke="currentColor" />
            <path d="M6.5 4v3" stroke="currentColor" strokeLinecap="round" />
          </svg>
          Rotate. Zoom. Inspect a part.
        </span>
      </footer>
      <div id="loading">
        <i />
        <span>Starting the drum</span>
      </div>
      <div id="error" role="alert">
        <strong>The 3D diagram could not start</strong>
        <p>Check that WebGL is turned on in your browser.</p>
        <button onClick={() => location.reload()}>Try again</button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------

export type DrumMode = "assembled" | "cutaway" | "parts" | "flow";
export type DrumCamera = "overview" | "drum" | "motor" | "top" | "flight";
export type PartId = "motor" | "drum" | "intake" | "discharge" | "sensor" | "cabinet";

export type DrumApi = {
  setMode: (name: string) => boolean;
  focusPart: (id: string) => boolean;
  setCamera: (name: string) => boolean;
  play: () => boolean;
  pause: () => boolean;
};

declare global {
  interface Window {
    __drum?: DrumApi;
    __drumDebug?: { getState: () => Record<string, unknown> };
  }
}

type SceneOptions = {
  embedded: boolean;
  onPart?: (id: PartId) => void;
  onReady?: () => void;
};

type PartDef = {
  id: PartId;
  name: string;
  meta: string;
  desc: string;
  group: THREE.Group;
  base: THREE.Vector3;
  label: HTMLDivElement;
  anchor: THREE.Vector3;
  index: number;
};

function initDrumScene(
  root: HTMLElement,
  fontFamily: string,
  options: SceneOptions,
): () => void {
  const cleanups: Array<() => void> = [];
  const frameWidth = () => root.clientWidth;
  const frameHeight = () => root.clientHeight;

  const listen = (target: EventTarget, type: string, handler: (event: never) => void) => {
    const fn = handler as unknown as EventListener;
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };

  function $<T extends HTMLElement = HTMLElement>(id: string): T {
    const el = root.querySelector<T>(`#${id}`);
    if (!el) throw new Error(`Scene markup is missing #${id}`);
    return el;
  }

  function showError(message?: string) {
    $("loading").classList.add("done");
    $("error").style.display = "block";
    if (message) $("error").querySelector("p")!.textContent = message;
  }

  const dispose = () => {
    for (const fn of cleanups.reverse()) fn();
    cleanups.length = 0;
  };

  try {
    const TAU = Math.PI * 2;
    const embedded = options.embedded;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const LIME = 0xd9f26b;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, frameWidth() / frameHeight(), 0.1, 160);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      showError("WebGL is not available. Turn on hardware acceleration in your browser and reload.");
      throw e;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, frameWidth() < 900 ? 1.5 : 1.75));
    renderer.setSize(frameWidth(), frameHeight());
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.localClippingEnabled = true;
    $("scene").appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enablePan = false;
    controls.minDistance = 8;
    controls.maxDistance = 60;
    controls.minPolarAngle = 0.1;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.rotateSpeed = 0.48;
    controls.zoomSpeed = 0.7;
    if (embedded) {
      controls.enableZoom = false;
      if (matchMedia("(pointer:coarse)").matches) controls.enableRotate = false;
    }

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.65;
    room.dispose();
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xdbe5f4, 0x2a2418, 2));
    const key = new THREE.DirectionalLight(0xfff1d8, 4.0);
    key.position.set(-5, 12, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    Object.assign(key.shadow.camera, {
      left: -11, right: 11, top: 10, bottom: -10, near: 0.5, far: 40,
    });
    key.shadow.normalBias = 0.035;
    key.shadow.bias = -0.0002;
    key.shadow.radius = 4;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xc4d4ed, 3.0);
    rim.position.set(4, 7, -9);
    scene.add(rim);
    const warm = new THREE.PointLight(LIME, 22, 20, 2);
    warm.position.set(-4, 4, 3);
    scene.add(warm);
    const front = new THREE.DirectionalLight(0xffffff, 1.0);
    front.position.set(6, 4, 11);
    scene.add(front);

    // ---------------------------------------------------------- materials
    const mat = (
      color: number,
      metalness = 0.1,
      roughness = 0.4,
      extra: THREE.MeshStandardMaterialParameters = {},
    ) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });

    const M = {
      base: mat(0x292f37, 0.85, 0.32),
      body: mat(0x333a41, 0.75, 0.3),
      edge: mat(0x707986, 0.85, 0.24),
      chrome: mat(0xc3cad0, 0.92, 0.18),
      dark: mat(0x12171d, 0.45, 0.38),
      rubber: mat(0x0b1015, 0.1, 0.6),
      lime: mat(LIME, 0.5, 0.28),
      ivory: mat(0xe0ded4, 0.45, 0.3),
      copper: mat(0xb9814a, 0.8, 0.34),
      drum: mat(0x8a9377, 0.72, 0.36),
      soil: mat(0x3b2f20, 0.02, 0.95),
      soilLight: mat(0x59472d, 0.02, 0.95),
      hair: mat(0x242a12, 0.15, 0.6),
      light: mat(LIME, 0.2, 0.25, { emissive: LIME, emissiveIntensity: 1.5 }),
      green: mat(0x8fbf52, 0.1, 0.35, { emissive: 0x6b9c32, emissiveIntensity: 0.9 }),
      rust: mat(0xa6402a, 0.3, 0.45, { emissive: 0x5a1a0e, emissiveIntensity: 0.5 }),
      glass: mat(0x8fa39a, 0.5, 0.14, {
        transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false,
      }),
      paper: mat(0xf4f1ea, 0, 0.85),
    };

    type Vec3 = [number, number, number];
    type Material = THREE.Material;
    const geometries = new Map<string, THREE.BufferGeometry>();

    function boxGeo(w: number, h: number, d: number, r = 0.04) {
      const k = `b${w},${h},${d},${r}`;
      if (!geometries.has(k)) {
        geometries.set(
          k,
          r
            ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3))
            : new THREE.BoxGeometry(w, h, d),
        );
      }
      return geometries.get(k)!;
    }

    function box(
      parent: THREE.Object3D, w: number, h: number, d: number,
      x: number, y: number, z: number, m: Material = M.body, r = 0.04,
    ) {
      const o = new THREE.Mesh(boxGeo(w, h, d, r), m);
      o.position.set(x, y, z);
      o.castShadow = true;
      o.receiveShadow = true;
      parent.add(o);
      return o;
    }

    function cyl(
      parent: THREE.Object3D, rt: number, rb: number, h: number,
      x: number, y: number, z: number, m: Material = M.chrome, segments = 24,
      axis: "x" | "y" | "z" = "y",
    ) {
      const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segments), m);
      o.position.set(x, y, z);
      if (axis === "x") o.rotation.z = Math.PI / 2;
      if (axis === "z") o.rotation.x = Math.PI / 2;
      o.castShadow = true;
      o.receiveShadow = true;
      parent.add(o);
      return o;
    }

    function ring(
      parent: THREE.Object3D, radius: number, tube: number,
      x: number, y: number, z: number, m: Material = M.chrome,
      axis: "x" | "y" | "z" = "x",
    ) {
      const o = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 40), m);
      o.position.set(x, y, z);
      if (axis === "x") o.rotation.y = Math.PI / 2;
      if (axis === "y") o.rotation.x = Math.PI / 2;
      o.castShadow = true;
      parent.add(o);
      return o;
    }

    function ball(
      parent: THREE.Object3D, radius: number, x: number, y: number, z: number,
      m: Material = M.chrome,
    ) {
      const o = new THREE.Mesh(new THREE.SphereGeometry(radius, 10, 8), m);
      o.position.set(x, y, z);
      parent.add(o);
      return o;
    }

    function tube(
      parent: THREE.Object3D, pts: Vec3[], radius: number,
      m: Material = M.chrome, closed = false,
    ) {
      const curve = new THREE.CatmullRomCurve3(
        pts.map((p) => new THREE.Vector3(...p)), closed, "catmullrom", 0.2,
      );
      const o = new THREE.Mesh(
        new THREE.TubeGeometry(curve, Math.max(24, pts.length * 8), radius, 8, closed), m,
      );
      o.castShadow = true;
      parent.add(o);
      return { mesh: o, curve };
    }

    type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
    function canvasTexture(w: number, h: number, draw: Draw) {
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d")!;
      draw(ctx, w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
      return { texture: t, canvas: c, ctx };
    }

    function print(
      ctx: CanvasRenderingContext2D, txt: string, x: number, y: number,
      size = 20, color = "#f4f1ea", weight = 500,
    ) {
      ctx.fillStyle = color;
      ctx.font = `${weight} ${size}px ${fontFamily}`;
      ctx.fillText(txt, x, y);
    }

    function screen(
      parent: THREE.Object3D, w: number, h: number,
      x: number, y: number, z: number, tex: THREE.Texture,
    ) {
      const o = new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
      );
      o.position.set(x, y, z);
      parent.add(o);
      return o;
    }

    // ------------------------------------------------------------- the skid
    const machine = new THREE.Group();
    scene.add(machine);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: 0.24 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.44;
    floor.receiveShadow = true;
    scene.add(floor);

    const shadowTex = canvasTexture(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(64, 64, 10, 64, 64, 64);
      g.addColorStop(0, "rgba(0,0,0,.8)");
      g.addColorStop(0.55, "rgba(0,0,0,.4)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const contact = new THREE.Mesh(
      new THREE.PlaneGeometry(19, 13),
      new THREE.MeshBasicMaterial({
        map: shadowTex.texture, transparent: true, depthWrite: false, opacity: 0.65,
      }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = -0.415;
    scene.add(contact);

    box(machine, 13.4, 0.38, 8.6, 0, -0.09, 0, M.base, 0.17);
    box(machine, 13.2, 0.055, 8.42, 0, 0.13, 0, M.edge, 0.11);
    box(machine, 13.05, 0.09, 8.3, 0, 0.19, 0, M.body, 0.1);
    box(machine, 13.15, 0.027, 8.36, 0, -0.19, 0, M.dark, 0.06);
    box(machine, 12.4, 0.026, 0.032, 0, -0.17, 4.34, M.light, 0.01);

    for (const x of [-6, 6]) {
      for (const z of [-3.5, 3.5]) {
        cyl(machine, 0.38, 0.38, 0.25, x, -0.31, z, M.rubber);
        cyl(machine, 0.28, 0.28, 0.09, x, -0.4, z, M.dark);
        cyl(machine, 0.055, 0.055, 0.026, x, 0.253, z, M.chrome, 12);
      }
    }

    const engraving = canvasTexture(1536, 176, (c, w, h) => {
      c.fillStyle = "#252b32";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "#4d545c";
      c.lineWidth = 2;
      c.strokeRect(2, 2, w - 4, h - 4);
      print(c, "MCH-01", 45, 79, 40, "#d9d8cd", 650);
      print(c, "·  rotary composter  ·  8 rpm  ·  45 day cure", 285, 79, 33, "#b8bdc1", 450);
      print(c, "MODULE 5 / BATCH    ·    MODULE 6 / MACHINE", 47, 133, 19, "#737e88", 500);
      print(c, "No. 001", 1360, 130, 23, "#b9814a");
    });
    const nameplate = screen(machine, 7.6, 0.86, -0.3, 0.25, 3.68, engraving.texture);
    nameplate.rotation.x = -Math.PI / 2;

    // roller stands + idler wheels
    for (const x of [-1.5, 2.05]) {
      for (const z of [-1.05, 1.05]) {
        box(machine, 0.62, 0.78, 0.5, x, 0.65, z, M.body, 0.06);
        const roller = cyl(machine, 0.26, 0.26, 0.34, x, 1.08, z, M.chrome, 20, "x");
        roller.rotation.set(0, 0, Math.PI / 2);
        roller.rotation.x = 0;
      }
      box(machine, 0.18, 0.6, 2.5, x, 0.55, 0, M.dark, 0.03);
    }

    // ---------------------------------------------------------- the drum
    const drumAssembly = new THREE.Group();
    machine.add(drumAssembly);

    const DRUM_Y = 2.6;
    const DRUM_R = 1.65;
    const DRUM_L = 5.2;

    const drumSpin = new THREE.Group();
    drumSpin.position.set(0.35, DRUM_Y, 0);
    drumAssembly.add(drumSpin);

    // cutaway shell — transparent so the paddles and compost are always legible
    const shellMat = M.glass.clone() as THREE.MeshStandardMaterial;
    shellMat.opacity = 0.3;
    const shell = cyl(drumSpin, DRUM_R, DRUM_R, DRUM_L, 0, 0, 0, shellMat, 48, "x");
    shell.castShadow = false;

    // solid bands define the cylinder silhouette
    for (const x of [-DRUM_L / 2 + 0.12, -1.05, 1.05, DRUM_L / 2 - 0.12]) {
      ring(drumSpin, DRUM_R + 0.05, 0.075, x, 0, 0, M.copper, "x");
    }

    // end caps with bolt circles
    for (const side of [-1, 1]) {
      const x = side * (DRUM_L / 2 + 0.02);
      const cap = cyl(drumSpin, DRUM_R + 0.06, DRUM_R + 0.06, 0.1, x, 0, 0, M.drum, 48, "x");
      cap.material = M.drum;
      cyl(drumSpin, 0.34, 0.34, 0.16, x + side * 0.08, 0, 0, M.chrome, 24, "x");
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU;
        ball(drumSpin, 0.055, x + side * 0.06, Math.cos(a) * 1.34, Math.sin(a) * 1.34, M.chrome);
      }
    }

    // helical lifting paddles — four axial rows, six around the barrel
    for (let row = 0; row < 4; row++) {
      const x = -1.95 + row * 1.3;
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU + row * 0.22;
        const blade = box(
          drumSpin, 1.02, 0.62, 0.09,
          x, Math.cos(a) * 1.14, Math.sin(a) * 1.14,
          i % 2 === 0 ? M.copper : M.edge, 0.03,
        );
        blade.rotation.x = a;
        blade.userData.spin = true;
      }
    }

    // central shaft
    cyl(drumSpin, 0.14, 0.14, DRUM_L + 1.6, 0, 0, 0, M.chrome, 16, "x");

    // compost bed stays level while the barrel turns around it
    const bed = box(drumAssembly, DRUM_L - 0.5, 0.62, 2.35, 0.35, DRUM_Y - 0.92, 0, M.soil, 0.28);
    bed.castShadow = false;

    const gritGeo = new THREE.IcosahedronGeometry(0.085, 0);
    const grit = new THREE.InstancedMesh(gritGeo, M.soilLight, 150);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 150; i++) {
      const a = (i * 2654435761) % 1000 / 1000;
      const b = (i * 40503) % 1000 / 1000;
      dummy.position.set(
        0.35 + (a - 0.5) * (DRUM_L - 0.8),
        DRUM_Y - 0.72 + b * 0.36,
        (b - 0.5) * 2.0 + (a - 0.5) * 0.4,
      );
      dummy.rotation.set(a * TAU, b * TAU, 0);
      dummy.scale.setScalar(0.5 + ((i * 7) % 9) / 12);
      dummy.updateMatrix();
      grit.setMatrixAt(i, dummy.matrix);
    }
    grit.instanceMatrix.needsUpdate = true;
    drumAssembly.add(grit);

    // driven pulley on the shaft + ring gear on the barrel
    const drivenPulley = new THREE.Group();
    drivenPulley.position.set(-3.0, DRUM_Y, 0);
    drumAssembly.add(drivenPulley);
    cyl(drivenPulley, 0.94, 0.94, 0.22, 0, 0, 0, M.body, 32, "x");
    ring(drivenPulley, 0.96, 0.045, -0.12, 0, 0, M.copper, "x");
    ring(drivenPulley, 0.96, 0.045, 0.12, 0, 0, M.copper, "x");
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      ball(drivenPulley, 0.05, 0.13, Math.cos(a) * 0.7, Math.sin(a) * 0.7, M.chrome);
    }

    const gearRing = new THREE.Group();
    gearRing.position.set(-2.05, DRUM_Y, 0);
    drumAssembly.add(gearRing);
    ring(gearRing, DRUM_R + 0.2, 0.12, 0, 0, 0, M.copper, "x");
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * TAU;
      const tooth = box(
        gearRing, 0.16, 0.16, 0.1,
        0, Math.cos(a) * (DRUM_R + 0.34), Math.sin(a) * (DRUM_R + 0.34),
        M.copper, 0.015,
      );
      tooth.rotation.x = a;
    }

    // ---------------------------------------------------------- the motor
    const motorAssembly = new THREE.Group();
    machine.add(motorAssembly);

    const MOTOR_Y = 1.05;
    box(motorAssembly, 1.72, 0.94, 1.0, -4.35, MOTOR_Y, 0, M.body, 0.14);
    // cooling fins
    for (let i = 0; i < 11; i++) {
      box(motorAssembly, 0.055, 1.02, 1.06, -5.05 + i * 0.14, MOTOR_Y, 0, M.edge, 0.015);
    }
    // terminal box + conduit
    box(motorAssembly, 0.6, 0.3, 0.55, -4.4, MOTOR_Y + 0.62, 0, M.dark, 0.05);
    tube(motorAssembly, [
      [-4.4, MOTOR_Y + 0.78, 0.05], [-3.7, MOTOR_Y + 1.1, 0.05],
      [-3.1, 1.7, 0.05], [-2.6, 1.9, 0.05],
    ], 0.045, M.dark);

    // fan cowl + spinning blades
    cyl(motorAssembly, 0.56, 0.56, 0.34, -5.35, MOTOR_Y, 0, M.dark, 28, "x");
    ring(motorAssembly, 0.55, 0.05, -5.53, MOTOR_Y, 0, M.chrome, "x");
    const fan = new THREE.Group();
    fan.position.set(-5.54, MOTOR_Y, 0);
    motorAssembly.add(fan);
    cyl(fan, 0.1, 0.1, 0.12, 0, 0, 0, M.chrome, 12, "x");
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * TAU;
      const blade = box(fan, 0.06, 0.44, 0.2, 0.01, Math.cos(a) * 0.3, Math.sin(a) * 0.3, M.edge, 0.02);
      blade.rotation.x = a + 0.4;
    }

    // gearbox + output shaft
    box(motorAssembly, 0.72, 0.82, 0.82, -3.28, MOTOR_Y, 0, M.ivory, 0.1);
    cyl(motorAssembly, 0.1, 0.1, 0.5, -2.95, MOTOR_Y, 0, M.chrome, 12, "x");

    const motorPulley = new THREE.Group();
    motorPulley.position.set(-3.0, MOTOR_Y, 0);
    motorAssembly.add(motorPulley);
    cyl(motorPulley, 0.48, 0.48, 0.24, 0, 0, 0, M.body, 28, "x");
    ring(motorPulley, 0.5, 0.035, -0.13, 0, 0, M.copper, "x");
    ring(motorPulley, 0.5, 0.035, 0.13, 0, 0, M.copper, "x");

    for (const x of [-4.85, -3.9]) {
      for (const z of [-0.42, 0.42]) {
        box(motorAssembly, 0.34, 0.28, 0.2, x, 0.42, z, M.dark, 0.03);
      }
    }

    // -------------------------------------------------------- belt drive
    const beltPoints: Vec3[] = [];
    const bigY = DRUM_Y, bigR = 1.0;
    const smallY = MOTOR_Y, smallR = 0.54;
    // upper arc around the driven pulley
    for (let i = 0; i <= 18; i++) {
      const a = -Math.PI / 2 + (i / 18) * Math.PI;
      beltPoints.push([-3.0, bigY + bigR * Math.cos(a), bigR * Math.sin(a)]);
    }
    // right run down
    beltPoints.push([-3.0, (bigY + smallY) / 2, bigR * 0.78]);
    // lower arc around the motor pulley
    for (let i = 0; i <= 18; i++) {
      const a = Math.PI / 2 + (i / 18) * Math.PI;
      beltPoints.push([-3.0, smallY + smallR * Math.cos(a), smallR * Math.sin(a)]);
    }
    // left run up
    beltPoints.push([-3.0, (bigY + smallY) / 2, -bigR * 0.78]);

    const beltCurve = new THREE.CatmullRomCurve3(
      beltPoints.map((p) => new THREE.Vector3(...p)), true, "catmullrom", 0.25,
    );
    machine.add(new THREE.Mesh(new THREE.TubeGeometry(beltCurve, 160, 0.095, 6, true), M.edge));

    // moving treads make the drive read as running
    const treadCount = 46;
    const treads = new THREE.InstancedMesh(boxGeo(0.14, 0.045, 0.16, 0.012), M.lime, treadCount);
    treads.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    machine.add(treads);
    const beltPos = new THREE.Vector3();
    const beltTan = new THREE.Vector3();
    function updateBelt(t: number) {
      for (let i = 0; i < treadCount; i++) {
        const u = (i / treadCount + t * 0.09) % 1;
        beltCurve.getPointAt(u, beltPos);
        beltCurve.getTangentAt(u, beltTan);
        dummy.position.copy(beltPos);
        dummy.rotation.set(0, 0, Math.atan2(beltTan.y, beltTan.z));
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        treads.setMatrixAt(i, dummy.matrix);
      }
      treads.instanceMatrix.needsUpdate = true;
    }
    updateBelt(0);

    // ------------------------------------------------------------ intake
    const intakeAssembly = new THREE.Group();
    machine.add(intakeAssembly);
    const HX = -1.75;
    const hopper = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 0.42, 1.25, 24, 1, true), M.ivory,
    );
    hopper.position.set(HX, 5.05, 0);
    hopper.castShadow = true;
    intakeAssembly.add(hopper);
    ring(intakeAssembly, 1.0, 0.06, HX, 5.67, 0, M.edge, "y");
    cyl(intakeAssembly, 0.42, 0.42, 0.65, HX, 4.15, 0, M.dark, 20);
    box(intakeAssembly, 0.34, 0.05, 0.05, HX, 5.85, 0, M.lime, 0.01);

    const hopperLabel = canvasTexture(512, 116, (c, w, h) => {
      c.fillStyle = "#d9f26b";
      c.fillRect(0, 0, w, h);
      print(c, "INTAKE", 24, 48, 30, "#242a12", 650);
      print(c, "CLEAN / MINOR · UNTREATED", 24, 88, 18, "#4c5136", 500);
    });
    const hopperPlate = screen(intakeAssembly, 1.35, 0.31, HX + 1.35, 5.05, 0, hopperLabel.texture);
    hopperPlate.rotation.y = Math.PI / 2;

    // hair falling into the hopper
    const hairCount = 34;
    const hairGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.34, 5);
    const hair = new THREE.InstancedMesh(hairGeo, M.hair, hairCount);
    hair.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    intakeAssembly.add(hair);
    const hairSeeds = Array.from({ length: hairCount }, (_, i) => ({
      phase: (i * 0.6180339887) % 1,
      x: HX + (((i * 73) % 100) / 100 - 0.5) * 1.2,
      z: (((i * 41) % 100) / 100 - 0.5) * 1.2,
      spin: ((i * 29) % 100) / 100 * TAU,
    }));
    function updateHair(t: number) {
      hairSeeds.forEach((s, i) => {
        const p = (s.phase + t * 0.34) % 1;
        dummy.position.set(s.x, 6.4 - p * 1.5, s.z);
        dummy.rotation.set(Math.sin(p * TAU + s.spin) * 0.5, s.spin, p * 2);
        dummy.scale.setScalar(0.6 + 0.4 * Math.sin(p * Math.PI));
        dummy.updateMatrix();
        hair.setMatrixAt(i, dummy.matrix);
      });
      hair.instanceMatrix.needsUpdate = true;
    }
    updateHair(0);

    // --------------------------------------------------------- discharge
    const dischargeAssembly = new THREE.Group();
    machine.add(dischargeAssembly);
    const chute = box(dischargeAssembly, 1.35, 0.12, 1.15, 3.35, 1.75, 0, M.copper, 0.05);
    chute.rotation.z = -0.62;
    box(dischargeAssembly, 0.12, 0.32, 1.15, 2.78, 2.05, 0, M.dark, 0.02);
    box(dischargeAssembly, 2.0, 0.16, 1.55, 4.35, 0.34, 0, M.dark, 0.05);

    // compost mound
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU;
      const r = 0.15 + (i % 5) * 0.16;
      ball(
        dischargeAssembly, 0.16 + (i % 4) * 0.045,
        4.35 + Math.cos(a) * r, 0.45 + ((i * 13) % 7) * 0.035, Math.sin(a) * r * 0.7,
        i % 3 ? M.soil : M.soilLight,
      );
    }

    // falling crumbs
    const crumbCount = 26;
    const crumbs = new THREE.InstancedMesh(gritGeo, M.soilLight, crumbCount);
    crumbs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    dischargeAssembly.add(crumbs);
    function updateCrumbs(t: number) {
      for (let i = 0; i < crumbCount; i++) {
        const p = ((i * 0.618) % 1 + t * 0.45) % 1;
        dummy.position.set(
          3.85 + p * 0.6 + (((i * 17) % 10) / 10 - 0.5) * 0.3,
          1.65 - p * 1.15,
          (((i * 31) % 100) / 100 - 0.5) * 0.7,
        );
        dummy.rotation.set(p * 4, p * 3, 0);
        dummy.scale.setScalar(0.7);
        dummy.updateMatrix();
        crumbs.setMatrixAt(i, dummy.matrix);
      }
      crumbs.instanceMatrix.needsUpdate = true;
    }
    updateCrumbs(0);

    const outLabel = canvasTexture(512, 116, (c, w, h) => {
      c.fillStyle = "#242a12";
      c.fillRect(0, 0, w, h);
      print(c, "DISCHARGE", 24, 48, 28, "#d9f26b", 650);
      print(c, "CURED COMPOST · 12.9 KG", 24, 88, 17, "#9a9c86", 500);
    });
    screen(dischargeAssembly, 1.4, 0.32, 4.35, 0.9, 0.79, outLabel.texture);

    // ------------------------------------------------------- temperature
    const sensorAssembly = new THREE.Group();
    machine.add(sensorAssembly);
    cyl(sensorAssembly, 0.06, 0.06, 1.5, 1.6, 4.35, -0.75, M.chrome, 12);
    ball(sensorAssembly, 0.1, 1.6, 3.6, -0.75, M.light);
    box(sensorAssembly, 0.1, 1.25, 0.1, 1.6, 4.9, -0.75, M.dark, 0.02);

    const probeTex = canvasTexture(420, 260, () => {});
    function drawProbe(t: number) {
      const c = probeTex.ctx, w = 420, h = 260;
      c.fillStyle = "#12231e";
      c.fillRect(0, 0, w, h);
      print(c, "CORE TEMP", 24, 44, 20, "#9cae91", 500);
      const temp = 58.6 + Math.sin(t * 0.35) * 0.8;
      print(c, `${temp.toFixed(1)} °C`, 22, 128, 68, "#ecedc7", 600);
      print(c, "PROBE 02 · IN PILE", 24, 168, 15, "#6d8a72", 500);
      c.fillStyle = "#d9f26b";
      c.fillRect(24, 202, 260 + Math.sin(t * 0.6) * 24, 8);
      c.fillStyle = "#334348";
      c.fillRect(24, 224, 372, 6);
      probeTex.texture.needsUpdate = true;
    }
    drawProbe(0);
    const probeScreen = screen(sensorAssembly, 1.15, 0.71, 1.6, 5.35, -0.72, probeTex.texture);
    probeScreen.rotation.y = 0.18;

    // ------------------------------------------------------ control panel
    const cabinetAssembly = new THREE.Group();
    // Children are authored at z=-2.45 (behind the drum). Shift the whole
    // assembly forward and left so the panel reads from the default camera.
    cabinetAssembly.position.set(-0.8, 0, 4.95);
    machine.add(cabinetAssembly);
    box(cabinetAssembly, 1.35, 2.15, 0.55, -4.5, 1.35, -2.45, M.ivory, 0.09);
    box(cabinetAssembly, 1.5, 0.13, 0.65, -4.5, 2.48, -2.45, M.body, 0.05);
    box(cabinetAssembly, 0.18, 0.32, 0.18, -4.5, 0.16, -2.45, M.dark, 0.03);

    const panelTex = canvasTexture(560, 620, () => {});
    function drawPanel(t: number) {
      const c = panelTex.ctx, w = 560, h = 620;
      c.fillStyle = "#111b20";
      c.fillRect(0, 0, w, h);
      print(c, "MCH-01", 28, 52, 24, "#d9f26b", 650);
      print(c, "MODULE 06", 400, 52, 17, "#607475", 500);
      c.fillStyle = "#202c30";
      c.fillRect(24, 76, 512, 3);
      const rows = [
        ["MOTOR", "RUNNING", "#d9f26b"],
        ["DRUM", "8 RPM", "#d4d8cc"],
        ["MOISTURE", "54 %", "#d4d8cc"],
        ["BATCH", "2603", "#d4d8cc"],
      ] as const;
      rows.forEach(([k, v, col], i) => {
        const y = 130 + i * 84;
        c.fillStyle = "#202c30";
        c.beginPath();
        c.roundRect(24, y, 512, 68, 6);
        c.fill();
        print(c, k, 42, y + 42, 19, "#869991", 500);
        print(c, v, 520 - v.length * 12, y + 42, 21, col, 600);
      });
      print(c, "SESSION", 26, 500, 16, "#869991", 500);
      const secs = Math.floor(t * 0.6) % 60;
      print(c, `00:${String(52 + Math.floor(t / 60) % 8).padStart(2, "0")}:${String(secs).padStart(2, "0")}`, 26, 546, 34, "#ecedc7", 550);
      c.fillStyle = "#d9f26b";
      c.fillRect(26, 580, 120 + ((t * 30) % 300), 6);
      panelTex.texture.needsUpdate = true;
    }
    drawPanel(0);
    screen(cabinetAssembly, 1.06, 1.18, -4.5, 1.72, -2.165, panelTex.texture);

    // start / stop / local e-stop
    cyl(cabinetAssembly, 0.11, 0.11, 0.06, -4.9, 0.82, -2.14, M.green, 18, "z");
    cyl(cabinetAssembly, 0.11, 0.11, 0.06, -4.5, 0.82, -2.14, M.ivory, 18, "z");
    cyl(cabinetAssembly, 0.15, 0.15, 0.09, -4.05, 0.82, -2.14, M.rust, 20, "z");
    ring(cabinetAssembly, 0.19, 0.025, -4.05, 0.82, -2.12, M.chrome, "z");

    const cabinetLabel = canvasTexture(512, 116, (c, w, h) => {
      c.fillStyle = "#e0ded4";
      c.fillRect(0, 0, w, h);
      print(c, "LOCAL E-STOP", 24, 48, 26, "#a6402a", 650);
      print(c, "WEB = AUTHORISED START/STOP", 24, 88, 16, "#556059", 500);
    });
    screen(cabinetAssembly, 1.2, 0.27, -4.5, 2.72, -2.45, cabinetLabel.texture);

    // ------------------------------------------------------------- steam
    const steamTex = canvasTexture(128, 128, (c, w, h) => {
      const g = c.createRadialGradient(64, 64, 4, 64, 64, 64);
      g.addColorStop(0, "rgba(226,232,214,.5)");
      g.addColorStop(1, "rgba(226,232,214,0)");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    });
    const steamMat = new THREE.MeshBasicMaterial({
      map: steamTex.texture, transparent: true, depthWrite: false, opacity: 0.16,
    });
    const steamPlanes: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), steamMat.clone());
      p.position.set(-1.4 + i * 0.7, 4.5, -0.7 + (i % 3) * 0.4);
      p.userData.phase = (i * 0.618) % 1;
      machine.add(p);
      steamPlanes.push(p);
    }

    // ------------------------------------------------------------- parts
    const partDefs: Omit<PartDef, "group" | "base" | "label" | "anchor" | "index">[] = [
      {
        id: "motor", name: "Motor & gearbox", meta: "Module 6 · 8 rpm",
        desc: "Finned 3-phase motor, fan and reducer. The web panel sends authorised start/stop only — E-stop stays in local hardware.",
      },
      {
        id: "drum", name: "Rotary drum", meta: "Module 5 · batch 2603",
        desc: "Helical paddles lift and turn the mix. Temperature, moisture and turning events are logged against the batch ID.",
      },
      {
        id: "intake", name: "Hair intake", meta: "Clean / minor only",
        desc: "Only clean and minor, untreated hair is weighed into a recipe. Mixed or treated stock is held on a separate line.",
      },
      {
        id: "discharge", name: "Compost discharge", meta: "12.9 kg cured",
        desc: "After 45 days the pile stops reheating. Cured compost is weighed out and a sample goes to the laboratory.",
      },
      {
        id: "sensor", name: "Core probe", meta: "58.6 °C · 54% moisture",
        desc: "Live core temperature and moisture. A pile that reheats is not mature, and its stage cannot be skipped.",
      },
      {
        id: "cabinet", name: "Control cabinet", meta: "Session log · operator",
        desc: "Every operating session records start, end, duration, readings, operator and batch. Alerts fire on overheating or faults.",
      },
    ];

    const assemblies: Record<PartId, THREE.Group> = {
      motor: motorAssembly,
      drum: drumAssembly,
      intake: intakeAssembly,
      discharge: dischargeAssembly,
      sensor: sensorAssembly,
      cabinet: cabinetAssembly,
    };

    const parts: PartDef[] = partDefs.map((def, i) => {
      const group = assemblies[def.id];
      const label = document.createElement("div");
      label.className = "part-label";
      label.innerHTML = `<div class="stem"></div><div class="label-card"><div class="label-title"><span>${String(
        i + 1,
      ).padStart(2, "0")}</span>${def.name}</div><div class="label-meta">${def.meta}</div></div>`;
      $("labels").appendChild(label);
      cleanups.push(() => label.remove());

      group.traverse((o) => {
        o.userData.part = def.id;
      });

      return {
        ...def,
        group,
        base: group.position.clone(),
        label,
        anchor: new THREE.Vector3(0, 0, 0),
        index: i,
      };
    });

    // anchor points for the exploded-view callouts
    const anchors: Record<PartId, Vec3> = {
      motor: [-4.3, 1.9, 0],
      drum: [0.35, 4.4, 0],
      intake: [-1.75, 5.9, 0],
      discharge: [4.2, 1.1, 0],
      sensor: [1.6, 5.6, -0.75],
      cabinet: [-4.5, 2.9, -2.45],
    };
    parts.forEach((p) => p.anchor.fromArray(anchors[p.id]));
    const spreadTargets: Record<PartId, Vec3> = {
      motor: [-2.1, 0, -0.7],
      drum: [0, 0.35, 0],
      intake: [-0.9, 1.0, 0],
      discharge: [1.7, 0, 0],
      sensor: [0.9, 0.9, 0],
      cabinet: [-1.5, 0, -1.3],
    };

    // ------------------------------------------------------------ states
    let mode: DrumMode = "assembled";
    let cameraMode: DrumCamera = "overview";
    let playing = !reduceMotion;
    let simTime = 0;
    let spread = 0;
    let cutAmount = 0;
    let selected: string = "drum";
    let hovered: string | null = null;

    let width = frameWidth();
    let height = frameHeight();
    let mobile = width <= 900;
    let lastInteraction = performance.now();
    let dragging = false;
    let wasDragged = false;
    let downX = 0;
    let downY = 0;

    let cameraAnimating = true;
    let flightTime = 0;
    let lastDraw = -1;
    let visible = true;
    let contextLost = false;

    const desiredPosition = new THREE.Vector3();
    const desiredTarget = new THREE.Vector3(0, 1.95, 0);
    const viewDirection = new THREE.Vector3(10.5, 8.4, 17).normalize();
    const cutPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 20);
    shellMat.clippingPlanes = [cutPlane];

    let baseDistance = 27;
    let sized = false;
    let readySent = false;

    function layoutCamera() {
      if (!frameWidth() || !frameHeight()) return;
      const first = !sized;
      sized = true;
      width = frameWidth();
      height = frameHeight();
      mobile = width <= 900;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.setViewOffset(
        width, height,
        mobile || !embedded ? 0 : -width * 0.21,
        mobile || embedded ? 0 : height * 0.025,
        width, height,
      );
      const aspect = width / height;
      const availableWidth = mobile ? 0.9 : Math.min(0.6, aspect > 2 ? 0.55 : 0.6);
      const horizontalFit =
        16.4 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect * availableWidth);
      const verticalFit =
        12.2 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (embedded ? 0.85 : 0.78));
      baseDistance =
        Math.max(horizontalFit, verticalFit) *
        (embedded ? (mobile ? 0.9 : 0.68) : mobile ? 0.82 : 0.76);
      controls.maxDistance = Math.max(60, baseDistance * 1.6);
      camera.updateProjectionMatrix();
      setCameraGoal();
      cameraAnimating = true;
      if (first) {
        camera.position.copy(desiredPosition);
        controls.target.copy(desiredTarget);
        controls.update();
        cameraAnimating = false;
      }
    }

    function setCameraGoal() {
      const expand = mode === "parts" ? 1.16 : 1;
      if (cameraMode === "drum") {
        desiredTarget.set(0.4, DRUM_Y, 0);
        desiredPosition.copy(desiredTarget).addScaledVector(viewDirection, mobile ? 10 : 13);
      } else if (cameraMode === "motor") {
        desiredTarget.set(-3.7, 1.5, 0);
        desiredPosition.copy(desiredTarget).addScaledVector(viewDirection, mobile ? 9 : 11);
      } else {
        desiredTarget.set(0, 1.95, 0);
        const distance = baseDistance * expand;
        if (cameraMode === "top") {
          desiredPosition.set(0.01, distance * 0.95, 0.9).add(desiredTarget);
        } else {
          desiredPosition.copy(viewDirection).multiplyScalar(distance).add(desiredTarget);
        }
      }
    }

    function syncButtons() {
      root.querySelectorAll<HTMLElement>("[data-mode]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.mode === mode)),
      );
      root.querySelectorAll<HTMLElement>("[data-camera]").forEach((b) =>
        b.setAttribute("aria-pressed", String(b.dataset.camera === cameraMode)),
      );
      $("journey").classList.toggle("visible", mode === "flow");
    }

    const modeAliases: Record<string, DrumMode> = {
      Assembled: "assembled", Cutaway: "cutaway", Assemblies: "parts",
      "One batch": "flow", assembled: "assembled", cutaway: "cutaway",
      parts: "parts", flow: "flow",
    };
    const cameraAliases: Record<string, DrumCamera> = {
      Overview: "overview", Drum: "drum", Motor: "motor", Top: "top", Flight: "flight",
      overview: "overview", drum: "drum", motor: "motor", top: "top", flight: "flight",
    };

    function setMode(name: string) {
      if (!Object.hasOwn(modeAliases, name)) return false;
      mode = modeAliases[name];
      lastInteraction = performance.now();
      if (mode === "flow") {
        simTime = 0;
        lastDraw = -1;
        play();
        cameraMode = "overview";
      } else if (cameraMode === "drum" || cameraMode === "motor") {
        if (mode === "assembled") cameraMode = "overview";
      }
      setCameraGoal();
      cameraAnimating = true;
      syncButtons();
      return true;
    }

    function focusPart(id: string) {
      const part = parts.find((p) => p.id === id);
      if (!part) return false;
      selected = id;
      if (mode === "flow") mode = "assembled";
      cameraMode = id === "motor" || id === "cabinet" ? "motor" : "drum";
      lastInteraction = performance.now();
      setCameraGoal();
      cameraAnimating = true;
      syncButtons();
      return true;
    }

    function setCamera(name: string) {
      if (!Object.hasOwn(cameraAliases, name)) return false;
      cameraMode = cameraAliases[name];
      if (mode === "flow") mode = "assembled";
      lastInteraction = performance.now();
      flightTime = 0;
      setCameraGoal();
      cameraAnimating = true;
      syncButtons();
      return true;
    }

    function syncPlayback() {
      const b = $("play");
      b.setAttribute("aria-label", playing ? "Pause the animation" : "Resume the animation");
      b.setAttribute("aria-pressed", String(!playing));
      b.innerHTML = playing
        ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><rect x="2" y="1" width="2.5" height="10" rx=".5"/><rect x="7.5" y="1" width="2.5" height="10" rx=".5"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1l8 5-8 5z"/></svg>';
      $("status").classList.toggle("paused", !playing);
      $("status-text").textContent = playing ? "Motor running" : "Motor paused";
    }

    function play() { playing = true; syncPlayback(); return true; }
    function pause() { playing = false; syncPlayback(); return true; }

    const api: DrumApi = { setMode, focusPart, setCamera, play, pause };
    window.__drum = api;
    cleanups.push(() => { if (window.__drum === api) delete window.__drum; });

    root.querySelectorAll<HTMLElement>("[data-mode]").forEach((b) =>
      listen(b, "click", () => setMode(b.dataset.mode ?? "")),
    );
    root.querySelectorAll<HTMLElement>("[data-camera]").forEach((b) =>
      listen(b, "click", () => setCamera(b.dataset.camera ?? "")),
    );
    listen($("play"), "click", () => (playing ? pause() : play()));

    syncPlayback();
    layoutCamera();
    camera.position.copy(desiredPosition);
    controls.target.copy(desiredTarget);
    controls.update();
    cameraAnimating = false;

    listen(window, "resize", layoutCamera);
    const resizeObserver = new ResizeObserver(() => layoutCamera());
    resizeObserver.observe(root);
    cleanups.push(() => resizeObserver.disconnect());

    controls.addEventListener("start", () => {
      dragging = true; cameraAnimating = false; lastInteraction = performance.now();
    });
    controls.addEventListener("end", () => {
      dragging = false; lastInteraction = performance.now();
    });
    controls.addEventListener("change", () => {
      if (dragging) lastInteraction = performance.now();
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const tooltip = $("tooltip");
    const pickables = parts.map((p) => p.group);

    function hitPart(x: number, y: number) {
      pointer.set((x / width) * 2 - 1, (-y / height) * 2 + 1);
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pickables, true);
      return hits.length ? parts.find((p) => p.id === hits[0].object.userData.part) : null;
    }

    listen(renderer.domElement, "pointermove", (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      const lx = e.clientX - rect.left, ly = e.clientY - rect.top;
      if (Math.hypot(lx - downX, ly - downY) > 5) wasDragged = true;
      if (dragging) return;
      const s = hitPart(lx, ly);
      hovered = s ? s.id : null;
      renderer.domElement.style.cursor = s ? "pointer" : "grab";
      tooltip.classList.toggle("visible", !!s);
      if (s) {
        tooltip.querySelector("strong")!.innerHTML =
          `<span>${String(s.index + 1).padStart(2, "0")}</span>${s.name}`;
        tooltip.querySelector("p")!.textContent = s.desc;
        tooltip.style.left = Math.min(width - 255, Math.max(10, lx + 16)) + "px";
        tooltip.style.top = Math.max(10, Math.min(height - 110, ly - 70)) + "px";
      }
    });
    listen(renderer.domElement, "pointerleave", () => {
      hovered = null;
      tooltip.classList.remove("visible");
    });
    listen(renderer.domElement, "pointerdown", (e: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      downX = e.clientX - rect.left;
      downY = e.clientY - rect.top;
      wasDragged = false;
      tooltip.classList.remove("visible");
    });
    listen(renderer.domElement, "pointerup", (e: PointerEvent) => {
      if (wasDragged) return;
      const rect = root.getBoundingClientRect();
      const s = hitPart(e.clientX - rect.left, e.clientY - rect.top);
      if (!s) return;
      focusPart(s.id);
      options.onPart?.(s.id);
    });
    listen(document, "visibilitychange", () => {
      visible = !document.hidden;
      lastFrame = performance.now();
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        lastFrame = performance.now();
      },
      { threshold: 0.01 },
    );
    observer.observe(renderer.domElement);
    cleanups.push(() => observer.disconnect());

    listen(renderer.domElement, "webglcontextlost", (e: Event) => {
      e.preventDefault();
      contextLost = true;
      showError("The graphics context was interrupted. It returns once WebGL is available again.");
    });
    listen(renderer.domElement, "webglcontextrestored", () => {
      contextLost = false;
      $("error").style.display = "none";
      lastFrame = performance.now();
    });

    const journeySteps: Array<[string, string]> = [
      ["Intake", "Clean hair · BATCH-2603 · 21.2 kg"],
      ["Weighed in", "Recipe v3.3 · 45 / 30 / 25"],
      ["Turning", "8 rpm · core 58.6 °C · 61% moisture"],
      ["Curing", "Day 45 · pile stable, no reheating"],
      ["Discharge", "12.9 kg cured compost · lab sample drawn"],
    ];

    let prevJourney = -1;
    let lastFrame = performance.now();
    let frameCount = 0;
    let measureTime = 0;
    let pixelRatio = renderer.getPixelRatio();
    let rafId = 0;

    function animate(now: number) {
      rafId = requestAnimationFrame(animate);
      const dt = Math.max(0, Math.min((now - lastFrame) / 1000, 0.045));
      lastFrame = now;
      if (!visible || contextLost) return;
      if (playing) {
        simTime += dt;
        flightTime += dt;
      }
      const t = simTime;
      const smooth = 1 - Math.exp(-dt * 5);
      const phase = (t / 24) % 1;

      // modes
      spread = THREE.MathUtils.lerp(spread, mode === "parts" ? 1 : 0, smooth);
      cutAmount = THREE.MathUtils.lerp(cutAmount, mode === "cutaway" ? 1 : 0, smooth);
      cutPlane.constant = 20 - cutAmount * 17.4; // 20 → 2.6, slicing the shell at drum height
      shellMat.opacity = 0.3 - cutAmount * 0.22;

      parts.forEach((p) => {
        const target = spreadTargets[p.id];
        p.group.position.set(
          p.base.x + target[0] * spread,
          p.base.y + target[1] * spread,
          p.base.z + target[2] * spread,
        );
      });

      // rotation: motor, pulleys, barrel, gear ring
      const turn = t * 0.52;
      drumSpin.rotation.x = turn;
      gearRing.rotation.x = turn;
      drivenPulley.rotation.x = turn * 1.95;
      motorPulley.rotation.x = -turn * 3.8;
      fan.rotation.x = -t * 4.2;

      // material flow
      if (t - lastDraw > 1 / 20 || lastDraw < 0) {
        updateBelt(t);
        updateHair(t);
        updateCrumbs(t);
        drawProbe(t);
        drawPanel(t);
        lastDraw = t;
      }

      steamPlanes.forEach((p, i) => {
        const p2 = (p.userData.phase + t * 0.14) % 1;
        p.position.y = 4.35 + p2 * 1.9;
        p.position.x = -1.4 + i * 0.7 + Math.sin(p2 * 4 + i) * 0.22;
        p.scale.setScalar(0.6 + p2 * 1.3);
        (p.material as THREE.MeshBasicMaterial).opacity = 0.16 * Math.sin(p2 * Math.PI);
      });

      // one-batch journey
      if (mode === "flow") {
        const step = Math.min(4, Math.floor(phase * 5));
        if (step !== prevJourney) {
          $("journey-title").textContent = journeySteps[step][0];
          $("journey-detail").textContent = journeySteps[step][1];
          prevJourney = step;
        }
        $("journey-progress").style.width = phase * 100 + "%";
        if (!dragging && playing) {
          const x = -2.2 + phase * 6.6;
          desiredTarget.set(x, 2.4 - phase * 0.9, 0);
          desiredPosition.copy(desiredTarget).addScaledVector(viewDirection, mobile ? 11 : 15);
          cameraAnimating = true;
        }
      } else if (cameraMode === "flight" && playing && !dragging) {
        const a = flightTime * 0.12;
        const d = baseDistance * (mode === "parts" ? 1.16 : 1);
        desiredTarget.set(0, 1.95, 0);
        desiredPosition
          .set(Math.sin(a + 0.55) * d * 0.83, d * (0.48 + Math.sin(a * 0.7) * 0.08), Math.cos(a + 0.55) * d * 0.83)
          .add(desiredTarget);
        cameraAnimating = true;
      } else if ((cameraMode === "drum" || cameraMode === "motor") && cameraAnimating) {
        setCameraGoal();
      }

      if (cameraAnimating && !dragging) {
        const speed = 1 - Math.exp(-dt * (mode === "flow" ? 2.2 : 3));
        camera.position.lerp(desiredPosition, speed);
        controls.target.lerp(desiredTarget, speed);
        if (
          cameraMode !== "flight" && mode !== "flow" &&
          camera.position.distanceTo(desiredPosition) < 0.015 &&
          controls.target.distanceTo(desiredTarget) < 0.015
        ) cameraAnimating = false;
      }

      controls.autoRotate =
        playing && !reduceMotion && !dragging && !cameraAnimating &&
        mode !== "flow" && cameraMode === "overview" && now - lastInteraction > 6500;
      controls.autoRotateSpeed = 0.22;
      controls.update(dt);

      // exploded-view callouts — projected, then de-collided vertically
      const show = mode === "parts";
      const placements: { x: number; y: number; label: HTMLDivElement }[] = [];
      const nudgeX = [-54, 18, -34, 34, 26, -62];
      parts.forEach((p, i) => {
        p.label.classList.toggle("visible", show);
        if (!show) return;
        const anchor = p.anchor.clone().add(p.group.position).project(camera);
        const x = THREE.MathUtils.clamp(
          (anchor.x * 0.5 + 0.5) * width - 40 + nudgeX[i],
          mobile || !embedded ? 9 : width * 0.425,
          width - (mobile ? 125 : 175),
        );
        const y = THREE.MathUtils.clamp((-anchor.y * 0.5 + 0.5) * height - 62, 110, height - 140);
        placements.push({ x, y, label: p.label });
      });
      placements.sort((a, b) => a.y - b.y);
      for (let i = 1; i < placements.length; i++) {
        for (let j = 0; j < i; j++) {
          const prev = placements[j];
          if (
            Math.abs(placements[i].x - prev.x) < 185 &&
            Math.abs(placements[i].y - prev.y) < 70
          ) {
            placements[i].y = Math.min(height - 140, prev.y + 76);
          }
        }
      }
      placements.forEach((pl) => {
        pl.label.style.transform = `translate(${pl.x}px,${pl.y}px)`;
      });

      renderer.render(scene, camera);

      if (!readySent && sized) {
        readySent = true;
        options.onReady?.();
      }

      if (playing) {
        frameCount++;
        measureTime += dt;
        if (measureTime > 4) {
          if (frameCount / measureTime < 43 && pixelRatio > 1) {
            pixelRatio = Math.max(1, pixelRatio - 0.25);
            renderer.setPixelRatio(pixelRatio);
          }
          frameCount = 0;
          measureTime = 0;
        }
      }
    }

    rafId = requestAnimationFrame(animate);

    cleanups.push(() => {
      cancelAnimationFrame(rafId);
      controls.dispose();
      const textures = new Set<THREE.Texture>();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const list = mesh.material
          ? Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          : [];
        for (const material of list) {
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture) textures.add(value);
          }
          material.dispose();
        }
      });
      geometries.forEach((g) => g.dispose());
      textures.forEach((t) => t.dispose());
      env.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    });

    renderer.compile(scene, camera);
    $("loading").classList.add("done");
    $("error").style.display = "none";

    Object.defineProperty(window, "__drumDebug", {
      value: {
        getState: () => ({
          mode, camera: cameraMode, playing, time: simTime, spread, cutAmount,
          width, height, drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
        }),
      },
      configurable: true,
    });
    cleanups.push(() => { delete window.__drumDebug; });
  } catch (error) {
    console.error("Composting drum: failed to start", error);
    showError();
  }

  return dispose;
}

// ---------------------------------------------------------------------------

const STYLES = String.raw`
.h2h-drum {
  width: 100%; contain: layout; color-scheme: dark;
  --bg: #0d1007; --white: #f4f1ea; --lime: #d9f26b;
}
.h2h-drum, .h2h-drum * { box-sizing: border-box; }
.h2h-drum {
  margin: 0; height: 100%; overflow: hidden; background: var(--bg);
  font-family: var(--font-sans, "Poppins", ui-sans-serif, sans-serif);
  color: var(--white); font-size: 13px; -webkit-font-smoothing: antialiased;
  position: relative;
}
.h2h-drum button, .h2h-drum a { -webkit-tap-highlight-color: transparent; }
.h2h-drum button { font: inherit; color: inherit; cursor: pointer; }
.h2h-drum button:focus-visible, .h2h-drum a:focus-visible {
  outline: 2px solid var(--lime); outline-offset: 5px;
}
.h2h-drum #scene { position: absolute; inset: 0; touch-action: none; outline: none; }
.h2h-drum #scene canvas { display: block; width: 100%; height: 100%; }
.h2h-drum .vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 48%, transparent 30%, rgba(0,0,0,.12) 64%, rgba(0,0,0,.65) 100%);
}
.h2h-drum .topbar {
  position: absolute; inset: 24px 28px auto; display: flex;
  justify-content: space-between; align-items: center; pointer-events: none;
}
.h2h-drum .identity { display: flex; gap: 12px; align-items: center; }
.h2h-drum .mark {
  width: 30px; height: 30px; border: 1px solid #55502f; border-radius: 9px;
  display: grid; place-items: center; color: var(--lime); background: #1c1b14;
}
.h2h-drum .identity strong { display: block; font-weight: 600; letter-spacing: -0.2px; font-size: 13px; }
.h2h-drum .identity small {
  display: block; margin-top: 5px; font-size: 9px; letter-spacing: 1.55px;
  color: #73777f; text-transform: uppercase;
}
.h2h-drum .status { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #a6a79f; }
.h2h-drum .status i {
  width: 5px; height: 5px; border-radius: 50%; background: var(--lime);
  box-shadow: 0 0 10px #d9f26b60;
}
.h2h-drum .status.paused i { background: #777; box-shadow: none; }
.h2h-drum .status span:last-child {
  color: #646971; margin-left: 12px; letter-spacing: .1em;
}
.h2h-drum .scene-heading {
  position: absolute; top: 96px; left: 22%; right: 22%; pointer-events: none;
  display: flex; align-items: center; gap: 12px; font-size: 9px;
  letter-spacing: 1.8px; color: #959790; text-transform: uppercase;
}
.h2h-drum .scene-heading:before { content: ''; width: 22px; height: 1px; background: var(--lime); }
.h2h-drum .scene-heading .index { margin-left: auto; color: #4e535b; font-size: 9px; letter-spacing: 1px; }
.h2h-drum .coordinates {
  position: absolute; top: 140px; right: 29px; color: #52575f; writing-mode: vertical-rl;
  font-family: var(--font-mono, "Poppins", sans-serif); font-size: 9px;
  letter-spacing: 1.5px; pointer-events: none;
}
.h2h-drum .controls {
  position: absolute; bottom: 64px; left: 22px; right: 22px; display: flex;
  align-items: center; flex-direction: column; gap: 12px; z-index: 5;
}
.h2h-drum .mode-bar {
  display: flex; gap: 3px; align-items: center; padding: 5px;
  border: 1px solid #ffffff13; border-radius: 12px; background: rgba(25, 28, 32, 0.87);
  box-shadow: 0 8px 30px #0003, inset 0 1px 0 #ffffff03; backdrop-filter: blur(16px);
}
.h2h-drum .mode-bar button {
  border: 0; background: none; color: #a2a4a8; white-space: nowrap; padding: 10px 14px;
  display: flex; gap: 8px; align-items: center; font-size: 11px; font-weight: 500;
  border-radius: 8px; transition: background .2s, color .2s;
}
.h2h-drum .mode-bar button:hover { background: #ffffff08; color: var(--white); }
.h2h-drum .mode-bar button[aria-pressed='true'] {
  background: var(--lime); color: #211c0d; box-shadow: 0 2px 12px #d9f26b12;
}
.h2h-drum svg { flex-shrink: 0; display: block; }
.h2h-drum .mode-bar svg { width: 14px; height: 14px; }
.h2h-drum .camera-row {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  padding: 3px 7px; border: 1px solid #ffffff12; border-radius: 999px;
  background: rgba(14, 17, 10, .78); backdrop-filter: blur(12px);
  box-shadow: 0 6px 20px #0004;
}
.h2h-drum .camera-row .caption { font-size: 9px; letter-spacing: 1.4px; color: #8b9088; margin-right: 9px; }
.h2h-drum .camera-row button {
  border: 0; background: transparent; color: #a2a4a8; padding: 5px 9px; font-size: 10px;
  transition: color .2s;
}
.h2h-drum .camera-row button:hover,
.h2h-drum .camera-row button[aria-pressed='true'] { color: var(--white); }
.h2h-drum .camera-row button[aria-pressed='true']:after {
  content: ''; display: block; width: 3px; height: 3px; background: var(--lime);
  border-radius: 50%; margin: 5px auto -8px;
}
.h2h-drum .camera-row .divider { width: 1px; height: 13px; background: #ffffff1a; margin: 0 8px; }
.h2h-drum .camera-row #play { padding: 5px; width: 25px; height: 25px; display: grid; place-items: center; }
.h2h-drum .footer {
  position: absolute; bottom: 20px; left: 28px; right: 28px; display: flex;
  align-items: center; justify-content: space-between; gap: 12px; pointer-events: none;
}
.h2h-drum .wordmark { font-size: 11px; color: #6d7178; text-decoration: none; pointer-events: auto; }
.h2h-drum .wordmark span { color: #a1a49f; }
.h2h-drum .hint { display: flex; align-items: center; gap: 7px; color: #636972; font-size: 10px; }
.h2h-drum .hint svg { color: #8c8f91; }
.h2h-drum .footer-center {
  position: absolute; left: 50%; transform: translateX(-50%);
  font-family: var(--font-mono, "Poppins", sans-serif); font-size: 9px;
  letter-spacing: 1.5px; color: #3f454d;
}
.h2h-drum #labels { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.h2h-drum .part-label {
  position: absolute; left: 0; top: 0; opacity: 0; transition: opacity .3s;
  will-change: transform; pointer-events: none; min-width: 148px;
}
.h2h-drum .part-label.visible { opacity: 1; }
.h2h-drum .part-label .stem {
  height: 26px; width: 1px; background: linear-gradient(#d9f26b00, #d9f26b70); margin: 0 0 0 10px;
}
.h2h-drum .part-label .label-card {
  background: #14171bee; backdrop-filter: blur(10px); border: 1px solid #d9f26b40;
  border-radius: 6px; padding: 10px 13px; box-shadow: 0 4px 20px #0003;
}
.h2h-drum .part-label .label-title {
  font-weight: 600; font-size: 12px; display: flex; gap: 10px; align-items: center; white-space: nowrap;
}
.h2h-drum .part-label .label-title span {
  color: var(--lime); font-family: var(--font-mono, "Poppins", sans-serif); font-size: 9px;
}
.h2h-drum .part-label .label-meta {
  font-size: 9px; color: #8e939c; margin: 6px 0 0 24px; white-space: nowrap;
}
.h2h-drum #tooltip {
  position: absolute; pointer-events: none; z-index: 10; opacity: 0; transition: opacity .15s;
  padding: 11px 14px; border: 1px solid #ffffff1a; background: #171a20ed;
  backdrop-filter: blur(12px); box-shadow: 0 8px 32px #0005; border-radius: 7px; max-width: 250px;
}
.h2h-drum #tooltip.visible { opacity: 1; }
.h2h-drum #tooltip strong { font-size: 12px; font-weight: 600; }
.h2h-drum #tooltip strong span { font-size: 10px; color: var(--lime); margin-right: 8px; }
.h2h-drum #tooltip p { font-size: 10px; color: #9b9fa7; margin: 6px 0 0; line-height: 1.5; }
.h2h-drum #journey {
  position: absolute; left: 22%; right: 22%; top: 132px; opacity: 0; transform: translateY(-5px);
  transition: .4s; pointer-events: none; display: flex; align-items: center; gap: 13px;
}
.h2h-drum #journey.visible { opacity: 1; transform: none; }
.h2h-drum .journey-icon {
  width: 28px; height: 28px; border: 1px solid #d9f26b40; border-radius: 50%;
  display: grid; place-items: center; color: var(--lime); flex-shrink: 0;
}
.h2h-drum #journey strong { font-size: 11px; font-weight: 500; }
.h2h-drum #journey small { display: block; font-size: 9px; margin-top: 4px; color: #7e858d; }
.h2h-drum #journey .track { height: 2px; background: #ffffff0b; flex: 1; margin-left: 8px; }
.h2h-drum #journey .track i { display: block; height: 100%; background: var(--lime); width: 0; }
.h2h-drum #loading {
  position: absolute; left: 50%; top: 48%; transform: translate(-50%, -50%);
  display: flex; align-items: center; gap: 12px; color: #8c8f95; font-size: 11px;
  transition: opacity .4s; z-index: 20;
}
.h2h-drum #loading i {
  height: 18px; width: 18px; border-radius: 50%; border: 1px solid #d9f26b22;
  border-top-color: var(--lime); animation: h2h-drum-spin 1s linear infinite;
}
@keyframes h2h-drum-spin { to { transform: rotate(360deg); } }
.h2h-drum #loading.done { opacity: 0; pointer-events: none; }
.h2h-drum #error {
  position: absolute; left: 27.5%; right: 27.5%; top: 40%; border: 1px solid #d9f26b30;
  background: #191b1f; padding: 24px; border-radius: 12px; display: none; font-size: 13px; line-height: 1.7;
}
.h2h-drum #error strong { color: var(--lime); font-weight: 500; }
.h2h-drum #error p { color: #9da1a8; margin: 8px 0 0; }
.h2h-drum #error button {
  border: 1px solid #ffffff22; background: #25292e; padding: 8px 14px; border-radius: 5px; margin-top: 14px;
}
.h2h-drum.embed .debug-ui { display: none !important; }
.h2h-drum.embed .vignette {
  background: radial-gradient(ellipse at 71% 48%, transparent 30%, rgba(0,0,0,.1) 65%, rgba(0,0,0,.55));
}
.h2h-drum.embed .footer { justify-content: flex-end; }
.h2h-drum.embed .wordmark { opacity: .65; }
@media (min-width: 901px) {
  .h2h-drum.embed #loading { left: 71%; }
  .h2h-drum.embed #error { left: 48%; right: 7%; }
}
@media (max-width: 900px) {
  .h2h-drum .topbar { inset: 18px 18px auto; }
  .h2h-drum .identity strong { font-size: 12px; }
  .h2h-drum .identity small { font-size: 8px; letter-spacing: 1.1px; }
  .h2h-drum .status { font-size: 9px; }
  .h2h-drum .status span:last-child { display: none; }
  .h2h-drum .scene-heading { left: 18px; right: 18px; top: 84px; font-size: 8px; letter-spacing: 1.3px; }
  .h2h-drum .coordinates { display: none; }
  .h2h-drum .controls { left: 10px; right: 10px; bottom: 60px; gap: 12px; }
  .h2h-drum .mode-bar { gap: 1px; padding: 4px; border-radius: 10px; }
  .h2h-drum .mode-bar button { padding: 9px 8px; font-size: 9.5px; gap: 5px; }
  .h2h-drum .mode-bar svg { width: 12px; height: 12px; }
  .h2h-drum .camera-row { gap: 0; flex-wrap: wrap; }
  .h2h-drum .camera-row .caption { font-size: 8px; margin-right: 6px; }
  .h2h-drum .camera-row button { padding: 5px 7px; font-size: 9px; }
  .h2h-drum .camera-row .divider { margin: 0 5px; }
  .h2h-drum .footer { bottom: 16px; left: 18px; right: 18px; align-items: flex-end; }
  .h2h-drum .hint { font-size: 9px; max-width: 165px; line-height: 1.6; }
  .h2h-drum .footer-center { display: none; }
  .h2h-drum #error { left: 7%; right: 7%; top: 35%; }
  .h2h-drum #journey { left: 18px; right: 18px; top: 116px; }
  .h2h-drum .part-label { min-width: 105px; }
  .h2h-drum .part-label .label-card { padding: 7px 9px; }
  .h2h-drum .part-label .label-title { font-size: 10px; gap: 7px; }
  .h2h-drum .part-label .label-meta { font-size: 8px; margin-left: 0; }
  .h2h-drum .part-label .stem { height: 17px; }
  .h2h-drum.embed .vignette { background: radial-gradient(ellipse at center, transparent 30%, #00000060 100%); }
}
@media (max-width: 380px) {
  .h2h-drum .mode-bar button { padding: 8px 6px; font-size: 9px; }
  .h2h-drum .mode-bar svg { display: none; }
  .h2h-drum .camera-row .caption { display: none; }
  .h2h-drum .status { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .h2h-drum, .h2h-drum * { transition: none !important; }
  .h2h-drum #loading i { animation: none; }
}
`;
