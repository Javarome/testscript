import { expect } from '../Expression';
import { describe } from '../TestSuite';

describe('expect(toBeTested).toBe(expected)', () => {
  expect(1).toBe(1)
  expect('str').toBe('str')
  expect('strAxxde').not.toBe('strAbcd')
  expect(2).not.toBe(1)
  expect('').toBe('')
  expect(null).toBe(null)
  expect(undefined).toBe(undefined)
})
