import type { Context as HonoCtx } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import qs from 'node:querystring';
import type { ZodObject, ZodRawShape } from 'zod';
// eslint-disable-next-line import/no-cycle
import { BlazeBroker } from '.';
import type {
  AnyContext,
  ContextConstructorOption,
  CreateContextOption,
} from '../types/context';
import type {
  ContextData,
  ContextValidation,
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
} from '../utils/helper/validator';
import { BlazeBroker as Broker } from './BlazeBroker';

export class BlazeContext<
  M extends RecordUnknown = RecordUnknown,
  B extends RecordUnknown = RecordUnknown,
  P extends RecordUnknown = RecordUnknown,
  H extends RecordString = RecordString,
> {
  private readonly $honoCtx: HonoCtx | null;
  private readonly $meta: Map<keyof M, M[keyof M]>;
  private $query: qs.ParsedUrlQuery | null;
  private $body: B | null;
  private $params: (B & P) | null;
  private $reqParams: P | null;
  private $reqHeaders: H | null;

  public response: ResponseType | null;
  public status: StatusCode | null;
  public readonly headers: Map<string, string | string[]>;
  public readonly validations: ValidationResult | null;
  public readonly isRest: boolean;
  public readonly broker: Broker;

  // Aliases for broker
  public readonly call: Broker['call'];
  public readonly emit: Broker['emit'];
  public readonly event: Broker['event'];

  constructor(options: ContextConstructorOption<M, B, P, H>) {
    const { honoCtx, body, params, headers, validations, meta } = options;

    this.$honoCtx = honoCtx;
    this.$reqHeaders = headers;
    this.$reqParams = params;
    this.$params = null;
    this.$query = null;
    this.$body = body;

    this.response = null;
    this.status = null;
    this.$meta = meta ? new Map(Object.entries(meta)) : new Map();
    this.headers = new Map();
    this.isRest = !!honoCtx;
    this.validations = validations;

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
      this.$query = {} as qs.ParsedUrlQuery;
    } else {
      const url = new URL(this.$honoCtx.req.url).searchParams;

      this.$query = qs.parse(url.toString());
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

  public static async create<
    M extends RecordUnknown = RecordUnknown,
    B extends RecordUnknown = RecordUnknown,
    P extends RecordUnknown = RecordUnknown,
    H extends RecordString = RecordString,
    BV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    PV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    HV extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Validator extends Partial<ContextValidation<BV, PV, HV>> = Partial<
      ContextValidation<BV, PV, HV>
    >,
  >(
    options: CreateContextOption<M, B, P, H, BV, PV, HV, Validator>
  ): Promise<BlazeContext<M, B, P, H>> {
    const { honoCtx, validator, throwOnValidationError, meta } = options;

    const cachedCtx: AnyContext | null = honoCtx?.get?.('blaze');
    const cachedData = cachedCtx?.meta?.get?.('isCached');

    const data: ContextData<B, P, H> = {
      body: cachedData ? await cachedCtx?.request?.body?.() : null,
      params: cachedData ? cachedCtx?.request?.params : null,
      headers: cachedData ? cachedCtx?.request?.headers : null,
    };

    const validations: ValidationResult = {
      body: true,
      params: true,
      header: true,
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

    if (validator?.body) {
      await validateBody({
        data,
        honoCtx,
        schema: validator.body,
        throwOnValidationError,
        validations,
      });
    }

    const ctx: BlazeContext<M, B, P, H> =
      cachedCtx ??
      new BlazeContext({
        body: data.body,
        params: data.params,
        headers: data.headers,
        honoCtx,
        meta,
        validations,
      });

    if (honoCtx && cachedCtx) {
      Object.assign(ctx.headers, new Map(honoCtx.res.headers));
    }

    return ctx;
  }
}
