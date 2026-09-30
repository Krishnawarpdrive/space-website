import type { Metadata } from "next";
import { ProductPage } from "@/components/sites/hellocopilot-com-bce9a408/shared/ProductPage";

export const metadata: Metadata = { title: "Copilot • Touch Down" };

// Clone of https://hellocopilot.com/touch-down/
export default function TouchDownPage() {
  return <ProductPage productKey="touchdown" />;
}
