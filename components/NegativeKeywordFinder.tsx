import React, { useState, useCallback } from 'react';
import { findNegativeKeywords } from '../services/geminiService';
import type { NegativeKeyword } from '../types';

const NegativeKeywordFinder: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [negativeKeywords, setNegativeKeywords] = useState<NegativeKeyword[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFind = useCallback(async () => {
    if (!keywords.trim()) {
      setError('Please enter some keywords.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setNegativeKeywords(null);
    try {
      const result = await findNegativeKeywords(keywords);
      if (result) {
        setNegativeKeywords(result);
      } else {
        setError('Failed to find negative keywords. The response was empty or invalid.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords]);
  
  const getMatchTypeClass = (matchType: 'Broad' | 'Phrase' | 'Exact') => {
    switch(matchType) {
        case 'Broad': return 'bg-purple-600/50 text-purple-200 border-purple-500';
        case 'Phrase': return 'bg-sky-600/50 text-sky-200 border-sky-500';
        case 'Exact': return 'bg-teal-600/50 text-teal-200 border-teal-500';
        default: return 'bg-slate-600/50 text-slate-200 border-slate-500';
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Negative Keyword Finder</h2>
        <p className="text-slate-400 mb-6">Enter your primary keywords to discover terms you should exclude to improve ROI.</p>

        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., running shoes for men, cheap flights to Bali"
          className="w-full h-28 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          disabled={isLoading}
        />

        {error && <p className="text-red-400 mt-3">{error}</p>}

        <button
          onClick={handleFind}
          disabled={isLoading}
          className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
        >
          {isLoading ? 'Finding...' : 'Find Negative Keywords'}
        </button>
      </div>

      {negativeKeywords && (
        <div className="mt-10 bg-slate-800 rounded-xl shadow-lg p-6">
           <h3 className="text-xl font-semibold text-blue-400 mb-4">Suggested Negative Keywords</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-slate-600 text-slate-400">
                        <tr>
                            <th className="p-3">Keyword</th>
                            <th className="p-3">Match Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {negativeKeywords.map((kw, index) => (
                            <tr key={index} className="border-b border-slate-700">
                                <td className="p-3 text-slate-200">{kw.keyword}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getMatchTypeClass(kw.matchType)}`}>
                                        {kw.matchType}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default NegativeKeywordFinder;
