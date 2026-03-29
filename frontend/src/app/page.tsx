import dynamic from "next/dynamic";

const DashboardClient = dynamic(
  () => import("@/components/DashboardClient").then((mod) => mod.DashboardClient),
  {
    ssr: false,
    loading: () => (
      <main className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
        Loading dashboard...
      </main>
    ),
  }
);

export default function HomePage() {
  return <DashboardClient />;
}
