/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Page, Product, PRD, BacklogItem, CustomerFeedback, RoadmapItem, Experiment, Integration, Recommendation, AIAgent } from './types';
import { 
  INITIAL_AGENTS, 
  INITIAL_PRODUCTS, 
  INITIAL_PRDS, 
  INITIAL_BACKLOG, 
  INITIAL_FEEDBACK, 
  INITIAL_ROADMAP, 
  INITIAL_EXPERIMENTS, 
  INITIAL_PRS, 
  INITIAL_INTEGRATIONS, 
  INITIAL_RECOMMENDATIONS, 
  METRIC_ACTIVATION, 
  METRIC_CHURN, 
  METRIC_RETENTION 
} from './data';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ChatView from './components/ChatView';
import WorkspaceView from './components/WorkspaceView';
import RoadmapView from './components/RoadmapView';
import BacklogView from './components/BacklogView';
import InsightsView from './components/InsightsView';
import ResearchAgentView from './components/ResearchAgentView';
import ExperimentsView from './components/ExperimentsView';
import AnalyticsView from './components/AnalyticsView';
import ReleaseNotesView from './components/ReleaseNotesView';
import IntegrationsView from './components/IntegrationsView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');

  // Shared state engines
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [prds, setPrds] = useState<PRD[]>(INITIAL_PRDS);
  const [backlogItems, setBacklogItems] = useState<BacklogItem[]>(INITIAL_BACKLOG);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>(INITIAL_ROADMAP);
  const [feedbacks, setFeedbacks] = useState<CustomerFeedback[]>(INITIAL_FEEDBACK);
  const [experiments, setExperiments] = useState<Experiment[]>(INITIAL_EXPERIMENTS);
  const [integrations, setIntegrations] = useState<Integration[]>(INITIAL_INTEGRATIONS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);

  const activeProduct = INITIAL_PRODUCTS.find(p => p.id === selectedProductId) || INITIAL_PRODUCTS[0];

  // Callback to handle proactive recommendation action clicks
  const handleRecommendationAction = (targetPage: Page, recId: string) => {
    // Navigate to target page
    setCurrentPage(targetPage);
    
    // Perform a custom side-effect based on the recommendation clicked!
    if (recId === 'rec-1') {
      // Triggering "Merge duplicate backlog tickets" immediately!
      // This solves the PILOT-202 duplicate redundant issue in place, saving PM work.
      setBacklogItems(prev => prev.map(item => {
        if (item.id === 'backlog-2') { // PILOT-202
          return {
            ...item,
            status: 'Done',
            duplicateOf: undefined,
            title: `[MERGED BY RECOMMENDATION] ${item.title}`,
            description: `${item.description} (Merged into PILOT-201)`
          };
        }
        return item;
      }));
      // Remove recommendation from active list
      setRecommendations(prev => prev.filter(r => r.id !== recId));
    } else if (recId === 'rec-2') {
      // Deep focus on David Zhang Customer Interview
      // This unblocks the PM immediately inside Insights
      setRecommendations(prev => prev.filter(r => r.id !== recId));
    } else if (recId === 'rec-3') {
      // Highlighting / Strategic re-prioritisation alert
      setRecommendations(prev => prev.filter(r => r.id !== recId));
    }
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return (
          <DashboardView
            product={activeProduct}
            recommendations={recommendations}
            agents={agents}
            feedbackCount={feedbacks.length}
            backlogCount={backlogItems.filter(item => item.productId === selectedProductId).length}
            roadmapCount={roadmapItems.filter(item => item.productId === selectedProductId).length}
            experimentsCount={experiments.filter(item => item.productId === selectedProductId).length}
            onActionClick={handleRecommendationAction}
          />
        );
      case Page.Chat:
        return (
          <ChatView
            agents={agents}
            prds={prds}
            backlogItems={backlogItems}
            feedbacks={feedbacks}
          />
        );
      case Page.Workspace:
        return (
          <WorkspaceView
            prds={prds}
            setPrds={setPrds}
            products={INITIAL_PRODUCTS}
            selectedProductId={selectedProductId}
          />
        );
      case Page.Roadmap:
        return (
          <RoadmapView
            roadmapItems={roadmapItems}
            setRoadmapItems={setRoadmapItems}
            products={INITIAL_PRODUCTS}
            selectedProductId={selectedProductId}
          />
        );
      case Page.Backlog:
        return (
          <BacklogView
            backlogItems={backlogItems}
            setBacklogItems={setBacklogItems}
            products={INITIAL_PRODUCTS}
            selectedProductId={selectedProductId}
          />
        );
      case Page.CustomerInsights:
        return (
          <InsightsView
            feedbacks={feedbacks}
            setFeedbacks={setFeedbacks}
            products={INITIAL_PRODUCTS}
            selectedProductId={selectedProductId}
          />
        );
      case Page.ResearchAgent:
        return (
          <ResearchAgentView />
        );
      case Page.Experiments:
        return (
          <ExperimentsView
            experiments={experiments}
            setExperiments={setExperiments}
            products={INITIAL_PRODUCTS}
            selectedProductId={selectedProductId}
          />
        );
      case Page.Analytics:
        return (
          <AnalyticsView
            activationPoints={METRIC_ACTIVATION}
            churnPoints={METRIC_CHURN}
            retentionPoints={METRIC_RETENTION}
          />
        );
      case Page.ReleaseNotes:
        return (
          <ReleaseNotesView
            pullRequests={INITIAL_PRS}
          />
        );
      case Page.Integrations:
        return (
          <IntegrationsView
            integrations={integrations}
            setIntegrations={setIntegrations}
          />
        );
      case Page.Settings:
        return (
          <SettingsView
            agents={agents}
            setAgents={setAgents}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-zinc-500">
            Page coming soon.
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans select-none">
      {/* Primary Sidebar Panel */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        selectedProduct={selectedProductId}
        setSelectedProduct={setSelectedProductId}
        products={INITIAL_PRODUCTS}
      />

      {/* Main Display Stage */}
      <main id="main-content-scroll" className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {renderActivePage()}
        </div>
      </main>
    </div>
  );
}
