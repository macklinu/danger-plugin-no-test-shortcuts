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
    if (
      content.includes('context.only') ||
      content.includes('describe.only') ||
      content.includes('test.only') ||
      content.includes('it.only')
    ) {
      fail(`an \`only\` was left in tests: ${file}`)
    }
    switch (skippedTests) {
      case 'ignore':
        break
      case 'fail':
      case 'warn':
        if (
          content.includes('context.skip') ||
          content.includes('describe.skip') ||
          content.includes('test.skip') ||
          content.includes('it.skip')
        ) {
          global[skippedTests](`a \`skip\` was left in tests: ${file}`)
        }
        break
      default:
        throw Error(`skippedTests option must be "warn", "fail", or "ignore" but was "${skippedTests}"`)
    }
  }
}
