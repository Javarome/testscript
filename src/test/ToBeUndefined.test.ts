import { describe } from '../TestSuite.js';
import { expect } from "../expect/index.js"

describe('ToBeUndefined', () => {
  expect(undefined).toBeUndefined()
  expect(1).not.toBeUndefined()
})
