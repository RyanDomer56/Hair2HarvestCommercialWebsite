"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export type AvatarDance =
  | "idle"
  | "bounce"
  | "groove"
  | "cute"
  | "spin"
  | "party"
  | "scream"
  | "sad";

interface Avatar3DProps {
  /** Path to the OBJ character. Default: the supplied scissor avatar. */
  src?: string;
  size?: number;
  /** While true, the avatar does a "speaking" bob on top of its current dance. */
  talking?: boolean;
  /** Which procedural dance to perform (whole-body, since the OBJ is unrigged). */
  dance?: AvatarDance;
  /** Bias the camera slightly up toward the upper body. */
  faceMode?: boolean;
  /** Called if the model can't be loaded (missing file, WebGL off, parse error). */
  onError?: () => void;
}

// Procedural whole-body dances. Each is [bounce, sway/tilt, spin-ish] plus a
// speed `w`. The scissor avatar is a single unrigged mesh, so the dances move
// the whole character (bounce, sway, tilt, spin, pulse) — same approach as the
// supplied "Avatar Dance Studio".
const DANCES: Record<
  AvatarDance,
  { b: number; s: number; r: number; w: number; kind: "base" | "spin" | "scream" | "sad" }
> = {
  idle: { b: 0.0, s: 0.0, r: 0.0, w: 3.3, kind: "base" },
  bounce: { b: 0.2, s: 0.06, r: 0.08, w: 3.3, kind: "base" },
  groove: { b: 0.1, s: 0.34, r: 0.28, w: 3.3, kind: "base" },
  cute: { b: 0.22, s: 0.46, r: 0.42, w: 5.5, kind: "base" },
  spin: { b: 0.08, s: 0.05, r: 0.1, w: 3.3, kind: "spin" },
  party: { b: 0.25, s: 0.65, r: 0.52, w: 7, kind: "spin" },
  scream: { b: 0.14, s: 0.55, r: 0.55, w: 11, kind: "scream" },
  sad: { b: 0.05, s: 0.1, r: 0.03, w: 1.1, kind: "sad" },
};

/**
 * Renders the scissor OBJ avatar with three.js and drives the procedural dance
 * system. Honors prefers-reduced-motion. Falls back to the SVG avatar via
 * `onError` when the file isn't available or WebGL is off.
 */
export default function Avatar3D({
  src = "/models/ScissorAvatarH2H.obj",
  size = 72,
  talking = false,
  dance = "idle",
  faceMode = false,
  onError,
}: Avatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const talkingRef = useRef(talking);
  talkingRef.current = talking;
  const danceRef = useRef<AvatarDance>(dance);
  danceRef.current = dance;
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      onErrorRef.current?.();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const fov = 35;
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xcbd8ff, 0x4c355b, 2));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb08cff, 1.8);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const root = new THREE.Group();
    scene.add(root);
    let modelRadius = 1;
    let disposed = false;
    let frame = 0;
    const clock = new THREE.Clock();
    let elapsed = 0;

    new OBJLoader().load(
      src,
      (obj) => {
        if (disposed) return;
        const box = new THREE.Box3().setFromObject(obj);
        const size3 = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        obj.position.sub(center);
        const fit = 1.85 / Math.max(size3.x, size3.y, size3.z || 1);
        obj.scale.setScalar(fit);

        obj.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const sm = m as THREE.MeshStandardMaterial;
              // Keep the model's own materials; only add a neutral one if it has none.
              if (!sm || !("color" in sm)) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xd8dbea,
                  roughness: 0.72,
                });
              }
              (mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
            });
          }
        });

        root.add(obj);

        // Frame the model by its bounding sphere, with a small margin.
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        modelRadius = sphere.radius * fit;
        const dist = (modelRadius / Math.tan((fov / 2) * (Math.PI / 180))) * 1.7;
        camera.position.set(0, faceMode ? modelRadius * 0.2 : 0.15, dist);
        camera.lookAt(0, faceMode ? modelRadius * 0.15 : 0, 0);
      },
      undefined,
      () => onErrorRef.current?.(),
    );

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      elapsed += dt;
      if (!root.children.length) {
        renderer.render(scene, camera);
        return;
      }
      if (reduce) {
        root.rotation.y = 0.4;
        renderer.render(scene, camera);
        return;
      }

      const name = danceRef.current ?? "idle";
      const d = DANCES[name];
      const w = d.w || 3.3;
      const t = elapsed;

      let posY = d.b * (0.5 + 0.5 * Math.sin(t * w * 2));
      let rotZ = d.s * Math.sin(t * w);
      let rotX = 0.07 * Math.sin(t * w * 0.65);
      let rotY =
        d.kind === "spin" ? (name === "spin" ? t * 1.7 : t * 0.55) : 0.14 * Math.sin(t * w * 0.5);

      let sx = 1 / (1 + 0.025 * Math.sin(t * w * 2));
      let sy = 1 + 0.025 * Math.sin(t * w * 2);
      let sz = sx;

      if (name === "cute") rotZ += 0.12 * Math.sin(t * 2.8);

      if (d.kind === "scream") {
        posY += 0.05 * Math.sin(t * 30);
        rotZ += 0.35 * Math.sin(t * 42);
        rotX += 0.25 * Math.sin(t * 34);
        rotY += 0.4 * Math.sin(t * 38);
      }

      if (d.kind === "sad") {
        rotX = -0.24 + 0.05 * Math.sin(t * 1.1);
        posY = -0.07 + 0.03 * Math.sin(t * 1.1);
        sx *= 0.95;
        sy *= 0.95;
        sz *= 0.95;
      }

      if (talkingRef.current) {
        posY += 0.03 * Math.abs(Math.sin(t * 11));
        sy *= 1 + 0.03 * Math.abs(Math.sin(t * 11));
      }

      root.position.y = posY;
      root.rotation.set(rotX, rotY, rotZ);
      root.scale.set(sx, sy, sz);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [src, size, faceMode]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      role="img"
      aria-label="3D assistant avatar"
    />
  );
}
