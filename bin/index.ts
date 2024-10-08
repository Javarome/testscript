#!/usr/bin/env tsx

import * as process from "process"
import { AnsiColor, TestError, TestRunner } from "../dist/index.js"
import { CLI } from "../dist/cli/CLI.js"
import { FilesArgs } from '../src/cli/FilesArgs';

const args = new CLI().getArgs<FilesArgs>()
const include = args.include || process.env.TESTSCRIPT_INCLUDE?.split(",") || ["**/*.test.ts"]
const exclude = args.exclude || process.env.TESTSCRIPT_EXCLUDE?.split(",") || ["node_modules/**/*.*"]
const runner = new TestRunner(include, exclude)
runner.run().then(result => {
  const successCount = runner.successCount(result)
  const total = result.suites.length
  const totalTime = AnsiColor.str(`(${runner.durationStr(result.duration)})`, AnsiColor.fgWhite)
  const success = runner.allSucceeded(result)
  if (success) {
    runner.logger.log(AnsiColor.str(`All ${total} test suites succeeded`, AnsiColor.fgGreen), totalTime)
  } else {
    const errorSummary = !success ? ", " + AnsiColor.str(`${total - successCount} failed`, AnsiColor.fgRed) : ""
    runner.logger.log(`${successCount}/${total} test suites succeeded` + errorSummary, totalTime)
  }
  if (!success) {
    throw new TestError("Tests run failed")
  }
})
