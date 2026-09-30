"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent, TouchEvent } from "react";
import { ScrambleText, scrambleOnHover } from "../shared/ScrambleText";
import { PRODUCTS } from "../shared/site-data";
import { playBeep } from "../shared/sound";
import { TransitionLink } from "../shared/TransitionLink";
import { ProductBoxes } from "./ProductBoxes";
import { SliderBackdrop } from "./SliderBackdrop";

type Direction = "next" | "prev";

interface SliderState {
  selected: number;
  removed: number | null;
  direction: Direction;
  rotate: number;
}

const COUNT = PRODUCTS.length;
const SETTLE_MS = 600;
const HOVER_DEBOUNCE_MS = 100;
const WHEEL_THROTTLE_MS = 800;
const WHEEL_MIN_DELTA = 10;
const SWIPE_MIN_DISTANCE = 50;
const INITIAL_STATE: SliderState = { selected: 0, removed: null, direction: "next", rotate: 0 };

/** Source products nav has no beep on hover. */
const hover = scrambleOnHover();

/** True once the SiteShell has started a page-leave transition. */
const isLeaving = () => document.getElementById("main")?.classList.contains("pageTransitionLeave") ?? false;

/**
 * Products-page slider wrapper: owns slide state and all inputs (nav hover/tap, wheel,
 * swipe, pointer drag) and feeds the pure backdrop + product boxes.
 */
export function ProductsSlider() {
  const [state, setState] = useState<SliderState>(INITIAL_STATE);
  const { selected, removed, direction, rotate } = state;

  // Latest state for window listeners and handlers, updated synchronously in `select`.
  const stateRef = useRef<SliderState>(INITIAL_STATE);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);
  const pointerStartX = useRef<number | null>(null);

  const select = useCallback((index: number) => {
    const current = stateRef.current;
    if (index === current.selected) return;
    const dir: Direction = index === (current.selected + 1) % COUNT ? "next" : "prev";
    const nextState: SliderState = {
      selected: index,
      removed: current.selected,
      direction: dir,
      rotate: current.rotate + (dir === "next" ? -20 : 20),
    };
    stateRef.current = nextState;
    setState(nextState);
    playBeep();

    if (settleTimer.current) clearTimeout(settleTimer.current);
    settleTimer.current = setTimeout(() => {
      stateRef.current = { ...stateRef.current, removed: null };
      setState((s) => ({ ...s, removed: null }));
    }, SETTLE_MS);
  }, []);

  const next = useCallback(() => select((stateRef.current.selected + 1) % COUNT), [select]);
  const prev = useCallback(() => select((stateRef.current.selected + COUNT - 1) % COUNT), [select]);

  const debouncedSelect = (index: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      if (!isLeaving()) select(index);
    }, HOVER_DEBOUNCE_MS);
  };

  // Indicator follows the selected nav item (DOM write only; no state).
  useEffect(() => {
    const place = () => {
      const indicator = indicatorRef.current;
      const item = itemRefs.current[stateRef.current.selected];
      if (!indicator || !item) return;
      indicator.style.left = `${item.offsetLeft}px`;
      indicator.style.width = `${item.offsetWidth}px`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [selected]);

  // Throttled wheel navigation.
  useEffect(() => {
    let last = 0;
    const onWheel = (event: WheelEvent) => {
      if (isLeaving() || Math.abs(event.deltaY) <= WHEEL_MIN_DELTA) return;
      const now = Date.now();
      if (now - last < WHEEL_THROTTLE_MS) return;
      last = now;
      if (event.deltaY < 0) prev();
      else next();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  // Clear pending timers on unmount.
  useEffect(
    () => () => {
      if (settleTimer.current) clearTimeout(settleTimer.current);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    [],
  );

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || isLeaving()) return;
    const distance = end - start;
    if (distance > SWIPE_MIN_DISTANCE) prev();
    else if (distance < -SWIPE_MIN_DISTANCE) next();
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartX.current;
    pointerStartX.current = null;
    if (start === null || isLeaving()) return;
    const dx = event.clientX - start;
    if (Math.abs(dx) > SWIPE_MIN_DISTANCE) {
      if (dx < 0) next();
      else prev();
    }
  };

  const onNavClick = (index: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    // Touch: a tap selects the slide instead of navigating.
    if (window.matchMedia("(pointer: coarse)").matches) {
      event.preventDefault();
      if (!isLeaving()) select(index);
    }
  };

  const liClass = (i: number) =>
    [i === selected && "is-selected", i === removed && "is-removed is-last"].filter(Boolean).join(" ");

  return (
    <div
      className="fixed inset-0 z-1 flex h-screen items-center justify-end overflow-hidden py-0"
      data-slider=""
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="sliderMain d-none-on-touch relative z-3 h-screen w-full cursor-grab active:cursor-grabbing pointer-coarse:hidden"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <SliderBackdrop selected={selected} removed={removed} direction={direction} rotate={rotate} />
      <ProductBoxes selected={selected} removed={removed} direction={direction} />
      <div className="nav-holder">
        <div className="clipped-shape">
          <span>
            <em />
          </span>
        </div>
        <div className="absolute inset-0 flex items-center px-2">
          <div className="indicator" ref={indicatorRef} />
          <ul
            className={`sliderNav sliderNavMain nav m-0 flex w-full list-none items-center justify-around p-0 ${
              direction === "next" ? "slide-to-next" : "slide-to-prev"
            }`}
            data-active-slide={selected + 1}
          >
            {PRODUCTS.map((p, i) => (
              <li
                key={p.key}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={liClass(i)}
                onMouseEnter={() => {
                  if (!isLeaving()) debouncedSelect(i);
                }}
              >
                <TransitionLink
                  href={p.href}
                  leaveClass={p.leaveClass}
                  cue={p.cue}
                  className={p.navClass}
                  data-hover-scramble=""
                  onMouseEnter={hover}
                  onClick={onNavClick(i)}
                >
                  <span>
                    <ScrambleText text={p.navLabel} />
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
