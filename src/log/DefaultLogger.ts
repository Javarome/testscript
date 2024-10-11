import {Logger} from "./Logger.js"

const NOP = () => {
}

const env = process.env.LOGLEVEL || process.env.LOG_LEVEL;
const argLevels = env ? env.split(',') : undefined
const defaultLogLevels = argLevels || ["info", "warn", "error"]

export interface LogConsole {
  log(...data: any[]): void

  debug(...data: any[]): void

  warn(...data: any[]): void

  error(...data: any[]): void
}

const defaultConsole = console

export class DefaultLogger implements Logger {

  readonly log
  readonly logPart
  readonly debug
  readonly warn
  readonly error

  constructor(readonly name: string, console: LogConsole = defaultConsole, logLevels = defaultLogLevels, proc: NodeJS.Process = process) {
    const prefix = name + ":"
    this.log = logLevels.includes("info") ? (...data: any[]) => console.log(prefix, ...data) : NOP
    this.logPart = logLevels.includes("info") ? (...data: any[]) => {
      const str = data.join(" ").replaceAll("\n", "\n" + prefix)
      proc.stdout.write(str)
    } : NOP
    this.debug = logLevels.includes("debug") ? (...data: any[]) => console.debug(prefix, ...data) : NOP
    this.warn = logLevels.includes("warn") ? (...data: any[]) => console.warn(prefix, ...data) : NOP
    this.error = logLevels.includes("error") ? (...data: any[]) => console.error(prefix, ...data) : NOP
  }
}
