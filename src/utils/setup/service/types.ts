import { BlazeContext } from '../../../internal';
import { BlazeRouter } from '../../../router/BlazeRouter';
import { BlazeActionHandler } from '../../../types/handler';
import { Middleware } from '../../../types/rest';
import { BlazeService } from '../../../types/service';

export interface CreateServiceOption {
  sourcePath: string;
  servicePath: string;
  blazeCtx: BlazeContext;
  app: BlazeRouter;
  middlewares: Middleware[];
}

export interface BlazeServiceOption
  extends Omit<CreateServiceOption, 'sourcePath'> {
  service: BlazeService;
}

export interface BlazeEventActionHandler {
  name: string;
  handler(...values: unknown[]): ReturnType<BlazeActionHandler>;
}
