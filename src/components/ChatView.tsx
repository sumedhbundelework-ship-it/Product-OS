/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AIAgent, Message, PRD, BacklogItem, CustomerFeedback } from '../types';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  MessageSquare, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight,
  RefreshCw,
  Clock,
  User,
  Cpu
} from 'lucide-react';

interface ChatViewProps {
  agents: AIAgent[];
  prds: PRD[];
  backlogItems: BacklogItem[];
  feedbacks: CustomerFeedback[];
}

export default function ChatView({ agents, prds, backlogItems, feedbacks }: ChatViewProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('strategy');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      sender: 'agent',
      agentId: 'strategy',
      text: "Hello! I'm StrategyPilot, your Product Strategy Agent. I continuously analyze your market signals, product metrics, and ticket backlog. You can ask me to calculate precise RICE prioritizations, assess strategic alignment, or even trigger other agents. What are we optimizing today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingLogs, setTypingLogs] = useState<string[]>([]);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState<boolean>(false);
  const [attachedItem, setAttachedItem] = useState<{ type: string; title: string; id: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, typingLogs]);

  const activeAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Suggestions tailored per agent
  const getSuggestionsForAgent = (agentId: string) => {
    switch (agentId) {
      case 'strategy':
        return [
          "Evaluate strategic alignment for Q3 roadmap items",
          "Identify features with the highest RICE ROI",
          "Generate strategic defense brief against AI copycats"
        ];
      case 'roadmap':
        return [
          "Generate quarterly milestone milestones for active sprint items",
          "Forecast delivery confidence for PILOT-201 and PILOT-104",
          "Flag resource bottle-necks or timing clashing"
        ];
      case 'insights':
        return [
          "Extract key pain points from Sarah Jenkins feedback",
          "Summarize Zoom customer interview feature requests",
          "Draft product-market fit improvement suggestions"
        ];
      case 'engineering':
        return [
          "Analyze duplicate backend tickets in our backlog",
          "Examine technical risk for Slack webhooks integrations",
          "Assess API dependency gaps in PRD-1"
        ];
      case 'analytics':
        return [
          "Why did our onboarding activation rate decrease last month?",
          "Correlate Slack integrations usage against customer retention",
          "Generate Spanner metrics query for weekly active editors"
        ];
      case 'documentation':
        return [
          "Generate comprehensive user stories for Slack blueprint generator",
          "Draft acceptance criteria for the Jira RICE sync sliders",
          "Analyze PRD-1 and identify missing business logic"
        ];
      default:
        return [
          "Summarize my active sprint goals",
          "Identify open risks in backlog"
        ];
    }
  };

  const selectAgent = (agentId: string) => {
    setSelectedAgentId(agentId);
    const targetAgent = agents.find(a => a.id === agentId) || agents[0];
    
    // Add welcome message for the agent if no history exists for them or just as a reset
    setMessages([
      {
        id: `wel-${agentId}-${Date.now()}`,
        sender: 'agent',
        agentId: agentId,
        text: `Hi, I'm ${targetAgent.name} (${targetAgent.title}). ${targetAgent.description} How can I assist you with your active product workspace today?`,
        timestamp: 'Just now'
      }
    ]);
    setAttachedItem(null);
  };

  // Prepares the response logic
  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() && !attachedItem) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: attachedItem ? `[Attached: ${attachedItem.type} - "${attachedItem.title}"]\n\n${text}` : text,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachmentMenuOpen(false);
    setIsTyping(true);
    setTypingLogs([]);

    // Save attached item context
    const contextItem = attachedItem;
    setAttachedItem(null);

    // 2. Simulated Multi-Agent Thinking Log sequences
    const steps = [
      `Initializing agent node [${activeAgent.name}]...`,
      `Retrieving product context for ProductOS Core Platform...`,
      contextItem ? `Ingesting attached context [${contextItem.type}: ${contextItem.title}]...` : `Scanning active workspace index...`,
      `Synthesizing user instructions and cross-referencing capabilities...`,
      `Generating strategic response recommendations...`
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < steps.length) {
        setTypingLogs(prev => [...prev, steps[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
        
        // Respond specifically based on Agent & Context!
        let responseText = '';
        if (selectedAgentId === 'strategy') {
          if (contextItem && contextItem.type === 'Backlog') {
            responseText = `### Strategy Assessment: Backlog Prioritization\nI have successfully evaluated **${contextItem.title}** against current market opportunity profiles.\n\n- **Strategic Value**: High. This item aligns directly with our primary unblocking goal of connecting third-party platforms.\n- **RICE Recalculation**: Based on Zoom feedback from MeditationsSpace, the impact rating should be increased to **2.0** (High Impact), resulting in a recalculated RICE score of **544**.\n- **Strategic Recommendation**: Elevate this to **Todo** status immediately. It is a vital building block for unblocking downstream workflows.`;
          } else if (contextItem && contextItem.type === 'Feedback') {
            responseText = `### Strategy Brief: Customer Feedback Alignment\nI have analyzed the feedback file **"${contextItem.title}"**.\n\n1. **Core Problem**: Manual admin work is creating a high-attrition bottleneck for product teams.\n2. **Strategic Impact**: 10+ hours wasted per week represents a major opportunity. Building the direct converter fits our mission of "automating repetitive PM work".\n3. **Priority Ranking**: This unblocks a massive PM cohort. Recommend immediately spinning up a dedicated sprint branch.`;
          } else {
            responseText = `### Strategy Analysis: Core Core Platform\nBased on my ongoing assessment of the **ProductOS Core Platform**:\n\n1. **Current Alignment**: 84% - Excellent general compliance, but a strategic gap is detected around the **Roadmap Planning Agent** (timing calculations rely on blank backlog estimates).\n2. **Top Strategic Leverage Point**: Implement the automated RICE sliders to sync RICE numeric values back to Jira stories. This connects strategic PM decisions with tactical developer execution lines.\n3. **Suggested Action**: Prompt me to "Prioritize Backlog" to view the updated RICE matrix rankings instantly.`;
          }
        } 
        else if (selectedAgentId === 'roadmap') {
          responseText = `### Roadmap Planning & Timing Projections\nI have analyzed your timeline and active roadmap allocation.\n\n- **Sprint 24 Goal**: "Integrate multi-channel insights pipeline".\n- **Current Milestone Confidence**: **88%** (high stability).\n- **Identified Dependency Risk**: The "Custom RICE Recalculator Sliders" (Next Month) depends heavily on the "Jira OAuth Gateway" being completed in Sprint 24. If Slack app triggers delay, the sliders will have no destination sink.\n- **Action Suggestion**: Keep close track of PILOT-201 and enforce strict daily standup gates.`;
        } 
        else if (selectedAgentId === 'insights') {
          responseText = `### Customer Insight Synthesis\nI have summarized raw feedback logs across Intercom, Support, and Slack channels.\n\n- **Primary Emerging Trend**: PMs are desperately asking for custom fields syncing. They are tired of calculating priorities in silos (Notion or Excel) and manually re-entering them in Jira.\n- **Critical Pain Point**: Support Ticket #4928 shows users are getting frustrated by "generic rollback steps".\n- **Opportunity Area**: Expand the Experiment Agent to request target dialects (e.g. Postgres vs. Snowflake) to draft ready-to-run DDL migration scripts.`;
        } 
        else if (selectedAgentId === 'engineering') {
          responseText = `### Engineering Audit & Delivery Risk Report\nI have parsed the code changes in active PRs and scanned backlog descriptions:\n\n1. **Duplicate Ticket Flag**: **PILOT-202** (Slack Team linkages OAuth) is an 85% description overlap with **PILOT-201** (Slack OAuth Setup). I recommend merging these tickets immediately to save 2-3 developer days.\n2. **Codebase Ingestion Performance**: Spanner index optimizations in PR #2 reduced feedback fetch latency to 42ms. Multi-agent processing queues are now safe from backend timeouts.\n3. **Strategic Rating**: Active team velocity is **42 points**, which is more than sufficient to close active Sprint 24 tasks if duplicates are pruned.`;
        } 
        else if (selectedAgentId === 'analytics') {
          responseText = `### Analytics & Retention Causation Brief\nAnalyzing SaaS telemetry parameters:\n\n- **Activation Rate Drop**: Activation rate decreased slightly in April (to 50%) before recovering to 65% in June. Cross-referencing logs show this was directly correlated with a bug in our Slack Webhook integration config.\n- **Retention Causation**: Users who connect **at least 3 integrations** (specifically Slack, Jira, and Notion) exhibit a **12-week retention rate of 78%**, compared to just **32%** for users who connect only 1 integration.\n- **Interactive Query suggestion**: Run the query "Why did activation decrease?" inside the Analytics dashboard to view the visual breakdown chart.`;
        } 
        else if (selectedAgentId === 'documentation') {
          responseText = `### Documentation Generator: User Stories\nBased on your active product specs, here is a production-ready User Story draft:\n\n#### PILOT-202: Custom RICE Calculator Sliders\n- **As a** Product Manager using ProductOS,\n- **I want to** adjust Reach, Impact, Confidence, and Effort sliders inline on any Backlog Card,\n- **So that** I can instantly see the recalculated RICE rank updated without page reloads.\n\n#### Rigorous Acceptance Criteria:\n1. **GIVEN** a Backlog Card with Reach=800, Impact=2.0, Confidence=90, Effort=3.0,\n   **WHEN** the user drags Reach to 1200,\n   **THEN** the RICE score must instantly recalculate to 720.\n2. **GIVEN** an active internet connection,\n   **WHEN** sliders are changed,\n   **THEN** the database should debounced-write (500ms) the values to local state, showing a "Saved" checkmark.`;
        }

        const agentMsg: Message = {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          agentId: selectedAgentId,
          text: responseText,
          timestamp: 'Just now'
        };

        setMessages(prev => [...prev, agentMsg]);
        setIsTyping(false);
      }
    }, 400);
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSend(suggestionText);
  };

  const handleAttachItem = (type: string, id: string, title: string) => {
    setAttachedItem({ type, id, title });
    setAttachmentMenuOpen(false);
  };

  return (
    <div id="ai-chat-view" className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-80px)] border border-zinc-900 rounded-xl overflow-hidden bg-zinc-950/40">
      {/* Sidebar: Agent List */}
      <div className="lg:col-span-1 border-r border-zinc-900 bg-zinc-950/60 p-4 overflow-y-auto space-y-4">
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-zinc-500 font-bold">Specialized AI Agents</h3>
          <p className="text-[10px] text-zinc-600 font-mono mt-0.5">Click to switch core conversation context</p>
        </div>

        <div className="space-y-1.5">
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id;
            return (
              <button
                id={`agent-tab-${agent.id}`}
                key={agent.id}
                onClick={() => selectAgent(agent.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 border-violet-500/50 shadow-sm shadow-violet-500/5'
                    : 'bg-transparent border-transparent hover:bg-zinc-900/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-lg">
                    {agent.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-200 leading-tight">{agent.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-mono">{agent.title}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Agent Persona Card */}
        <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wide">ACTIVE PERSONA</span>
          </div>
          <div>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              "{activeAgent.description}"
            </p>
            <div className="mt-2 pt-2 border-t border-zinc-900/60">
              <p className="text-[9px] uppercase font-mono tracking-wider text-zinc-500 font-bold">Custom Personality</p>
              <p className="text-[10px] text-zinc-400 font-mono italic mt-0.5">{activeAgent.personality}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Stage */}
      <div className="lg:col-span-3 flex flex-col h-full bg-zinc-950/20">
        {/* Chat Header */}
        <div className="px-4 py-3 border-b border-zinc-900/80 flex items-center justify-between bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">{activeAgent.avatar}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-sans font-bold text-sm text-zinc-100">{activeAgent.name}</h4>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono">{activeAgent.title}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono uppercase">CONTEXT PERSISTED</span>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isAgent = msg.sender === 'agent';
            const agent = agents.find(a => a.id === msg.agentId) || activeAgent;
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isAgent ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-zinc-900 flex-shrink-0 flex items-center justify-center border border-zinc-800">
                  {isAgent ? (
                    <span className="text-sm">{agent.avatar}</span>
                  ) : (
                    <User className="w-4 h-4 text-violet-400" />
                  )}
                </div>

                {/* Bubble */}
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 ${!isAgent && 'flex-row-reverse'}`}>
                    <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                      {isAgent ? agent.name : 'You'}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono">{msg.timestamp}</span>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed font-sans ${
                    isAgent 
                      ? 'bg-zinc-900/40 border-zinc-900 text-zinc-300' 
                      : 'bg-violet-950/20 border-violet-900/40 text-violet-100 whitespace-pre-wrap'
                  }`}>
                    {/* Simplified render formatting */}
                    {msg.text.split('\n').map((line, idx) => {
                      if (line.startsWith('### ')) {
                        return <h5 key={idx} className="font-display font-bold text-zinc-100 text-sm mt-3 mb-1 first:mt-0">{line.replace('### ', '')}</h5>;
                      }
                      if (line.startsWith('#### ')) {
                        return <h6 key={idx} className="font-sans font-bold text-zinc-200 text-xs mt-2 mb-1">{line.replace('#### ', '')}</h6>;
                      }
                      if (line.startsWith('- ')) {
                        return <div key={idx} className="pl-3 py-0.5 border-l border-zinc-800 text-zinc-400 mt-1">{line}</div>;
                      }
                      return <p key={idx} className="mt-1 first:mt-0">{line}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator & Deep logs */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 flex-shrink-0 flex items-center justify-center border border-zinc-800 animate-spin">
                <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-500 font-semibold">{activeAgent.name} is working</span>
                  <span className="w-1 h-1 rounded-full bg-violet-500 animate-ping"></span>
                </div>
                
                {/* Live Step logs */}
                <div className="p-3 rounded-xl bg-zinc-900/20 border border-zinc-900/50 space-y-1 font-mono text-[10px] text-zinc-500 w-80 max-w-full">
                  {typingLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 animate-fade-in">
                      <span className="text-violet-500 font-bold">✓</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-zinc-400 font-semibold animate-pulse">
                    <span className="text-violet-500 font-bold animate-spin">⟳</span>
                    <span>Synthesizing response specs...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Quick Suggestions Bar */}
        {!isTyping && (
          <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-900/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {getSuggestionsForAgent(selectedAgentId).map((suggest, idx) => (
              <button
                id={`chat-suggest-${idx}`}
                key={idx}
                onClick={() => handleSuggestionClick(suggest)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 text-[10px] font-medium rounded-full text-zinc-400 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
              >
                <span>{suggest}</span>
                <ArrowRight className="w-3 h-3 text-zinc-500" />
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/80 relative">
          {/* Selected Attachment Pill */}
          {attachedItem && (
            <div className="absolute -top-10 left-4 px-2.5 py-1 bg-zinc-900 border border-violet-800 text-[10px] font-mono text-violet-400 rounded-full flex items-center gap-1.5 shadow-md shadow-violet-950/10 animate-fade-in">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span>Attached: <strong>{attachedItem.type}</strong> - "{attachedItem.title}"</span>
              <button 
                id="remove-attach-btn"
                onClick={() => setAttachedItem(null)} 
                className="hover:text-white cursor-pointer ml-1 text-zinc-500 text-xs"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 relative">
            {/* Attachment Button */}
            <div className="relative">
              <button
                id="chat-attach-btn"
                onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                className="w-10 h-10 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Attach active workspace context"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {attachmentMenuOpen && (
                <div id="attachment-menu-popup" className="absolute bottom-12 left-0 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-2 z-30 space-y-1.5">
                  <p className="text-[10px] uppercase font-mono text-zinc-500 px-1.5 font-bold">Link Active Workspace Context</p>
                  
                  {/* PRDs list */}
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-zinc-600 px-1.5 font-mono">ACTIVE SPEC (PRDs)</p>
                    {prds.map(p => (
                      <button
                        id={`attach-prd-${p.id}`}
                        key={p.id}
                        onClick={() => handleAttachItem('PRD', p.id, p.title)}
                        className="w-full text-left px-2 py-1 hover:bg-zinc-800 rounded text-[11px] text-zinc-300 truncate block font-sans cursor-pointer"
                      >
                        📄 {p.title}
                      </button>
                    ))}
                  </div>

                  {/* Backlogs list */}
                  <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                    <p className="text-[9px] font-bold text-zinc-600 px-1.5 font-mono">BACKLOG ISSUE</p>
                    {backlogItems.slice(0, 3).map(b => (
                      <button
                        id={`attach-backlog-${b.id}`}
                        key={b.id}
                        onClick={() => handleAttachItem('Backlog', b.id, `${b.key}: ${b.title}`)}
                        className="w-full text-left px-2 py-1 hover:bg-zinc-800 rounded text-[11px] text-zinc-300 truncate block font-sans cursor-pointer"
                      >
                        ⚡ {b.key}: {b.title}
                      </button>
                    ))}
                  </div>

                  {/* Feedbacks list */}
                  <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                    <p className="text-[9px] font-bold text-zinc-600 px-1.5 font-mono">CUSTOMER INTERVIEW</p>
                    {feedbacks.slice(0, 2).map(f => (
                      <button
                        id={`attach-feedback-${f.id}`}
                        key={f.id}
                        onClick={() => handleAttachItem('Feedback', f.id, `${f.customerName} (${f.source})`)}
                        className="w-full text-left px-2 py-1 hover:bg-zinc-800 rounded text-[11px] text-zinc-300 truncate block font-sans cursor-pointer"
                      >
                        💡 {f.customerName} ({f.source})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <input
              id="chat-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${activeAgent.name}... (e.g. "Draft acceptance criteria" or "Assess delivery risks")`}
              className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 placeholder-zinc-500 transition-colors"
            />

            <button
              id="chat-send-btn"
              onClick={() => handleSend()}
              className="w-10 h-10 rounded-lg bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-colors shadow-sm shadow-violet-600/20 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
