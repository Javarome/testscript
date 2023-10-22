export class AnsiColor {
  static readonly fgBlack = '30';
  static readonly fgRed = '31';
  static readonly fgGreen = '32';
  static readonly fgWhite = '37';
  static readonly bgRed = '41';
  static readonly bgGreen = '42';
  static readonly reset = '0m';
  static readonly prefix = '\x1b[';

  static str(str: string, foreground: string, background = ''): string {
    return this.prefix + (background ? foreground + ';' + background: foreground) + 'm' + str + this.prefix + this.reset;
  }
}
