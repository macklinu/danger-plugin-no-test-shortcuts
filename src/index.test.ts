jest.mock('fs')

import noTestShortcuts from './'

describe('noTestShortcuts()', () => {
  describe('config: testFilePredicate', () => {
    const MOCK_FILE_INFO = {
      'path/to/tests/index.test.js': 'describe.only("some test");',
      'tests/subdirectory/myTest.js': 'describe.only("My Test");',
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
          modified_files: [],
        },
      }

      noTestShortcuts({
        testFilePredicate: path => path.endsWith('.test.js'),
      })

      expect(global.fail).toHaveBeenCalledWith(
        'a `describe.only` was left in tests: path/to/tests/index.test.js'
      )
    })
    it('defaults to the tests/ directory', () => {
      global.danger = {
        git: {
          created_files: ['tests/subdirectory/myTest.js'],
          modified_files: [],
        },
      }

      noTestShortcuts()

      expect(global.fail).toHaveBeenCalledWith(
        'a `describe.only` was left in tests: tests/subdirectory/myTest.js'
      )
    })
  })
  describe('config: skippedTests', () => {
    const MOCK_FILE_INFO = {
      'tests/noSkip.test.js':
        'test("My Test", () => {\n  expect(true).toBe(true)\n  });',
      'tests/only.test.js': 'describe.only("My Test");',
      'tests/skip.test.js': 'test.skip("some test");',
    }
    beforeEach(() => {
      require('fs').__setMockFiles(MOCK_FILE_INFO)
      global.fail = jest.fn()
      global.warn = jest.fn()
    })
    afterEach(() => {
      global.danger = undefined
      global.fail = undefined
      global.warn = undefined
    })
    it('fails when skippedTests: "fail" is passed in', () => {
      global.danger = {
        git: {
          created_files: ['tests/skip.test.js'],
          modified_files: [],
        },
      }

      noTestShortcuts({
        skippedTests: 'fail',
      })

      expect(global.fail).toHaveBeenCalledWith(
        'a `test.skip` was left in tests: tests/skip.test.js'
      )
    })
    it('warns when skippedTests: "warn" is passed in', () => {
      global.danger = {
        git: {
          created_files: ['tests/skip.test.js'],
          modified_files: [],
        },
      }

      noTestShortcuts({
        skippedTests: 'warn',
      })

      expect(global.warn).toHaveBeenCalledWith(
        'a `test.skip` was left in tests: tests/skip.test.js'
      )
    })
    it('does not warn when skippedTests: "warn" is passed in and test contains .only()', () => {
      global.danger = {
        git: {
          created_files: ['tests/only.test.js'],
          modified_files: [],
        },
      }

      noTestShortcuts({
        skippedTests: 'warn',
      })

      expect(global.warn).not.toHaveBeenCalled()
    })
    it('does not fail when tests do not contain .skip()', () => {
      global.danger = {
        git: {
          created_files: ['tests/noSkip.test.js'],
          modified_files: [],
        },
      }

      noTestShortcuts({
        skippedTests: 'fail',
      })

      expect(global.fail).not.toHaveBeenCalled()
    })
    it('defaults to ignoring skipped tests', () => {
      global.danger = {
        git: {
          created_files: ['tests/skip.test.js'],
          modified_files: [],
        },
      }

      noTestShortcuts()

      expect(global.fail).not.toHaveBeenCalled()
    })
  })
  describe('test function names', () => {
    ;['describe', 'context', 'it', 'test'].forEach(testFn => {
      const MOCK_FILE_INFO = {
        'tests/context.test.js': 'context.only("some test");',
        'tests/describe.test.js': 'describe.only("some test");',
        'tests/it.test.js': 'it.only("some test");',
        'tests/test.test.js': 'test.only("some test");',
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
            modified_files: [],
          },
        }

        noTestShortcuts()

        expect(global.fail).toHaveBeenCalledWith(
          `${testFn === 'it'
            ? 'an'
            : 'a'} \`${testFn}.only\` was left in tests: tests/${testFn}.test.js`
        )
      })
    })
  })
  describe('config: patterns', () => {
    const MOCK_FILE_INFO = {
      'tests/index.test.js': 'test.on.ly',
      'tests/subdirectory/myTest.js': 'test.sk.ip',
    }
    beforeEach(() => {
      require('fs').__setMockFiles(MOCK_FILE_INFO)
      global.fail = jest.fn()
    })
    afterEach(() => {
      global.danger = undefined
      global.fail = undefined
    })

    it('allows people to set custom only assertion patterns', () => {
      global.danger = {
        git: {
          created_files: ['tests/index.test.js'],
          modified_files: [],
        },
      }
      noTestShortcuts({
        patterns: { only: ['on.ly'] },
      })

      expect(global.fail).toHaveBeenCalledWith(
        'an `on.ly` was left in tests: tests/index.test.js'
      )
    })

    it('allows people to set custom skip assertion patterns', () => {
      global.danger = {
        git: {
          created_files: ['tests/subdirectory/myTest.js'],
          modified_files: [],
        },
      }
      noTestShortcuts({
        patterns: { skip: ['sk.ip'] },
        skippedTests: 'fail',
      })

      expect(global.fail).toHaveBeenCalledWith(
        'a `sk.ip` was left in tests: tests/subdirectory/myTest.js'
      )
    })
  })
})
