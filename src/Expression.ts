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
      throw new TestError(`Got ${this.valueStr(expression)} but expected ${this.valueStr(expected)}`);
    }
  }

  toBe(expected: T) {
    this.check(this.expression == expected, expected);
  }

  toBeUndefined() {
    this.check(this.expression == void 0, 'undefined' as any);
  }

  toBeDefined() {
    this.check(this.expression !== void 0, 'defined' as any);
  }

  toEqual(expected: T) {
    let expectedExpr = JSON.stringify(expected);
    let valueExp = JSON.stringify(this.expression);
    this.check(valueExp == expectedExpr, expected as any, this.expression as any);
  }

  protected valueStr(value: T): string {
    let type = typeof value;
    switch (type) {
      case 'undefined':
        return type;
      case 'object':
        return JSON.stringify(value);
      case 'string':
        return `"${value}"`;
      default:
        return value ? value.toString() : 'null';
    }
  }
}

export function expect(result: any): Expression {
  return new Expression(result);
}
