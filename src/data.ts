/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AIAgent, Product, PRD, BacklogItem, CustomerFeedback, RoadmapItem, Experiment, PullRequest, Integration, Recommendation, Page, MetricPoint } from './types';

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'strategy',
    name: 'StrategyPilot',
    title: 'Product Strategy Agent',
    avatar: '🎯',
    description: 'Expert in business impact modeling, market opportunity sizing, and structural strategic planning.',
    responsibilities: [
      'Calculates exact RICE and ROI rankings based on market feedback',
      'Detects strategic misalignment between active tasks and overall company goals',
      'Provides high-level opportunity summaries and risk matrices'
    ],
    personality: 'Analytical, objective, high-level, and strategic.'
  },
  {
    id: 'roadmap',
    name: 'MapPilot',
    title: 'Roadmap & Capacity Agent',
    avatar: '🗺️',
    description: 'Optimizes resource scheduling, capacity constraints, and critical path timeline generation.',
    responsibilities: [
      'Generates high-fidelity quarterly, monthly, and sprint roadmaps',
      'Proactively flags timing clashes, over-allocations, and dependencies',
      'Drafts drag-and-drop roadmap configurations based on backlog weights'
    ],
    personality: 'Structured, methodical, foresightful, and organized.'
  },
  {
    id: 'insights',
    name: 'InsightPilot',
    title: 'Customer Insights Agent',
    avatar: '💡',
    description: 'Sifts through unstructured CRM records, Zoom audio transcripts, and Slack chatter to distill real product opportunities.',
    responsibilities: [
      'Extracts key user pain points and direct feature requests automatically',
      'Clusters customer sentiments to identify emerging trends',
      'Identifies opportunity areas backed by user testimony'
    ],
    personality: 'Empathetic, investigative, trends-aware, and highly observant.'
  },
  {
    id: 'engineering',
    name: 'EngPilot',
    title: 'Engineering & Delivery Agent',
    avatar: '⚙️',
    description: 'Provides delivery confidence projections, sizing estimates, and technical risk assessments.',
    responsibilities: [
      'Monitors velocity trends and projects sprint delivery dates',
      'Sifts through backlog tickets to identify duplicate requirements',
      'Identifies legacy code risks and API dependency gaps early'
    ],
    personality: 'Pragmatic, technical, risk-averse, and highly detailed.'
  },
  {
    id: 'analytics',
    name: 'MetricPilot',
    title: 'Analytics & Trends Agent',
    avatar: '📊',
    description: 'Queries product telemetry, visualizes key user behavior metrics, and answers core product retention questions.',
    responsibilities: [
      'Answers metrics inquiries with contextual explanations and charts',
      'Generates optimized simulated queries and data-point arrays',
      'Discovers correlations between specific features and user retention'
    ],
    personality: 'Data-driven, precise, curious, and visual.'
  },
  {
    id: 'documentation',
    name: 'DocPilot',
    title: 'Documentation Agent',
    avatar: '📝',
    description: 'Automates document creation, summarizing PRDs, writing user stories, and generating release notes.',
    responsibilities: [
      'Summarizes long PRDs and points out missing logical requirements',
      'Writes highly modular Jira-compatible user stories with rigorous acceptance criteria',
      'Generates human-readable changelogs and release announcements from raw PRs'
    ],
    personality: 'Eloquently descriptive, exhaustive, structure-oriented, and concise.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'ProductOS Core Platform',
    description: 'The main dashboard and AI Agent execution engine integrating enterprise project managers.',
    healthScore: 84,
    currentSprint: 'Sprint 24 (Active)',
    sprintGoal: 'Integrate multi-channel insights pipeline and automated backlog prioritisations.',
    velocity: 42
  },
  {
    id: 'prod-2',
    name: 'AI Analytics Extension',
    description: 'Advanced data proxy, SQL generator, and automated anomaly tracker for SaaS telemetry.',
    healthScore: 91,
    currentSprint: 'Sprint 12 (Planning)',
    sprintGoal: 'Release early beta of retention causation modeling with visual breakdown.',
    velocity: 35
  }
];

export const INITIAL_PRDS: PRD[] = [
  {
    id: 'prd-101',
    title: 'Slack-to-PRD Instant Blueprint Generator',
    productId: 'prod-1',
    author: 'Sumedh Bundele (Senior PM)',
    status: 'Analyzed',
    dateCreated: '2026-06-20',
    documentText: `## 1. Executive Summary
Today, PMs waste days gathering scattered suggestions and chat snippets from customer-facing Slack channels, manual Intercom tickets, and feedback forms to compile product specs. This feature enables a PM to select a specific Slack channel or thread, invoke "/productos-draft", and automatically generate a high-fidelity, world-class 20-section PRD directly in their ProductOS Workspace. This eliminates hours of manual transcription, unblocks engineering, and ensures critical feedback is never lost.

## 2. Problem Statement
Product managers spend an estimated 10+ hours per week synthesizing raw chat comments and user suggestions into actionable specs. Key customer pain points, specific edge cases, and attachments are frequently buried or completely lost in high-velocity Slack threads. Standard tools fail to parse conversational threads chronologically, leading to severe scope misalignment and extensive engineering rework.

## 3. Background
With ProductOS v1.0, we have built local multi-agent backlog and prioritization engines, but lacks automatic ingestion pathways. Slack serves as the primary real-world interaction hub for customer feedback across rapid-growth B2B SaaS startups, presenting a major market opportunity to automate repetitive PM copywriting and analysis workflows.

## 4. Goals
- **Business**: Increase customer retention by 15% and workspace activation by 25%.
- **Customer**: Reclaim 8+ hours per week spent on manual PRD drafting and story writing.
- **Product**: Provide progressive, high-fidelity PRD drafts under 12 seconds with >90% compliance scores.
- **Engineering**: Support secure stateless webhooks with <200ms initial response latency.

## 5. Success Metrics
- **Adoption Rate**: Baseline: 0%, Target: 45% of active workspaces connecting Slack within 30 days. Measured via telemetry integration events.
- **Activation Rate**: Baseline: 50%, Target: 75% for teams generating at least 1 draft. Measured by Slack slash command triggers.
- **Task Completion Rate**: Baseline: 30%, Target: 85% of drafts finalized or exported to Jira. Measured by status state.

## 6. Target Users
- **Primary Persona**: Sumedh, Senior Product Manager at a fast-growing B2B startup. Needs fast spec compilation to unblock sprints.
- **Secondary Persona**: Sanjay, Lead Systems Architect. Needs clear technical context, database schemas, and rigorous acceptance criteria.
- **JTBD**: "When we have a detailed customer thread in Slack, we want to compile a rigorous PRD instantly so that engineers can groom the backlog with confidence."

## 7. User Stories
- **As a** B2B Product Manager, **I want to** select a Slack thread and invoke "/productos-draft", **so that** I can compile an immediate, editable 20-section PRD in my ProductOS workspace. (Priority: High, Acceptance: Chronologically parses 15+ messages with correct author mapping, Dependencies: Slack OAuth Gateway)
- **As a** Lead Systems Architect, **I want** the generated PRD to automatically suggest technical considerations and risks, **so that** I can assess delivery risk instantly. (Priority: Medium, Acceptance: AI generates structural API schema suggestions and mitigations)

## 8. Functional Requirements
- **FR-1**: Slack application integration with contextual right-click menu and message action triggers. (Priority: High, Value: High, Complexity: Low, Owner: Alex R)
- **FR-2**: Content extraction webhook parsing chronological threads, markdown text, and attached media assets. (Priority: High, Value: High, Complexity: Medium, Owner: Alex R)
- **FR-3**: Multi-agent summarization pipeline orchestrating strategic, engineering, and UX agents. (Priority: High, Value: High, Complexity: High, Owner: Sanjay K)
- **FR-4**: Formatting compiler structuring output into 20 standard compliance sections with direct export endpoints. (Priority: High, Value: High, Complexity: Low, Owner: Sumedh B)

## 9. Non-Functional Requirements
- **Performance**: Document compilation completed in <12 seconds with progressive chunk streaming status indicators.
- **Security**: SOC2 Type II compliance. OAuth tokens are strictly encrypted at rest in local databases. No LLM training on customer logs.
- **Scalability**: Ingestion pipeline supports threads of up to 200 messages without token overflow.

## 10. User Flow
1. Product Manager right-clicks a Slack thread and selects "Draft PRD with ProductOS".
2. System triggers secure webhook, verifies workspace OAuth credentials, and redirects PM to ProductOS Workspace.
3. Interactive Workspace terminal displays multi-agent thinking logs as sections are compiled.
4. Finished 20-section PRD draft is displayed with highlighted compliance audits.
5. User reviews, edits, and exports the finalized specification directly to Confluence or Jira.

## 11. UX Requirements
- **Information Architecture**: Split-screen design. Left: Raw inputs & active agent thinking log. Right: Structured 20-section reader.
- **Navigation**: Persistent quick-jump navigation sidebar matching the 20-section index.
- **Empty States**: High-contrast "Connect Slack Channel" card with a 3-step setup guide.
- **Loading States**: Shimmer text effects and simulated command-line progress logs.

## 12. Technical Considerations
- **APIs**: Slack Webhook Events API, Notion Workspace Pages API, and Jira Core REST v3.
- **Database**: PostgreSQL Spanner database utilizing indexed composite query paths for customer logs.
- **Caching**: Redis session storage caching active multi-agent generation states to prevent redundant token hits.

## 13. AI Requirements (If Applicable)
- **Model Selection**: Gemini 2.0 Pro for full specification writing, Gemini 1.5 Flash for fast tokenizing.
- **Prompt Strategy**: Prompt chaining separating Persona definitions, Requirements drafting, and Risk auditing.
- **RAG Approach**: Context retrieval using active Backlog items and Customer feedback vectors.

## 14. Analytics Requirements
- Track "Slack Ingestion Triggered" event with channel metadata.
- Track "PRD Section Manually Edited" with section ID and session duration.
- Track "PRD Draft Exported" with target type ("Jira", "Notion").

## 15. Experimentation Plan
- **Hypothesis**: Displaying an interactive "Create from Slack" card on blank workspace states will increase PRD generation rates by 30%.
- **Design**: 50/50 randomized split test on new signups. Group A receives the default blank dashboard. Group B receives the glowing setup banner.

## 16. Risks
- **Technical**: Slack API rate limit bottlenecks during concurrent enterprise team runs. Mitigation: Implement queueing using background redis tasks.
- **AI**: Potential hallucinations or unrealistic requirements. Mitigation: Mark sections with low-confidence scores as "Requires Product Validation".

## 17. Dependencies
- **Design**: High-fidelity Figma designs for split-view terminal and compliance checklist.
- **Legal**: Security audit of Slack workspace workspace-wide read scopes.
- **External**: Slack App Directory listing approval.

## 18. Out of Scope
- Direct voice note audio transcription inside Slack channels (deferred to Q4).
- Multilingual PRD translation output (deferred to v1.5).

## 19. Rollout Strategy
- **Internal Alpha**: Sprint 24 (Acme logistics sandbox).
- **Private Beta**: Next Month (Selected Series A B2B teams).
- **GA**: Q3 release gated by "slack-prd-funnel" feature flag.

## 20. Open Questions
- Do we need to parse image drawings in Slack threads using multimodal vision?
- Can we auto-calculate default RICE scores for generated user stories?
`,
    summary: 'An AI-driven feature that ingests raw Slack threads or channels to generate fully structured, executive-ready PRDs. It targets fast-moving B2B product managers who struggle to keep track of customer feedback and feature ideas buried in Slack conversations.',
    missingRequirements: [
      'Missing details on how attachments (specifically PDFs and images) are processed by the multimodal ingestion pipeline.',
      'Lacks concrete authorization and roles framework: Who in Slack has permission to invoke the draft generator?',
      'No explicit error handling outlined for when a thread is empty or has only non-text media.'
    ],
    risks: [
      'High security/privacy risk: PMs might accidentally ingest sensitive financial or PII feedback, violating local compliance.',
      'Usage cost spike: Processing extremely long threads with multiple recursive calls can run up high LLM token costs.',
      'Hallucinated acceptance criteria: AI might generate API endpoints or constraints that do not exist or are technically impossible.'
    ],
    assumptions: [
      'Assumes target users are already using the Slack Integration and have authenticated their ProductOS account.',
      'Assumes standard Slack Webhook payloads will contain full thread structures chronologically.'
    ],
    acceptanceCriteria: [
      'Scenario 1: Ingesting a 15-message thread with 3 feature request bullet points.\n- GIVEN a PM triggers the tool on a Slack thread,\n- WHEN the generation completes,\n- THEN a formal document with "Goals", "Scope", and "Requirements" is created, capturing all 3 requests accurately.',
      'Scenario 2: Exporting to Notion.\n- GIVEN an analyzed draft,\n- WHEN "Export" is clicked,\n- THEN a page is created in Notion via API, with correct headings and formatting.'
    ],
    improvements: [
      'Add a "Review & Filter" step before the PRD is generated, allowing PMs to exclude specific spam messages.',
      'Implement an automated cost-guard: Stop ingestion if a thread exceeds 200 messages, and suggest a manual subset instead.',
      'Provide an interactive Chat Box inside the PRD page to let the PM refine the document inline with the Documentation Agent.'
    ]
  },
  {
    id: 'prd-102',
    title: 'Custom RICE Calculator with Jira Bi-Directional Sync',
    productId: 'prod-1',
    author: 'Sumedh Bundele (Senior PM)',
    status: 'Draft',
    dateCreated: '2026-06-25',
    documentText: `## 1. Executive Summary
Strategic alignment between product direction and engineering execution is notoriously broken. Strategic scores (RICE) calculated by product leadership are buried in static documents, while developers continue implementing tickets without understanding their relative impact. This feature implements interactive Reach, Impact, Confidence, Effort (RICE) calculation sliders inside the ProductOS Backlog and establishes a bi-directional synchronization gateway back to corporate Jira story points and custom RICE fields. This aligns strategic PM decisions directly with tactical developer execution.

## 2. Problem Statement
Product managers invest days defining custom prioritisation matrices, yet these strategic calculations never reach the engineers working inside Jira. Engineers only see the generic "Medium/High" priority field. Mismatched prioritization leads to wasted development cycles on low-impact features, lack of alignment, and continuous manual priority tracking overhead.

## 3. Background
Our customer feedback channels (including Sarah Jenkins from Acme Logistics) indicate that the lack of RICE visibility in Jira is the primary bottleneck preventing wider enterprise adoption of backlog tools. This represents a major market opportunity to capture the enterprise PM market.

## 4. Goals
- **Business**: Reduce developer cycle waste on low-priority items by 35%.
- **Customer**: Unify strategic prioritization values seamlessly between product boards and developer queues.
- **Product**: Direct interactive sliders with debounced save and instantaneous backlog re-sorting.
- **Engineering**: Support bi-directional synchronization with Jira API with zero field corruption.

## 5. Success Metrics
- **Adoption Rate**: Baseline: 0%, Target: 60% of backlog items sync\'d to Jira within 2 weeks of release.
- **Activation Rate**: Baseline: 20%, Target: 80% of connected Jira projects enabling custom fields.
- **Time Saved**: Reclaim 4 hours per sprint of manual spreadsheet alignment.

## 6. Target Users
- **Primary Persona**: Sarah, Product Director at Acme Logistics. Needs to propagate roadmap weights directly to developer boards.
- **Secondary Persona**: Alex, Staff Engineer. Needs to understand which stories have highest business impact.
- **JTBD**: "When we recompute RICE weights, we want the numerical values to reflect on Jira stories so developers prioritize appropriately."

## 7. User Stories
- **As a** Product Director, **I want to** slide Reach and Effort values inline on any backlog ticket, **so that** the overall score is instantly updated and re-sorted without page reloads. (Priority: High, Acceptance: Recalculates dynamically with formula, Dependencies: None)
- **As an** Integration Engineer, **I want to** click "Sync to Jira", **so that** Reach, Impact, Confidence, and Effort values update their respective custom fields in Jira. (Priority: High, Acceptance: Triggers debounced API push, handles conflict resolution)

## 8. Functional Requirements
- **FR-1**: Responsive HTML5 backlog sliders for Reach, Impact, Confidence, Effort. (Priority: High, Value: High, Complexity: Low, Owner: Sumedh B)
- **FR-2**: Real-time RICE algebraic computation engine. (Priority: High, Value: High, Complexity: Low, Owner: Sumedh B)
- **FR-3**: Bi-directional Jira Sync Gateway handling schema mapping and custom field triggers. (Priority: High, Value: High, Complexity: High, Owner: Alex R)
- **FR-4**: Concurrent conflicts resolver handling simultaneous changes in ProductOS and Jira. (Priority: Medium, Value: High, Complexity: High, Owner: Sanjay K)

## 9. Non-Functional Requirements
- **Performance**: Backlog list updates and re-sorts in <100ms on client-side slider drag.
- **Security**: OAuth 2.0 Jira scope authorization strictly managed.
- **Availability**: Sync queues support robust offline retry queueing with exponential backoff.

## 10. User Flow
1. Product Manager opens Backlog view and selects an active ticket.
2. Adjusts "Reach" slider; score recalculates and visual ripple shows rank change.
3. Clicks "Sync to Jira" or enables "Auto-Sync".
4. Developer reviews corresponding ticket in Jira and sees strategic details populated.

## 11. UX Requirements
- **Information Architecture**: Backlog card expansion panel with integrated glowing RICE sliders.
- **Navigation**: Clean slider rail with tooltip indicators on drag.
- **Loading States**: Pulsing save icons showing database debounced-write status.

## 12. Technical Considerations
- **APIs**: Jira Custom Fields REST API, webhooks handler.
- **Database**: Local state synchronization with indexed debounced-save queues.
- **Caching**: Client-side state memoization to prevent re-render flickers.

## 13. AI Requirements (If Applicable)
- **Model Selection**: Gemini 2.0 Pro for analyzing ticket text and suggesting default reach/effort weights based on similar historic issues.
- **Context Retrieval**: Scan adjacent Jira tasks to identify average baseline story point weights.

## 14. Analytics Requirements
- Track "RICE Slider Dragged" with values.
- Track "Jira Sync Triggered" with success/failure status.
- Track "Priority Conflict Overruled".

## 15. Experimentation Plan
- **Hypothesis**: Pre-populating default RICE scores on import using AI increases active prioritisation engagements by 40%.
- **Design**: Test group is shown AI estimate default weights; control group has blanks.

## 16. Risks
- **Technical**: API Rate limits on Jira for large backlogs (>1,000 items). Mitigation: Debounce synchronizations and bundle requests in bulk batches.
- **Business**: Mismatched field types in Jira breaking the integration. Mitigation: Strong type validator on connection.

## 17. Dependencies
- **Engineering**: Backlog slider React component integration.
- **Security**: Corporate Jira admin token reviews.

## 18. Out of Scope
- Support for on-premise Jira Server configurations (cloud-only for v1.0).
- Syncing comments and chat threads (restricted to numeric prioritization fields).

## 19. Rollout Strategy
- **Internal Alpha**: Sprint 25.
- **Private Beta**: 2 weeks post-alpha.
- **GA**: 4 weeks post-alpha.

## 20. Open Questions
- If a developer modifies RICE in Jira and a PM does it in ProductOS simultaneously, who wins? (Recommendation: ProductOS wins by default).
- Do we support syncing Jira story points to RICE effort linearly?
`,
    summary: 'A bi-directional integration that syncs RICE scores and calculation variables (Reach, Impact, Confidence, Effort) between the ProductOS Backlog and Jira.',
    missingRequirements: [
      'Lacks schema mapping instructions for when custom fields do not exist in Jira.',
      'Need definition of conflicts: If a user modifies RICE in Jira and another does it in ProductOS simultaneously, who wins?'
    ],
    risks: [
      'API Rate limits on Jira side for large backlogs (>1,000 items).',
      'Data corruption if custom field types in Jira are mismatched (e.g., text instead of numerical).'
    ],
    assumptions: [
      'Users have admin access to their Jira project to enable custom field creation.',
      'A continuous webhook triggers when any backlog items are edited.'
    ],
    acceptanceCriteria: [
      'Verify RICE is recalculated as: (Reach * Impact * Confidence) / Effort.'
    ],
    improvements: [
      'Add an AI-suggested RICE scoring helper that analyses the historical description of a task to estimate its default Reach and Effort.'
    ]
  }
];

export const INITIAL_BACKLOG: BacklogItem[] = [
  {
    id: 'backlog-1',
    key: 'PILOT-201',
    title: 'Implement OAuth 2.0 flow for Slack and Confluence',
    description: 'Provide an enterprise-grade authentication scheme. Needs security audit, scopes configuration, and redirect URI management.',
    productId: 'prod-1',
    status: 'In Progress',
    reach: 800,
    impact: 2.0,
    confidence: 90,
    effort: 3.0,
    riceScore: 480,
    clusterTag: 'Authentication & Security',
    explanation: 'Highly strategic, required to unblock Slack ingest. Reach is wide (all accounts), confidence is high, moderate implementation effort.'
  },
  {
    id: 'backlog-2',
    key: 'PILOT-202',
    title: 'OAuth Integration for Slack Team Linkages',
    description: 'Set up an authorization gateway allowing teams to connect their Slack workspaces and authorize individual channel reads.',
    productId: 'prod-1',
    status: 'Todo',
    reach: 800,
    impact: 2.0,
    confidence: 85,
    effort: 2.5,
    riceScore: 544,
    clusterTag: 'Authentication & Security',
    duplicateOf: 'PILOT-201',
    explanation: 'EngPilot flagged this as a duplicate of PILOT-201. They both implement Slack authorization channels.'
  },
  {
    id: 'backlog-3',
    key: 'PILOT-104',
    title: 'AI-Powered Auto-Sizing Engine for Incoming Tasks',
    description: 'Use historical velocity data to automatically recommend t-shirt sizes (XS, S, M, L, XL) for raw backlog drafts.',
    productId: 'prod-1',
    status: 'Backlog',
    reach: 500,
    impact: 1.5,
    confidence: 70,
    effort: 4.0,
    riceScore: 131,
    clusterTag: 'AI Automation',
    explanation: 'Incredible delight factor for PMs, but confidence is medium since historical data models can be highly noisy.'
  },
  {
    id: 'backlog-4',
    key: 'PILOT-105',
    title: 'Bulk Export Selected Backlog Items to Jira Epics',
    description: 'Enable PMs to select multiple filtered issues, bundle them together, and write them directly into Jira as a formatted epic.',
    productId: 'prod-1',
    status: 'Todo',
    reach: 1200,
    impact: 3.0,
    confidence: 95,
    effort: 2.0,
    riceScore: 1710,
    clusterTag: 'Integrations Engine',
    explanation: 'Absolutely highest-priority enabler for PM workflows. Solves a major pain point of manual Jira entry with massive reach.'
  },
  {
    id: 'backlog-5',
    key: 'PILOT-303',
    title: 'Dynamic Feedback Ingestion Queue',
    description: 'A web-accessible queue interface displaying all ingested Intercom and HubSpot items awaiting AI summary categorization.',
    productId: 'prod-1',
    status: 'Done',
    reach: 1500,
    impact: 1.0,
    confidence: 100,
    effort: 1.5,
    riceScore: 1000,
    clusterTag: 'Insights Pipeline',
    explanation: 'Completed. Simplifies the PM feedback management workflow considerably.'
  }
];

export const INITIAL_FEEDBACK: CustomerFeedback[] = [
  {
    id: 'feed-1',
    source: 'Zoom',
    customerName: 'Marcus Aurelius',
    companyName: 'MeditationSpace (Series A SaaS)',
    date: '2026-06-25',
    sentiment: 'Positive',
    analyzed: true,
    content: `PM interview transcript snippet:
"Honestly, our product team is drowning. We get about 100 customer Slack messages a day. I spend my entire Sunday trying to read through them all, group them, and then figure out what Jira tickets we should write. If we could automatically turn a Slack thread into a well-defined user story or a PRD, it would easily save me 10 hours a week. It would be an absolute game-changer. Especially if we can sync it with Jira directly, because manually creating Jira stories is the absolute worst part of my job."`,
    painPoints: [
      'Spends 10+ hours/week manually reading and summarizing high-velocity Slack channels.',
      'Frustrated with the tedious manual creation of user stories and acceptance criteria inside Jira.'
    ],
    featureRequests: [
      'Instant conversion of Slack threads into fully structured PM specs (PRD, user story).',
      'Bi-directional synchronization of status and custom field values with Jira.'
    ],
    opportunities: [
      'Sponsor a high-visibility marketing campaign around "Reclaim your Sundays: AI-driven Jira generation".'
    ]
  },
  {
    id: 'feed-2',
    source: 'Slack',
    customerName: 'Sarah Jenkins',
    companyName: 'Acme Logistics (Enterprise ERP)',
    date: '2026-06-26',
    sentiment: 'Neutral',
    analyzed: true,
    content: `Slack channel #partner-feedback:
"Hey guys, we are loving the ProductOS backlog prioritizer, but we have a major bottleneck. We defined our custom RICE matrix in Notion, but we cannot sync these sliders back to our corporate Jira boards. Our engineers still only see the default Medium/High priority field, which does not reflect our deep strategic calculations. Any plans to sync custom numbers directly to Jira story points or custom RICE fields?"`,
    painPoints: [
      'Strategic prioritisation scores (RICE) calculated in ProductOS are not visible to the engineering team working inside Jira.'
    ],
    featureRequests: [
      'Direct synchronization of numerical RICE metrics to Jira Custom Fields.'
    ],
    opportunities: [
      'Build custom integration endpoints to unlock large enterprise teams who refuse to move engineering tasks out of Jira.'
    ]
  },
  {
    id: 'feed-3',
    source: 'Intercom',
    customerName: 'David Zhang',
    companyName: 'TaskFlow App (150-person SaaS)',
    date: '2026-06-27',
    sentiment: 'Negative',
    analyzed: false,
    content: `Support Ticket #4928:
"I am trying to run an experiment and plan success metrics in the Experiment Agent, but the UI is super confusing. It generated a hypothesis that is totally unrelated to our selected metric. Also, the rollback plan it wrote is way too generic ('revert deployment'). In an enterprise environment, we need a specific rollback strategy for database migration rollbacks."`,
    painPoints: [
      'Generated hypotheses feel detached from selected product metrics.',
      'Automated rollback plans are too high-level and lack real-world database migration guides.'
    ],
    featureRequests: [
      'Ability to select exact target database types to generate custom, context-specific rollback SQL sequences.'
    ],
    opportunities: [
      'Inject database dialect schemas into the Experiment Agent so it writes precise, functional migration rollback plans.'
    ]
  }
];

export const INITIAL_ROADMAP: RoadmapItem[] = [
  {
    id: 'road-1',
    title: 'Slack App Direct Ingestion Ingest Engine',
    productId: 'prod-1',
    timeframe: 'Sprint 24',
    status: 'In Progress',
    priority: 'High',
    description: 'Listen to Slack webhook threads, compile transcriptions, and pass to workspace core.',
    owner: 'EngPilot'
  },
  {
    id: 'road-2',
    title: 'Custom RICE Recalculator Sliders',
    productId: 'prod-1',
    timeframe: 'Next Month',
    status: 'In Progress',
    priority: 'High',
    description: 'Interactive client sliders on backlog item cards with immediate visual ranking updating.',
    owner: 'StrategyPilot'
  },
  {
    id: 'road-3',
    title: 'Advanced AI Rollback SQL Generator',
    productId: 'prod-1',
    timeframe: 'Q3',
    status: 'Planned',
    priority: 'Medium',
    description: 'Provides exact PostgreSQL and Spanner rollback sequence steps on failed experiment branches.',
    owner: 'EngPilot'
  },
  {
    id: 'road-4',
    title: 'Continuous CRM Sentiment Clustering Engine',
    productId: 'prod-1',
    timeframe: 'Q4',
    status: 'Planned',
    priority: 'Medium',
    description: 'Scans Salesforce and HubSpot notes every 12 hours to auto-update the Pain Points dashboard.',
    owner: 'InsightPilot'
  }
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-1',
    title: 'One-Click Slack Integration Funnel Opt-In',
    productId: 'prod-1',
    hypothesis: 'Adding a prominent "Connect Slack in 3 Seconds" visual card on the main PM Dashboard will increase integration completion rate by 25% by reducing onboarding friction.',
    testDesign: '50/50 split test. Group A sees the traditional sidebar integrations menu. Group B sees a glowing ambient banner card at the top center of their dashboard.',
    successMetrics: [
      'Primary: Integrations opt-in completion percentage (Target: >35% baseline).',
      'Secondary: App activation speed within 24 hours of sign-up.'
    ],
    rollbackPlan: 'Toggle the feature flag "onboarding-banner-funnel" immediately via Vercel Edge Config. No code deployment required.',
    status: 'Running'
  },
  {
    id: 'exp-2',
    title: 'Pre-populated RICE Scores on Import',
    productId: 'prod-1',
    hypothesis: 'Pre-populating reach, impact, confidence, and effort fields with AI estimations upon importing Jira tickets will increase RICE edit engagement by 40%.',
    testDesign: 'Randomized PM user allocation. Test group has AI estimates active; control group is shown blank slider values.',
    successMetrics: [
      'Slider edit interaction counts per session.',
      'Average tickets prioritized per product workspace.'
    ],
    rollbackPlan: 'Disable AI slider defaults hook using the database configuration panel.',
    status: 'Completed',
    findings: 'RICE edit engagement spiked by 65%. Control group users prioritized an average of 4 tickets, while test group users prioritized 12 tickets. Confidence estimations were highly praised.'
  }
];

export const INITIAL_PRS: PullRequest[] = [
  {
    id: 'pr-1',
    repo: 'productos-core-frontend',
    title: 'feat: add glowing RICE score sliders and interactive ordering',
    author: 'sumedh_dev',
    mergedAt: '2026-06-26 18:24',
    details: 'Implements fully animated Tailwind sliders under `/src/components/BacklogList.tsx`. Recalculates total score instantly on slide using standard physics easing. Triggers visual ripple on score rank improvement.',
    impactScope: 'Minor'
  },
  {
    id: 'pr-2',
    repo: 'productos-core-backend',
    title: 'fix: optimize Spanner query paths for Customer Feedback extraction',
    author: 'sanjay_architect',
    mergedAt: '2026-06-25 11:15',
    details: 'Adds proper indexing on `analyzed` boolean flag and `sentiment` enum. Reduces cold transcript ingestion query latency from 800ms to 42ms.',
    impactScope: 'Patch'
  },
  {
    id: 'pr-3',
    repo: 'productos-integrations-gateway',
    title: 'feat: add Slack Webhooks listener and raw text tokenizer',
    author: 'alex_integrations',
    mergedAt: '2026-06-24 09:30',
    details: 'Hooks up the standard API gateway receiver endpoints to handle Slack thread payload bodies. Sanitizes HTML tags and filters structural usernames before forwarding content to the summarization queues.',
    impactScope: 'Major'
  }
];

export const INITIAL_INTEGRATIONS: Integration[] = [
  { id: 'jira', name: 'Jira Software', category: 'issue_tracker', status: 'Connected', description: 'Bi-directional ticket sync, epic creation, and RICE fields update.', logo: '⚡' },
  { id: 'slack', name: 'Slack', category: 'communication', status: 'Connected', description: 'Ingest raw chat channels, threads, and dispatch automated status updates.', logo: '💬' },
  { id: 'github', name: 'GitHub', category: 'vcs', status: 'Connected', description: 'Monitor PR merges, commits, and auto-compile release logs.', logo: '🐙' },
  { id: 'linear', name: 'Linear', category: 'issue_tracker', status: 'Not Connected', description: 'Clean modern team sync, issue updates, and roadmap tagging.', logo: '📐' },
  { id: 'notion', name: 'Notion', category: 'docs', status: 'Connected', description: 'Direct workspace exports, PRD document reads, and team guides linking.', logo: '📓' },
  { id: 'confluence', name: 'Confluence', category: 'docs', status: 'Not Connected', description: 'Sync corporate document index with PRD analysis models.', logo: '🏢' },
  { id: 'google-drive', name: 'Google Drive', category: 'docs', status: 'Not Connected', description: 'Import PRDs and design brief documents seamlessly from folders.', logo: '📂' },
  { id: 'zoom', name: 'Zoom', category: 'communication', status: 'Not Connected', description: 'Fetch cloud video interview audio files for continuous insight summaries.', logo: '📹' },
  { id: 'figma', name: 'Figma', category: 'design', status: 'Connected', description: 'Ingest direct UI prototype comments and layout feedback.', logo: '🎨' }
];

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    agentId: 'engineering',
    title: 'Duplicate Tickets Detected',
    description: 'PILOT-202 appears to be a direct duplicate of PILOT-201 (OAuth setup). Review details to prevent dual-engineering.',
    impactScore: 92,
    actionLabel: 'Merge Tickets',
    targetPage: Page.Backlog
  },
  {
    id: 'rec-2',
    agentId: 'insights',
    title: 'Critical Support Ticket Unresolved',
    description: 'Ticket #4928 from David Zhang flags that experiment database rollbacks are too generic. Suggests adding specific dialect SQL outputs.',
    impactScore: 88,
    actionLabel: 'Analyze Feedback',
    targetPage: Page.CustomerInsights
  },
  {
    id: 'rec-3',
    agentId: 'strategy',
    title: 'Strategic Misalignment Warning',
    description: '"Advanced AI Rollback SQL Generator" (Q3) currently lacks associated customer interviews or direct requests. Re-verify prioritisation RICE values.',
    impactScore: 74,
    actionLabel: 'Review Priority',
    targetPage: Page.Backlog
  }
];

export const METRIC_ACTIVATION: MetricPoint[] = [
  { date: 'Jan 2026', value: 45 },
  { date: 'Feb 2026', value: 48 },
  { date: 'Mar 2026', value: 52 },
  { date: 'Apr 2026', value: 50 },
  { date: 'May 2026', value: 58 },
  { date: 'Jun 2026', value: 65 }
];

export const METRIC_CHURN: MetricPoint[] = [
  { date: 'Jan 2026', value: 4.8 },
  { date: 'Feb 2026', value: 4.5 },
  { date: 'Mar 2026', value: 4.2 },
  { date: 'Apr 2026', value: 4.6 },
  { date: 'May 2026', value: 3.8 },
  { date: 'Jun 2026', value: 3.1 }
];

export const METRIC_RETENTION: MetricPoint[] = [
  { date: 'Week 1', value: 92 },
  { date: 'Week 2', value: 81 },
  { date: 'Week 4', value: 74 },
  { date: 'Week 8', value: 68 },
  { date: 'Week 12', value: 64 }
];
