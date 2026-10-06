/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Page } from '../types';
import {
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Map,
  ListTodo,
  Lightbulb,
  Beaker,
  BarChart3,
  FileText,
  Share2,
  Settings,
  Sparkles,
  Command,
  HelpCircle,
  Users,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
  products: Array<{ id: string; name: string }>;
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  selectedProduct,
  setSelectedProduct,
  products
}: SidebarProps) {
  const groups = [
    {
      title: 'DISCOVERY',
      items: [
        { id: Page.CustomerInsights, label: 'Customer Insight Agent', icon: Lightbulb },
        { id: Page.ResearchAgent, label: 'Research Agent', icon: Compass }
      ]
    },
    {
      title: 'PLANNING',
      items: [
        { id: Page.Workspace, label: 'PRD Agent', icon: Briefcase },
        { id: Page.Roadmap, label: 'Roadmap Agent', icon: Map },
        { id: Page.Backlog, label: 'Backlog Agent', icon: ListTodo }
      ]
    },
    {
      title: 'EXECUTION',
      items: [
        { id: Page.Experiments, label: 'Experiment Agent', icon: Beaker },
        { id: Page.ReleaseNotes, label: 'Release Agent', icon: FileText }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: Page.Analytics, label: 'Analytics Agent', icon: BarChart3 },
        { id: Page.Chat, label: 'AI Chat', icon: MessageSquare, badge: '6' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: Page.Integrations, label: 'Integrations', icon: Share2 },
        { id: Page.Settings, label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside id="sidebar-panel" className="w-64 bg-zinc-950/80 backdrop-blur-md border-r border-zinc-900/80 flex flex-col h-screen overflow-hidden">
      {/* Brand & Team Switcher */}
      <div className="p-4.5 border-b border-zinc-900/60 flex flex-col gap-3">
        <button 
          id="sidebar-logo-button"
          onClick={() => setCurrentPage(Page.Dashboard)}
          className="flex items-center gap-2.5 px-1 text-left cursor-pointer focus:outline-none hover:opacity-90 transition-opacity group"
        >
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-violet-600 via-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-violet-400/20 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              ProductOS
              <span className="px-1.5 py-0.2 bg-violet-500/10 text-violet-400 text-[8px] font-mono rounded font-semibold border border-violet-500/25">PRO</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-tight">AI OPERATING SYSTEM • v1.0</p>
          </div>
        </button>

        {/* Product selector dropdown */}
        <div className="mt-1 space-y-1">
          <label className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold px-1 font-mono">Active Product</label>
          <div className="relative">
            <select
              id="active-product-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 text-xs rounded-lg text-zinc-200 font-sans focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500 transition-all duration-150 cursor-pointer appearance-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  📦 &nbsp;{p.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5.5">
        {/* Top-level Dashboard Button */}
        <div>
          <button
            id={`nav-${Page.Dashboard}`}
            onClick={() => setCurrentPage(Page.Dashboard)}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
              currentPage === Page.Dashboard
                ? 'bg-zinc-900 text-white border border-zinc-800/50 shadow-sm shadow-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 transition-colors ${currentPage === Page.Dashboard ? 'text-violet-400' : 'text-zinc-500'}`} />
              <span>Workspace Dashboard</span>
            </div>
            {currentPage === Page.Dashboard && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            )}
          </button>
        </div>

        {groups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            <h4 className="px-3 text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-widest leading-none">{group.title}</h4>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    id={`nav-${item.id}`}
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white border border-zinc-800/50 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-1.5 py-0.2 bg-violet-500/10 text-violet-400 text-[10px] font-mono font-bold rounded-full border border-violet-500/25">
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <span className="w-1 h-1 rounded-full bg-violet-400"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Roster / Status indicator */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/90 flex flex-col gap-2.5 font-mono text-[10px] text-zinc-500">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500 animate-pulse"></span>
            <span>Agent Co-Pilot Core</span>
          </div>
          <span className="text-zinc-600 font-bold">ONLINE</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 bg-zinc-900/30 py-1.5 rounded-lg border border-zinc-900/80">
          <Command className="w-3.5 h-3.5 text-zinc-600" />
          <span>Press <kbd className="bg-zinc-800 px-1 py-0.2 rounded text-[8px] text-zinc-400 border border-zinc-700 font-semibold">⌘</kbd> + <kbd className="bg-zinc-800 px-1 py-0.2 rounded text-[8px] text-zinc-400 border border-zinc-700 font-semibold">K</kbd> to search</span>
        </div>
      </div>
    </aside>
  );
}
