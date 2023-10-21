import { describe } from '../TestSuite';
import { expect } from '../Expression';

describe('expect(toBeTested).toBe(expected)', () => {
  expect(1).toBe(1)
  expect(2).not.toBe(1)
  expect(undefined).toBe(undefined)
})
