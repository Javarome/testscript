import { describe } from '../TestSuite';
import { expect } from '../Expression';

describe('expect(toBeTested).toBe(expected)', () => {
  expect(undefined).toBeUndefined()
  expect(1).not.toBeUndefined()
})
