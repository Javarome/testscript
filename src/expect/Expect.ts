import { Execution, ExecutionExpression } from "./ExecutionExpression.js"
import { ValueExpression } from "./ValueExpression.js"

export type Value = boolean | number | string | object | null | undefined

export interface Expect {
  <F extends Execution>(actual: F): ExecutionExpression;

  <B extends Boolean>(actual: B): ValueExpression<B>;
  <V extends Value>(actual: V): ValueExpression<V>;
}

function expectImpl<T>(actual: T): ReturnType<Expect> {
  if (typeof actual === "function") {
    return new ExecutionExpression(actual as Execution) as any
  }
  return new ValueExpression(actual as Value)
}

export const expect: Expect = expectImpl as Expect
