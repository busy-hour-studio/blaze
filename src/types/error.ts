import type { Random } from './helper';
import { StatusCode } from './rest';

export interface BlazeErrorOption {
  errors: Random;
  status: StatusCode;
  message: string;
  name?: string | null;
}
