import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'
import { AIToolbar } from './ai-toolbar'
import { SlideTheme } from '@/types/theme'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onThemeChange?: (theme: SlideTheme) => void
}

export function MarkdownEditor({ value, onChange, onThemeChange }: MarkdownEditorProps) {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          Markdown Editor
        </CardTitle>
        <AIToolbar
          onMarkdownGenerated={onChange}
          currentContent={value}
          onThemeChange={onThemeChange}
        />
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="border-t">
          <Textarea
            placeholder="# Slide 1&#10;Your content here...&#10;&#10;# Slide 2&#10;More content..."
            className="min-h-[70vh] font-mono resize-none rounded-none border-0 px-6 py-4 focus-visible:ring-0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )
} 