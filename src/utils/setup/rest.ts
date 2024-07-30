import type { Context as HonoCtx } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import { BlazeError } from '../../errors/BlazeError';
import type { Action } from '../../types/action';
import type { Method, Middleware, RestHandlerOption } from '../../types/rest';
import type { OpenAPIRequest } from '../../types/router';
import type { Service } from '../../types/service';
import { createContext, isNil } from '../common';
import { eventHandler } from '../helper/handler';
import {
  extractRestParams,
  handleRestError,
  handleRestResponse,
} from '../helper/rest';

export class BlazeServiceRest {
  public readonly path: string;
  public readonly method: Method | null;
  public readonly service: Service | null;
  private action: Action;

  constructor(options: RestHandlerOption) {
    const { router, action, service } = options;

    if (!action.rest) {
      throw new BlazeError('Rest property is required');
    }

    const [method, path] = extractRestParams(action.rest);

    this.path = path;
    this.method = method;
    this.action = action;
    this.service = service;

    const { request, responses } = this.openAPIConfig;

    const middlewares: Middleware[] = [
      ...options.middlewares,
      ...(action.middlewares ?? []),
    ];

    const tags: string[] = [];

    if (this.service.tags) {
      if (typeof this.service.tags === 'string') {
        tags.push(this.service.tags);
      } else {
        tags.push(...this.service.tags);
      }
    } else if (this.service.name) {
      tags.push(this.service.name);
    }

    router.openapi({
      method: method || 'ALL',
      handler: this.restHandler.bind(this),
      path,
      request,
      responses,
      middlewares,
      tags,
    });
  }

  public async restHandler(honoCtx: HonoCtx) {
    const contextRes = await createContext({
      honoCtx,
      // NULL => automatically use honoCtx value instead
      body: null,
      headers: null,
      params: null,
      query: null,
      validator: this.action.validator ?? null,
      meta: this.action.meta ?? null,
      throwOnValidationError: this.action.throwOnValidationError ?? false,
    });

    if (!contextRes.ok) {
      let status: StatusCode = 500;

      if (contextRes.error instanceof BlazeError) {
        status = contextRes.error.status as StatusCode;
      }

      return honoCtx.json(contextRes.error, status);
    }

    const { result: blazeCtx } = contextRes;

    const restResult = await eventHandler(this.action, blazeCtx);

    if (!restResult.ok) {
      return handleRestError({
        ctx: blazeCtx,
        err: restResult.error,
        honoCtx,
      });
    }

    const { result } = restResult;

    if (isNil(result)) {
      return honoCtx.body(null, 204);
    }

    return handleRestResponse({
      ctx: blazeCtx,
      honoCtx,
      result,
    });
  }

  private get openAPIConfig() {
    if (!this.action.openapi)
      return {
        request: {},
        responses: {},
      };

    const { openapi, validator } = this.action;

    const request: OpenAPIRequest = {};
    const responses = openapi.responses ?? {};

    if (validator?.body && openapi.body) {
      request.body = {
        content: {
          [openapi.body.type]: {
            schema: validator.body,
          },
        },
        description: openapi.body?.description,
        required: openapi.body?.required,
      };
    }

    if (validator?.params) {
      request.params = validator.params;
    }

    if (validator?.query) {
      request.query = validator.query;
    }

    if (validator?.header) {
      request.headers = validator.header;
    }

    return {
      request,
      responses,
    };
  }
}
