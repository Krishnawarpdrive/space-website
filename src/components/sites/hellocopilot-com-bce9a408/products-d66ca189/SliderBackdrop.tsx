/* eslint-disable @next/next/no-img-element -- layered slider art must keep the source's absolute img stacking */
import type { CSSProperties } from "react";
import { Marquee } from "../shared/Marquee";
import { PRODUCTS } from "../shared/site-data";

export interface SliderBackdropProps {
  /** Index of the active slide. */
  selected: number;
  /** Index of the slide that is leaving (gets `is-removed is-last`), if any. */
  removed: number | null;
  direction: "next" | "prev";
  /** Planet wheel rotation in degrees. */
  rotate: number;
}

const MARQUEE_LABELS = ["Take Off", "Touch down", "High Point"] as const;

/**
 * Products-page slider backdrop: four stacked `.sliderNav` lists (gradients, clouds,
 * outline marquees, planet wheel). Pure — slide state comes from the wrapper.
 */
export function SliderBackdrop({ selected, removed, direction, rotate }: SliderBackdropProps) {
  const liClass = (i: number) =>
    [i === selected && "is-selected", i === removed && "is-removed is-last"].filter(Boolean).join(" ");
  const ulClass = `sliderNav absolute mb-0 h-full w-full list-none p-0 ${
    direction === "next" ? "slide-to-next" : "slide-to-prev"
  }`;

  return (
    <>
      {/* 1. Background gradients */}
      <ul className={ulClass}>
        {PRODUCTS.map((p, i) => (
          <li key={p.key} className={`absolute inset-0 h-full w-full ${liClass(i)}`} slider-fade-sync="">
            <div>
              <div className={`absolute inset-0 ${i === 0 ? "gradient gradient-takeoff" : p.sky.gradientClass}`} />
            </div>
          </li>
        ))}
      </ul>

      {/* 2. Clouds */}
      <ul className={ulClass}>
        {PRODUCTS.map((p, i) => (
          <li key={p.key} className={`absolute inset-0 h-full w-full ${liClass(i)}`}>
            <div className={p.sky.holderClass}>
              <div className={`absolute ${p.sky.insetClass}`} slider-fade-slow="">
                {p.sky.layers.map((layer, j) => (
                  <img
                    key={`${layer.src}-${j}`}
                    src={layer.src}
                    alt=""
                    className={`img-bg object-cover${layer.rotate180 ? " rotate-180" : ""}`}
                    data-parallax={layer.depth !== undefined ? String(layer.depth) : undefined}
                  />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 3. Outline marquees */}
      <ul className={`${ulClass} sliderNavZ`} data-leave="opacity-filter">
        {PRODUCTS.map((p, i) => (
          <li key={p.key} className={liClass(i)}>
            <div className="pointer-events-none absolute inset-0 flex min-h-screen items-center justify-center">
              <div slider-fade-slow="">
                <Marquee className="mix-blend-soft-light" partEnter="opacity">
                  <div className="display-1 uppercase">{MARQUEE_LABELS[i]}&nbsp;</div>
                  <div className="display-1 uppercase">{MARQUEE_LABELS[i]}&nbsp;</div>
                </Marquee>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 4. Planet wheel */}
      <ul
        className={`${ulClass} slider-wheel z-0`}
        data-leave="opacity"
        data-enter="opacity-y"
        style={{ "--rotate-value": `${rotate}deg` } as CSSProperties}
      >
        {PRODUCTS.map((p, i) => (
          <li
            key={p.key}
            className={`t-100p absolute m-auto flex w-full items-end justify-center ${liClass(i)}`}
            planet-fade=""
          >
            <picture className="planet" slider-rotate="">
              <img src={p.planet} className="animation-spin img-bg h-auto object-cover object-top" alt="" />
            </picture>
          </li>
        ))}
      </ul>
    </>
  );
}
