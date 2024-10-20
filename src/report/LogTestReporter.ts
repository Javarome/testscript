import { defaultTestReporterOptions, TestReporter, TestReporterOptions } from "./TestReporter.js"
import { Logger } from "../log/index.js"
import { AnsiColor } from "../AnsiColor.js"
import { TestContext } from "../TestContext.js"

export class LogTestReporter extends TestReporter {

  protected indent = 0

  constructor(protected logger: Logger, readonly options: TestReporterOptions = defaultTestReporterOptions) {
    super()
  }

  protected prefix(): string {
    return " ".repeat(this.indent)
  }

  protected changeIndent(change: number) {
    // console.debug("change indent from", this.indent, "to", this.indent + change)
    this.indent = Math.max(0, this.indent + change)
  }

  testStart(context: TestContext): void {
    this.logger.debug("Executing", context.name)
    /* if (this.options.filter.includes(context.type)) {
      const prefix = this.prefix()
      this.logger.log(prefix + `"${context.name}"`)
    }*/
    this.changeIndent(this.options.indentSize)
  }

  durationStr(value: number | undefined): string {
    const str = typeof value === "number"
      ? (this.options.numberFormat.format(value) + (value > 1000 ? "s" : " ms")) : `not completed`
    return AnsiColor.str(`(${str})`, AnsiColor.fgWhite)
  }

  testError(context: TestContext): { status: string, details: string } {
    const status = AnsiColor.str("FAIL", AnsiColor.fgRed)
    let details = ""
    const error = context.getError()
    if (error) {
      const stack = error.stack
      if (stack) {
        const lines = stack.split("\n").filter(s => s.includes(".test.ts"))
        details = AnsiColor.str(error + "\n" + lines.join("\n"), AnsiColor.fgRed)
      }
    }
    return {status, details}
  }

  testEnd(context: TestContext): void {
    this.changeIndent(-this.options.indentSize)
    if (this.options.filter.includes(context.type)) {
      let status: string
      let details: string | undefined
      if (context.hasError()) {
        const err = this.testError(context)
        status = err.status
        details = err.details
      } else if (context.skip) {
        status = AnsiColor.str("SKIP", AnsiColor.fgWhite)
      } else {
        status = AnsiColor.str("PASS", AnsiColor.fgGreen)
        details = this.durationStr(context.duration)
      }
      this.logger.log(status, this.prefix() + `${context.name}`, details || "")
    }
    /*if (this.indent <= 0) {
      this.logger.log("")
    }*/
  }
}
