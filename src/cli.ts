#!/usr/bin/env node

import { runCLI } from './lib.js'

const args = process.argv.slice(2)
const loopMode = args.includes('-l') || args.includes('--loop')
let packageName = args.find((arg) => arg !== '-l' && arg !== '--loop')

if (loopMode) {
  // Loop mode: keep prompting
  while (true) {
    await runCLI(packageName, loopMode)
    packageName = undefined // reset for next prompt
  }
} else {
  await runCLI(packageName)
}

export { runCLI }
