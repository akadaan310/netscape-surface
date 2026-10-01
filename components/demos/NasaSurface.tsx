'use client';

import React, { useEffect, useState } from 'react';
import { useSurfaceStore } from '../store';

interface Apod {
  title?: string;
  explanation?: string;
  date?: string;
  url?: string;
  media_type?: string;
  copyright?: string;
}

export default function NasaSurface() {
  const { logUIEvent } = useSurfaceStore();
  const [data, setData] = useState<Apod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then((r) => {
        if (r.status === 429) throw new Error('rate-limited');
        if (!r.ok) throw new Error(`http ${r.status}`);
        return r.json();
      })
      .then((j: Apod) => {
        if (!cancelled) {
          setData(j);
          setLoading(false);
          logUIEvent('apod-loaded', { title: j.title, date: j.date });
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-[13px] text-zinc-600 animate-pulse">listening for the sky…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md text-center rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <div className="text-[13px] text-zinc-400 mb-2">the sky is quiet right now</div>
          <p className="text-[12px] text-zinc-600">
            NASA APOD request failed{error === 'rate-limited' ? ' — rate limited (DEMO_KEY has a low daily quota)' : ` (${error})`}.
            Try again later.
          </p>
          <div className="mt-3 text-[10px] tracking-widest uppercase text-zinc-700">
            epistemic · observed
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.02] animate-fade-in">
      {data.media_type === 'video' ? (
        <div className="p-8 text-center">
          <div className="text-[13px] text-zinc-400 mb-3">today's APOD is a video</div>
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-full text-[13px] text-black bg-gold hover:bg-gold-bright transition-colors"
          >
            Open video ↗
          </a>
        </div>
      ) : (
        data.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.url}
            alt={data.title ?? 'NASA astronomy picture of the day'}
            className="w-full max-h-[46vh] object-cover"
          />
        )
      )}
      <div className="p-6 max-w-3xl">
        <div className="text-[11px] font-mono text-zinc-600 mb-1.5">
          {data.date}
          {data.copyright ? ` · © ${data.copyright}` : ''}
        </div>
        <h2 className="text-[16px] font-medium text-zinc-100 mb-3">{data.title}</h2>
        <p className="text-[13.5px] leading-relaxed text-zinc-400">{data.explanation}</p>
        <div className="mt-4 text-[10px] tracking-widest uppercase text-zinc-700">
          live public data · api.nasa.gov · epistemic live-read
        </div>
      </div>
    </div>
  );
}
