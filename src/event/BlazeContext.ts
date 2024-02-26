import type { Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import type { ZodObject, ZodRawShape } from 'zod';
import type {
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
import { BlazeBroker } from './BlazeBroker';

export class BlazeContext<
  Meta extends RecordUnknown = RecordUnknown,
  Body extends RecordUnknown = RecordUnknown,
  Params extends RecordUnknown = RecordUnknown,
  Headers extends RecordString = RecordString,
> {
  private $honoCtx: HonoCtx<{
    Variables: Meta;
  }> | null;
  private $meta: Meta;
  private $headers: Record<string, string | string[]>;
  private $query: qs.ParsedUrlQuery | null;
  private $body: Body | null;
  private $params: (Body & Params) | null;
  private $reqParams: Params | null;
  private $reqHeaders: Headers | null;
  private $isRest: boolean;
  private $broker: BlazeBroker;
  private $validations: ValidationResult | null;
  private $response: ResponseType;

  constructor(options: ContextConstructorOption<Body, Params, Headers>) {
    const { honoCtx, body, params, headers, validations } = options;

    this.$honoCtx = honoCtx;
    this.$meta = {} as Meta;
    this.$headers = {};
    this.$reqHeaders = headers;
    this.$reqParams = params;
    this.$params = null;
    this.$query = null;
    this.$body = body;
    this.$isRest = !!options.honoCtx;
    this.$validations = validations;
    this.$broker = new BlazeBroker();
    this.$response = 'json';

    this.call = this.$broker.call.bind(this.$broker);
    this.mcall = this.$broker.mcall.bind(this.$broker);
    this.emit = this.$broker.emit.bind(this.$broker);
    this.event = this.$broker.event.bind(this.$broker);
  }

  public get broker() {
    return this.$broker;
  }

  // Aliases for broker
  public call = this.broker?.call;
  public mcall = this.broker?.mcall;
  public emit = this.broker?.emit;
  public event = this.broker?.event;

  private getMeta(key: keyof Meta): Meta[keyof Meta] {
    const value = this.$meta[key];

    if (!this.$honoCtx) return value;

    const honoValue = this.$honoCtx.get(key);

    if (honoValue !== value) {
      this.$meta[key] = honoValue;
    }

    return this.$meta[key];
  }

  private setMeta(key: keyof Meta, value: Meta[keyof Meta]) {
    this.$meta[key] = value;

    if (!this.$honoCtx) return;

    this.$honoCtx.set(key, value);
  }

  public get meta() {
    return {
      get: this.getMeta.bind(this),
      set: this.setMeta.bind(this),
    };
  }

  private getHeader(): Record<string, string | string[]>;
  private getHeader(key: string): string | string[];
  private getHeader(key?: string) {
    if (key) {
      const value = this.$headers[key];

      return value;
    }

    return this.$headers;
  }

  private setHeader(key: string, value: string, append: boolean = false) {
    if (!append) {
      this.$headers[key] = value;
      return;
    }

    const currentValue = this.$headers[key];
    const isArray = Array.isArray(currentValue);

    if (!isArray) {
      this.$headers[key] = [currentValue, value];
      return;
    }

    currentValue.push(value);
  }

  public get header() {
    return {
      get: this.getHeader.bind(this),
      set: this.setHeader.bind(this),
    };
  }

  public get validations() {
    return this.$validations;
  }

  private getResponse() {
    return this.$response;
  }

  private setResponse(value: ResponseType) {
    this.$response = value;
  }

  public get response() {
    return {
      get: this.getResponse.bind(this),
      set: this.setResponse.bind(this),
    };
  }

  public get isRest() {
    return this.$isRest;
  }

  public get query() {
    if (this.$query) return this.$query;
    if (!this.$honoCtx) return {};

    const url = new URL(this.$honoCtx.req.url).searchParams;

    this.$query = qs.parse(url.toString());

    return this.$query;
  }

  private get reqParams(): Params {
    if (this.$reqParams) return this.$reqParams;
    if (!this.$honoCtx) return {} as Params;

    this.$reqParams = this.$honoCtx.req.param() as Params;

    return this.$reqParams;
  }

  private get reqHeaders(): Headers {
    if (this.$reqHeaders) return this.$reqHeaders;
    if (!this.$honoCtx) return {} as Headers;

    this.$reqHeaders = this.$honoCtx.req.header() as Headers;

    return this.$reqHeaders;
  }

  public async params() {
    if (this.$params) return this.$params;

    const body = (await this.getBody()) ?? ({} as Body);
    const param = this.reqParams as Params;

    this.$params = {
      ...body,
      ...param,
    };

    return this.$params;
  }

  private async getBody(): Promise<Body> {
    if (this.$body) return this.$body;
    if (!this.$honoCtx) return {} as Body;

    this.$body = (await getReqBody(this.$honoCtx)) ?? ({} as Body);

    return this.$body as Body;
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
    Meta extends RecordUnknown = RecordUnknown,
    Body extends RecordUnknown = RecordUnknown,
    Params extends RecordUnknown = RecordUnknown,
    Headers extends RecordString = RecordString,
    BodyValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    ParamsValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    HeaderValidation extends ZodObject<ZodRawShape> = ZodObject<ZodRawShape>,
    Validator extends Partial<
      ContextValidation<BodyValidation, ParamsValidation, HeaderValidation>
    > = Partial<
      ContextValidation<BodyValidation, ParamsValidation, HeaderValidation>
    >,
  >(
    options: CreateContextOption<
      Body,
      Params,
      Headers,
      BodyValidation,
      ParamsValidation,
      HeaderValidation,
      Validator
    >
  ): Promise<BlazeContext<Meta, Body, Params, Headers>> {
    const { honoCtx, validator, throwOnValidationError } = options;
    const data: ContextData<Body, Params, Headers> = {
      body: null,
      params: null,
      headers: null,
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

    const ctx = new BlazeContext<Meta, Body, Params, Headers>({
      body: data.body,
      params: data.params,
      headers: data.headers,
      honoCtx,
      validations,
    });

    return ctx;
  }
}
