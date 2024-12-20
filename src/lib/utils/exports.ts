import { jsPDF } from 'jspdf'
import pptxgen from 'pptxgenjs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'
import html2canvas from 'html2canvas'

interface ExportOptions {
  title?: string
  author?: string
  subject?: string
  keywords?: string
  theme?: 'dark' | 'light'
}

// Base styles for both PDF and PPTX
const baseExportStyles = `
  @font-face {
    font-family: "Noto Color Emoji";
    src: url("https://cdn.jsdelivr.net/npm/@fontsource/noto-color-emoji@4.0.0/files/noto-color-emoji-400.woff2") format("woff2");
  }

  .prose {
    max-width: none;
    color: inherit;
    text-align: center;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  }
  .prose blockquote {
    border-left: 8px solid rgba(currentColor, 0.8);
    padding: 1em 1.5em;
    margin: 1.5em 0;
    background: rgba(currentColor, 0.1);
    border-radius: 0.5em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .prose code {
    background: rgba(currentColor, 0.1);
    padding: 0.2em 0.4em;
    border-radius: 0.3em;
    color: currentColor;
  }
  .prose pre {
    background: rgba(currentColor, 0.1);
    padding: 1em;
    border-radius: 0.5em;
    overflow-x: auto;
    margin: 1em 0;
    text-align: left;
  }
  .prose pre code {
    background: transparent;
    padding: 0;
  }
  .prose table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    color: currentColor;
  }
  .prose th, .prose td {
    border: 1px solid rgba(currentColor, 0.2);
    padding: 0.5em 1em;
  }
  .prose th {
    background: rgba(currentColor, 0.1);
    font-weight: 600;
  }
  .dark .prose blockquote {
    background: rgba(255, 255, 255, 0.1);
  }
  .dark .prose code {
    background: rgba(255, 255, 255, 0.1);
  }
  .dark .prose pre {
    background: rgba(255, 255, 255, 0.1);
  }
  .dark .prose th {
    background: rgba(255, 255, 255, 0.1);
  }
`

// PDF-specific styles with smaller font sizes
const pdfStyles = `
  ${baseExportStyles}
  .prose h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
    padding: 0.5em 0;
  }
  .prose h2 {
    font-size: 1.7em;
    font-weight: 600;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
    padding: 0.3em 0;
  }
  .prose h3 {
    font-size: 1.4em;
    font-weight: 500;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
  }
  .prose p {
    font-size: 1.1em;
    line-height: 1.6;
    margin-bottom: 1em;
    color: currentColor;
  }
  .prose ul, .prose ol {
    padding-left: 2em;
    margin: 1em 0;
    color: currentColor;
    text-align: left;
  }
  .prose li {
    font-size: 1.1em;
    line-height: 1.6;
    margin-bottom: 0.5em;
    color: currentColor;
  }
  .prose blockquote p {
    font-size: 1.1em;
    font-weight: 500;
    margin: 0;
    color: currentColor;
  }
  .prose code {
    font-size: 0.9em;
  }
  .prose pre code {
    font-size: 0.9em;
  }
`

// PPTX-specific styles with larger font sizes
const pptxStyles = `
  ${baseExportStyles}
  .prose h1 {
    font-size: 3.5em;
    font-weight: bold;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
    padding: 0.5em 0;
  }
  .prose h2 {
    font-size: 2.8em;
    font-weight: 600;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
    padding: 0.3em 0;
  }
  .prose h3 {
    font-size: 2em;
    font-weight: 500;
    margin-bottom: 0.5em;
    color: currentColor;
    background: none !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: currentColor !important;
    text-align: center;
  }
  .prose p {
    font-size: 1.5em;
    line-height: 1.6;
    margin-bottom: 1em;
    color: currentColor;
  }
  .prose ul, .prose ol {
    padding-left: 2em;
    margin: 1em 0;
    color: currentColor;
    text-align: left;
  }
  .prose li {
    font-size: 1.5em;
    line-height: 1.6;
    margin-bottom: 0.5em;
    color: currentColor;
  }
  .prose blockquote p {
    font-size: 1.5em;
    font-weight: 500;
    margin: 0;
    color: currentColor;
  }
  .prose code {
    font-size: 1.2em;
  }
  .prose pre code {
    font-size: 1.2em;
  }
`

export async function exportToPDF(slides: string[], options: ExportOptions = {}) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: 'a4',
    putOnlyUsedFonts: true,
    ...options,
  })

  const width = pdf.internal.pageSize.getWidth()
  const height = pdf.internal.pageSize.getHeight()

  for (let index = 0; index < slides.length; index++) {
    if (index > 0) {
      pdf.addPage()
    }

    // Create a temporary container for the slide
    const container = document.createElement('div')
    container.style.width = `${width}px`
    container.style.height = `${height}px`
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.backgroundColor = options.theme === 'dark' ? '#121212' : '#ffffff'
    container.style.color = options.theme === 'dark' ? '#ffffff' : '#000000'
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'

    // Add style element with PDF-specific styles
    const styleElement = document.createElement('style')
    styleElement.textContent = pdfStyles
    container.appendChild(styleElement)

    const contentWrapper = document.createElement('div')
    contentWrapper.style.width = '100%'
    contentWrapper.style.maxWidth = '90%'
    contentWrapper.style.padding = '40px'
    contentWrapper.className = 'slide-content'

    // Convert markdown to HTML with math expressions
    const html = renderToStaticMarkup(
      createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          [rehypeKatex, {
            strict: false,
            trust: true,
            throwOnError: false,
            globalGroup: true,
            output: 'html'
          }]
        ],
        className: cn(
          'prose prose-lg dark:prose-invert max-w-none text-center',
          options.theme === 'dark' ? 'dark' : '',
          'slide-content'
        ),
      }, slides[index])
    )

    contentWrapper.innerHTML = html
    container.appendChild(contentWrapper)
    document.body.appendChild(container)

    try {
      // Render the slide to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: options.theme === 'dark' ? '#121212' : '#ffffff',
        logging: false,
      })

      // Add the canvas content to PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, width, height)
    } finally {
      // Clean up
      document.body.removeChild(container)
    }
  }

  // Save the PDF
  pdf.save('slides.pdf')
}

export async function exportToPPTX(slides: string[], options: ExportOptions = {}) {
  const pptx = new pptxgen()
  const { title, author, subject } = options

  if (title) pptx.title = title
  if (author) pptx.author = author
  if (subject) pptx.subject = subject

  // Set default layout with optimal dimensions for readability
  pptx.layout = 'LAYOUT_16x9'
  pptx.defineLayout({
    name: 'CUSTOM',
    width: 13.333,
    height: 7.5,
  })
  pptx.layout = 'CUSTOM'

  for (let index = 0; index < slides.length; index++) {
    const pptxSlide = pptx.addSlide()

    // Create a temporary container for the slide
    const container = document.createElement('div')
    container.style.width = '1600px'
    container.style.height = '900px'
    container.style.position = 'fixed'
    container.style.left = '-9999px'
    container.style.backgroundColor = options.theme === 'dark' ? '#121212' : '#ffffff'
    container.style.color = options.theme === 'dark' ? '#ffffff' : '#000000'
    container.style.display = 'flex'
    container.style.alignItems = 'center'
    container.style.justifyContent = 'center'

    // Add style element with PPTX-specific styles
    const styleElement = document.createElement('style')
    styleElement.textContent = pptxStyles
    container.appendChild(styleElement)

    const contentWrapper = document.createElement('div')
    contentWrapper.style.width = '100%'
    contentWrapper.style.maxWidth = '80%'
    contentWrapper.style.padding = '40px'
    contentWrapper.className = 'slide-content'

    // Convert markdown to HTML with math expressions
    const html = renderToStaticMarkup(
      createElement(ReactMarkdown, {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          [rehypeKatex, {
            strict: false,
            trust: true,
            throwOnError: false,
            globalGroup: true,
            output: 'html'
          }]
        ],
        className: cn(
          'prose prose-2xl dark:prose-invert max-w-none text-center',
          options.theme === 'dark' ? 'dark' : '',
          'slide-content'
        ),
      }, slides[index])
    )

    contentWrapper.innerHTML = html
    container.appendChild(contentWrapper)
    document.body.appendChild(container)

    try {
      // Render the slide to canvas with higher scale for better quality
      const canvas = await html2canvas(container, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: options.theme === 'dark' ? '#121212' : '#ffffff',
        logging: false,
      })

      // Convert canvas to base64 image
      const imgData = canvas.toDataURL('image/png', 1.0)

      // Add the image to the slide
      pptxSlide.addImage({
        data: imgData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      })
    } finally {
      // Clean up
      document.body.removeChild(container)
    }
  }

  // Save the PPTX
  await pptx.writeFile({ fileName: 'slides.pptx' })
} 