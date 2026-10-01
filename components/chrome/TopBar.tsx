'use client';

import React from 'react';
import { useSurfaceStore } from '../store';
import SurfaceTabs from '../canvas/SurfaceTabs';

export default function TopBar() {
  const { theme, toggleTheme, toggleObservatory, resetDemo, observatoryOpen } = useSurfaceStore();

  return (
    <header className="flex items-center gap-3 px-4 h-12 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
      <div className="flex items-baseline gap-2 select-none">
        <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
          Netscape
        </span>
        <span className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">
          Infinite Surface
        </span>
      </div>

      <div className="flex-1 min-w-0 px-2 overflow-x-auto no-scrollbar">
        <SurfaceTabs />
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'light mode' : 'dark mode'}
          className="w-8 h-8 rounded-full text-zinc-400 hover:text-gold hover:bg-white/5 transition-colors"
        >
          {theme === 'dark' ? '◐' : '◑'}
        </button>
        <button
          onClick={toggleObservatory}
          title="observatory (`)"
          className={`w-8 h-8 rounded-full transition-colors ${
            observatoryOpen ? 'text-gold bg-gold/10' : 'text-zinc-400 hover:text-gold hover:bg-white/5'
          }`}
        >
          ❖
        </button>
        <button
          onClick={resetDemo}
          title="reset demo"
          className="w-8 h-8 rounded-full text-zinc-400 hover:text-gold hover:bg-white/5 transition-colors"
        >
          ↺
        </button>
      </div>
    </header>
  );
}
