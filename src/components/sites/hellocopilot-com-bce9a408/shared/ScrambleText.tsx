"use client";

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import type { MouseEvent } from "react";
import { playBeep } from "./sound";

gsap.registerPlugin(ScrambleTextPlugin);

const CHARS = "XYZXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Renders text as word/char spans, matching SplitText's `single-word` / `single-char` output. */
export function ScrambleText({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="single-word inline-block">
          {[...word].map((ch, ci) => (
            <span key={ci} className="single-char inline-block" data-original-char={ch}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

/** Source `[data-hover-scramble]` + optional `[data-sound-beep]` mouseenter handler. */
export function scrambleOnHover(opts: { beep?: boolean } = {}) {
  return (event: MouseEvent<HTMLElement>) => {
    if (opts.beep) playBeep();
    event.currentTarget.querySelectorAll<HTMLElement>(".single-char").forEach((el, index) => {
      const original = el.dataset.originalChar ?? el.textContent ?? "";
      gsap
        .timeline()
        .to(
          el,
          {
            duration: 0.2,
            scrambleText: { text: original, speed: 0, chars: CHARS, tweenLength: false, revealDelay: 0.1 },
            opacity: 0.1,
            onComplete: () => void gsap.to(el, { opacity: 1, filter: "blur(0px)", duration: 0.2 }),
          },
          0.02 * index,
        );
    });
  };
}
