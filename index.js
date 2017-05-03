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
    if (/.*context|describe|it|test\.only.*/gi.test(content)) {
      fail(`an \`only\` was left in tests: ${file}`)
    }
  })
}
