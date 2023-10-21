type TestSuiteExecutor = () => void

export function describe(name: string, suiteExecutor: TestSuiteExecutor) {
  suiteExecutor();
}
