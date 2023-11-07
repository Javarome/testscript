import { TestRunner } from '../TestRunner';
import { TestError } from '../TestError';
import { AnsiColor } from '../AnsiColor';

const runner = new TestRunner();
runner.run().then(result => {
  const successCount = runner.successCount(result);
  const total = result.suites.length;
  const totalTime = AnsiColor.str(`(${runner.durationStr(result.duration)})`, AnsiColor.fgWhite);
  const success = runner.allSucceeded(result);
  if (success) {
    runner.logger.log(AnsiColor.str(`All ${total} test suites succeeded`, AnsiColor.fgGreen), totalTime);
  } else {
    const errorSummary = !success ? ', ' + AnsiColor.str(`${total - successCount} failed`, AnsiColor.fgRed) : '';
    runner.logger.log(`${successCount}/${total} test suites succeeded` + errorSummary, totalTime);
  }
  if (!success) {
    throw new TestError('Tests run failed');
  }
});