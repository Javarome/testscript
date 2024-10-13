export type ContextType = "root" | "file" | "describe" | "test"

export class TestContext {

  context: TestContext[] = []
  skip = false
  start: number | undefined
  end: number | undefined
  error: Error | undefined

  hasError(): boolean {
    return Boolean(this.error) || this.context.filter(c => c.hasError()).length > 0
  }

  constructor(readonly name: string, readonly type: ContextType, readonly parent?: TestContext) {
    this.start = performance.now()
  }

  enter(name: string, type: ContextType): TestContext {
    const newContext = new TestContext(name, type, this)
    this.context.push(newContext)
    return newContext
  }

  get duration(): number | undefined {
    return this.end && this.start ? this.end - this.start : undefined
  }

  leave(): TestContext | undefined {
    this.end = performance.now()
    return this.parent
  }

  successCount(): number {
    return this.context.reduce((count, context) => {
      count += context.hasError() ? 0 : 1
      return count
    }, 0)
  }

  allSucceeded(): boolean {
    const successCount = this.successCount()
    const total = this.context.length
    return successCount === total
  }
}
