export type logMethod = { (message?: any, ...optionalParams: any[]): void; (...data: any[]): void }

export interface Logger {
  readonly name: string

  log: logMethod
  logPart: logMethod
  debug: logMethod
  warn: logMethod
  error: logMethod
}
