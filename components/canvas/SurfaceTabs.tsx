'use client';

import React from 'react';
import { useSurfaceStore } from '../store';
import { TYPE_GLYPH } from '../glyphs';

export default function SurfaceTabs() {
  const { session, activeSurface, setActiveSurfaceId, closeSurfaceById } = useSurfaceStore();

  return (
    <div className="flex items-center gap-1">
      {session.surfaces.map((s) => {
        const active = activeSurface?.id === s.id;
        return (
          <div
            key={s.id}
            onClick={() => setActiveSurfaceId(s.id)}
            className={`group flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-[12px] cursor-pointer whitespace-nowrap transition-all ${
              active
                ? 'bg-white/10 text-zinc-100 ring-1 ring-gold/40'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
            title={`${s.title} (${s.type})`}
          >
            <span className={active ? 'text-gold' : 'text-zinc-600'}>{TYPE_GLYPH[s.type]}</span>
            <span className="max-w-[140px] truncate">{s.title}</span>
            {session.surfaces.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeSurfaceById(s.id);
                }}
                className="w-4 h-4 rounded-full text-zinc-600 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                title="close surface"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
