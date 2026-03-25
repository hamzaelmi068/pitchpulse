import { DashboardMap } from "@/components/map/DashboardMap";
import { Header } from "@/components/header/Header";
import { StatsPanel } from "@/components/stats/StatsPanel";

export default function HomePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-neutral-950">
      <DashboardMap />
      <Header />
      <StatsPanel />
    </main>
  );
}
