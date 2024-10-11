import { TestContext } from "../TestContext"

export abstract class TestReporter {

  abstract testStart(context: TestContext): void

  abstract testEnd(context: TestContext): void
}
