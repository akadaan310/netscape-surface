'use client';

import React, { useEffect, useState } from 'react';
import { useSurfaceStore, type GithubTab } from '../store';

interface GhFile {
  name: string;
  type: string;
  size?: number;
  path: string;
}
interface GhCommit {
  sha: string;
  commit: { message: string; author: { name?: string; date?: string } };
}
interface GhBranch {
  name: string;
}

const REPO = 'akadaan310/purl';

export default function GithubSurface() {
  const { githubTab, setGithubTab, logUIEvent } = useSurfaceStore();
  const [files, setFiles] = useState<GhFile[] | null>(null);
  const [commits, setCommits] = useState<GhCommit[] | null>(null);
  const [branches, setBranches] = useState<GhBranch[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const headers = { Accept: 'application/vnd.github+json' };
    const load = async () => {
      try {
        const [f, c, b] = await Promise.all([
          fetch(`https://api.github.com/repos/${REPO}/contents`, { headers }).then((r) => {
            if (r.status === 403) throw new Error('rate-limited');
            if (!r.ok) throw new Error(`contents: ${r.status}`);
            return r.json();
          }),
          fetch(`https://api.github.com/repos/${REPO}/commits?per_page=5`, { headers }).then((r) => {
            if (r.status === 403) throw new Error('rate-limited');
            if (!r.ok) throw new Error(`commits: ${r.status}`);
            return r.json();
          }),
          fetch(`https://api.github.com/repos/${REPO}/branches`, { headers }).then((r) => {
            if (r.status === 403) throw new Error('rate-limited');
            if (!r.ok) throw new Error(`branches: ${r.status}`);
            return r.json();
          }),
        ]);
        if (!cancelled) {
          setFiles(f);
          setCommits(c);
          setBranches(b);
          logUIEvent('github-loaded', { repo: REPO });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'failed');
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tab = (id: GithubTab, label: string) => (
    <button
      key={id}
      onClick={() => setGithubTab(id)}
      className={`px-3.5 py-1.5 rounded-full text-[12.5px] transition-colors ${
        githubTab === id
          ? 'bg-white/10 text-zinc-100 ring-1 ring-gold/40'
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-white/10 bg-white/[0.02] animate-fade-in">
      <div className="flex items-center gap-1.5 px-4 pt-4 shrink-0">
        {tab('files', 'Files')}
        {tab('commits', 'Commits')}
        {tab('branches', 'Branches')}
        <span className="ml-auto text-[11px] font-mono text-zinc-600">{REPO}</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {error && (
          <div className="text-[13px] text-zinc-500">
            {error === 'rate-limited'
              ? 'GitHub rate limit reached for unauthenticated requests (60/hr). Try again soon.'
              : `could not read the repo (${error}).`}
          </div>
        )}
        {!error && githubTab === 'files' && (
          <FileList files={files} />
        )}
        {!error && githubTab === 'commits' && (
          <div className="space-y-2.5">
            {commits ? (
              commits.map((c) => (
                <div key={c.sha} className="rounded-lg border border-white/5 bg-black/20 px-3.5 py-2.5">
                  <div className="text-[13px] text-zinc-200">{c.commit.message.split('\n')[0]}</div>
                  <div className="text-[11px] font-mono text-zinc-600 mt-1">
                    {c.sha.slice(0, 7)} · {c.commit.author?.name} · {c.commit.author?.date?.slice(0, 10)}
                  </div>
                </div>
              ))
            ) : (
              <Loading />
            )}
          </div>
        )}
        {!error && githubTab === 'branches' && (
          <div className="flex flex-wrap gap-2">
            {branches ? (
              branches.map((b) => (
                <span key={b.name} className="text-[12.5px] px-3 py-1 rounded-full border border-white/10 text-zinc-300">
                  ⎇ {b.name}
                </span>
              ))
            ) : (
              <Loading />
            )}
          </div>
        )}
      </div>

      <div className="px-4 pb-3 shrink-0 text-[10px] tracking-widest uppercase text-zinc-700">
        live public data · read-only · epistemic live-read
      </div>
    </div>
  );
}

function Loading() {
  return <div className="text-[13px] text-zinc-600 animate-pulse">reading…</div>;
}

function FileList({ files }: { files: GhFile[] | null }) {
  if (!files) return <Loading />;
  return (
    <div className="divide-y divide-white/5">
      {files.map((f) => (
        <div key={f.path} className="flex items-center gap-2.5 py-2 text-[13px]">
          <span className="text-zinc-600">{f.type === 'dir' ? '▸' : '·'}</span>
          <span className="text-zinc-300 font-mono">{f.name}</span>
          {typeof f.size === 'number' && (
            <span className="ml-auto text-[11px] font-mono text-zinc-600">
              {(f.size / 1024).toFixed(1)}k
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
