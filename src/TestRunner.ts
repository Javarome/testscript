import path from "path"
import { globSync } from "glob"
import { Logger } from "./log/index.js"
import { TestContext } from "./TestContext.js"
import { TestReporter } from "./report/TestReporter.js"
import { LogTestReporter } from "./report/LogTestReporter.js"

export class TestRunner {

  static instance: TestRunner

  context = new TestContext("", "root")

  constructor(protected include: string[],
              protected exclude: string[],
              readonly logger: Logger,
              readonly reporter: TestReporter = new LogTestReporter(logger,
                new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}))
  ) {
    logger.debug("include=", this.include, "exclude=", this.exclude)
    TestRunner.instance = this
  }

  async run(): Promise<TestContext> {
    const files = globSync(this.include, {ignore: this.exclude})
    this.logger.debug("files", files)
    let success = true
    for (const fileName of files) {
      const context = await this.runSuite(fileName)
      success = success && !context.error
    }
    this.context.leave()
    return this.context
  }

  async runSuite(fileName: string): Promise<TestContext> {
    this.context = this.context.enter(fileName, "file")
    const reporter = this.reporter
    const context = this.context
    reporter.testStart(context)
    try {
      const filePath = path.join(process.cwd(), fileName)
      await import(filePath)
    } finally {
      this.context = this.context.leave()!
      reporter.testEnd(context)
    }
    return context
  }
}
