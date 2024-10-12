import type { BlazeRouter } from '../../../router/BlazeRouter.ts';
import type { BlazeContext } from '../../internal/index.ts';
import type { Middleware } from '../../types/rest.ts';
import type { BlazeService } from '../../types/service.ts';

export interface CreateBlazeServiceOption {
  sourcePath: string;
  servicePath: string;
  blazeCtx: BlazeContext;
  app: BlazeRouter;
  middlewares: Middleware[];
}

export interface BlazeServiceOption
  extends Omit<CreateBlazeServiceOption, 'sourcePath'> {
  service: BlazeService;
}
