export interface SlideTheme {
  id: string
  name: string
  styles: {
    background: string
    text: string
    heading: string
    code: string
    accent: string
    link: string
    blockquote: string
  }
  fonts: {
    heading: string
    body: string
    code: string
  }
  spacing: {
    padding: string
    headingMargin: string
    paragraphMargin: string
    listMargin: string
  }
} 