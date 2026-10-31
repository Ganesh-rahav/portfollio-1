'use client';

import { useEffect, useRef } from 'react';
import {
  clamp,
  displace,
  generatePoints,
  lerp,
  limbFactor,
  project,
  pushFromPointer,
  type SpherePoint,
} from '@/lib/orb';

const POINT_COUNT = 2600;
const POINTS: SpherePoint[] = generatePoints(POINT_COUNT);

const SPHERE_RADIUS_RATIO = 0.36;
const TILT = 0.5;
const ROTATION_PERIOD_MS = 60_000;
const POINTER_INFLUENCE_PX = 90;
const POINTER_MAX_PUSH_PX = 14;
const POINTER_LERP_FACTOR = 0.12;
const PERF_SAMPLE_FRAMES = 120;

type RGB = [number, number, number];

function hexToRgb(hex: string): RGB {
  const normalized = hex.trim().replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return [r, g, b];
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

type Colors = { dot: RGB; back: RGB; accent: RGB };

function readColors(el: HTMLElement): Colors {
  const style = getComputedStyle(el);
  const dotHex = style.getPropertyValue('--orb-dot').trim() || '#dcf5e8';
  const backHex = style.getPropertyValue('--orb-dot-back').trim() || '#78aa91';
  const accentHex = style.getPropertyValue('--acc').trim() || '#9be0bb';
  return { dot: hexToRgb(dotHex), back: hexToRgb(backHex), accent: hexToRgb(accentHex) };
}

/** Pre-allocated, reused every frame — no per-frame allocation. */
function createScratchBuffers(n: number) {
  return {
    px: new Float32Array(n),
    py: new Float32Array(n),
    size: new Float32Array(n),
    alpha: new Float32Array(n),
    tint: new Float32Array(n),
    isFront: new Uint8Array(n),
  };
}

export function DotOrb() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const staticMode = reducedMotion || isCoarsePointer;

    let cssWidth = 0;
    let cssHeight = 0;
    let colors = readColors(frame);
    const buffers = createScratchBuffers(POINT_COUNT);

    const pointer = { targetX: 0, targetY: 0, currentX: 0, currentY: 0, active: false };
    let rotation = 0;
    let rafId = 0;
    let intersecting = false;
    let lastTimestamp: number | null = null;

    let perfSamples = 0;
    let perfTotalMs = 0;

    // Never drawn until it's actually been on screen at least once — a
    // canvas no one has scrolled to yet shouldn't cost any main-thread
    // time during initial page load.
    let everVisible = false;

    function resizeCanvas() {
      if (!frame || !canvas) return;
      const rect = frame.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(cssWidth * dpr));
      canvas.height = Math.max(1, Math.round(cssHeight * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Only redraw here if nothing else will (an active rAF loop picks
      // up the new size on its own next frame).
      if (everVisible && (staticMode || !rafId)) {
        draw(0, pointer.active);
      }
    }

    function draw(t: number, pointerActive: boolean) {
      if (!ctx || cssWidth <= 0 || cssHeight <= 0) return;
      const start = performance.now();

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      const centerX = cssWidth / 2;
      const centerY = cssHeight / 2;
      const canvasRadius = Math.min(cssWidth, cssHeight) * SPHERE_RADIUS_RATIO;

      let frontCount = 0;
      let backCount = 0;
      const frontIdx: number[] = [];
      const backIdx: number[] = [];

      for (let i = 0; i < POINT_COUNT; i++) {
        const point = POINTS[i]!;
        const r = displace(point, t);
        const projected = project(point, r, rotation, TILT);
        const px = centerX + projected.x * canvasRadius;
        const py = centerY + projected.y * canvasRadius;
        const limb = limbFactor(projected.z, r);
        const front = projected.z >= 0;

        let size: number;
        let alpha: number;
        if (front) {
          size = lerp(1.5, 3.5, limb);
          alpha = lerp(0.2, 0.9, limb);
        } else {
          size = lerp(1, 2, limb);
          alpha = lerp(0.1, 0.4, limb);
        }

        let tint = 0;
        if (pointerActive) {
          const push = pushFromPointer(
            px,
            py,
            pointer.currentX,
            pointer.currentY,
            POINTER_INFLUENCE_PX,
            POINTER_MAX_PUSH_PX,
          );
          if (push.dx !== 0 || push.dy !== 0) {
            buffers.px[i] = px + push.dx;
            buffers.py[i] = py + push.dy;
            tint = clamp(
              Math.sqrt(push.dx * push.dx + push.dy * push.dy) / POINTER_MAX_PUSH_PX,
              0,
              1,
            );
          } else {
            buffers.px[i] = px;
            buffers.py[i] = py;
          }
        } else {
          buffers.px[i] = px;
          buffers.py[i] = py;
        }

        buffers.size[i] = size;
        buffers.alpha[i] = tint > 0 ? Math.max(alpha, lerp(alpha, 0.9, tint)) : alpha;
        buffers.tint[i] = tint;
        buffers.isFront[i] = front ? 1 : 0;

        if (front) {
          frontIdx[frontCount++] = i;
        } else {
          backIdx[backCount++] = i;
        }
      }

      // Back-facing first, then front-facing, so the sphere reads correctly.
      drawPass(backIdx, backCount, colors.back, colors.accent);
      drawPass(frontIdx, frontCount, colors.dot, colors.accent);

      if (!staticMode && perfSamples < PERF_SAMPLE_FRAMES) {
        perfTotalMs += performance.now() - start;
        perfSamples++;
        if (perfSamples === PERF_SAMPLE_FRAMES) {
          console.info(
            `[DotOrb] avg draw time over ${PERF_SAMPLE_FRAMES} frames: ${(perfTotalMs / PERF_SAMPLE_FRAMES).toFixed(3)}ms`,
          );
        }
      }
    }

    function drawPass(idx: number[], count: number, base: RGB, accent: RGB) {
      for (let k = 0; k < count; k++) {
        const i = idx[k]!;
        const tint = buffers.tint[i]!;
        const [r, g, b] = tint > 0 ? mixRgb(base, accent, tint) : base;
        const size = buffers.size[i]!;
        const alpha = buffers.alpha[i]!;
        ctx!.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${alpha.toFixed(3)})`;
        ctx!.fillRect(buffers.px[i]! - size / 2, buffers.py[i]! - size / 2, size, size);
      }
    }

    function startLoop() {
      if (rafId || staticMode) return;
      lastTimestamp = null;
      rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function updateActive() {
      if (staticMode) return;
      if (intersecting && !document.hidden) startLoop();
      else stopLoop();
    }

    let elapsed = 0;
    function tick(now: number) {
      if (lastTimestamp === null) lastTimestamp = now;
      const delta = now - lastTimestamp;
      lastTimestamp = now;
      elapsed += delta;

      rotation = (elapsed / ROTATION_PERIOD_MS) * Math.PI * 2;
      pointer.currentX = lerp(pointer.currentX, pointer.targetX, POINTER_LERP_FACTOR);
      pointer.currentY = lerp(pointer.currentY, pointer.targetY, POINTER_LERP_FACTOR);

      draw(elapsed / 1000, pointer.active);
      rafId = requestAnimationFrame(tick);
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.targetX = event.clientX - rect.left;
      pointer.targetY = event.clientY - rect.top;
      pointer.active = true;
    }

    function handlePointerLeave() {
      pointer.active = false;
    }

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    resizeObserver.observe(frame);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? false;
        if (intersecting && !everVisible) {
          everVisible = true;
          if (staticMode) draw(0, false);
        }
        updateActive();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(frame);

    function handleVisibilityChange() {
      updateActive();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const themeObserver = new MutationObserver(() => {
      colors = readColors(frame!);
      if (staticMode && everVisible) draw(0, false);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (!staticMode) {
      frame.addEventListener('pointermove', handlePointerMove, { passive: true });
      frame.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    }

    // Size the canvas now (cheap), but drawing waits for the
    // IntersectionObserver's first callback — see `everVisible` above.
    resizeCanvas();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      frame.removeEventListener('pointermove', handlePointerMove);
      frame.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div ref={frameRef} className="about-orb-frame">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
