import { BlazeError } from '@/errors/BlazeError';
import type { Action } from '@/types/action';
import type { Method, RestHandlerOption } from '@/types/rest';
import type { OpenAPIRequest } from '@/types/router';
import type { Context as HonoCtx } from 'hono';
import { createContext } from '../common';
import { getStatusCode } from '../helper/context';
import { eventHandler } from '../helper/handler';
import { extractRestParams, handleRestError } from '../helper/rest';

export class BlazeServiceRest {
  public readonly path: string;
  public readonly method: Method | null;
  private action: Action;

  constructor(options: RestHandlerOption) {
    const { router, action } = options;

    if (!action.rest) {
      throw new BlazeError('Rest property is required');
    }

    const [method, path] = extractRestParams(action.rest);

    this.path = path;
    this.method = method;
    this.action = action;

    const { request, responses } = this.openAPIConfig;

    router.openapi({
      method: method || 'ALL',
      handler: this.restHandler.bind(this),
      path,
      request,
      responses,
    });
  }

  private async restHandler(honoCtx: HonoCtx) {
    const contextRes = await createContext({
      honoCtx,
      // NULL => automatically use honoCtx value instead
      body: null,
      headers: null,
      params: null,
      validator: this.action.validator || null,
      throwOnValidationError: this.action.throwOnValidationError ?? false,
    });

    if (!contextRes.ok) {
      let status: number = 500;

      if (contextRes.error instanceof BlazeError) {
        status = contextRes.error.status;
      }

      return honoCtx.json(contextRes.error, {
        status,
      });
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

    if (!result) {
      return honoCtx.body(null, 204);
    }

    const status = getStatusCode(blazeCtx, 200);

    return honoCtx.json(result, {
      status,
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

    if (validator?.header) {
      request.headers = validator.header;
    }

    return {
      request,
      responses,
    };
  }
}
