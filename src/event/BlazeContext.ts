import { BlazeError } from '@/errors/BlazeError';
import type {
  ContextConstructorOption,
  CreateContextOption,
} from '@/types/context';
import type {
  ContextValidation,
  RecordString,
  RecordUnknown,
  ValidationResult,
} from '@/types/helper';
import { getReqBody } from '@/utils/helper/context';
import { validateInput } from '@/utils/helper/validator';
import type { Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import type { ZodObject, ZodRawShape } from 'zod';
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
  private $reqHeaders: Headers;
  private $isRest: boolean;
  private $broker: BlazeBroker;
  private $validations: ValidationResult | null;

  constructor(options: ContextConstructorOption<Body, Params, Headers>) {
    const { honoCtx, body, params, headers, validations } = options;

    this.$honoCtx = honoCtx;
    this.$meta = {} as Meta;
    this.$headers = {};
    this.$reqHeaders = headers ?? ({} as Headers);
    this.$reqParams = params;
    this.$params = null;
    this.$query = null;
    this.$body = body;
    this.$isRest = !!options.honoCtx;
    this.$validations = validations;
    this.$broker = new BlazeBroker();

    this.call = this.$broker.call.bind(this.$broker);
    this.mcall = this.$broker.mcall.bind(this.$broker);
    this.emit = this.$broker.emit.bind(this.$broker);
    this.event = this.$broker.event.bind(this.$broker);
  }

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

  public get broker() {
    return this.$broker;
  }

  // Aliases
  public call = this.broker?.call;
  public mcall = this.broker?.mcall;
  public emit = this.broker?.emit;
  public event = this.broker?.event;

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

  public get query() {
    if (!this.$honoCtx) return {};

    if (this.$query) return this.$query;

    const url = new URL(this.$honoCtx.req.url).searchParams;

    this.$query = qs.parse(url.toString());

    return this.$query;
  }

  public get params() {
    if (this.$params) return this.$params;

    const body = this.$body ?? ({} as Body);
    const param = this.$reqParams ?? ({} as Params);

    this.$params = {
      ...body,
      ...param,
    };

    return this.$params;
  }

  public get isRest() {
    return this.$isRest;
  }

  public get request() {
    return {
      headers: this.$reqHeaders,
      query: this.query,
      params: this.$reqParams,
      body: this.$body,
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

    let body: Body | null = null;
    let params: Params | null = null;
    let headers: Headers | null = null;
    const validations: ValidationResult = {
      body: true,
      params: true,
      header: true,
    };

    if (options.body) {
      body = options.body;
    } else if (honoCtx) {
      body = await getReqBody(honoCtx);
    }

    if (options.params) {
      params = options.params;
    } else if (honoCtx) {
      params = honoCtx.req.param() as Params;
    }

    if (options.headers) {
      headers = options.headers;
    } else if (honoCtx) {
      headers = honoCtx.req.header() as Headers;
    }

    if (validator?.body) {
      const result = validateInput(body, validator.body);
      validations.body = result.success;

      if (result.success) body = result.data as Body;
      else if (!result.success && throwOnValidationError)
        throw new BlazeError({
          errors: result.error,
          message: 'Invalid body',
          status: 400,
          name: 'Invalid body',
        });
    }

    if (validator?.params) {
      const result = validateInput(params, validator.params);
      validations.params = result.success;

      if (result.success) params = result.data as Params;
      else if (!result.success && throwOnValidationError)
        throw new BlazeError({
          errors: result.error,
          message: 'Invalid params',
          status: 400,
          name: 'Invalid params',
        });
    }

    if (validator?.header) {
      const result = validateInput(headers, validator.header);
      validations.header = result.success;

      if (result.success) headers = result.data as Headers;
      else if (!result.success && throwOnValidationError)
        throw new BlazeError({
          errors: result.error,
          message: 'Invalid header',
          status: 400,
          name: 'Invalid header',
        });
    }

    const ctx = new BlazeContext<Meta, Body, Params, Headers>({
      body,
      params,
      honoCtx,
      headers,
      validations,
    });

    return ctx;
  }
}
