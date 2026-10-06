/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MetricPoint } from '../types';
import { 
  BarChart3, 
  Sparkles, 
  Search, 
  TrendingUp, 
  ArrowRight,
  RefreshCw,
  TrendingDown,
  Activity,
  Heart
} from 'lucide-react';

interface AnalyticsViewProps {
  activationPoints: MetricPoint[];
  churnPoints: MetricPoint[];
  retentionPoints: MetricPoint[];
}

export default function AnalyticsView({
  activationPoints,
  churnPoints,
  retentionPoints
}: AnalyticsViewProps) {
  const [queryText, setQueryText] = useState<string>('');
  const [activeAnalysis, setActiveAnalysis] = useState<'welcome' | 'activation' | 'churn' | 'retention'>('welcome');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);

  const handleRunQuery = (type: 'activation' | 'churn' | 'retention') => {
    setIsQuerying(true);
    setTimeout(() => {
      setActiveAnalysis(type);
      setIsQuerying(false);
    }, 1000);
  };

  const handleCustomSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    const lower = queryText.toLowerCase();
    if (lower.includes('activation') || lower.includes('decrease') || lower.includes('drop')) {
      handleRunQuery('activation');
    } else if (lower.includes('churn') || lower.includes('leave') || lower.includes('lose')) {
      handleRunQuery('churn');
    } else if (lower.includes('retention') || lower.includes('feature') || lower.includes('drive')) {
      handleRunQuery('retention');
    } else {
      // Fallback
      handleRunQuery('retention');
    }
  };

  return (
    <div id="analytics-agent-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
              BEHAVIORAL SEMANTICS DECRYPTOR
            </span>
            <span className="text-zinc-600 font-mono text-xs">• MetricPilot online</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
            Analytics Agent (MetricPilot)
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5 max-w-2xl">
            Query product metrics using standard plain language. The agent translates questions into visual charts, correlates behavioral variables, and recommends strategic execution next steps.
          </p>
        </div>

        {/* Explaining agent card */}
        <div className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg max-w-xs md:self-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Agent Spec & Action</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-normal font-sans">
            <strong>Action</strong>: Ask: *"Why did activation decrease?"* below or click one of the quick suggestions.
          </p>
        </div>
      </div>

      {/* Query Search Bar */}
      <form onSubmit={handleCustomSearchSubmit} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-xl relative">
        <div className="flex items-center gap-3">
          <Search className="w-4.5 h-4.5 text-zinc-500 absolute left-8" />
          <input
            id="analytics-search-input"
            type="text"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Ask MetricPilot: e.g. 'Why did activation decrease?' or 'What features drive retention?'"
            className="w-full pl-11 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 placeholder-zinc-500 transition-colors"
          />
          <button
            id="analytics-query-btn"
            type="submit"
            disabled={isQuerying}
            className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isQuerying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Query Metrics</span>
            )}
          </button>
        </div>

        {/* Quick Suggest Buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-500">
          <span className="font-bold">SUGGESTIONS:</span>
          <button 
            id="query-suggest-activation"
            type="button" 
            onClick={() => handleRunQuery('activation')} 
            className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 rounded-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            "Why did activation decrease?"
          </button>
          <button 
            id="query-suggest-churn"
            type="button" 
            onClick={() => handleRunQuery('churn')} 
            className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 rounded-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            "What caused churn last month?"
          </button>
          <button 
            id="query-suggest-retention"
            type="button" 
            onClick={() => handleRunQuery('retention')} 
            className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 rounded-full text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            "What features drive retention?"
          </button>
        </div>
      </form>

      {/* Chart Output Stage */}
      <div className="p-6 rounded-xl bg-zinc-900/20 border border-zinc-900 min-h-[360px] flex flex-col justify-between">
        {isQuerying ? (
          /* Loading states */
          <div className="m-auto text-center space-y-3 py-12">
            <RefreshCw className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
            <p className="text-xs text-zinc-500 font-mono">MetricPilot querying PostHog & Spanner databases...</p>
          </div>
        ) : activeAnalysis === 'welcome' ? (
          /* Welcome default view */
          <div className="m-auto text-center space-y-3 py-12">
            <BarChart3 className="w-10 h-10 text-zinc-700 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-display font-semibold text-zinc-300 text-sm">Analytics Workspace Ready</h4>
              <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                Click a query suggestion or type in the search bar above to generate interactive performance breakdowns.
              </p>
            </div>
          </div>
        ) : activeAnalysis === 'activation' ? (
          /* Activation Rate decrease chart & report */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-400" />
                <h3 className="font-display font-bold text-sm text-zinc-200">Onboarding Activation Trend Analysis</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">CORRELATION: HIGH WEBHOOK LATENCY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Custom SVG Line-Bar Chart */}
              <div className="md:col-span-7 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900 flex flex-col justify-between h-64">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">Activation rate (%) over time</p>
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {activationPoints.map((pt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-12 group">
                      <div className="relative w-full flex items-end justify-center h-28">
                        {/* Interactive percentage tooltip */}
                        <span className="absolute -top-6 text-[9px] font-mono font-bold text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800">
                          {pt.value}%
                        </span>
                        <div 
                          className={`w-4 rounded-t-sm transition-all duration-300 ${
                            pt.date.includes('Apr') 
                              ? 'bg-rose-500/80 shadow-sm shadow-rose-500/20' 
                              : 'bg-violet-600/80 group-hover:bg-violet-500'
                          }`} 
                          style={{ height: `${pt.value}%` }}
                        ></div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">{pt.date.replace(' 2026', '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulleted Insights Report */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold">MetricPilot Findings</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed font-sans">
                    <li className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span><strong>April Drop (50%)</strong>: Caused directly by an auth bottleneck in the Slack App token handshake. PMs experienced a 45-second latency before their workspace ingested, triggering early drop-offs.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span><strong>June Recovery (65%)</strong>: Attributable to the release of the "One-Click Instant Integration" banner on the home cockpit dashboard.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Reasoning & Recommended Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-900/60 font-sans">
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg space-y-1">
                <span className="text-[9px] font-mono font-bold text-violet-400 uppercase tracking-wider block">CAUSAL REASONING</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  The primary friction bottleneck in the activation funnel is external tool auth latencies. When users try to sync historical Slack thread databases, Node.js spends excessive resources matching un-indexed message strings. This creates an un-acceptable UI freeze.
                </p>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">RECOMMENDED ACTION</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Paginate Slack thread downloads and pre-fetch channel indices. Deploy the Auth Handshake Latency Optimization patch to unblock Month 1 conversion immediately.
                  </p>
                </div>
                <button className="mt-3 w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded transition-colors cursor-pointer">
                  Approve Latency Patch (DocPilot-202)
                </button>
              </div>
            </div>
          </div>
        ) : activeAnalysis === 'churn' ? (
          /* Churn month-by-month chart & report */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="font-display font-bold text-sm text-zinc-200">User Churn Rate Analysis</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">CORRELATION: RICE SLIDERS ENGAGEMENT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Custom SVG Line-Bar Chart */}
              <div className="md:col-span-7 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900 flex flex-col justify-between h-64">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">Monthly Churn rate (%)</p>
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {churnPoints.map((pt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-12 group">
                      <div className="relative w-full flex items-end justify-center h-28">
                        <span className="absolute -top-6 text-[9px] font-mono font-bold text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800">
                          {pt.value}%
                        </span>
                        <div 
                          className="w-4 bg-pink-600/80 group-hover:bg-pink-500 rounded-t-sm transition-all" 
                          style={{ height: `${pt.value * 20}%` }} // Multiply to scale up visually
                        ></div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">{pt.date.replace(' 2026', '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulleted Insights Report */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold">MetricPilot Findings</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed font-sans">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span><strong>Constant Churn Decay</strong>: Churn rates fell steadily from **4.8% in January** to **3.1% in June**. This represents a massive win for product stickiness.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-indigo-400 font-bold mt-0.5">•</span>
                      <span><strong>Core Cause</strong>: PMs who successfully aligned their Jira tickets using RICE prioritization remained 3x more active in Month 2 than single-draft users.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Feature Retention causation funnel */
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-400" />
                <h3 className="font-display font-bold text-sm text-zinc-200">Features Driving Customer Retention</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">CORRELATION: CO-PILOT INTEGRITY</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Custom SVG Line-Bar Chart */}
              <div className="md:col-span-7 bg-zinc-950/60 p-4 rounded-lg border border-zinc-900 flex flex-col justify-between h-64">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wide">User retention funnel (%)</p>
                <div className="flex items-end justify-between h-40 pt-4 px-2">
                  {retentionPoints.map((pt, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 w-12 group">
                      <div className="relative w-full flex items-end justify-center h-28">
                        <span className="absolute -top-6 text-[9px] font-mono font-bold text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 px-1 py-0.2 rounded border border-zinc-800">
                          {pt.value}%
                        </span>
                        <div 
                          className="w-4 bg-emerald-600/80 group-hover:bg-emerald-500 rounded-t-sm transition-all" 
                          style={{ height: `${pt.value}%` }} 
                        ></div>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500">{pt.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bulleted Insights Report */}
              <div className="md:col-span-5 space-y-4">
                <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold">MetricPilot Findings</h4>
                  </div>
                  <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed font-sans">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      <span><strong>Weekly Active Editors (Week 12 - 64%)</strong>: Our retention curve flattens comfortably at 64%, exceeding standard B2B PM software benchmarks (35%).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-violet-400 font-bold mt-0.5">•</span>
                      <span><strong>Integration Correlation</strong>: Connecting Slack thread ingestion + Jira sync drives a massive **+115% increase** in relative 12-week retention rates.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Reasoning & Recommended Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-900/60 font-sans">
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg space-y-1">
                <span className="text-[9px] font-mono font-bold text-violet-400 uppercase tracking-wider block">CAUSAL REASONING</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Multi-agent integrations drive collaborative lock-in. When a PM integrates Slack pain points to generate PRDs, engineers get referenced context, making ProductOS the single, high-retention source of truth for all specifications.
                </p>
              </div>
              <div className="p-4 bg-zinc-950/60 border border-zinc-900 rounded-lg flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">RECOMMENDED ACTION</span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Prioritise and release the upcoming HubSpot CRM and Zendesk sentiment webhooks to capture customer support signals automatically, widening the retention loop.
                  </p>
                </div>
                <button className="mt-3 w-full py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded transition-colors cursor-pointer">
                  Activate HubSpot Connector Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
