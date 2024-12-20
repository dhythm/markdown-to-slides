import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'
import 'katex/dist/katex.min.css'

interface SlidePreviewProps {
  currentSlide: number
  slides: string[]
  isFullscreen: boolean
  onPrevSlide: () => void
  onNextSlide: () => void
  onToggleFullscreen: () => void
}

export function SlidePreview({
  currentSlide,
  slides,
  isFullscreen,
  onPrevSlide,
  onNextSlide,
  onToggleFullscreen,
}: SlidePreviewProps) {
  return (
    <Card className={cn(
      'flex flex-col',
      isFullscreen ? 'fixed inset-0 z-50' : 'h-[70vh]'
    )}>
      <CardHeader className="flex-row justify-between items-center space-y-0 gap-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Maximize2 className="h-5 w-5" />
          Slide Preview
        </CardTitle>
        <Button variant="outline" size="icon" onClick={onToggleFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-16">
        <div className="h-full flex items-center justify-center p-8">
          {slides[currentSlide] ? (
            <div className="w-full max-w-4xl mx-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[
                  [rehypeKatex, {
                    strict: false,
                    trust: true,
                    throwOnError: false,
                    globalGroup: true,
                    output: 'html'
                  }]
                ]}
                className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none"
              >
                {slides[currentSlide]}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No slides yet. Start writing in markdown!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="absolute bottom-0 left-0 right-0 border-t bg-card">
        <div className="flex justify-between items-center w-full">
          <Button
            variant="outline"
            onClick={onPrevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : '0 / 0'}
          </span>
          <Button
            variant="outline"
            onClick={onNextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 