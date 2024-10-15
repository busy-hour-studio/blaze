import type { Context as HonoCtx } from 'hono';
import { BlazeError } from '../../errors/BlazeError';
import { Logger } from '../../errors/Logger';
import { ValidationError } from '../../errors/ValidationError';
import { BlazeContext } from '../../internal';
import type { Action } from '../../types/action';
import type { Method, RestHandlerOption, StatusCode } from '../../types/rest';
import type { OpenAPIRequest } from '../../types/router';
import type { Service } from '../../types/service';
import { resolvePromise } from '../common';
import { REST_METHOD } from '../constant/rest';
import { eventHandler } from '../helper/handler';
import { extractRestParams, handleRest } from '../helper/rest';

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

    const middlewares = [...options.middlewares, ...(action.middlewares ?? [])];

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
      tags,
    });
  }

  public async restHandler(honoCtx: HonoCtx) {
    const [ctx, error] = await resolvePromise(
      BlazeContext.create({
        honoCtx,
        // NULL => automatically use honoCtx value instead
        body: null,
        headers: null,
        params: null,
        query: null,
        validator: this.action.validator ?? null,
        meta: this.action.meta ?? null,
      })
    );

    if (error || !ctx) {
      if (error instanceof ValidationError && this.action.onRestError) {
        return handleRest({
          ctx: error.ctx,
          honoCtx,
          promise: this.action.onRestError(error.ctx, error.errors),
        });
      }

      let status: StatusCode = 500;

      if (error instanceof BlazeError) {
        status = error.status as StatusCode;
      }

      return honoCtx.json(error as Error, status);
    }

    return handleRest({
      ctx,
      honoCtx,
      promise: eventHandler(this.action, ctx),
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
