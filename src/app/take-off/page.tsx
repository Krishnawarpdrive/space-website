import type { Metadata } from "next";
import { ProductPage } from "@/components/sites/hellocopilot-com-bce9a408/shared/ProductPage";

export const metadata: Metadata = { title: "Copilot • Take Off" };

// Clone of https://hellocopilot.com/take-off/
export default function TakeOffPage() {
  return <ProductPage productKey="takeoff" />;
}
