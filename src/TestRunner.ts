import path from "path"
import { globSync } from "glob"
import { Logger } from "./log/index.js"
import { TestContext } from "./TestContext.js"
import { TestReporter } from "./report/TestReporter.js"

export type TestRunnerResult = {
  suites: TestContext[]
  duration: number
}

export class TestRunner {

  constructor(protected include: string[], protected exclude: string[],
              readonly logger: Logger) {
    logger.debug("include=", this.include, "exclude=", this.exclude)
  }

  static context = new TestContext("")
  static reporter: TestReporter

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now()
    const files = globSync(this.include, {ignore: this.exclude})
    this.logger.debug("files", files)
    const suites: TestContext[] = []
    let success = true
    for (const filePath of files) {
      TestRunner.context = TestRunner.context.enter(filePath)
      try {
        const context = await this.runSuite(filePath)
        success = success && !context.error
        suites.push(context)
      } finally {
        TestRunner.context = TestRunner.context.leave()!
      }
    }
    const runEnd = performance.now()
    const duration = runEnd - runStart
    return {suites, duration}
  }

  async runSuite(fileName: string): Promise<TestContext> {
    const context = TestRunner.context
    const reporter = TestRunner.reporter
    reporter.testStart(context)
    const filePath = path.join(process.cwd(), fileName)
    await import(filePath)
    reporter.testEnd(context)
    return context
  }

  allSucceeded(result: TestRunnerResult): boolean {
    const successCount = this.successCount(result)
    const total = result.suites.length
    return successCount === total
  }

  successCount(result: TestRunnerResult): number {
    return result.suites.reduce((count, suite) => {
      count += suite.error ? 0 : 1
      return count
    }, 0)
  }
}
