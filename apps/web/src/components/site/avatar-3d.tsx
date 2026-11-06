"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Avatar3DProps {
  src: string;
  size?: number;
  talking?: boolean;
  /** Called if the model can't be loaded (missing file, WebGL off, parse error). */
  onError?: () => void;
}

/**
 * Renders a downloadable 3D avatar (glTF/GLB) with three.js — no extra deps
 * beyond the `three` already in the project. Idle float + turn, a subtle
 * talking bounce, and automatic playback of the model's own animation clip
 * (so a Mixamo-rigged GLB will just work). Honors prefers-reduced-motion.
 * Falls back to the SVG avatar via `onError` if the file isn't available.
 */
export default function Avatar3D({ src, size = 72, talking = false, onError }: Avatar3DProps) {
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
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        const sphere = box.getBoundingSphere(new THREE.Sphere());
        baseScale = 2.4 / (sphere.radius || 1);
        wrap = new THREE.Group();
        wrap.add(model);
        wrap.scale.setScalar(baseScale);
        scene.add(wrap);
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
        wrap.rotation.y = Math.sin(elapsed * 0.55) * 0.4;
        wrap.rotation.x = Math.sin(elapsed * 0.4) * 0.06;
        wrap.position.y = Math.sin(elapsed * 1.1) * 0.04;
        if (talkingRef.current) {
          wrap.scale.set(baseScale, baseScale * (1 + Math.sin(elapsed * 13) * 0.03), baseScale);
        } else {
          wrap.scale.setScalar(baseScale);
        }
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
  }, [src, size]);

  return (
    <div
      ref={mountRef}
      style={{ width: size, height: size }}
      role="img"
      aria-label="3D assistant avatar"
    />
  );
}
