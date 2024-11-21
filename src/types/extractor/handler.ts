import type {
  AnyRootConfig,
  BuildProcedure,
  ProcedureType,
} from '@trpc/server';
import type { Actions, AnyAction } from '../action';
import type { Random } from '../common';
import type { ActionEventCallRequest } from '../external';
import type {
  AnyActionHook,
  AnyAfterHook,
  AnyAfterHookHandler,
} from '../hooks/index';
import type { Service } from '../service';

export type ExtractActionHandler<
  S extends Service,
  A extends keyof S['actions'],
> =
  NonNullable<S['actions']> extends Actions
    ? NonNullable<S['actions']>[A] extends AnyAction
      ? NonNullable<
          NonNullable<NonNullable<S['actions']>[A]>['hooks']
        > extends AnyActionHook
        ? NonNullable<
            NonNullable<
              NonNullable<NonNullable<S['actions']>[A]>['hooks']
            >['after']
          > extends AnyAfterHook
          ? NonNullable<
              NonNullable<
                NonNullable<NonNullable<S['actions']>[A]>['hooks']
              >['after']
            > extends Array<infer U extends AnyAfterHook>
            ? U extends AnyAfterHookHandler
              ? Awaited<ReturnType<U>>
              : Awaited<
                  ReturnType<
                    NonNullable<NonNullable<S['actions']>[A]>['handler']
                  >
                >
            : NonNullable<
                  NonNullable<
                    NonNullable<NonNullable<S['actions']>[A]>['hooks']
                  >['after']
                > extends AnyAfterHookHandler
              ? Awaited<
                  ReturnType<
                    NonNullable<
                      NonNullable<
                        NonNullable<NonNullable<S['actions']>[A]>['hooks']
                      >['after']
                    >
                  >
                >
              : Awaited<
                  ReturnType<
                    NonNullable<NonNullable<S['actions']>[A]>['handler']
                  >
                >
          : Awaited<
              ReturnType<NonNullable<NonNullable<S['actions']>[A]>['handler']>
            >
        : Awaited<
            ReturnType<NonNullable<NonNullable<S['actions']>[A]>['handler']>
          >
      : unknown
    : unknown;

export type ProcedureExtractor<
  P extends ProcedureType,
  CR extends ActionEventCallRequest<Random, Random, Random, Random, Random>,
> = BuildProcedure<
  P,
  {
    _config: AnyRootConfig;
    _ctx_out: Random;
    // eslint-disable-next-line no-use-before-define
    _input_in: Omit<CR, 'result'>;
    // eslint-disable-next-line no-use-before-define
    _input_out: Omit<CR, 'result'>;
    _meta: Random;
    // eslint-disable-next-line no-use-before-define
    _output_in: CR['result'];
    // eslint-disable-next-line no-use-before-define
    _output_out: CR['result'];
  },
  // eslint-disable-next-line no-use-before-define
  CR['result']
>;
