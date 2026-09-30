"use client";

import { ScrambleText, scrambleOnHover } from "./ScrambleText";
import { PRODUCTS, type ProductKey } from "./site-data";
import { TransitionLink } from "./TransitionLink";

const hover = scrambleOnHover({ beep: true });

/** Product-page bottom nav: clipped frame + scroll progress fill + product links. */
export function BottomNav({ active }: { active: ProductKey }) {
  return (
    <div className="nav-holder">
      <div className="clipped-shape">
        <span>
          <i className="scrollerIndicator" />
          <em />
        </span>
      </div>
      <div className="absolute inset-0 flex items-center px-2">
        <ul className="nav m-0 flex w-full list-none items-center justify-around p-0">
          {PRODUCTS.map((p) => (
            <li key={p.key}>
              <TransitionLink
                href={p.href}
                leaveClass={p.leaveClass}
                cue={p.cue}
                className={`${p.navClass}${p.key === active ? " active" : ""}`}
                aria-current={p.key === active ? "page" : undefined}
                data-hover-scramble=""
                onMouseEnter={hover}
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
  );
}
