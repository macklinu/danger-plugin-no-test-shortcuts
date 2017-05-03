import noTestShortcuts from '../'

jest.mock('fs')

describe('noTestShortcuts()', () => {
  describe('config: testFilePredicate', () => {
    const MOCK_FILE_INFO = {
      'path/to/tests/index.test.js': 'describe.only("some test");',
      'tests/subdirectory/myTest.js': 'describe.only("My Test");'
    }
    beforeEach(() => {
      require('fs').__setMockFiles(MOCK_FILE_INFO)
      global.fail = jest.fn()
    })
    afterEach(() => {
      global.danger = undefined
      global.fail = undefined
    })
    it('honors test file predicate', () => {
      global.danger = {
        git: {
          created_files: ['path/to/tests/index.test.js'],
          modified_files: []
        }
      }

      noTestShortcuts({
        testFilePredicate: path => path.endsWith('.test.js')
      })

      expect(global.fail).toHaveBeenCalledWith(
        'an `only` was left in tests: path/to/tests/index.test.js'
      )
    })
    it('defaults to the tests/ directory', () => {
      global.danger = {
        git: {
          created_files: ['tests/subdirectory/myTest.js'],
          modified_files: []
        }
      }

      noTestShortcuts()

      expect(global.fail).toHaveBeenCalledWith(
        'an `only` was left in tests: tests/subdirectory/myTest.js'
      )
    })
  })
  describe('test function names', () => {
    ;['describe', 'context', 'it', 'test'].forEach(testFn => {
      const MOCK_FILE_INFO = {
        'tests/describe.test.js': 'describe.only("some test");',
        'tests/test.test.js': 'test.only("some test");',
        'tests/it.test.js': 'it.only("some test");',
        'tests/context.test.js': 'context.only("some test");'
      }
      beforeEach(() => {
        require('fs').__setMockFiles(MOCK_FILE_INFO)
        global.fail = jest.fn()
      })
      afterEach(() => {
        global.danger = undefined
        global.fail = undefined
      })
      it(`fails the build when a test contains ${testFn}.only`, () => {
        global.danger = {
          git: {
            created_files: [`tests/${testFn}.test.js`],
            modified_files: []
          }
        }

        noTestShortcuts()

        expect(global.fail)
          .toHaveBeenCalledWith(`an \`only\` was left in tests: tests/${testFn}.test.js`)
      })
    })
  })
})
