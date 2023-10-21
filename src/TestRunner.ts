import { promise as glob } from 'glob-promise';
import path from 'path';
import { DefaultLogger, Logger } from './log';

export type TestRunnerResult = {
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
  constructor(protected glob: string = '**/*Test.ts', protected logger: Logger = new DefaultLogger('ts-test')) {
  }

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now();
    const files = await glob(this.glob);
    const suites: SuiteResult[] = [];
    for (const filePath of files) {
      suites.push(await this.runSuite(filePath));
    }
    const runEnd = performance.now();
    const duration = runEnd - runStart;
    return {suites, duration};
  }

  async runSuite(file: string): Promise<SuiteResult> {
    const testStart = performance.now();
    let testEnd: number;
    let error: Error | undefined;
    let success;
    try {
      this.logger.log('Processing', file);
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
    return {file, success, error, duration};
  }
}
