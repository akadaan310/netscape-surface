'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Props {
  url: string;
  title: string;
}

/**
 * Tries to embed; falls back to an honest EXTERNAL card when framing is
 * blocked. Never attempts to bypass X-Frame-Options / CSP.
 */
export default function EmbedOrExternal({ url, title }: Props) {
  const [state, setState] = useState<'loading' | 'ok' | 'blocked'>('loading');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    setState('loading');
    timer.current = window.setTimeout(() => {
      setState((s) => (s === 'loading' ? 'blocked' : s));
    }, 6000);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [url]);

  const handleLoad = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setState('ok');
  };

  if (state === 'blocked') {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center rounded-2xl border border-white/10 bg-white/[0.02] p-8 animate-fade-in">
          <div className="text-gold text-2xl mb-3">◉</div>
          <div className="text-sm text-zinc-300 mb-2">{title}</div>
          <p className="text-[13px] text-zinc-500 leading-relaxed mb-5">
            This site does not allow embedding (X-Frame-Options / CSP).
            Surface context is retained locally — nothing about the surface
            was lost.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-full text-[13px] text-black bg-gold hover:bg-gold-bright transition-colors"
          >
            Open externally ↗
          </a>
          <div className="mt-4 text-[11px] font-mono text-zinc-600 break-all">{url}</div>
          <div className="mt-2 text-[10px] tracking-widest uppercase text-zinc-700">
            epistemic · observed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative min-h-0">
      {state === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[13px] text-zinc-600 animate-pulse">reaching {title}…</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        onLoad={handleLoad}
        sandbox="allow-scripts allow-popups"
        className="absolute inset-0 w-full h-full rounded-xl border border-white/10 bg-black/20"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
