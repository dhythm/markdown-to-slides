import { render, screen, fireEvent } from '@testing-library/react'
import { SlidePreview } from '../slide-preview'

// Mock all markdown-related dependencies
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>
  }
})

jest.mock('remark-gfm', () => () => {})
jest.mock('remark-math', () => () => {})
jest.mock('rehype-katex', () => () => {})

describe('SlidePreview', () => {
  const mockProps = {
    currentSlide: 0,
    slides: ['# Slide 1', '# Slide 2'],
    isFullscreen: false,
    onPrevSlide: jest.fn(),
    onNextSlide: jest.fn(),
    onToggleFullscreen: jest.fn(),
  }

  it('renders the slide preview title', () => {
    render(<SlidePreview {...mockProps} />)
    expect(screen.getByText('Slide Preview')).toBeInTheDocument()
  })

  it('displays the current slide content', () => {
    render(<SlidePreview {...mockProps} />)
    const markdownContent = screen.getByTestId('markdown-content')
    expect(markdownContent).toHaveTextContent('# Slide 1')
  })

  it('shows correct slide navigation count', () => {
    render(<SlidePreview {...mockProps} />)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('disables previous button on first slide', () => {
    render(<SlidePreview {...mockProps} />)
    const prevButton = screen.getByText('Previous').closest('button')
    expect(prevButton).toBeDisabled()
  })

  it('enables next button when not on last slide', () => {
    render(<SlidePreview {...mockProps} />)
    const nextButton = screen.getByText('Next').closest('button')
    expect(nextButton).not.toBeDisabled()
  })

  it('calls onNextSlide when next button is clicked', () => {
    render(<SlidePreview {...mockProps} />)
    fireEvent.click(screen.getByText('Next'))
    expect(mockProps.onNextSlide).toHaveBeenCalled()
  })

  it('calls onToggleFullscreen when fullscreen button is clicked', () => {
    render(<SlidePreview {...mockProps} />)
    // Find the button by its icon's parent button
    const buttons = screen.getAllByRole('button')
    const fullscreenButton = buttons.find(button => 
      button.querySelector('.lucide-maximize2') !== null
    )
    expect(fullscreenButton).toBeTruthy()
    if (fullscreenButton) {
      fireEvent.click(fullscreenButton)
      expect(mockProps.onToggleFullscreen).toHaveBeenCalled()
    }
  })

  it('displays empty state message when no slides', () => {
    render(
      <SlidePreview
        {...mockProps}
        slides={[]}
        currentSlide={0}
      />
    )
    expect(screen.getByText('No slides yet. Start writing in markdown!')).toBeInTheDocument()
  })
}) 