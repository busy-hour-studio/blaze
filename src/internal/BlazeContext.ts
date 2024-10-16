import type { Context as HonoCtx } from 'hono';
import type { ZodSchema } from 'zod';
// eslint-disable-next-line import/no-cycle
import { BlazeBroker } from '.';
import type {
  ContextConstructorOption,
  CreateContextOption,
} from '../types/context';
import type { RecordString, RecordUnknown } from '../types/helper';
import type { GenericStatusCode, ResponseType } from '../types/rest';
import { getReqBody, getReqQuery } from '../utils/helper/context';
import { validateAll } from '../utils/helper/validator';
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

  /**
   * Set the typeof of the REST response such as `json`, `body`, `text`, or `html`.
   */
  public response: ResponseType | null;
  /**
   * Set the status code of the REST response, such as `200`, `404`, `500`, etc.
   */
  public status: GenericStatusCode | null;
  private $resHeaders: Record<string, string | string[]> | null;
  /**
   * Flag that indicates whether the context is from a REST request or not.
   */
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
    this.$resHeaders = null;
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
    if (!this.$resHeaders) this.$resHeaders = {};

    const headers = this.$resHeaders;

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

  /**
   * @description Access the request information from the context such as `headers`, `query`, `params`, and `body`.
   */
  public get request() {
    return {
      headers: this.reqHeaders,
      query: this.query,
      params: this.params,
      body: this.getBody.bind(this),
    };
  }

  /**
   * @description Shorthand for `this.request`
   * @description Access the request information from the context such as `headers`, `query`, `params`, and `body`.
   */
  public get req() {
    return this.request;
  }

  /**
   * @description Access the response information from the context such as `headers`, `status`, and `response`.
   * @description It exists for the developer's convenience on handling the response.
   */
  public get res() {
    return {
      headers: this.headers,
      status: this.status,
      response: this.response,
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
    const { honoCtx, validator: $validator } = options;

    const ctx = new BlazeContext<M, H, P, Q, B>(options);

    const setter = BlazeContext.setter(ctx);

    await validateAll({
      ctx,
      input: options,
      validator: $validator,
      honoCtx,
      setter,
    });

    return ctx;
  }
}
