import { Metadata } from 'next'
import { SlideMaker } from '@/components/slidemaker'

export const metadata: Metadata = {
  title: 'Markdown to Slides',
  description: 'Convert your markdown to beautiful slides',
}

export default function Home() {
  return <SlideMaker />
}
