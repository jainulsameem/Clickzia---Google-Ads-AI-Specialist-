import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
            <div className="flex-1 min-w-0">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
                        Google Ads <span className="text-blue-400">AI Strategist</span>
                    </h1>
                    <p className="mt-2 text-lg text-slate-300 truncate">
                        Generate, Analyze, and Optimize Your Ad Campaigns with AI
                    </p>
                </div>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;