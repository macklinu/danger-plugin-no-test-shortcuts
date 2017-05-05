interface Config {
  testFilePredicate?: (filePath: string) => boolean
  skippedTests?: 'ignore' | 'warn' | 'fail'
  patterns?: {
    only?: string[]
    skip?: string[]
  }
}

export default function noTestShortcuts(): void
export default function noTestShortcuts(config: Config): void
