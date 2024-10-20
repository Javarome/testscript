import path from "path"
import { globSync } from "glob"
import { Logger } from "./log/Logger.js"
import { TestContext } from "./TestContext.js"
import { defaultTestReporterOptions, TestReporter } from "./report/TestReporter.js"
import { LogTestReporter } from "./report/LogTestReporter.js"

export class TestRunner {

  context = new TestContext("", "root")

  constructor(protected include: string[], protected exclude: string[], readonly logger: Logger,
              readonly reporter: TestReporter = new LogTestReporter(logger, defaultTestReporterOptions)
  ) {
    logger.debug("include=", this.include, "exclude=", this.exclude)
    const global = globalThis as any
    global.testscriptRunner = this
  }

  async run(): Promise<TestContext> {
    const files = globSync(this.include, {ignore: this.exclude})
    this.logger.debug("files", files)
    let success = true
    for (const fileName of files) {
      const context = await this.runSuite(fileName)
      success = success && !context.hasError()
    }
    this.context.leave()
    return this.context
  }

  async runSuite(fileName: string): Promise<TestContext> {
    try {
      this.context = this.context.enter(fileName, "file")
      this.reporter.testStart(this.context)
      const filePath = path.join(process.cwd(), fileName)
      const testModule = await import(filePath)
      // testSuite.run()
    } finally {
      this.context = this.context.leave()!
      this.reporter.testEnd(this.context)
    }
    return this.context
  }
}
