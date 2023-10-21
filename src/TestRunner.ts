import { promise as glob } from 'glob-promise';
import path from 'path';
import { DefaultLogger, Logger } from './log';

export type TestRunnerResult = {
  success: boolean
  suites: SuiteResult[]
  duration: number
}

export type SuiteResult = {
  file: string
  success: boolean
  error?: Error
  duration: number
}

export class TestRunner {
  constructor(protected glob: string = '**/*Test.ts', readonly logger: Logger = new DefaultLogger('testscript')) {
  }

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now();
    const files = await glob(this.glob);
    const suites: SuiteResult[] = [];
    let success = true;
    for (const filePath of files) {
      let suiteResult = await this.runSuite(filePath);
      success = success && suiteResult.success
      suites.push(suiteResult);
    }
    const runEnd = performance.now();
    const duration = runEnd - runStart;
    return {success, suites, duration};
  }

  async runSuite(file: string): Promise<SuiteResult> {
    const testStart = performance.now();
    let testEnd: number;
    let error: Error | undefined;
    let success;
    try {
      this.logger.debug('Executing', file);
      const c = path.join(process.cwd(), file);
      await import(c);
      success = true;
    } catch (e) {
      error = e as Error;
      success = false;
    } finally {
      testEnd = performance.now();
    }
    const duration = testEnd - testStart;
    this.logger.log(success ? 'PASS' : 'FAIL', file, error ? error.stack : '');
    return {file, success, error, duration};
  }
}
