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
          'prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none text-center',
          'slide-content'
        ),
        children: slides[index],
      })
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

  // Define base styles for consistent sizing
  const styles = `
    .prose h1 { font-size: 3.5em !important; line-height: 1.2 !important; margin-bottom: 0.5em !important; }
    .prose h2 { font-size: 2.8em !important; line-height: 1.3 !important; margin-bottom: 0.5em !important; }
    .prose p { font-size: 2em !important; line-height: 1.5 !important; margin-bottom: 0.8em !important; }
    .prose ul, .prose ol { font-size: 2em !important; line-height: 1.5 !important; }
    .prose li { margin-bottom: 0.5em !important; }
    .prose code { font-size: 1.8em !important; }
    .prose pre { font-size: 1.6em !important; }
    .prose blockquote { font-size: 2em !important; }
    .katex { font-size: 2em !important; }
  `

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

    // Add style element for custom sizing
    const styleElement = document.createElement('style')
    styleElement.textContent = styles
    container.appendChild(styleElement)

    const contentWrapper = document.createElement('div')
    contentWrapper.style.width = '100%'
    contentWrapper.style.maxWidth = '80%'  // Reduced to give more breathing room
    contentWrapper.style.padding = '24px'  // Adjusted padding
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
          'prose prose-2xl lg:prose-3xl dark:prose-invert max-w-none text-center',  // Further increased text size
          'slide-content'
        ),
        children: slides[index],
      })
    )

    contentWrapper.innerHTML = html
    container.appendChild(contentWrapper)
    document.body.appendChild(container)

    try {
      // Render the slide to canvas with higher scale for better quality
      const canvas = await html2canvas(container, {
        scale: 3,          // Increased scale for even sharper text
        useCORS: true,
        allowTaint: true,
        backgroundColor: options.theme === 'dark' ? '#121212' : '#ffffff',
        logging: false,
      })

      // Convert canvas to base64 image
      const imgData = canvas.toDataURL('image/png', 1.0)  // Maximum quality

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
  await pptx.writeFile('slides.pptx')
} 