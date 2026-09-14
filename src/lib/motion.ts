import { useEffect, useState } from "react";

/**
 * Shared Motion Tokens & Foundation for Lumen Desktop
 * Ensures strict 60/120 FPS frame budget via GPU compositor (transform & opacity only)
 */

export const EASING = {
  // Magnetic snap to 0° angle and screen edges
  easeSnap: "cubic-bezier(0.2, 0, 0, 1)",
  // Pip bouncing, ball bounce physics
  easeBounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  // Smooth spatial gliding, modal slide-in, note dragging
  easeGlide: "cubic-bezier(0.16, 1, 0.3, 1)",
  // Mechanical ratchet clicks for rotary barrel-wheels
  easeMechanical: "cubic-bezier(0.2, 0.8, 0.2, 1)",
} as const;

export type EasingToken = keyof typeof EASING;

export const DURATION_MS = {
  instant: 80,
  fast: 150,
  base: 220,
  slow: 400,
} as const;

export type DurationToken = keyof typeof DURATION_MS;

export const DURATION_CSS = {
  instant: `${DURATION_MS.instant}ms`,
  fast: `${DURATION_MS.fast}ms`,
  base: `${DURATION_MS.base}ms`,
  slow: `${DURATION_MS.slow}ms`,
} as const;

/**
 * Generates a unified, high-performance GPU transform string.
 * Consolidates translate3d, rotate, and scale into a single composited layer.
 */
export function springTransform(
  x: number,
  y: number,
  rotation = 0,
  scale = 1,
): string {
  const roundedX = Math.round(x * 10) / 10;
  const roundedY = Math.round(y * 10) / 10;
  const roundedRot = Math.round(rotation * 10) / 10;
  const roundedScale = Math.round(scale * 1000) / 1000;

  let str = `translate3d(${roundedX}px, ${roundedY}px, 0)`;
  if (roundedRot !== 0) {
    str += ` rotate(${roundedRot}deg)`;
  }
  if (roundedScale !== 1) {
    str += ` scale(${roundedScale})`;
  }
  return str;
}

/**
 * Creates standard CSS transition string with safe easing and duration tokens
 */
export function motionTransition(
  properties: string | string[],
  duration: DurationToken = "base",
  easing: EasingToken = "easeGlide",
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const dur = DURATION_CSS[duration];
  const ease = EASING[easing];
  return props.map((p) => `${p} ${dur} ${ease}`).join(", ");
}

/**
 * Hook to respect OS prefers-reduced-motion setting.
 * When enabled, apps should reduce physics/bounces and replace with simple opacity fades.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older Chromium / Electron environments
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return reduced;
}
