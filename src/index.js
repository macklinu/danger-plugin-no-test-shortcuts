import {readFileSync} from 'fs'

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
    const onlyPatternsResult = patterns.only && patterns.only.length > 0
      ? patterns.only.map(p => content.includes(p)).includes(true)
      : false
    if (
      content.includes('context.only') ||
      content.includes('describe.only') ||
      content.includes('test.only') ||
      content.includes('it.only') ||
      onlyPatternsResult
    ) {
      fail(`an \`only\` was left in tests: ${file}`)
    }
    switch (skippedTests) {
      case 'ignore':
        break
      case 'fail':
      case 'warn':
        const skipPatternsResult = patterns.skip && patterns.skip.length > 0
          ? patterns.skip.map(p => content.includes(p)).includes(true)
          : false
        if (
          content.includes('context.skip') ||
          content.includes('describe.skip') ||
          content.includes('test.skip') ||
          content.includes('it.skip') ||
          skipPatternsResult
        ) {
          global[skippedTests](`a \`skip\` was left in tests: ${file}`)
        }
        break
      default:
        throw Error(`skippedTests option must be "warn", "fail", or "ignore" but was "${skippedTests}"`)
    }
  }
}
