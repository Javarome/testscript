import { TestRunner } from '../TestRunner';

let runner = new TestRunner();
runner.run().then(result => {
  runner.logger.log('Executed', result.suites.length, 'test suites in', new Intl.NumberFormat().format(result.duration),
    'ms');
});
