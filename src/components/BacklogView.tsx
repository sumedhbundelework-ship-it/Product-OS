/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BacklogItem, Product } from '../types';
import { 
  ListTodo, 
  Sparkles, 
  Sliders, 
  AlertTriangle, 
  Check, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Info
} from 'lucide-react';

interface BacklogViewProps {
  backlogItems: BacklogItem[];
  setBacklogItems: React.Dispatch<React.SetStateAction<BacklogItem[]>>;
  products: Product[];
  selectedProductId: string;
}

export default function BacklogView({
  backlogItems,
  setBacklogItems,
  products,
  selectedProductId
}: BacklogViewProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccess, setSyncSuccess] = useState<boolean>(false);

  const productItems = backlogItems.filter(item => item.productId === selectedProductId);

  // Sorting backlog items dynamically by RICE score descending
  const sortedItems = [...productItems].sort((a, b) => b.riceScore - a.riceScore);

  const filteredItems = sortedItems.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // Re-calculate RICE inline when slider triggers
  const handleSliderChange = (id: string, field: 'reach' | 'impact' | 'confidence' | 'effort', value: number) => {
    setBacklogItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = {
          ...item,
          [field]: value
        };
        // Recalculate RICE Score: (Reach * Impact * (Confidence/100)) / Effort
        const reachNum = field === 'reach' ? value : item.reach;
        const impactNum = field === 'impact' ? value : item.impact;
        const confidenceNum = field === 'confidence' ? value : item.confidence;
        const effortNum = field === 'effort' ? value : item.effort;

        const calculated = Math.round((reachNum * impactNum * (confidenceNum / 100)) / Math.max(0.5, effortNum));
        updated.riceScore = calculated;
        return updated;
      }
      return item;
    }));
  };

  const handleMergeDuplicate = (sourceId: string, targetKey: string) => {
    setBacklogItems(prev => prev.map(item => {
      if (item.id === sourceId) {
        return {
          ...item,
          status: 'Done',
          duplicateOf: undefined,
          description: `${item.description} (Merged into ${targetKey})`,
          title: `[MERGED] ${item.title}`
        };
      }
      return item;
    }));
  };

  const triggerJiraSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div id="backlog-agent-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-[9px] font-mono rounded-lg font-bold tracking-wider border border-violet-500/15 uppercase">
              RICE RANKING ENGINE
            </span>
            <span className="text-zinc-500 font-mono text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              StrategyPilot online
            </span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1.5">
            Prioritisation Backlog Workspace
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5 max-w-2xl">
            Audit and order features dynamically using the RICE priority framework. Adjust customer reach, impact, confidence, and engineering effort to auto-sort items and sync directly to Jira.
          </p>
        </div>

        {/* Explaining agent card */}
        <div className="p-4 bg-violet-950/10 border border-violet-900/20 rounded-xl max-w-xs md:self-center shadow-md shadow-violet-950/5">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Agent Spec & Action</p>
          <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">
            <strong>Action</strong>: Expand any item and tweak its sliders; the engine will re-sort the backlog list dynamically in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="backlog-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 text-xs rounded-lg text-zinc-300 focus:outline-none cursor-pointer hover:border-zinc-800 transition-colors"
          >
            <option value="all">All Backlog</option>
            <option value="backlog">Backlog Stable</option>
            <option value="todo">Active Todo</option>
            <option value="in progress">In Progress</option>
            <option value="done">Shipped</option>
          </select>

          <button
            id="jira-sync-btn"
            onClick={triggerJiraSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Syncing Custom RICE...</span>
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Sync to Jira Board</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sync success toast */}
      {syncSuccess && (
        <div id="sync-success-banner" className="p-3 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Bi-directional sync completed! Updated RICE scores and priority mappings inside Jira Software custom fields successfully.</span>
        </div>
      )}

      {/* Main Grid: Backlog Stack vs Decision Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               {/* Left: Interactive list */}
        <div className="lg:col-span-8 space-y-3">
          
          {/* Duplicate warnings block */}
          {filteredItems.some(item => item.duplicateOf) && (
            <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-900/20 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>AUTOMATED ENG-PILOT PRUNING ALERT</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                EngPilot detected highly overlapping requirements descriptions across Jira. Merge redundant items to optimize developer efficiency:
              </p>
              
              <div className="space-y-2">
                {filteredItems.filter(item => item.duplicateOf).map(item => (
                  <div key={item.id} className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl flex items-center justify-between text-xs hover:border-zinc-800 transition-colors">
                    <div>
                      <span className="font-mono text-[9px] text-zinc-500 font-bold tracking-wider">{item.key}</span>
                      <span className="text-zinc-300 font-medium ml-2.5">{item.title}</span>
                      <p className="text-[10px] text-zinc-500 mt-0.5 italic">Overlaps 85% with {item.duplicateOf}</p>
                    </div>
                    <button
                      id={`merge-btn-${item.id}`}
                      onClick={() => handleMergeDuplicate(item.id, item.duplicateOf || 'PILOT-201')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                    >
                      Resolve & Merge
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* List Headers */}
          <div className="flex items-center justify-between font-mono text-[9px] text-zinc-500 px-3 font-bold uppercase tracking-wider">
            <span>BACKLOG RANKING</span>
            <div className="flex items-center gap-12">
              <span>EST. REACH / IMPACT</span>
              <span>RICE SCORE</span>
            </div>
          </div>          {/* List Stack */}
          <div className="space-y-2">
            {filteredItems.map((item, index) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  id={`backlog-card-${item.id}`}
                  key={item.id} 
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isExpanded 
                      ? 'bg-zinc-900/45 border-violet-500/25 shadow-lg shadow-violet-950/5' 
                      : 'bg-zinc-900/20 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-900/30'
                  }`}
                >
                  {/* Summary trigger line */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-zinc-900 text-[10px] font-mono font-bold text-zinc-400 flex items-center justify-center border border-zinc-800">
                        #{index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-zinc-500 font-bold">{item.key}</span>
                          <span className={`px-2 py-0.5 font-mono text-[8px] font-bold rounded-lg uppercase border ${
                            item.status === 'Done' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/15' : 'bg-zinc-950 text-zinc-400 border-zinc-900'
                          }`}>
                            {item.status}
                          </span>
                          {item.clusterTag && (
                            <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[8px] font-mono rounded-lg border border-violet-500/15 uppercase font-bold tracking-wider">
                              {item.clusterTag}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200 truncate mt-1 leading-normal">{item.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 font-mono text-xs">
                      <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                        <span className="text-[10px] text-zinc-500 font-bold">R:</span> {item.reach}
                        <span className="text-[10px] text-zinc-500 font-bold">I:</span> {item.impact}
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-violet-400">{item.riceScore}</span>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-zinc-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-zinc-500" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Sliders Workspace */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-zinc-900/60 space-y-4 animate-fade-in">
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">{item.description}</p>
                      
                      {/* Interactive Sliders Panel */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-950/40 p-4 rounded-xl border border-zinc-900">
                        
                        {/* Reach Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-500 uppercase font-bold">Reach (Users / Month)</span>
                            <span className="text-zinc-300 font-bold">{item.reach} users</span>
                          </div>
                          <input 
                            id={`slider-reach-${item.id}`}
                            type="range" 
                            min="50" 
                            max="2000" 
                            step="50"
                            value={item.reach}
                            onChange={(e) => handleSliderChange(item.id, 'reach', parseInt(e.target.value))}
                            className="w-full accent-violet-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                          <p className="text-[9px] text-zinc-500 font-mono">Reach: Unique audience count targeted per month</p>
                        </div>

                        {/* Impact Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-500 uppercase font-bold">Customer Impact Score</span>
                            <span className="text-violet-400 font-bold">{item.impact}x (Value multiplier)</span>
                          </div>
                          <input 
                            id={`slider-impact-${item.id}`}
                            type="range" 
                            min="0.25" 
                            max="3.0" 
                            step="0.25"
                            value={item.impact}
                            onChange={(e) => handleSliderChange(item.id, 'impact', parseFloat(e.target.value))}
                            className="w-full accent-violet-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                          <p className="text-[9px] text-zinc-500 font-mono">Value: 3 = Massive Impact, 2 = High, 1 = Medium, 0.25 = Minimal</p>
                        </div>

                        {/* Confidence Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-500 uppercase font-bold">Prioritisation Confidence (%)</span>
                            <span className="text-zinc-300 font-bold">{item.confidence}% confidence</span>
                          </div>
                          <input 
                            id={`slider-confidence-${item.id}`}
                            type="range" 
                            min="50" 
                            max="100" 
                            step="5"
                            value={item.confidence}
                            onChange={(e) => handleSliderChange(item.id, 'confidence', parseInt(e.target.value))}
                            className="w-full accent-violet-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                          <p className="text-[9px] text-zinc-500 font-mono">Confidence weight based on supporting telemetry and logs</p>
                        </div>

                        {/* Effort Slider */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-zinc-500 uppercase font-bold">Engineering Effort (Person-Months)</span>
                            <span className="text-rose-400 font-bold">{item.effort} PM (Cost weight)</span>
                          </div>
                          <input 
                            id={`slider-effort-${item.id}`}
                            type="range" 
                            min="0.5" 
                            max="10.0" 
                            step="0.5"
                            value={item.effort}
                            onChange={(e) => handleSliderChange(item.id, 'effort', parseFloat(e.target.value))}
                            className="w-full accent-violet-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                          <p className="text-[9px] text-zinc-500 font-mono">Effort: Smaller cost boosts overall RICE Score ranking</p>
                        </div>

                      </div>

                      {/* Score display card */}
                      <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-900 flex items-center justify-between shadow-inner">
                        <div className="font-mono text-xs space-y-1">
                          <span className="text-zinc-500 font-bold">RICE PRIORITISATION WEIGHT:</span>
                          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">Formula: (Reach * Customer Impact * Confidence) / Engineering Effort</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 font-mono block font-bold">CALCULATED SCORE</span>
                          <span className="text-xl font-bold font-mono text-violet-400">{item.riceScore} pts</span>
                        </div>
                      </div>

                      {/* Decision Explainer */}
                      <div className="p-4 bg-violet-950/10 border border-violet-900/20 rounded-xl flex items-start gap-3 shadow-inner">
                        <Sparkles className="w-4.5 h-4.5 text-violet-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold">AI StrategyPilot Recommendation & Rationale</p>
                          <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed font-sans">{item.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>

        {/* Right: Explainer Board */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-zinc-900/20 border border-zinc-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold text-xs text-zinc-300 uppercase tracking-widest font-mono">
                RICE Framework Theory
              </h3>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              ProductOS continuously checks active tickets and re-orders execution lanes based on:
            </p>

            <div className="space-y-3 pt-2 font-sans">
              <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs space-y-1 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-200 font-semibold">Value Formula</span>
                  <span className="text-violet-400 font-mono text-[10px] font-bold">(R * I * C) / E</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  RICE score optimizes for maximum reach & strategic outcome while penalizing excessive effort.
                </p>
              </div>

              <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-xl text-xs space-y-2 shadow-inner">
                <p className="text-zinc-200 font-semibold border-b border-zinc-900/60 pb-1.5">Current Audit Stats</p>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Pruned redundancy:</span>
                  <span className="text-emerald-400 font-bold">+25% speed</span>
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>Jira Board alignment:</span>
                  <span className="text-violet-400 font-bold">Synced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
