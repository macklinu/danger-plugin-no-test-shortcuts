import {readFileSync} from 'fs'
import _ from 'lodash'

const getStart = pattern =>
  _.includes(['a', 'e', 'i', 'o', 'u'], pattern[0].toLowerCase()) ? 'an' : 'a'

export default function noTestShortcuts (
  {
    testFilePredicate = path => path.startsWith('tests'),
    skippedTests = 'ignore',
    patterns = {only: [], skip: []}
  } = {}
) {
  const newOrModifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  )
  const newOrModifiedTests = newOrModifiedFiles.filter(testFilePredicate)
  for (const file of newOrModifiedTests) {
    const content = readFileSync(file).toString()
    const allPatterns = [
      'context.only',
      'describe.only',
      'test.only',
      'it.only'
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
        const skipPatternsResult = (patterns.skip || [])
          .find(p => _.includes(content, p))
        const skipPatterns = [
          'context.skip',
          'describe.skip',
          'test.skip',
          'it.skip'
        ].concat(patterns.skip || [])
        const skipMatch = skipPatterns.find(p => _.includes(content, p))
        if (skipMatch) {
          global[
            skippedTests
          ](`${getStart(skipMatch)} \`${skipMatch}\` was left in tests: ${file}`)
        }
        break
      default:
        throw Error(`skippedTests option must be "warn", "fail", or "ignore" but was "${skippedTests}"`)
    }
  }
}
