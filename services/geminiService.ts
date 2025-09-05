import { GoogleGenAI, Type } from "@google/genai";
import type { AdCopy, OptimizationAnalysis, NegativeKeyword } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

// FIX: Simplify JSON parsing. With `responseMimeType: "application/json"`, the API returns a clean JSON string, so stripping markdown is not needed.
const parseJsonResponse = <T,>(text: string): T | null => {
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", text, e);
        return null;
    }
};

export const generateAdCopy = async (keywords: string): Promise<AdCopy | null> => {
    const prompt = `
        Act as an expert Google Ads copywriter. Given the following keywords, create a compelling set of ad copy.
        Keywords: "${keywords}"

        Please generate:
        - 5 headlines (max 30 characters each).
        - 3 long headlines (max 90 characters each).
        - 4 descriptions (max 90 characters each).

        Ensure the copy is relevant to the keywords, engaging, and follows Google Ads best practices to maximize Quality Score and click-through rate.
        Return the result as a JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                        longHeadlines: { type: Type.ARRAY, items: { type: Type.STRING } },
                        descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                },
            },
        });
        
        return parseJsonResponse<AdCopy>(response.text);
    } catch (error) {
        console.error("Error generating ad copy:", error);
        return null;
    }
};

export const analyzePerformance = async (keywords: string, adCopy: string, landingPageUrl: string): Promise<OptimizationAnalysis | null> => {
    const prompt = `
        As a senior Google Ads Strategist, analyze the following campaign components for potential Ad Rank and Quality Score.

        1. Keywords: "${keywords}"
        2. Existing Ad Copy: "${adCopy}"
        3. Landing Page URL: "${landingPageUrl}"

        Please access the provided URL, read its text content, and perform your analysis based on that content.

        Provide a detailed analysis in a JSON object format with the following structure:
        - "qualityScorePotential": A score from 1-10 on the potential Quality Score.
        - "adRankPotential": A score from 1-10 on the potential Ad Rank.
        - "overallAssessment": A brief summary of the campaign's strengths and weaknesses.
        - "copySuggestions": An array of specific, actionable suggestions to improve the ad copy for better relevance and CTR.
        - "landingPageSuggestions": An array of suggestions to improve the landing page content and user experience for higher conversion rates and relevance.
        - "keywordSuggestions": An array of suggestions for keyword refinement, grouping, or expansion.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        qualityScorePotential: { type: Type.NUMBER },
                        adRankPotential: { type: Type.NUMBER },
                        overallAssessment: { type: Type.STRING },
                        copySuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        landingPageSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        keywordSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    }
                }
            }
        });

        return parseJsonResponse<OptimizationAnalysis>(response.text);
    } catch (error) {
        console.error("Error analyzing performance:", error);
        return null;
    }
};

export const findNegativeKeywords = async (keywords: string): Promise<NegativeKeyword[] | null> => {
    const prompt = `
        You are a Google Ads expert specializing in campaign optimization and preventing wasted ad spend.
        Based on the primary keywords provided below, generate a comprehensive list of potential negative keywords.
        Primary Keywords: "${keywords}"

        For each negative keyword, suggest a match type (Broad, Phrase, or Exact). Focus on terms that are related but indicate a different user intent (e.g., "free", "jobs", "DIY", "reviews", "how to").
        Return the result as a JSON array of objects, where each object has "keyword" and "matchType" properties.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            matchType: { type: Type.STRING, enum: ['Broad', 'Phrase', 'Exact'] }
                        }
                    }
                }
            }
        });
        return parseJsonResponse<NegativeKeyword[]>(response.text);
    } catch (error) {
        console.error("Error finding negative keywords:", error);
        return null;
    }
};