/* eslint-disable import/no-cycle */
import type { Context as HonoCtx } from 'hono';
import type { RecordString, RecordUnknown } from '../../types/common.ts';
import { BlazeBroker as Broker } from '../broker/index.ts';
import { BlazeBroker } from '../index.ts';

export class BlazeContext<
  M extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
  P extends RecordUnknown = RecordUnknown,
  Q extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
> {
  private $honoCtx: HonoCtx | null;
  private $meta: M | null;
  private $query: Q | null;
  private $body: B | null;
  private $reqParams: P | null;
  private $reqHeaders: H | null;

  private $headers: Record<string, string | string[]> | null;
  public readonly isRest: boolean;
  public readonly broker: Broker;

  // Aliases for broker
  public readonly call: Broker['call'];
  public readonly emit: Broker['emit'];
  public readonly event: Broker['event'];

  constructor() {
    // this.$honoCtx = honoCtx;
    // this.$reqHeaders = headers;
    // this.$reqParams = params;
    // this.$query = query;
    // this.$body = body;

    // this.response = null;
    // this.status = null;
    // this.$meta = meta ? structuredClone(meta) : null;
    // this.$headers = null;
    // this.isRest = !!honoCtx;

    this.broker = BlazeBroker;
    this.call = BlazeBroker.call.bind(BlazeBroker);
    this.emit = BlazeBroker.emit.bind(BlazeBroker);
    this.event = BlazeBroker.event.bind(BlazeBroker);
  }
}
