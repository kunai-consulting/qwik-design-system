# Icon Generation Tools

Part of Qwik Design System's icon library tooling, forked from [Qwikest Icons](https://github.com/qwikest/icons) by [Niklas Por](https://github.com/NiklasPor). This fork continues the development and evolution of the icon generation tooling within the Qwik Design System ecosystem.

## Features

- 🔄 Automated icon downloading from source repositories
- 🛠️ SVG optimization and transformation
- 📦 Variant generation support
- 🔍 TypeScript declarations generation

## Key Files

- `generate-icons.ts` - Main generation pipeline
- `download-icons.ts` - Icon set downloading utilities
- `extractor.ts` - Icon variant extraction logic
- `config.interface.ts` - Configuration type definitions

## Usage

Run from the project root:

```bash
npm run generate:icons
```

## Configuration

Icon packs are configured in the `packs` directory. Each pack can specify:

- Source repository
- Download settings
- Color handling
- Variant extraction rules
- Output prefix

## Environment Variables

- `ICON_LIMIT` - Optional limit for number of icons to generate (useful for testing)