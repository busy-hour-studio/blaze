import fs from 'node:fs';
import { Logger } from '../../errors/Logger';
import { BlazeContext } from '../../internal';
import type { LoadServiceOption } from '../../types/service';
import { BlazeService } from './service';

/**
 * Load all the services from the given path
 * @deprecated use Blaze.load instead
 */
export async function initializeServices(options: LoadServiceOption) {
  const { app, path: sourcePath } = options;

  if (!fs.existsSync(sourcePath)) {
    throw Logger.throw("Service path doesn't exist");
  }

  const blazeCtx = new BlazeContext({
    body: null,
    params: null,
    headers: null,
    honoCtx: null,
    meta: null,
    query: null,
  });

  const serviceFiles = fs.readdirSync(sourcePath);
  const middlewares = options.middlewares ?? [];
  const pendingServices = await Promise.all(
    serviceFiles.map((servicePath) => {
      const service = BlazeService.create({
        app,
        servicePath,
        blazeCtx,
        sourcePath,
        middlewares,
      });

      return service;
    })
  );

  pendingServices.forEach((service) => service.onStarted());
}
