//Testing

import { PanelBottom } from "lucide-react";

interface HeaderProps {
  onOpenWorkspace?: () => void;
}

export function Header({ onOpenWorkspace }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-neutral-950/90 to-transparent">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
              <path
                d="M8 2 C6 4 6 6 8 8 C10 10 10 12 8 14"
                stroke="white"
                strokeWidth="1.2"
                fill="none"
              />
              <path d="M2 8 L14 8" stroke="white" strokeWidth="1.2" />
            </svg>
          </div>

          {/* Wordmark */}
          <div className="flex items-baseline gap-2">
            <span className="text-white font-semibold text-lg tracking-tight">
              PitchPulse
            </span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
              WC 2026
            </span>
          </div>
        </div>

        {/* Right side — reserved for future nav */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <span className="text-xs text-neutral-400 hidden sm:block">
            Canada · Mexico · USA
          </span>
          <button
            type="button"
            onClick={onOpenWorkspace}
            className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-neutral-900/80 px-3 text-xs font-medium text-neutral-200 shadow-lg shadow-black/20 transition hover:bg-neutral-800 md:hidden"
          >
            <PanelBottom className="size-3.5" />
            Feed
          </button>
        </div>
      </div>
    </header>
  );
}
