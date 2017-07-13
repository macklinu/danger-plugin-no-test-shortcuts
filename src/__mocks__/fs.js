'use strict'

const path = require('path')

const fs = jest.genMockFromModule('fs')

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null)
function __setMockFiles(newMockFiles) {
  mockFiles = newMockFiles
}

// A custom version of `readFileSync` that reads from the special mocked out
// file list set via __setMockFiles
function readFileSync(directoryPath) {
  return mockFiles[directoryPath] || null
}

fs.__setMockFiles = __setMockFiles
fs.readFileSync = readFileSync

module.exports = fs
