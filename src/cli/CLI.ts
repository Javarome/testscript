export class CLI {
  /**
   * Set up a CLI args parser.
   *
   * @param argv The args array.
   * @param prefix The prefix to detect args ("-" by default)
   */
  constructor(protected argv: string[] = process.argv, protected prefix = '--') {
  }

  /**
   * @return {Record} A record of args values for each "-arg" key.
   */
  getArgs<T = Record<string, string>>(): T {
    const argv = this.argv
    const args: T = {} as T
    for (let i = 2; i < argv.length; i++) {
      const param = this.getParam(i)
      if (param) {
        const values= []
        do {
          i++;
          values.push(argv[i])
        } while (i < argv.length -1 && !this.getParam(i + 1))
        (args as any)[param] = values
      }
    }
    return args
  }

  protected getParam(i: number): string | undefined {
    const arg = this.argv[i];
    if (arg) {
      const dash = arg.lastIndexOf(this.prefix);
      return dash >= 0 ? arg.substring(dash + this.prefix.length) : undefined;
    }
  }
}
