import { BlazeError } from '../errors/index';

export class Logger {
  public static info(...args: unknown[]) {
    console.log(`\x1b[0m[Blaze - LOG]\t`, ...args, '\x1b[0m');
  }

  public static error(...args: unknown[]) {
    console.error(`\x1b[31m[Blaze - ERROR]\t`, ...args, '\x1b[0m');
  }

  public static warn(...args: unknown[]) {
    console.warn(`\x1b[33m[Blaze - WARN]\t`, ...args, '\x1b[0m');
  }

  public static debug(...args: unknown[]) {
    console.debug(`\x1b[34m[Blaze - DEBUG]\t`, ...args, '\x1b[0m');
  }

  public static throw(message: string) {
    return new BlazeError(`\x1b[31m[Blaze - ERROR]\t${message}\x1b[0m`, 500);
  }
}
