import { TestReporter } from "./TestReporter.js"
import { Logger } from "../log/index.js"
import { AnsiColor } from "../AnsiColor.js"
import { TestContext } from "../TestContext.js"

export class LogTestReporter extends TestReporter {

  constructor(protected logger: Logger,
              readonly numberFormat = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2})) {
    super()
  }

  testStart(context: TestContext): void {
    this.logger.debug("Executing", context.name)
    //  this.logger.logPart("\n", this.prefix(context), context.name)
  }

  durationStr(value: number | undefined): string {
    return value !== void 0 ? this.numberFormat.format(value) + " ms" : "not completed"
  }

  protected prefix(testContext: TestContext): string {
    return testContext.parent?.name ? "  " + this.prefix(testContext.parent) : ""
  }

  testEnd(context: TestContext): void {
    let status: string
    let details: string | undefined
    if (context.hasError()) {
      status = AnsiColor.str("FAIL", AnsiColor.fgRed)
      let error = context.error
      if (error) {
        let stack = error.stack
        if (stack) {
          const lines = stack.split("\n").filter(s => s.includes(".test.ts"))
          details = AnsiColor.str(error + "\n" + lines.join("\n"), AnsiColor.fgRed)
        }
      }
    } else if (context.skip) {
      status = AnsiColor.str("SKIP", AnsiColor.fgWhite)
    } else {
      status = AnsiColor.str("PASS", AnsiColor.fgGreen)
      details = AnsiColor.str(`(${this.durationStr(context.duration)})`, AnsiColor.fgWhite)
    }
    this.logger.log(status, this.prefix(context), context.name, details || "")
  }
}
