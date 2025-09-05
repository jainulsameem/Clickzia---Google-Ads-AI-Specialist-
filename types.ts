export enum AppTab {
  COPY_GENERATOR = 'COPY_GENERATOR',
  PERFORMANCE_OPTIMIZER = 'PERFORMANCE_OPTIMIZER',
  NEGATIVE_KEYWORDS = 'NEGATIVE_KEYWORDS',
}

export interface AdCopy {
  headlines: string[];
  longHeadlines: string[];
  descriptions: string[];
}

export interface OptimizationAnalysis {
  qualityScorePotential: number;
  adRankPotential: number;
  overallAssessment: string;
  copySuggestions: string[];
  landingPageSuggestions: string[];
  keywordSuggestions: string[];
}

export interface NegativeKeyword {
    keyword: string;
    matchType: 'Broad' | 'Phrase' | 'Exact';
}
