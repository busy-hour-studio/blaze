export const RESPONSE_TYPE = {
  BODY: 'body',
  TEXT: 'text',
  JSON: 'json',
  HTML: 'html',
} as const;

export const REST_METHOD = {
  ALL: 'ALL',
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
  OPTIONS: 'OPTIONS',
  HEAD: 'HEAD',
  USE: 'USE',
} as const;

export const REST_CONTENT_TYPE = {
  JSON: 'application/json',
  TEXT: 'text/plain',
  HTML: 'text/html',
  BODY: 'application/octet-stream',
  FORM: 'application/x-www-form-urlencoded',
  MULTIPART: 'multipart/form-data',
} as const;

export const FORM_CONTENT_TYPE = [
  REST_CONTENT_TYPE.FORM,
  REST_CONTENT_TYPE.MULTIPART,
] as const;
