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
// supplied "Avatar Dance Studio". `idle` keeps a gentle breathing bob so Snip
// always looks alive.
const DANCES: Record<
  AvatarDance,
  { b: number; s: number; r: number; w: number; kind: "base" | "spin" | "scream" | "sad" }
> = {
  idle: { b: 0.06, s: 0.0, r: 0.0, w: 2.2, kind: "base" },
  bounce: { b: 0.32, s: 0.12, r: 0.14, w: 3.6, kind: "base" },
  groove: { b: 0.18, s: 0.46, r: 0.38, w: 3.6, kind: "base" },
  cute: { b: 0.32, s: 0.56, r: 0.5, w: 5.5, kind: "base" },
  spin: { b: 0.12, s: 0.08, r: 0.14, w: 3.3, kind: "spin" },
  party: { b: 0.34, s: 0.74, r: 0.6, w: 7, kind: "spin" },
  scream: { b: 0.14, s: 0.55, r: 0.55, w: 11, kind: "scream" },
  sad: { b: 0.05, s: 0.1, r: 0.03, w: 1.1, kind: "sad" },
};

// A friendly cartoon face (eyes + smile) placed on the flat front of the
// scissor so "Snip" clearly reads as a character. Sized relative to the model
// radius `R` and added to the same group as the body so it dances along.
function makeFace(R: number): THREE.Group {
  const g = new THREE.Group();
  const eyeR = 0.17 * R;
  const pupR = 0.085 * R;
  const eyeY = 0.56 * R;
  const eyeX = 0.3 * R;
  const eyeZ = 0.16;
  const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x161616, roughness: 0.5, metalness: 0 });

  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(eyeR, 24, 24), white);
    eye.position.set(sx * eyeX, eyeY, eyeZ);
    g.add(eye);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(pupR, 16, 16), dark);
    pupil.position.set(sx * eyeX, eyeY, eyeZ + eyeR * 0.7);
    g.add(pupil);
  }

  // Smile: a half-torus rotated so the arc opens upward.
  const smile = new THREE.Mesh(
    new THREE.TorusGeometry(0.32 * R, 0.05 * R, 12, 36, Math.PI),
    dark,
  );
  smile.position.set(0, -0.16 * R, eyeZ);
  smile.rotation.z = Math.PI;
  g.add(smile);

  return g;
}

/**
 * Renders the scissor OBJ avatar with three.js and drives the procedural dance
 * system. Honors prefers-reduced-motion. Falls back to the SVG avatar via
 * `onError` when the file isn't available or WebGL is off.
 */
export default function Avatar3D({
  src = "/models/ScissorAvatarH2H.obj",
  size = 96,
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
    const fov = 32;
    const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x4c355b, 2.2));
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    key.position.set(2, 4, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xb08cff, 1.6);
    rim.position.set(-3, 2, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffffff, 1.2);
    fill.position.set(0, 1, 6);
    scene.add(fill);

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
          if (mesh.isMesh && mesh.geometry) {
            // OBJ files ship without normals; compute them so the model is lit
            // (otherwise MeshStandardMaterial renders as a dark, unlit blob).
            if (!(mesh.geometry as THREE.BufferGeometry).attributes?.normal) {
              mesh.geometry.computeVertexNormals();
            }
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const sm = m as THREE.MeshStandardMaterial;
              if (!sm || !("color" in sm) || !(sm as THREE.MeshStandardMaterial).color) {
                mesh.material = new THREE.MeshStandardMaterial({
                  color: 0xc9ced8,
                  metalness: 0.55,
                  roughness: 0.32,
                });
              } else {
                // Give the scissor a friendly metallic sheen.
                sm.metalness = 0.55;
                sm.roughness = 0.32;
              }
              (mesh.material as THREE.MeshStandardMaterial).side = THREE.DoubleSide;
            });
          }
        });

        root.add(obj);

        // Frame the model by its bounding sphere, filling most of the view.
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        modelRadius = sphere.radius * fit;
        const dist = (modelRadius / Math.tan((fov / 2) * (Math.PI / 180))) * 1.12;
        const up = faceMode ? modelRadius * 0.12 : 0;
        camera.position.set(0, up, dist);
        camera.lookAt(0, faceMode ? modelRadius * 0.08 : 0, 0);

        // Add the cartoon face on the flat front of the scissor.
        const face = makeFace(modelRadius);
        root.add(face);
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
