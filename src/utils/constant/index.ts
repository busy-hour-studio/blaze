export {
  DependencyModuleMap,
  ExternalModule,
  PossibleRunTime,
} from './config/index.ts';
export * from './rest/index.ts';
export { STATUS_CODE } from './rest/status-code.ts';

export const RESERVED_KEYWORD = {
  SUFFIX: {},
  PREFIX: {
    EVENT: '$events$',
    KILL: '$kill$',
    RESTART: '$restart$',
  },
} as const;
