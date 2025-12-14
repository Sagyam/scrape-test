// src/types.ts

// The raw output from a loader (URL, PDF, etc)
export interface ContentSource {
    sourceType: 'url' | 'pdf' | 'text';
    originalSource: string; // The URL or File Path
    rawText: string;        // The clean text content
    rawMeta: Record<string, string>; // Existing meta tags (og:image, description, etc)
}

// The AI generated analysis
export interface AIAnalysis {
    analyzerModelName: string;
    title: string;
    shortSummary: string;
    category: string;
    clickbaitScore: Number;
    targetAudience: string[];
    keyEntities: string[]; // People, companies, tools mentioned
}

// The final combined output
export interface ParsedBlog {
    source: string;
    metaTags: Record<string, string>;
    aiMetadata: AIAnalysis;
}

// Interface for any future loader (PDF, etc.)
export interface ILoader {
    load(input: string): Promise<ContentSource>;
}