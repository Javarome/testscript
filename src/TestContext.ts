export type ContextType = "root" | "file" | "describe" | "test"

export class TestContext {

  subContexts: TestContext[] = []
  skip = false
  start: number | undefined
  end: number | undefined

  /**
   * The error that may have occurred at this level.
   */
  error: Error | undefined

  /**
   * The error that may have occurred at this level or sublevel(s).
   */
  getError(): Error | undefined {
    return this.error || this.subContexts.find( sub => sub.getError())?.getError()
  }

  /**
   * If this context or sub-context(s) failed with an error.
   */
  hasError(): boolean {
    return Boolean(this.error) || this.subContexts.filter(c => c.hasError()).length > 0
  }

  constructor(readonly name: string, readonly type: ContextType, readonly parent?: TestContext) {
    this.start = performance.now()
  }

  enter(name: string, type: ContextType): TestContext {
    const newContext = new TestContext(name, type, this)
    // console.debug("testscript:", `${this.name}.enter(${name})`)
    this.subContexts.push(newContext)
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
    return this.subContexts.reduce((count, context) => {
      count += context.hasError() ? 0 : 1
      return count
    }, 0)
  }

  allSucceeded(): boolean {
    const successCount = this.successCount()
    const total = this.subContexts.length
    return successCount === total
  }

  get fullName(): string {
    return (this.parent?.name ? (this.parent.fullName + ".") : "") + this.name
  }
}
