/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PullRequest } from '../types';
import { 
  FileText, 
  Sparkles, 
  Github, 
  Check, 
  Copy, 
  RefreshCw,
  GitMerge,
  Megaphone,
  BookOpen
} from 'lucide-react';

interface ReleaseNotesViewProps {
  pullRequests: PullRequest[];
}

export default function ReleaseNotesView({ pullRequests }: ReleaseNotesViewProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [changelog, setChangelog] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<boolean>(false);

  const triggerChangelogGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const compiledNote = `# Release Notes: ProductOS Platform v1.2.0 (June 2026)

## 📢 Product Announcements & Customer Spotlight
We are thrilled to ship major updates connecting strategic product alignment directly with active engineering backlogs!
- **Interactive RICE Sliders**: PMs can now adjust Reach, Impact, Confidence, and Effort weights inline with instant animated backlog re-sorting.
- **Fast-Pass Slack Ingestion**: Seamlessly connect your Slack channels. Highlight any thread and type \`/productos-draft\` to compile raw transcript logs into rich PRDs.
- **Performance Indexing**: Ingestion queues are now 20x faster (average latency decreased from 800ms to 42ms) unblocking continuous high-frequency workspace loads.

## 🛠️ Technical Changelog (Internal Repo logs)
- **Repo: \`productos-core-frontend\`**
  - Compiled and packaged physics-based RICE slider inputs under React context hooks.
  - Implemented debounced state saves (500ms limit) to prevent redundant database writes.
- **Repo: \`productos-core-backend\`**
  - Optimised Postgres Spanner composite keys indexing on feedback lists.
- **Repo: \`productos-integrations-gateway\`**
  - Configured raw webhook listener gateways to parse Slack payload blocks safely.
`;
      setChangelog(compiledNote);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (!changelog) return;
    navigator.clipboard.writeText(changelog);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div id="release-notes-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
              REPOS COMMIT HARVESTER
            </span>
            <span className="text-zinc-600 font-mono text-xs">• DocPilot drafting</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
            AI Automated Release Notes Agent
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            The agent continuously listens to your GitHub Pull Request merges and auto-compiles customer changelogs and internal technical summaries.
          </p>
        </div>

        <button
          id="compile-changelog-btn"
          onClick={triggerChangelogGeneration}
          disabled={isGenerating}
          className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center gap-1.5 cursor-pointer font-sans disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing git history...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compile Release Changelog</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: Raw PR Merges vs Compiled output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Merged PRs backlog */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-3">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">GitHub Branch Merge Logs</h3>
            </div>
            
            <div className="space-y-3">
              {pullRequests.map((pr) => (
                <div key={pr.id} className="p-3 rounded-lg bg-zinc-950 border border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase truncate max-w-[120px]">{pr.repo}</span>
                    <span className={`text-[8px] font-mono font-bold px-1 rounded uppercase ${
                      pr.impactScope === 'Major' 
                        ? 'bg-rose-950/40 text-rose-400 border border-rose-900/40' 
                        : pr.impactScope === 'Minor' 
                          ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/40' 
                          : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {pr.impactScope} Impact
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-zinc-200 flex items-start gap-1 leading-snug">
                    <GitMerge className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5" />
                    <span>{pr.title}</span>
                  </h4>

                  <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                    {pr.details}
                  </p>

                  <div className="pt-1 flex justify-between text-[9px] text-zinc-600 font-mono font-bold border-t border-zinc-900/60">
                    <span>Merged by @{pr.author}</span>
                    <span>{pr.mergedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Generated changelog text */}
        <div className="lg:col-span-7">
          {changelog ? (
            /* Compiled changelog */
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <div className="flex items-center gap-1.5 text-violet-400">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-[10px] font-mono font-bold uppercase">DRAFT COMPILED SUCCESSFULLY</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    id="copy-changelog-btn"
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-zinc-800 rounded border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1.5 cursor-pointer font-sans"
                    title="Copy Markdown"
                  >
                    {copyStatus ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Markdown</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Formatted Markdown viewer */}
              <div id="compiled-markdown-preview" className="h-[420px] overflow-y-auto text-xs text-zinc-300 font-sans leading-relaxed pr-1 space-y-4 bg-zinc-950 p-4 rounded-lg border border-zinc-900/80">
                {changelog.split('\n').map((line, idx) => {
                  if (line.startsWith('# ')) {
                    return <h3 key={idx} className="font-display font-bold text-lg text-white mt-4 border-b border-zinc-900 pb-1">{line.replace('# ', '')}</h3>;
                  }
                  if (line.startsWith('## 📢') || line.startsWith('## 📢 ')) {
                    return (
                      <div key={idx} className="flex items-center gap-2 text-violet-400 border-l-2 border-violet-500 pl-2 mt-4 font-display font-semibold text-sm">
                        <Megaphone className="w-4 h-4 text-violet-400" />
                        <span>{line.replace('## 📢 ', '').replace('## 📢', '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('## 🛠️') || line.startsWith('## 🛠️ ')) {
                    return (
                      <div key={idx} className="flex items-center gap-2 text-indigo-400 border-l-2 border-indigo-500 pl-2 mt-6 font-display font-semibold text-sm">
                        <BookOpen className="w-4 h-4 text-indigo-400" />
                        <span>{line.replace('## 🛠️ ', '').replace('## 🛠️', '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('- **')) {
                    const clean = line.replace('- **', '').replace('**', '');
                    const [head, body] = clean.split(': ');
                    return (
                      <div key={idx} className="pl-3 mt-2">
                        <strong className="text-zinc-200">{head}:</strong> <span className="text-zinc-400">{body}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('  - ')) {
                    return (
                      <div key={idx} className="pl-6 text-[11px] text-zinc-500 font-mono mt-1">
                        • {line.replace('  - ', '')}
                      </div>
                    );
                  }
                  return <p key={idx} className="mt-1">{line}</p>;
                })}
              </div>

            </div>
          ) : (
            <div className="h-full min-h-[300px] rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 flex flex-col justify-center items-center text-center p-6 space-y-4">
              <Sparkles className="w-8 h-8 text-zinc-700 animate-pulse" />
              <div>
                <h4 className="font-display font-semibold text-zinc-300 text-sm">Changelog Draft Awaiting Compile</h4>
                <p className="text-zinc-500 text-xs max-w-sm mt-1 leading-relaxed">
                  Click the **"Compile Release Changelog"** button above to instruct DocPilot to parse all active repository PRs and draft release outputs.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
