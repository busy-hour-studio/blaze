import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
// eslint-disable-next-line import/no-cycle
import { BlazeBroker } from '.';
import type {
  ContextConstructorOption,
  CreateContextOption,
} from '../types/context';
import type { RecordString, RecordUnknown } from '../types/helper';
import type { ResponseType, StatusCode } from '../types/rest';
import { getReqBody, getReqQuery } from '../utils/helper/context';
import {
  validateBody,
  validateHeader,
  validateParams,
  validateQuery,
} from '../utils/helper/validator';
import { BlazeBroker as Broker } from './BlazeBroker';

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
  private $params: P | null;
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

  constructor(options: ContextConstructorOption<M, H, P, Q, B>) {
    const { honoCtx, body, params, headers, query, meta } = options;

    this.$honoCtx = honoCtx;
    this.$reqHeaders = headers;
    this.$params = params;
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
      append(key: string, value: string) {
        const current = headers[key];

        if (!headers[key]) {
          headers[key] = value;
          return;
        }

        if (Array.isArray(current)) {
          headers[key] = [...current, ...value];
          return;
        }

        headers[key] = [current, ...value];
      },
      set(key: string, value: string) {
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

  private get params(): P {
    if (this.$params) return this.$params;
    if (!this.$honoCtx) {
      this.$params = {} as P;
    } else {
      this.$params = this.$honoCtx.req.param() as P;
    }

    return this.$params;
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
      params: this.params,
      body: this.getBody.bind(this),
    };
  }

  public static setter<
    M extends RecordUnknown,
    H extends RecordString,
    P extends RecordUnknown,
    Q extends RecordUnknown,
    B extends RecordUnknown,
  >(ctx: BlazeContext<M, H, P, Q, B>) {
    return {
      headers(headers: H) {
        ctx.$reqHeaders = headers;
      },
      params(params: P) {
        ctx.$params = params;
      },
      query(query: Q) {
        ctx.$query = query;
      },
      body(body: B) {
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
    options: CreateContextOption<M, H, P, Q, B, HV, PV, QV, BV>
  ): Promise<BlazeContext<M, H, P, Q, B>> {
    const { honoCtx, validator } = options;

    const ctx = new BlazeContext<M, H, P, Q, B>(options);

    const setter = BlazeContext.setter(ctx);

    if (validator?.header) {
      await validateHeader({
        ctx,
        setter,
        data: options.headers,
        honoCtx,
        schema: validator.header,
      });
    }

    if (validator?.params) {
      await validateParams({
        ctx,
        setter,
        data: options.params,
        honoCtx,
        schema: validator.params,
      });
    }

    if (validator?.query) {
      await validateQuery({
        ctx,
        setter,
        data: options.query,
        honoCtx,
        schema: validator.query,
      });
    }

    if (validator?.body) {
      await validateBody({
        ctx,
        setter,
        data: options.body,
        honoCtx,
        schema: validator.body,
      });
    }

    if (honoCtx && [...honoCtx.res.headers.keys()].length > 0) {
      ctx.$headers = honoCtx.res.headers as never;
    }

    return ctx;
  }
}
