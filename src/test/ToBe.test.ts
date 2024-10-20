import { describe } from "../TestSuite.js"
import { expect } from "../expect/index.js"

interface Obj {
  num: number
}

describe("toBe", () => {
  const obj: Obj = {
    num: 1
  }
  expect(1).toBe(1)
  expect(obj.num).toBe(1)
  expect("str").toBe("str")
  expect("strAxxde").not.toBe("strAbcd")
  expect(2).not.toBe(1)
  expect("").toBe("")
  const n: object | null | undefined = null
  expect(n).toBe(null)
  expect(n).not.toEqual(undefined)
  const u: object | null | undefined = undefined
  expect(u).not.toEqual(null)
})
