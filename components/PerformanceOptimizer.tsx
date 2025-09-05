import React, { useState, useCallback } from 'react';
import { analyzePerformance } from '../services/geminiService';
import type { OptimizationAnalysis } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';


const PerformanceOptimizer: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [adCopy, setAdCopy] = useState('');
  const [landingPageUrl, setLandingPageUrl] = useState('');
  const [analysis, setAnalysis] = useState<OptimizationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!keywords.trim() || !adCopy.trim() || !landingPageUrl.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await analyzePerformance(keywords, adCopy, landingPageUrl);
      if (result) {
        setAnalysis(result);
      } else {
        setError('Failed to analyze performance. The response was empty or invalid.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [keywords, adCopy, landingPageUrl]);

  const handleDownload = useCallback(() => {
    if (!analysis) return;
    
    let content = `Performance Analysis Report\n`;
    content += `Keywords: ${keywords}\n`;
    content += `Landing Page: ${landingPageUrl}\n\n`;

    content += `--- SCORES ---\n`;
    content += `Quality Score Potential: ${analysis.qualityScorePotential}/10\n`;
    content += `Ad Rank Potential: ${analysis.adRankPotential}/10\n\n`;
    
    content += `--- OVERALL ASSESSMENT ---\n`;
    content += `${analysis.overallAssessment}\n\n`;

    content += `--- AD COPY SUGGESTIONS ---\n`;
    analysis.copySuggestions.forEach(s => content += `- ${s}\n`);
    content += `\n`;

    content += `--- LANDING PAGE SUGGESTIONS ---\n`;
    analysis.landingPageSuggestions.forEach(s => content += `- ${s}\n`);
    content += `\n`;
    
    content += `--- KEYWORD SUGGESTIONS ---\n`;
    analysis.keywordSuggestions.forEach(s => content += `- ${s}\n`);

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-analysis-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [analysis, keywords, landingPageUrl]);

  const ScoreCircle: React.FC<{ score: number; label: string }> = ({ score, label }) => (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            className="text-slate-700"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-green-400"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${score * 10}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-slate-300">{label}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Performance Optimizer</h2>
        <p className="text-slate-400 mb-6">Input your campaign details to get an AI-powered analysis and suggestions for improvement.</p>
        
        <div className="space-y-6">
          <textarea
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter your keywords, comma-separated"
            className="w-full h-24 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
          <textarea
            value={adCopy}
            onChange={(e) => setAdCopy(e.target.value)}
            placeholder="Paste your existing ad copy (headlines and descriptions)"
            className="w-full h-32 p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
          <input
            type="url"
            value={landingPageUrl}
            onChange={(e) => setLandingPageUrl(e.target.value)}
            placeholder="Enter your landing page URL (e.g., https://example.com)"
            className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Performance'}
            </button>
             {analysis && (
                <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center px-4 py-3 bg-slate-700 text-slate-200 font-semibold rounded-lg shadow-md hover:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500"
                >
                    <DownloadIcon />
                    <span className="ml-2">Download Report</span>
                </button>
            )}
        </div>
      </div>

      {analysis && (
        <div className="mt-10 bg-slate-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Analysis Results</h3>
          <div className="flex justify-center gap-12 mb-8">
            <ScoreCircle score={analysis.qualityScorePotential} label="Quality Score Potential" />
            <ScoreCircle score={analysis.adRankPotential} label="Ad Rank Potential" />
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Overall Assessment</h4>
              <p className="text-slate-300">{analysis.overallAssessment}</p>
            </div>
             <div>
              <h4 className="font-semibold text-blue-400 mb-2">Ad Copy Suggestions</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {analysis.copySuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Landing Page Suggestions</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {analysis.landingPageSuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Keyword Suggestions</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {analysis.keywordSuggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceOptimizer;