'use client';

import React, { useState } from 'react';
import { useSurfaceStore } from '../store';

export default function UrlEntry({ onOpened }: { onOpened?: () => void }) {
  const { openWebSurface } = useSurfaceStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const raw = value.trim();
    if (!raw) return;
    const id = openWebSurface(raw);
    if (!id) {
      setError('that URL is not safe to open — check the scheme and try again.');
      return;
    }
    setError(null);
    setValue('');
    onOpened?.();
  };

  return (
    <div className="border-t border-white/10 pt-3">
      <div className="text-[11px] tracking-widest uppercase text-zinc-500 mb-2 px-1">
        open as surface
      </div>
      <div className="flex gap-1.5">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="https://…"
          spellCheck={false}
          className="flex-1 min-w-0 rounded-full bg-white/[0.04] border border-white/10 px-3.5 py-2 text-[12.5px] font-mono text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-gold/50 transition-all"
        />
        <button
          onClick={submit}
          className="shrink-0 px-3.5 rounded-full text-[12.5px] text-black bg-gold hover:bg-gold-bright transition-colors"
        >
          open
        </button>
      </div>
      {error && <div className="mt-1.5 px-1 text-[11.5px] text-red-400/90">{error}</div>}
    </div>
  );
}
