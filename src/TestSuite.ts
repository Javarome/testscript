import { ContextType, TestContext } from "./TestContext.js"
import { LogTestReporter } from "./report/LogTestReporter.js"
import { DefaultLogger } from "./log/DefaultLogger.js"
import { defaultTestReporterOptions, TestReporter } from "./report/TestReporter.js"

export type TestOptions = {
  skip?: boolean
}
type Executor = () => void
type TestSuiteExecutor = Executor
type BeforeEachExecutor = Executor
type AfterEachExecutor = Executor
type BeforeAllExecutor = Executor
type AfterAllExecutor = Executor
type TestExecutor = Executor

/**
 * @template E Executor
 */
type TestSpec<E> = E | TestOptions

export class Test {

  protected specs: TestSpec<TestExecutor>[]

  constructor(readonly name: string, ...specs: TestSpec<TestExecutor>[]) {
    this.specs = specs
  }

  execute(testSuite: TestSuite) {
    testSuite.execute(this.name, "test", ...this.specs)
  }
}

export class Describe {

  tests: Test[] = []
  specs: TestSpec<TestExecutor>[]
  beforeAllValue: BeforeAllExecutor | undefined
  afterAllValue: AfterAllExecutor | undefined
  beforeEachValue: BeforeEachExecutor | undefined
  afterEachValue: AfterEachExecutor | undefined

  constructor(readonly name: string, ...specs: TestSpec<TestExecutor>[]) {
    this.specs = specs
  }

  execute(testSuite: TestSuite) {
    testSuite.execute(this.name, "describe", ...this.specs)
    for (const test of this.tests) {
      this.beforeEachValue?.()
      try {
        test.execute(testSuite)
      } finally {
        this.afterEachValue?.()
      }
    }
  }
}

export class TestSuite {

  readonly describes: Describe[] = []
  readonly rootDescribe = new Describe("")

  set context(context: TestContext) {
    this._context = context
    //  this.logger.debug(this._context?.fullName)
  }

  get context(): TestContext {
    return this._context
  }

  constructor(protected _context: TestContext, protected reporter: TestReporter) {
  }

  protected leave() {
    const left = this.context
    this.context = this.context.leave()!
    this.reporter.testEnd(left)
  }

  execute<T>(name: string, type: ContextType, ...specs: TestSpec<T>[]) {
    // This module as any module will be loaded only once, so you can't rely on constructor to get current file context
    if (this.context.type === "file") {
      const runner = (globalThis as any).testscriptRunner
      let contextFull = this.context.fullName
      let runnerFullName = runner.context.fullName
      if (contextFull !== runnerFullName) {
        this.leave()
        this.context = runner.context
      }
    }
    this.context = this.context.enter(name, type)
    this.reporter.testStart(this.context)
    try {
      for (const spec of specs) {
        if (typeof spec === "function") {
          if (!this.context.skip) {
            const executor = spec as Executor
            executor()
          }
        } else {
          let skip = (spec as TestOptions).skip
          if (skip) {
            this.context.skip = skip || false
          }
        }
      }
    } catch (e) {
      this.context.error = e as Error
    } finally {
      this.leave()
    }
  }

  protected currentDescribe(): Describe {
    return this.describes[this.describes.length - 1] || this.rootDescribe
  }

  run() {
    this.currentDescribe().beforeAllValue?.()
    for (const describe of this.describes) {
      describe.execute(testSuite)
    }
    this.currentDescribe().afterAllValue?.()
  }

  addTest(test: Test) {
    this.currentDescribe().tests.push(test)
  }

  setBeforeEach(before: BeforeEachExecutor) {
    this.currentDescribe().beforeEachValue = before
  }

  setBeforeAll(before: BeforeAllExecutor) {
    this.currentDescribe().beforeAllValue = before
  }

  setAfterAll(after: AfterAllExecutor) {
    this.currentDescribe().afterAllValue = after
  }

  beforeEach(): void {
    let beforeEachVal = this.currentDescribe().beforeEachValue
    if (beforeEachVal) {
      beforeEachVal()
    }
  }

  beforeAll(): void {
    let beforeAllVal = this.currentDescribe().beforeAllValue
    if (beforeAllVal) {
      beforeAllVal()
    }
  }

  afterAll(): void {
    let afterAllVal = this.currentDescribe().afterAllValue
    if (afterAllVal) {
      afterAllVal()
    }
  }

  afterEach(): void {
    let afterEachVal = this.currentDescribe().afterEachValue
    if (afterEachVal) {
      afterEachVal()
    }
  }

  setAfterEach(after: AfterEachExecutor) {
    this.currentDescribe().afterEachValue = after
  }
}

const logger = new DefaultLogger("testscript")
const runner = (globalThis as any).testscriptRunner
let ctx
if (runner) {
  logger.debug("Found TestRunner.instance")
  ctx = runner.context
} else {
  logger.debug("No TestRunner.instance found")
}
if (!ctx) {
  ctx = new TestContext("", "root")
}
const reporter = runner?.reporter || new LogTestReporter(logger, defaultTestReporterOptions)
export const testSuite: TestSuite = new TestSuite(ctx, reporter)

export function beforeAll(before: BeforeAllExecutor) {
  testSuite.setBeforeAll(before)
  testSuite.beforeAll()
}

export function afterAll(after: AfterAllExecutor) {
  testSuite.setAfterAll(after)
  testSuite.afterAll()
}

export function describe(name: string, ...specs: TestSpec<TestSuiteExecutor>[]) {
  const describe = new Describe(name, ...specs)
  // testSuite.describes.push(describe)
  describe.execute(testSuite)
}

export function beforeEach(before: BeforeEachExecutor) {
  testSuite.setBeforeEach(before)
  testSuite.beforeEach()
}

export function afterEach(after: AfterEachExecutor) {
  testSuite.setAfterEach(after)
  testSuite.afterEach()
}

export function test(name: string, ...specs: TestSpec<TestExecutor>[]) {
  const test = new Test(name, ...specs)
  // testSuite.addTest(test)
  test.execute(testSuite)
}
