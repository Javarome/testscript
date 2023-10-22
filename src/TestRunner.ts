import { promise as glob } from 'glob-promise';
import path from 'path';
import { DefaultLogger, Logger } from './log';
import { AnsiColor } from './AnsiColor';

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
  constructor(protected globPattern: string = '**/*Test.ts',
              readonly logger: Logger = new DefaultLogger('testscript'),
              readonly errorRegExp = /.*(Error: (.+)\n)[\s\S]*?src\/test\/ToBeTest.ts:\d+:\d+\)\n([\s\S]*)/gm,
              readonly numberFormat = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2})
  ) {
  }

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now();
    const files = await glob(this.globPattern, {ignore: 'node_modules/**/*.*'});
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
        let items = this.errorRegExp.exec(stack);
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

  successCount(result: TestRunnerResult) : number {
    return result.suites.reduce((count, suite) => {
      count += suite.error ? 0 : 1;
      return count;
    }, 0);
  }
}
