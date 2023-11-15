import {Logger} from "./Logger"

const NOP = () => {
}

const defaultLogLevels = process.env.LOGLEVEL || process.env.LOG_LEVEL|| ["info", "warn", "error"]

export interface LogConsole {
  log(...data: any[]): void

  debug(...data: any[]): void

  warn(...data: any[]): void

  error(...data: any[]): void
}

const defaultConsole = console

export class DefaultLogger implements Logger {

  readonly log
  readonly debug
  readonly warn
  readonly error

  constructor(public name: string, protected console: LogConsole = defaultConsole, protected logLevels = defaultLogLevels) {
    this.log = this.logLevels.includes("info") ? (...data: any[]) => this.console.log(this.name + ":", ...data) : NOP
    this.debug = this.logLevels.includes("debug") ? (...data: any[]) => this.console.debug(this.name + ":",
      ...data) : NOP
    this.warn = this.logLevels.includes("warn") ? (...data: any[]) => this.console.warn(this.name + ":",
      ...data) : NOP
    this.error = this.logLevels.includes("error") ? (...data: any[]) => this.console.error(this.name + ":",
      ...data) : NOP
  }
}
