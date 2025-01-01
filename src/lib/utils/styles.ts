/**
 * Base styles for PDF exports
 */
export const pdfStyles: string = `
  .prose {
    font-size: 16px;
    line-height: 1.5;
    text-align: center;
  }
  .prose h1 {
    font-size: 32px;
    margin-bottom: 24px;
  }
  .prose h2 {
    font-size: 28px;
    margin-bottom: 20px;
  }
  .prose h3 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  .prose p {
    margin-bottom: 16px;
  }
  .prose code {
    font-family: monospace;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .prose pre {
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
  }
  .prose blockquote {
    padding-left: 16px;
    border-left: 4px solid;
    margin: 16px 0;
  }
  .prose a {
    text-decoration: underline;
  }
`

/**
 * Base styles for PPTX exports
 */
export const pptxStyles: string = `
  .prose {
    font-size: 24px;
    line-height: 1.5;
    text-align: center;
  }
  .prose h1 {
    font-size: 48px;
    margin-bottom: 32px;
  }
  .prose h2 {
    font-size: 40px;
    margin-bottom: 28px;
  }
  .prose h3 {
    font-size: 36px;
    margin-bottom: 24px;
  }
  .prose p {
    margin-bottom: 24px;
  }
  .prose code {
    font-family: monospace;
    padding: 4px 8px;
    border-radius: 4px;
  }
  .prose pre {
    padding: 24px;
    border-radius: 8px;
    overflow-x: auto;
  }
  .prose blockquote {
    padding-left: 24px;
    border-left: 6px solid;
    margin: 24px 0;
  }
  .prose a {
    text-decoration: underline;
  }
` 