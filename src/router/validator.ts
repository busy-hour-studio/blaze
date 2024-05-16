import { z } from 'zod';
import { BlazeDependency } from '../config';
import { Logger } from '../errors/Logger';
import { Random } from '../types/helper';
import { ExternalModule } from '../utils/constant';

const zodApi = BlazeDependency.modules[ExternalModule.ZodApi];

if (zodApi) {
  zodApi.extendZodWithOpenApi(z);
} else {
  z.ZodType.prototype.openapi = function openapi() {
    Logger.warn(`Please install "${ExternalModule.ZodApi}" to use OpenAPI.`);

    const result = new (this as Random).constructor(this._def);

    return result;
  };
}

export { z };
