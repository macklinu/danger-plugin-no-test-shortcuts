import noTestShortcuts from '../../index'

noTestShortcuts()

noTestShortcuts({})

noTestShortcuts({
  testFilePredicate: (filePath: string) => filePath.indexOf('.test.js') >= -1,
})

noTestShortcuts({
  skippedTests: 'fail'
})

noTestShortcuts({
  patterns: {
    only: ['on.ly'],
    skip: ['todo'],
  },
})

noTestShortcuts({
  testFilePredicate: (filePath: string) => filePath.indexOf('.test.js') >= -1,
  skippedTests: 'fail',
  patterns: {
    only: ['on.ly'],
    skip: ['todo'],
  },
})
