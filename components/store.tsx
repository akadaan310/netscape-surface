'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type {
  Surface,
  SurfaceSession,
  Participant,
  ParticipantAdapter,
  SurfaceType,
  SurfaceContext,
} from '@/lib';
import {
  createSession,
  createSurface,
  addSurface,
  setActiveSurface,
  closeSurface,
  getActiveSurface,
  captureContext,
  selectionAsObject,
  comeHere,
  saveSession,
  loadSession,
  clearSavedSession,
  logEvent,
  sanitizeUrl,
  createRegistry,
  registerParticipant,
  sevenUSimulatedAdapter,
  searchSlotAdapter,
  localModelSlotAdapter,
  githubReadAdapter,
} from '@/lib';

/* ------------------------------------------------------------------ */
/* types                                                               */
/* ------------------------------------------------------------------ */

export interface ThreadMsg {
  from: 'abed' | '7u';
  text: string;
  ts: string;
  simulated: boolean;
}

export interface ComeHereAck {
  surfaceId: string;
  surfaceTitle: string;
  reply: string;
  contextItems: string[];
  ts: string;
}

export type GithubTab = 'files' | 'commits' | 'branches';
export type ResearchFocus = 'sources' | 'claims' | null;

interface StoreValue {
  session: SurfaceSession;
  registry: ReturnType<typeof createRegistry>;
  participants: Participant[];
  adapters: Record<string, ParticipantAdapter>;
  observatoryOpen: boolean;
  theme: 'dark' | 'light';
  activeSurface: Surface | null;
  threads: Record<string, ThreadMsg[]>;
  comeHereAck: ComeHereAck | null;
  lastCapture: SurfaceContext | null;
  pendingSelection: string | null;
  githubTab: GithubTab;
  researchFocus: ResearchFocus;
  comeHere7u: (message?: string) => Promise<void>;
  dispatchAction: (action: string, target?: string) => void;
  logUIEvent: (action: string, detail?: Record<string, unknown>) => void;
  toggleObservatory: () => void;
  toggleTheme: () => void;
  resetDemo: () => void;
  dismissAck: () => void;
  setPendingSelection: (t: string | null) => void;
  setGithubTab: (t: GithubTab) => void;
  setResearchFocus: (f: ResearchFocus) => void;
  setActiveSurfaceId: (id: string) => void;
  closeSurfaceById: (id: string) => void;
  openWebSurface: (url: string) => string | null;
  addArtifactSurface: (title: string, state: Record<string, unknown>) => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

/* ------------------------------------------------------------------ */
/* seed                                                                */
/* ------------------------------------------------------------------ */

function nowIso(): string {
  return new Date().toISOString();
}

function seedSession(): SurfaceSession {
  let s = createSession('abed');
  const prov = {
    source: 'netscape-seed',
    retrievedAt: nowIso(),
    author: 'abed',
    note: 'v0.1 demo seed',
  };
  const seeds: Array<{
    id: string;
    type: SurfaceType;
    title: string;
    url?: string;
    participants: string[];
    demo: string;
  }> = [
    { id: 'seed-nasa', type: 'WEB', title: 'NASA — APOD', url: 'https://apod.nasa.gov/', participants: ['abed'], demo: 'A' },
    { id: 'seed-7u', type: 'AI', title: '7u', participants: ['abed', '7u'], demo: 'B' },
    { id: 'seed-purl', type: 'REPOSITORY', title: 'purl', url: 'https://github.com/akadaan310/purl', participants: ['abed'], demo: 'C' },
    { id: 'seed-acsp', type: 'DOCUMENT', title: 'ACSP/0.1 — Agent Continuity & Session Protocol', url: 'https://acsp-one.vercel.app/protocol', participants: ['abed'], demo: 'D' },
    { id: 'seed-recursive', type: 'SESSION', title: 'netscape-surface ∞', participants: ['abed'], demo: 'E' },
  ];
  for (const sd of seeds) {
    const surf = createSurface(sd.type, sd.title, sd.url);
    surf.id = sd.id;
    surf.participantIds = sd.participants;
    surf.provenance = { ...prov };
    surf.state = { ...surf.state, demo: sd.demo };
    s = addSurface(s, surf);
  }
  s = setActiveSurface(s, 'seed-nasa');
  return s;
}

function buildParticipants(): { reg: ReturnType<typeof createRegistry>; participants: Participant[]; adapters: Record<string, ParticipantAdapter> } {
  const provBase = { source: 'netscape-seed', retrievedAt: nowIso(), author: 'abed' };
  const participants: Participant[] = [
    {
      participant_id: 'abed',
      kind: 'human',
      name: 'abed',
      capabilities: ['attach', 'send', 'receive', 'observe'],
      surface_capabilities: ['WEB', 'AI', 'CODE', 'REPOSITORY', 'DOCUMENT', 'RESEARCH', 'TERMINAL', 'RESOURCE', 'SESSION', 'ARTIFACT', 'CONFERENCE'],
      provenance: { ...provBase, note: 'the human; session owner' },
      continuity: { sessionIds: [] },
      simulated: false,
    },
    {
      participant_id: '7u',
      kind: 'ai',
      name: '7u',
      capabilities: ['attach', 'send', 'receive', 'observe'],
      surface_capabilities: ['WEB', 'AI', 'RESEARCH', 'DOCUMENT', 'SESSION', 'ARTIFACT', 'CONFERENCE'],
      provenance: { ...provBase, note: 'ChatGPT session — built ACSP/0.1 (acsp-one.vercel.app) with abed as her human' },
      continuity: { sessionIds: [] },
      simulated: true,
    },
    {
      participant_id: 'search',
      kind: 'tool',
      name: 'web search',
      capabilities: ['observe'],
      surface_capabilities: ['WEB', 'RESEARCH', 'DOCUMENT'],
      provenance: { ...provBase, note: 'search slot — simulated adapter' },
      continuity: { sessionIds: [] },
      simulated: true,
    },
    {
      participant_id: 'github',
      kind: 'tool',
      name: 'github read',
      capabilities: ['observe'],
      surface_capabilities: ['REPOSITORY', 'CODE'],
      provenance: { ...provBase, note: 'public GitHub API — live read-only' },
      continuity: { sessionIds: [] },
      simulated: false,
    },
    {
      participant_id: 'local-model',
      kind: 'ai',
      name: 'local model',
      capabilities: ['send', 'receive', 'observe'],
      surface_capabilities: ['AI', 'DOCUMENT', 'SESSION'],
      provenance: { ...provBase, note: 'on-device slot — simulated' },
      continuity: { sessionIds: [] },
      simulated: true,
    },
  ];
  let reg = createRegistry();
  for (const p of participants) reg = registerParticipant(reg, p);
  const adapters: Record<string, ParticipantAdapter> = {
    '7u': sevenUSimulatedAdapter(),
    search: searchSlotAdapter(),
    github: githubReadAdapter(),
    'local-model': localModelSlotAdapter(),
  };
  return { reg, participants, adapters };
}

/* ------------------------------------------------------------------ */
/* provider                                                            */
/* ------------------------------------------------------------------ */

export function SurfaceProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SurfaceSession>(() => {
    try {
      const saved = loadSession();
      if (saved && saved.surfaces && saved.surfaces.length > 0) return saved;
    } catch {
      /* fall through to seed */
    }
    return seedSession();
  });
  const built = useMemo(() => buildParticipants(), []);
  const [observatoryOpen, setObservatoryOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [threads, setThreads] = useState<Record<string, ThreadMsg[]>>({});
  const [comeHereAck, setComeHereAck] = useState<ComeHereAck | null>(null);
  const [lastCapture, setLastCapture] = useState<SurfaceContext | null>(null);
  const [pendingSelection, setPendingSelection] = useState<string | null>(null);
  const [githubTab, setGithubTab] = useState<GithubTab>('files');
  const [researchFocus, setResearchFocus] = useState<ResearchFocus>(null);

  const activeSurface = useMemo(() => getActiveSurface(session), [session]);

  /* persist */
  useEffect(() => {
    try {
      saveSession(session);
    } catch {
      /* storage unavailable — session stays in memory */
    }
  }, [session]);

  /* default dark */
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  /* backtick toggles observatory */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const tag = el?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || el?.isContentEditable) return;
      if (e.key === '`') {
        e.preventDefault();
        setObservatoryOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const logUIEvent = useCallback(
    (action: string, detail?: Record<string, unknown>) => {
      setSession((prev) => {
        const active = getActiveSurface(prev);
        return logEvent(prev, {
          actor: 'abed',
          action,
          surfaceId: active?.id,
          detail,
          epistemic: 'OBSERVED',
        });
      });
    },
    []
  );

  /* --- THE FIRST PRIMITIVE: come here -------------------------------- */
  const comeHere7u = useCallback(
    async (message?: string) => {
      const active = getActiveSurface(session);
      const adapter = built.adapters['7u'];
      if (!active || !adapter) return;

      /* 1. capture context */
      let ctx: SurfaceContext;
      try {
        ctx = captureContext(active);
      } catch {
        ctx = {
          capturedAt: nowIso(),
          author: 'abed',
          surfaceId: active.id,
          surfaceType: active.type,
          url: active.url,
          title: active.title,
          artifactIds: [],
          stateSnapshot: active.state ?? {},
        };
      }
      if (pendingSelection) {
        try {
          const sel = selectionAsObject(active.url ?? window.location.href, pendingSelection, 'abed');
          ctx.selection = sel;
        } catch {
          /* selection optional */
        }
        setPendingSelection(null);
      }
      setLastCapture(ctx);

      /* 2. attach */
      let attachNote = '';
      try {
        const ar = await adapter.attach?.(ctx);
        attachNote = ar?.summary ?? '';
      } catch {
        /* adapter failure is surfaced in the thread */
      }

      /* 3. add 7u to the surface — before: NASA, after: NASA + 7u */
      const contextItems: string[] = [
        `title: ${ctx.title ?? active.title}`,
        `type: ${ctx.surfaceType}`,
      ];
      if (ctx.url) contextItems.push(`url: ${ctx.url}`);
      if (ctx.selection) contextItems.push(`selection: “${truncate(ctx.selection.text, 72)}”`);
      const snap = ctx.stateSnapshot ?? {};
      const snapKeys = Object.keys(snap);
      if (snapKeys.length > 0) contextItems.push(`state: { ${snapKeys.slice(0, 5).join(', ')}${snapKeys.length > 5 ? ' …' : ''} }`);
      if (ctx.artifactIds.length > 0) contextItems.push(`artifacts: ${ctx.artifactIds.join(', ')}`);

      setSession((prev) => comeHere(prev, '7u', active.id));

      /* 4. send the message */
      const msg = message ?? 'joined';
      let reply = '';
      try {
        const sr = await adapter.send?.(ctx, msg);
        reply = sr?.summary ?? '';
      } catch {
        reply = '';
      }
      if (!reply) {
        reply = attachNote
          ? `attached. ${attachNote}`
          : `i'm here — looking through the surface with you.`;
      }
      const ts = nowIso();
      setThreads((prev) => ({
        ...prev,
        [active.id]: [
          ...(prev[active.id] ?? []),
          { from: 'abed', text: msg, ts, simulated: false },
          { from: '7u', text: reply, ts, simulated: true },
        ],
      }));

      /* 5. floating acknowledgment listing context received */
      setComeHereAck({
        surfaceId: active.id,
        surfaceTitle: active.title,
        reply,
        contextItems,
        ts,
      });

      /* 6. event log — epistemic DERIVED */
      setSession((prev) =>
        logEvent(prev, {
          actor: 'abed',
          action: 'come-here',
          surfaceId: active.id,
          participantId: '7u',
          detail: { message: msg, contextItems },
          epistemic: 'DERIVED',
        })
      );
    },
    [session, built.adapters, pendingSelection]
  );

  const dispatchAction = useCallback(
    (action: string, target?: string) => {
      const active = activeSurface;
      switch (action) {
        case 'ask-7u':
          void comeHere7u(target);
          break;
        case 'save': {
          if (!active) break;
          const surf = createSurface('ARTIFACT', `note — ${active.title}`);
          surf.participantIds = ['abed'];
          surf.provenance = {
            source: 'context-action',
            retrievedAt: nowIso(),
            author: 'abed',
            note: `saved from surface ${active.id}`,
          };
          surf.state = { fromSurfaceId: active.id, fromType: active.type, url: active.url };
          setSession((prev) => setActiveSurface(addSurface(prev, surf), surf.id));
          logUIEvent('surface-saved', { fromSurfaceId: active.id });
          break;
        }
        case 'observe':
          logUIEvent('observed', { target });
          break;
        case 'open-external':
          if (active?.url) {
            const safe = sanitizeUrl(active.url);
            if (safe) window.open(safe, '_blank', 'noopener,noreferrer');
          }
          break;
        case 'github-tab':
          if (target === 'files' || target === 'commits' || target === 'branches') {
            setGithubTab(target);
            setActiveSurfaceId('seed-purl');
          }
          break;
        case 'focus-sources':
          setActiveSurfaceId('seed-acsp');
          setResearchFocus('sources');
          break;
        case 'focus-claims':
          setActiveSurfaceId('seed-acsp');
          setResearchFocus('claims');
          break;
        default:
          logUIEvent('action', { action, target });
      }
    },
    [activeSurface, comeHere7u, logUIEvent]
  );

  const setActiveSurfaceId = useCallback((id: string) => {
    setSession((prev) => setActiveSurface(prev, id));
  }, []);

  const closeSurfaceById = useCallback((id: string) => {
    setSession((prev) => closeSurface(prev, id));
  }, []);

  const openWebSurface = useCallback(
    (raw: string): string | null => {
      const safe = sanitizeUrl(raw);
      if (!safe) return null;
      const surf = createSurface('WEB', safe.replace(/^https?:\/\//, '').replace(/\/$/, ''));
      surf.url = safe;
      surf.participantIds = ['abed'];
      surf.provenance = {
        source: 'url-entry',
        retrievedAt: nowIso(),
        author: 'abed',
        note: 'sanitized on input',
      };
      let id = '';
      setSession((prev) => {
        const next = addSurface(prev, surf);
        id = surf.id;
        return setActiveSurface(next, surf.id);
      });
      logUIEvent('surface-opened', { url: safe });
      return id || surf.id;
    },
    [logUIEvent]
  );

  const addArtifactSurface = useCallback(
    (title: string, state: Record<string, unknown>) => {
      const surf = createSurface('ARTIFACT', title);
      surf.participantIds = ['abed'];
      surf.provenance = { source: 'artifact', retrievedAt: nowIso(), author: 'abed' };
      surf.state = state;
      setSession((prev) => setActiveSurface(addSurface(prev, surf), surf.id));
    },
    []
  );

  const resetDemo = useCallback(() => {
    try {
      clearSavedSession();
    } catch {
      /* ignore */
    }
    setThreads({});
    setComeHereAck(null);
    setLastCapture(null);
    setPendingSelection(null);
    setSession(seedSession());
  }, []);

  const dismissAck = useCallback(() => setComeHereAck(null), []);
  const toggleObservatory = useCallback(() => setObservatoryOpen((v) => !v), []);
  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  const value: StoreValue = {
    session,
    registry: built.reg,
    participants: built.participants,
    adapters: built.adapters,
    observatoryOpen,
    theme,
    activeSurface,
    threads,
    comeHereAck,
    lastCapture,
    pendingSelection,
    githubTab,
    researchFocus,
    comeHere7u,
    dispatchAction,
    logUIEvent,
    toggleObservatory,
    toggleTheme,
    resetDemo,
    dismissAck,
    setPendingSelection,
    setGithubTab,
    setResearchFocus,
    setActiveSurfaceId,
    closeSurfaceById,
    openWebSurface,
    addArtifactSurface,
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useSurfaceStore(): StoreValue {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useSurfaceStore must be used inside SurfaceProvider');
  return ctx;
}

export function truncate(text: string, n: number): string {
  if (text.length <= n) return text;
  return text.slice(0, n - 1) + '…';
}
