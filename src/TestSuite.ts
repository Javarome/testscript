type TestSuiteExecutor = () => void
type BeforeEachExecutor = () => void
type TestExecutor = () => void

let beforeEachValue: BeforeEachExecutor;

export function describe(name: string, suiteExecutor: TestSuiteExecutor) {
  suiteExecutor();
}


export function test(name: string, testExecutor: TestExecutor) {
  beforeEachValue?.()
  testExecutor();
}

export function beforeEach(before: BeforeEachExecutor) {
  beforeEachValue = before
}
