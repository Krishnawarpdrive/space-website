"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { LogoIcon } from "./icons";
import { PRELOAD_IMAGES, asset } from "./site-data";

// Loader backdrop per entry page, as on source.
const LOADER_GRADIENT: Record<string, string> = {
  "": "gradient-home",
  "/products": "gradient-takeoff",
  "/take-off": "gradient-takeoff",
  "/touch-down": "gradient-touchdown",
  "/high-point": "gradient-hightpoint",
};

/** Countdown text: 10 seconds scaled by load percent, formatted `SS:MS` (source `updateCounterDisplay`). */
function formatCounter(percent: number) {
  const remaining = Math.max(10 - percent / 10, 0);
  const seconds = Math.floor(remaining);
  const hundredths = Math.floor((remaining % 1) * 100);
  return `${String(seconds).padStart(2, "0")}:${String(hundredths).padStart(2, "0")}`;
}

function preload(onProgress: (percent: number) => void) {
  let done = 0;
  const total = PRELOAD_IMAGES.length;
  return Promise.all(
    PRELOAD_IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => {
            done += 1;
            onProgress(Math.round((done / total) * 100));
            resolve();
          };
          img.src = src;
        }),
    ),
  );
}

export function Loader({ pathname, onDone }: { pathname: string; onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [counter, setCounter] = useState(formatCounter(0));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.body.classList.add("loader-init");
    const state = { value: 0 };
    const timers: number[] = [];
    let target = 0;

    const counterTween = () =>
      gsap.to(state, {
        value: target,
        duration: 3,
        onUpdate: () => {
          setCounter(formatCounter(state.value));
          document.body.style.setProperty("--loader-counter", String(100 - state.value));
        },
      });

    const startCounter = window.setTimeout(counterTween, 500);
    timers.push(startCounter);

    void preload((percent) => {
      target = percent;
    }).then(() => {
      counterTween();
      timers.push(
        window.setTimeout(() => document.body.classList.add("loader-klaar"), 4000),
        window.setTimeout(() => {
          gsap.fromTo(
            root.querySelector("[data-mask-logo]"),
            { maskPosition: "0px" },
            { maskPosition: "1800px", duration: 4, ease: "power1.inOut" },
          );
        }, 3500),
        window.setTimeout(() => {
          document.body.classList.add("website-loaded", "assets-loaded");
          const tl = gsap.timeline({ onComplete: onDone });
          tl.to(root.querySelectorAll(".loader-opacity"), { opacity: 0, duration: 2, ease: "power4.out" }, 0.3);
          tl.to(root.querySelector(".counter"), { duration: 0.4, scale: 3, filter: "blur(20px)", ease: "expo.in" }, 0);
        }, 6000),
      );
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [onDone]);

  const isSplash = pathname === "/";
  const gradient = LOADER_GRADIENT[pathname.replace(/\/$/, "")] ?? "gradient-home";

  return (
    <div ref={rootRef} className="loading-screen text-white" data-lenis-prevent="">
      <div className={`loader gradient ${gradient} loader-opacity`} />
      {isSplash && (
        <div className="loader-opacity absolute inset-[-20px_-60px_-40px_-60px] flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("img/home-page/webp/home-cloud-3.png.webp")} alt="" className="img-bg object-cover" data-parallax="0.3" />
        </div>
      )}
      <div />
      <div className="relative w-full text-center">
        <div className="relative w-full text-center">
          <div className="counter-outer loader-opacity-in">
            <div className="counter">
              {[...counter].map((ch, i) => (
                <span key={i}>{ch}</span>
              ))}
            </div>
          </div>
          <div mask-logo="" data-mask-logo="">
            <LogoIcon />
          </div>
        </div>
      </div>
      <div className="relative w-full text-center">
        <div className="bar">
          <span />
        </div>
      </div>
    </div>
  );
}
