# Markdown to Slides

A modern web application that converts Markdown content into beautiful presentations, with support for mathematical expressions, dark/light themes, and multiple export options.

## Features

- 📝 Real-time Markdown preview with GitHub Flavored Markdown
- 🎨 Dark/Light theme support with system preference detection
- 📊 Mathematical expressions support via KaTeX
- 🔄 Live slide preview with navigation controls
- 📱 Responsive design for all screen sizes
- 💾 Export options:
  - PDF export with high-quality rendering
  - PPTX export with customizable layouts
- ⌨️ Code syntax highlighting
- 🎯 Fullscreen presentation mode
- 🔗 External link support
- 📋 Table support
- ✅ Task list support

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Write your presentation content in Markdown format in the editor
2. Use `#` and `##` for slide titles and subtitles
3. Use `---` to create new slides
4. Preview your slides in real-time
5. Export to PDF or PPTX when ready

## Markdown Features

### Basic Syntax
- Headers (H1-H6)
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Tables
- Images
- Links
- Blockquotes

### Extended Features
- Task lists `- [ ]` and `- [x]`
- Mathematical expressions (KaTeX)
  - Inline: `$E = mc^2$`
  - Block: `$$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$`
- GitHub Flavored Markdown (GFM)
- External links with custom styling

## Tech Stack

### Core
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI framework
- [TypeScript 5](https://www.typescriptlang.org/) - Type safety

### UI & Styling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Accessible UI components
- [Lucide React](https://lucide.dev/) - Modern icon set
- [next-themes](https://github.com/pacocoursey/next-themes) - Theme management

### Markdown Processing
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [remark-gfm](https://github.com/remarkjs/remark-gfm) - GitHub Flavored Markdown
- [remark-math](https://github.com/remarkjs/remark-math) - Math expressions
- [rehype-katex](https://github.com/remarkjs/rehype-katex) - KaTeX rendering
- [rehype-raw](https://github.com/rehypejs/rehype-raw) - Raw HTML support
- [rehype-sanitize](https://github.com/rehypejs/rehype-sanitize) - Security
- [KaTeX](https://katex.org/) - Math typesetting

### Export Capabilities
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) - PDF generation
- [pptxgenjs](https://github.com/gitbrent/PptxGenJS) - PowerPoint export

### Development Tools
- [ESLint 9](https://eslint.org/) - Code linting
- [Turbopack](https://turbo.build/pack) - Development server
- [PostCSS](https://postcss.org/) - CSS processing

## Development

### Project Structure
```
src/
├── app/              # Next.js app router
├── components/       # React components
├── lib/             # Utilities and constants
```

### Scripts
- `dev` - Start development server with Turbopack
- `build` - Create production build
- `start` - Start production server
- `lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open-source and available under the MIT License.

## Acknowledgments

Developed with ❤️ by ZTABS
