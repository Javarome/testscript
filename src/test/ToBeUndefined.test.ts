import { describe } from '../TestSuite.js';
import { expect } from "../expect/index.js"

describe('expect(toBeTested).toBeUndefined()', () => {
  expect(undefined).toBeUndefined()
  expect(1).not.toBeUndefined()
})
