import { CLI } from './CLI.js';
import { describe, test } from '../TestSuite.js';
import { FilesArgs } from './FilesArgs.js';
import { expect } from "../expect/index.js"

interface SimpleArgs {
  argString: string[];
  argBool: boolean[];
  argNum: number[]
}

describe("CLI", () => {

  test("simple args", () => {
    const cli = new CLI([
      "/bin/node", "program.js", "--argString", "Hello", "--argBool", "true", "--argNum", "12"
    ])
    const args = cli.getArgs<SimpleArgs>()
    expect(args.argString[0]).toBe("Hello")
    expect(args.argBool[0].toString()).toBe("true")
    expect(args.argNum[0].toString()).toBe("12")
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
