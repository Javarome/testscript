export class TestContext {

  context: TestContext[] = []
  skip = false
  start: number | undefined
  end: number | undefined
  error: Error | undefined

  constructor(readonly name: string, readonly parent?: TestContext) {
  }

  get fullName(): string {
    return (this.parent?.name ? (this.parent.fullName + ".") : "") + this.name
  }

  enter(name: string): TestContext {
    const newContext = new TestContext(name, this)
    this.context.push(newContext)
    return newContext
  }

  get duration(): number | undefined {
    return this.end && this.start ? this.end - this.start : undefined
  }

  leave(): TestContext | undefined {
    return this.parent
  }
}
