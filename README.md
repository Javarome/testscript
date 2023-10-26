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
import { TestRunner, TestError } from '@javarome/testscript';

const runner = new TestRunner('**/*.test.ts');
runner.run().then(result => {
  const successCount = runner.successCount(result);
  const total = result.suites.length;
  const totalTime = `(${runner.durationStr(result.duration)})`;
  const success = runner.isSuccess(result);
  if (success) {
    runner.logger.log(`All ${total} test suites succeeded`, totalTime);
  } else {
    const errorSummary = !success ? ', ' + `${total - successCount} failed` : '';
    runner.logger.log(`${successCount}/${total} test suites succeeded` + errorSummary, totalTime);
  }
  if (!success) {
    throw new TestError('Tests run failed');
  }
});
````
will output:
![Test runner failure output](docs/TestRunner-success.png)
And an error will output as:

![Test runner failure output](docs/TestRunner-fail.png)
