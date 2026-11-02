"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Strand = {
  x: number;
  length: number;
  amp: number;
  amp2: number;
  freq: number;
  phase: number;
  speed: number;
  width: number;
  alpha: number;
  weight: number;
};

/**
 * A field of drifting hair strands that read as roots once they reach the
 * bottom of the frame. Purely decorative; frozen on frame one when the visitor
 * prefers reduced motion.
 */
export function HairWeave({
  className,
  density = 92,
  opacity = 1,
}: {
  className?: string;
  density?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let strands: Strand[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;
    let running = true;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(density * Math.min(1.4, Math.max(0.5, width / 1100)));
      strands = Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        return {
          x: (i / count) * width + (r - 0.5) * 46,
          length: height * (0.42 + r * 0.62),
          amp: height * (0.045 + r * 0.115),
          amp2: height * (0.01 + ((i * 7) % 23) / 900),
          freq: 0.7 + ((i * 13) % 17) / 12,
          phase: r * Math.PI * 2,
          speed: 0.00016 + ((i * 11) % 9) * 0.000045,
          width: 0.45 + (i % 5) * 0.18,
          alpha: 0.045 + ((i * 17) % 11) / 240,
          weight: (i % 7) / 7,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      for (const s of strands) {
        const drift = Math.sin(t * s.speed * 1000 + s.phase) * 0.5 + 0.5;
        const sway = Math.sin(t * 0.0004 * s.freq + s.phase) * s.amp;
        const top = -height * 0.14;
        const bottom = top + s.length;

        ctx.beginPath();
        ctx.moveTo(s.x, top);
        ctx.bezierCurveTo(
          s.x + sway * 0.85,
          top + s.length * 0.3,
          s.x - sway * 0.95 + s.amp2 * (drift - 0.5),
          top + s.length * 0.68,
          s.x + sway * 0.42,
          bottom,
        );
        ctx.strokeStyle = `rgba(71, 85, 42, ${s.alpha * opacity})`;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }
    };

    const tick = (now: number) => {
      if (!running) return;
      t = now;
      draw();
      raf = requestAnimationFrame(tick);
    };

    build();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      build();
      if (reduce) draw();
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [density, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    />
  );
}
