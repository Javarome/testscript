import { describe } from '../TestSuite.js';
import { expect } from "../expect/index.js"

describe('ToBeNull', () => {
  expect(null).toBeNull()
  expect('').not.toBeNull()
  expect(1).not.toBeNull()
  expect('str').not.toBeNull()
  expect(undefined).not.toBeNull()
})
