import {readFileSync} from 'fs'

export default function noTestShortcuts (
  {
    testFilePredicate = path => path.startsWith('tests'),
    skippedTests = 'ignore'
  } = {}
) {
  const newOrModifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  )
  const newOrModifiedTests = newOrModifiedFiles.filter(testFilePredicate)
  for (const file of newOrModifiedTests) {
    const content = readFileSync(file).toString()
    if (/.*context|describe|it|test\.only.*/gi.test(content)) {
      fail(`an \`only\` was left in tests: ${file}`)
    }
    switch (skippedTests) {
      case 'ignore':
        break
      case 'fail':
      case 'warn':
        const dangerFn = global[skippedTests]
        if (/.*context|describe|it|test\.skip.*/gi.test(content)) {
          dangerFn(`a \`skip\` was left in tests: ${file}`)
        }
        break
      default:
        throw Error(`skippedTests option must be "warn", "fail", or "ignore" but was "${skippedTests}"`)
    }
  }
}
