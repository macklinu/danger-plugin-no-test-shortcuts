interface Config {
  testFilePredicate?: (filePath: string) => boolean
  skippedTests?: 'ignore' | 'warn' | 'fail'
}

export default function noTestShortcuts(): void
export default function noTestShortcuts(config: Config): void
