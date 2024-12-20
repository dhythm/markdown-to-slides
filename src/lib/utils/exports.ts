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

interface ExportOptions {
  title?: string
  author?: string
  subject?: string
  keywords?: string
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

  slides.forEach((slide, index) => {
    if (index > 0) {
      pdf.addPage()
    }

    // Set background color
    pdf.setFillColor(18, 18, 18) // Dark background
    pdf.rect(0, 0, width, height, 'F')

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
          'prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none',
          'slide-content'
        ),
        children: slide,
      })
    )

    // Add the HTML content
    pdf.setTextColor(255, 255, 255) // White text
    pdf.html(html, {
      x: 40,
      y: 40,
      width: width - 80,
      windowWidth: 1024,
      html2canvas: {
        scale: 0.5,
        backgroundColor: '#121212',
      },
    })
  })

  return pdf
}

export async function exportToPPTX(slides: string[], options: ExportOptions = {}) {
  const pptx = new pptxgen()
  const { title, author, subject, keywords } = options

  if (title) pptx.title = title
  if (author) pptx.author = author
  if (subject) pptx.subject = subject
  if (keywords) pptx.keywords = keywords

  slides.forEach((slide) => {
    const pptxSlide = pptx.addSlide()

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
          'prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none',
          'slide-content'
        ),
        children: slide,
      })
    )

    // Add the HTML content
    pptxSlide.addText(html, {
      x: 0.5,
      y: 0.5,
      w: '90%',
      h: '90%',
      color: 'FFFFFF',
      fill: { color: '121212' },
      isTextBox: true,
    })
  })

  return pptx
} 