#!/usr/bin/env tsx

import * as process from "process"
import { CLI } from "../dist/cli/CLI.js"
import { FilesArgs } from "../dist/cli/FilesArgs.js"
import { LogTestReporter } from "../dist/report/LogTestReporter.js"
import { DefaultLogger } from "../dist/log/DefaultLogger.js"
import { TestRunner } from "../dist/TestRunner.js"
import { AnsiColor } from "../dist/AnsiColor.js"
import { TestError } from "../dist/TestError.js"
import { defaultTestReporterOptions, TestReporterOptions } from "../dist/report/TestReporter.js"

const args = new CLI().getArgs<FilesArgs>()
const include = args.include || process.env.TESTSCRIPT_INCLUDE?.split(",") || ["**/*.test.ts"]
const exclude = args.exclude || process.env.TESTSCRIPT_EXCLUDE?.split(",") || ["node_modules/**/*.*"]
const logger = new DefaultLogger("testscript")
const defTestReporterOptions: TestReporterOptions = Object.assign({}, defaultTestReporterOptions)
const testReporterOptions: TestReporterOptions = Object.assign({}, defTestReporterOptions)
const filter = args.filter || process.env.TESTSCRIPT_FILTER?.split(",")
if (filter) {
  Object.assign(testReporterOptions, {filter})
}
logger.debug("testReporterOptions", testReporterOptions)
const reporter = new LogTestReporter(logger, testReporterOptions)
const runner = new TestRunner(include, exclude, logger, reporter)
runner.run().then(async (result) => {
  const successCount = runner.context.successCount()
  const total = result.subContexts.length
  const totalTime = reporter.durationStr(result.duration)
  const success = result.allSucceeded()
  if (success) {
    logger.log(AnsiColor.str(`All ${total} test suites succeeded`, AnsiColor.fgGreen), totalTime)
  } else {
    const errorSummary = !success ? ", " + AnsiColor.str(`${total - successCount} failed`, AnsiColor.fgRed) : ""
    logger.log(`${successCount}/${total} test suites succeeded` + errorSummary, totalTime)
  }
  if (!success) {
    throw new TestError("Tests run failed")
  }
})
