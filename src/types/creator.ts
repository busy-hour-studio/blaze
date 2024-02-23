import type { Action, ActionOpenAPI, ActionValidator } from '@/types/action';
import type { Event } from '@/types/event';
import type { RecordString, RecordUnknown } from '@/types/helper';
import type { ZodObject, ZodRawShape } from 'zod';
import type { AfterHookHandler, BeforeHookHandler } from './hooks';
import type { Service } from './service';

export interface BlazeActionCreator {
  <
    Meta extends RecordUnknown = RecordUnknown,
    Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  >(
    action: Action<Meta, Header, Body, Params>
  ): Action<Meta, Header, Body, Params>;
  validator<
    Header extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Body extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  >(
    validator: ActionValidator<Header, Body, Params>
  ): ActionValidator<Header, Body, Params>;
  openapi(openapi: ActionOpenAPI): ActionOpenAPI;
  hook: {
    after<
      Meta extends RecordUnknown = RecordUnknown,
      Body extends RecordUnknown = RecordUnknown,
      Params extends RecordUnknown = RecordUnknown,
      Header extends RecordString = RecordString,
      Result = never,
    >(
      hook: AfterHookHandler<Meta, Body, Params, Header, Result>
    ): AfterHookHandler<Meta, Body, Params, Header, never>;
    before<
      Meta extends RecordUnknown = RecordUnknown,
      Body extends RecordUnknown = RecordUnknown,
      Params extends RecordUnknown = RecordUnknown,
      Header extends RecordString = RecordString,
    >(
      hook: BeforeHookHandler<Meta, Body, Params, Header>
    ): BeforeHookHandler<Meta, Body, Params, Header>;
  };
}

export interface BlazeEventCreator {
  <
    Meta extends RecordUnknown = RecordUnknown,
    Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
  >(
    event: Event<Meta, Params>
  ): Event<Meta, Params>;
  validator<Params extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>>(
    validator: Params
  ): Params;
}

export interface BlazeServiceCreator {
  (service: Service): Service;
  action: BlazeActionCreator;
  event: BlazeEventCreator;
}
