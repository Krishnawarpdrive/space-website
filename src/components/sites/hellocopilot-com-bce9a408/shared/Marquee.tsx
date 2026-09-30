"use client";

import { gsap } from "gsap";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Source `marquee()` module: two `.marquee__part` copies tween xPercent 0 → -100
 * over 70s linear, repeat forever, starting at progress 0.5.
 */
export function Marquee({
  children,
  className = "",
  leave,
  partEnter,
}: {
  /** Content of ONE part; it is rendered twice. */
  children: ReactNode;
  className?: string;
  /** `data-leave` tokens for the `.marquee` element (e.g. "blur:0.1"). */
  leave?: string;
  /** `data-enter` tokens for `.marquee__inner`. */
  partEnter?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parts = ref.current?.querySelectorAll(".marquee__part");
    if (!parts?.length) return;
    const tween = gsap.to(parts, { xPercent: -100, repeat: -1, duration: 70, ease: "linear" }).totalProgress(0.5);
    return () => void tween.kill();
  }, []);

  return (
    <div ref={ref} className={`marquee scroller__inner-1 ${className}`} data-direction="left" data-leave={leave}>
      <div className="marquee__inner" data-enter={partEnter}>
        <div className="marquee__part">{children}</div>
        <div className="marquee__part" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
