import React, { useState, useCallback } from 'react';
import { generateAdCopy } from '../services/geminiService';
import type { AdCopy } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';

const AdCopyGenerator: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [adCopy, setAdCopy] = useState<AdCopy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!keywords.trim()) {
      setError('Please enter some keywords.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdCopy(null);
    try {
      const result = await generateAdCopy(keywords);
      if (result) {
        setAdCopy(result);
      } else {
        setError('Failed to generate ad copy. The response was empty or invalid.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultCard: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-blue-400 mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
            <span className="text-slate-200">{item}</span>
            <button
              onClick={() => handleCopy(item)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded-md transition-colors"
              title="Copy"
            >
              <ClipboardIcon copied={copied === item} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Ad Copy Generator</h2>
        <p className="text-slate-400 mb-6">Enter your target keywords to generate high-converting ad copy in seconds.</p>

        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., custom mechanical keyboards, ergonomic mouse, 4k gaming monitor"
          className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />

        {error && <p className="text-red-400 mt-3">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Ad Copy'
          )}
        </button>
      </div>

      {adCopy && (
        <div className="mt-10 grid gap-8 md:grid-cols-1">
            <ResultCard title="Headlines (max 30 chars)" items={adCopy.headlines} />
            <ResultCard title="Long Headlines (max 90 chars)" items={adCopy.longHeadlines} />
            <ResultCard title="Descriptions (max 90 chars)" items={adCopy.descriptions} />
        </div>
      )}
    </div>
  );
};

export default AdCopyGenerator;
