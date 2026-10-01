'use client';

import React from 'react';
import { useSurfaceStore } from '../store';
import EmbedOrExternal from './EmbedOrExternal';
import { TYPE_GLYPH } from '../glyphs';
import NasaSurface from '../demos/NasaSurface';
import GithubSurface from '../demos/GithubSurface';
import SevenUSurface from '../demos/SevenUSurface';
import ResearchSurface from '../demos/ResearchSurface';
import RecursiveSurface from '../demos/RecursiveSurface';

export default function SurfaceCanvas() {
  const { activeSurface, participants, comeHereAck, dismissAck } = useSurfaceStore();

  if (!activeSurface) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
        no surface
      </div>
    );
  }

  const s = activeSurface;
  const names = s.participantIds
    .map((id) => participants.find((p) => p.participant_id === id)?.name ?? id)
    .filter(Boolean);
  /* header pattern: "NASA + 7u" after come-here */
  const headerLine = [s.title, ...names.filter((n) => n !== 'abed' && n.toLowerCase() !== s.title.toLowerCase())].join(' + ');

  const demo = (s.state as Record<string, unknown> | undefined)?.demo as string | undefined;

  return (
    <div className="flex-1 flex flex-col min-h-0 pl-6 pr-[300px] pt-4 pb-2">
      {/* header */}
      <div className="shrink-0 mb-3 animate-fade-in" key={s.id}>
        <div className="flex items-center gap-2">
          <span className="text-gold text-sm">{TYPE_GLYPH[s.type]}</span>
          <h1 className="text-[17px] font-medium text-zinc-100 tracking-tight">{headerLine}</h1>
        </div>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-500 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-white/5">{s.type}</span>
          {s.url && <span className="truncate max-w-[320px]">{s.url}</span>}
          <span className="text-zinc-700">·</span>
          <span>
            {s.provenance.source} · {s.provenance.author} ·{' '}
            {new Date(s.provenance.retrievedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
          {names.map((n) => (
            <span
              key={n}
              className="text-[11px] px-2 py-0.5 rounded-full border border-white/10 text-zinc-400"
            >
              {n}
            </span>
          ))}
        </div>
      </div>

      {/* body */}
      <div className="flex-1 min-h-0 flex flex-col" key={`body-${s.id}`}>
        {s.type === 'WEB' && demo === 'A' && <NasaSurface />}
        {s.type === 'AI' && demo === 'B' && <SevenUSurface />}
        {s.type === 'REPOSITORY' && demo === 'C' && <GithubSurface />}
        {s.type === 'DOCUMENT' && demo === 'D' && <ResearchSurface />}
        {s.type === 'SESSION' && demo === 'E' && <RecursiveSurface />}
        {(demo === undefined || !['A', 'B', 'C', 'D', 'E'].includes(demo)) && (
          <>
            {s.type === 'WEB' && s.url && <EmbedOrExternal url={s.url} title={s.title} />}
            {(s.type !== 'WEB' || !s.url) && <GenericSurface />}
          </>
        )}
      </div>

      {/* come-here acknowledgment */}
      {comeHereAck && comeHereAck.surfaceId === s.id && (
        <div className="shrink-0 mt-3 rounded-xl border border-gold/30 bg-gold/[0.05] p-3.5 animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[13px]">
              <span className="text-gold font-medium">✦ 7u</span>
              <span className="text-zinc-400"> attached — context received:</span>
            </div>
            <button
              onClick={dismissAck}
              className="text-zinc-600 hover:text-zinc-300 text-sm leading-none"
            >
              ×
            </button>
          </div>
          <ul className="mt-2 space-y-1">
            {comeHereAck.contextItems.map((item, i) => (
              <li key={i} className="text-[12px] font-mono text-zinc-500 break-all">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[13px] text-zinc-300">“{comeHereAck.reply}”</p>
          <div className="mt-1.5 text-[10px] tracking-widest uppercase text-zinc-600">
            simulated · epistemic derived
          </div>
        </div>
      )}
    </div>
  );
}

function GenericSurface() {
  const { activeSurface } = useSurfaceStore();
  return (
    <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="text-[12px] font-mono text-zinc-500 whitespace-pre-wrap">
        {JSON.stringify(
          { title: activeSurface?.title, type: activeSurface?.type, state: activeSurface?.state },
          null,
          2
        )}
      </div>
    </div>
  );
}
