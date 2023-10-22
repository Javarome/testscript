import { TestError } from './TestError';

export class Expression<T = any> {
  protected negated = false;

  constructor(protected value: T) {
  }

  get not(): this {
    this.negated = true;
    return this;
  }

  diffIndex(s1: string, s2: string): number {
    const s1Chars = [...s1].sort();
    const s2Chars = [...s2].sort();
    return s2Chars.findIndex((char, i) => char !== s1Chars[i]) + 1;
  }

  protected check(comparison: boolean, expected: T, value = this.value) {
    const result = this.negated ? !comparison : comparison;
    if (!result) {
      const valueStr = this.valueStr(value);
      const expectedStr = this.valueStr(expected);
      const diffIndex = this.diffIndex(valueStr, expectedStr);
      throw new TestError(`Got ${valueStr} instead of ${expectedStr}, because at pos ${diffIndex} ${this.valueStr(
        valueStr[diffIndex] as any)} is different from ${this.valueStr(expectedStr[diffIndex] as any)}`);
    }
  }

  toBe(expected: T) {
    this.check(this.value == expected, expected);
  }

  toBeUndefined() {
    this.check(this.value == void 0, 'undefined' as any);
  }

  toBeDefined() {
    this.check(this.value !== void 0, 'defined' as any);
  }

  toEqual(expected: T) {
    let expectedExpr = JSON.stringify(expected);
    let valueExp = JSON.stringify(this.value);
    this.check(valueExp == expectedExpr, expected as any, this.value as any);
  }

  valueStr(value: T): string {
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
