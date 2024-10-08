import { beforeEach, describe, test } from '../TestSuite.js';
import { expect } from "../expect/index.js"

describe('beforeEach(() => {})', () => {
  let fixture: any;
  beforeEach(() => {
    fixture = {}
  })

  test('test', () => {
    expect(fixture).toBeDefined()
  })
})
