export class Logger {
  public static info(...args: unknown[]) {
    console.log(`[LOG]  `, ...args);
  }

  public static error(...args: unknown[]) {
    console.error(`[ERROR]  `, ...args);
  }

  public static warn(...args: unknown[]) {
    console.warn(`[WARN]  `, ...args);
  }

  public static debug(...args: unknown[]) {
    console.debug(`[DEBUG]  `, ...args);
  }
}
