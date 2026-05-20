'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Tweaks } from '@/lib/types';
import { teams } from '@/lib/data';

// ── Colour helpers (module-level — never recreated) ───────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return null;
  return [parseInt(m[0], 16), parseInt(m[1], 16), parseInt(m[2], 16)];
}

// Default base colours matching globals.css
const BASE_PAPER:  [number, number, number] = [242, 238, 227]; // #F2EEE3
const BASE_PAPER2: [number, number, number] = [234, 228, 212]; // #EAE4D4

/** Alpha-composite `primary` over `base` at `alpha` opacity → solid rgb() */
function tint(primary: [number, number, number], base: [number, number, number], alpha: number): string {
  const r = Math.round(primary[0] * alpha + base[0] * (1 - alpha));
  const g = Math.round(primary[1] * alpha + base[1] * (1 - alpha));
  const b = Math.round(primary[2] * alpha + base[2] * (1 - alpha));
  return `rgb(${r},${g},${b})`;
}

/**
 * Relative luminance (WCAG formula) — used to cap alpha on very dark or very
 * bright primaries so contrast stays readable regardless of team colour.
 */
function luminance([r, g, b]: [number, number, number]): number {
  const ch = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

/**
 * Build solid-colour team theming from the primary flag colour.
 * Alpha is clamped so very dark colours (black kit, navy) stay readable.
 */
function buildTeamStyles(flag: string[]): { paper: string; paper2: string } | null {
  const primary = hexToRgb(flag[0] ?? '');
  if (!primary) return null;

  // Dark primaries (e.g. black, navy) would grey-out the page at high alpha —
  // cap them so text contrast stays safe
  const lum = luminance(primary);
  const alpha = lum < 0.08 ? 0.15 : 0.28;

  return {
    paper:  tint(primary, BASE_PAPER,  alpha),
    paper2: tint(primary, BASE_PAPER2, alpha + 0.06),
  };
}

// ───────── Tweaks ─────────

const DEFAULT_TWEAKS: Tweaks = {
  type: 'editorial',
  look: 'atlas',
  mapStyle: 'dots',
  density: 'cozy',
  aiSummary: true,
};

interface TweaksContextValue {
  tweaks: Tweaks;
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
}

const TweaksContext = createContext<TweaksContextValue | null>(null);

export function useTweaks(): TweaksContextValue {
  const v = useContext(TweaksContext);
  if (!v) throw new Error('useTweaks must be used inside <Providers>');
  return v;
}

// ───────── My team ─────────

interface MyTeamContextValue {
  myTeam: string | null;
  setMyTeam: (code: string | null) => void;
}

const MyTeamContext = createContext<MyTeamContextValue | null>(null);

export function useMyTeam(): MyTeamContextValue {
  const v = useContext(MyTeamContext);
  if (!v) throw new Error('useMyTeam must be used inside <Providers>');
  return v;
}

// ───────── Provider tree ─────────

export function Providers({ children }: { children: ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const [myTeam, setMyTeamState] = useState<string | null>(null);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem('pp-tweaks');
      if (t) setTweaks({ ...DEFAULT_TWEAKS, ...JSON.parse(t) });
    } catch {}
    try {
      const m = localStorage.getItem('pp-my-team');
      if (m) setMyTeamState(m);
    } catch {}
  }, []);

  // Persist + apply attrs
  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute('data-look', tweaks.look);
    el.setAttribute('data-density', tweaks.density);
    el.setAttribute('data-type', tweaks.type);
    try { localStorage.setItem('pp-tweaks', JSON.stringify(tweaks)); } catch {}
  }, [tweaks]);

  // Persist myTeam to localStorage (single responsibility — no DOM side-effects)
  useEffect(() => {
    if (myTeam) {
      try { localStorage.setItem('pp-my-team', myTeam); } catch {}
    } else {
      try { localStorage.removeItem('pp-my-team'); } catch {}
    }
  }, [myTeam]);

  // Apply team brand tint to background CSS variables (js-batch-dom-css).
  // Depends on both myTeam and tweaks.look — split from the localStorage effect
  // so each effect has a single clear purpose (rerender-split-combined-hooks).
  // Broadcast is intentionally dark — don't override it with a light tint.
  useEffect(() => {
    const el = document.documentElement;
    const flag = myTeam && tweaks.look !== 'broadcast'
      ? teams[myTeam]?.flag
      : null;
    const styles = flag ? buildTeamStyles(flag) : null;

    if (styles) {
      // Batch both writes — avoids two separate style recalculations (js-batch-dom-css)
      el.style.setProperty('--paper',   styles.paper);
      el.style.setProperty('--paper-2', styles.paper2);
      el.setAttribute('data-my-team', myTeam!);
    } else {
      el.style.removeProperty('--paper');
      el.style.removeProperty('--paper-2');
      el.removeAttribute('data-my-team');
    }
  }, [myTeam, tweaks.look]);

  const setTweak = <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak }}>
      <MyTeamContext.Provider value={{ myTeam, setMyTeam: setMyTeamState }}>
        {children}
      </MyTeamContext.Provider>
    </TweaksContext.Provider>
  );
}
