import { z } from 'zod';
import { BlazeDependency } from '../config';
import { Logger } from '../errors/Logger';
import { ExternalModule } from '../utils/constant';

const zodApi = BlazeDependency.modules[ExternalModule.ZodApi];

if (zodApi) {
  zodApi.extendZodWithOpenApi(z);
} else {
  z.ZodType.prototype.openapi = () => {
    Logger.warn(`Please install "${ExternalModule.ZodApi}" to use OpenAPI.`);
  };
}

export { z };
