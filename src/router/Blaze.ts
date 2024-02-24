import type { Env, Schema } from 'hono';
import fs from 'node:fs';
import { BlazeError } from '../errors/BlazeError';
import type { CreateBlazeOption } from '../types/router';
import type { LoadServicesOption } from '../types/service';
import { loadServices } from '../utils/setup';
import type { BlazeService } from '../utils/setup/service';
import { BaseBlaze } from './BaseBlaze';

export class Blaze<
  E extends Env = Env,
  S extends Schema = NonNullable<unknown>,
  BasePath extends string = '/',
> extends BaseBlaze<E, S, BasePath> {
  public readonly services: BlazeService[] = [];

  constructor(options: CreateBlazeOption = {}) {
    super(options);

    if (options.path) {
      this.load({
        path: options.path,
        autoStart: options.autoStart,
      });
    }
  }

  public start() {
    this.services.forEach((service) => {
      // If the service is already started, skip
      if (service.isStarted) return;

      service.onStarted();
    });
  }

  public async load(options: LoadServicesOption) {
    if (!fs.existsSync(options.path)) {
      throw new BlazeError("Service path doesn't exist");
    }

    const services = await loadServices({
      app: this as never,
      path: options.path,
    });

    this.services.push(...services);

    if (!options.autoStart) return;

    this.start();
  }
}
