import { describe } from '../TestSuite';
import { expect } from '../Expression';

describe('expect(toBeTested).toBe(expected)', () => {
  expect(undefined).not.toBeDefined()
  expect(1).not.toBeDefined()
  expect('str').not.toBeDefined()
})
