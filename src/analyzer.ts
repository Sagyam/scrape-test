// src/analyzer.ts
import ollama from 'ollama';
import type { ContentSource, AIAnalysis, ParsedBlog } from './types';

const MODEL_NAME = 'ingu627/exaone4.0:1.2b';

export class BlogAnalyzer {
    async analyze(content: ContentSource): Promise<ParsedBlog> {
        console.log(`\n🧠 Sending content to Ollama (${MODEL_NAME})...`);

        const schemaDescription = `
      {
        "title": "Title for this content",
        "shortSummary": "A 2-3 sentence summary of the content",
        "category": "Tech, Lifestyle, Finance, etc.",
        "clickbaitScore": "On scale of 1 being Wikipedia to 10 being a Tabloid. Compare the ORIGINAL TITLE with the content. Does the title exaggerate?",
        "targetAudience": ["List of target audience in few words"],
        "keyEntities": ["List of specific libraries, companies, or people mentioned"],
        "sentiment": "Positive, Negative, or Neutral",
        "readingLevel": "The approximate education level required to read this (e.g. '8th Grade', 'College', 'PhD')",
        "tldr": ["Explain the content in bullet points"],
        "topics": ["List of 3-5 relevant tags or topics"]
      }
    `;

        const prompt = `
      Analyze the following blog post text and extract metadata into a strict JSON object.
      
      Output Structure:
      ${schemaDescription}

      ORIGINAL TITLE: "${content.rawMeta['originalTitle'] || content.rawMeta['og:title'] || 'Unknown'}"
      
      TEXT CONTENT:
      ${content.rawText.substring(0, 25000)} 
      // ^ Truncating to 10k chars to prevent context overflow, adjust based on your model/needs
    `;


        const response = await ollama.chat({
            model: MODEL_NAME,
            format: 'json',
            options: {
                temperature: 0.1,
            },
            messages: [{ role: 'user', content: prompt }],
            stream: false,
        });


        // Parse the JSON from LLM
        let aiData: AIAnalysis;
        try {
            aiData = JSON.parse(response.message.content);
            aiData.analyzerModelName = MODEL_NAME
        } catch (e) {
            console.error("Failed to parse LLM JSON:", response.message.content);
            throw new Error("AI response was not valid JSON");
        }

        return {
            source: content.originalSource,
            metaTags: content.rawMeta,
            aiMetadata: aiData
        };
    }
}