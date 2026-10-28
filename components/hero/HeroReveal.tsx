'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { clamp, lerp, scrollFadeOpacity, targetRadius } from '@/lib/hero';

const TOUCH_SWEEP_MS = 1500;
const LERP_FACTOR = 0.15;

export function HeroReveal() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [photoVisible, setPhotoVisible] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Reduced motion: no pointer/rAF logic at all — the toggle button below
  // drives visibility instead.
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.classList.toggle('is-photo-visible', photoVisible);
  }, [photoVisible]);

  useEffect(() => {
    if (reducedMotion) return;

    const hero = document.getElementById('hero');
    const media = document.getElementById('hero-media');
    if (!hero || !media) return;

    const isTouch = window.matchMedia('(hover: none)').matches;

    const current = { x: 0, y: 0, r: 0 };
    const target = { x: 0, y: 0 };
    let inside = false;
    let intersecting = false;
    let rafId = 0;
    let sweepActive = isTouch;
    let sweepStartTime: number | null = null;

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
      const active = intersecting && !document.hidden;
      if (active) startLoop();
      else stopLoop();
    }

    function tick(now: number) {
      if (sweepActive) {
        if (sweepStartTime === null) sweepStartTime = now;
        const rect = media!.getBoundingClientRect();
        const progress = clamp((now - sweepStartTime) / TOUCH_SWEEP_MS, 0, 1);
        target.x = lerp(rect.width * 0.15, rect.width * 0.85, progress);
        target.y = rect.height * 0.4;
        inside = true;
        if (progress >= 1) sweepActive = false;
      }

      current.x = lerp(current.x, target.x, LERP_FACTOR);
      current.y = lerp(current.y, target.y, LERP_FACTOR);
      current.r = lerp(current.r, targetRadius(inside), LERP_FACTOR);

      media!.style.setProperty('--x', `${current.x}px`);
      media!.style.setProperty('--y', `${current.y}px`);
      media!.style.setProperty('--r', `${current.r}px`);

      hero!.style.opacity = String(scrollFadeOpacity(window.scrollY, hero!.offsetHeight));

      rafId = requestAnimationFrame(tick);
    }

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

    // One passive pointer listener covers desktop hover-follow and touch
    // drag alike: touch only emits pointermove while actively dragging, so
    // "inside" is naturally false until the user drags a finger over it.
    function handlePointerMove(event: PointerEvent) {
      const rect = media!.getBoundingClientRect();
      const withinX = event.clientX >= rect.left && event.clientX <= rect.right;
      const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom;
      inside = withinX && withinY;
      if (inside) {
        target.x = event.clientX - rect.left;
        target.y = event.clientY - rect.top;
      }
      if (!isTouch) {
        hero!.classList.toggle('is-hovering', inside);
      }
    }
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    if (isTouch) {
      // Kick off the sweep immediately rather than waiting on the
      // IntersectionObserver's first (async) callback.
      intersecting = true;
      updateActive();
    }

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      hero.classList.remove('is-hovering');
      hero.style.opacity = '';
      media.style.removeProperty('--x');
      media.style.removeProperty('--y');
      media.style.removeProperty('--r');
    };
  }, [reducedMotion]);

  if (!reducedMotion) return null;

  return (
    <Button
      className="hero-see-photo"
      aria-pressed={photoVisible}
      onClick={() => setPhotoVisible((visible) => !visible)}
    >
      {photoVisible ? 'Hide photo' : 'See photo'}
    </Button>
  );
}
