# azure-labs

A blog/article analyzer powered by Ollama and the exaone4.0:1.2b model. Scrapes URLs and generates AI-powered metadata analysis.

## Installation

```bash
bun install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. (Optional) Customize environment variables in `.env`:
- `MODEL_NAME`: Ollama model to use (default: `ingu627/exaone4.0:1.2b`)
- `MODEL_TEMPERATURE`: Model temperature (default: `0.1`)
- `MAX_CONTENT_LENGTH`: Maximum content length to analyze (default: `25000`)
- `OUTPUT_DIR`: Directory for output files (default: `./data`)

## Usage

### Local Usage

1. Add URLs to analyze in `urls.txt` (one per line):
```
https://example.com/article1
https://example.com/article2
```

2. Run the analyzer:
```bash
bun run parse
```

The scraped and analyzed data will be saved as JSON files in the `data/` directory.

### GitHub Actions

This project includes a GitHub Actions workflow that:
- Runs automatically weekly (Sunday at midnight UTC)
- Can be triggered manually via the Actions tab
- Uses the ollama-action to run the model in CI
- Commits the analyzed JSON files back to the repository

The workflow is defined in `.github/workflows/scrape-and-analyze.yml`.

## Project Structure

- `src/index.ts` - Main entry point, handles URL processing
- `src/analyzer.ts` - AI analysis using Ollama
- `src/loaders/UrlLoader.ts` - URL content fetching and parsing
- `src/types.ts` - TypeScript type definitions
- `urls.txt` - List of URLs to scrape
- `data/` - Output directory for analysis results

## Output Format

Each analyzed URL produces a JSON file containing:
- Source URL
- Extracted meta tags
- AI-generated metadata:
  - Title and summary
  - Category and topics
  - Sentiment analysis
  - Reading level
  - Target audience
  - Key entities mentioned
  - Clickbait score
  - TL;DR bullet points

This project was created using `bun init` in bun v1.3.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
