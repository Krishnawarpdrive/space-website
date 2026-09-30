import type { Metadata } from "next";
import { ProductsSlider } from "@/components/sites/hellocopilot-com-bce9a408/products-d66ca189/ProductsSlider";
import { AboutPopup } from "@/components/sites/hellocopilot-com-bce9a408/shared/AboutPopup";
import { Header } from "@/components/sites/hellocopilot-com-bce9a408/shared/Header";
import { BG_GRADIENT } from "@/components/sites/hellocopilot-com-bce9a408/shared/site-data";

export const metadata: Metadata = { title: "Copilot • Products" };

// Clone of https://hellocopilot.com/products/ — the three-slide product carousel.
export default function ProductsPage() {
  return (
    <main
      className="main mainTrigger"
      id="main"
      data-namespace="home"
      style={{ "--clip-border-color": "#fff", "--bg-gradient": BG_GRADIENT } as React.CSSProperties}
    >
      <AboutPopup borderColor="rgba(255,255,255,0.5)" />
      <Header variant="products" />
      <ProductsSlider />
    </main>
  );
}
