import { render, screen, fireEvent } from '@testing-library/react'
import { MarkdownEditor } from '../markdown-editor'

describe('MarkdownEditor', () => {
  it('renders with the correct title', () => {
    render(<MarkdownEditor value="" onChange={() => {}} />)
    expect(screen.getByText('Markdown Editor')).toBeInTheDocument()
  })

  it('displays the provided value', () => {
    const testValue = '# Test Slide'
    render(<MarkdownEditor value={testValue} onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue(testValue)
  })

  it('calls onChange when text is entered', () => {
    const handleChange = jest.fn()
    render(<MarkdownEditor value="" onChange={handleChange} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '# New Slide' } })
    
    expect(handleChange).toHaveBeenCalledWith('# New Slide')
  })

  it('has the correct placeholder text', () => {
    render(<MarkdownEditor value="" onChange={() => {}} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('placeholder', expect.stringContaining('Slide 1'))
  })
}) 