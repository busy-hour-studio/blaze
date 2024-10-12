/* eslint-disable import/no-cycle */
import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
import type { RecordString, RecordUnknown } from '../../types/common.ts';
import type { ResponseType, StatusCode } from '../../types/rest.ts';
import { mapToObject } from '../../utils/common/index.ts';
import { getReqBody, getReqQuery } from '../../utils/common/rest.ts';
import {
  validateBody,
  validateHeader,
  validateParams,
  validateQuery,
} from '../../utils/common/validator.ts';
import { BlazeBroker as Broker } from '../broker/index.ts';
import { BlazeBroker } from '../index.ts';
import type { BlazeContextOption, CreateBlazeContextOption } from './types.ts';

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

  public response: ResponseType | null;
  public status: StatusCode | null;
  private $headers: Record<string, string | string[]> | null;
  public readonly isRest: boolean;
  public readonly broker: Broker;

  // Aliases for broker
  public readonly call: Broker['call'];
  public readonly emit: Broker['emit'];
  public readonly event: Broker['event'];

  constructor(options: BlazeContextOption<M, H, P, Q, B>) {
    const { honoCtx, body, params, headers, query, meta } = options;

    this.$honoCtx = honoCtx;
    this.$reqHeaders = headers;
    this.$reqParams = params;
    this.$query = query;
    this.$body = body;

    this.response = null;
    this.status = null;
    this.$meta = meta ? structuredClone(meta) : null;
    this.$headers = null;
    this.isRest = !!honoCtx;

    this.broker = BlazeBroker;
    this.call = BlazeBroker.call.bind(BlazeBroker);
    this.emit = BlazeBroker.emit.bind(BlazeBroker);
    this.event = BlazeBroker.event.bind(BlazeBroker);
  }

  public get meta() {
    if (!this.$meta) this.$meta = {} as M;

    const meta = this.$meta;

    return {
      set<K extends keyof M, V extends M[K]>(key: K, value: V) {
        meta[key] = value;

        return this;
      },
      get<K extends keyof M, V extends M[K]>(key: K) {
        return meta[key] as V;
      },
      entries() {
        return Object.entries(meta);
      },
    };
  }

  public get headers() {
    if (!this.$headers) this.$headers = {};

    const headers = this.$headers;

    return {
      set(key: string, value: string | string[]) {
        headers[key] = value;

        return this;
      },
      get(key: string) {
        return headers[key];
      },
      entries() {
        return Object.entries(headers);
      },
    };
  }

  public get query() {
    if (this.$query) return this.$query;
    if (!this.$honoCtx) {
      this.$query = {} as Q;
    } else {
      this.$query = getReqQuery<Q>(this.$honoCtx);
    }

    return this.$query;
  }

  private get reqParams(): P {
    if (this.$reqParams) return this.$reqParams;
    if (!this.$honoCtx) {
      this.$reqParams = {} as P;
    } else {
      this.$reqParams = this.$honoCtx.req.param() as P;
    }

    return this.$reqParams;
  }

  private get reqHeaders(): H {
    if (this.$reqHeaders) return this.$reqHeaders;
    if (!this.$honoCtx) {
      this.$reqHeaders = {} as H;
    } else {
      this.$reqHeaders = this.$honoCtx.req.header() as H;
    }

    return this.$reqHeaders;
  }

  private async getBody(): Promise<B> {
    if (this.$body) return this.$body;

    if (!this.$honoCtx) {
      this.$body = {} as B;
    } else {
      this.$body = (await getReqBody(this.$honoCtx)) ?? ({} as B);
    }

    return this.$body as B;
  }

  public get request() {
    return {
      headers: this.reqHeaders,
      query: this.query,
      params: this.reqParams,
      body: this.getBody.bind(this),
    };
  }

  public static setter<
    M extends RecordUnknown = RecordUnknown,
    H extends RecordString = RecordString,
    P extends RecordUnknown = RecordUnknown,
    Q extends RecordUnknown = RecordUnknown,
    B extends RecordUnknown = RecordUnknown,
  >(ctx: BlazeContext<M, H, P, Q, B>) {
    return {
      headers: (headers: H) => {
        ctx.$reqHeaders = headers;
      },
      params: (params: P) => {
        ctx.$reqParams = params;
      },
      query: (query: Q) => {
        ctx.$query = query;
      },
      body: (body: B) => {
        ctx.$body = body;
      },
    };
  }

  public static async create<
    M extends RecordUnknown,
    H extends RecordString,
    P extends RecordUnknown,
    Q extends RecordUnknown,
    B extends RecordUnknown,
    HV extends ZodSchema,
    PV extends ZodSchema,
    QV extends ZodSchema,
    BV extends ZodSchema,
  >(
    options: CreateBlazeContextOption<M, H, P, Q, B, HV, PV, QV, BV>
  ): Promise<BlazeContext<M, H, P, Q, B>> {
    const { honoCtx, validator, onError, meta } = options;

    const ctx = new BlazeContext<M, H, P, Q, B>({
      body: null,
      params: null,
      headers: null,
      query: null,
      honoCtx,
      meta,
    });

    const setter = BlazeContext.setter(ctx);

    if (validator?.header) {
      validateHeader({
        ctx,
        setter,
        honoCtx,
        data: options.headers,
        schema: validator.header,
        onError,
      });
    }

    if (validator?.params) {
      validateParams({
        ctx,
        setter,
        honoCtx,
        data: options.params,
        schema: validator.params,
        onError,
      });
    }

    if (validator?.query) {
      validateQuery({
        ctx,
        setter,
        honoCtx,
        data: options.query,
        schema: validator.query,
        onError,
      });
    }

    if (validator?.body) {
      await validateBody({
        ctx,
        setter,
        honoCtx,
        data: options.body,
        schema: validator.body,
        onError,
      });
    }

    if (honoCtx && Object.keys(honoCtx.res.headers).length > 0) {
      ctx.$headers = mapToObject(honoCtx.res.headers as never);
    }

    return ctx;
  }
}
