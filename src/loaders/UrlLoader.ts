// src/loaders/UrlLoader.ts
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import type { ILoader, ContentSource } from '../types';

export class UrlLoader implements ILoader {
    async load(url: string): Promise<ContentSource> {
        console.log(`\n🌐 Fetching: ${url}...`);

        const response = await fetch(url, {
            headers: {
                // Pretend to be a real browser to avoid being blocked
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();

        // 1. Parse HTML into a virtual DOM
        const dom = new JSDOM(html, { url });

        // 2. Use Mozilla's Readability to find the MAIN content (ignores nav/ads)
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        if (!article) {
            throw new Error("Could not parse article content from this page.");
        }

        // 3. Extract Meta Tags (Standard method)
        const rawMeta: Record<string, string> = {};
        const doc = dom.window.document;
        doc.querySelectorAll('meta').forEach((element) => {
            const name = element.getAttribute('name') || element.getAttribute('property');
            const content = element.getAttribute('content');
            if (name && content) {
                rawMeta[name] = content;
            }
        });

        // Cleanup: Remove excessive newlines from Readability output
        const cleanText = article.textContent.replace(/\n\s*\n/g, '\n').trim();

        return {
            sourceType: 'url',
            originalSource: url,
            rawText: cleanText, // <--- This will now be the clean article text ONLY
            rawMeta: rawMeta
        };
    }
}