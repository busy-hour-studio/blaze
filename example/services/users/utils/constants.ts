import { UserSchema } from './schemas';

// Emulate database by using Map object
export const USER_DB = new Map<string, UserSchema>();
