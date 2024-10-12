#!/usr/bin/env tsx

import * as process from "process"
import { CLI } from "../dist/cli/CLI.js"
import { FilesArgs } from "../dist/cli/FilesArgs"
import { LogTestReporter } from "../dist/report/LogTestReporter.js"
import { DefaultLogger } from "../dist/log/index.js"
import { TestRunner } from "../src/TestRunner.js"
import { AnsiColor } from "../src/AnsiColor.js"
import { TestError } from "../src/TestError.js"

const args = new CLI().getArgs<FilesArgs>()
const include = args.include || process.env.TESTSCRIPT_INCLUDE?.split(",") || ["**/*.test.ts"]
const exclude = args.exclude || process.env.TESTSCRIPT_EXCLUDE?.split(",") || ["node_modules/**/*.*"]
const logger = new DefaultLogger("testscript")
const reporter = new LogTestReporter(logger, new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}))
const runner = new TestRunner(include, exclude, logger, reporter)
runner.run().then(result => {
  const successCount = runner.context.successCount()
  const total = result.suites.length
  const totalTime = AnsiColor.str(`(${new LogTestReporter(logger,
    new Intl.NumberFormat(undefined, {maximumFractionDigits: 2})).durationStr(result.duration)})`, AnsiColor.fgWhite)
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
