import { AgeGate } from "@/components/sites/hellocopilot-com-bce9a408/root-8a5edab2/AgeGate";
import { SplashBackdrop } from "@/components/sites/hellocopilot-com-bce9a408/root-8a5edab2/SplashBackdrop";
import { Header } from "@/components/sites/hellocopilot-com-bce9a408/shared/Header";

// Clone of https://hellocopilot.com/ (age gate / splash). Title comes from the root layout.
export default function Home() {
  return (
    <main className="main" id="main" data-namespace="splash">
      <Header variant="splash" />
      <div className="fixed inset-0 z-1 flex h-screen flex-col items-center overflow-hidden">
        <SplashBackdrop />
        <AgeGate />
      </div>
    </main>
  );
}
