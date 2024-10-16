import type { Random } from './helper';
import type { GenericStatusCode } from './rest';

export interface BlazeErrorOption {
  errors: Random;
  status: GenericStatusCode;
  message: string;
  name?: string | null;
}
