import { Skeleton } from "@/components/ui/skeleton";

export function MapLoadingSkeleton() {
  return (
    <div className="absolute inset-0 z-20 bg-neutral-950 flex flex-col">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/50">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg bg-neutral-800" />
          <Skeleton className="h-5 w-28 bg-neutral-800" />
          <Skeleton className="h-5 w-16 rounded-full bg-neutral-800" />
        </div>
      </div>

      {/* Map area skeleton */}
      <div className="flex-1 relative overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none bg-neutral-900" />

        {/* Simulated continent shapes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="relative w-full max-w-2xl mx-auto px-8">
            <Skeleton className="h-48 w-full rounded-2xl bg-neutral-700" />
          </div>
        </div>

        {/* Shimmer dots simulating markers */}
        <Skeleton className="absolute top-[38%] left-[52%] h-3 w-3 rounded-full bg-blue-500/40" />
        <Skeleton className="absolute top-[42%] left-[48%] h-3 w-3 rounded-full bg-blue-500/40" />
        <Skeleton className="absolute top-[46%] left-[44%] h-3 w-3 rounded-full bg-blue-500/40" />
        <Skeleton className="absolute top-[35%] left-[56%] h-3 w-3 rounded-full bg-red-500/40" />
        <Skeleton className="absolute top-[30%] left-[54%] h-3 w-3 rounded-full bg-red-500/40" />
        <Skeleton className="absolute top-[58%] left-[38%] h-3 w-3 rounded-full bg-green-500/40" />
        <Skeleton className="absolute top-[62%] left-[34%] h-3 w-3 rounded-full bg-green-500/40" />

        {/* Stats panel skeleton — bottom left */}
        <div className="absolute bottom-8 left-6 w-56 space-y-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/80">
          <Skeleton className="h-4 w-24 bg-neutral-700" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-20 bg-neutral-700" />
              <Skeleton className="h-5 w-8 bg-neutral-700" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16 bg-neutral-700" />
              <Skeleton className="h-5 w-6 bg-neutral-700" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24 bg-neutral-700" />
              <Skeleton className="h-5 w-10 bg-neutral-700" />
            </div>
          </div>
          <div className="pt-1 space-y-1.5">
            <Skeleton className="h-3 w-28 bg-neutral-700" />
            <Skeleton className="h-3 w-24 bg-neutral-700" />
            <Skeleton className="h-3 w-26 bg-neutral-700" />
          </div>
        </div>

        {/* Zoom controls skeleton — bottom right */}
        <div className="absolute bottom-8 right-6 space-y-1">
          <Skeleton className="h-8 w-8 rounded-md bg-neutral-800" />
          <Skeleton className="h-8 w-8 rounded-md bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
