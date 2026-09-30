"use client";

/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";
import { ScrambleText, scrambleOnHover } from "../shared/ScrambleText";
import { PRODUCTS, type Product } from "../shared/site-data";
import { TransitionLink } from "../shared/TransitionLink";

export interface ProductBoxesProps {
  selected: number;
  removed: number | null;
  direction: "next" | "prev";
}

const COLOR: Record<Product["textColorClass"], string> = {
  "text-orange": "text-copilot-orange",
  "text-blue": "text-copilot-blue",
  "text-green": "text-copilot-green",
};

const hover = scrambleOnHover({ beep: true });

/** Products-page slider: the floating product pack flanked by "Scroll" / "Explore". */
export function ProductBoxes({ selected, removed, direction }: ProductBoxesProps) {
  const liClass = (i: number) =>
    [i === selected && "is-selected", i === removed && "is-removed is-last"].filter(Boolean).join(" ");

  return (
    <ul
      className={
        "sliderNav pointer-events-none absolute z-4 mb-0 h-full w-full list-none p-0 " +
        (direction === "next" ? "slide-to-next" : "slide-to-prev")
      }
    >
      {PRODUCTS.map((p, i) => (
        <li key={p.key} className={"isolate absolute inset-0 h-full w-full " + liClass(i)}>
          <div
            className={
              "gap-box absolute inset-0 flex h-full w-full items-center justify-center " + COLOR[p.textColorClass]
            }
          >
            <div className="text-inst" tx-anim="">
              <span className="inline-block" data-leave="reveal-bottom" data-enter="reveal-bottom">
                Scroll
              </span>
            </div>
            <TransitionLink
              href={p.href}
              leaveClass={p.leaveClass}
              cue={p.cue}
              className="box"
              aria-label={`Explore ${p.name}`}
            >
              <picture
                className="ratio"
                style={{ "--bs-aspect-ratio": "174%" } as CSSProperties}
                data-enter="scale-rotate-bounce"
              >
                <div className="box-inner" data-leave="blur">
                  <img src={p.productImage} alt="" slider-box="" />
                </div>
              </picture>
            </TransitionLink>
            <div tx-anim="" className="overflow-hidden">
              <TransitionLink
                href={p.href}
                leaveClass={p.leaveClass}
                cue={p.cue}
                className="text-inst"
                data-leave="reveal-bottom"
                data-enter="reveal-bottom"
                data-hover-scramble=""
                onMouseEnter={hover}
              >
                <ScrambleText text="Explore" />
              </TransitionLink>
            </div>
            {/* Decorative transitioner art: pointer-events-none so this full-screen layer never blocks the box link. */}
            <div className="pointer-events-none absolute inset-0 flex h-screen flex-col items-center" data-leave="from-box">
              <div
                className={"absolute inset-0 flex h-screen flex-col items-center " + p.artGroupClass}
                slider-box=""
                data-leave="from-box"
              >
                {p.transitionerArt.map((l) => (
                  <img key={l.src} src={l.src} alt="" className={"h-auto object-contain " + (l.className ?? "")} />
                ))}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
