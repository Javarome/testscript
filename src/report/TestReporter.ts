import { ContextType, TestContext } from "../TestContext.js"

export type TestReporterOptions = {
  numberFormat: Intl.NumberFormat
  indentSize: number,
  filter: ContextType[]
}

export const defaultTestReporterOptions: TestReporterOptions = {
  numberFormat: new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}),
  indentSize: 2,
  filter: ["file"]
}

export abstract class TestReporter {

  abstract testStart(context: TestContext): void

  abstract testEnd(context: TestContext): void

  /**
   * @param context
   * @return {status: string, detail: string} The error status ("FAIL") message and the error stack details
   */
  abstract testError(context: TestContext): {status: string, details: string}
}
