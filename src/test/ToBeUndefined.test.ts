import { describe } from '../TestSuite';
import { expect } from '../Expression';

describe('expect(toBeTested).toBeUndefined()', () => {
  expect(undefined).toBeUndefined()
  expect(1).not.toBeUndefined()
})
