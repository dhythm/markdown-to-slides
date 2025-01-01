import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidMarkdown(): R
    }
    interface Expect {
      toBeValidMarkdown(): unknown
    }
  }
} 