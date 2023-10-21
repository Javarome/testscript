import { TestError } from './TestError';

export class Expression<T = any> {
  protected negated = false;

  constructor(protected expression: T) {
  }

  get not(): this {
    this.negated = true;
    return this;
  }

  protected check(comparison: boolean, expected: T, expression = this.expression) {
    let result = this.negated ? !comparison : comparison;
    if (!result) {
      throw new TestError(`Got ${expression} but expected ${expected}`);
    }
  }

  toBe(expected: T) {
    this.check(this.expression == expected, expected)
  }

  toBeUndefined() {
    this.check(this.expression == void 0, 'undefined' as any)
  }

  toBeDefined() {
    this.check(this.expression !== void 0, 'defined' as any)
  }

  toEqual(expected: T) {
    let expectedExpr = JSON.stringify(expected);
    let valueExp = JSON.stringify(this.expression);
    this.check(valueExp == expectedExpr, expected, this.expression)
  }
}

export function expect(result: any): Expression {
  return new Expression(result);
}
