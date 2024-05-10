export class Logger {
  public static info(...args: unknown[]) {
    console.log(`\x1b[0m[Blaze - LOG]  `, ...args, '\x1b[0m');
  }

  public static error(...args: unknown[]) {
    console.error(`\x1b[31m[Blaze - ERROR]  `, ...args, '\x1b[0m');
  }

  public static warn(...args: unknown[]) {
    console.warn(`\x1b[33m[Blaze - WARN]  `, ...args, '\x1b[0m');
  }

  public static debug(...args: unknown[]) {
    console.debug(`\x1b[34m[Blaze - DEBUG]  `, ...args, '\x1b[0m');
  }
}
