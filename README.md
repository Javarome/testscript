# testscript

I am fed up of the difficulty to run TypeScript tests in this messy world of Node + common JS + ESM + Babel + Jest + TypeScript. I just want to run TypeScript tests of my TypeScript code, period. 

The alternative here is as follows:

- Run all TS stuff using [`tsx`](https://github.com/esbuild-kit/tsx) as a drop-in replacement for the `node` command. It just works with TypeScript, and it's fast.
- *A test is a TS executable*: you don't need a test runner to run a single test file, but just to execute:
  ```
  tsx src/MyTest.ts
  ````
  will throw an Error if the test doesn't pass (this will work with a tsx alternative as well but tsx makes it even easier).
- Keep syntax as similar as possible to the syntax used by [Jest](https://jestjs.io) (`describe()`, `test()`, `expect()`...) , which is the most popular framework to test JS/TS.
```ts
import { describe, expect, test } from '@javarome/testscript';

describe("Some software item", () => {

  test("does something", async () => {
    const item = new SoftwareItem('item1')
    expect(item.name).toBe("item1")
    expect(item.name).not.toBe("item2")
  })
})
```
- The only remaining thing you need is a [`TestRunner`](https://github.com/Javarome/testscript/blob/main/src/TestRunner.ts) to execute a bunch of tests given a file pattern. 
  Using it, it's pretty easy to write your [main test program](https://github.com/Javarome/testscript/blob/main/src/test/testAll.ts) like below:
```ts
import { TestRunner } from '../TestRunner';
import { TestError } from '../TestError';

const runner = new TestRunner('**/*.test.ts');
runner.run().then(result => {
  runner.logger.log('Executed', result.suites.length, 'test suites in', result.duration, 'ms');
  if (!result.success) {
    throw new TestError('Tests run failed')
  }
});
````
will output:
```
testscript: PASS src/test/MyTest.ts 
testscript: PASS src/test/MyTest2.ts 
testscript: Executed 2 test suites in 22.802 ms
```
