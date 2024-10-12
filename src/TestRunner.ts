import path from "path"
import { globSync } from "glob"
import { Logger } from "./log/index.js"
import { TestContext } from "./TestContext.js"
import { TestReporter } from "./report/TestReporter.js"
import { LogTestReporter } from "./report/LogTestReporter"

export type TestRunnerResult = {
  suites: TestContext[]
  duration: number
}

export class TestRunner {

  static instance: TestRunner

  context = new TestContext("")

  constructor(protected include: string[],
              protected exclude: string[],
              readonly logger: Logger,
              readonly reporter: TestReporter = new LogTestReporter(logger,
                new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}))
  ) {
    logger.debug("include=", this.include, "exclude=", this.exclude)
    TestRunner.instance = this
  }

  async run(): Promise<TestRunnerResult> {
    const runStart = performance.now()
    const files = globSync(this.include, {ignore: this.exclude})
    this.logger.debug("files", files)
    const suites: TestContext[] = []
    let success = true
    for (const filePath of files) {
      this.context = this.context.enter(filePath)
      try {
        const context = await this.runSuite(filePath)
        success = success && !context.error
        suites.push(context)
      } finally {
        this.context = this.context.leave()!
      }
    }
    const runEnd = performance.now()
    const duration = runEnd - runStart
    return {suites, duration}
  }

  async runSuite(fileName: string): Promise<TestContext> {
    const context = this.context
    const reporter = this.reporter
    reporter.testStart(context)
    const filePath = path.join(process.cwd(), fileName)
    await import(filePath)
    reporter.testEnd(context)
    return context
  }

  allSucceeded(result: TestRunnerResult): boolean {
    const successCount = this.context.successCount()
    const total = result.suites.length
    return successCount === total
  }
}
