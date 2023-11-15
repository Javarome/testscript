import { beforeEach, describe, test } from '../TestSuite';
import { expect } from '../Expression';

describe('beforeEach(() => {})', () => {
  let fixture: any;
  beforeEach(() => {
    fixture = {}
  })

  test('test', () => {
    expect(fixture).toBeDefined()
  })
})
