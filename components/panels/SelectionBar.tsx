'use client';

import React, { useState } from 'react';
import { useSurfaceStore, truncate } from '../store';
import { selectionAsObject } from '@/lib';

export default function SelectionBar() {
  const { pendingSelection, setPendingSelection, comeHere7u } = useSurfaceStore();
  const [note, setNote] = useState<string | null>(null);

  const capture = () => {
    const text = window.getSelection()?.toString().trim() ?? '';
    if (!text) {
      setNote('nothing selected');
      setTimeout(() => setNote(null), 1600);
      return;
    }
    try {
      /* validate it builds a proper selection object before storing */
      selectionAsObject(window.location.href, text, 'abed');
    } catch {
      /* still store the raw text — the store re-validates on attach */
    }
    setPendingSelection(text);
    setNote(null);
  };

  if (!pendingSelection && !note) {
    return (
      <button
        onClick={capture}
        className="text-[11.5px] text-zinc-600 hover:text-gold transition-colors"
        title="capture the current text selection"
      >
        ⑂ capture selection
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {note && <span className="text-[11.5px] text-zinc-600">{note}</span>}
      {pendingSelection && (
        <>
          <span className="max-w-[220px] truncate text-[11.5px] font-mono text-gold/90 border border-gold/30 rounded-full px-2.5 py-0.5 bg-gold/[0.06]">
            “{truncate(pendingSelection, 48)}”
          </span>
          <button
            onClick={() => void comeHere7u(`here's what caught my eye: ${pendingSelection}`)}
            className="text-[11.5px] text-zinc-400 hover:text-gold transition-colors"
          >
            ✦ ask 7u
          </button>
          <button
            onClick={() => setPendingSelection(null)}
            className="text-[11.5px] text-zinc-700 hover:text-zinc-400 transition-colors"
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
