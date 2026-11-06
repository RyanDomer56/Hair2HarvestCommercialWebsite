"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Avatar3DProps {
  src: string;
  size?: number;
  talking?: boolean;
  /** Hex color that tints the model (multiplies its texture). Default: brand green. */
  tint?: string;
  /** Enable the walking bounce + lean + sway. Default: true. */
  walk?: boolean;
  /** Called if the model can't be loaded (missing file, WebGL off, parse error). */
  onError?: () => void;
}

/**
 * Renders a downloadable 3D avatar (glTF/GLB) with three.js — no extra deps
 * beyond the `three` already in the project. Tints the model green, gives it a
 * lively walking bounce + lean + sway (with a ground shadow to sell the motion),
 * and a talking pulse while the assistant speaks. Honors prefers-reduced-motion.
 * Auto-plays the model's own animation clip if one is bundled. Falls back to the
 * SVG avatar via `onError` when the file isn't available.
 */
export default function Avatar3D({
  src,
  size = 72,
  talking = false,
  tint = "#5bbf5b",
  walk = true,
  onError,
}: Avatar3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const talkingRef = useRef(talking);
  talkingRef.current = talking;
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
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.1, 4.2);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a3b2a, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd9f26b, 0.6);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    // Soft ground shadow — sells the "walking" bounce.
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.9, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.24, depthWrite: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    scene.add(shadow);

    let wrap: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let baseScale = 1;
    const clock = new THREE.Clock();
    let elapsed = 0;
    let frame = 0;
    let disposed = false;

    const loader = new GLTFLoader();
    loader.load(
      src,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (mesh.isMesh) {
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const sm = m as THREE.MeshStandardMaterial;
              if (sm && "color" in sm) sm.color.set(tint);
            });
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        baseScale = 2.4 / (sphere.radius || 1);
        wrap = new THREE.Group();
        wrap.add(model);
        wrap.scale.setScalar(baseScale);
        scene.add(wrap);

        shadow.position.y = -sphere.radius * baseScale - 0.04;

        if (gltf.animations && gltf.animations.length) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
        }
      },
      undefined,
      () => onErrorRef.current?.(),
    );

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      elapsed += dt;
      if (wrap && !reduce) {
        const turn = Math.sin(elapsed * 0.5) * 0.5;
        if (walk) {
          const step = elapsed * 3.0; // walk cadence
          const bounce = Math.abs(Math.sin(step)); // 0..1
          wrap.position.y = bounce * 0.07;
          wrap.rotation.x = Math.sin(step) * 0.05; // forward/back lean
          wrap.rotation.z = Math.sin(step * 0.5) * 0.03; // side sway
          wrap.rotation.y = turn;
          const s = 1 - bounce * 0.22;
          shadow.scale.set(s, s, s);
          (shadow.material as THREE.MeshBasicMaterial).opacity = 0.26 - bounce * 0.1;
        } else {
          wrap.position.y = Math.sin(elapsed * 1.1) * 0.04;
          wrap.rotation.set(Math.sin(elapsed * 0.4) * 0.06, turn, 0);
        }
        const ty = talkingRef.current ? 1 + Math.sin(elapsed * 13) * 0.03 : 1;
        wrap.scale.set(baseScale, baseScale * ty, baseScale);
      } else if (wrap) {
        wrap.rotation.y = 0.4; // static, neutral pose
      }
      if (mixer) mixer.update(dt);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      if (mixer) mixer.stopAllAction();
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
  }, [src, size, tint, walk]);

  return (
    <div ref={mountRef} style={{ width: size, height: size }} role="img" aria-label="3D assistant avatar" />
  );
}
