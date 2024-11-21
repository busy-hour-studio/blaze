import type { Context as HonoCtx, Next } from 'hono';
import { extractRestParams } from '../extractor/rest/index';
import { eventHandler } from '../handler/index';
import { handleRest } from '../handler/rest';
import { BlazeContext } from '../internal/context/index';
import { BlazeError } from '../internal/errors/index';
import { BlazeValidationError } from '../internal/errors/validation';
import { Logger } from '../internal/logger/index';
import type { Action } from '../types/action';
import type { Method, RestHandlerOption, StatusCode } from '../types/rest';
import type { OpenAPIRequest } from '../types/router';
import type { Service } from '../types/service';
import { isEmpty } from '../utils/common';
import { REST_METHOD } from '../utils/constant/rest/index';

export class BlazeServiceRest {
  public readonly path: string;
  public readonly method: Method | null;
  public readonly service: Service | null;
  private action: Action;

  constructor(options: RestHandlerOption) {
    const { router, action, service } = options;

    if (!action.rest) {
      throw Logger.throw('Rest property is required');
    }

    const [method, path] = extractRestParams(action.rest);

    this.path = path;
    this.method = method;
    this.action = action;
    this.service = service;

    const { request, responses } = this.openAPIConfig;

    const serviceMiddlewares = options.middlewares;
    const afterMiddlewares = action.afterMiddlewares ?? [];
    const middlewares = action.middlewares ?? [];

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
      method: method || REST_METHOD.ALL,
      handler: this.restHandler.bind(this),
      path,
      request,
      responses,
      middlewares,
      serviceMiddlewares,
      afterMiddlewares,
      tags,
    });
  }

  public async restHandler(...args: [honoCtx: HonoCtx, next: Next]) {
    const [honoCtx, next] = args;

    try {
      const ctx = await BlazeContext.create({
        honoCtx,
        // NULL => automatically use honoCtx value instead
        body: null,
        headers: null,
        params: null,
        query: null,
        validator: this.action.validator ?? null,
        meta: this.action.meta ?? null,
      });

      const rest = await handleRest({
        ctx,
        honoCtx,
        promise: eventHandler(this.action, ctx),
      });

      if (
        !this.action.afterMiddlewares ||
        isEmpty(this.action.afterMiddlewares) ||
        !rest.ok
      ) {
        return rest.resp;
      }

      return next();
    } catch (err) {
      if (err instanceof BlazeValidationError && this.action.onRestError) {
        const rest = await handleRest({
          ctx: err.ctx,
          honoCtx,
          promise: this.action.onRestError(err.ctx, err.errors),
        });

        return rest.resp;
      }

      const status = err instanceof BlazeError ? err.status : 500;

      return honoCtx.json(err as Error, status as StatusCode);
    }
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
