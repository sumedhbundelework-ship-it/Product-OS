/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AIAgent } from '../types';
import { 
  Settings, 
  User, 
  Shield, 
  Sliders, 
  Users, 
  Sparkles,
  Check,
  RefreshCw,
  ExternalLink,
  Lock
} from 'lucide-react';

interface SettingsViewProps {
  agents: AIAgent[];
  setAgents: React.Dispatch<React.SetStateAction<AIAgent[]>>;
}

export default function SettingsView({ agents, setAgents }: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<'agent-behavior' | 'team-members' | 'api-keys'>('agent-behavior');
  
  // Custom slider adjustments
  const [agentAttributes, setAgentAttributes] = useState<Record<string, { strategy: number; creativity: number }>>({
    strategy: { strategy: 80, creativity: 50 },
    roadmap: { strategy: 95, creativity: 30 },
    insights: { strategy: 60, creativity: 85 },
    engineering: { strategy: 90, creativity: 25 },
    analytics: { strategy: 95, creativity: 20 },
    documentation: { strategy: 70, creativity: 75 }
  });

  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const teamRoster = [
    { name: 'Sumedh Bundele', role: 'Senior Product Manager', email: 'sumedh.bundele.work@gmail.com', avatar: 'SB', permission: 'Owner' },
    { name: 'Sanjay Krishnan', role: 'Lead Architect', email: 'sanjay.k@productos.ai', avatar: 'SK', permission: 'Admin' },
    { name: 'Sarah Jenkins', role: 'Group Product Director', email: 'sarah.j@acme.com', avatar: 'SJ', permission: 'Contributor' },
    { name: 'Alex Rivera', role: 'Staff Integration Engineer', email: 'alex.r@productos.ai', avatar: 'AR', permission: 'Contributor' }
  ];

  const handleAttributeChange = (agentId: string, type: 'strategy' | 'creativity', value: number) => {
    setAgentAttributes(prev => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        [type]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Update actual agent description or personality in state to show live reactivity
    setAgents(prev => prev.map(a => {
      const attrs = agentAttributes[a.id];
      if (attrs) {
        let personality = '';
        if (attrs.strategy > 75 && attrs.creativity > 60) {
          personality = 'Bold, highly strategic, and exceptionally creative.';
        } else if (attrs.strategy > 75) {
          personality = 'Extremely analytical, pragmatically strategic, and focused.';
        } else if (attrs.creativity > 60) {
          personality = 'Highly empathetic, exploratory, and creatively descriptive.';
        } else {
          personality = 'Balanced, structured, and risk-averse.';
        }
        return {
          ...a,
          personality
        };
      }
      return a;
    }));

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="settings-view" className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-900">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-violet-950 text-violet-400 text-[10px] font-mono rounded-full font-semibold border border-violet-800/40">
            SYSTEM ADMIN CONTROL
          </span>
          <span className="text-zinc-600 font-mono text-xs">• Platform settings</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white tracking-tight mt-1">
          Settings & Configurations
        </h2>
        <p className="text-zinc-400 text-sm mt-0.5">
          Fine-tune LLM Agent behaviors, customize operational weights, configure team rosters, and manage security secrets.
        </p>
      </div>

      {/* Sub tabs */}
      <div className="bg-zinc-950 p-1 rounded-lg border border-zinc-900 flex max-w-lg">
        <button
          id="btn-settings-behavior"
          onClick={() => setActiveTab('agent-behavior')}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'agent-behavior' ? 'bg-zinc-900 text-white border border-zinc-800/80' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Agent Behavior
        </button>
        <button
          id="btn-settings-team"
          onClick={() => setActiveTab('team-members')}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'team-members' ? 'bg-zinc-900 text-white border border-zinc-800/80' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Team Roster
        </button>
        <button
          id="btn-settings-api"
          onClick={() => setActiveTab('api-keys')}
          className={`flex-1 text-center py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            activeTab === 'api-keys' ? 'bg-zinc-900 text-white border border-zinc-800/80' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          API Key Hooks
        </button>
      </div>

      {/* Save feedback toast */}
      {saveSuccess && (
        <div id="settings-save-success" className="p-3 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg text-xs flex items-center gap-2 animate-fade-in max-w-2xl">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Agent Behavior neural profiles updated and saved to local SaaS storage successfully!</span>
        </div>
      )}

      {/* Main Stage */}
      <div className="max-w-4xl">
        {activeTab === 'agent-behavior' ? (
          /* Agent Sliders Behavioral Adjustments */
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-4.5 h-4.5 text-violet-400" />
                <h3 className="font-display font-bold text-sm text-zinc-200">Adjust LLM Agent Personalities</h3>
              </div>
              <button
                id="btn-save-agent-behavior"
                onClick={handleSaveSettings}
                className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                Save Behavioral Profiles
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-normal font-sans">
              Adjust LLM temperature variables and strategic guidelines. Changes directly affect how agents behave inside the AI Chat and how they summarize specifications or backlog priorities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => {
                const attrs = agentAttributes[agent.id] || { strategy: 50, creativity: 50 };
                return (
                  <div key={agent.id} className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{agent.avatar}</span>
                      <div>
                        <h4 className="text-xs font-semibold text-zinc-100">{agent.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{agent.title}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {/* Strategy Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500">
                          <span>STRATEGIC FOCUS (Analytical vs creative)</span>
                          <span className="text-zinc-300">{attrs.strategy}%</span>
                        </div>
                        <input
                          id={`slider-attr-strategy-${agent.id}`}
                          type="range"
                          min="0"
                          max="100"
                          value={attrs.strategy}
                          onChange={(e) => handleAttributeChange(agent.id, 'strategy', parseInt(e.target.value))}
                          className="w-full accent-violet-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Creativity Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-zinc-500">
                          <span>EMPATHY & CREATIVITY (Precise vs descriptive)</span>
                          <span className="text-zinc-300">{attrs.creativity}%</span>
                        </div>
                        <input
                          id={`slider-attr-creativity-${agent.id}`}
                          type="range"
                          min="0"
                          max="100"
                          value={attrs.creativity}
                          onChange={(e) => handleAttributeChange(agent.id, 'creativity', parseInt(e.target.value))}
                          className="w-full accent-violet-500 h-1 bg-zinc-800 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] font-mono italic text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-900 leading-relaxed">
                      Active: "{agent.personality}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'team-members' ? (
          /* Team Roster List */
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-900">
              <Users className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="font-display font-bold text-sm text-zinc-200">Organization & Team Access</h3>
            </div>

            <p className="text-xs text-zinc-400 leading-normal font-sans">
              Manage who in your product organization has permissions to trigger agents, connect Jira keys, or view customer feedback analysis.
            </p>

            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900/80 space-y-3">
              {teamRoster.map((member, idx) => (
                <div key={idx} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between gap-4 text-xs font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 font-bold border border-violet-800/40 flex items-center justify-center font-mono">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-200">{member.name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">{member.role} • {member.email}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded text-[10px] font-mono">
                    {member.permission}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Secure API keys config form placeholder */
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-900">
              <Lock className="w-4.5 h-4.5 text-violet-400" />
              <h3 className="font-display font-bold text-sm text-zinc-200">Enterprise API Credentials</h3>
            </div>

            <p className="text-xs text-zinc-400 leading-normal font-sans">
              Configure connections to external AI APIs. Environment secrets are handled securely by Google Cloud Run. To modify actual production keys, use the main **Secrets Panel** inside the AI Studio configuration menu.
            </p>

            <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900/80 space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">GEMINI_API_KEY</span>
                  <span className="text-emerald-400 font-mono text-[9px] font-bold">✓ MOUNTED INJECTED</span>
                </div>
                <input
                  id="mock-gemini-key"
                  type="password"
                  disabled
                  value="••••••••••••••••••••••••••••••••••••"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-500 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase">JIRA_API_CREDENTIALS</span>
                  <span className="text-emerald-400 font-mono text-[9px] font-bold">✓ MOUNTED SECURE</span>
                </div>
                <input
                  id="mock-jira-key"
                  type="password"
                  disabled
                  value="••••••••••••••••••••••••••••••••••••"
                  className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-500 font-mono text-xs focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                By default, ProductOS will fall back to secure sandbox execution if custom workspace keys are left unconfigured.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
