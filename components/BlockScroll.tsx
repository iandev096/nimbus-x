"use client";

import { useEffect, useLayoutEffect } from "react";

type BlockScrollProps = {
  block: boolean;
};

// Use useLayoutEffect to prevent a flash of scrolling before locking
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function BlockScroll({ block }: BlockScrollProps) {
  useIsomorphicLayoutEffect(() => {
    if (!block) return;

    // 1. Save original values to restore later
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // 2. Lock the scroll
    // We apply to BOTH html and body for maximum browser compatibility
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // 3. The Magic: Reserve the scrollbar space
    // 'stable' keeps the space even when overflow is hidden
    // 'both-edges' (optional) helps if you have symmetrical layouts
    document.body.style.scrollbarGutter = "stable";

    return () => {
      // 4. Cleanup
      document.documentElement.style.overflow = "";
      document.body.style.overflow = originalOverflow;
      document.body.style.scrollbarGutter = "";
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [block]);

  return null;
}
