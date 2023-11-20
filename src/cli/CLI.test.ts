import { CLI } from './CLI';
import { describe, test } from '../TestSuite';
import { expect } from '../Expression';
import { FilesArgs } from './FilesArgs';

interface SimpleArgs {
  argString: string;
  argBool: boolean;
  argNum: number
}

describe("CLI", () => {

  test("simple args", () => {
    const cli = new CLI([
      "/bin/node", "program.js", "--argString", "Hello", "--argBool", "true", "--argNum", "12"
    ])
    const args = cli.getArgs<SimpleArgs>()
    expect(args.argString).toBe("Hello")
    expect(args.argBool).toBe("true")
    expect(args.argNum).toBe("12")
  })

  test("multiple args", () => {
    let include = ['file1.png', 'file2.lst', 'path/file3.xml'];
    let exclude = ['out/fileOut.png', 'node_modules/x.ts'];
    const cli = new CLI([
      "/bin/node", "program.js", "--include", ...include, "--exclude", ...exclude
    ])
    const args = cli.getArgs<FilesArgs>()
    expect(args.include).toEqual(include)
    expect(args.exclude).toEqual(exclude)
  })
})
