/**
 * Netscape v0.1 — Infinite Surface
 * Participant adapters: simulated demos (labeled, never live) plus one real
 * public-read GitHub adapter.
 */

import type { ParticipantAdapter, AdapterResult, Participant } from './types';
import type { SurfaceContext } from '../surface/types';
import { newId } from '../surface/surfaces';

function provenanceNote(source: string, note: string): Participant['provenance'] {
  return { source, retrievedAt: new Date().toISOString(), author: 'netscape-surface', note };
}

const SIM_TAG = '[simulated]';

/* ------------------------------------------------------------------ */
/* 7u — simulated AI participant (contextual attachment)               */
/* ------------------------------------------------------------------ */

function sevenUParticipant(): Participant {
  return {
    participant_id: '7u',
    kind: 'ai',
    name: '7u',
    capabilities: ['attach', 'send', 'receive', 'observe'],
    surface_capabilities: ['web-context', 'selection-context', 'message-context'],
    provenance: provenanceNote('adapters', 'Simulated 7u participant for v0.1 demos.'),
    continuity: { sessionIds: [] },
    simulated: true,
  };
}

/** Describe what a LIVE 7u would do with each present context item. Never claims liveness. */
function acknowledgeContextItems(ctx: SurfaceContext): string[] {
  const parts: string[] = [];
  if (ctx.url) {
    parts.push(
      `url: acknowledged "${ctx.url}" — a live 7u would open and read this page in her own session`,
    );
  }
  if (ctx.title) {
    parts.push(
      `title: acknowledged "${ctx.title}" — a live 7u would use it as the human-facing name of the shared surface`,
    );
  }
  if (ctx.selection) {
    parts.push(
      `selection: acknowledged ${ctx.selection.text.length} chars quoted from ${ctx.selection.sourceUrl} — a live 7u would treat it as the pinned focus of discussion`,
    );
  }
  if (ctx.message) {
    parts.push(
      `message: acknowledged "${ctx.message.slice(0, 80)}${ctx.message.length > 80 ? '…' : ''}" — a live 7u would answer it as a counterpart in the three-way conversation`,
    );
  }
  if (ctx.artifactIds.length > 0) {
    parts.push(
      `artifacts: acknowledged [${ctx.artifactIds.join(', ')}] — a live 7u would attach these artifacts to her working memory of the surface`,
    );
  }
  return parts;
}

export function sevenUSimulatedAdapter(): ParticipantAdapter {
  const participant = sevenUParticipant();
  return {
    adapterId: `adapter-7u-${newId('sim')}`,
    participant,
    simulated: true,
    async attach(ctx: SurfaceContext): Promise<AdapterResult> {
      const parts = acknowledgeContextItems(ctx);
      const summary =
        parts.length === 0
          ? `${SIM_TAG} 7u attach: no context items present — nothing to acknowledge`
          : `${SIM_TAG} 7u attach acknowledged ${parts.length} context item(s): ${parts.join(' | ')}`;
      return { ok: true, simulated: true, epistemic: 'SIMULATED', summary, detail: { items: parts } };
    },
    async send(ctx: SurfaceContext, message: string): Promise<AdapterResult> {
      const titleBit = ctx.title ? ` titled "${ctx.title}"` : '';
      const selBit = ctx.selection ? ` (with ${ctx.selection.text.length} chars of selection from ${ctx.selection.sourceUrl})` : '';
      const summary =
        `${SIM_TAG} 7u simulated reply to "${message.slice(0, 120)}" ` +
        `in the context of surface ${ctx.surfaceId} (${ctx.surfaceType})${titleBit}${selBit} — ` +
        `a live 7u would compose her own answer here`;
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary,
        detail: { message, surfaceId: ctx.surfaceId, surfaceType: ctx.surfaceType },
      };
    },
    async observe(ctx: SurfaceContext): Promise<AdapterResult> {
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary: `${SIM_TAG} 7u observe: surface ${ctx.surfaceId} (${ctx.surfaceType}) scanned — no live session exists to observe`,
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* search-slot — simulated search tool                                 */
/* ------------------------------------------------------------------ */

export function searchSlotAdapter(): ParticipantAdapter {
  return {
    adapterId: `adapter-search-${newId('sim')}`,
    participant: {
      participant_id: 'search-slot',
      kind: 'tool',
      name: 'Search slot',
      capabilities: ['discover', 'send', 'receive', 'observe'],
      surface_capabilities: ['web-search'],
      provenance: provenanceNote('adapters', 'Simulated search tool slot for v0.1 demos.'),
      continuity: { sessionIds: [] },
      simulated: true,
    },
    simulated: true,
    async send(_ctx: SurfaceContext, message: string): Promise<AdapterResult> {
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary: `${SIM_TAG} search-slot received query "${message.slice(0, 80)}" — no live search provider is wired`,
        detail: { query: message },
      };
    },
    async observe(ctx: SurfaceContext): Promise<AdapterResult> {
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary: `${SIM_TAG} search-slot observe: nothing indexed for surface ${ctx.surfaceId}`,
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* local-model-slot — simulated local model slot                       */
/* ------------------------------------------------------------------ */

export function localModelSlotAdapter(): ParticipantAdapter {
  return {
    adapterId: `adapter-localmodel-${newId('sim')}`,
    participant: {
      participant_id: 'local-model-slot',
      kind: 'local-model',
      name: 'Local model slot',
      capabilities: ['attach', 'send', 'receive', 'observe'],
      surface_capabilities: ['text-generation'],
      provenance: provenanceNote('adapters', 'Simulated local-model slot for v0.1 demos.'),
      continuity: { sessionIds: [] },
      simulated: true,
    },
    simulated: true,
    async attach(ctx: SurfaceContext): Promise<AdapterResult> {
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary: `${SIM_TAG} local-model-slot attach: would load context of surface ${ctx.surfaceId} (${ctx.surfaceType}) — no model is loaded`,
      };
    },
    async send(_ctx: SurfaceContext, message: string): Promise<AdapterResult> {
      return {
        ok: true,
        simulated: true,
        epistemic: 'SIMULATED',
        summary: `${SIM_TAG} local-model-slot reply stub to "${message.slice(0, 80)}" — no inference ran`,
        detail: { message },
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/* github-read — REAL public reads via api.github.com                  */
/* ------------------------------------------------------------------ */

const GITHUB_REPO_RE = /^https?:\/\/(www\.)?github\.com\/([^/]+)\/([^/#?]+)/i;

function parseGitHubRepo(url: string | undefined): { owner: string; repo: string } | null {
  if (!url) return null;
  const m = GITHUB_REPO_RE.exec(url.trim());
  if (!m) return null;
  const repo = m[3].replace(/\.git$/, '');
  return { owner: m[2], repo };
}

async function githubFetch(path: string): Promise<unknown> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'netscape-surface/0.1',
    },
  });
  if (res.status === 403 || res.status === 429) {
    throw new Error(`rate limited (HTTP ${res.status})`);
  }
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

export function githubReadAdapter(): ParticipantAdapter {
  return {
    adapterId: `adapter-github-${newId('live')}`,
    participant: {
      participant_id: 'github-read',
      kind: 'repository',
      name: 'GitHub public read',
      capabilities: ['discover', 'open', 'observe'],
      surface_capabilities: ['repo-read', 'commits-read', 'contents-read'],
      provenance: provenanceNote('adapters', 'Real adapter: public reads against api.github.com.'),
      continuity: { sessionIds: [] },
      simulated: false,
    },
    simulated: false,
    async observe(ctx: SurfaceContext): Promise<AdapterResult> {
      const parsed = parseGitHubRepo(ctx.url);
      if (!parsed) {
        return {
          ok: false,
          simulated: false,
          epistemic: 'OBSERVED',
          summary: `[observed] github-read: no parseable github.com owner/repo in context url "${ctx.url ?? '(none)'}"`,
        };
      }
      const { owner, repo } = parsed;
      try {
        const [info, contents, commits] = await Promise.allSettled([
          githubFetch(`/repos/${owner}/${repo}`),
          githubFetch(`/repos/${owner}/${repo}/contents/`),
          githubFetch(`/repos/${owner}/${repo}/commits?per_page=5`),
        ]);
        const lines: string[] = [];
        if (info.status === 'fulfilled') {
          const r = info.value as Record<string, unknown>;
          lines.push(`repo: ${r.full_name ?? `${owner}/${repo}`}${r.description ? ` — ${r.description}` : ''}`);
        } else {
          lines.push(`repo metadata: failed (${info.reason})`);
        }
        if (contents.status === 'fulfilled' && Array.isArray(contents.value)) {
          const names = (contents.value as Array<{ name?: string }>).slice(0, 12).map((e) => e.name ?? '?');
          lines.push(`root contents: ${names.join(', ')}`);
        } else {
          lines.push(`root contents: failed`);
        }
        if (commits.status === 'fulfilled' && Array.isArray(commits.value)) {
          const shas = (commits.value as Array<{ sha?: string }>).map((c) => (c.sha ?? '').slice(0, 7));
          lines.push(`latest commits: ${shas.join(', ')}`);
        } else {
          lines.push(`latest commits: failed`);
        }
        const allFailed = lines.every((l) => l.includes('failed'));
        return {
          ok: !allFailed,
          simulated: false,
          epistemic: 'OBSERVED',
          summary: `[observed] github-read ${owner}/${repo}: ${lines.join(' | ')}`,
          detail: { owner, repo },
        };
      } catch (err) {
        return {
          ok: false,
          simulated: false,
          epistemic: 'OBSERVED',
          summary: `[observed] github-read ${owner}/${repo} failed: ${(err as Error).message}`,
          detail: { owner, repo },
        };
      }
    },
  };
}

/** Every factory in this module, for observatory enumeration. */
export const ADAPTER_FACTORIES = {
  '7u': sevenUSimulatedAdapter,
  'search-slot': searchSlotAdapter,
  'local-model-slot': localModelSlotAdapter,
  'github-read': githubReadAdapter,
} as const;
