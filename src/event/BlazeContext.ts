import type { CreateContextOption } from '@/types/context';
import { getReqBody } from '@/utils/helper/context';
import type { Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import { BlazeBroker } from './BlazeBroker';

export class BlazeContext<
  Meta extends Record<string, unknown> = Record<string, unknown>,
  Body extends Record<string, unknown> = Record<string, unknown>,
  Params extends Record<string, unknown> = Record<string, unknown>,
  Headers extends Record<string, string> = Record<string, string>,
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

  constructor(options: CreateContextOption<Body, Params, Headers>) {
    const { honoCtx, body, params, headers } = options;

    this.$honoCtx = honoCtx;
    this.$meta = {} as Meta;
    this.$headers = {};
    this.$reqHeaders = headers ?? ({} as Headers);
    this.$reqParams = params;
    this.$params = null;
    this.$query = null;
    this.$body = body;
    this.$isRest = !!options.honoCtx;
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
    Meta extends Record<string, unknown> = Record<string, unknown>,
    Body extends Record<string, unknown> = Record<string, unknown>,
    Params extends Record<string, unknown> = Record<string, unknown>,
    Headers extends Record<string, string> = Record<string, string>,
  >(
    options: CreateContextOption<Body, Params, Headers>
  ): Promise<BlazeContext<Meta, Body, Params, Headers>> {
    const { honoCtx } = options;

    let body: Body | null = null;
    let params: Params | null = null;
    let headers: Headers | null = null;

    if (options.body) {
      body = options.body;
    } else if (honoCtx) {
      body = await getReqBody(honoCtx);
    }

    if (options.params) {
      params = options.params;
    } else if (honoCtx) {
      params = honoCtx.req.param() as never;
    }

    if (options.headers) {
      headers = options.headers;
    } else if (honoCtx) {
      headers = honoCtx.req.header() as never;
    }

    const ctx = new BlazeContext<Meta, Body, Params, Headers>({
      body,
      params,
      honoCtx,
      headers,
    });

    return ctx;
  }
}
