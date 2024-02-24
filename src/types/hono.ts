import 'hono/router';

declare module 'hono/router' {
  export interface Router<T> {
    routes: [string, string, T][];
  }
}
