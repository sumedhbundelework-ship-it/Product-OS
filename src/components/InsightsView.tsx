/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomerFeedback, Product } from '../types';
import { 
  Lightbulb, 
  Sparkles, 
  CheckCircle, 
  Smile, 
  Meh, 
  Frown, 
  Slack, 
  Plus, 
  RefreshCw,
  Video,
  MessageSquare,
  HelpCircle,
  Inbox
} from 'lucide-react';

interface InsightsViewProps {
  feedbacks: CustomerFeedback[];
  setFeedbacks: React.Dispatch<React.SetStateAction<CustomerFeedback[]>>;
  products: Product[];
  selectedProductId: string;
}

export default function InsightsView({
  feedbacks,
  setFeedbacks,
  products,
  selectedProductId
}: InsightsViewProps) {
  const [activeFeedbackId, setActiveFeedbackId] = useState<string>(feedbacks[0]?.id || '');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCustomer, setNewCustomer] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newSource, setNewSource] = useState<'Slack' | 'Zoom' | 'Intercom' | 'HubSpot'>('Slack');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  const selectedFeedback = feedbacks.find(f => f.id === activeFeedbackId);

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim() || !newContent.trim()) return;

    setIsExtracting(true);
    setTimeout(() => {
      // AI extracts pain points, feature requests, sentiment, and opportunities from new content
      const lowerContent = newContent.toLowerCase();
      
      const painPoints: string[] = [];
      const featureRequests: string[] = [];
      const opportunities: string[] = [];
      let sentiment: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';

      if (lowerContent.includes('error') || lowerContent.includes('slow') || lowerContent.includes('worst') || lowerContent.includes('pain') || lowerContent.includes('frustrated')) {
        sentiment = 'Negative';
      } else if (lowerContent.includes('love') || lowerContent.includes('great') || lowerContent.includes('awesome') || lowerContent.includes('perfect')) {
        sentiment = 'Positive';
      }

      // Simple heuristics for demo value
      if (lowerContent.includes('jira') || lowerContent.includes('sync')) {
        painPoints.push('Tired of manually mirroring priorities to Jira Software.');
        featureRequests.push('Bi-directional Custom RICE Field Jira Syncer.');
      }
      if (lowerContent.includes('notion') || lowerContent.includes('document')) {
        painPoints.push('Struggles to organize scattered PRDs and design briefs.');
        featureRequests.push('Notion API Workspace Document Loader.');
      }
      if (painPoints.length === 0) {
        painPoints.push('Struggles with legacy, highly tedious backlog sorting procedures.');
        featureRequests.push('Interactive prioritisation dashboard helpers.');
      }
      opportunities.push(`Accelerate the sales integration funnel for ${newCompany || 'new customer'}.`);

      const newRecord: CustomerFeedback = {
        id: `feed-${Date.now()}`,
        source: newSource,
        customerName: newCustomer,
        companyName: newCompany || 'Independent PM',
        content: newContent,
        date: new Date().toISOString().split('T')[0],
        analyzed: true,
        painPoints,
        featureRequests,
        opportunities,
        sentiment
      };

      setFeedbacks(prev => [newRecord, ...prev]);
      setActiveFeedbackId(newRecord.id);
      setNewCustomer('');
      setNewCompany('');
      setNewContent('');
      setIsExtracting(false);
      setShowAddForm(false);
    }, 1500);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Slack':
        return <Slack className="w-3.5 h-3.5 text-pink-400" />;
      case 'Zoom':
        return <Video className="w-3.5 h-3.5 text-blue-400" />;
      case 'Intercom':
        return <Inbox className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[9px] font-mono font-bold rounded-full border border-emerald-900/40">
            <Smile className="w-3 h-3 text-emerald-400" /> POSITIVE
          </span>
        );
      case 'Negative':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-rose-950 text-rose-400 text-[9px] font-mono font-bold rounded-full border border-rose-900/40">
            <Frown className="w-3 h-3 text-rose-400" /> FRUSTRATED
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-zinc-900 text-zinc-400 text-[9px] font-mono font-bold rounded-full border border-zinc-800">
            <Meh className="w-3 h-3 text-zinc-500" /> NEUTRAL
          </span>
        );
    }
  };

  return (
    <div id="customer-insights-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
              UNSTRUCTURED SIGNAL COMPILER
            </span>
            <span className="text-zinc-600 font-mono text-xs">• InsightPilot listening</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
            Customer Insight Agent (InsightPilot)
          </h2>
          <p className="text-zinc-400 text-sm mt-0.5 max-w-2xl">
            Sifts through unstructured Support tickets, Zoom interview logs, and Slack chats to synthesize pain points, opportunities, and custom feature desires.
          </p>
        </div>

        {/* Agent Spec card */}
        <div className="px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg max-w-xs">
          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-400">Agent Spec</p>
          <p className="text-[11px] text-zinc-400 mt-1 leading-normal font-sans">
            <strong>Example</strong>: Ingest a raw Intercom transcript to extract core user friction, opportunities, and RICE suggestions automatically.
          </p>
        </div>

        <button
          id="insight-add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center gap-1.5 cursor-pointer font-sans whitespace-nowrap self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Feedback Log</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Feedbacks log list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-3">
            <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">Feedbacks Inbox</h3>
            
            <div className="space-y-2">
              {feedbacks.map(f => {
                const isSelected = f.id === activeFeedbackId;
                return (
                  <button
                    id={`feedback-tab-${f.id}`}
                    key={f.id}
                    onClick={() => {
                      setActiveFeedbackId(f.id);
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
                        <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center mt-0.5 flex-shrink-0">
                          {getSourceIcon(f.source)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-zinc-200 truncate leading-snug">{f.customerName}</h4>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-sans">{f.companyName}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-zinc-600 font-mono flex-shrink-0">{f.date}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2.5">
                      {getSentimentBadge(f.sentiment)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Active feedback detail or draft form */}
        <div className="lg:col-span-8">
          {showAddForm ? (
            /* Ingestion Form */
            <form onSubmit={handleCreateFeedback} className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-900 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4.5 h-4.5 text-violet-400 animate-pulse" />
                  <h3 className="font-display font-bold text-sm text-zinc-200">Ingest Raw Conversation / Support Log</h3>
                </div>
                <button
                  id="cancel-add-insight"
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Contact Name</label>
                  <input
                    id="insight-contact-input"
                    type="text"
                    required
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Company Name</label>
                  <input
                    id="insight-company-input"
                    type="text"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Log Channel Source</label>
                  <select
                    id="insight-source-select"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="Slack">Slack Channel Thread</option>
                    <option value="Zoom">Zoom Interview Transcript</option>
                    <option value="Intercom">Intercom Support Ticket</option>
                    <option value="HubSpot">HubSpot CRM Note</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Raw Chat Transcript/Log Body</label>
                <textarea
                  id="insight-content-input"
                  required
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste raw email, chat messages, or transcription sentences here..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 font-sans"
                />
              </div>

              <button
                id="insight-submit-btn"
                type="submit"
                disabled={isExtracting}
                className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-violet-600/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>InsightPilot scanning semantics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract AI Customer Insights</span>
                  </>
                )}
              </button>
            </form>
          ) : selectedFeedback ? (
            /* Active Feedback Card Analysis Details */
            <div className="space-y-6">
              
              {/* Transcript original display */}
              <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-900/60">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Ingested Conversation Log</span>
                  <span className="text-[9px] text-zinc-600 font-mono font-bold">DATE: {selectedFeedback.date}</span>
                </div>
                <div className="text-xs text-zinc-300 italic whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto pr-1">
                  "{selectedFeedback.content}"
                </div>
              </div>

              {/* Extracted Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Extracted Pain points */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-3">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">Identified User Friction</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedFeedback.painPoints.map((p, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-rose-500 font-bold mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Feature Requests */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-3">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">Extracted Feature Desires</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedFeedback.featureRequests.map((f, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-violet-400 font-bold mt-0.5">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Opportunity Areas */}
                <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-3 md:col-span-2">
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <h4 className="text-[10px] uppercase tracking-wider font-mono font-bold text-zinc-400">AI opportunity areas</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedFeedback.opportunities.map((o, idx) => (
                      <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 font-bold mt-0.5">💡</span>
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500">
              Select a customer feedback log to view semantic extractions.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
