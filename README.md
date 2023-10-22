# testscript

I am fed up of the difficulty to run TypeScript tests in this messy world of Node + common JS + ESM + Babel + Jest + TypeScript. I just want to run TypeScript tests of my TypeScript code, period. 

The alternative here is as follows:

- Run all TS stuff using [`tsx`](https://github.com/esbuild-kit/tsx) as a drop-in replacement for the `node` command. It just works with TypeScript, and it's fast.
- *A test is a TS executable*: you don't need a test runner to run a single test file, but just to execute:
  ```
  tsx src/MyTest.ts
  ````
  will throw an Error if the test doesn't pass (this will work with a tsx alternative as well but tsx makes it even easier).
- Keep syntax as similar as possible to the syntax used by [Jest](https://jestjs.io) (`describe()`, `test()`, `expect()`, `beforeEach()`...) , which is the most popular framework to test JS/TS.
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
testscript: PASS src/test/MyTest.ts (2.46 ms)
testscript: PASS src/test/MyTest2.ts (1.93 ms)
testscript: All 2 test suites succeeded in 4.80 ms
```
And an error will output as:
```
testscript: PASS src/test/MyTest.ts (2.46 ms)
testscript: FAIL src/test/MyTest2.ts Got "stsr" but expected "str"
    at describe (/Users/jerome/perso/testscript/src/TestSuite.ts:8:3)
    at <anonymous> (/Users/jerome/perso/testscript/src/test/MyTest2.ts:4:1)
    at ModuleJob.run (node:internal/modules/esm/module_job:193:25)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:530:24)
    at TestRunner.runSuite (/Users/jerome/perso/testscript/src/TestRunner.ts:58:7)
testscript: 1/2 test suites succeeded, 1 failed (4.50 ms)
```
