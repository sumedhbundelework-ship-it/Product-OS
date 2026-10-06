/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  Search, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Users,
  Target,
  FileText,
  Bookmark,
  CheckCircle,
  Cpu
} from 'lucide-react';

export default function ResearchAgentView() {
  const [activeTab, setActiveTab] = useState<'competitors' | 'personas' | 'ideator'>('competitors');
  const [competitorQuery, setCompetitorQuery] = useState<string>('Linear');
  const [ideationConcept, setIdeationConcept] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [ideationList, setIdeationList] = useState<Array<{ id: string; title: string; desc: string; score: number }>>([
    { id: '1', title: 'Automated Slack Channel Ingestion Hook', desc: 'Allows direct right-click conversion of chat threads into actionable PRDs.', score: 94 },
    { id: '2', title: 'Dynamic Custom RICE Matrix Configurator', desc: 'Customizable slider coefficients and weights that map directly back to Jira issue fields.', score: 89 },
    { id: '3', title: 'SQL Dialect Migration Rollback Optimizer', desc: 'Automatically provides postgres/spanner sequences for experimental rollbacks.', score: 75 }
  ]);

  const handleRunCompetitorAudit = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleGenerateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideationConcept.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIdeationList(prev => [
        {
          id: `idea-${Date.now()}`,
          title: ideationConcept,
          desc: `AI-Generated Idea: A specialized multi-agent workflow optimizing "${ideationConcept}" with direct feedback loop capabilities.`,
          score: Math.floor(Math.random() * 25) + 75
        },
        ...prev
      ]);
      setIdeationConcept('');
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div id="research-agent-view" className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-zinc-900/85">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-[9px] font-mono rounded-lg font-bold tracking-wider border border-violet-500/15 uppercase">
              DISCOVERY & COMPETITIVE INTEL
            </span>
            <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ResearchPilot listening
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">
            Research Agent
          </h2>
          <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed font-sans">
            Conduct market competitive audits, model detailed user personas, and draft early feature concepts with immediate strategic validation.
          </p>
        </div>

        {/* Explain first header badge */}
        <div className="p-4 bg-violet-950/10 border border-violet-900/20 rounded-xl max-w-xs md:self-center shadow-md shadow-violet-950/5">
          <div className="flex items-center gap-2 text-zinc-300">
            <Cpu className="w-4 h-4 text-violet-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Agent Spec</span>
          </div>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
            <strong>Action Example</strong>: Paste a competitor feature log to map ProductOS capability gap matrices automatically.
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-900/60 pb-px gap-1">
        <button
          onClick={() => setActiveTab('competitors')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'competitors' 
              ? 'border-violet-500 text-zinc-100 bg-violet-950/10' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Competitive Delta Audit
        </button>
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'personas' 
              ? 'border-violet-500 text-zinc-100 bg-violet-950/10' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Persona & JTBD Models
        </button>
        <button
          onClick={() => setActiveTab('ideator')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ideator' 
              ? 'border-violet-500 text-zinc-100 bg-violet-950/10' 
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Feature Ideation Playground
        </button>
      </div>

      {/* Content Canvas */}
      <div className="min-h-[400px]">
        {activeTab === 'competitors' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Config Box */}
              <div className="lg:col-span-4 p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900 space-y-5">
                <div>
                  <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">Audit Target Competitor</h3>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">Select a core competitor to run SWOT and feature overlap simulations.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">Select Competitor</label>
                    <select
                      value={competitorQuery}
                      onChange={(e) => setCompetitorQuery(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 hover:border-zinc-800 transition-colors cursor-pointer"
                    >
                      <option value="Linear">Linear (Issue Tracking)</option>
                      <option value="Notion">Notion (Workspace Documents)</option>
                      <option value="Atlassian Jira">Atlassian Jira (Enterprise PM)</option>
                      <option value="Monday.com">Monday.com (Work Management)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleRunCompetitorAudit}
                    disabled={isAnalyzing}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <Compass className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning market...</span>
                      </>
                    ) : (
                      <span>Simulate Capability Delta</span>
                    )}
                  </button>
                </div>

                <div className="pt-4 border-t border-zinc-900/80 space-y-2">
                  <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-mono">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold uppercase tracking-wider text-zinc-400">MARKET ACCELERATION GAP</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    Comparing ProductOS with traditional competitors demonstrates a <strong className="text-zinc-200">20x speedup</strong> in PM-to-Jira specification turnaround times.
                  </p>
                </div>
              </div>

              {/* Right Output Area */}
              <div className="lg:col-span-8 space-y-4">
                {isAnalyzing ? (
                  <div className="h-64 rounded-xl border border-zinc-900 bg-zinc-900/10 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Cpu className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
                      <p className="text-xs text-zinc-500 font-mono">ResearchPilot running comparative SWOT analysis models...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* SWOT analysis */}
                    <div className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900 space-y-5">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                        <h4 className="text-xs font-bold text-violet-400 uppercase tracking-widest font-mono">SWOT Analysis vs {competitorQuery}</h4>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded-md font-mono font-bold">STABILITY CONFIDENCE: 94%</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-950/40 border border-zinc-900/80 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono font-bold text-emerald-400 tracking-wider bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">STRENGTHS (ProductOS)</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                            Direct automated feedback compilation loop; native full-fidelity 20-section PRD drafts in under 12 seconds; bidirectional Jira sync.
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950/40 border border-zinc-900/80 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono font-bold text-rose-400 tracking-wider bg-rose-500/5 px-2 py-0.5 border border-rose-500/10 rounded">WEAKNESSES</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                            Smaller custom integration roster than {competitorQuery}'s expansive multi-year marketplace catalogs.
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950/40 border border-zinc-900/80 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono font-bold text-violet-400 tracking-wider bg-violet-500/5 px-2 py-0.5 border border-violet-500/10 rounded">OPPORTUNITIES</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                            Displace manual PM spreadsheet prioritizing tasks entirely by deploying automated RICE slider recalculations.
                          </p>
                        </div>
                        <div className="p-4 bg-zinc-950/40 border border-zinc-900/80 rounded-xl space-y-2">
                          <span className="text-[9px] font-mono font-bold text-amber-400 tracking-wider bg-amber-500/5 px-2 py-0.5 border border-amber-500/10 rounded">THREATS</span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans pt-1">
                            Traditional players adding simple chat co-pilots or static text summary features to confuse buyers.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Capability comparison */}
                    <div className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900 space-y-4">
                      <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">Capability Matrix Gaps</h4>
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-900/40">
                          <span className="text-zinc-400 font-sans">Slack-to-PRD Conversion</span>
                          <span className="text-emerald-400 font-mono font-bold">ProductOS Native <span className="text-emerald-500/80">(✓)</span> vs {competitorQuery} <span className="text-zinc-500">(Manual)</span></span>
                        </div>
                        <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-900/40">
                          <span className="text-zinc-400 font-sans">Bi-directional Custom Field RICE Sync</span>
                          <span className="text-emerald-400 font-mono font-bold">ProductOS Native <span className="text-emerald-500/80">(✓)</span> vs {competitorQuery} <span className="text-zinc-500">(None)</span></span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-zinc-400 font-sans">AI Sizing & Duplicate Grooming</span>
                          <span className="text-emerald-400 font-mono font-bold">ProductOS Native <span className="text-emerald-500/80">(✓)</span> vs {competitorQuery} <span className="text-zinc-500">(None)</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'personas' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Persona 1 */}
              <div className="p-6 bg-zinc-900/15 border border-zinc-900/80 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group hover:border-zinc-850 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-violet-500/30"></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl filter drop-shadow">👔</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 tracking-tight">Sumedh Bundele</h4>
                    <p className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider mt-0.5">SENIOR PRODUCT MANAGER</p>
                  </div>
                </div>
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">Pain Point</strong>: Overloaded with manual spec drafting and feedback aggregation Sunday nights.
                  </p>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">JTBD</strong>: When a raw Slack feedback thread emerges, instantly compile a high-fidelity PRD to groom sprints.
                  </p>
                </div>
              </div>

              {/* Persona 2 */}
              <div className="p-6 bg-zinc-900/15 border border-zinc-900/80 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group hover:border-zinc-850 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/30"></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl filter drop-shadow">👩‍💻</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 tracking-tight">Sarah Jenkins</h4>
                    <p className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider mt-0.5">PRODUCT DIRECTOR</p>
                  </div>
                </div>
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">Pain Point</strong>: RICE scores created in spreadsheets get lost and are not visible inside Jira.
                  </p>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">JTBD</strong>: Propagate roadmap priorities and strategic weights seamlessly to developer queues to maximize team value.
                  </p>
                </div>
              </div>

              {/* Persona 3 */}
              <div className="p-6 bg-zinc-900/15 border border-zinc-900/80 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group hover:border-zinc-850 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/30"></div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl filter drop-shadow">🛠️</span>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 tracking-tight">Sanjay Krish</h4>
                    <p className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider mt-0.5">LEAD SOFTWARE ARCHITECT</p>
                  </div>
                </div>
                <div className="space-y-3 pt-1">
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">Pain Point</strong>: Duplicate requirements across Jira, ambiguous acceptance criteria, generic rollback plans.
                  </p>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    <strong className="text-zinc-300 font-semibold">JTBD</strong>: Ensure clear technical boundaries, code-level risk logs, and precise SQL rollback triggers are defined on feature delivery.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'ideator' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Input ideator */}
              <div className="lg:col-span-5">
                <form onSubmit={handleGenerateIdea} className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-widest">Concept Ideation Engine</h3>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">Input a rough feature concept. ResearchPilot will draft high-fidelity goals and strategic priority projections.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold tracking-wider">Rough Concept Pitch</label>
                      <textarea
                        required
                        rows={4}
                        value={ideationConcept}
                        onChange={(e) => setIdeationConcept(e.target.value)}
                        placeholder="e.g. Automatically generate Figma design layouts from analyzed PRD specifications."
                        className="w-full px-3 py-2 bg-zinc-950 border border-zinc-900 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 hover:border-zinc-800 transition-colors font-sans leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAnalyzing}
                      className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <>
                          <Compass className="w-3.5 h-3.5 animate-spin" />
                          <span>Generating concept...</span>
                        </>
                      ) : (
                        <span>Generate AI Discovery Concept</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Side: Saved concepts feed */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">Generated Discovery Concepts</h4>
                
                <div className="space-y-3">
                  {ideationList.map((idea) => (
                    <div key={idea.id} className="p-4 bg-zinc-900/15 border border-zinc-900 rounded-xl space-y-3 shadow-inner">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-zinc-200 leading-snug">{idea.title}</span>
                        <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-[9px] font-mono rounded-lg border border-violet-500/15 font-bold whitespace-nowrap">
                          FEASIBILITY: {idea.score}%
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        {idea.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
