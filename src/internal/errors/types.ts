import type { Random } from '../../types/common.ts';
import type { GenericStatusCode } from '../../types/rest';

export interface BlazeErrorOption {
  errors: Random;
  status: GenericStatusCode;
  message: string;
  name?: string | null;
}
