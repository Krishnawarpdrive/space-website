/* eslint-disable @next/next/no-img-element -- layered art must keep the source's absolute img stacking */
import type { Sky } from "./site-data";

/**
 * Gradient + layered cloud stack (source `.gradient-*` + `.clouds-holder-*`).
 * `parallax` enables `[data-parallax]` mouse depth on each layer that defines one.
 */
export function SkyLayers({ sky, parallax = false }: { sky: Sky; parallax?: boolean }) {
  return (
    <>
      <div className={`absolute inset-0 ${sky.gradientClass}`} />
      <div className={sky.holderClass}>
        <div className={`absolute ${sky.insetClass}`}>
          {sky.layers.map((layer, i) => (
            <img
              key={`${layer.src}-${i}`}
              src={layer.src}
              alt=""
              className={`img-bg object-cover${layer.rotate180 ? " rotate-180" : ""}`}
              data-parallax={parallax && layer.depth ? String(layer.depth) : undefined}
            />
          ))}
        </div>
      </div>
    </>
  );
}

/** The three hidden `.leave-bg` skies revealed by `main.leave-to-*` during a transition. */
export function LeaveSkies({
  skies,
}: {
  skies: { key: "takeoff" | "touchdown" | "highpoint"; sky: Sky; alwaysVisible?: boolean }[];
}) {
  return (
    <>
      {skies.map(({ key, sky, alwaysVisible }) => (
        <section
          key={key}
          className={`leave-bg bg-${key}${alwaysVisible ? " next-page-sroll-bg" : ""} absolute inset-0 h-screen items-center justify-end overflow-hidden py-0`}
        >
          <SkyLayers sky={sky} />
        </section>
      ))}
    </>
  );
}
