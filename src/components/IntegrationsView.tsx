/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Integration } from '../types';
import { 
  Share2, 
  Check, 
  Plus, 
  ExternalLink, 
  AlertCircle,
  Zap,
  Lock
} from 'lucide-react';

interface IntegrationsViewProps {
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
}

export default function IntegrationsView({ integrations, setIntegrations }: IntegrationsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Platforms' },
    { id: 'issue_tracker', label: 'Trackers (Jira/Linear)' },
    { id: 'vcs', label: 'Git Repos' },
    { id: 'communication', label: 'Chat/Meetings' },
    { id: 'docs', label: 'Wiki/Docs' },
    { id: 'design', label: 'Design' }
  ];

  const filteredIntegrations = integrations.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const handleToggleConnect = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Connected' ? 'Not Connected' : 'Connected';
        return {
          ...item,
          status: nextStatus
        };
      }
      return item;
    }));
  };

  return (
    <div id="integrations-view" className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
            ENTERPRISE CONNECTIVITY GATEWAY
          </span>
          <span className="text-zinc-600 font-mono text-xs">• Bi-directional sync channels active</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
          Connected Workspace Integrations
        </h2>
        <p className="text-zinc-400 text-sm mt-0.5">
          Connect your team's existing product tools once. ProductOS AI Agents continuously index requirements, roadmap changes, and customer conversations in real-time.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pb-2 border-b border-zinc-900/60">
        {categories.map((cat) => (
          <button
            id={`tab-cat-${cat.id}`}
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeCategory === cat.id 
                ? 'bg-zinc-900 text-white border border-zinc-800' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of integrations cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => {
          const isConnected = item.status === 'Connected';
          return (
            <div 
              id={`integration-card-${item.id}`}
              key={item.id} 
              className={`p-4 rounded-xl bg-zinc-900/30 border transition-all duration-200 ${
                isConnected 
                  ? 'border-zinc-800/80 shadow-md shadow-emerald-950/2' 
                  : 'border-zinc-900 opacity-60 hover:opacity-100 hover:border-zinc-900/80'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-lg shadow-inner">
                    {item.logo}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100">{item.name}</h4>
                    <span className={`inline-block text-[9px] font-mono font-bold uppercase mt-1 px-1.5 py-0.2 rounded ${
                      isConnected 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/20' 
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                {/* Connection switch */}
                <button
                  id={`toggle-connect-${item.id}`}
                  onClick={() => handleToggleConnect(item.id)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-all cursor-pointer border ${
                    isConnected 
                      ? 'bg-zinc-950 border-rose-900/40 hover:bg-rose-950/20 text-rose-400 hover:text-rose-300' 
                      : 'bg-violet-600 border-violet-600 hover:bg-violet-500 text-white shadow-sm'
                  }`}
                >
                  {isConnected ? 'Disconnect' : 'Connect'}
                </button>
              </div>

              <p className="text-[11px] text-zinc-400 mt-3.5 leading-relaxed font-sans">
                {item.description}
              </p>

              {/* Status footer line */}
              {isConnected && (
                <div className="mt-3 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                  <div className="flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                    <span>Active 2-way Webhooks</span>
                  </div>
                  <span className="text-zinc-600">SSL ENCRYPTED</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-900 flex items-start gap-3 max-w-2xl">
        <Lock className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-zinc-200">Enterprise Data Security Shield</h4>
          <p className="text-[11px] text-zinc-500 leading-normal font-sans">
            ProductOS adheres to SOC2 Type II regulations. We strictly encrypt OAuth API tokens and credential configurations. Your codebase definitions, internal PRDs, and support logs are analyzed purely server-side with localized memory buffers, ensuring they are never utilized for model fine-tuning.
          </p>
        </div>
      </div>
    </div>
  );
}
