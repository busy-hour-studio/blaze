import { z } from 'zod';
import { BlazeConfig } from '../config';
import { Logger } from '../internal/logger';
import type { Random } from '../types/common';
import { ExternalModule } from '../utils/constant';

const zodApi = BlazeConfig.modules[ExternalModule.ZodApi];

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
