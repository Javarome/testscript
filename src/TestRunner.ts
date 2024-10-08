import path from 'path';
import { globSync } from 'glob';
import { DefaultLogger, Logger } from './log/index.js';
import { AnsiColor } from './AnsiColor.js';

export type TestRunnerResult = {
  suites: SuiteResult[]
  duration: number
}

export type SuiteResult = {
  file: string
  error?: Error
  duration: number
}

export class TestRunner {

  constructor(
    protected include: string[],
    protected exclude: string[],
    readonly logger: Logger = new DefaultLogger('testscript'),
    readonly numberFormat = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2})
  ) {
    logger.debug('include=', this.include, 'exclude=', this.exclude);
  }

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now();
    const files = globSync(this.include, {ignore: this.exclude});
    this.logger.debug('files', files);
    const suites: SuiteResult[] = [];
    let success = true;
    for (const filePath of files) {
      let suiteResult = await this.runSuite(filePath);
      success = success && !suiteResult.error;
      suites.push(suiteResult);
    }
    const runEnd = performance.now();
    const duration = runEnd - runStart;
    return {suites, duration};
  }

  async runSuite(file: string): Promise<SuiteResult> {
    const testStart = performance.now();
    let testEnd: number;
    let error: Error | undefined;
    try {
      this.logger.debug('Executing', file);
      const test = path.join(process.cwd(), file);
      await import(test);
    } catch (e) {
      console.error(e);
      error = e as Error;
    } finally {
      testEnd = performance.now();
    }
    const duration = testEnd - testStart;
    let status: string;
    let details: string | undefined;
    if (error) {
      status = AnsiColor.str('FAIL', AnsiColor.fgRed);
      let stack = error.stack;
      if (stack) {
        let filePattern = file.replaceAll('/', '\/');
        const errorRegExp = new RegExp(`.*(Error: (.+)\\n)[\\s\\S]*?${filePattern}:\\d+:\\d+\\)\n([\\s\\S]*)`,
          'gm');
        let items = errorRegExp.exec(stack);
        if (items && items.length > 0) {
          details = AnsiColor.str(items[2] + '\n' + items[3], AnsiColor.fgRed);
        }
      }
    } else {
      status = AnsiColor.str('PASS', AnsiColor.fgGreen);
      details = AnsiColor.str(`(${this.durationStr(duration)})`, AnsiColor.fgWhite);
    }
    this.logger.log(status, file, details || '');
    return {file, duration, error};
  }

  durationStr(value: number): string {
    return this.numberFormat.format(value) + ' ms';
  }

  allSucceeded(result: TestRunnerResult): boolean {
    const successCount = this.successCount(result);
    const total = result.suites.length;
    return successCount === total;
  }

  successCount(result: TestRunnerResult): number {
    return result.suites.reduce((count, suite) => {
      count += suite.error ? 0 : 1;
      return count;
    }, 0);
  }
}
