# testscript

I am fed up of the difficulty to run TypeScript tests in this messy world of Node + common JS + ESM + Babel + Jest + TypeScript. I just want to run TypeScript tests of my TypeScript code, period. 

The alternative here is as follows:

- Run all TS stuff using [`tsx`](https://github.com/esbuild-kit/tsx) as a drop-in replacement for the `node` command. It just works with TypeScript, and it's fast.
- *A test is a TS executable*: you don't need a test runner to run it. 
  If you want to run [`src/test/ToBeTest.ts`](https://github.com/Javarome/testscript/blob/main/src/test/ToBeTest.ts), you just have to [`tsx src/test/ToBeTest.ts`](https://github.com/Javarome/testscript/blob/main/package.json#L20)
- Keep syntax (`describe()`, `test()`, `expect()`...) as similar as possible to the syntax used by [Jest](https://jestjs.io), which is the most popular framework to test JS/TS.
- The only remaining thing you need is a [`TestRunner`](https://github.com/Javarome/testscript/blob/main/src/TestRunner.ts) to execute a bunch of tests given a file pattern. 
  Using it, it's pretty easy to write your main test program like below:
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
```
