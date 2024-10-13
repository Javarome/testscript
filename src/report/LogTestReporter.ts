import { TestReporter } from "./TestReporter.js"
import { Logger } from "../log/index.js"
import { AnsiColor } from "../AnsiColor.js"
import { ContextType, TestContext } from "../TestContext.js"

export class LogTestReporter extends TestReporter {

  protected indent = 0

  constructor(protected logger: Logger,
              readonly numberFormat = new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}),
              protected indentSize = 2,
              protected filter: ContextType[] = ["file"]) {
    super()
  }

  protected prefix(): string {
    return " ".repeat(this.indent)
  }

  protected changeIndent(change: number) {
    // console.debug("change indent from", this.indent, "to", this.indent + change)
    this.indent += change
  }

  testStart(context: TestContext): void {
    //this.logger.debug("Executing", context.name)
    if (this.filter.includes(context.type)) {
    /*  const prefix = this.prefix(context)
      this.logger.log(prefix + `"${context.name}"`)*/
    }
    this.changeIndent(this.indentSize)
  }

  durationStr(value: number | undefined): string {
    let str = value !== undefined ? this.numberFormat.format(value) + " ms" : "not completed"
    return AnsiColor.str(`(${str})`, AnsiColor.fgWhite)
  }

  testEnd(context: TestContext): void {
    this.changeIndent(-this.indentSize)
    if (this.filter.includes(context.type)) {
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
        details = this.durationStr(context.duration)
      }
      this.logger.log(status, this.prefix() + `${context.name}`, details || "")
    }
    /*if (this.indent <= 0) {
      this.logger.log("")
    }*/
  }
}
