/* eslint-disable @next/next/no-img-element -- layered art must keep the source's absolute img stacking */
import { Fragment, type CSSProperties } from "react";
import type { Layer, Product } from "./site-data";
import { productByKey } from "./site-data";
import { LeaveSkies, SkyLayers } from "./SkyLayers";

const scrubValue = (scrub: NonNullable<Layer["scrub"]>) =>
  [scrub.y ?? 0, scrub.x ?? 0, scrub.rotate ?? 0, scrub.zoom ?? 1].join(",");

/**
 * Fixed product-page backdrop: leave skies, page sky + dark overlay, floating art and
 * the scroll-revealed tagline. Static markup only; SiteShell wires scrubs, parallax and
 * enter/leave transitions from the data attributes.
 */
export function ProductScene({ product }: { product: Product }) {
  const words = product.tagline.split(/\s+/).filter(Boolean);

  return (
    <div className="fixed inset-0">
      <LeaveSkies
        skies={[
          { key: "takeoff", sky: productByKey("takeoff").sky, alwaysVisible: true },
          { key: "touchdown", sky: productByKey("touchdown").sky },
          { key: "highpoint", sky: productByKey("highpoint").sky },
        ]}
      />

      <section
        className="absolute inset-0 flex h-screen items-center justify-end overflow-hidden py-0"
        data-leave="mask"
      >
        <div className="absolute inset-0">
          <SkyLayers sky={product.sky} parallax />
          <div className={product.darkClass} data-enter="opacity" data-leave="opacity" />
        </div>
      </section>

      <div className="absolute inset-0 z-1 flex h-screen flex-col items-center" data-leave="opacity">
        <picture
          className="ratio"
          data-scrub-1=""
          style={{ "--bs-aspect-ratio": "174%" } as CSSProperties}
        >
          <div className={`absolute inset-0 flex h-screen flex-col items-center ${product.artGroupClass}`}>
            {product.art.map((layer, i) => (
              <img
                key={`${layer.src}-${i}`}
                src={layer.src}
                alt=""
                className={`h-auto object-contain ${layer.className ?? ""}`.trim()}
                data-scrub={layer.scrub ? scrubValue(layer.scrub) : undefined}
                data-enter={layer.enterOpacity ? "opacity" : undefined}
              />
            ))}
          </div>
          <div className="flex h-screen flex-col items-center justify-center" style={{ zIndex: -1 }}>
            <h2
              className="mx-auto max-w-[16ch] pt-12 text-center uppercase split-words"
              data-scrub-text=""
            >
              {words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                  <span className="single-word inline-block">
                    <span className="single-word-inner inline-block">{word}</span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </Fragment>
              ))}
            </h2>
          </div>
        </picture>
      </div>

      <div className="fixed-top-blur_component" />
    </div>
  );
}
