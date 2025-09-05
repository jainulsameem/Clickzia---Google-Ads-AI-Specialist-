import React, { useState, useCallback } from 'react';
import { AppTab } from './types';
import Header from './components/Header';
import AdCopyGenerator from './components/AdCopyGenerator';
import PerformanceOptimizer from './components/PerformanceOptimizer';
import NegativeKeywordFinder from './components/NegativeKeywordFinder';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { SearchIcon } from './components/icons/SearchIcon';
import { ShieldCheckIcon } from './components/icons/ShieldCheckIcon';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.COPY_GENERATOR);

  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case AppTab.COPY_GENERATOR:
        return <AdCopyGenerator />;
      case AppTab.PERFORMANCE_OPTIMIZER:
        return <PerformanceOptimizer />;
      case AppTab.NEGATIVE_KEYWORDS:
        return <NegativeKeywordFinder />;
      default:
        return <AdCopyGenerator />;
    }
  }, [activeTab]);

  const TabButton: React.FC<{
    tabId: AppTab;
    icon: React.ReactNode;
    label: string;
  }> = ({ tabId, icon, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center justify-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 ${
        activeTab === tabId
          ? 'bg-blue-600 text-white shadow-md'
          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
      }`}
    >
      {icon}
      <span className="ml-2.5">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-4xl mx-auto bg-slate-800/50 rounded-xl shadow-2xl p-2 mb-8 backdrop-blur-sm border border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <TabButton
              tabId={AppTab.COPY_GENERATOR}
              icon={<SparklesIcon />}
              label="Ad Copy Generator"
            />
            <TabButton
              tabId={AppTab.PERFORMANCE_OPTIMIZER}
              icon={<SearchIcon />}
              label="Performance Optimizer"
            />
            <TabButton
              tabId={AppTab.NEGATIVE_KEYWORDS}
              icon={<ShieldCheckIcon />}
              label="Negative Keywords"
            />
          </div>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini. Designed for modern advertisers.</p>
      </footer>
    </div>
  );
};

export default App;
