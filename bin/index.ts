#!/usr/bin/env tsx

import * as process from 'process';
import { AnsiColor, TestError, TestRunner } from '../src';
import { CLI } from '../src/cli/CLI';
import { FilesArgs } from '../src/cli/FilesArgs';

const args = new CLI().getArgs<FilesArgs>();
const includePattern = args.include || process.env.TESTSCRIPT_INCLUDE?.split(",") || ['**/*.test.ts']
const excludePattern = args.exclude || process.env.TESTSCRIPT_EXCLUDE?.split(",") || ['node_modules/**/*.*']
const runner = new TestRunner(includePattern, excludePattern);
runner.run().then(result => {
  const successCount = runner.successCount(result);
  const total = result.suites.length;
  const totalTime = AnsiColor.str(`(${runner.durationStr(result.duration)})`, AnsiColor.fgWhite);
  const success = runner.allSucceeded(result);
  if (success) {
    runner.logger.log(AnsiColor.str(`All ${total} test suites succeeded`, AnsiColor.fgGreen), totalTime);
  } else {
    const errorSummary = !success ? ', ' + AnsiColor.str(`${total - successCount} failed`, AnsiColor.fgRed) : '';
    runner.logger.log(`${successCount}/${total} test suites succeeded` + errorSummary, totalTime);
  }
  if (!success) {
    throw new TestError('Tests run failed');
  }
});
