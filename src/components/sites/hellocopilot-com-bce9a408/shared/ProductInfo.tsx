import type { Product } from "./site-data";

/**
 * Product page info block: description box (left) + specification box (right).
 * Static markup; the runtime drives `data-scrub` per box and `data-leave` on the section.
 * Source uses Bootstrap `d-lg-flex` (992px), hence `min-[992px]:` rather than `lg:`.
 */
export function ProductInfo({ product }: { product: Product }) {
  return (
    <section className="relative z-2 min-h-screen select-text" data-leave="opacity">
      <div className="container justify-between min-[992px]:flex min-[992px]:items-end">
        <div className="fookin-a-box relative" data-scrub="0">
          <div className="heading-clip-border" />
          <h1 className="h5 heading-clip absolute z-1 w-full py-4 text-end">
            <span>{product.name}</span>
          </h1>
          <div className="clip-shape-border" />
          <div className="clip-shape p-12">
            <div className="my-2 pt-12 opacity-75">
              <p>{product.copy[0]}</p>
              <p>{product.copy[1]}</p>
            </div>
          </div>
        </div>
        <div className="fookin-a-box relative" data-scrub="100">
          <h2 className="h5 heading-clip-mirrored absolute z-1 w-full p-4 font-medium uppercase leading-[1.25]">
            <span>Specification</span>
          </h2>
          <div className="clip-shape-border-mirrored" />
          <div className="clip-shape-mirrored p-12">
            <div className="my-2 pt-12 opacity-75">
              <ul>
                {product.spec.map((s) => (
                  <li key={s.label}>
                    <div>
                      <span>{s.label}</span>
                    </div>
                    {s.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
