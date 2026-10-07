"use client";

import { useCallback, type PointerEvent } from "react";

/**
 * Pointer handlers that expose the cursor to CSS as custom properties on the element:
 *   --sx/--sy  cursor position in px  (spotlight)
 *   --rx/--ry  tilt amount in degrees (tilt, only when `tilt` is set)
 *   --gx/--gy  cursor position in %   (glare)
 * No React state, so nothing re-renders while the pointer moves.
 */
export function usePointerVars<T extends HTMLElement>({ tilt = false, max = 9 }: { tilt?: boolean; max?: number } = {}) {
  const onPointerMove = useCallback(
    (e: PointerEvent<T>) => {
      if (e.pointerType === "touch") return;
      const el = e.currentTarget;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--sx", `${e.clientX - r.left}px`);
      el.style.setProperty("--sy", `${e.clientY - r.top}px`);
      if (tilt) {
        el.style.setProperty("--rx", ((px - 0.5) * 2 * max).toFixed(2));
        el.style.setProperty("--ry", ((py - 0.5) * 2 * max).toFixed(2));
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      }
    },
    [tilt, max]
  );

  const onPointerLeave = useCallback((e: PointerEvent<T>) => {
    if (!tilt) return;
    e.currentTarget.style.setProperty("--rx", "0");
    e.currentTarget.style.setProperty("--ry", "0");
  }, [tilt]);

  return { onPointerMove, onPointerLeave };
}
