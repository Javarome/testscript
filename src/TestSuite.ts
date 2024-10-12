import { TestRunner } from "./TestRunner.js"
import { TestContext } from "./TestContext"
import { LogTestReporter } from "./report/LogTestReporter"
import { DefaultLogger } from "./log"

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
  ctx = new TestContext(import.meta.url)
}
let context: TestContext = ctx
logger.debug("Using context", ctx)
const reporter = runner?.reporter || new LogTestReporter(logger,
  new Intl.NumberFormat(undefined, {maximumFractionDigits: 2}))

export function execute<T>(name: string, ...specs: TestSpec<T>[]) {
  context = context.enter(name)
  reporter.testStart(context)
  try {
    for (const spec of specs) {
      if (typeof spec === "function") {
        if (!context.skip) {
          context.start = performance.now()
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
    context.end = performance.now()
    reporter.testEnd(context)
    context = context.leave()!
  }
}

export function beforeAll(before: BeforeAllExecutor) {
  beforeAllValue = before
}

export function describe(name: string, ...specs: TestSpec<TestSuiteExecutor>[]) {
  beforeAllValue?.()
  execute(name, ...specs)
}

export function beforeEach(before: BeforeEachExecutor) {
  beforeEachValue = before
}

export function test(name: string, ...specs: TestSpec<TestExecutor>[]) {
  beforeEachValue?.()
  execute(name, ...specs)
}
