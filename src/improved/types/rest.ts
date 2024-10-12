import type { MiddlewareHandler } from 'hono';
import type {
  RESPONSE_TYPE,
  REST_METHOD,
  REST_CONTENT_TYPE,
  FORM_CONTENT_TYPE,
} from '../utils/constants/rest/index.ts';
import type { STATUS_CODE } from '../utils/constants/rest/status-code.ts';

export type BlazeRestMethod = (typeof REST_METHOD)[keyof typeof REST_METHOD];

export type ExposedBlazeRestMethod = Exclude<BlazeRestMethod, 'USE'>;

export type Middleware = [BlazeRestMethod, MiddlewareHandler];

export type BlazeRestRoute =
  | `${ExposedBlazeRestMethod} /${string}`
  | `/${string}`;

export interface BlazeRestOption {
  method?: ExposedBlazeRestMethod | null;
  path: string;
}

export type BlazeRestParam = BlazeRestRoute | BlazeRestOption;

export type StatusCode =
  | (typeof STATUS_CODE)[keyof typeof STATUS_CODE]
  | (number & NonNullable<unknown>);

export type ResponseType = (typeof RESPONSE_TYPE)[keyof typeof RESPONSE_TYPE];

export type RestContentType =
  (typeof REST_CONTENT_TYPE)[keyof typeof REST_CONTENT_TYPE];

export type FormContentType =
  (typeof FORM_CONTENT_TYPE)[keyof typeof FORM_CONTENT_TYPE];
