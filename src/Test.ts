type TestExecutor = () => void

export function test(name: string, testExecutor: TestExecutor) {
  testExecutor();
}
