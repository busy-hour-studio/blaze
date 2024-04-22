import { z } from 'zod';
import { BlazeDependency } from '../config';
import { BlazeError } from '../errors/BlazeError';
import { Logger } from '../errors/Logger';
import { ExternalModule } from '../utils/constant';

const zodApi = BlazeDependency.modules[ExternalModule.ZodApi];

if (zodApi) {
  zodApi.extendZodWithOpenApi(z);
} else {
  z.ZodType.prototype.openapi = () => {
    Logger.error(`${ExternalModule.ZodApi} is not installed`);
    throw new BlazeError(`${ExternalModule.ZodApi} is not installed`);
  };
}

export { z };
