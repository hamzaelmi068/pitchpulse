'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Tweaks } from '@/lib/types';
import { teams } from '@/lib/data';

// ── Flag-colour gradient (module-level — never recreated) ────────────────────

/** Convert a hex colour + alpha → rgba() string. */
function hexToRgba(hex: string, alpha: number): string {
  const m = hex.replace('#', '').match(/.{2}/g);
  if (!m || m.length < 3) return `rgba(128,128,128,${alpha})`;
  return `rgba(${parseInt(m[0], 16)},${parseInt(m[1], 16)},${parseInt(m[2], 16)},${alpha})`;
}

/**
 * Build a three-stripe vertical gradient from the team's flag colours.
 * Alpha is kept low (~0.45) so the stripes read as a subtle wash — colour
 * without any image detail or imagery.
 */
function buildFlagGradient(flag: string[]): string {
  const alpha = 0.45;
  const [raw1, raw2, raw3] = flag;
  const c1 = hexToRgba(raw1 ?? '#888888', alpha);
  const c2 = hexToRgba(raw2 ?? raw1 ?? '#888888', alpha);
  const c3 = hexToRgba(raw3 ?? raw1 ?? '#888888', alpha);
  // Three equal horizontal bands, hard stops — crisp stripe, not a blur
  return `linear-gradient(to bottom, ${c1} 33.33%, ${c2} 33.33%, ${c2} 66.66%, ${c3} 66.66%)`;
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

  // Apply team flag-colour gradient as full-page background (js-batch-dom-css).
  // Depends on both myTeam and tweaks.look — split from the localStorage effect
  // so each effect has a single clear purpose (rerender-split-combined-hooks).
  // Broadcast is intentionally dark — skip the gradient there.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const flag = myTeam && tweaks.look !== 'broadcast'
      ? teams[myTeam]?.flag
      : null;

    if (flag) {
      // CSS gradient at low alpha = flag colours, zero imagery/detail
      body.style.backgroundImage      = buildFlagGradient(flag);
      body.style.backgroundAttachment = 'fixed';

      // Cards stay mostly opaque so text is fully readable;
      // the gradient shows through the tiny gaps between surfaces.
      html.style.setProperty('--paper',   'rgba(242,238,227,0.93)');
      html.style.setProperty('--paper-2', 'rgba(234,228,212,0.95)');
      html.setAttribute('data-my-team', myTeam!);
    } else {
      // Clear — restore solid defaults from globals.css
      body.style.backgroundImage      = '';
      body.style.backgroundAttachment = '';
      html.style.removeProperty('--paper');
      html.style.removeProperty('--paper-2');
      html.removeAttribute('data-my-team');
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
