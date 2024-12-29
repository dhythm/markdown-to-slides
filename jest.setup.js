import '@testing-library/jest-dom'

// Extend expect matchers
expect.extend({
  ...require('@testing-library/jest-dom/matchers')
}) 