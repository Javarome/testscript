import { describe, test } from '../TestSuite.js';
import { expect } from '../expect/index.js';

describe('skip suite', () => {

  test("skipped test", {skip: true}, () => {
    throw new Error("Should be skipped")
  })

  test("not skipped test", {skip: false}, () => {
    expect(true).toBe(true)
  })
})
