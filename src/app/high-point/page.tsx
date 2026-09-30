import type { Metadata } from "next";
import { ProductPage } from "@/components/sites/hellocopilot-com-bce9a408/shared/ProductPage";

export const metadata: Metadata = { title: "Copilot • High Point" };

// Clone of https://hellocopilot.com/high-point/
export default function HighPointPage() {
  return <ProductPage productKey="highpoint" />;
}
