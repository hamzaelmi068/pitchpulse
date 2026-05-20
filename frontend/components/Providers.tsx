'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Tweaks } from '@/lib/types';

// ── Flag-image background (module-level — never recreated) ───────────────────

/**
 * Maps FIFA 3-letter codes → flagcdn.com ISO 2-letter (or regional) codes.
 * flagcdn.com uses ISO 3166-1 alpha-2 for countries; England needs the
 * gb-eng subdivision code.
 */
const FIFA_TO_ISO: Record<string, string> = {
  ARG: 'ar', AUS: 'au', BEL: 'be', BRA: 'br',
  CAN: 'ca', COL: 'co', CRO: 'hr', DEN: 'dk',
  ENG: 'gb-eng', ESP: 'es', FRA: 'fr', GER: 'de',
  ITA: 'it', JPN: 'jp', KOR: 'kr', MAR: 'ma',
  MEX: 'mx', NED: 'nl', POL: 'pl', POR: 'pt',
  SEN: 'sn', SUI: 'ch', URU: 'uy', USA: 'us',
};

/** Returns a 1280-wide flag image URL for a FIFA team code, or null if unknown. */
function getFlagUrl(fifaCode: string): string | null {
  const iso = FIFA_TO_ISO[fifaCode];
  return iso ? `https://flagcdn.com/w1280/${iso}.webp` : null;
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

  // Apply team flag image as full-page background (js-batch-dom-css).
  // Depends on both myTeam and tweaks.look — split from the localStorage effect
  // so each effect has a single clear purpose (rerender-split-combined-hooks).
  // Broadcast is intentionally dark — skip the flag overlay there.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const flagUrl = myTeam && tweaks.look !== 'broadcast'
      ? getFlagUrl(myTeam)
      : null;

    if (flagUrl) {
      // Full-page flag: fixed so it doesn't scroll with content
      body.style.backgroundImage    = `url(${flagUrl})`;
      body.style.backgroundSize     = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundAttachment = 'fixed';
      body.style.backgroundRepeat   = 'no-repeat';

      // Make surface cards semi-transparent so the flag bleeds through.
      // rgba keeps the warm cream tint while letting the flag show beneath.
      html.style.setProperty('--paper',   'rgba(242,238,227,0.82)');
      html.style.setProperty('--paper-2', 'rgba(234,228,212,0.88)');
      html.setAttribute('data-my-team', myTeam!);
    } else {
      // Clear everything — restore solid opaque defaults from globals.css
      body.style.backgroundImage     = '';
      body.style.backgroundSize      = '';
      body.style.backgroundPosition  = '';
      body.style.backgroundAttachment = '';
      body.style.backgroundRepeat    = '';
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
