// src/index.ts
import { UrlLoader } from './loaders/UrlLoader';
import { BlogAnalyzer } from './analyzer';

async function main() {
    // 1. Get URL from command line args
    const url = process.argv[2];
    if (!url) {
        console.error("❌ Please provide a URL. Usage: bun run src/index.ts <url>");
        process.exit(1);
    }

    try {
        // 2. Load Content (Extensible part: You could swap UrlLoader for PdfLoader here later)
        const loader = new UrlLoader();
        const content = await loader.load(url);
        console.log(`✅ Loaded ${content.rawText.length} characters of text.`);

        // 3. Analyze with AI
        const analyzer = new BlogAnalyzer();
        const result = await analyzer.analyze(content);

        // 4. Output Result
        console.log("\n✨ Analysis Complete! ✨\n");
        console.log(JSON.stringify(result, null, 2));

        // Optional: Write to file
        const filename = `./data/analysis-${Date.now().toString()}.json`;
        await Bun.write(filename, JSON.stringify(result, null, 2));
        console.log(`\n💾 Saved to ${filename}`);

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();