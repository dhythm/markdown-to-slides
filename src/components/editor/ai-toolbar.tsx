"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sparkles, Code2, Languages, Palette, ChevronDown, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SlideTheme } from "@/types/theme"
import { toast } from "sonner"
import { checkSubscription, showUpgradePrompt } from "@/lib/subscription-utils"

interface AIToolbarProps {
  onMarkdownGenerated: (markdown: string) => void
  currentContent: string
  onThemeChange?: (theme: SlideTheme) => void
}

const LANGUAGES = [
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Italian", label: "Italian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Chinese", label: "Chinese" },
  { value: "Japanese", label: "Japanese" },
  { value: "Korean", label: "Korean" },
]

export function AIToolbar({ onMarkdownGenerated, currentContent, onThemeChange }: AIToolbarProps) {
  const { data: session } = useSession()
  const [prompt, setPrompt] = useState("")
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [enhanceLoading, setEnhanceLoading] = useState(false)
  const [translateLoading, setTranslateLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>("")
  const [themeDialogOpen, setThemeDialogOpen] = useState(false)
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false)
  const [enhanceDialogOpen, setEnhanceDialogOpen] = useState(false)
  const [translateDialogOpen, setTranslateDialogOpen] = useState(false)
  const [customTheme, setCustomTheme] = useState<SlideTheme>({
    id: "custom",
    name: "Custom Theme",
    styles: {
      background: "#ffffff",
      text: "#000000",
      heading: "#111111",
      code: "#1a1a1a",
      accent: "#0066cc",
      link: "#0066cc",
      blockquote: "#666666",
    },
    fonts: {
      heading: "system-ui",
      body: "system-ui",
      code: "monospace",
    },
    spacing: {
      padding: "2rem",
      headingMargin: "1.5rem",
      paragraphMargin: "1rem",
      listMargin: "1rem",
    },
  })

  function updateCustomTheme(
    field: keyof Pick<SlideTheme, 'styles' | 'fonts' | 'spacing'>,
    subfield: string,
    value: string
  ) {
    setCustomTheme(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value
      }
    }))
  }

  if (!session) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <Sparkles className="h-4 w-4" />
        <p className="text-sm text-muted-foreground">
          Sign in to use AI features
        </p>
      </div>
    )
  }

  // Unified function to handle pro feature actions
  const handleProAction = async (action: () => Promise<void>) => {
    const hasSubscription = await checkSubscription()
    if (!hasSubscription) {
      showUpgradePrompt()
      return
    }
    await action()
  }

  async function generateSlides() {
    if (!prompt || !topic) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          topic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate slides")
      }

      const data = await response.json()
      onMarkdownGenerated(data.markdown)
      setGenerateDialogOpen(false)
    } catch (error) {
      console.error("Error generating slides:", error)
      toast.error("Failed to generate slides")
    } finally {
      setLoading(false)
    }
  }

  async function enhanceSlides() {
    if (!currentContent.trim()) return
    await handleProAction(async () => {
      setEnhanceLoading(true)
      try {
        const response = await fetch("/api/ai/enhance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            markdown: currentContent,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to enhance slides")
        }

        const data = await response.json()
        onMarkdownGenerated(data.markdown)
        setEnhanceDialogOpen(false)
      } catch (error) {
        console.error("Error enhancing slides:", error)
        toast.error("Failed to enhance slides")
      } finally {
        setEnhanceLoading(false)
      }
    })
  }

  async function translateSlides() {
    if (!currentContent.trim() || !selectedLanguage) return
    await handleProAction(async () => {
      setTranslateLoading(true)
      try {
        const response = await fetch("/api/ai/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            markdown: currentContent,
            targetLanguage: selectedLanguage,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to translate slides")
        }

        const data = await response.json()
        onMarkdownGenerated(data.markdown)
        setTranslateDialogOpen(false)
      } catch (error) {
        console.error("Error translating slides:", error)
        toast.error("Failed to translate slides")
      } finally {
        setTranslateLoading(false)
      }
    })
  }

  async function applyTheme(theme: SlideTheme) {
    await handleProAction(async () => {
      if (onThemeChange) {
        onThemeChange(theme)
        setThemeDialogOpen(false)
      }
    })
  }

  // Handle opening dialogs for pro features
  const handleFeatureClick = async (feature: string, setDialogOpen: (open: boolean) => void) => {
    const hasSubscription = await checkSubscription()
    if (!hasSubscription) {
      showUpgradePrompt()
      return
    }
    setDialogOpen(true)
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleFeatureClick("generate", setGenerateDialogOpen)}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate with AI
          </>
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            Pro Features <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => handleFeatureClick("enhance", setEnhanceDialogOpen)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Enhance Slides</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleFeatureClick("translate", setTranslateDialogOpen)}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            <span>Translate Slides</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleFeatureClick("theme", setThemeDialogOpen)}
            className="gap-2"
          >
            <Palette className="h-4 w-4" />
            <span>Custom Theme</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 opacity-50 cursor-not-allowed"
          >
            <Code2 className="h-4 w-4" />
            <span>Access to API (coming soon)</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Markdown with AI</DialogTitle>
            <DialogDescription>
              Enter a topic and prompt to generate markdown content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g., Introduction to React Hooks"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Prompt</label>
              <Textarea
                placeholder="e.g., Create a comprehensive guide covering the basics, examples, and best practices"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={generateSlides}
              disabled={loading || !prompt || !topic}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={enhanceDialogOpen} onOpenChange={setEnhanceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enhance Slides with AI</DialogTitle>
            <DialogDescription>
              Let AI help improve your slide content and formatting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-sm text-muted-foreground">
              AI will enhance your current slides while maintaining their structure.
            </div>
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {currentContent.slice(0, 200)}
                {currentContent.length > 200 ? "..." : ""}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={enhanceSlides}
              disabled={enhanceLoading || !currentContent.trim()}
            >
              {enhanceLoading ? "Enhancing..." : "Enhance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={translateDialogOpen} onOpenChange={setTranslateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Translate Slides</DialogTitle>
            <DialogDescription>
              Translate your slides to another language while preserving formatting.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedLanguage || "Select language"}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem
                      key={lang.value}
                      onClick={() => setSelectedLanguage(lang.value)}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {currentContent.slice(0, 200)}
                {currentContent.length > 200 ? "..." : ""}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={translateSlides}
              disabled={translateLoading || !currentContent.trim() || !selectedLanguage}
            >
              {translateLoading ? "Translating..." : "Translate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customize Theme</DialogTitle>
            <DialogDescription>
              Customize colors, fonts, and spacing for your slides.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Colors</h3>
                <div className="space-y-3">
                  {Object.entries(customTheme.styles).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 items-center gap-2">
                      <Label className="capitalize">{key}</Label>
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => updateCustomTheme('styles', key, e.target.value)}
                        className="col-span-2 h-8"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Fonts</h3>
                <div className="space-y-3">
                  {Object.entries(customTheme.fonts).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 items-center gap-2">
                      <Label className="capitalize">{key}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateCustomTheme('fonts', key, e.target.value)}
                        className="col-span-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-3">Spacing</h3>
                <div className="space-y-3">
                  {Object.entries(customTheme.spacing).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 items-center gap-2">
                      <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                      <Input
                        value={value}
                        onChange={(e) => updateCustomTheme('spacing', key, e.target.value)}
                        className="col-span-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => applyTheme(customTheme)}>
              Apply Theme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 