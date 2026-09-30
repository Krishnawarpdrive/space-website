import type { CSSProperties } from "react";

import type { Product } from "./site-data";

const TITLE_STYLE = {
  fontSize: "12vw",
  color: "var(--clip-border-color)",
} as CSSProperties;

/**
 * Product page hero: THC / weight row, giant Rustea title and the floating
 * product pack centred over it. Motion is driven entirely by SiteShell via
 * `data-enter` / `data-leave` / `data-parallax` / `data-scrub` attributes.
 */
export function ProductHero({ product }: { product: Product }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <section className="relative z-2">
        <div data-scrub="300">
          <div className="relative">
            <div className="mx-auto flex items-start justify-between pb-2 min-[992px]:px-12">
              <div className="fs-5 overflow-hidden font-bold">
                <span className="inline-block" data-enter="reveal-bottom" data-leave="reveal-bottom">
                  {product.thc}
                </span>
              </div>
              <div className="fs-5 overflow-hidden font-bold">
                <span className="inline-block" data-enter="reveal-bottom" data-leave="reveal-bottom">
                  {product.weight}
                </span>
              </div>
            </div>
            <div
              className="display-2 uppercase"
              data-enter="scale-opacity"
              data-leave="scale-opacity"
              style={TITLE_STYLE}
            >
              {product.name}
            </div>
            {/* Source: inset 0, but top (-20% / -290px <992) and left (20px <992) come from .box-secondary */}
            <div className="box-secondary pointer-events-none absolute right-0 bottom-0 mx-auto flex items-center justify-center px-2 min-[992px]:left-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.productImage}
                alt={`${product.name} pack`}
                data-enter="scale-rotate"
                data-leave="blur"
                data-parallax="1"
                data-scrub="-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
