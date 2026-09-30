"use client";

import { ScrambleText, scrambleOnHover } from "../shared/ScrambleText";
import { LINKS } from "../shared/site-data";
import { TransitionLink } from "../shared/TransitionLink";

const hover = scrambleOnHover();

/** Splash-page age gate: heading plus "HELL YEAH!" (to /products/) and "NO, I WISH" (external). */
export function AgeGate() {
  return (
    <div className="absolute flex h-screen flex-col items-center justify-between">
      <div />
      <div />
      <div />
      <div>
        <div className="overflow-hidden" data-enter="opacity:2">
          <h3 className="mb-6 text-center uppercase" data-leave="translate-y">
            Are you over 21 years old?
          </h3>
        </div>
        <div className="flex justify-center" data-leave="opacity">
          <div className="flex gap-4 overflow-hidden">
            <div className="btn-holder bottom" data-enter="btn:2">
              <TransitionLink
                href="/products/"
                leaveClass="leave-to-takeoff"
                cue="splash-intro"
                offset={3000}
                className="btn bottom"
                data-hover-scramble=""
                onMouseEnter={hover}
              >
                <span>
                  <ScrambleText text="HELL YEAH!" />
                </span>
              </TransitionLink>
            </div>
            <div className="btn-holder top" data-enter="btn-2:2">
              <a href={LINKS.underAge} className="btn top" data-hover-scramble="" onMouseEnter={hover}>
                <span>
                  <ScrambleText text="NO, I WISH" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div />
    </div>
  );
}
