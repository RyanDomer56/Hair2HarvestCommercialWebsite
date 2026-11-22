"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * MCH-01 — Hair2Harvest Composter v17 (chain drive)
 *
 * Procedural three.js model rebuilt from the v17 blueprint: the drum stays
 * still while a 12 V worm-gear motor turns the shaft through a guarded 40T/10T
 * chain. Five rings of three paddles lift and fold the mix. A sliding top door,
 * lock pin, flanged end bushings, UCP205 pillow blocks, square-tube frame,
 * slide-in discharge box and control cabinet follow the master drawing.
 *
 * Everything is generated in code — no external models, images or network.
 * The web panel only requests authorised start/stop; the E-stop is local
 * hardware, drawn in rust as a reminder of that boundary.
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
        aria-label="Interactive 3D cutaway of the Hair2Harvest v17 chain-drive composter: a horizontal drum stays still while a guarded chain turns five rings of paddles on a central shaft. A sliding top door, lock pin, discharge box and control cabinet are shown. Drag to rotate, scroll to zoom, click a part to inspect it."
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
            <strong>MCH-01 · v17 composter</strong>
            <small>Chain drive · Nova Proper</small>
          </div>
        </div>
        <div className="status" id="status">
          <i />
          <span id="status-text">Shaft mixing</span>
          <span>10 RPM</span>
        </div>
      </header>
      <div className="scene-heading debug-ui">
        Barber hair in · compost out <span className="index">NOVA PROPER · QCU</span>
      </div>
      <div className="coordinates debug-ui">MCH-01 — NOVA PROPER LINE</div>
      <div id="journey" className="debug-ui">
        <div className="journey-icon">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M3 5h10v6H3zM6 2v3m4-3v3M5 11v3m6-3v3" stroke="currentColor" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <strong id="journey-title">Collect</strong>
          <small id="journey-detail">Clean hair from partner barbers</small>
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
          <button data-camera="drive" aria-pressed="false">Drive</button>
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
export type DrumCamera = "overview" | "drum" | "drive" | "top" | "flight";
export type PartId = "drum" | "shaft" | "drive" | "door" | "discharge" | "cabinet";

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
      steel: mat(0xaab4ba, 0.78, 0.3),
      blue: mat(0x86b6dc, 0.25, 0.28, {
        transparent: true, opacity: 0.42, side: THREE.DoubleSide, depthWrite: false,
      }),
      guard: mat(0x9ed36a, 0.2, 0.35, {
        transparent: true, opacity: 0.13, side: THREE.DoubleSide, depthWrite: false,
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

    /** Lathe around X: profile is [axial position, radius] in scene units. */
    function latheX(
      parent: THREE.Object3D,
      profile: Array<[number, number]>,
      m: Material,
      segments = 48,
    ) {
      const pts = profile.map(([axial, radius]) => new THREE.Vector2(radius, axial));
      const o = new THREE.Mesh(new THREE.LatheGeometry(pts, segments), m);
      o.rotation.z = -Math.PI / 2;
      o.castShadow = true;
      o.receiveShadow = true;
      parent.add(o);
      return o;
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

    // -------------------------------------------------------- frame + floor
    const machine = new THREE.Group();
    scene.add(machine);

    const FLOOR_Y = 0.16;
    const FZ = 2.1;          // half frame width (420 mm)
    const FX = 4.3;          // half frame length (815 mm + cabinet room)
    const RAIL_Y = 5.14;     // bearing rail top = 513.5 mm
    const MID_Y = 1.72;
    const TUBE = 0.25;       // 25 x 25 x 1.5 square steel tube

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(48, 32), new THREE.ShadowMaterial({ opacity: 0.24 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.02;
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
      new THREE.PlaneGeometry(13.4, 6.6),
      new THREE.MeshBasicMaterial({
        map: shadowTex.texture, transparent: true, depthWrite: false, opacity: 0.6,
      }),
    );
    contact.rotation.x = -Math.PI / 2;
    contact.position.y = 0.004;
    scene.add(contact);

    const frame = new THREE.Group();
    machine.add(frame);

    // welded square-tube rails and uprights
    for (const y of [FLOOR_Y, MID_Y, RAIL_Y]) {
      for (const z of [-FZ, FZ]) {
        box(frame, FX * 2, TUBE, TUBE, 0, y, z, M.steel, 0.012);
      }
    }
    for (const x of [-FX, 0, FX]) {
      for (const y of [FLOOR_Y, RAIL_Y]) {
        box(frame, TUBE, TUBE, FZ * 2, x, y, 0, M.steel, 0.012);
      }
    }
    for (const x of [-FX, -1.6, FX]) {
      for (const z of [-FZ, FZ]) {
        box(frame, TUBE, RAIL_Y - FLOOR_Y, TUBE, x, (FLOOR_Y + RAIL_Y) / 2, z, M.steel, 0.012);
      }
    }

    // UCP205 pillow blocks carrying the shaft, not the drum
    for (const x of [-3.45, 2.25]) {
      box(frame, 0.76, 0.1, 0.92, x, RAIL_Y + 0.05, 0, M.body, 0.025);
      box(frame, 0.64, 0.34, 0.64, x, RAIL_Y + 0.27, 0, M.ivory, 0.1);
      cyl(frame, 0.23, 0.23, 0.66, x, RAIL_Y + 0.36, 0, M.dark, 20, "x");
      for (const z of [-0.24, 0.24]) {
        cyl(frame, 0.055, 0.055, 0.08, x, RAIL_Y + 0.13, z, M.chrome, 10);
      }
    }

    const engraving = canvasTexture(1536, 176, (c, w, h) => {
      c.fillStyle = "#252b32";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "#4d545c";
      c.lineWidth = 2;
      c.strokeRect(2, 2, w - 4, h - 4);
      print(c, "MCH-01", 42, 78, 38, "#d9f26b", 650);
      print(c, "·  v17 chain drive  ·  10 rpm  ·  Nova Proper", 298, 78, 27, "#b8bdc1", 450);
      print(c, "HAIR TO SOIL  ·  QCU BSIT CAPSTONE", 44, 132, 18, "#737e88", 500);
    });
    screen(machine, 5.4, 0.62, -0.4, 0.55, FZ + 0.03, engraving.texture);

    // ------------------------------------------------------- drum and shaft
    const DRUM_X = -0.6;
    const DRUM_Y = 5.5;
    const DRUM_L = 5.33;
    const R_MID = 1.575;
    const R_END_L = 1.335;
    const R_END_R = 1.305;

    const drumAssembly = new THREE.Group();
    machine.add(drumAssembly);

    const drumStatic = new THREE.Group();
    drumStatic.position.set(DRUM_X, DRUM_Y, 0);
    drumAssembly.add(drumStatic);

    // bulged shell from the measured circumferences: Ø267 / Ø315 / Ø261
    const shellMat = M.glass.clone() as THREE.MeshStandardMaterial;
    shellMat.color.setHex(0x9fc4e8);
    shellMat.opacity = 0.36;
    const shell = latheX(
      drumStatic,
      [
        [-DRUM_L / 2, R_END_L], [-2.2, 1.4], [-1.0, R_MID], [0, R_MID + 0.01],
        [1.0, R_MID], [2.2, 1.42], [DRUM_L / 2, R_END_R],
      ],
      shellMat,
      56,
    );
    shell.castShadow = false;

    // solid bands at the five measured ring stations
    const bandRadii: Array<[number, number]> = [
      [-DRUM_L / 2 + 0.08, R_END_L], [-1.0, R_MID], [1.0, R_MID], [DRUM_L / 2 - 0.08, R_END_R],
    ];
    for (const [x, r] of bandRadii) {
      ring(drumStatic, r + 0.02, 0.055, x, 0, 0, M.steel, "x");
    }

    // end plates, flanged bushings and 100 x 100 end plates — no support wheels
    for (const side of [-1, 1]) {
      const x = side * (DRUM_L / 2 + 0.03);
      const r = side < 0 ? R_END_L : R_END_R;
      cyl(drumStatic, r, r, 0.09, x, 0, 0, M.drum, 48, "x");
      cyl(drumStatic, 0.34, 0.34, 0.22, x + side * 0.1, 0, 0, M.copper, 24, "x");
      ring(drumStatic, 0.5, 0.06, x + side * 0.18, 0, 0, M.copper, "x");
      box(drumStatic, 0.08, 1.0, 1.0, x + side * 0.24, 0, 0, M.steel, 0.01);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        ball(drumStatic, 0.05, x + side * 0.1, Math.cos(a) * (r - 0.18), Math.sin(a) * (r - 0.18), M.chrome);
      }
    }

    // sliding top door, rails, barrel bolt and the 3 o'clock lock pin
    const doorAssembly = new THREE.Group();
    drumAssembly.add(doorAssembly);
    const door = new THREE.Mesh(
      new THREE.CylinderGeometry(1.62, 1.62, 1.9, 18, 1, true, Math.PI / 2 - 0.42, 0.84),
      M.copper,
    );
    door.rotation.z = Math.PI / 2;
    door.position.set(DRUM_X, DRUM_Y, 0);
    door.castShadow = true;
    doorAssembly.add(door);
    for (const z of [-0.62, 0.62]) {
      box(doorAssembly, 2.0, 0.06, 0.08, DRUM_X, DRUM_Y + 1.58, z, M.steel, 0.015);
    }
    box(doorAssembly, 0.1, 0.09, 0.5, DRUM_X + 0.98, DRUM_Y + 1.62, 0, M.chrome, 0.02);
    const pinX = DRUM_X - DRUM_L / 2 - 0.32;
    cyl(doorAssembly, 0.09, 0.09, 0.72, pinX, DRUM_Y, 1.72, M.copper, 14, "z");
    box(doorAssembly, 0.22, 0.22, 0.12, pinX, DRUM_Y, 2.1, M.body, 0.03);
    box(frame, 0.2, 0.44, 0.2, pinX, DRUM_Y, FZ + 0.08, M.body, 0.02);
    box(frame, 0.14, 0.18, 0.12, pinX, DRUM_Y, FZ - 0.04, M.dark, 0.02);

    // the shaft and its paddles turn; the drum shell stays still
    const shaftSpin = new THREE.Group();
    shaftSpin.position.set(DRUM_X, DRUM_Y, 0);
    drumAssembly.add(shaftSpin);
    cyl(shaftSpin, 0.167, 0.167, 6.0, 0, 0, 0, M.copper, 20, "x");
    cyl(shaftSpin, 0.125, 0.125, 7.4, 0, 0, 0, M.chrome, 16, "x");

    const ringX = [-1.155, -0.405, 0.345, 1.095, 1.845];
    const ringLen = [1.16, 1.16, 1.16, 1.13, 0.93];
    ringX.forEach((x, ri) => {
      const base = ri * (40 * Math.PI / 180);
      for (let k = 0; k < 3; k++) {
        const pivot = new THREE.Group();
        pivot.position.x = x;
        pivot.rotation.x = base + k * (TAU / 3);
        shaftSpin.add(pivot);
        const tab = box(pivot, 0.45, 0.45, 0.06, 0, 0.2, 0, M.steel, 0.01);
        const blade = box(pivot, 0.45, ringLen[ri], 0.06, 0, 0.22 + ringLen[ri] / 2, 0, M.copper, 0.02);
        tab.userData.spin = true;
        blade.userData.spin = true;
      }
    });

    // compost bed stays level while the paddles turn through it
    const bed = box(drumAssembly, DRUM_L - 0.55, 0.66, 2.2, DRUM_X, DRUM_Y - 0.95, 0, M.soil, 0.26);
    bed.castShadow = false;

    const gritGeo = new THREE.IcosahedronGeometry(0.075, 0);
    const grit = new THREE.InstancedMesh(gritGeo, M.soilLight, 140);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 140; i++) {
      const a = (i * 2654435761) % 1000 / 1000;
      const b = (i * 40503) % 1000 / 1000;
      dummy.position.set(
        DRUM_X + (a - 0.5) * (DRUM_L - 0.8),
        DRUM_Y - 0.86 + b * 0.38,
        (b - 0.5) * 1.9 + (a - 0.5) * 0.3,
      );
      dummy.rotation.set(a * TAU, b * TAU, 0);
      dummy.scale.setScalar(0.5 + ((i * 7) % 9) / 12);
      dummy.updateMatrix();
      grit.setMatrixAt(i, dummy.matrix);
    }
    grit.instanceMatrix.needsUpdate = true;
    drumAssembly.add(grit);

    // falling hair through the top door — the only input shown
    const hairCount = 24;
    const hairGeo = new THREE.CylinderGeometry(0.011, 0.011, 0.3, 5);
    const hair = new THREE.InstancedMesh(hairGeo, M.hair, hairCount);
    hair.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    drumAssembly.add(hair);
    const hairSeeds = Array.from({ length: hairCount }, (_, i) => ({
      phase: (i * 0.6180339887) % 1,
      x: DRUM_X + (((i * 73) % 100) / 100 - 0.5) * 1.5,
      z: (((i * 41) % 100) / 100 - 0.5) * 0.8,
      spin: ((i * 29) % 100) / 100 * TAU,
    }));
    function updateHair(t: number) {
      hairSeeds.forEach((s, i) => {
        const p = (s.phase + t * 0.28) % 1;
        dummy.position.set(s.x, DRUM_Y + 2.4 - p * 1.0, s.z);
        dummy.rotation.set(Math.sin(p * TAU + s.spin) * 0.5, s.spin, p * 2);
        dummy.scale.setScalar(0.5 + 0.4 * Math.sin(p * Math.PI));
        dummy.updateMatrix();
        hair.setMatrixAt(i, dummy.matrix);
      });
      hair.instanceMatrix.needsUpdate = true;
    }
    updateHair(0);

    // --------------------------------------------------------- chain drive
    const driveAssembly = new THREE.Group();
    machine.add(driveAssembly);

    const SPROCKET_X = DRUM_X + DRUM_L / 2 + 0.55;
    const BIG_R = 0.82;    // 40T, PCD 161.9 mm
    const SMALL_R = 0.21;  // 10T, PCD 41.1 mm
    const MOTOR_Y = 1.95;

    // 40T sprocket is keyed to the mixing shaft
    const bigSprocket = new THREE.Group();
    bigSprocket.position.set(SPROCKET_X - DRUM_X, 0, 0);
    shaftSpin.add(bigSprocket);
    cyl(bigSprocket, BIG_R, BIG_R, 0.14, 0, 0, 0, M.body, 32, "x");
    ring(bigSprocket, BIG_R + 0.03, 0.045, -0.08, 0, 0, M.steel, "x");
    ring(bigSprocket, BIG_R + 0.03, 0.045, 0.08, 0, 0, M.steel, "x");
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * TAU;
      const tooth = box(
        bigSprocket, 0.13, 0.1, 0.1,
        0, Math.cos(a) * (BIG_R + 0.05), Math.sin(a) * (BIG_R + 0.05), M.steel, 0.012,
      );
      tooth.rotation.x = a;
    }
    cyl(bigSprocket, 0.26, 0.26, 0.24, 0, 0, 0, M.dark, 20, "x");

    // 12 V worm-gear motor on a slotted mount plate
    box(driveAssembly, 1.5, 0.78, 0.78, SPROCKET_X + 0.95, MOTOR_Y, 0, M.body, 0.14);
    cyl(driveAssembly, 0.42, 0.42, 0.42, SPROCKET_X + 0.42, MOTOR_Y, 0, M.ivory, 24, "x");
    box(driveAssembly, 0.16, 0.92, 0.78, SPROCKET_X + 1.72, MOTOR_Y, 0, M.dark, 0.08);
    for (const z of [-0.5, 0.5]) {
      box(driveAssembly, 1.9, 0.1, 0.16, SPROCKET_X + 0.9, MID_Y + 0.05, z, M.steel, 0.02);
    }
    const motorSpin = new THREE.Group();
    motorSpin.position.set(SPROCKET_X, MOTOR_Y, 0);
    driveAssembly.add(motorSpin);
    cyl(motorSpin, SMALL_R, SMALL_R, 0.12, 0, 0, 0, M.body, 20, "x");
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU;
      const tooth = box(
        motorSpin, 0.1, 0.07, 0.07,
        0, Math.cos(a) * (SMALL_R + 0.035), Math.sin(a) * (SMALL_R + 0.035), M.steel, 0.01,
      );
      tooth.rotation.x = a;
    }
    cyl(motorSpin, 0.08, 0.08, 0.2, 0, 0, 0, M.chrome, 12, "x");

    // 58-link roller chain, shown as a closed loop between the sprockets
    const chainPts: Vec3[] = [
      [SPROCKET_X, DRUM_Y + BIG_R, 0],
      [SPROCKET_X, DRUM_Y, BIG_R],
      [SPROCKET_X, (DRUM_Y + MOTOR_Y) / 2, BIG_R * 0.92],
      [SPROCKET_X, MOTOR_Y, SMALL_R + 0.02],
      [SPROCKET_X, MOTOR_Y - SMALL_R, 0],
      [SPROCKET_X, MOTOR_Y, -(SMALL_R + 0.02)],
      [SPROCKET_X, (DRUM_Y + MOTOR_Y) / 2, -BIG_R * 0.92],
      [SPROCKET_X, DRUM_Y, -BIG_R],
    ];
    const chainCurve = new THREE.CatmullRomCurve3(
      chainPts.map((p) => new THREE.Vector3(...p)), true, "catmullrom", 0.18,
    );
    driveAssembly.add(
      new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 180, 0.045, 6, true), M.edge),
    );

    const linkCount = 58;
    const links = new THREE.InstancedMesh(boxGeo(0.13, 0.045, 0.1, 0.01), M.steel, linkCount);
    links.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    driveAssembly.add(links);
    const chainPos = new THREE.Vector3();
    const chainTan = new THREE.Vector3();
    function updateChain(t: number) {
      for (let i = 0; i < linkCount; i++) {
        const u = (i / linkCount + t * 0.055) % 1;
        chainCurve.getPointAt(u, chainPos);
        chainCurve.getTangentAt(u, chainTan);
        dummy.position.copy(chainPos);
        dummy.rotation.set(0, 0, Math.atan2(chainTan.y, chainTan.z));
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        links.setMatrixAt(i, dummy.matrix);
      }
      links.instanceMatrix.needsUpdate = true;
    }
    updateChain(0);

    // translucent green chain guard, lifted in cutaway mode
    const guardGroup = new THREE.Group();
    driveAssembly.add(guardGroup);
    const guardY = (DRUM_Y + MOTOR_Y) / 2 + 0.15;
    for (const x of [SPROCKET_X - 0.19, SPROCKET_X + 0.19]) {
      box(guardGroup, 0.035, 4.85, 2.1, x, guardY, 0, M.guard, 0.01);
    }
    for (const z of [-1.05, 1.05]) {
      box(guardGroup, 0.42, 4.85, 0.035, SPROCKET_X, guardY, z, M.guard, 0.01);
      box(guardGroup, 0.05, 4.85, 0.05, SPROCKET_X + 0.21, guardY, z, M.green, 0.01);
    }
    for (const y of [guardY - 2.42, guardY + 2.42]) {
      box(guardGroup, 0.05, 0.05, 2.1, SPROCKET_X + 0.21, y, 0, M.green, 0.01);
    }

    // ---------------------------------------------------------- discharge
    const dischargeAssembly = new THREE.Group();
    machine.add(dischargeAssembly);
    box(dischargeAssembly, 4.6, 1.85, 3.2, DRUM_X, 2.1, 0, M.body, 0.06);
    box(dischargeAssembly, 4.4, 0.08, 3.0, DRUM_X, 3.05, 0, M.steel, 0.02);
    box(dischargeAssembly, 0.1, 0.12, 0.9, DRUM_X + 2.35, 2.1, 0, M.chrome, 0.02);

    // compost settling in the slide-in box
    for (let i = 0; i < 22; i++) {
      const a = (i / 22) * TAU;
      const r = 0.15 + (i % 5) * 0.2;
      ball(
        dischargeAssembly, 0.15 + (i % 4) * 0.04,
        DRUM_X + Math.cos(a) * r * 1.3, 3.12 + ((i * 13) % 7) * 0.025, Math.sin(a) * r,
        i % 3 ? M.soil : M.soilLight,
      );
    }

    const crumbCount = 22;
    const crumbs = new THREE.InstancedMesh(gritGeo, M.soilLight, crumbCount);
    crumbs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    dischargeAssembly.add(crumbs);
    function updateCrumbs(t: number) {
      for (let i = 0; i < crumbCount; i++) {
        const p = ((i * 0.618) % 1 + t * 0.12) % 1;
        dummy.position.set(
          DRUM_X + (((i * 17) % 10) / 10 - 0.5) * 3.8,
          3.18 - p * 0.5,
          (((i * 31) % 100) / 100 - 0.5) * 2.4,
        );
        dummy.rotation.set(p * 3, p * 2, 0);
        dummy.scale.setScalar(0.65);
        dummy.updateMatrix();
        crumbs.setMatrixAt(i, dummy.matrix);
      }
      crumbs.instanceMatrix.needsUpdate = true;
    }
    updateCrumbs(0);

    const outLabel = canvasTexture(512, 116, (c, w, h) => {
      c.fillStyle = "#242a12";
      c.fillRect(0, 0, w, h);
      print(c, "COMPOST OUT", 24, 48, 28, "#d9f26b", 650);
      print(c, "SLIDE-OUT BOX · EMPTY BY HAND", 24, 88, 16, "#9a9c86", 500);
    });
    screen(dischargeAssembly, 1.55, 0.35, DRUM_X + 1.05, 1.15, 1.63, outLabel.texture);

    // ------------------------------------------------------------ sensors
    const sensorAssembly = new THREE.Group();
    machine.add(sensorAssembly);
    cyl(sensorAssembly, 0.055, 0.055, 1.5, 0.75, 6.55, -0.55, M.chrome, 12);
    ball(sensorAssembly, 0.09, 0.75, 5.82, -0.55, M.light);
    box(sensorAssembly, 0.1, 1.2, 0.1, 0.75, 7.15, -0.55, M.dark, 0.02);
    tube(sensorAssembly, [
      [0.75, 7.72, -0.55], [1.6, 7.2, -1.2], [3.6, 4.2, -1.4], [4.55, 2.9, -0.8],
    ], 0.035, M.dark);
    box(sensorAssembly, 0.36, 0.5, 0.3, -2.6, 4.5, -1.75, M.ivory, 0.04);
    box(sensorAssembly, 0.36, 0.5, 0.3, 1.7, 4.5, -1.75, M.ivory, 0.04);

    const probeTex = canvasTexture(420, 260, () => {});
    function drawProbe(t: number) {
      const c = probeTex.ctx, w = 420, h = 260;
      c.fillStyle = "#12231e";
      c.fillRect(0, 0, w, h);
      print(c, "CORE TEMP", 24, 44, 20, "#9cae91", 500);
      const temp = 52.6 + Math.sin(t * 0.35) * 0.7;
      print(c, `${temp.toFixed(1)} °C`, 22, 128, 68, "#ecedc7", 600);
      print(c, "PROBE · IN THE PILE", 24, 168, 15, "#6d8a72", 500);
      c.fillStyle = "#d9f26b";
      c.fillRect(24, 202, 260 + Math.sin(t * 0.6) * 24, 8);
      c.fillStyle = "#334348";
      c.fillRect(24, 224, 372, 6);
      probeTex.texture.needsUpdate = true;
    }
    drawProbe(0);
    const probeScreen = screen(sensorAssembly, 1.05, 0.65, 0.75, 7.75, -0.52, probeTex.texture);
    probeScreen.rotation.y = 0.12;

    // ------------------------------------------------------ control cabinet
    const cabinetAssembly = new THREE.Group();
    cabinetAssembly.position.set(5.15, 0, 0);
    machine.add(cabinetAssembly);
    box(cabinetAssembly, 1.7, 2.6, 1.5, 0, 1.45, 0, M.ivory, 0.1);
    box(cabinetAssembly, 1.85, 0.14, 1.62, 0, 2.82, 0, M.body, 0.05);
    box(cabinetAssembly, 0.22, 0.34, 0.22, 0, 0.18, 0, M.dark, 0.03);

    // 3 L water tank on top with float switch
    const tank = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.9, 1.0), M.blue);
    tank.position.set(0, 3.36, 0);
    tank.castShadow = true;
    cabinetAssembly.add(tank);
    box(cabinetAssembly, 1.22, 0.08, 1.06, 0, 3.84, 0, M.steel, 0.02);
    cyl(cabinetAssembly, 0.06, 0.06, 0.42, 0.36, 3.98, 0, M.chrome, 10);
    ball(cabinetAssembly, 0.09, 0.36, 4.2, 0, M.light);

    const panelTex = canvasTexture(560, 620, () => {});
    function drawPanel(t: number) {
      const c = panelTex.ctx, w = 560, h = 620;
      c.fillStyle = "#111b20";
      c.fillRect(0, 0, w, h);
      print(c, "MCH-01", 28, 52, 24, "#d9f26b", 650);
      print(c, "NOVA PROPER", 350, 52, 16, "#607475", 500);
      c.fillStyle = "#202c30";
      c.fillRect(24, 76, 512, 3);
      const rows = [
        ["SHAFT", "MIXING", "#d9f26b"],
        ["SPEED", "10 RPM", "#d4d8cc"],
        ["TEMP", "52 °C", "#d4d8cc"],
        ["MOISTURE", "54 %", "#d4d8cc"],
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
    screen(cabinetAssembly, 1.2, 1.3, 0, 1.78, 0.77, panelTex.texture);

    // local ON/OFF, STOP and latching E-STOP
    cyl(cabinetAssembly, 0.1, 0.1, 0.06, -0.52, 0.95, 0.78, M.green, 18, "z");
    cyl(cabinetAssembly, 0.1, 0.1, 0.06, 0, 0.95, 0.78, M.ivory, 18, "z");
    cyl(cabinetAssembly, 0.14, 0.14, 0.09, 0.52, 0.95, 0.78, M.rust, 20, "z");
    ring(cabinetAssembly, 0.18, 0.025, 0.52, 0.95, 0.8, M.chrome, "z");

    const cabinetLabel = canvasTexture(512, 116, (c, w, h) => {
      c.fillStyle = "#e0ded4";
      c.fillRect(0, 0, w, h);
      print(c, "LOCAL CONTROLS", 24, 48, 26, "#a6402a", 650);
      print(c, "WEB REQUESTS SESSIONS", 24, 88, 16, "#556059", 500);
    });
    screen(cabinetAssembly, 1.28, 0.29, 0, 2.66, 0.77, cabinetLabel.texture);

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
      p.position.set(DRUM_X - 1.4 + i * 0.5, DRUM_Y + 1.7, -0.5 + (i % 3) * 0.35);
      p.userData.phase = (i * 0.618) % 1;
      machine.add(p);
      steamPlanes.push(p);
    }

    // ------------------------------------------------------------- parts
    const partDefs: Omit<PartDef, "group" | "base" | "label" | "anchor" | "index">[] = [
      {
        id: "drum", name: "Composting drum", meta: "25 L · Ø315 middle",
        desc: "The drum stays still. The shaft turns inside it; slide the top door only when emptying.",
      },
      {
        id: "shaft", name: "Mixing shaft", meta: "15 paddles · 10 rpm",
        desc: "Five rings of three paddles lift and fold the hair and compost. The drum itself does not spin.",
      },
      {
        id: "drive", name: "Chain drive", meta: "12 V motor · 40T / 10T",
        desc: "A slow worm-gear motor turns the shaft through a guarded roller chain.",
      },
      {
        id: "door", name: "Door & lock pin", meta: "Top opening · locked",
        desc: "The pin holds the drum at home. Stop and unlock before sliding the door to empty.",
      },
      {
        id: "discharge", name: "Discharge box", meta: "~55 L · slide-out",
        desc: "Finished compost drops into the box below the drum and is emptied by hand.",
      },
      {
        id: "cabinet", name: "Control cabinet", meta: "Start / stop / E-stop",
        desc: "Local controls run the machine. The website only requests authorised sessions.",
      },
    ];

    const assemblies: Record<PartId, THREE.Group> = {
      drum: drumStatic,
      shaft: shaftSpin,
      drive: driveAssembly,
      door: doorAssembly,
      discharge: dischargeAssembly,
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
      drum: [DRUM_X - 1.0, DRUM_Y + 1.5, 0],
      shaft: [DRUM_X + 0.4, DRUM_Y + 0.4, 0],
      drive: [SPROCKET_X + 0.4, 4.2, 0],
      door: [DRUM_X - 0.2, DRUM_Y + 1.9, 0],
      discharge: [DRUM_X + 0.6, 2.5, 1.4],
      cabinet: [5.15, 2.9, 0.7],
    };
    parts.forEach((p) => p.anchor.fromArray(anchors[p.id]));
    const spreadTargets: Record<PartId, Vec3> = {
      drum: [0, 0.3, -0.6],
      shaft: [0, -0.35, 0.7],
      drive: [1.1, 0, 0],
      door: [0, 0.9, 0],
      discharge: [0, -0.45, 0],
      cabinet: [1.0, 0, 0],
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
    const desiredTarget = new THREE.Vector3(0, 3.1, 0);
    const viewDirection = new THREE.Vector3(9.5, 7.2, 16).normalize();
    // Keep y <= cY OR z <= cZ: only the front-top quarter is removed.
    const cutPlaneY = new THREE.Plane(new THREE.Vector3(0, -1, 0), 20);
    const cutPlaneZ = new THREE.Plane(new THREE.Vector3(0, 0, -1), 20);
    shellMat.clippingPlanes = [cutPlaneY, cutPlaneZ];
    shellMat.clipIntersection = true;

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
        12.8 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect * availableWidth);
      const verticalFit =
        10.6 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (embedded ? 0.85 : 0.78));
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
        desiredTarget.set(DRUM_X, DRUM_Y, 0);
        desiredPosition.copy(desiredTarget).addScaledVector(viewDirection, mobile ? 9 : 12);
      } else if (cameraMode === "drive") {
        desiredTarget.set(SPROCKET_X + 0.2, 3.7, 0);
        desiredPosition.copy(desiredTarget).addScaledVector(viewDirection, mobile ? 8 : 10);
      } else {
        desiredTarget.set(0, 3.1, 0);
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
      Overview: "overview", Drum: "drum", Drive: "drive", Top: "top", Flight: "flight",
      overview: "overview", drum: "drum", drive: "drive", Motor: "drive", motor: "drive",
      top: "top", flight: "flight",
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
      } else if (cameraMode === "drum" || cameraMode === "drive") {
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
      cameraMode = id === "drive" || id === "cabinet" ? "drive" : "drum";
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
      $("status-text").textContent = playing ? "Shaft mixing" : "Shaft paused";
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
      ["Collect", "Clean hair from partner barbers"],
      ["Load", "Through the sliding top door"],
      ["Mix", "Paddles turn slowly at 10 rpm"],
      ["Rest", "The pile settles and matures"],
      ["Return", "Compost slides out below the drum"],
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
      cutPlaneY.constant = 20 - cutAmount * (20 - (DRUM_Y + 0.05));
      cutPlaneZ.constant = 20 - cutAmount * (20 - 0.15);
      shellMat.opacity = 0.36 - cutAmount * 0.16;
      guardGroup.visible = mode !== "cutaway";

      parts.forEach((p) => {
        const target = spreadTargets[p.id];
        p.group.position.set(
          p.base.x + target[0] * spread,
          p.base.y + target[1] * spread,
          p.base.z + target[2] * spread,
        );
      });

      // only the shaft, its paddles and the 40T sprocket turn
      const turn = t * 0.52;
      shaftSpin.rotation.x = turn;
      motorSpin.rotation.x = -turn * 4;

      // material flow
      if (t - lastDraw > 1 / 20 || lastDraw < 0) {
        updateChain(t);
        updateHair(t);
        updateCrumbs(t);
        drawProbe(t);
        drawPanel(t);
        lastDraw = t;
      }

      steamPlanes.forEach((p, i) => {
        const p2 = (p.userData.phase + t * 0.14) % 1;
        p.position.y = DRUM_Y + 1.7 + p2 * 1.5;
        p.position.x = DRUM_X - 1.4 + i * 0.5 + Math.sin(p2 * 4 + i) * 0.18;
        p.scale.setScalar(0.6 + p2 * 1.3);
        (p.material as THREE.MeshBasicMaterial).opacity = 0.14 * Math.sin(p2 * Math.PI);
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
      } else if ((cameraMode === "drum" || cameraMode === "drive") && cameraAnimating) {
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
