import { TestError } from './TestError';

export class Expression<T = any> {
  constructor(protected expression: T) {
  }

  toBe(expected: T) {
    if (this.expression != expected) {
      throw new TestError(`Got ${this.expression} but expected ${expected}`);
    }
  }

  toEqual(expected: T) {
    let expectedExpr = JSON.stringify(expected);
    let valueExp = JSON.stringify(this.expression);
    if (valueExp != expectedExpr) {
      throw new TestError(`Got ${expectedExpr} but expected ${valueExp}`);
    }
  }
}

export function expect(result: any): Expression {
  return new Expression(result);
}
