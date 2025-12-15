// src/index.ts
import { UrlLoader } from './loaders/UrlLoader';
import { BlogAnalyzer } from './analyzer';
import { existsSync } from 'node:fs';

const OUTPUT_DIR = process.env.OUTPUT_DIR || './data';

async function readUrlsFromFile(filePath: string): Promise<string[]> {
    const file = Bun.file(filePath);
    const content = await file.text();

    return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#'));
}

async function processUrl(url: string, loader: UrlLoader, analyzer: BlogAnalyzer): Promise<void> {
    try {
        console.log(`\n📄 Processing: ${url}`);

        // Load Content
        const content = await loader.load(url);
        console.log(`✅ Loaded ${content.rawText.length} characters of text.`);

        // Analyze with AI
        const result = await analyzer.analyze(content);

        // Output Result
        console.log("\n✨ Analysis Complete! ✨\n");
        console.log(JSON.stringify(result, null, 2));

        // Write to file
        const sanitizedUrl = url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `${OUTPUT_DIR}/analysis-${sanitizedUrl}-${Date.now()}.json`;
        await Bun.write(filename, JSON.stringify(result, null, 2));
        console.log(`\n💾 Saved to ${filename}`);

    } catch (error) {
        console.error(`❌ Error processing ${url}:`, error);
    }
}

async function main() {
    const urlsFile = process.argv[2] || 'urls.txt';

    if (!existsSync(urlsFile)) {
        console.error(`❌ URLs file not found: ${urlsFile}`);
        console.error("Usage: bun run src/index.ts [urls-file]");
        console.error("Default: bun run src/index.ts (uses urls.txt)");
        process.exit(1);
    }

    try {
        const urls = await readUrlsFromFile(urlsFile);

        if (urls.length === 0) {
            console.error("❌ No URLs found in file. Please add URLs (one per line).");
            process.exit(1);
        }

        console.log(`📋 Found ${urls.length} URL(s) to process\n`);

        const loader = new UrlLoader();
        const analyzer = new BlogAnalyzer();

        for (const url of urls) {
            await processUrl(url, loader, analyzer);
        }

        console.log(`\n✅ Completed processing ${urls.length} URL(s)`);

    } catch (error) {
        console.error("❌ An error occurred:", error);
        process.exit(1);
    }
}

main();