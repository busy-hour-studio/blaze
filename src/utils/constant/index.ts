export {
  DependencyModuleMap,
  ExternalModule,
  PossibleRunTime,
} from './config/index';
export * from './rest/index';
export { STATUS_CODE } from './rest/status-code';

export const RESERVED_KEYWORD = {
  SUFFIX: {},
  PREFIX: {
    EVENT: '$events$',
    KILL: '$kill$',
    RESTART: '$restart$',
  },
} as const;
