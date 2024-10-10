export const RESERVED_KEYWORD = {
  SUFFIX: {},
  PREFIX: {
    EVENT: Symbol('$events$'),
    KILL: Symbol('$kill$'),
    RESTART: Symbol('$restart$'),
  },
} as const;
