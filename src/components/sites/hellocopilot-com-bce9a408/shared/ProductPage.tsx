import type { CSSProperties } from "react";
import { AboutPopup } from "./AboutPopup";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { ProductHero } from "./ProductHero";
import { ProductInfo } from "./ProductInfo";
import { ProductScene } from "./ProductScene";
import { BG_GRADIENT, productByKey, type ProductKey } from "./site-data";

/** Shared template for /take-off, /touch-down and /high-point (identical source markup, per-product data). */
export function ProductPage({ productKey }: { productKey: ProductKey }) {
  const product = productByKey(productKey);
  const vars = {
    "--clip-border-color": product.vars.clipBorder,
    "--bg-gradient": BG_GRADIENT,
    "--color-next-page": product.vars.colorNextPage,
    "--color-2": product.vars.color2,
  } as CSSProperties;

  return (
    <main className="main" id="main" data-namespace={productKey} style={vars}>
      <AboutPopup />
      <Header variant="product" />
      <ProductScene product={product} />
      <ProductHero product={product} />
      <section className="h-screen" />
      <ProductInfo product={product} />
      <section className="h-screen" />
      <section className="vh-50" />
      <BottomNav active={productKey} />
    </main>
  );
}
