import type { MiddlewareHandler } from 'hono';
import type { BlazeRouter } from '../../..';
import type { BlazeAction } from '../../../types/action';
import type { BlazeService } from '../../../types/service';

export interface BlazeServiceRestOption {
  service: BlazeService;
  action: Omit<BlazeAction, 'name'>;
  router: BlazeRouter;
  middlewares: MiddlewareHandler[];
}
