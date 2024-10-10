import type { ResponseConfig } from '@asteasolutions/zod-to-openapi';

export interface OpenAPIBody {
  required?: boolean;
  description?: string;
  type:
    | 'application/json'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded';
}

export interface BlazeActionOpenAPI {
  responses?: Record<number, ResponseConfig> | null;
  body?: OpenAPIBody | null;
}
