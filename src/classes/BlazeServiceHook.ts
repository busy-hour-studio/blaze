import { RecordUnknown } from '@/types/helper';
import { AfterHookHandler, BeforeHookHandler } from '@/types/hooks';

export class BlazeServiceHook<
  AfterHook extends true | false,
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Handler extends AfterHook extends true
    ? AfterHookHandler<Meta, Body, Params>
    : BeforeHookHandler<Meta, Body, Params> = AfterHook extends true
    ? AfterHookHandler<Meta, Body, Params>
    : BeforeHookHandler<Meta, Body, Params>,
> {
  private $handler: Handler;

  constructor(options: { handler: Handler; after: AfterHook }) {
    this.$handler = options.handler;
  }

  public get handler() {
    return this.$handler;
  }

  public set handler(value) {
    throw new Error('Cannot set handler for BlazeServiceHook at runtime!');
  }
}
