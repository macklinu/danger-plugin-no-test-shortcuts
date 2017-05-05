# danger-plugin-no-test-shortcuts

[![Build Status](https://travis-ci.org/macklinu/danger-plugin-no-test-shortcuts.svg?branch=master)](https://travis-ci.org/macklinu/danger-plugin-no-test-shortcuts)
[![npm version](https://badge.fury.io/js/danger-plugin-no-test-shortcuts.svg)](https://badge.fury.io/js/danger-plugin-no-test-shortcuts)

[Danger](https://github.com/danger/danger-js) plugin to prevent merging test shortcuts (.only and .skip)

## Usage

Import and invoke the `noTestShortcuts()` function in your Dangerfile:

```js
// dangerfile.js or dangerfile.ts
import noTestShortcuts from 'danger-plugin-no-test-shortcuts'

noTestShortcuts()
```

By default, Danger will fail the build if a new or modified test file contains `.only()` - this prevents merging changes that will prevent your entire test suite from running on each pull request.

This plugin takes an optional config object with a couple of options:

```js
noTestShortcuts({
  // A predicate for determining where your test files live.
  // Defaults to file paths that start with 'tests' (e.g. tests/index.spec.js).
  testFilePredicate: (filePath) => filePath.endsWith('.test.js'),

  // Defines the behavior for handling skipped tests (e.g. test.skip()).
  // Defaults to 'ignore'.
  // Valid values: 'ignore', 'fail', 'warn'.
  skippedTests: 'fail',

  // Defines any (additional) patterns you want to test for
  // Defaults to no extra patterns
  // Here you can add patterns specific to how your test framework does skips/onlys
  patterns: {
    only: ['customOnly'],
    skip: ['sk.ip']
  }
})
```

## Development

Install [Yarn](https://yarnpkg.com/en/) and install the dependencies - `yarn install`.

Run the tests with `yarn test` (uses [Jest](https://facebook.github.io/jest/)).

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated NPM package publishing.

The main caveat: instead of running `git commit`, run `yarn commit` and follow the prompts to input a conventional changelog message via [commitizen](https://github.com/commitizen/cz-cli).
