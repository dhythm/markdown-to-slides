'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Moon, Sun, Presentation } from 'lucide-react'
import { useTheme } from 'next-themes'
import { MarkdownEditor } from '@/components/editor/markdown-editor'
import { SlidePreview } from '@/components/preview/slide-preview'
import { exportToPDF, exportToPPTX } from '@/lib/utils/exports'
import { exampleSlides } from '@/lib/constants/example-slides'

export default function Home() {
  const [markdown, setMarkdown] = useState(exampleSlides)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const slides = markdown
    .split(/(?=^#{1,2}\s|^-{3,}$)/m)
    .map(slide => slide.trim())
    .filter(slide => slide && !slide.match(/^-{3,}$/))

  const handleMarkdownChange = (value: string) => {
    setMarkdown(value)
  }

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1))
  }

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleExportPDF = async () => {
    await exportToPDF(slides, { theme: theme as 'dark' | 'light' })
  }

  const handleExportPPTX = async () => {
    await exportToPPTX(slides, { theme: theme as 'dark' | 'light' })
  }

  if (!mounted) {
    return null
  }

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="outline" onClick={handleExportPDF}>
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <Button variant="outline" onClick={handleExportPPTX}>
          <Presentation className="mr-2 h-4 w-4" />
          PPTX
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <MarkdownEditor value={markdown} onChange={handleMarkdownChange} />
        </div>
        <div className="space-y-4">
          <SlidePreview
            currentSlide={currentSlide}
            slides={slides}
            isFullscreen={isFullscreen}
            onPrevSlide={prevSlide}
            onNextSlide={nextSlide}
            onToggleFullscreen={toggleFullscreen}
          />
        </div>
      </div>
    </main>
  )
}
