import { readFileSync } from 'fs'
import * as _ from 'lodash'

export interface Config {
  /**
   * A predicate for determining where your test files live.
   *
   * Example:
   * ```
   * // Filters all files that end with '.test.js'.
   * testFilePredicate: (filePath) => filePath.endsWith('.test.js')
   * ```
   */
  testFilePredicate: (filePath: string) => boolean
  /**
   * Defines the danger function to call for skipped tests (e.g. `test.skip()`).
   * Defaults to 'ignore', which will not invoke any danger function.
   * Valid values: 'ignore', 'fail', 'warn'.
   */
  skippedTests?: 'ignore' | 'warn' | 'fail'
  /**
   * Defines any additional patterns you want to search for in your test files.
   * Defaults to no extra patterns.
   * Here you can add patterns specific to how your test framework does skips/onlys.
   */
  patterns?: {
    only?: string[]
    skip?: string[]
  }
}

const getStart = (pattern: string): string =>
  _.includes(['a', 'e', 'i', 'o', 'u'], pattern[0].toLowerCase()) ? 'an' : 'a'

export default function noTestShortcuts({
  testFilePredicate,
  skippedTests = 'ignore',
  patterns = { only: [], skip: [] },
}: Config) {
  if (!testFilePredicate) {
    throw new Error('Must supply testFilePredicate()')
  }

  const newOrModifiedFiles: string[] = danger.git.modified_files
    .concat(danger.git.created_files)
    .filter(Boolean)
  const newOrModifiedTests = newOrModifiedFiles.filter(testFilePredicate)
  for (const file of newOrModifiedTests) {
    const content = readFileSync(file).toString()
    const allPatterns = [
      'context.only',
      'describe.only',
      'test.only',
      'it.only',
    ].concat(patterns.only || [])
    const match = allPatterns.find(p => _.includes(content, p))

    if (match) {
      fail(`${getStart(match)} \`${match}\` was left in tests: ${file}`)
    }

    switch (skippedTests) {
      case 'ignore':
        break
      case 'fail':
      case 'warn':
        const skipPatterns = [
          'context.skip',
          'describe.skip',
          'test.skip',
          'it.skip',
        ].concat(patterns.skip || [])
        const skipMatch = skipPatterns.find(p => _.includes(content, p))
        if (skipMatch) {
          global[skippedTests](
            `${getStart(skipMatch)} \`${skipMatch}\` was left in tests: ${file}`
          )
        }
        break
      default:
        throw Error(
          `skippedTests option must be "warn", "fail", or "ignore" but was "${skippedTests}"`
        )
    }
  }
}
