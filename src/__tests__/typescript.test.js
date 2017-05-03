import {join} from 'path'
import {check} from 'typings-tester'

describe('TypeScript definition', () => {
  it('compiles against index.d.ts', () => {
    expect(() =>
      check([join(__dirname, 'test.ts')], join(__dirname, 'tsconfig.json'))
    ).not.toThrow()
  })
})
