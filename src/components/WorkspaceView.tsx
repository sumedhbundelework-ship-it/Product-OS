/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PRD, Product } from '../types';
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  RefreshCw, 
  Send, 
  Check, 
  ChevronRight, 
  Info, 
  X, 
  ExternalLink, 
  ShieldAlert, 
  ListTodo, 
  Activity, 
  FileCode, 
  Settings2, 
  MessageCircle,
  Undo
} from 'lucide-react';

interface WorkspaceViewProps {
  prds: PRD[];
  setPrds: React.Dispatch<React.SetStateAction<PRD[]>>;
  products: Product[];
  selectedProductId: string;
}

// 20 Standard Compliance Sections defined in USER_REQUEST
const SECTIONS_METADATA = [
  { id: 1, key: 'exec_summary', title: '1. Executive Summary', label: 'Executive Summary', tip: 'Summarize what is being built, why it matters, and expected customer/business impact (Max 150 words).' },
  { id: 2, key: 'problem_statement', title: '2. Problem Statement', label: 'Problem Statement', tip: 'Detail user pain points, the current manual workflow, why current solutions fail, and supporting evidence.' },
  { id: 3, key: 'background', title: '3. Background', label: 'Background', tip: 'Describe the current product state, business context, existing limitations, and market opportunity.' },
  { id: 4, key: 'goals', title: '4. Goals', label: 'Goals', tip: 'Define quantitative and qualitative Business, Customer, Product, and Engineering goals.' },
  { id: 5, key: 'success_metrics', title: '5. Success Metrics', label: 'Success Metrics', tip: 'List measurable KPIs (Adoption, Retention, etc.) including current baseline, target, and measurement method.' },
  { id: 6, key: 'target_users', title: '6. Target Users', label: 'Target Users', tip: 'Specify primary/secondary personas, Jobs To Be Done (JTBD), and desired outcomes.' },
  { id: 7, key: 'user_stories', title: '7. User Stories', label: 'User Stories', tip: 'Comprehensive list formatted as "As a... I want... So that..." with priority, acceptance criteria, and dependencies.' },
  { id: 8, key: 'functional_requirements', title: '8. Functional Requirements', label: 'Functional Requirements', tip: 'Core requirements table specifying ID, Description, Priority, Business Value, Complexity, and Owner.' },
  { id: 9, key: 'non_functional_requirements', title: '9. Non-Functional Requirements', label: 'Non-Functional Requirements', tip: 'Detail security, performance targets, accessibility standards, availability SLA, and data compliance.' },
  { id: 10, key: 'user_flow', title: '10. User Flow', label: 'User Flow', tip: 'Outline step-by-step user journey, highlighting decision branches and potential friction points.' },
  { id: 11, key: 'ux_requirements', title: '11. UX Requirements', label: 'UX Requirements', tip: 'Define information architecture, wireframe recommendations, empty states, and accessibility guidelines.' },
  { id: 12, key: 'technical_considerations', title: '12. Technical Considerations', label: 'Technical Considerations', tip: 'Outline recommended APIs, database schema/migration adjustments, caching, and event logging.' },
  { id: 13, key: 'ai_requirements', title: '13. AI Requirements (If Applicable)', label: 'AI Requirements', tip: 'Define LLM model selection, prompt engineering strategy, context retrieval (RAG), and evaluation latency.' },
  { id: 14, key: 'analytics_requirements', title: '14. Analytics Requirements', label: 'Analytics Requirements', tip: 'List custom telemetry events to track (e.g., Feature Ingested, AI Suggestion Accepted).' },
  { id: 15, key: 'experimentation_plan', title: '15. Experimentation Plan', label: 'Experimentation Plan', tip: 'Detail hypothesis, primary/guardrail metrics, A/B testing design, and rollback triggers.' },
  { id: 16, key: 'risks', title: '16. Risks', label: 'Risks', tip: 'List critical technical, business, security, and operational risks, each with solid mitigation plans.' },
  { id: 17, key: 'dependencies', title: '17. Dependencies', label: 'Dependencies', tip: 'Outline internal engineering, design, legal, or third-party API dependencies required for delivery.' },
  { id: 18, key: 'out_of_scope', title: '18. Out of Scope', label: 'Out of Scope', tip: 'Explicitly specify what will NOT be built in this iteration to prevent creeping scope.' },
  { id: 19, key: 'rollout_strategy', title: '19. Rollout Strategy', label: 'Rollout Strategy', tip: 'Define release phases (Alpha, Private Beta, Public Beta, GA), feature flags, and post-launch monitoring.' },
  { id: 20, key: 'open_questions', title: '20. Open Questions', label: 'Open Questions', tip: 'List unresolved design assumptions, pending technical validations, or user testing inquiries.' }
];

export default function WorkspaceView({
  prds,
  setPrds,
  products,
  selectedProductId
}: WorkspaceViewProps) {
  const [selectedPrdId, setSelectedPrdId] = useState<string>(prds[0]?.id || '');
  const [isExported, setIsExported] = useState<boolean>(false);
  const [exportTarget, setExportTarget] = useState<string>('');
  
  // Editing Modes
  // 'document' = raw markdown editor/viewer
  // 'interactive' = section-by-section structured editor
  const [editMode, setEditMode] = useState<'document' | 'interactive'>('interactive');
  const [selectedSectionId, setSelectedSectionId] = useState<number>(1);
  
  // Wizard variables
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [wizardTitle, setWizardTitle] = useState<string>('');
  const [wizardInput, setWizardInput] = useState<string>('');
  const [wizardModel, setWizardModel] = useState<string>('gemini-2.5-pro');
  const [wizardStrategy, setWizardStrategy] = useState<string>('full-20-section');
  const [wizardProgress, setWizardProgress] = useState<string[]>([]);
  const [isWizardRunning, setIsWizardRunning] = useState<boolean>(false);

  // Compliance state (recalculated whenever active PRD or edits change)
  const [complianceScore, setComplianceScore] = useState<number>(85);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditFlashed, setAuditFlashed] = useState<boolean>(false);

  // Chat/Co-Pilot state
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; proposal?: { sectionId: number; text: string } }>>([
    { 
      sender: 'agent', 
      text: "Greetings! I am DocPilot, your Principal PM compliance co-pilot. I am ready to review your PRD against Atlassian and Linear benchmarks. Select one of the quick actions below, or ask me to draft specific requirements!" 
    }
  ]);
  const [isChatTyping, setIsChatTyping] = useState<boolean>(false);

  const activePrd = prds.find(p => p.id === selectedPrdId);
  const parsedSections = activePrd ? parsePrdSections(activePrd.documentText) : {};

  // Parse Raw Markdown Text into 20 sections
  function parsePrdSections(text: string): Record<number, string> {
    const sections: Record<number, string> = {};
    for (let i = 1; i <= 20; i++) {
      sections[i] = '';
    }
    
    if (!text) return sections;
    
    // Regular expression to find "## X. Section Title"
    const headerRegex = /##\s+(\d+)\.\s+([^\n]+)/g;
    const matches: Array<{ id: number; start: number; title: string }> = [];
    
    let match;
    while ((match = headerRegex.exec(text)) !== null) {
      const id = parseInt(match[1]);
      if (id >= 1 && id <= 20) {
        matches.push({
          id,
          title: match[2],
          start: match.index + match[0].length
        });
      }
    }
    
    // Sort chronologically by occurrence index
    matches.sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];
      // End index is either the start of the next header or the end of the text
      const end = next ? text.lastIndexOf('##', next.start - current.title.length - 12) : text.length;
      
      let sectionContent = text.substring(current.start, end).trim();
      sections[current.id] = sectionContent;
    }
    
    return sections;
  }

  // Re-build standard 20-section Markdown format from section object
  function rebuildPrdMarkdown(sections: Record<number, string>): string {
    let md = '';
    SECTIONS_METADATA.forEach(sec => {
      const content = sections[sec.id]?.trim() || '*(Awaiting input)*';
      md += `## ${sec.title}\n${content}\n\n`;
    });
    return md.trim();
  }

  // Save changes to active PRD
  const handleUpdateSectionContent = (sectionId: number, newContent: string) => {
    if (!activePrd) return;
    
    const updatedSections = { ...parsedSections, [sectionId]: newContent };
    const updatedMarkdown = rebuildPrdMarkdown(updatedSections);
    
    setPrds(prev => prev.map(p => {
      if (p.id === activePrd.id) {
        return {
          ...p,
          documentText: updatedMarkdown,
          status: 'Ready'
        };
      }
      return p;
    }));
  };

  // Raw Markdown Editor Change Handler
  const handleRawMarkdownChange = (newText: string) => {
    if (!activePrd) return;
    
    setPrds(prev => prev.map(p => {
      if (p.id === activePrd.id) {
        return {
          ...p,
          documentText: newText,
          status: 'Ready'
        };
      }
      return p;
    }));
  };

  // Self-Review Audit checklist rules calculated based on content depth
  const checklistItems = [
    { label: 'Problem defined', solved: (parsedSections[2]?.length > 80), ref: 2, msg: 'Describe pain points in Section 2.' },
    { label: 'Goals are measurable', solved: (parsedSections[4]?.toLowerCase().includes('target') || parsedSections[4]?.toLowerCase().includes('%') || parsedSections[4]?.length > 60), ref: 4, msg: 'Add numeric targets in Section 4.' },
    { label: 'Success metrics actionable', solved: (parsedSections[5]?.toLowerCase().includes('baseline') && parsedSections[5]?.toLowerCase().includes('target')), ref: 5, msg: 'Define baseline & target in Section 5.' },
    { label: 'User stories are complete', solved: (parsedSections[7]?.toLowerCase().includes('as a') && parsedSections[7]?.toLowerCase().includes('so that')), ref: 7, msg: 'Write full user stories in Section 7.' },
    { label: 'Requirements testable', solved: (parsedSections[8]?.toLowerCase().includes('fr-1') && parsedSections[8]?.length > 100), ref: 8, msg: 'Add high-value specs in Section 8.' },
    { label: 'Risks documented', solved: (parsedSections[16]?.length > 80 && parsedSections[16]?.toLowerCase().includes('mitigation')), ref: 16, msg: 'Define risk mitigations in Section 16.' },
    { label: 'MVP scope is realistic', solved: (parsedSections[18]?.length > 50), ref: 18, msg: 'Explicitly define Out of Scope in Section 18.' },
    { label: 'Analytics defined', solved: (parsedSections[14]?.toLowerCase().includes('track') || parsedSections[14]?.toLowerCase().includes('event')), ref: 14, msg: 'Define tracked user events in Section 14.' },
    { label: 'Rollout strategy complete', solved: (parsedSections[19]?.toLowerCase().includes('beta') || parsedSections[19]?.toLowerCase().includes('flag')), ref: 19, msg: 'Outline private/public phases in Section 19.' },
    { label: 'AI recommendations justified', solved: (parsedSections[13]?.toLowerCase().includes('gemini') || parsedSections[13]?.length > 30), ref: 13, msg: 'Add AI model & prompt rules in Section 13.' }
  ];

  // Calculate dynamic compliance percentage
  useEffect(() => {
    const solvedCount = checklistItems.filter(item => item.solved).length;
    const score = Math.min(100, Math.max(20, Math.round((solvedCount / checklistItems.length) * 100)));
    setComplianceScore(score);
  }, [activePrd?.documentText]);

  // Run dynamic spec audit
  const runSpecAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditFlashed(true);
      setTimeout(() => setAuditFlashed(false), 2000);
    }, 1200);
  };

  // Repair missing sections automatically with simulated elite PM intelligence
  const autoRepairPrd = () => {
    if (!activePrd) return;
    setIsAuditing(true);
    
    setTimeout(() => {
      const updatedSections = { ...parsedSections };
      
      // Patch empty/incomplete sections with world-class templates
      if (!checklistItems[2].solved) { // Success Metrics
        updatedSections[5] = `- **Primary KPI: Adoption Rate**  
  - *Baseline*: 0% active integration.  
  - *Target*: 45% of active workspaces connecting accounts within 30 days.  
  - *Measurement*: Ingest triggers / active OAuth tokens.
- **Secondary KPI: Daily Active Draft Creation**  
  - *Baseline*: 1.2 drafts per week.  
  - *Target*: 4.0 completed drafts per week.  
  - *Measurement*: Inbound webhook completed events.`;
      }
      
      if (!checklistItems[3].solved) { // User Stories
        updatedSections[7] = `- **Story PILOT-301: Trigger Slash Draft**  
  - **As a** Product Manager inside a shared team channel,  
  - **I want to** type \`/productos-draft [thread-link]\`,  
  - **So that** the multi-agent builder compiles a draft spec directly inside my active workspace.  
  - *Priority*: High  
  - *Acceptance Criteria*: Chronologically gathers 20 messages, ignores automated spam bots, and triggers immediate webhook to ProductOS server.  
  - *Dependencies*: Slack OAuth handshake completed.`;
      }

      if (!checklistItems[6].solved) { // Out of Scope
        updatedSections[18] = `- **Real-time Voice/Video audio transcriptions**: Voice notes will be deferred to v2.0 as they require heavy speech-to-text models.
- **Multi-user collaborative concurrent typing canvas**: Real-time canvas editing is out of scope; edits will be managed via sequential draft locks.`;
      }

      if (!checklistItems[7].solved) { // Analytics
        updatedSections[14] = `- **Event: Ingest Webhook Received** (Properties: Channel ID, User Role, Thread Length)
- **Event: Section Edited** (Properties: Section ID, Characters Changed, Interaction Time)
- **Event: Export Pushed** (Properties: Target System ["Jira", "Notion"], Success Status)`;
      }

      const updatedMarkdown = rebuildPrdMarkdown(updatedSections);
      
      setPrds(prev => prev.map(p => {
        if (p.id === activePrd.id) {
          return {
            ...p,
            documentText: updatedMarkdown,
            status: 'Ready'
          };
        }
        return p;
      }));
      setIsAuditing(false);
    }, 1500);
  };

  // Preset prompts for the Wizard
  const fillPresetWizard = (type: 'slack' | 'feedback' | 'jira') => {
    if (type === 'slack') {
      setWizardTitle('Slack Ingestion Webhook Gateway');
      setWizardInput(`Slack Conversation thread transcript:
[10:05 AM] Sarah Jenkins (PM): "Our customers are complaining they have to manually map custom prioritisation scores back to Jira boards. It takes hours of copy pasting between ProductOS and Jira stories. Any plans to sync custom numbers directly to Jira?"
[10:07 AM] Alex Rivera (Staff Eng): "Jira APIs support writing custom fields, but we need to authenticate users via OAuth and map our local Reach, Impact, Confidence, Effort custom numbers correctly. Mismatched field types could corrupt issues."
[10:08 AM] Sanjay (Architect): "We also need to define conflicts. If two users edit priorities in Jira and ProductOS simultaneously, which one wins? I suggest ProductOS overrides Jira."`);
    } else if (type === 'feedback') {
      setWizardTitle('CRM Auto-Ingestion and Cluster Pipeline');
      setWizardInput(`Customer Feedback Summary:
"Intercom support notes show 35 enterprise SaaS companies are asking to sync customer zoom transcripts directly into their active roadmap. Currently, PMs must manually download cloud transcripts and highlight pain points. We want an automated scheduler that scans authorized folders every 12 hours, extracts the transcripts, analyzes sentiment, and tags existing epic cards."`);
    } else if (type === 'jira') {
      setWizardTitle('AI-Driven Task Auto-Sizing Core');
      setWizardInput(`Business Goal & Jira Ticket Context:
"We want to implement PILOT-104. Use historical velocity metrics to automatically recommend standard t-shirt sizes (XS, S, M, L, XL) for incoming backlog tasks. Need an onboarding slider and prompt model configurations so PMs can calibrate estimations before applying them."`);
    }
  };

  // Form Submission for Generator Wizard
  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wizardTitle.trim() || !wizardInput.trim()) return;

    setIsWizardRunning(true);
    setWizardProgress([]);

    const steps = [
      'DocPilot Agent: Ingesting raw ideation thread context...',
      'DocPilot Agent: Analyzing business problem and target customer...',
      'StrategyPilot: Formulating quantitative success metrics and business goals...',
      'EngPilot: Synthesizing core technical considerations, APIs, and risks...',
      'MapPilot: Planning MVP rollout strategy and dependencies...',
      'DocPilot Agent: Structuring full 20-Section Product Requirements Document (PRD)...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setWizardProgress(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        
        // Generate complete 20 section PRD text based on input
        const generatedMarkdown = `## 1. Executive Summary
We are building ${wizardTitle} to address severe product workflow inefficiencies. By utilizing advanced AI modeling, this feature automates complex PM work, transforming rough inputs and unstructured customer comments into structured actionable assets. This unblocks delivery and drives core SaaS engagement.

## 2. Problem Statement
Users face massive overhead in manually consolidating information. Current solutions require copy-pasting raw feedback across fragmented screens, resulting in critical specifications getting lost or misaligned.

## 3. Background
Based on feedback: "${wizardInput.substring(0, 160)}...", this solves a crucial gap in our ecosystem, opening opportunities to scale in B2B enterprise spaces.

## 4. Goals
- **Business**: Boost activation rates by 25% and retention by 15%.
- **Customer**: Save 8+ hours per week of manual drafting.
- **Product**: Progressive streaming generation under 12s with high-fidelity compliance.
- **Engineering**: Support secure REST webhooks with low latency.

## 5. Success Metrics
- **Adoption Rate**: Baseline: 0%, Target: 40% active workspaces.
- **Activation Rate**: Baseline: 40%, Target: 70% within 14 days.
- **Task Completion Rate**: Baseline: 30%, Target: 80% on draft finalize.

## 6. Target Users
- **Primary Persona**: Sumedh, B2B SaaS Product Manager.
- **Secondary Persona**: Sanjay, Systems Architect.
- **JTBD**: "When we receive unstructured feedback, we want to compile a rigorous PRD instantly to save Sunday admin work."

## 7. User Stories
- **As a** PM, **I want to** generate specifications from raw chat notes, **so that** I can instantly prioritize stories. (Priority: High, Acceptance: Chronological parsing, Dependencies: Ingestion API)

## 8. Functional Requirements
- **FR-1**: Context input canvas and preset template triggers. (Priority: High, Value: High, Complexity: Low, Owner: Sumedh B)
- **FR-2**: Multi-agent compilation broker coordinating strategy, design, and risks. (Priority: High, Value: High, Complexity: High, Owner: Sanjay K)
- **FR-3**: Section editor with inline coaching tips. (Priority: High, Value: High, Complexity: Medium, Owner: Alex R)

## 9. Non-Functional Requirements
- **Performance**: High availability, <12s generation latency.
- **Security**: SOC2 compliant. End-to-end token encryption.

## 10. User Flow
1. PM enters raw idea notes or selects a feedback preset.
2. Clicks "Generate" to trigger multi-agent analysis.
3. System outputs full 20-section spec.
4. User edits individual sections or syncs with Jira.

## 11. UX Requirements
- **IA**: Dual-column layout. Left: Ingest parameters. Right: 20-Section preview.
- **Empty States**: Friendly setup guide cards.

## 12. Technical Considerations
- **APIs**: REST custom mapping API.
- **Database**: PostgreSQL with Spanner index composite keys.

## 13. AI Requirements (If Applicable)
- **Model**: ${wizardModel === 'gemini-2.5-pro' ? 'Gemini 2.0 Pro' : 'Gemini 2.0 Flash'}.
- **Prompt**: Persona prompt chains separating specifications, requirements, and risks.

## 14. Analytics Requirements
- Track "PRD Generated" with template metadata.
- Track "Section Quick Edit" with section ID.

## 15. Experimentation Plan
- **Hypothesis**: Prominent setup banner increases active integration completion by 30%.
- **Design**: 50/50 randomized split.

## 16. Risks
- **Technical**: API token rate limits. Mitigation: Implement redis queue.
- **AI**: Structural hallucination. Mitigation: Strict prompt constraints.

## 17. Dependencies
- **Security**: Read scope approvals.
- **Design**: Figma canvas prototype.

## 18. Out of Scope
- Voice speech-to-text notes parsing in phase 1.
- Global multilingual outputs.

## 19. Rollout Strategy
- **Internal Alpha**: Sprint 25.
- **Private Beta**: Next Month.
- **GA**: Q3 Release.

## 20. Open Questions
- Can we auto-compute default RICE scores for generated user stories?
- Do we need custom Jira mappings for relational database schemas?`;

        const newPrd: PRD = {
          id: `prd-${Date.now()}`,
          title: wizardTitle,
          productId: selectedProductId,
          author: 'Sumedh Bundele (Senior PM)',
          status: 'Ready',
          dateCreated: new Date().toISOString().split('T')[0],
          documentText: generatedMarkdown,
          summary: `An AI-compiled specification for ${wizardTitle} based on raw feedback, structured utilizing Atlassian guidelines.`,
          missingRequirements: ['Requires engineering verification on Spanner query paths.'],
          risks: ['API limits on downstream webhooks.'],
          assumptions: ['Users have authenticated Workspace tokens.'],
          acceptanceCriteria: ['Verify end-to-end webhook ingestion takes less than 12 seconds.'],
          improvements: ['Add custom database dialect mapping selectors.']
        };

        setPrds(prev => [newPrd, ...prev]);
        setSelectedPrdId(newPrd.id);
        setIsWizardRunning(false);
        setShowWizard(false);
        setWizardTitle('');
        setWizardInput('');
      }
    }, 600);
  };

  // Chat actions
  const handleChatQuickAction = (action: string) => {
    setIsChatTyping(true);
    const userMsg = { sender: 'user' as const, text: `Trigger action: ${action}` };
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let agentResponseText = '';
      let proposalObj = undefined;

      if (action.includes('Stories')) {
        agentResponseText = `### AI Drafted User Stories (Principal PM)
Here are high-fidelity user stories matching Atlassian criteria for Section 7:

- **PILOT-701: Thread Right-Click Ingestion**
  - **As a** PM inside a shared workspace channel,
  - **I want to** right-click any thread and click "Draft PRD with ProductOS",
  - **So that** I can auto-generate a spec draft immediately.
  - *Priority*: High
  - *Acceptance*: Parses 10+ nested chronological text responses; filters out images.

- **PILOT-702: Live Progress Ingestion Terminal**
  - **As a** PM awaiting PRD generation,
  - **I want to** see live agent progress logs,
  - **So that** I know exactly which section is being written.
  - *Priority*: Medium
  - *Acceptance*: Streams 6 distinct thinking states chronologically.

Click **Apply Draft** below to inject these stories directly into your spec!`;
        
        proposalObj = {
          sectionId: 7,
          text: `- **PILOT-701: Thread Right-Click Ingestion**
  - **As a** PM inside a shared workspace channel,
  - **I want to** right-click any thread and click "Draft PRD with ProductOS",
  - **So that** I can auto-generate a spec draft immediately.
  - *Priority*: High
  - *Acceptance*: Parses 10+ nested chronological text responses; filters out images.

- **PILOT-702: Live Progress Ingestion Terminal**
  - **As a** PM awaiting PRD generation,
  - **I want to** see live agent progress logs,
  - **So that** I know exactly which section is being written.
  - *Priority*: Medium
  - *Acceptance*: Streams 6 distinct thinking states chronologically.
  - *Dependencies*: WebSocket connections.`
        };
      } 
      else if (action.includes('Metrics')) {
        agentResponseText = `### AI Drafted Success Metrics (Principal PM)
Here is a measurable KPI matrix for Section 5:

- **Metric 1: Generation Success Rate**
  - *Baseline*: 30% of drafts manually completed.
  - *Target*: 85% of drafts completed or exported to Jira.
  - *Measurement*: Telemetry state change events.

- **Metric 2: Team Collaboration Speed**
  - *Baseline*: 5 days from feedback to groomed backlog.
  - *Target*: <24 hours.
  - *Measurement*: Duration from first webhook trigger to ticket sync.

Click **Apply Draft** below to merge this directly!`;
        
        proposalObj = {
          sectionId: 5,
          text: `- **Metric 1: Generation Success Rate**
  - *Baseline*: 30% of drafts manually completed.
  - *Target*: 85% of drafts completed or exported to Jira.
  - *Measurement*: Telemetry state change events.

- **Metric 2: Team Collaboration Speed**
  - *Baseline*: 5 days from feedback to groomed backlog.
  - *Target*: <24 hours.
  - *Measurement*: Duration from first webhook trigger to ticket sync.`
        };
      } 
      else if (action.includes('Risks')) {
        agentResponseText = `### AI Audited Risks & Mitigations (Principal PM)
Here is a comprehensive risk register with mitigations for Section 16:

- **Risk: Slack API webhook rate limits** (Complexity: High)
  - *Impact*: Corporate workspaces with high traffic may hit Slack limits, causing dropped payloads.
  - *Mitigation*: Introduce Redis backend task queues. Immediately return HTTP 200 to Slack, and parse drafts asynchronously.

- **Risk: Multimodal image hallucination** (Complexity: Medium)
  - *Impact*: Ingesting whiteboard drawings can generate nonsensical database requirements.
  - *Mitigation*: Fall back to a "Requires Human Review" warning badge if model confidence on image analysis is <85%.`;
        
        proposalObj = {
          sectionId: 16,
          text: `- **Risk: Slack API webhook rate limits**
  - *Impact*: Corporate workspaces with high traffic may hit Slack limits, causing dropped payloads.
  - *Mitigation*: Introduce Redis backend task queues. Immediately return HTTP 200 to Slack, and parse drafts asynchronously.

- **Risk: Multimodal image hallucination**
  - *Impact*: Ingesting whiteboard drawings can generate nonsensical database requirements.
  - *Mitigation*: Fall back to a "Requires Human Review" warning badge if model confidence on image analysis is <85%.`
        };
      } 
      else {
        agentResponseText = `### AI Drafted Analytics Events (Principal PM)
Here is a tracking schema for Section 14:

- **Event: Slack Thread Ingested**
  - *Description*: Tracked when a user initiates draft creation.
  - *Properties*: Thread Message Count, Channel Privacy Type, User Role.

- **Event: Spec Exported**
  - *Description*: Tracked when a PM exports stories to Jira/Notion.
  - *Properties*: Export Target, Stories Created Count, Active Sync Toggled.`;
        
        proposalObj = {
          sectionId: 14,
          text: `- **Event: Slack Thread Ingested**
  - *Description*: Tracked when a user initiates draft creation.
  - *Properties*: Thread Message Count, Channel Privacy Type, User Role.

- **Event: Spec Exported**
  - *Description*: Tracked when a PM exports stories to Jira/Notion.
  - *Properties*: Export Target, Stories Created Count, Active Sync Toggled.`
        };
      }

      setChatMessages(prev => [...prev, { sender: 'agent', text: agentResponseText, proposal: proposalObj }]);
      setIsChatTyping(false);
    }, 1000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatTyping(true);

    setTimeout(() => {
      // General professional response
      const agentResponse = `I have reviewed your inquiry regarding: **"${userMsg}"**. 

Based on my Principal PM background, that is highly relevant. To address this, I suggest updating **Section ${selectedSectionId} (${SECTIONS_METADATA.find(s => s.id === selectedSectionId)?.label})** with these structured constraints:

1. **Explicit Edge Cases**: Ensure offline state behaviors are specified.
2. **Standardization**: Use Atlassian standard schema fields for bi-directional synchronization paths.

If you'd like me to draft specific requirements text for this section, click one of the quick action buttons or describe what you want me to write!`;

      setChatMessages(prev => [...prev, { sender: 'agent', text: agentResponse }]);
      setIsChatTyping(false);
    }, 1200);
  };

  const handleApplyProposal = (proposal: { sectionId: number; text: string }) => {
    handleUpdateSectionContent(proposal.sectionId, proposal.text);
    
    // Add success system message to chat
    setChatMessages(prev => [
      ...prev, 
      { sender: 'agent', text: `✓ **Successfully merged AI content directly into Section ${proposal.sectionId} (${SECTIONS_METADATA.find(s => s.id === proposal.sectionId)?.label})!** The compliance audit checklist has been dynamically recalculated.` }
    ]);
  };

  // Export Trigger Simulation
  const handleExport = (target: string) => {
    setExportTarget(target);
    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
    }, 3000);
  };

  return (
    <div id="prd-agent-view" className="space-y-6">
           {/* Header Panel */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-zinc-900/80">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-mono rounded-full font-bold border border-violet-500/15 flex items-center gap-1.5 shadow-sm shadow-violet-500/5">
              <Activity className="w-3 h-3 animate-pulse text-violet-400" />
              <span>DOCPILOT CORE ENABLED</span>
            </span>
            <span className="text-zinc-500 font-mono text-xs tracking-tight font-semibold">• 15+ Yrs B2B PM Experience</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight font-sans flex items-center gap-2">
            PRD Agent & Workspace
          </h2>
          <p className="text-zinc-400 text-sm max-w-3xl leading-relaxed">
            Transform raw Slack chat logs, unstructured client transcripts, or simple product descriptions into rigorous, industry-compliant, 20-section Product Requirements Documents (PRDs) with an instant quality-score audit.
          </p>
        </div>

        {/* Explaining agent card & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-4">
          <div className="px-4 py-3 bg-zinc-900/10 border border-violet-500/10 rounded-xl max-w-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500/20"></div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-violet-400">Agent Spec & Next Action</p>
            <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed font-sans">
              Select an active spec below or click the <strong className="text-zinc-300">AI Draft Wizard</strong> to auto-generate a full spec from integrated Slack/Jira mock signals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Active Product / Spec Picker */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-900 rounded-xl px-2.5 py-1">
              <select
                id="prd-select"
                value={selectedPrdId}
                onChange={(e) => {
                  setSelectedPrdId(e.target.value);
                  setExportTarget('');
                }}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none border-none cursor-pointer font-sans py-1.5 pr-2"
              >
                {prds.filter(p => p.productId === selectedProductId).map(p => (
                  <option key={p.id} value={p.id} className="bg-zinc-950 text-zinc-300">{p.title}</option>
                ))}
              </select>
            </div>

            <button 
              id="btn-show-draft-prd"
              onClick={() => setShowWizard(true)}
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl shadow-md shadow-violet-600/10 flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>AI Draft Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Column: Section Rail (if Interactive edit mode) or list */}
        <div className="xl:col-span-3 space-y-4">
                 {/* Section Navigation Rail */}
          <div className="p-4.5 rounded-2xl bg-zinc-900/15 border border-zinc-900/80 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-900/40">
              <h3 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                PRD SECTIONS
              </h3>
              <div className="flex items-center gap-1 bg-zinc-950 p-0.5 rounded-lg border border-zinc-900">
                <button
                  id="tab-interactive-mode"
                  onClick={() => setEditMode('interactive')}
                  className={`text-[9px] font-bold font-mono px-2 py-1 rounded-md transition-colors ${
                    editMode === 'interactive' ? 'bg-zinc-900 text-violet-400 border border-zinc-850' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Interactive
                </button>
                <button
                  id="tab-markdown-mode"
                  onClick={() => setEditMode('document')}
                  className={`text-[9px] font-bold font-mono px-2 py-1 rounded-md transition-colors ${
                    editMode === 'document' ? 'bg-zinc-900 text-violet-400 border border-zinc-850' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Markdown
                </button>
              </div>
            </div>

            {editMode === 'interactive' ? (
              <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1">
                {SECTIONS_METADATA.map((sec) => {
                  const isSelected = selectedSectionId === sec.id;
                  const contentLen = parsedSections[sec.id]?.length || 0;
                  const isPopulated = contentLen > 15;
                  
                  return (
                    <button
                      id={`prd-sec-nav-${sec.id}`}
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'bg-zinc-900 border-violet-500/30 text-violet-400 font-bold' 
                          : 'bg-transparent border-transparent text-zinc-400 hover:bg-zinc-900/20 hover:text-zinc-200'
                      }`}
                    >
                      <span className="truncate pr-1">{sec.label}</span>
                      <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded ${
                        isPopulated ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-zinc-950 text-zinc-600 border border-zinc-900'
                      }`}>
                        {isPopulated ? 'OK' : 'EMPTY'}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 text-center space-y-2">
                <FileCode className="w-6 h-6 text-zinc-600 mx-auto" />
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Standard Atlassian markdown editor active. Edit all 20 sections in a single unified text block.
                </p>
                <button 
                  onClick={() => setEditMode('interactive')}
                  className="text-[10px] font-bold text-violet-400 hover:text-violet-300"
                >
                  ← Switch back to Section Rail
                </button>
              </div>
            )}
          </div>

          {/* Compliance Score Audit Card */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">Compliance Audit</h4>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                complianceScore >= 90 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                complianceScore >= 60 ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {complianceScore}% PASS
              </span>
            </div>

            {/* Circular score display */}
            <div className="flex items-center gap-4 bg-zinc-950/60 p-3 rounded-lg border border-zinc-900/80">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="#18181b" strokeWidth="4" fill="transparent" />
                  <circle cx="24" cy="24" r="20" stroke="#8b5cf6" strokeWidth="4" fill="transparent" 
                    strokeDasharray={125.6} strokeDashoffset={125.6 - (125.6 * complianceScore) / 100} />
                </svg>
                <span className="font-mono text-xs font-bold text-zinc-200">{complianceScore}%</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-zinc-500 block">AUDITED STATE</span>
                <span className="text-xs text-zinc-300 font-semibold block leading-tight">
                  {complianceScore >= 90 ? 'Executive Approved' : 'Product Gaps Detected'}
                </span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-zinc-500 font-bold">10-Point Self-Review Checks</div>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {checklistItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px]">
                    <button
                      onClick={() => {
                        setEditMode('interactive');
                        setSelectedSectionId(item.ref);
                      }}
                      className="mt-0.5 hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {item.solved ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-zinc-600" />
                      )}
                    </button>
                    <span className={item.solved ? 'text-zinc-400' : 'text-zinc-500 line-through'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit CTA */}
            <div className="pt-1 flex gap-2">
              <button
                id="btn-re-audit"
                onClick={runSpecAudit}
                disabled={isAuditing}
                className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 text-[10px] font-semibold rounded-lg font-mono flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                <span>{isAuditing ? 'Scanning...' : 'Re-Audit Spec'}</span>
              </button>
              {complianceScore < 100 && (
                <button
                  id="btn-auto-repair"
                  onClick={autoRepairPrd}
                  disabled={isAuditing}
                  className="flex-1 py-1.5 bg-violet-950 hover:bg-violet-900 text-violet-400 border border-violet-800/40 hover:border-violet-700 text-[10px] font-semibold rounded-lg font-mono flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Repair</span>
                </button>
              )}
            </div>
            {auditFlashed && (
              <p className="text-[9px] font-mono text-emerald-400 text-center animate-pulse">
                ✓ Dynamic audit scan complete. State synchronized.
              </p>
            )}
          </div>

        </div>

        {/* Center Column: Specification Canvas (Active Document or Selected Section) */}
        <div className="xl:col-span-6 space-y-4">
          
          {activePrd ? (
            <div className="rounded-xl bg-zinc-900/40 border border-zinc-900 p-5 space-y-4">
              
              {/* Info summary */}
              <div className="pb-3 border-b border-zinc-900/80 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-zinc-100">{activePrd.title}</h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    Written by <strong className="text-zinc-400">{activePrd.author}</strong> • Date: {activePrd.dateCreated}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 font-mono text-[9px]">
                  <span className="text-zinc-600">Export:</span>
                  <button 
                    onClick={() => handleExport('Confluence')}
                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-zinc-200 border border-zinc-800 cursor-pointer"
                  >
                    Confluence
                  </button>
                  <button 
                    onClick={() => handleExport('Notion')}
                    className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-zinc-200 border border-zinc-800 cursor-pointer"
                  >
                    Notion
                  </button>
                </div>
              </div>

              {/* Toast notifier */}
              {isExported && (
                <div id="export-success-toast" className="p-3 bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 rounded-lg text-xs flex items-center gap-2 animate-fade-in font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Exported to <strong>{exportTarget}</strong>! Requirements successfully synced.</span>
                </div>
              )}

              {/* Editing Canvas */}
              {editMode === 'interactive' ? (
                /* Interactive Structured Section Edit Mode */
                <div className="space-y-4">
                  {/* Title & Coaching tip banner */}
                  <div className="p-3.5 rounded-lg bg-zinc-950/60 border border-zinc-900/80 space-y-1.5">
                    <div className="flex items-center gap-2 text-violet-400">
                      <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                      <h4 className="font-display font-bold text-xs text-zinc-200 uppercase tracking-wide">
                        DocPilot PM Coaching Advice
                      </h4>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                      {SECTIONS_METADATA.find(s => s.id === selectedSectionId)?.tip}
                    </p>
                  </div>

                  {/* Section Title & Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                        Section {selectedSectionId} • Interactive Input
                      </span>
                      <span className="text-[9px] font-mono text-zinc-600">Markdown enabled</span>
                    </div>
                    <textarea
                      id="prd-section-editor"
                      rows={12}
                      value={parsedSections[selectedSectionId] || ''}
                      onChange={(e) => handleUpdateSectionContent(selectedSectionId, e.target.value)}
                      placeholder={`Draft standard content for ${SECTIONS_METADATA.find(s => s.id === selectedSectionId)?.label}...`}
                      className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-900 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 font-mono leading-relaxed resize-y h-[320px]"
                    />
                  </div>

                  {/* Navigator Footer inside compiler */}
                  <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
                    <button
                      onClick={() => setSelectedSectionId(prev => Math.max(1, prev - 1))}
                      disabled={selectedSectionId === 1}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-400 cursor-pointer border border-zinc-800"
                    >
                      ← Previous Section
                    </button>
                    <span className="text-zinc-500 font-bold">Section {selectedSectionId} / 20</span>
                    <button
                      onClick={() => setSelectedSectionId(prev => Math.min(20, prev + 1))}
                      disabled={selectedSectionId === 20}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 rounded text-zinc-400 cursor-pointer border border-zinc-800"
                    >
                      Next Section →
                    </button>
                  </div>
                </div>
              ) : (
                /* Raw Markdown Document Editor Mode */
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                      Complete Document Text (Atlassian Markdown Formatted)
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">Unified Mode</span>
                  </div>
                  <textarea
                    id="prd-document-raw-editor"
                    rows={20}
                    value={activePrd.documentText}
                    onChange={(e) => handleRawMarkdownChange(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-900 rounded-lg text-[11px] text-zinc-300 focus:outline-none focus:border-violet-500 font-mono leading-relaxed h-[440px]"
                  />
                </div>
              )}

              {/* Missing Requirements Audit List */}
              <div className="pt-4 border-t border-zinc-900/80 grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-xs">
                <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1 text-rose-400 font-semibold uppercase text-[10px] font-mono">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Unresolved logic gaps</span>
                  </div>
                  <ul className="space-y-1 list-disc pl-3 text-zinc-400 leading-normal">
                    {activePrd.missingRequirements?.slice(0, 2).map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                    {(!activePrd.missingRequirements || activePrd.missingRequirements.length === 0) && (
                      <li className="text-zinc-500 italic">No logical gaps detected in latest scan.</li>
                    )}
                  </ul>
                </div>

                <div className="p-3 bg-zinc-950/40 border border-zinc-900 rounded-lg space-y-1.5">
                  <div className="flex items-center gap-1 text-zinc-400 font-semibold uppercase text-[10px] font-mono">
                    <Info className="w-3.5 h-3.5" />
                    <span>Open assumptions</span>
                  </div>
                  <ul className="space-y-1 list-disc pl-3 text-zinc-400 leading-normal">
                    {activePrd.assumptions?.slice(0, 2).map((ass, idx) => (
                      <li key={idx}>{ass}</li>
                    ))}
                    {(!activePrd.assumptions || activePrd.assumptions.length === 0) && (
                      <li className="text-zinc-500 italic">No custom assumptions flagged.</li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-zinc-500 bg-zinc-900/10 border border-zinc-900 rounded-xl">
              No spec selected or generated yet. Use the Wizard above to draft a feature PRD.
            </div>
          )}

        </div>

        {/* Right Column: DocPilot AI Compliance Co-Pilot Chat widget */}
        <div className="xl:col-span-3 space-y-4">
          
          {/* AI Advisor Card */}
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-900/80 space-y-3.5">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-900/60">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-violet-600 flex items-center justify-center font-mono text-[10px] font-bold text-white">
                  DP
                </div>
                <h4 className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                  DocPilot PM Advisor
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>

            {/* Quick Actions / Prompt Injection Chips */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wide block">Generate Quick Proposals</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  id="action-draft-stories"
                  onClick={() => handleChatQuickAction('Draft User Stories (Sec 7)')}
                  disabled={isChatTyping}
                  className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] text-zinc-300 text-left font-sans truncate cursor-pointer"
                >
                  ⚡ User Stories
                </button>
                <button
                  id="action-draft-metrics"
                  onClick={() => handleChatQuickAction('Plan Success Metrics (Sec 5)')}
                  disabled={isChatTyping}
                  className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] text-zinc-300 text-left font-sans truncate cursor-pointer"
                >
                  📈 KPIs & Metrics
                </button>
                <button
                  id="action-draft-risks"
                  onClick={() => handleChatQuickAction('Analyze Risks & Mitigations (Sec 16)')}
                  disabled={isChatTyping}
                  className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] text-zinc-300 text-left font-sans truncate cursor-pointer"
                >
                  🛡️ Risks / Mitigate
                </button>
                <button
                  id="action-draft-analytics"
                  onClick={() => handleChatQuickAction('Inject Analytics Events (Sec 14)')}
                  disabled={isChatTyping}
                  className="px-2 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[10px] text-zinc-300 text-left font-sans truncate cursor-pointer"
                >
                  🔍 Track Events
                </button>
              </div>
            </div>

            {/* Simulated Chat Feed */}
            <div className="bg-zinc-950/80 rounded-lg p-3 border border-zinc-900 h-[260px] overflow-y-auto space-y-3 font-sans text-xs">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`space-y-1.5 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">
                    {msg.sender === 'user' ? 'PM (You)' : 'DocPilot Co-Pilot'}
                  </span>
                  <div className={`p-2 rounded-lg leading-relaxed inline-block max-w-full text-left whitespace-pre-wrap ${
                    msg.sender === 'user' ? 'bg-zinc-900 text-zinc-300 border border-zinc-800' : 'bg-zinc-900/40 text-zinc-300 border border-zinc-900'
                  }`}>
                    {msg.text}
                    
                    {/* Proposal Action Block */}
                    {msg.proposal && (
                      <div className="mt-3 pt-2.5 border-t border-zinc-900 space-y-2">
                        <p className="text-[10px] font-semibold text-violet-400">Apply this compiled spec block directly?</p>
                        <button
                          onClick={() => msg.proposal && handleApplyProposal(msg.proposal)}
                          className="px-2.5 py-1 bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-semibold rounded cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Apply to Section {msg.proposal.sectionId}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isChatTyping && (
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">DocPilot</span>
                  <div className="p-2.5 bg-zinc-900/40 border border-zinc-900 rounded-lg text-zinc-500 font-mono text-[11px] animate-pulse">
                    DocPilot is drafting high-fidelity requirements...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="flex gap-2">
              <input
                id="chat-copilot-input"
                type="text"
                placeholder="Ask Co-Pilot to draft a section..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
              />
              <button
                id="chat-copilot-send-btn"
                type="submit"
                className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* AI Wizard Modal / Overlay Backdrop */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 bg-zinc-900/40 border-b border-zinc-900 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <h3 className="font-display font-bold text-sm text-zinc-100">
                  AI PRD Draft Wizard (Principal PM Persona)
                </h3>
              </div>
              <button 
                onClick={() => setShowWizard(false)} 
                className="text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleWizardSubmit} className="p-5 space-y-4">
              
              {/* Presets Ingestion Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Quick-Injest Context From Existing Sources
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => fillPresetWizard('slack')}
                    className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[11px] cursor-pointer flex items-center gap-1 font-sans"
                  >
                    <span>💬 Ingest Slack Chat Thread</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPresetWizard('feedback')}
                    className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[11px] cursor-pointer flex items-center gap-1 font-sans"
                  >
                    <span>💡 Ingest Support Zoom Note</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillPresetWizard('jira')}
                    className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded text-[11px] cursor-pointer flex items-center gap-1 font-sans"
                  >
                    <span>⚡ Ingest Jira Sprint Ticket</span>
                  </button>
                </div>
              </div>

              {/* Input Feature Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">PRD Document Title</label>
                <input
                  id="wizard-prd-title"
                  type="text"
                  required
                  value={wizardTitle}
                  onChange={(e) => setWizardTitle(e.target.value)}
                  placeholder="e.g. Automated Salesforce Contact Sync Gateway"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Input Raw Ingestion Area */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">
                  Raw Idea / Customer Pain Points / Inbound Context Notes
                </label>
                <textarea
                  id="wizard-prd-input"
                  required
                  rows={6}
                  value={wizardInput}
                  onChange={(e) => setWizardInput(e.target.value)}
                  placeholder="Paste rough product plans, slack transcripts, zoom recordings, or user stories..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              {/* Model selection & generation options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Select Generation Core</label>
                  <select
                    value={wizardModel}
                    onChange={(e) => setWizardModel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="gemini-2.5-pro">Gemini 2.0 Pro (High-Fidelity Strategy)</option>
                    <option value="gemini-2.5-flash">Gemini 2.0 Flash (Fast Token Queue)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Focus Output Strategy</label>
                  <select
                    value={wizardStrategy}
                    onChange={(e) => setWizardStrategy(e.target.value)}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                  >
                    <option value="full-20-section">Full 20-Section Standard compliance</option>
                    <option value="security-nfr">Focus on Security & NFR Constraints</option>
                    <option value="mvp-user-flow">Focus on MVP user story & flows</option>
                  </select>
                </div>
              </div>

              {/* Simulated active agent progress terminal */}
              {isWizardRunning && (
                <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-lg space-y-1.5 font-mono text-[10px] text-zinc-400">
                  <div className="flex items-center gap-1 text-violet-400 font-bold">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-violet-400" />
                    <span>DOCPILOT MULTI-AGENT THINKING LOG</span>
                  </div>
                  <div className="space-y-1 max-h-[120px] overflow-y-auto">
                    {wizardProgress.map((prog, idx) => (
                      <div key={idx} className="flex items-start gap-1 leading-normal">
                        <span className="text-violet-500 font-bold">➔</span>
                        <span>{prog}</span>
                      </div>
                    ))}
                    <div className="text-zinc-500 animate-pulse">Scanning backlog priorities and writing sections...</div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="wizard-generate-btn"
                type="submit"
                disabled={isWizardRunning}
                className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-lg shadow-sm shadow-violet-600/10 cursor-pointer transition-all disabled:opacity-50"
              >
                {isWizardRunning ? 'Processing Multi-Agent Context...' : 'Compile World-Class 20-Section PRD'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
