import { TestRunner } from "./TestRunner.js"
import { ContextType, TestContext } from "./TestContext.js"
import { LogTestReporter } from "./report/LogTestReporter.js"
import { DefaultLogger } from "./log/index.js"

export type TestOptions = {
  skip?: boolean
}
type Executor = () => void
type TestSuiteExecutor = Executor
type BeforeEachExecutor = Executor
type BeforeAllExecutor = Executor
type TestExecutor = Executor
type TestSpec<T> = T | TestOptions

let beforeAllValue: BeforeAllExecutor
let beforeEachValue: BeforeEachExecutor

const logger = new DefaultLogger("testscript")
const runner = TestRunner.instance
let ctx
if (runner) {
  logger.debug("Found TestRunner.instance", Boolean(TestRunner.instance))
  ctx = runner.context
}
if (!ctx) {
  ctx = new TestContext("", "root")
}
let context: TestContext = ctx
logger.debug("Using context", ctx)
const reporter = runner?.reporter || new LogTestReporter(logger,
  new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}))

export function execute<T>(name: string, type: ContextType, ...specs: TestSpec<T>[]) {
  context = context.enter(name, type)
  reporter.testStart(context)
  try {
    for (const spec of specs) {
      if (typeof spec === "function") {
        if (!context.skip) {
          const executor = spec as Executor
          executor()
        }
      } else {
        let skip = (spec as TestOptions).skip
        if (skip) {
          context.skip = skip || false
        }
      }
    }
  } catch (e) {
    context.error = e as Error
  } finally {
    const left = context
    context = context.leave()!
    reporter.testEnd(left);
  }
}

export function beforeAll(before: BeforeAllExecutor) {
  beforeAllValue = before
}

export function describe(name: string, ...specs: TestSpec<TestSuiteExecutor>[]) {
  beforeAllValue?.()
  execute(name, "describe", ...specs)
}

export function beforeEach(before: BeforeEachExecutor) {
  beforeEachValue = before
}

export function test(name: string, ...specs: TestSpec<TestExecutor>[]) {
  beforeEachValue?.()
  execute(name, "test", ...specs)
}
