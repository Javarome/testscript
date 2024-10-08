import { Expression } from "./Expression.js"
import { TestError } from "../TestError.js"

export type Execution = () => any | (() => Promise<any>);

export class ExecutionExpression extends Expression {

  get not(): ExecutionExpression {
    super.not
    return this
  }

  constructor(protected func: Execution) {
    super()
  }

  toBeUndefined() {
    if (this.func === void 0) {
      throw new TestError(`Got ${this.func} instead of undefined`)
    }
    return true
  }

  toBeDefined() {
    if (this.func !== void 0) {
      throw new TestError(`Got ${this.func} instead of defined`)
    }
    return true
  }

  /**
   * @param expected error instance or error message
   */
  toThrow(expected?: Error | string) {
    let isAsync = this.func.constructor.name === "AsyncFunction"
    if (isAsync) {
      this.func().then((result: any) => {
        if (!this.negated) {
          throw new TestError("Expected to throw " + expected)
        }
      }).catch((thrown: Error) => {
        this.handleThrown(thrown, expected)
      })
    } else
      try {
        this.func()
        if (!this.negated) {
          throw new TestError("Expected to throw " + expected)
        }
      } catch (thrown) {
        this.handleThrown(thrown as Error, expected)
      }
  }

  handleThrown(thrown: Error, expected: Error | string | undefined) {
    if (thrown instanceof TestError) {
      throw thrown
    } else {
      const expectedType = expected ? expected.constructor.name : "Error"
      const isString = expectedType === "String"
      const matchType = !expected || isString ? true : thrown.constructor.name === expectedType
      const checkType = matchType || (this.negated && !matchType)
      const matchMessage = !expected || thrown.message === (isString ? expected : (expected as Error).message)
      const checkMessage = matchMessage || (this.negated && !matchMessage)
      if (!checkType || !checkMessage) {
        throw new TestError("Expected not to throw " + expected)
      }
    }
  }
}
