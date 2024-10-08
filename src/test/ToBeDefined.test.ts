import { describe } from '../TestSuite.js';
import { expect } from "../expect/index.js"

describe('expect(toBeTested).toBeDefined()', () => {
  expect(undefined).not.toBeDefined()
  expect(1).toBeDefined()
  expect('str').toBeDefined()
  expect([1, 'str']).toBeDefined()
  expect({}).toBeDefined()
  expect('').toBeDefined()
})
