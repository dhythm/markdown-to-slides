import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'
import { SlideTheme } from '@/types/theme'
import 'katex/dist/katex.min.css'

interface SlidePreviewProps {
  currentSlide: number
  slides: string[]
  isFullscreen: boolean
  theme?: SlideTheme
  onPrevSlide: () => void
  onNextSlide: () => void
  onToggleFullscreen: () => void
}

export function SlidePreview({
  currentSlide,
  slides,
  isFullscreen,
  theme,
  onPrevSlide,
  onNextSlide,
  onToggleFullscreen,
}: SlidePreviewProps) {
  const slideStyle = theme ? {
    '--background': theme.styles.background,
    '--text': theme.styles.text,
    '--heading': theme.styles.heading,
    '--code': theme.styles.code,
    '--accent': theme.styles.accent,
    '--link': theme.styles.link,
    '--blockquote': theme.styles.blockquote,
    '--heading-font': theme.fonts.heading,
    '--body-font': theme.fonts.body,
    '--code-font': theme.fonts.code,
    '--padding': theme.spacing.padding,
    '--heading-margin': theme.spacing.headingMargin,
    '--paragraph-margin': theme.spacing.paragraphMargin,
    '--list-margin': theme.spacing.listMargin,
  } as React.CSSProperties : {}

  return (
    <Card className={cn(
      "relative flex flex-col overflow-hidden min-h-[600px]",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5 border-b">
        <CardTitle className="text-lg">Slide Preview</CardTitle>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : '0 / 0'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFullscreen}
            className="ml-2"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto px-0 relative">
        <div
          className={cn(
            "absolute inset-0 transition-colors duration-200",
            theme?.styles.background && "bg-[var(--background)]"
          )}
          style={{
            backgroundColor: theme?.styles.background,
            color: theme?.styles.text,
          }}
        >
          <div className={cn(
            "relative h-full flex items-center justify-center",
            "mx-auto max-w-4xl p-8",
            "min-h-[500px]"
          )}>
            <div 
              className="w-full prose prose-sm md:prose-base lg:prose-lg max-w-none text-center transition-all duration-200"
              style={{
                '--tw-prose-headings': theme?.styles.heading,
                '--tw-prose-body': theme?.styles.text,
                '--tw-prose-code': theme?.styles.code,
                '--tw-prose-links': theme?.styles.link,
                '--tw-prose-quotes': theme?.styles.blockquote,
                '--tw-prose-quote-borders': theme?.styles.accent,
                fontFamily: theme?.fonts.body,
              } as React.CSSProperties}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({ children }) => (
                    <h1 style={{ 
                      fontFamily: theme?.fonts.heading,
                      color: theme?.styles.heading,
                      marginBottom: theme?.spacing.headingMargin 
                    }}>{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 style={{ 
                      fontFamily: theme?.fonts.heading,
                      color: theme?.styles.heading,
                      marginBottom: theme?.spacing.headingMargin 
                    }}>{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 style={{ 
                      fontFamily: theme?.fonts.heading,
                      color: theme?.styles.heading,
                      marginBottom: theme?.spacing.headingMargin 
                    }}>{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p style={{ 
                      fontFamily: theme?.fonts.body,
                      color: theme?.styles.text,
                      marginBottom: theme?.spacing.paragraphMargin 
                    }}>{children}</p>
                  ),
                  code: ({ inline, children }) => (
                    inline ? 
                      <code style={{ 
                        fontFamily: theme?.fonts.code,
                        color: theme?.styles.code 
                      }}>{children}</code> :
                      <pre style={{ 
                        fontFamily: theme?.fonts.code,
                        color: theme?.styles.code 
                      }}><code>{children}</code></pre>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote style={{ 
                      color: theme?.styles.blockquote,
                      borderLeftColor: theme?.styles.accent 
                    }}>{children}</blockquote>
                  ),
                  a: ({ children, href }) => (
                    <a 
                      href={href}
                      style={{ color: theme?.styles.link }}
                    >{children}</a>
                  ),
                }}
              >
                {slides[currentSlide] || ''}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-card p-2">
        <div className="flex justify-between items-center w-full gap-2">
          <Button
            variant="outline"
            onClick={onPrevSlide}
            disabled={currentSlide === 0}
            className="w-[100px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex-1 flex justify-center">
            <div className="flex gap-1">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentSlide
                      ? "bg-primary"
                      : "bg-muted hover:bg-muted-foreground/50"
                  )}
                />
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onNextSlide}
            disabled={currentSlide === slides.length - 1}
            className="w-[100px]"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 