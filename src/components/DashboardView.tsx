/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, AIAgent, Product, Recommendation } from '../types';
import { 
  TrendingUp, 
  AlertTriangle, 
  Compass, 
  Smile, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  CheckCircle,
  XCircle,
  Info,
  Layers,
  Users,
  Briefcase,
  Lightbulb,
  FileText,
  BarChart3,
  HelpCircle,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  product: Product;
  recommendations: Recommendation[];
  agents: AIAgent[];
  feedbackCount: number;
  backlogCount: number;
  roadmapCount: number;
  experimentsCount: number;
  onActionClick: (target: Page, recId: string) => void;
}

export default function DashboardView({
  product,
  recommendations: initialRecommendations,
  agents,
  feedbackCount,
  backlogCount,
  roadmapCount,
  experimentsCount,
  onActionClick
}: DashboardViewProps) {
  
  // Local interactive states to show off strategic co-pilot capacity
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(true);

  const getAgentInfo = (agentId: string) => {
    return agents.find(a => a.id === agentId) || { name: 'ProductOS Agent', avatar: '🤖', title: 'Specialist' };
  };

  const handleApprove = (id: string, targetPage: Page) => {
    setApprovedIds(prev => [...prev, id]);
    setTimeout(() => {
      // Trigger navigation action click to guide recruiter
      onActionClick(targetPage, id);
    }, 1000);
  };

  const handleReject = (id: string) => {
    setRejectedIds(prev => [...prev, id]);
  };

  const handleToggleExplain = (id: string) => {
    setExplainingId(prev => prev === id ? null : id);
  };

  // Human-friendly recruiter metrics
  const valueMetrics = [
    { label: "Hours Saved This Week", value: "28 hrs", sub: "Based on AI Spec Generation", color: "text-violet-400" },
    { label: "AI Tasks Completed", value: "146", sub: "Grooming & Code Audits", color: "text-emerald-400" },
    { label: "Documents Generated", value: "43", sub: "20-Section PM Specs Ready", color: "text-sky-400" },
    { label: "Backlog Items Prioritized", value: "178", sub: "Dynamic RICE Slider Updates", color: "text-pink-400" },
    { label: "Customer Insights Clustered", value: "34", sub: "From Slack & Support Logs", color: "text-amber-400" },
    { label: "Product Decisions Advised", value: "27", sub: "High-Confidence AI Presets", color: "text-indigo-400" }
  ];

  return (
    <div id="dashboard-view" className="space-y-8 pb-12 animate-fade-in">
      
      {/* Landing Experience Header */}
      <div className="pb-8 border-b border-zinc-900/80 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-[9px] font-mono rounded-full font-bold border border-violet-500/20 tracking-wider">
              STRATEGIC OPERATING SYSTEM
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse"></span>
              Core Active
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/40 border border-zinc-800/80 rounded-full text-zinc-400 text-xs font-mono shadow-sm">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>{product.currentSprint}</span>
          </div>
        </div>

        <div className="space-y-3 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tight leading-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            ProductOS
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-zinc-300 leading-snug">
            The Autonomous Multi-Agent AI Product Operating System
          </p>
          <p className="text-zinc-400 text-sm max-w-4xl leading-relaxed">
            A team of specialized AI agents that automate product discovery, planning, prioritization, execution and analytics.
          </p>
        </div>

        {/* Visual Workflow Diagram */}
        <div className="pt-6 relative z-10">
          <h3 className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono font-bold mb-4">Core Agent Orchestration Loop</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-900/80 rounded-xl space-y-2 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-violet-400">STEP 01</span>
                <Sliders className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs font-bold text-zinc-200">Connect Tools</p>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">OAuth links with Jira, Slack, Notion, and Zoom transcripts.</p>
            </div>

            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-900/80 rounded-xl space-y-2 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-violet-400">STEP 02</span>
                <Compass className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs font-bold text-zinc-200">Analyze Feedback</p>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">InsightPilot clusters feedback; ResearchPilot maps SWOT gaps.</p>
            </div>

            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-900/80 rounded-xl space-y-2 hover:border-violet-500/30 hover:bg-zinc-900/40 transition-all duration-300 group shadow-md shadow-violet-950/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-violet-400">STEP 03</span>
                <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-zinc-200">Get AI Advices</p>
              <p className="text-[10px] text-zinc-400 leading-normal font-sans">StrategyPilot recalculates RICE scores dynamically.</p>
            </div>

            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-900/80 rounded-xl space-y-2 hover:border-zinc-800 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-violet-400">STEP 04</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <p className="text-xs font-bold text-zinc-200">Approve & Edit</p>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">Keep humans-in-the-loop to review and polish drafted specs.</p>
            </div>

            <div className="p-4 bg-zinc-900/20 backdrop-blur-sm border border-zinc-900/80 rounded-xl space-y-2 hover:border-emerald-500/20 hover:bg-zinc-900/40 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-400">STEP 05</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-xs font-bold text-zinc-200">Ship Faster</p>
              <p className="text-[10px] text-zinc-500 leading-normal font-sans">Bidirectional sync maps RICE values directly back to Jira.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter-Friendly Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {valueMetrics.map((met, idx) => (
          <div key={idx} className="p-4.5 rounded-xl bg-gradient-to-b from-zinc-900/40 to-zinc-900/10 border border-zinc-900 flex flex-col justify-between space-y-3 hover:border-zinc-800 hover:scale-[1.01] transition-all duration-200 shadow-sm shadow-black/20">
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold leading-none">{met.label}</p>
            <h3 className={`text-2xl font-display font-black tracking-tight ${met.color} leading-none`}>{met.value}</h3>
            <p className="text-[9px] text-zinc-500 leading-tight font-sans font-medium">{met.sub}</p>
          </div>
        ))}
      </div>

      {/* Product Tour Guide Checklist */}
      {showTour && (
        <div id="product-tour-checklist" className="p-6 rounded-2xl bg-gradient-to-tr from-violet-950/10 via-zinc-900/25 to-indigo-950/10 border border-violet-900/30 space-y-4 relative shadow-xl shadow-black/40">
          <button 
            onClick={() => setShowTour(false)}
            className="absolute top-4 right-4 text-[10px] font-mono uppercase text-zinc-500 hover:text-zinc-300 cursor-pointer font-bold transition-colors"
          >
            Dismiss Tour
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping"></div>
            <h3 className="font-display font-black text-xs text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Product Tour: 15-Second Interactive Sandbox Journey
            </h3>
          </div>
          
          <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
            Welcome! ProductOS operates as a fully simulated live sandbox. Click these structural checkpoints to jump into live agent dashboards and test the core interactive capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-2">
            <button 
              onClick={() => onActionClick(Page.Integrations, 'tour-1')}
              className="p-3.5 bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-900 hover:border-violet-500/30 rounded-xl text-left transition-all duration-200 cursor-pointer group hover:scale-[1.02] shadow-md shadow-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">DONE</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-zinc-200 mt-2 leading-snug group-hover:text-violet-400 transition-colors">1. Setup Jira Core</p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Integrated. Connected status active.</p>
            </button>

            <button 
              onClick={() => onActionClick(Page.Integrations, 'tour-2')}
              className="p-3.5 bg-zinc-950/60 hover:bg-zinc-950 border border-zinc-900 hover:border-violet-500/30 rounded-xl text-left transition-all duration-200 cursor-pointer group hover:scale-[1.02] shadow-md shadow-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">DONE</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-bold text-zinc-200 mt-2 leading-snug group-hover:text-violet-400 transition-colors">2. Slack Ingestion</p>
              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">Connected. Direct channels synchronized.</p>
            </button>

            <button 
              onClick={() => onActionClick(Page.Workspace, 'tour-3')}
              className="p-3.5 bg-zinc-950/60 hover:bg-zinc-950 border border-violet-800/40 hover:border-violet-500 rounded-xl text-left transition-all duration-200 cursor-pointer group hover:scale-[1.02] shadow-md shadow-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20 animate-pulse">TRY IT</span>
                <Play className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-xs font-bold text-zinc-200 mt-2 leading-snug group-hover:text-violet-400 transition-colors">3. PRD Builder</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Draft specs, review compliance parameters.</p>
            </button>

            <button 
              onClick={() => onActionClick(Page.Roadmap, 'tour-4')}
              className="p-3.5 bg-zinc-950/60 hover:bg-zinc-950 border border-violet-800/40 hover:border-violet-500 rounded-xl text-left transition-all duration-200 cursor-pointer group hover:scale-[1.02] shadow-md shadow-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">TRY IT</span>
                <Play className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-xs font-bold text-zinc-200 mt-2 leading-snug group-hover:text-violet-400 transition-colors">4. Roadmap Board</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">View quarterly targets and dependencies.</p>
            </button>

            <button 
              onClick={() => {
                const element = document.getElementById('dashboard-recommendations-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3.5 bg-zinc-950/60 hover:bg-zinc-950 border border-violet-800/40 hover:border-violet-500 rounded-xl text-left transition-all duration-200 cursor-pointer group hover:scale-[1.02] shadow-md shadow-black/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">TRY IT</span>
                <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <p className="text-xs font-bold text-zinc-200 mt-2 leading-snug group-hover:text-violet-400 transition-colors">5. AI Suggestions</p>
              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Approve advice cards below to merge tickets.</p>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Recommendations & Customer Signals */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Today's AI Recommendations */}
          <div id="dashboard-recommendations-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-violet-400" />
                <h2 className="font-display font-bold text-base text-white">Today's AI Recommendations</h2>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">HUMAN-IN-THE-LOOP STRATEGIC GATEWAY</span>
            </div>

            <div className="space-y-3">
              {recommendations.filter(r => !rejectedIds.includes(r.id)).length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/10 text-center text-zinc-500 text-xs font-mono">
                  No pending recommendations. Strategic backlog is fully optimized.
                </div>
              ) : (
                recommendations
                  .filter(rec => !rejectedIds.includes(rec.id))
                  .map((rec) => {
                    const agent = getAgentInfo(rec.agentId);
                    const isApproved = approvedIds.includes(rec.id);
                    const isExplaining = explainingId === rec.id;
                    
                    return (
                      <div 
                        id={`rec-card-${rec.id}`}
                        key={rec.id} 
                        className={`p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 space-y-4 shadow-md ${
                          isApproved 
                            ? 'bg-zinc-900/40 border-emerald-500/25 opacity-75' 
                            : 'bg-zinc-900/25 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/35 hover:scale-[1.005] hover:shadow-lg hover:shadow-violet-950/5'
                        }`}
                      >
                        {/* Upper line: Agent Meta & Confidence */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900/60 pb-3.5">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl bg-zinc-900/80 p-1.5 rounded-xl border border-zinc-800 shadow-inner">{agent.avatar}</span>
                            <div>
                              <p className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                                {agent.name}
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                              </p>
                              <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">{agent.title}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-[10px] font-mono rounded-lg font-bold border border-violet-500/15">
                              IMPACT: {rec.impactScore}/100
                            </span>
                            <span className="px-2.5 py-1 bg-zinc-950 text-zinc-400 text-[10px] font-mono rounded-lg font-bold border border-zinc-900">
                              CONFIDENCE: 92%
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-bold text-zinc-100 tracking-tight">{rec.title}</h4>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rec.description}</p>
                        </div>

                        {/* Expanded Explanation text */}
                        {isExplaining && (
                          <div className="p-4 bg-violet-950/10 rounded-xl border border-violet-900/20 text-xs text-zinc-300 leading-relaxed font-sans space-y-2 animate-fade-in shadow-inner">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-violet-400 font-bold flex items-center gap-1.5">
                              <Info className="w-4 h-4 text-violet-400" /> AGENT STRATEGIC RATIONALE
                            </p>
                            <p className="text-zinc-400">
                              Our correlation model identified this item from <strong>Sarah Jenkins (Product Director, Acme Logistics)</strong>. Failing to act risks losing contract retention by up to 15%. This advice ensures engineering has correct story mapping with no manual transcription effort.
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={() => handleToggleExplain(rec.id)}
                            className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {isExplaining ? 'Hide Reasoning' : 'Explain Decision Rationale'}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleReject(rec.id)}
                              disabled={isApproved}
                              className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-850 text-zinc-400 hover:text-zinc-200 text-xs font-semibold rounded-lg cursor-pointer transition-all disabled:opacity-20"
                            >
                              Reject Advice
                            </button>

                            <button
                              onClick={() => handleApprove(rec.id, rec.targetPage)}
                              disabled={isApproved}
                              className={`px-4 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                isApproved 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/25' 
                                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/10'
                              }`}
                            >
                              {isApproved ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Applied</span>
                                </>
                              ) : (
                                <>
                                  <span>{rec.actionLabel}</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Customer Signals */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-zinc-300 uppercase tracking-wider font-mono">Live Customer Signals</h3>
              <button 
                onClick={() => onActionClick(Page.CustomerInsights, 'signals')}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
              >
                Injest Pipeline →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                  <span>ZOOM INTERVIEW • MEDITATIONSPACE</span>
                  <span className="text-emerald-400">POSSITIVE (90%)</span>
                </div>
                <p className="text-xs text-zinc-300 italic">
                  "...If we could automatically turn a Slack thread into a well-defined user story, it would save me 10 hours a week..."
                </p>
                <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Source: Marcus Aurelius</span>
                  <span className="text-violet-400 font-bold">Feature desire: Slack spec maker</span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/20 border border-zinc-900 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                  <span>SLACK #PARTNER-FEEDBACK • ACME LOGISTICS</span>
                  <span className="text-zinc-400">NEUTRAL (65%)</span>
                </div>
                <p className="text-xs text-zinc-300 italic">
                  "...loving the prioritizer, but we cannot sync custom RICE scores back to our corporate Jira boards..."
                </p>
                <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>Source: Sarah Jenkins</span>
                  <span className="text-violet-400 font-bold">Feature desire: RICE Jira Syncer</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Roadmap Risks, Opportunities & Generated Specs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Roadmap Risks & Delivery Blockers */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-4">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <ShieldAlert className="w-4 h-4 text-violet-400" />
              <h3 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-wider font-mono">
                Roadmap Risks & Blockers
              </h3>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-400">
                  <span>DUPLICATE RISK (HIGH)</span>
                  <span>EngPilot</span>
                </div>
                <p className="text-zinc-200 font-semibold">Overlapping Jira issues</p>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  PILOT-202 overlaps **85%** with PILOT-201. Merging suggested immediately.
                </p>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-900/30 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-400">
                  <span>DEPENDENCY DELAY (MEDIUM)</span>
                  <span>MapPilot</span>
                </div>
                <p className="text-zinc-200 font-semibold">Slack app directory approval</p>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  "Slack App Ingest Engine" depends on Slack security review (estimated 14-day turnaround).
                </p>
              </div>
            </div>
          </div>

          {/* Feature Opportunities */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-3">
            <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-wider font-mono">
              AI Feature Opportunities
            </h4>
            
            <div className="space-y-2.5">
              <div className="p-2.5 bg-zinc-950/50 border border-zinc-900 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Slack Spec Maker</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Estimated ARR impact: **+15%**</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">94% Feasibility</span>
              </div>

              <div className="p-2.5 bg-zinc-950/50 border border-zinc-900 rounded-lg text-xs flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">RICE Custom Jira Sync</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Estimated ARR impact: **+22%**</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">89% Feasibility</span>
              </div>
            </div>
          </div>

          {/* Recently Generated Documents */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-3">
            <h4 className="font-display font-bold text-xs text-zinc-300 uppercase tracking-wider font-mono">
              Workspace Specifications
            </h4>
            
            <div className="space-y-2">
              <button 
                onClick={() => onActionClick(Page.Workspace, 'spec-1')}
                className="w-full text-left p-2.5 bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-lg text-xs flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  <span className="text-zinc-300 font-medium truncate leading-tight">Slack-to-PRD Blueprint</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">Analyzed</span>
              </button>

              <button 
                onClick={() => onActionClick(Page.Workspace, 'spec-2')}
                className="w-full text-left p-2.5 bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-lg text-xs flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-zinc-500 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  <span className="text-zinc-300 font-medium truncate leading-tight">Custom RICE Sync spec</span>
                </div>
                <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">Draft</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
