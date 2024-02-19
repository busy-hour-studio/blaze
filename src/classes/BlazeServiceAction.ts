import { BlazeError } from '@/errors/BlazeError';
import type {
  ActionHandler,
  Action as ActionOption,
  ActionValidation,
} from '@/types/action';
import type { FinalActionType } from '@/types/helper';
import type { ActionHook } from '@/types/hooks';
import type { RestParam } from '@/types/rest';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';

export class BlazeServiceAction<
  Body extends ZodTypeAny = ZodTypeAny,
  Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  ActionType extends FinalActionType<Body, Params> = FinalActionType<
    Body,
    Params
  >,
> {
  private $validations: ActionValidation<Body, Params> | null;
  private $handler: ActionHandler<
    ActionType['Meta'],
    ActionType['Body'],
    ActionType['Params']
  >;
  private $rest?: RestParam | null;
  private $hooks?: ActionHook<
    ActionType['Meta'],
    ActionType['Body'],
    ActionType['Params']
  > | null;

  constructor(options: ActionOption<Body, Params, ActionType>) {
    this.$validations = options.validation ?? null;
    this.$handler = options.handler;
    this.$rest = options.rest ?? null;
    this.$hooks = options.hooks ?? null;
  }

  public get handler() {
    return this.$handler;
  }

  public set handler(value) {
    throw new BlazeError(
      'Cannot set handler for BlazeServiceAction at runtime!'
    );
  }

  public get validations() {
    return this.$validations;
  }

  public set validations(value) {
    throw new BlazeError(
      'Cannot set validations for BlazeServiceAction at runtime!'
    );
  }

  public get rest() {
    return this.$rest;
  }

  public set rest(value) {
    throw new BlazeError(
      'Cannot set rest property for BlazeServiceAction at runtime!'
    );
  }

  public get hooks() {
    return this.$hooks;
  }

  public set hooks(value) {
    throw new BlazeError('Cannot set hooks for BlazeServiceAction at runtime!');
  }
}
