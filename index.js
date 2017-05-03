import {readFileSync} from 'fs'

export default function noTestShortcuts (
  {testFilePredicate = path => path.startsWith('tests')} = {}
) {
  const newOrModifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  )
  const newOrModifiedTests = newOrModifiedFiles.filter(testFilePredicate)
  newOrModifiedTests.forEach(file => {
    const content = readFileSync(file).toString()
    if (
      content.includes('it.only') ||
      content.includes('describe.only') ||
      content.includes('context.only') ||
      content.includes('test.only')
    ) {
      fail(`an \`only\` was left in tests: ${file}`)
    }
  })
}
