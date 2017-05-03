import noTestShortcuts from '../index'

noTestShortcuts()

noTestShortcuts({})

noTestShortcuts({
  testFilePredicate: (filePath: string) => filePath.indexOf('.test.js') >= -1,
})

noTestShortcuts({
  skippedTests: 'fail'
})

noTestShortcuts({
  testFilePredicate: (filePath: string) => filePath.indexOf('.test.js') >= -1,
  skippedTests: 'fail'
})
