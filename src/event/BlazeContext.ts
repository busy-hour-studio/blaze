import { type ActionCallResult as Result } from '@/types/action';
import { type CreateContextOption } from '@/types/context';
import { getReqBody } from '@/utils/helper/context';
import { type Context as HonoCtx } from 'hono';
import qs from 'node:querystring';
import { BlazeEvent } from './BlazeEvent';

export class BlazeContext<
  Meta extends Record<string, unknown> = Record<string, unknown>,
  Body extends Record<string, unknown> = Record<string, unknown>,
  Params extends Record<string, unknown> = Record<string, unknown>,
> {
  private $honoCtx: HonoCtx<{
    Variables: Meta;
  }> | null;
  private $meta: Meta;
  private $headers: Record<string, string | string[]>;
  private $query: qs.ParsedUrlQuery | null;
  private $body: Body | null;
  private $params: Body | Params | null;
  private $reqParams: Params | null;
  private $reqHeaders: Record<string, string> | null;
  private $isRest: boolean;

  constructor(options: CreateContextOption<Body, Params>) {
    const { honoCtx, body, params } = options;

    this.$honoCtx = honoCtx ?? null;
    this.$meta = {} as Meta;
    this.$headers = {};
    this.$reqHeaders = null;
    this.$reqParams = params;
    this.$params = null;
    this.$query = null;
    this.$body = body;
    this.$isRest = !!options.honoCtx;
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
      get: this.getMeta,
      set: this.setMeta,
    };
  }

  // eslint-disable-next-line no-use-before-define, @typescript-eslint/no-shadow
  public async call<T, U = T extends Array<infer T> ? Result<T> : Result<T>>(
    ...args: Parameters<(typeof BlazeEvent)['emitAsync']>
  ) {
    return BlazeEvent.emitAsync<T, U>(...args);
  }

  public emit(...args: Parameters<(typeof BlazeEvent)['emit']>) {
    return BlazeEvent.emit(...args);
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

  public get query() {
    if (!this.$honoCtx) return {};

    if (this.$query) return this.$query;

    const url = new URL(this.$honoCtx.req.url).searchParams;

    this.$query = qs.parse(url.toString());

    return this.$query;
  }

  public get params() {
    if (this.$params) return this.$params;

    if (!this.$body && !this.$reqParams) return {};

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

  private get reqHeaders() {
    if (!this.$honoCtx) return {};
    if (this.$reqHeaders) return this.$reqHeaders;

    this.$reqHeaders = this.$honoCtx.req.header();

    return this.$reqHeaders;
  }

  public get request() {
    return {
      headers: this.reqHeaders,
      query: this.query,
      params: this.params,
    };
  }

  public static async create<
    Meta extends Record<string, unknown> = Record<string, unknown>,
    Body extends Record<string, unknown> = Record<string, unknown>,
    Params extends Record<string, unknown> = Record<string, unknown>,
  >(
    options: CreateContextOption<Body, Params>
  ): Promise<BlazeContext<Meta, Body, Params>> {
    const { honoCtx } = options;

    let body: Body | null = null;
    let params: Params | null = null;

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

    const ctx = new BlazeContext<Meta, Body, Params>({
      body,
      params,
      honoCtx,
    });

    return ctx;
  }
}
