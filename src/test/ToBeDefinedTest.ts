import { expect } from '../Expression';
import { describe } from '../TestSuite';

describe('expect(toBeTested).toBe(expected)', () => {
  expect(undefined).not.toBeDefined()
  expect(1).toBeDefined()
  expect('str').toBeDefined()
  expect([1, 'str']).toBeDefined()
  expect({}).toBeDefined()
  expect('').toBeDefined()
})
