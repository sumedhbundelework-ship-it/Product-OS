/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Page {
  Dashboard = 'dashboard',
  Chat = 'chat',
  Workspace = 'workspace',
  Roadmap = 'roadmap',
  Backlog = 'backlog',
  CustomerInsights = 'insights',
  ResearchAgent = 'research',
  Experiments = 'experiments',
  Analytics = 'analytics',
  ReleaseNotes = 'releases',
  Integrations = 'integrations',
  Settings = 'settings'
}

export interface AIAgent {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  responsibilities: string[];
  personality: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  healthScore: number;
  currentSprint: string;
  sprintGoal: string;
  velocity: number;
}

export interface PRD {
  id: string;
  title: string;
  productId: string;
  author: string;
  status: 'Draft' | 'Analyzing' | 'Analyzed' | 'Ready';
  documentText: string;
  summary?: string;
  missingRequirements?: string[];
  risks?: string[];
  assumptions?: string[];
  acceptanceCriteria?: string[];
  improvements?: string[];
  dateCreated: string;
}

export interface BacklogItem {
  id: string;
  key: string;
  title: string;
  description: string;
  productId: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done';
  reach: number; // RICE
  impact: number; // RICE (0.25 to 3)
  confidence: number; // RICE (percentage, e.g. 80)
  effort: number; // RICE (person-months or arbitrary scale, e.g. 1-10)
  riceScore: number;
  duplicateOf?: string;
  clusterTag?: string;
  explanation?: string;
}

export interface CustomerFeedback {
  id: string;
  source: 'Slack' | 'Zoom' | 'Intercom' | 'HubSpot';
  customerName: string;
  companyName: string;
  content: string;
  date: string;
  analyzed: boolean;
  painPoints: string[];
  featureRequests: string[];
  opportunities: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
}

export interface RoadmapItem {
  id: string;
  title: string;
  productId: string;
  timeframe: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Next Month' | 'Sprint 24';
  status: 'Planned' | 'In Progress' | 'Shipped';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  owner: string;
}

export interface Experiment {
  id: string;
  title: string;
  productId: string;
  hypothesis: string;
  testDesign: string; // A/B test format, split etc.
  successMetrics: string[];
  rollbackPlan: string;
  status: 'Draft' | 'Running' | 'Completed' | 'Rolled Back';
  findings?: string;
}

export interface PullRequest {
  id: string;
  repo: string;
  title: string;
  author: string;
  mergedAt: string;
  details: string;
  impactScope: 'Major' | 'Minor' | 'Patch';
}

export interface Message {
  id: string;
  sender: 'user' | 'agent' | 'system';
  agentId?: string; // If sender is agent, which agent is speaking
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface Integration {
  id: string;
  name: string;
  category: 'issue_tracker' | 'vcs' | 'communication' | 'docs' | 'design';
  status: 'Connected' | 'Not Connected' | 'Connecting';
  description: string;
  logo: string;
}

export interface MetricPoint {
  date: string;
  value: number;
}

export interface Recommendation {
  id: string;
  agentId: string;
  title: string;
  description: string;
  impactScore: number; // 1-100
  actionLabel: string;
  targetPage: Page;
}
