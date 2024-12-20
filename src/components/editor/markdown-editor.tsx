import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Markdown Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="# Slide 1&#10;Your content here...&#10;&#10;# Slide 2&#10;More content..."
          className="h-[70vh] font-mono resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </CardContent>
    </Card>
  )
} 