import type { Context as HonoCtx } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import qs from 'node:querystring';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
// eslint-disable-next-line import/no-cycle
import { BlazeBroker } from '.';
import type {
  AnyContext,
  ContextConstructorOption,
  CreateContextOption,
} from '../types/context';
import type {
  ContextData,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from '../types/helper';
import type { ResponseType } from '../types/rest';
import { getReqBody } from '../utils/helper/context';
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
  private $meta: Map<keyof M, M[keyof M]>;
  private $query: Q | null;
  private $body: B | null;
  private $params: (B & P) | null;
  private $reqParams: P | null;
  private $reqHeaders: H | null;
  private $validations: ValidationResult | null;

  public response: ResponseType | null;
  public status: StatusCode | null;
  public readonly headers: Map<string, string | string[]>;
  public readonly isRest: boolean;
  public readonly broker: Broker;

  // Aliases for broker
  public readonly call: Broker['call'];
  public readonly emit: Broker['emit'];
  public readonly event: Broker['event'];

  constructor(options: ContextConstructorOption<M, H, P, Q, B>) {
    const { honoCtx, body, params, headers, query, validations, meta } =
      options;

    this.$honoCtx = honoCtx;
    this.$reqHeaders = headers;
    this.$reqParams = params;
    this.$params = null;
    this.$query = query;
    this.$body = body;

    this.response = null;
    this.status = null;
    this.$meta = meta ? new Map(Object.entries(meta)) : new Map();
    this.headers = new Map();
    this.isRest = !!honoCtx;
    this.$validations = validations;

    this.broker = BlazeBroker;
    this.call = BlazeBroker.call.bind(BlazeBroker);
    this.emit = BlazeBroker.emit.bind(BlazeBroker);
    this.event = BlazeBroker.event.bind(BlazeBroker);
  }

  public get meta() {
    const meta = this.$meta;

    return {
      set<K extends keyof M, V extends M[K]>(key: K, value: V) {
        meta.set(key, value);

        return this;
      },
      get<K extends keyof M, V extends M[K]>(key: K) {
        return meta.get(key) as V;
      },
      values: meta.values.bind(meta),
      forEach: meta.forEach.bind(meta),
      keys: meta.keys.bind(meta),
    };
  }

  public get query() {
    if (this.$query) return this.$query;
    if (!this.$honoCtx) {
      this.$query = {} as Q;
    } else {
      const url = new URL(this.$honoCtx.req.url).searchParams;

      this.$query = qs.parse(url.toString()) as Q;
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

  public async params() {
    if (this.$params) return this.$params;

    const body = (await this.getBody()) ?? ({} as B);
    const param = this.reqParams as P;

    this.$params = {
      ...body,
      ...param,
    };

    return this.$params;
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

  public get validations() {
    return this.$validations;
  }

  public static async create<
    M extends RecordUnknown,
    H extends RecordString,
    P extends RecordUnknown,
    Q extends RecordUnknown,
    B extends RecordUnknown,
    HV extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
    PV extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
    QV extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
    BV extends ZodObject<ZodRawShape> | ZodEffects<ZodObject<ZodRawShape>>,
  >(
    options: CreateContextOption<M, H, P, Q, B, HV, PV, QV, BV>
  ): Promise<BlazeContext<M, H, P, Q, B>> {
    const { honoCtx, validator, throwOnValidationError, meta } = options;

    const cachedCtx: AnyContext | null = honoCtx?.get?.('blaze');
    const isCached = cachedCtx?.meta?.get?.('isCached');

    const data: ContextData<H, P, Q, B> = {
      body: isCached ? await cachedCtx?.request?.body?.() : null,
      params: isCached ? cachedCtx?.request?.params : null,
      headers: isCached ? cachedCtx?.request?.headers : null,
      query: isCached ? cachedCtx?.request?.query : null,
    };

    if (options.body && !data.body) data.body = options.body;
    if (options.params && !data.params) data.params = options.params;
    if (options.headers && !data.headers) data.headers = options.headers;
    if (options.query && !data.query) data.query = options.query;

    const validations: ValidationResult = {
      body: true,
      params: true,
      header: true,
      query: true,
    };

    if (validator?.header) {
      validateHeader({
        data,
        honoCtx,
        schema: validator.header,
        throwOnValidationError,
        validations,
      });
    }

    if (validator?.params) {
      validateParams({
        data,
        honoCtx,
        schema: validator.params,
        throwOnValidationError,
        validations,
      });
    }

    if (validator?.query) {
      validateQuery({
        data,
        honoCtx,
        schema: validator.query,
        throwOnValidationError,
        validations,
      });
    }

    if (validator?.body) {
      await validateBody({
        data,
        honoCtx,
        schema: validator.body,
        throwOnValidationError,
        validations,
      });
    }

    let ctx: BlazeContext<M, H, P, Q, B>;

    if (cachedCtx) {
      ctx = cachedCtx;
      ctx.$body = data.body;
      ctx.$params = null;
      ctx.$reqHeaders = data.headers;
      ctx.$query = data.query;
      ctx.$honoCtx = honoCtx;
      ctx.$meta = meta ? new Map(Object.entries(meta)) : new Map();
      ctx.$validations = validations;
    } else {
      ctx = new BlazeContext({
        body: data.body,
        params: data.params,
        headers: data.headers,
        query: data.query,
        honoCtx,
        meta,
        validations,
      });
    }

    if (honoCtx && cachedCtx) {
      Object.assign(ctx.headers, new Map(honoCtx.res.headers));
    }

    return ctx;
  }
}
