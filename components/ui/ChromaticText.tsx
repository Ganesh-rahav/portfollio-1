'use client';

import { useEffect, useRef } from 'react';
import { ACTIVE_OPACITY, LERP_FACTOR, lerp, offsetFromSpeed } from '@/lib/chromatic';

export function ChromaticText({ text }: { text: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const redRef = useRef<HTMLSpanElement>(null);
  const greenRef = useRef<HTMLSpanElement>(null);
  const blueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const red = redRef.current;
    const green = greenRef.current;
    const blue = blueRef.current;
    if (!root || !red || !green || !blue) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (reducedMotion || isCoarsePointer) return;

    const current = { cx: 0, cy: 0, dx: 0, opacity: 0 };
    const target = { cx: 0, cy: 0, dx: 0, opacity: 0 };
    let lastX: number | null = null;
    let intersecting = false;
    let rafId = 0;

    function startLoop() {
      if (rafId) return;
      rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }

    function updateActive() {
      if (intersecting && !document.hidden) startLoop();
      else stopLoop();
    }

    function tick() {
      current.cx = lerp(current.cx, target.cx, LERP_FACTOR);
      current.cy = lerp(current.cy, target.cy, LERP_FACTOR);
      current.dx = lerp(current.dx, target.dx, LERP_FACTOR);
      current.opacity = lerp(current.opacity, target.opacity, LERP_FACTOR);

      root!.style.setProperty('--cx', `${current.cx}px`);
      root!.style.setProperty('--cy', `${current.cy}px`);
      root!.style.setProperty('--chromatic-opacity', String(current.opacity));
      red!.style.setProperty('--ox', `${-current.dx}px`);
      blue!.style.setProperty('--ox', `${current.dx}px`);
      green!.style.setProperty('--oy', `${current.dx * 0.4}px`);

      rafId = requestAnimationFrame(tick);
    }

    function handlePointerMove(event: PointerEvent) {
      const rect = root!.getBoundingClientRect();
      const deltaX = lastX === null ? 0 : event.clientX - lastX;
      lastX = event.clientX;

      target.cx = event.clientX - rect.left;
      target.cy = event.clientY - rect.top;
      target.dx = offsetFromSpeed(deltaX);
      target.opacity = ACTIVE_OPACITY;
    }

    function handlePointerLeave() {
      lastX = null;
      target.dx = 0;
      target.opacity = 0;
    }

    const hero = root.closest('#hero') ?? root;
    const observer = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? false;
        updateActive();
      },
      { threshold: 0 },
    );
    observer.observe(hero);

    function handleVisibilityChange() {
      updateActive();
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    root.addEventListener('pointermove', handlePointerMove, { passive: true });
    root.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      root.removeEventListener('pointermove', handlePointerMove);
      root.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <span ref={rootRef} className="chromatic-text">
      {text}
      <span ref={redRef} aria-hidden="true" className="chromatic-layer chromatic-red">
        {text}
      </span>
      <span ref={greenRef} aria-hidden="true" className="chromatic-layer chromatic-green">
        {text}
      </span>
      <span ref={blueRef} aria-hidden="true" className="chromatic-layer chromatic-blue">
        {text}
      </span>
    </span>
  );
}
