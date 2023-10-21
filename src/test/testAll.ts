import { TestRunner } from '../TestRunner';
import { TestError } from '../TestError';

let runner = new TestRunner();
runner.run().then(result => {
  runner.logger.log('Executed', result.suites.length, 'test suites in', new Intl.NumberFormat().format(result.duration),
    'ms');
  if (!result.success) {
    throw new TestError('Tests run failed')
  }
});
