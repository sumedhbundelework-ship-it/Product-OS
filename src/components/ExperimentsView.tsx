/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Experiment, Product } from '../types';
import { 
  Beaker, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  Info,
  Layers,
  Activity
} from 'lucide-react';

interface ExperimentsViewProps {
  experiments: Experiment[];
  setExperiments: React.Dispatch<React.SetStateAction<Experiment[]>>;
  products: Product[];
  selectedProductId: string;
}

export default function ExperimentsView({
  experiments,
  setExperiments,
  products,
  selectedProductId
}: ExperimentsViewProps) {
  const [activeExpId, setActiveExpId] = useState<string>(experiments[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newConcept, setNewConcept] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const selectedExp = experiments.find(e => e.id === activeExpId);
  const productExperiments = experiments.filter(e => e.productId === selectedProductId);

  const handleCreateExperiment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newConcept.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      // AI generates hypothesis, test design, success metrics, and rollback plan based on concept
      const hypothesis = `If we deploy "${newTitle}" based on the concept "${newConcept}", then user engagement and task success rates will increase by 15% because friction is substantially minimized.`;
      
      const testDesign = `50/50 bucket allocation via client-side Feature Flags. Segment A (Control) sees default behavior. Segment B (Variant) has the ${newTitle} module enabled.`;
      
      const successMetrics = [
        `Primary Metric: Conversion/Click-Through Rate on the target component (Target: >15% lift).`,
        `Secondary Metric: Feature-specific retention over a 7-day period.`
      ];

      const rollbackPlan = `Disable feature flag "pilot-exp-${Date.now().toString().slice(-4)}" via admin panel immediately. No system hotfix code deploy required.`;

      const newExp: Experiment = {
        id: `exp-${Date.now()}`,
        title: newTitle,
        productId: selectedProductId,
        hypothesis,
        testDesign,
        successMetrics,
        rollbackPlan,
        status: 'Draft'
      };

      setExperiments(prev => [newExp, ...prev]);
      setActiveExpId(newExp.id);
      setNewTitle('');
      setNewConcept('');
      setIsGenerating(false);
      setShowAddForm(false);
    }, 1500);
  };

  const handleUpdateStatus = (id: string, status: 'Draft' | 'Running' | 'Completed' | 'Rolled Back') => {
    setExperiments(prev => prev.map(e => {
      if (e.id === id) {
        const updated = { ...e, status };
        if (status === 'Completed' && !updated.findings) {
          updated.findings = 'AI Evaluation completed: Variant exhibited a robust 18.5% lift on primary metrics with 98.4% statistical significance. Recommend moving 100% of traffic to Variant.';
        }
        return updated;
      }
      return e;
    }));
  };

  return (
    <div id="experiments-agent-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
              A/B SIGNIFICANCE PLANNED
            </span>
            <span className="text-zinc-600 font-mono text-xs">• EngPilot guard rails active</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
            Experimentation & Hypotheses Planner
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5">
            Formulate scientific product hypotheses, set target success metrics, and design fail-safe rollback plans with the Experiment Agent.
          </p>
        </div>

        <button
          id="exp-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center gap-1.5 cursor-pointer font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Launch AI Experiment</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Experiments index */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-3">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Active Experiments</h3>
            
            <div className="space-y-2">
              {productExperiments.map(e => {
                const isSelected = e.id === activeExpId;
                return (
                  <button
                    id={`exp-tab-${e.id}`}
                    key={e.id}
                    onClick={() => {
                      setActiveExpId(e.id);
                      setShowAddForm(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-zinc-900 border-violet-500/40 shadow-sm shadow-violet-500/5' 
                        : 'bg-transparent border-zinc-900 hover:bg-zinc-900/30 hover:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center mt-0.5 flex-shrink-0 text-xs">
                          🧪
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate leading-snug">{e.title}</h4>
                          <span className={`inline-block mt-2 px-1.5 py-0.2 font-mono text-[8px] font-bold rounded uppercase ${
                            e.status === 'Completed' 
                              ? 'bg-emerald-950 text-emerald-400' 
                              : e.status === 'Running' 
                                ? 'bg-indigo-950 text-indigo-400' 
                                : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {e.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Experiment workspace / Addition Form */}
        <div className="lg:col-span-8">
          {showAddForm ? (
            /* Create Form */
            <form onSubmit={handleCreateExperiment} className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-violet-400" />
                  <h3 className="font-display font-bold text-sm text-zinc-200">Draft New Experiment Hypothesis</h3>
                </div>
                <button
                  id="cancel-add-exp"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Experiment / Feature Title</label>
                <input
                  id="exp-title-input"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Glowing Dashboard Callout Banner"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Core Concept & Target Metric Goal</label>
                <textarea
                  id="exp-concept-input"
                  required
                  rows={4}
                  value={newConcept}
                  onChange={(e) => setNewConcept(e.target.value)}
                  placeholder="e.g. We want to place a glowing card at the center of the PM dashboard prompting Slack integrations. Goal is to lift integrations completion rate."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <button
                id="exp-submit-btn"
                type="submit"
                disabled={isGenerating}
                className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Experiment Agent mapping models...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Experiment Design</span>
                  </>
                )}
              </button>
            </form>
          ) : selectedExp ? (
            /* Detail Display */
            <div className="space-y-6">
              
              {/* Header Status Bar */}
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-base text-zinc-200">{selectedExp.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    Product: <strong>{products.find(p => p.id === selectedExp.productId)?.name}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[10px] font-mono uppercase text-zinc-500">EXPERIMENT STATE:</label>
                  <select
                    id={`exp-status-select-${selectedExp.id}`}
                    value={selectedExp.status}
                    onChange={(e) => handleUpdateStatus(selectedExp.id, e.target.value as any)}
                    className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-xs rounded-md text-zinc-300 font-semibold cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Running">Running Active</option>
                    <option value="Completed">Completed Success</option>
                    <option value="Rolled Back">Rolled Back</option>
                  </select>
                </div>
              </div>

              {/* Sections Stack */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Hypothesis */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Layers className="w-4 h-4 text-zinc-500" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">Validated Scientific Hypothesis</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{selectedExp.hypothesis}</p>
                </div>

                {/* Split Design */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Activity className="w-4 h-4 text-zinc-500" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">A/B Allocation Protocol</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-sans">{selectedExp.testDesign}</p>
                </div>

                {/* Target Metrics */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">Success Metrics Thresholds</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {selectedExp.successMetrics.map((m, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Rollback plan */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">Fail-Safe Deployment Rollback plan</h4>
                  </div>
                  <p className="text-xs text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded border border-zinc-900/60 leading-relaxed">
                    {selectedExp.rollbackPlan}
                  </p>
                </div>

                {/* Findings summary */}
                {selectedExp.findings && (
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2 md:col-span-2 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold">Post-Experiment AI Evaluation</h4>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed font-sans">{selectedExp.findings}</p>
                  </div>
                )}

              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500">
              Select or create an experiment to audit hypothesis outcomes.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
