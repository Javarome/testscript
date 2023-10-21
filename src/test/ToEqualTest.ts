import { describe } from '../TestSuite';
import { expect } from '../Expression';

describe('expect(toBeTested).toEqual(expected)', () => {
  expect({}).toEqual({})
  expect({a: 'b'}).toEqual({a: 'b'})
  expect(['a', 1]).toEqual(['a', 1])
  expect(['a', 2]).not.toEqual(['a', 1])
})
