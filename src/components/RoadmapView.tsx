/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoadmapItem, Product } from '../types';
import { 
  Map, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle2, 
  Plus,
  RefreshCw
} from 'lucide-react';

interface RoadmapViewProps {
  roadmapItems: RoadmapItem[];
  setRoadmapItems: React.Dispatch<React.SetStateAction<RoadmapItem[]>>;
  products: Product[];
  selectedProductId: string;
}

export default function RoadmapView({
  roadmapItems,
  setRoadmapItems,
  products,
  selectedProductId
}: RoadmapViewProps) {
  const [activeTab, setActiveTab] = useState<'board' | 'timeline'>('board');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newTimeframe, setNewTimeframe] = useState<'Sprint 24' | 'Next Month' | 'Q3' | 'Q4'>('Sprint 24');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const productItems = roadmapItems.filter(item => item.productId === selectedProductId);

  // Timeframe columns
  const timeframes: Array<'Sprint 24' | 'Next Month' | 'Q3' | 'Q4'> = ['Sprint 24', 'Next Month', 'Q3', 'Q4'];

  const handleMove = (id: string, direction: 'prev' | 'next') => {
    setRoadmapItems(prev => prev.map(item => {
      if (item.id === id) {
        const currentIdx = timeframes.indexOf(item.timeframe as any);
        if (currentIdx !== -1) {
          let nextIdx = currentIdx;
          if (direction === 'prev' && currentIdx > 0) nextIdx--;
          if (direction === 'next' && currentIdx < timeframes.length - 1) nextIdx++;
          return {
            ...item,
            timeframe: timeframes[nextIdx]
          };
        }
      }
      return item;
    }));
  };

  const handleAddRoadmapItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // Simulate Roadmap agent writing a description and assigning owner
      const owners = ['EngPilot', 'StrategyPilot', 'DocPilot', 'InsightPilot'];
      const randomOwner = owners[Math.floor(Math.random() * owners.length)];
      
      const newItem: RoadmapItem = {
        id: `road-${Date.now()}`,
        title: newTitle,
        productId: selectedProductId,
        timeframe: newTimeframe,
        status: 'Planned',
        priority: newPriority,
        description: `AI generated scope: Align resources, map critical paths, and conduct risk analysis for "${newTitle}".`,
        owner: randomOwner
      };

      setRoadmapItems(prev => [...prev, newItem]);
      setNewTitle('');
      setIsGenerating(false);
      setShowAddForm(false);
    }, 1200);
  };

  const handleUpdateStatus = (id: string, status: 'Planned' | 'In Progress' | 'Shipped') => {
    setRoadmapItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    }));
  };

  const getItemMeta = (itemId: string, title: string) => {
    if (itemId === 'road-1' || title.toLowerCase().includes('slack') || title.toLowerCase().includes('ingest')) {
      return {
        goal: 'Unblock discovery ingestion',
        dependency: 'Slack OAuth Gateway',
        risk: 'Slack API rate limits',
        impact: 'Reclaims 10 hours/week'
      };
    }
    if (itemId === 'road-2' || title.toLowerCase().includes('rice') || title.toLowerCase().includes('slider') || title.toLowerCase().includes('recalculate')) {
      return {
        goal: 'Align tactical devs with product direction',
        dependency: 'Jira API Scopes',
        risk: 'Jira field configuration issues',
        impact: '+22% customer retention rate'
      };
    }
    if (itemId === 'road-3' || title.toLowerCase().includes('rollback') || title.toLowerCase().includes('sql') || title.toLowerCase().includes('advanced')) {
      return {
        goal: 'Ensure enterprise risk resilience',
        dependency: 'Experiment Agent core logic',
        risk: 'Spanner SQL dialect mismatch',
        impact: 'Reduces recovery times by 85%'
      };
    }
    return {
      goal: 'Continuous client-driven feedback capture',
      dependency: 'Salesforce/HubSpot webhooks',
      risk: 'Processing feedback spam',
      impact: 'Automates customer signals'
    };
  };

  const getTfGoal = (tf: string) => {
    switch (tf) {
      case 'Sprint 24': return 'Connect multi-channel discovery and data ingestion pipelines.';
      case 'Next Month': return 'Deploy interactive prioritization sliders and establish bi-directional Jira links.';
      case 'Q3': return 'Ensure enterprise risk resilience during live feature experiments.';
      case 'Q4': return 'Scale automated CRM sentiment clustering pipelines.';
      default: return 'Maximize sprint capacity delivery.';
    }
  };

  return (
    <div id="roadmap-agent-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
              ALIGNMENT & CAPACITY AGENT
            </span>
            <span className="text-zinc-600 font-mono text-xs">• MapPilot online</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
            Roadmap Agent (MapPilot)
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5 max-w-2xl">
            Optimize timeframes, map cross-functional dependencies, audit delivery risks, and evaluate business impact weights automatically across sprints and quarterly horizons.
          </p>
        </div>

        {/* Agent Spec card */}
        <div className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg max-w-xs md:self-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Agent Spec & Action</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-normal font-sans">
            <strong>Action</strong>: Drag or shift columns to trigger timing clash and resource over-allocation alerts automatically.
          </p>
        </div>

        <div className="flex items-center gap-3 self-center">
          <div className="bg-zinc-900 p-1 rounded-lg border border-zinc-800 flex">
            <button
              id="roadmap-tab-board"
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'board' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Interactive Board
            </button>
            <button
              id="roadmap-tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'timeline' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Timeline List
            </button>
          </div>

          <button
            id="roadmap-add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer font-sans whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Item</span>
          </button>
        </div>
      </div>

      {/* Generation Form overlay / section */}
      {showAddForm && (
        <form onSubmit={handleAddRoadmapItem} className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-4 max-w-2xl">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="font-display font-bold text-sm text-zinc-200">AI-Assisted Roadmap Scheduling</h3>
            </div>
            <button
              id="close-add-roadmap"
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Goal/Task Title</label>
              <input
                id="roadmap-title-input"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. PostgreSQL Schema Audit Gateway"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Timeframe Horizon</label>
              <select
                id="roadmap-timeframe-select"
                value={newTimeframe}
                onChange={(e) => setNewTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
              >
                <option value="Sprint 24">Sprint 24 (Immediate)</option>
                <option value="Next Month">Next Month</option>
                <option value="Q3">Q3 Release</option>
                <option value="Q4">Q4 Release</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Strategic Priority</label>
              <select
                id="roadmap-priority-select"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-violet-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <button
            id="roadmap-generate-btn"
            type="submit"
            disabled={isGenerating}
            className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>MapPilot calculating capacity...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Schedule & Generate Details</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Main View Render */}
      {activeTab === 'board' ? (
        /* Board View columns (Sprint 24, Next Month, Q3, Q4) */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {timeframes.map((tf) => {
            const itemsInTf = productItems.filter(item => item.timeframe === tf);
            const tfGoal = getTfGoal(tf);
            
            return (
              <div key={tf} className="bg-zinc-900/10 border border-zinc-900 p-4 rounded-xl space-y-4 min-w-[270px] flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900/80 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-display font-bold text-xs text-zinc-200">{tf}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 font-mono text-[10px] rounded-full border border-zinc-800">
                      {itemsInTf.length}
                    </span>
                  </div>

                  {/* Column Goal explanation */}
                  <div className="p-2.5 bg-zinc-950/40 border border-zinc-900/60 rounded-lg">
                    <span className="text-[8px] font-mono font-bold text-violet-400 block uppercase">Quarterly Goal</span>
                    <p className="text-[10px] text-zinc-400 font-sans mt-0.5 leading-snug">{tfGoal}</p>
                  </div>

                  {/* Items Stack */}
                  <div className="space-y-3">
                    {itemsInTf.length === 0 ? (
                      <div className="text-center py-8 text-zinc-600 text-[11px] border border-dashed border-zinc-900 rounded-lg font-mono">
                        Empty backlog
                      </div>
                    ) : (
                      itemsInTf.map((item) => {
                        const meta = getItemMeta(item.id, item.title);
                        return (
                          <div 
                            id={`roadmap-card-${item.id}`}
                            key={item.id} 
                            className="p-3 bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800/80 rounded-lg space-y-2.5 transition-colors group relative"
                          >
                            {/* Priority and Owner tags */}
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase border ${
                                item.priority === 'High' 
                                  ? 'bg-rose-950/40 text-rose-400 border-rose-900/40' 
                                  : item.priority === 'Medium' 
                                    ? 'bg-amber-950/40 text-amber-400 border-amber-900/40'
                                    : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {item.priority}
                              </span>
                              
                              <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-mono">
                                <User className="w-2.5 h-2.5" />
                                <span>{item.owner}</span>
                              </div>
                            </div>

                            {/* Title & Desc */}
                            <div>
                              <h4 className="text-xs font-semibold text-zinc-200 leading-snug">{item.title}</h4>
                              <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {/* Detailed Spec Meta (Initiatives, Dependencies, Risks, Business Impact) */}
                            <div className="p-2 bg-zinc-950/80 rounded border border-zinc-900 text-[9px] font-mono space-y-1">
                              <div className="flex justify-between">
                                <span className="text-zinc-500">DEPENDENCY:</span>
                                <span className="text-zinc-300 truncate max-w-[130px]" title={meta.dependency}>{meta.dependency}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">RISK:</span>
                                <span className="text-rose-400 truncate max-w-[130px]" title={meta.risk}>{meta.risk}</span>
                              </div>
                              <div className="flex justify-between font-bold text-violet-400">
                                <span>IMPACT:</span>
                                <span className="truncate max-w-[130px]">{meta.impact}</span>
                              </div>
                            </div>

                            {/* Interactive Status & Move controllers */}
                            <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between">
                              <select
                                id={`status-select-${item.id}`}
                                value={item.status}
                                onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                                className="bg-transparent border-none text-[10px] text-zinc-400 focus:outline-none cursor-pointer font-mono font-bold"
                              >
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Shipped">Shipped</option>
                              </select>

                              {/* Navigation shift buttons */}
                              <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded border border-zinc-900">
                                <button
                                  id={`move-prev-btn-${item.id}`}
                                  onClick={() => handleMove(item.id, 'prev')}
                                  disabled={tf === 'Sprint 24'}
                                  className="p-1 hover:bg-zinc-900 rounded disabled:opacity-20 cursor-pointer text-zinc-500 hover:text-zinc-300"
                                  title="Move left"
                                >
                                  <ArrowLeft className="w-2.5 h-2.5" />
                                </button>
                                <button
                                  id={`move-next-btn-${item.id}`}
                                  onClick={() => handleMove(item.id, 'next')}
                                  disabled={tf === 'Q4'}
                                  className="p-1 hover:bg-zinc-900 rounded disabled:opacity-20 cursor-pointer text-zinc-500 hover:text-zinc-300"
                                  title="Move right"
                                >
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Timeline List View */
        <div className="space-y-4">
          {productItems.map((item) => {
            const meta = getItemMeta(item.id, item.title);
            return (
              <div 
                id={`roadmap-list-${item.id}`}
                key={item.id} 
                className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[10px] font-mono border border-zinc-800 rounded">
                      {item.timeframe}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 rounded border uppercase ${
                      item.priority === 'High' ? 'text-rose-400 border-rose-900/20' : 'text-zinc-500 border-zinc-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-zinc-200 mt-1">{item.title}</h4>
                  <p className="text-xs text-zinc-400">{item.description}</p>
                  
                  {/* Metadata display row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-2 bg-zinc-950/50 rounded border border-zinc-900 text-[10px] font-mono">
                      <span className="text-zinc-500 block">DEPENDENCY</span>
                      <span className="text-zinc-300">{meta.dependency}</span>
                    </div>
                    <div className="p-2 bg-zinc-950/50 rounded border border-zinc-900 text-[10px] font-mono">
                      <span className="text-zinc-500 block">RISK MITIGATION</span>
                      <span className="text-rose-400">{meta.risk}</span>
                    </div>
                    <div className="p-2 bg-zinc-950/50 rounded border border-zinc-900 text-[10px] font-mono">
                      <span className="text-zinc-500 block">BUSINESS ARR IMPACT</span>
                      <span className="text-violet-400 font-bold">{meta.impact}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-start sm:self-center">
                  <div className="text-right">
                    <p className="text-[9px] uppercase font-mono text-zinc-500">OWNER</p>
                    <p className="text-xs font-semibold text-zinc-300">{item.owner}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] uppercase font-mono text-zinc-500">STATUS</p>
                    <select
                      id={`status-list-select-${item.id}`}
                      value={item.status}
                      onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                      className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer font-bold mt-0.5"
                    >
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Shipped">Shipped</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
